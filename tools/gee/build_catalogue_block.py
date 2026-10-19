"""Refresh the generated catalogue block inside the Earth Engine app scripts.

The apps in tools/gee/ embed the catalogue records they display (map metadata,
study names, ground-data notes, covariate rows) between two marker lines, so a
pasted script needs nothing outside Earth Engine. This script rewrites that block
from the canonical CSVs, keeping the apps in step with the site.

Inputs : data/downloads/*.csv, data/catalogue/presentation_crosswalk.csv,
         Comparison/data/derived/profile_dataset_summary.csv
Output : the block between the BEGIN/END GENERATED CATALOGUE markers in each app
Run    : python tools/gee/build_catalogue_block.py   (from the repository root)
"""

import json
import re
import subprocess
from datetime import date
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DL = ROOT / "data" / "downloads"
APPS = [ROOT / "tools" / "gee" / "carbon_data_explorer.js"]
BEGIN, END = "// ==== BEGIN GENERATED CATALOGUE", "// ==== END GENERATED CATALOGUE ===="


def tbl(name):
    return pd.read_csv(DL / f"{name}.csv", dtype=str, keep_default_na=False)


def main():
    xw = pd.read_csv(ROOT / "data" / "catalogue" / "presentation_crosswalk.csv", dtype=str, keep_default_na=False)
    domain = dict(zip(xw.record_id, xw.domain))
    S, G, M, C = tbl("Studies"), tbl("Ground_data"), tbl("Maps"), tbl("Covariates")
    prof = pd.read_csv(ROOT / "Comparison" / "data" / "derived" / "profile_dataset_summary.csv", dtype=str, keep_default_na=False)

    block = {
        "built": date.today().isoformat(),
        "revision": subprocess.run(["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"],
                                   capture_output=True, text=True).stdout.strip() or None,
        "studies": {r.study_id: {"name": r.study_name, "year": r.publication_year, "url": r.paper_url,
                                 "domain": domain.get(r.study_id, "")} for r in S.itertuples()},
        "maps": {r.map_id: {"name": r.product_name, "study": r.study_id, "quantity": r.carbon_pool_or_quantity,
                            "depth": r.depth_support, "units": r.source_units_and_scaling,
                            "uncertainty": r.uncertainty_definition, "grid": r.reported_output_grid_m,
                            "url": r.source_url, "considerations": r.considerations,
                            "domain": domain.get(r.map_id, "")} for r in M.itertuples()},
        "ground": {r.ground_id: {"name": r.resource_name, "measurement": r.carbon_pool_or_measurement,
                                 "coverage": r.geographic_coverage, "count": r.profile_or_site_count,
                                 "depth": r.depth_support, "access": r.access_route, "url": r.source_url,
                                 "licence": r.licence_note, "considerations": r.considerations,
                                 "domain": domain.get(r.ground_id, "")} for r in G.itertuples()},
        "profiles": {r["dataset"]: {k: r[k] for k in ["profiles", "layers", "year_min", "year_max",
                                                      "median_deepest_layer_cm", "share_reaching_30cm",
                                                      "share_reaching_100cm", "depth_datum", "qualifiers"]}
                     for _, r in prof.iterrows()},
        # study, feature, family, native grid (m), temporal window, source, evidence, status
        "covariates": [[r.study_id, r.feature_name, r.family, r.native_grid_m, r.temporal_window,
                        r.source_asset_or_product, r.evidence_level, r.implementation_status]
                       for r in C.itertuples()],
    }
    lines = [f"{BEGIN} (tools/gee/build_catalogue_block.py, {block['built']}) ===="]
    lines.append("var CATALOGUE = {")
    keys = list(block)
    for i, k in enumerate(keys):
        v = block[k]
        comma = "," if i < len(keys) - 1 else ""
        if isinstance(v, dict) and k != "built":
            lines.append(f"  {json.dumps(k)}: {{")
            items = list(v.items())
            for j, (kk, vv) in enumerate(items):
                lines.append(f"    {json.dumps(kk)}: {json.dumps(vv, ensure_ascii=False)}" + ("," if j < len(items) - 1 else ""))
            lines.append("  }" + comma)
        elif isinstance(v, list):
            lines.append(f"  {json.dumps(k)}: [")
            for j, row in enumerate(v):
                lines.append("    " + json.dumps(row, ensure_ascii=False) + ("," if j < len(v) - 1 else ""))
            lines.append("  ]" + comma)
        else:
            lines.append(f"  {json.dumps(k)}: {json.dumps(v)}{comma}")
    lines.append("};")
    lines.append(END)
    new = "\n".join(lines)

    pattern = re.compile(re.escape(BEGIN) + r".*?" + re.escape(END), re.S)
    for app in APPS:
        text = app.read_text()
        if not pattern.search(text):
            raise SystemExit(f"{app.relative_to(ROOT)}: catalogue markers not found")
        app.write_text(pattern.sub(lambda _: new, text))
        print(f"{app.relative_to(ROOT)}: catalogue block refreshed "
              f"({len(block['maps'])} maps, {len(block['covariates'])} covariate rows)")


if __name__ == "__main__":
    main()
