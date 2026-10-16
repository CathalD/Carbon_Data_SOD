"""Write inputs_manifest.csv: every input the analysis refresh reads.

Local prepared profile tables are recorded with row counts and SHA-256 hashes so
a refresh can confirm it uses the same files; Earth Engine assets are recorded
by ID. The site render does not need any of these: it uses Comparison/data/.

Run: python make_inputs_manifest.py   (needs CSOD_LOCAL_DATA, default: the folder containing the repo)
"""

import hashlib
import os
import re
from pathlib import Path

import pandas as pd

HERE = Path(__file__).resolve().parent
LOCAL = Path(os.environ.get("CSOD_LOCAL_DATA", HERE.parents[2]))

LOCAL_FILES = [
    ("wosis_canada_profiles_v2.csv", "WoSIS Canada v2 (ISRIC WoSIS), project preparation"),
    ("wosis_canada_layers_v2.csv", "WoSIS Canada v2 (ISRIC WoSIS), project preparation"),
    ("npdb_canada_profiles_v1.csv", "National Pedon Database (CanSIS), project preparation"),
    ("npdb_canada_layers_v1_upload_fixed.csv", "National Pedon Database (CanSIS), project preparation"),
    ("canpeat_layers_v1.csv", "NRCan Peat Profile Database, project preparation"),
    ("janousek_profiles_v1.csv", "Janousek et al. 2025 coastal cores, project preparation"),
    ("janousek_layers_v1.csv", "Janousek et al. 2025 coastal cores, project preparation"),
    ("riley_profiles_v1.csv", "Riley OGS peat data, project preparation"),
    ("riley_layers_v1.csv", "Riley OGS peat data, project preparation"),
]


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def main():
    rows = []
    for name, source in LOCAL_FILES:
        p = LOCAL / name
        rows.append({"kind": "local prepared table", "input": name, "source": source, "location_setting": "CSOD_LOCAL_DATA",
                     "rows": sum(1 for _ in open(p, encoding="utf-8")) - 1, "sha256": sha256(p)})
    # Earth Engine assets referenced by the analysis scripts (IDs only; read at refresh time).
    common = (HERE / "gee" / "common.py").read_text()
    consts = dict(re.findall(r'^(OURS|GENG) = "([^"]+)"', common, re.M))
    intervals = [(0, 5), (5, 15), (15, 30), (30, 60), (60, 100)]
    ids = set()
    for script in (HERE / "gee").glob("*.py"):
        text = script.read_text()
        ids |= {i for i in re.findall(r'"(projects/[^"{}]+)"', text) if "/" in i.split("projects/")[1]}
        for base, tail in re.findall(r'f"\{(OURS|GENG)\}/([^"]+)"', text):
            if "{prop}_{top}_{bot}_cm" in tail:
                ids |= {f"{consts[base]}/{q}_{t}_{b}_cm" for q in ("SOC", "BD") for t, b in intervals}
            elif "{prop}_mean" in tail:
                ids |= {f"{consts[base]}/{tail.replace('{prop}', q)}" for q in ("soc", "bdod", "ocs", "ocd")}
            else:
                ids.add(f"{consts[base]}/{tail}")
    ids -= set(consts.values())
    for i in sorted(ids):
        rows.append({"kind": "earth engine asset", "input": i, "source": "Earth Engine", "location_setting": "EE_PROJECT (for quota)",
                     "rows": None, "sha256": None})
    out = HERE / "inputs_manifest.csv"
    df = pd.DataFrame(rows)
    df["rows"] = df["rows"].astype("Int64")
    df.to_csv(out, index=False, lineterminator="\n")
    print(f"{out.name}: {len(rows)} inputs")


if __name__ == "__main__":
    main()
