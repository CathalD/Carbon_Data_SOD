"""Build the Carbon State of Data visual summary.

Descriptive inventory only: counts, coverage, depth reach, variable
completeness, scale/depth support and verification status, split into
forest and soils and, within each, field data / covariates / maps.

It does NOT harmonise units or depths, compute stocks, compare map pixels,
deduplicate profiles across compilations, or fit anything.

Inputs
  ../../Carbon State of Data Summary Sheet.xlsx   catalogue (first 10 tabs)
  ../../data/catalogue/*.json                      step-2 QC / depth records
  ../../TODO.md                                    open / closed task counts
  <Carbon_Resources>/*_v1.csv, *_v2.csv            local profile/layer tables
  map_previews.json, outlines.json, thumbs/        from gee_map_previews.py

Outputs
  summary_data.json            everything the page draws
  state_of_data_summary.html   standalone page (data + thumbnails inlined) to open or share
  artifact_page.html           the same page as a fragment for publishing as an Artifact

Run:  ../../../.venv/bin/python build_summary.py
Profile coordinates are rounded to 0.01° (~1 km) for display.
"""

import base64
import json
import re
import subprocess
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
LOCAL = REPO.parent  # Carbon_Resources: where the prepared CSVs live
XLSX = REPO / "Carbon State of Data Summary Sheet.xlsx"
CAT = REPO / "data" / "catalogue"

# ---------------------------------------------------------------- domains
FOREST_STUDIES = {"S_BETTS_2024", "S_SOTHE_FOREST_2022", "S_QIN_2025", "S_SCANFI_V1",
                  "S_MATASCI_2018", "S_LAMPING_2025", "S_GROSS_2022"}
BOTH = {"S_GROSS_2022", "G_GROSS"}  # agroforestry: biomass, deadwood and soil pools
FOREST_GROUND = {"G_NFI", "G_NFI_PHOTO", "G_QUEBEC", "G_CLI", "G_BC_INVENTORY", "G_ENFOR",
                 "G_ABOVE", "G_VSN", "G_CASFRI", "G_GROSS"}
FOREST_MAPS = {"M_FOREST_C", "M_SCANFI_V1", "M_SCANFI_V2", "M_ESA_CCI", "M_SBFI", "M_LAMPING"}


def domains(id_, forest_set):
    if id_ in BOTH:
        return ["forest", "soil"]
    return ["forest"] if id_ in forest_set else ["soil"]


# Broad covariate groups for the study x family matrix. Source families kept in tooltips.
FAMILY_GROUP = {
    "Temporal optical": "Optical time series",
    "Optical": "Optical reflectance", "Reflectance": "Optical reflectance",
    "Biophysical parameters": "Optical reflectance", "Sentinel-2": "Optical reflectance",
    "Remote sensing": "Optical reflectance",
    "Vegetation": "Vegetation indices",
    "Radar": "Radar", "Backscattering": "Radar", "Sentinel-1": "Radar",
    "Structure": "Canopy structure",
    "Climate": "Climate & temperature", "Temperature": "Climate & temperature",
    "Terrain": "Terrain", "Terrain parameters": "Terrain",
    "Dynamic World": "Land cover & ecology", "Ecology": "Land cover & ecology",
    "Classification": "Land cover & ecology", "Environment": "Land cover & ecology",
    "Mask": "Land cover & ecology",
    "Soil": "Soil, geology & sediment", "Geology": "Soil, geology & sediment",
    "Sediment": "Soil, geology & sediment",
    "Surface water": "Water & hydrology", "Hydrology": "Water & hydrology",
    "Geography": "Geography & landscape", "Expert landscape input": "Geography & landscape",
    "Oceanography": "Ocean",
    "Stock correction": "Stock adjustment",
}
GROUP_ORDER = ["Optical time series", "Optical reflectance", "Vegetation indices", "Radar",
               "Canopy structure", "Climate & temperature", "Terrain", "Land cover & ecology",
               "Soil, geology & sediment", "Water & hydrology", "Geography & landscape",
               "Ocean", "Prediction depth", "Stock adjustment"]


# Observations from the sampled preview statistics that bear on open QC items.
# They are prompts to check the source release, not conclusions or corrections.
PREVIEW_FLAGS = {
    "sothe_stock": ("Check before use: The hosted file's identity, depth definition and stored encoding are "
                    "unverified. Value ranges alone cannot verify units; settle this from source metadata."),
    "sothe_stock_unc": ("Check before use: Confirm which statistic this image stores (SD, interval or index) "
                        "before comparing it with the stock image."),
}


def clean(v):
    """JSON-safe scalar."""
    if v is None or isinstance(v, (list, dict)):
        return v
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, (np.floating, float)):
        return None if np.isnan(v) else round(float(v), 4)
    if isinstance(v, (np.bool_,)):
        return bool(v)
    if pd.isna(v):
        return None
    return v


def records(df, cols):
    return [{c: clean(r[c]) for c in cols} for _, r in df[cols].iterrows()]


def truthy(s):
    return s.astype(str).str.strip().str.lower().isin(["true", "1", "yes", "t"])


def year_of(s):
    y = pd.to_numeric(s.astype(str).str.extract(r"((?:18|19|20)\d{2})")[0], errors="coerce")
    return y.where((y >= 1850) & (y <= 2026))


# ---------------------------------------------------------------- catalogue
def catalogue():
    x = pd.ExcelFile(XLSX)
    studies = x.parse("Studies")
    ground = x.parse("Ground_data")
    links = x.parse("Study_ground")
    cov = x.parse("Covariates")
    maps = x.parse("Maps")
    other = x.parse("Other_sources")

    studies["domains"] = studies.study_id.map(lambda i: domains(i, FOREST_STUDIES))
    ground["domains"] = ground.ground_id.map(lambda i: domains(i, FOREST_GROUND))
    maps["domains"] = maps.map_id.map(lambda i: domains(i, FOREST_MAPS))

    cov["group"] = cov.family.map(FAMILY_GROUP).fillna("Other")
    cov.loc[cov.feature_name.astype(str).str.upper() == "DEPTH", "group"] = "Prediction depth"
    cov["domains"] = cov.study_id.map(lambda i: domains(i, FOREST_STUDIES))

    # study x group matrix cells
    cells = []
    for (sid, grp), g in cov.groupby(["study_id", "group"]):
        cells.append({
            "study_id": sid, "group": grp, "n": int(len(g)),
            "families": sorted(set(g.family.astype(str))),
            "evidence": g.evidence_level.value_counts().to_dict(),
            "examples": g.feature_name.astype(str).head(6).tolist(),
        })

    # native covariate grid range vs model/output grid, per study
    scale = []
    for sid, g in cov.groupby("study_id"):
        ng = pd.to_numeric(g.native_grid_m, errors="coerce").dropna()
        og = pd.to_numeric(g.output_grid_m, errors="coerce").dropna()
        scale.append({"study_id": sid,
                      "native_min": clean(ng.min()) if len(ng) else None,
                      "native_max": clean(ng.max()) if len(ng) else None,
                      "native_values": sorted({float(v) for v in ng}),
                      "output": clean(og.mode().iloc[0]) if len(og) else None,
                      "n": int(len(g))})

    return {
        "studies": records(studies, ["study_id", "study_name", "publication_year",
                                     "carbon_pool_or_target", "analysis_level",
                                     "analysis_geography", "output_grid_m",
                                     "reported_location_count", "depth_support",
                                     "validation_design", "paper_url", "domains"]),
        "ground": records(ground, ["ground_id", "resource_name", "carbon_pool_or_measurement",
                                   "geographic_coverage", "profile_or_site_count",
                                   "layer_count", "observation_support", "depth_support",
                                   "access_route", "source_url", "project_profile_asset",
                                   "record_status", "licence_note", "domains"]),
        "links": records(links, ["study_id", "ground_id", "study_role", "evidence_basis"]),
        "maps": records(maps, ["map_id", "product_name", "study_id", "carbon_pool_or_quantity",
                               "geographic_coverage", "reported_output_grid_m",
                               "depth_support", "source_units_and_scaling",
                               "uncertainty_definition", "record_status", "source_url",
                               "domains"]),
        "cov_cells": cells,
        "cov_groups": GROUP_ORDER,
        "cov_scale": scale,
        "cov_evidence": cov.groupby("study_id").evidence_level.value_counts()
                           .unstack(fill_value=0).astype(int).to_dict(orient="index"),
        "other_sources": records(other, ["other_source_id", "resource_name", "category",
                                         "geographic_context", "resource_type",
                                         "spatial_support", "depth_or_pool",
                                         "access_status", "gee_status", "priority",
                                         "source_url"]),
    }


# ---------------------------------------------------------------- soil profiles
def soil_profiles():
    P = {}

    w = pd.read_csv(LOCAL / "wosis_canada_profiles_v2.csv", low_memory=False)
    wl = pd.read_csv(LOCAL / "wosis_canada_layers_v2.csv", low_memory=False)
    P["G_WOSIS"] = dict(
        label="WoSIS Canada", file_profiles="wosis_canada_profiles_v2.csv",
        file_layers="wosis_canada_layers_v2.csv",
        lon=w.longitude, lat=w.latitude, year=year_of(w.date),
        bottom=pd.to_numeric(w.profile_bottom_cm, errors="coerce"),
        country=w.country_name, n_layers=len(wl),
        vars={"Organic C": wl.OrgC.notna().mean(), "Total C": wl.TOTC.notna().mean(),
              "Bulk density": wl.BDOD.notna().mean(),
              "Stock value present": wl.OrgC_stock_kgm2.notna().mean(),
              "Stock computable (dataset flag)": truthy(wl.OrgC_stock_computable).mean()},
        notes=["Stock sums are partial and lack coarse-fragment adjustment.",
               "WoSIS v1 is superseded."])

    n = pd.read_csv(LOCAL / "npdb_canada_profiles_v1.csv", low_memory=False)
    nl = pd.read_csv(LOCAL / "npdb_canada_layers_v1_upload_fixed.csv", low_memory=False)
    P["G_NPDB"] = dict(
        label="National Pedon Database", file_profiles="npdb_canada_profiles_v1.csv",
        file_layers="npdb_canada_layers_v1_upload_fixed.csv",
        lon=n.longitude, lat=n.latitude, year=year_of(n.cal_year),
        bottom=pd.to_numeric(n.profile_bottom_cm, errors="coerce"),
        country=pd.Series(["Canada"] * len(n)), n_layers=len(nl),
        vars={"Organic C": nl.carbon_pct.notna().mean(), "Total C": None,
              "Bulk density": nl.bulk_density.notna().mean(),
              "Stock value present": nl.stock_Mgha.notna().mean(),
              "Stock computable (dataset flag)": truthy(nl.stock_computable).mean()},
        notes=[f"{int(truthy(n.flag_location_conf_poor).sum()):,} profiles flagged for poor location confidence."])

    cl = pd.read_csv(LOCAL / "canpeat_layers_v1.csv", low_memory=False)
    cp = cl.groupby("profile_uid").agg(lon=("longitude", "first"), lat=("latitude", "first"),
                                       year=("Year", "first"),
                                       bottom=("lower_depth", "max")).reset_index()
    bd_flag = cl.BD_MEAS_EST.astype(str).str.strip().str.upper()
    P["G_NRCAN_PEAT"] = dict(
        label="NRCan Peat Profile Database", file_profiles="(grouped from layers)",
        file_layers="canpeat_layers_v1.csv",
        lon=cp.lon, lat=cp.lat, year=year_of(cp.year),
        bottom=pd.to_numeric(cp.bottom, errors="coerce"),
        country=pd.Series(["Canada"] * len(cp)), n_layers=len(cl),
        vars={"Organic C": cl.OrgC.notna().mean(), "Total C": cl.TOTC.notna().mean(),
              "Bulk density": cl.BDOD.notna().mean(),
              "Stock value present": cl.TOTC_Stock.notna().mean(),
              "Stock computable (dataset flag)": None},
        bd_flags=bd_flag.value_counts().to_dict(),
        notes=["Provider flags: 736 measured vs 35,929 estimated organic-C rows (flags omitted from v1).",
               "TOTC_Stock is the provider's SAMP_CARB_MGHA sample carbon mass."])

    j = pd.read_csv(LOCAL / "janousek_profiles_v1.csv", low_memory=False)
    jl = pd.read_csv(LOCAL / "janousek_layers_v1.csv", low_memory=False)
    P["G_JANOUSEK"] = dict(
        label="Janousek coastal cores", file_profiles="janousek_profiles_v1.csv",
        file_layers="janousek_layers_v1.csv",
        lon=j.longitude, lat=j.latitude, year=year_of(j.year),
        bottom=pd.to_numeric(j.total_depth_cm, errors="coerce"),
        country=j.country_name, n_layers=len(jl),
        vars={"Organic C": jl.OrgC_pct.notna().mean(), "Total C": jl.TOTC_pct.notna().mean(),
              "Bulk density": jl.BDOD.notna().mean(),
              "Stock value present": jl.OrgC_Stock_kgm2.notna().mean(),
              "Stock computable (dataset flag)": None},
        notes=["Pacific coast Alaska to Mexico; only part is in Canada.",
               "182 thickness/boundary discrepancies await review."])

    r = pd.read_csv(LOCAL / "riley_profiles_v1.csv", low_memory=False)
    rl = pd.read_csv(LOCAL / "riley_layers_v1.csv", low_memory=False)
    P["G_RILEY"] = dict(
        label="Riley OGS peat", file_profiles="riley_profiles_v1.csv",
        file_layers="riley_layers_v1.csv",
        lon=r.longitude, lat=r.latitude, year=pd.Series([np.nan] * len(r)),
        bottom=pd.to_numeric(r.profile_bottom_cm, errors="coerce"),
        country=pd.Series(["Canada"] * len(r)), n_layers=len(rl),
        vars={"Organic C": rl.organic_carbon_pct.notna().mean(),
              "Total C": rl.total_carbon_pct.notna().mean(),
              "Bulk density": rl.dry_bulk_density_source.notna().mean(),
              "Stock value present": None, "Stock computable (dataset flag)": None},
        notes=["Groups are NTS + peatland + sampling point, not confirmed cores.",
               "Bulk-density units unverified; no sampling dates in the table."])

    outlines = HERE / "outlines.json"
    if outlines.exists():
        from shapely.geometry import shape, Point
        ol = json.loads(outlines.read_text())
        can, usa = shape(ol["canada"]), shape(ol["usa"]).buffer(0.05)
        def where(x, y):
            pt = Point(x, y)
            if can.buffer(0).distance(pt) < 0.05:
                return "Canada (approx.)"
            return "United States (approx.)" if usa.distance(pt) < 0.5 else "Mexico/other (approx.)"
        jlon, jlat = pd.to_numeric(j.longitude, errors="coerce"), pd.to_numeric(j.latitude, errors="coerce")
        P["G_JANOUSEK"]["country"] = pd.Series([where(a, b) for a, b in zip(jlon, jlat)])

    out, points = [], []
    for i, (gid, d) in enumerate(P.items()):
        lon = pd.to_numeric(d["lon"], errors="coerce")
        lat = pd.to_numeric(d["lat"], errors="coerce")
        ok = lon.notna() & lat.notna()
        b = d["bottom"]
        yrs = d["year"].dropna()
        dec = (yrs // 10 * 10).astype(int).value_counts().sort_index()
        country = pd.Series(d["country"]).astype(str).value_counts().to_dict()
        out.append({
            "ground_id": gid, "label": d["label"], "idx": i,
            "file_profiles": d["file_profiles"], "file_layers": d["file_layers"],
            "n_profiles": int(len(lon)), "n_layers": int(d["n_layers"]),
            "n_located": int(ok.sum()),
            "country": country,
            "bottom_median": clean(b.median()), "bottom_p90": clean(b.quantile(0.9)),
            "reach": {f"{t}": clean((b >= t).mean()) for t in (30, 100, 200)},
            "bottom_hist": np.histogram(b.dropna().clip(0, 600), bins=list(range(0, 650, 50)))[0].tolist(),
            "years": {"n": int(len(yrs)), "min": clean(yrs.min()), "max": clean(yrs.max()),
                      "median": clean(yrs.median()),
                      "by_decade": {int(k): int(v) for k, v in dec.items()}},
            "vars": {k: clean(v) for k, v in d["vars"].items()},
            "bd_flags": d.get("bd_flags"),
            "notes": d["notes"],
        })
        pts = pd.DataFrame({"x": lon[ok].round(2), "y": lat[ok].round(2)}).drop_duplicates()
        points += [[float(a), float(c), i] for a, c in zip(pts.x, pts.y)]
    return out, points


# ---------------------------------------------------------------- QC / TODO
def qc():
    """Step-2 QC evidence from the repo (newer than the xlsx Assets tab)."""
    px = json.loads((CAT / "soil_map_qc_pixels_complete_20261015.json").read_text())
    depth = json.loads((CAT / "soil_depth_audit.json").read_text())
    reg = json.loads((CAT / "soil_map_qc_register.json").read_text())
    rows = [dict(zip(reg["headers"], r)) if isinstance(r, list) else r for r in reg["rows"]]
    keep = ["qc_id", "resource_id", "asset_id", "quantity", "source_units",
            "source_conversion_multiplier", "conventional_units", "depth_basis",
            "source_grid", "uncertainty_notes", "source_metadata_status",
            "runtime_status", "public_access_status"]
    summary = px.get("summary") or {}
    return {"register": [{k: r.get(k) for k in keep} for r in rows],
            "pixel_run": {k: summary.get(k) for k in ("qc_version", "planned", "reported",
                                                       "pixel_checks_requested")},
            "pixel_scope": px.get("scope"),
            "depth_audit": depth}


def todo():
    sections, cur = [], None
    for line in (REPO / "TODO.md").read_text().splitlines():
        if line.startswith("## "):
            cur = {"section": line[3:].strip(), "done": 0, "open": 0, "open_items": []}
            sections.append(cur)
        elif cur and re.match(r"^- \[[ x]\]", line):
            if line.startswith("- [x]"):
                cur["done"] += 1
            else:
                cur["open"] += 1
                cur["open_items"].append(re.sub(r"\s+", " ", line[6:]).strip()[:220])
    return sections


def git_head():
    try:
        return subprocess.check_output(["git", "-C", str(REPO), "log", "-1",
                                        "--format=%h %ad", "--date=short"], text=True).strip()
    except Exception:
        return "unknown"


# ---------------------------------------------------------------- assemble
def main():
    data = catalogue()
    data["profiles"], data["points"] = soil_profiles()
    data["qc"] = qc()
    data["todo"] = todo()
    data["repo_head"] = git_head()
    from datetime import datetime, timezone
    data["generated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    previews = json.loads((HERE / "map_previews.json").read_text())
    for p in previews:
        if p["key"] in PREVIEW_FLAGS:
            p["flag"] = PREVIEW_FLAGS[p["key"]]
    data["previews"] = previews
    def rnd(o):
        if isinstance(o, list):
            return [rnd(v) for v in o]
        if isinstance(o, dict):
            return {k: rnd(v) for k, v in o.items()}
        return round(o, 3) if isinstance(o, float) else o
    data["outlines"] = rnd(json.loads((HERE / "outlines.json").read_text()))

    (HERE / "summary_data.json").write_text(json.dumps(data, indent=1, ensure_ascii=False))

    # Inline thumbnails so the HTML is a single shareable file. Palette-quantise
    # a display copy (the originals in thumbs/ are untouched) to keep the page small.
    from io import BytesIO
    from PIL import Image
    page_data = json.loads(json.dumps(data))
    for p in page_data["previews"]:
        f = HERE / p.get("file", "")
        if p.get("file") and f.exists():
            im = Image.open(f).convert("RGBA")
            im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
            buf = BytesIO()
            im.quantize(colors=128, method=Image.Quantize.FASTOCTREE).save(buf, "PNG", optimize=True)
            p["src"] = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    html = (HERE / "template.html").read_text()
    payload = json.dumps(page_data, ensure_ascii=False).replace("</", "<\\/")
    html = html.replace("/*__DATA__*/null", payload)
    # Artifact fragment (the publisher adds the document skeleton) and a
    # standalone document for opening locally or sending as a file.
    (HERE / "artifact_page.html").write_text(html)
    standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                  '<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
                  '</head>\n<body>\n' + html + '\n</body>\n</html>\n')
    (HERE / "state_of_data_summary.html").write_text(standalone)
    print(f"profiles: {sum(p['n_profiles'] for p in data['profiles']):,}  "
          f"points: {len(data['points']):,}  previews: {len(previews)}  "
          f"html: {len(html)/1e6:.2f} MB")


if __name__ == "__main__":
    main()
