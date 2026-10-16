"""Build data/downloads/carbon_catalogue.json from the canonical CSV tables.

The CSVs in data/downloads/ are the single source of catalogue truth: the
website and this JSON are both generated from them. Edit the CSVs (or export
them from the working Google Sheet and validate), then rerun this script.

Run from the repository root:  python scripts/build_catalogue_json.py
"""

import json
import subprocess
from datetime import date
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = ROOT / "data" / "downloads"
OUT = DOWNLOADS / "carbon_catalogue.json"
VERSION = "0.2.0-draft"

# Tables in the public catalogue. Project-only extraction planning tables
# (Extraction_plan, Scale_profiles, Study_stacks) live in archive/covariate-pilot/.
TABLES = ["Studies", "Ground_data", "Study_ground", "Covariates", "Maps", "Assets",
          "Other_sources", "QC_register", "Soil_methods", "Data_dictionary"]
ID_COLUMNS = {"Studies": "study_id", "Ground_data": "ground_id", "Maps": "map_id", "Assets": "asset_record_id",
              "Other_sources": "other_source_id", "QC_register": "qc_id", "Soil_methods": "method_id",
              "Covariates": "covariate_id", "Study_ground": "link_id"}


def records(df):
    return json.loads(df.to_json(orient="records", force_ascii=False))


def main():
    previous = json.loads(OUT.read_text()) if OUT.exists() else {}
    tables = {}
    for name in TABLES:
        df = pd.read_csv(DOWNLOADS / f"{name}.csv", dtype=str, keep_default_na=False).replace({"": None})
        if name == "Data_dictionary" and "sheet" in df.columns:
            df = df[df["sheet"].isin(TABLES)]
        key = ID_COLUMNS.get(name)
        if key and df[key].duplicated().any():
            raise SystemExit(f"{name}: duplicate {key} values {df.loc[df[key].duplicated(), key].tolist()[:5]}")
        tables[name] = records(df)
    try:
        rev = subprocess.check_output(["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"], text=True).strip()
    except Exception:
        rev = None
    out = {
        "version": VERSION,
        "catalogue_date": date.today().isoformat(),
        "source_revision": rev,
        "generated_from": "data/downloads/*.csv",
        "scope": previous.get("scope"),
        "working_sheet_access": previous.get("working_sheet_access"),
        "sharing_evidence": previous.get("sharing_evidence"),
        "analysis_status": "Reader-facing report drafts are in docs/; versioned comparison outputs are in analysis/source_snapshot/.",
        "tables": tables,
    }
    OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
    print(f"{OUT.relative_to(ROOT)}: {len(tables)} tables, " +
          ", ".join(f"{k} {len(v)}" for k, v in tables.items()))


if __name__ == "__main__":
    main()
