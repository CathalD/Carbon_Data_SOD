"""Consistency checks for the catalogue, the comparison outputs and the built site.

Checks only things that can silently break: unique and joinable IDs, required
quantity/depth/unit fields, the JSON matching its CSVs, every comparison pair
having statistics, and every local link or image in the built site resolving.

Run from the repository root after `quarto render`:  python Comparison/analysis/check_build.py
Exits non-zero if any check fails.
"""

import json
import re
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DL = ROOT / "data" / "downloads"
DERIVED = ROOT / "Comparison" / "data" / "derived"
SITE = ROOT / "Comparison" / "_site"
failures = []


def check(ok, message):
    if not ok:
        failures.append(message)


def tbl(name):
    return pd.read_csv(DL / f"{name}.csv", dtype=str, keep_default_na=False)


S, G, L, C, M, A, O, Q = (tbl(n) for n in ["Studies", "Ground_data", "Study_ground", "Covariates", "Maps", "Assets", "Other_sources", "QC_register"])

# 1. unique IDs
for df, key, name in [(S, "study_id", "Studies"), (G, "ground_id", "Ground_data"), (M, "map_id", "Maps"), (A, "asset_record_id", "Assets"),
                      (Q, "qc_id", "QC_register"), (C, "covariate_id", "Covariates"), (O, "other_source_id", "Other_sources"),
                      (L, "link_id", "Study_ground")]:
    dup = df[key][df[key].duplicated()].tolist()
    check(not dup, f"{name}: duplicate {key} {dup[:5]}")

# 2. joinable references
def refs(values, valid, label):
    bad = sorted({v for v in values if v and v not in valid})
    check(not bad, f"{label}: unknown IDs {bad[:5]}")

refs(L.study_id, set(S.study_id), "Study_ground.study_id")
refs(L.ground_id, set(G.ground_id), "Study_ground.ground_id")
refs(M.study_id, set(S.study_id), "Maps.study_id")
refs(C.study_id, set(S.study_id), "Covariates.study_id")
refs(Q.resource_id, set(M.map_id), "QC_register.resource_id")
refs(A.resource_id, set(M.map_id) | set(G.ground_id) | set(O.other_source_id) | set(S.study_id), "Assets.resource_id")

# 3. presentation labels cover every record
xw = pd.read_csv(ROOT / "data" / "catalogue" / "presentation_crosswalk.csv", dtype=str)
missing = (set(S.study_id) | set(G.ground_id) | set(M.map_id) | set(O.other_source_id)) - set(xw.record_id)
check(not missing, f"presentation_crosswalk: missing {sorted(missing)[:5]}")
check(set(xw.domain) <= {"forests", "soils", "both"}, f"presentation_crosswalk: unexpected domains {set(xw.domain)}")

# 4. required fields
for df, cols, name in [(M, ["product_name", "carbon_pool_or_quantity", "depth_support", "source_units_and_scaling"], "Maps"),
                       (G, ["resource_name", "carbon_pool_or_measurement", "geographic_coverage"], "Ground_data")]:
    for c in cols:
        empty = df.loc[df[c].str.strip() == "", df.columns[0]].tolist()
        check(not empty, f"{name}.{c} empty for {empty[:5]}")

# 5. JSON generated from the CSVs
cat = json.loads((DL / "carbon_catalogue.json").read_text())
for name, rows in cat["tables"].items():
    n = len(tbl(name)) if name != "Data_dictionary" else None
    if n is not None:
        check(len(rows) == n, f"carbon_catalogue.json {name}: {len(rows)} rows vs CSV {n}; rerun scripts/build_catalogue_json.py")

# 6. comparison outputs
pairs = json.loads((DERIVED / "pairs.json").read_text())
stats = pd.read_csv(DERIVED / "comparison_statistics.csv")
check(set(p["id"] for p in pairs) == set(stats.id), "comparison_statistics.csv does not cover every pair; rerun R/03")
for p in pairs:
    check(bool(p.get("unit")) and bool(p.get("datum_status")), f"pair {p['id']}: missing unit or datum status")
    check("unverified" not in (p["a_label"] + p["b_label"]).lower(), f"pair {p['id']}: a product is labelled unverified")
for fam in {p["family"] for p in pairs}:
    check((DERIVED / f"pair_samples_{fam}.csv").exists(), f"missing pair_samples_{fam}.csv")

# 7. built site: local links and images resolve
if SITE.exists():
    for page in SITE.rglob("*.html"):
        for ref in re.findall(r'(?:href|src)="([^"#?]+)', page.read_text(errors="ignore")):
            if re.match(r"^(https?:|mailto:|data:|javascript:|//)", ref) or ref.startswith("/"):
                continue
            target = (page.parent / ref).resolve()
            check(target.exists(), f"{page.relative_to(SITE)}: missing {ref}")
else:
    print("note: Comparison/_site not built; site link check skipped")

if failures:
    print(f"{len(failures)} check(s) failed:")
    for f in failures[:40]:
        print(" -", f)
    sys.exit(1)
print("all checks passed")
