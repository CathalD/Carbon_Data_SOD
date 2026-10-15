"""Render preview thumbnails of the catalogued carbon maps from Earth Engine.

Previews are for orientation only. Each panel keeps its native stored values
and gets its own colour stretch (2nd-98th percentile of values sampled at a
coarse scale), so colours are NOT comparable between panels. Nothing is
resampled, rescaled, unit-converted or harmonised for analysis.

Outputs (next to this script):
  thumbs/<key>.png      preview images (EPSG:3978, Canada Atlas Lambert)
  map_previews.json     per-panel metadata: asset, band, stretch, native grid
  outlines.json         simplified Canada / USA outlines (EPSG:4326) for charts

Run:  ../../../.venv/bin/python gee_map_previews.py [--only key1,key2]
"""

import json
import urllib.request
import warnings
from pathlib import Path

import ee

warnings.filterwarnings("ignore")
ee.Initialize(project="northstarlabs")

HERE = Path(__file__).resolve().parent
THUMBS = HERE / "thumbs"
THUMBS.mkdir(exist_ok=True)

OURS = "projects/northstarlabs/assets/carbon_state_of_data/soils/maps"
LSIB = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017")
# Simplified (2 km) outline: the full LSIB boundary makes clip/stats very slow.
CANADA = LSIB.filter(ee.Filter.eq("country_na", "Canada")).geometry().simplify(maxError=2000)
CANADA_FC = ee.FeatureCollection([ee.Feature(CANADA)])
USA = LSIB.filter(ee.Filter.eq("country_na", "United States")).geometry()

# Sequential single-hue ramp (light -> dark), shared by every panel.
PALETTE = ["cde2fb", "9ec5f4", "6da7ec", "3987e5", "256abf", "184f95", "0d366b"]

# key, domain, title, asset, band, documented units note, catalogue map_id, region
PANELS = [
    # Forest maps
    ("forest_carbon", "forest", "McMaster/WWF forest carbon",
     "projects/sat-io/open-datasets/carbon_stocks_ca/fc/fc_250m_version10", "b1",
     "kg C/m² (AGB + BGB + dead plant)", "M_FOREST_C", "canada"),
    ("forest_carbon_unc", "forest", "McMaster/WWF forest carbon uncertainty",
     "projects/sat-io/open-datasets/carbon_stocks_ca/fc/fc_uncertainty_250m_version10", "b1",
     "Uncertainty image; match definition to source release", "M_FOREST_C", "canada"),
    ("scanfi_biomass", "forest", "SCANFI v1.2 aboveground biomass (2020)",
     "projects/gcpm041u-lemur/assets/scanfi_v12/SCANFI_v1_2", "biomass",
     "t/ha biomass (not carbon)", "M_SCANFI_V1", "canada"),
    ("esa_cci_2020", "forest", "ESA CCI Biomass v6 AGB (2020)",
     "projects/sat-io/open-datasets/ESA/ESA_CCI_AGB/CCI_BIOMASS_100m_AGB_2020_V6", "AGB",
     "Mg/ha biomass (not carbon); SD band available", "M_ESA_CCI", "canada"),
    # Forest covariate example
    ("canopy_height_max", "forest_cov", "Canopy height, maximum (Sothe covariate)",
     "projects/sat-io/open-datasets/carbon_stocks_ca/ch/ch_max_height_250m", None,
     "m; mapped from ICESat-2 samples", None, "canada"),
    # Soil maps
    ("sothe_stock", "soil", "Sothe soil carbon stock",
     f"{OURS}/sothe_2022/sc_250m_v20", "b1",
     "Study kg C/m²; 0–1 m is a working assumption", "M_SOTHE_STOCK", "canada"),
    ("sothe_stock_unc", "soil", "Sothe soil carbon stock uncertainty",
     f"{OURS}/sothe_2022/sc_uncertainty_250m_v20", "b1",
     "Uncertainty; definition pending", "M_SOTHE_UNC", "canada"),
    ("soilgrids_ocs", "soil", "SoilGrids 2.0 OC stock, 0–30 cm",
     f"{OURS}/soilgrids_v2/ocs_mean", "ocs_0-30cm_mean",
     "Stored t/ha; ÷10 gives kg/m²", "M_SG_OCS", "canada"),
    ("geng_soc_0_5", "soil", "Geng SOC concentration, 0–5 cm",
     "projects/northstarlabs/assets/canada_carbon_collection/SOC_0_5_cm", "b1",
     "Provider %; import encoding unverified", "M_GENG_SOC", "canada"),
    ("ncscd_100", "soil", "NCSCDv2 SOC stock, 0–100 cm",
     f"{OURS}/ncscdv2/NCSCDv2_Canada_WGS84_SOCC100_0012deg", "b1",
     "Source hg C/m² unless converted on import", "M_NCSCD_100", "canada"),
    ("peatgrids_stock", "soil", "PEATGRIDS peat carbon (full peat column)",
     "projects/sat-io/open-datasets/PEATGRIDS/C_STOCK_MGC_PER_M2", "C_STOCK_MgC_per_m2_MEAN",
     "Mg C/m²; variable modelled depth", "M_PEATGRIDS", "canada"),
    ("li_peat_carbon", "soil", "Li et al. peat carbon, Hudson Bay Lowlands",
     f"{OURS}/li_2025_hbl/McMasterCarbon30mkgm2version1", "b1",
     "Study kg C/m²; variable modelled peat column", "M_LI_C", "li"),
    ("li_peat_depth", "soil", "Li et al. peat depth, Hudson Bay Lowlands",
     f"{OURS}/li_2025_hbl/McMaster_PeatDepth_30m", "b1",
     "Study cm; encoding unverified", "M_LI_DEPTH", "li"),
]


_REGION = None


def canada_region_3978():
    """Canada bounding box in EPSG:3978 coordinates, computed once."""
    global _REGION
    if _REGION is None:
        ring = CANADA.transform("EPSG:3978", 1000).bounds(1000, "EPSG:3978").coordinates().getInfo()[0]
        xs, ys = [c[0] for c in ring], [c[1] for c in ring]
        _REGION = ee.Geometry.Rectangle([min(xs), min(ys), max(xs), max(ys)], "EPSG:3978", False)
    return _REGION


def render(key, title, asset, band, region_kind):
    img = ee.Image(asset)
    img = img.select(band) if band else img.select(0)
    native_scale = img.projection().nominalScale().getInfo()

    if region_kind == "li":
        footprint = img.geometry()
        region = footprint.transform("EPSG:3978", 1000).bounds(1000, "EPSG:3978")
        stats_geom, stats_scale = footprint, 1000
        shown = img
    else:
        region = canada_region_3978()
        stats_geom, stats_scale = CANADA, 5000
        shown = img.clip(CANADA)

    # Sample in Canada Lambert: some native projections (e.g. SoilGrids Homolosine)
    # cannot take the Canada outline. This only affects the colour stretch.
    pct = img.reduceRegion(
        reducer=ee.Reducer.percentile([2, 50, 98]), geometry=stats_geom,
        crs="EPSG:3978", scale=stats_scale, bestEffort=True, maxPixels=1e9,
    ).getInfo()
    vals = list(pct.values())
    names = list(pct.keys())
    p2 = pct[[n for n in names if n.endswith("_p2")][0]]
    p50 = pct[[n for n in names if n.endswith("_p50")][0]]
    p98 = pct[[n for n in names if n.endswith("_p98")][0]]
    if p2 is None or p98 is None or p98 <= p2:
        raise RuntimeError(f"{key}: unusable stretch {vals}")

    # Translucent land underlay so masked/no-data land stays visible in both themes.
    land = ee.Image().byte().paint(CANADA_FC, 1).visualize(palette=["7d847a"], opacity=0.22)
    data = shown.visualize(min=p2, max=p98, palette=PALETTE)
    url = land.blend(data).getThumbURL({
        "region": region, "crs": "EPSG:3978", "dimensions": 720, "format": "png",
    })
    out = THUMBS / f"{key}.png"
    urllib.request.urlretrieve(url, out)
    return {"p2": p2, "p50": p50, "p98": p98, "native_scale_m": native_scale,
            "file": f"thumbs/{key}.png", "stretch_scale_m": stats_scale}


def main(only=None):
    """Render all panels, or only the given keys (merged into the existing JSON)."""
    out_json = HERE / "map_previews.json"
    meta = []
    for key, domain, title, asset, band, units, map_id, region_kind in PANELS:
        if only and key not in only:
            continue
        try:
            r = render(key, title, asset, band, region_kind)
            print(f"ok   {key:20s} p2={r['p2']:.3g} p98={r['p98']:.3g} native≈{r['native_scale_m']:.1f} m")
            meta.append({"key": key, "domain": domain, "title": title, "asset": asset,
                         "band": band or "(first band)", "units_note": units,
                         "map_id": map_id, **r})
        except Exception as e:  # keep going; report the failure in the output
            print(f"FAIL {key}: {e}")
            meta.append({"key": key, "domain": domain, "title": title, "asset": asset,
                         "error": str(e)[:300]})
    if only and out_json.exists():
        merged = {m["key"]: m for m in json.loads(out_json.read_text())}
        merged.update({m["key"]: m for m in meta})
        meta = [merged[k[0]] for k in PANELS if k[0] in merged]
    out_json.write_text(json.dumps(meta, indent=1))
    if only:
        return

    outlines = {
        "canada": CANADA.simplify(maxError=6000).getInfo(),
        "usa": USA.simplify(maxError=12000).getInfo(),
    }
    (HERE / "outlines.json").write_text(json.dumps(outlines))
    print("outlines written")


if __name__ == "__main__":
    import sys
    # Optional: --only key1,key2 to re-render selected panels.
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    main(only)
