"""Per-dataset summary of the prepared soil profile/layer tables.

Writes one row per dataset (counts, coverage, dates, depth reach, variable
availability with measured/estimated qualifiers) so the site can describe the
ground data without reading the raw preparations.

Inputs : prepared CSVs in CSOD_LOCAL_DATA (default: the folder containing the repo)
Output : ../data/derived/profile_dataset_summary.csv
Run    : python profile_summary.py
"""

import os
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
LOCAL = Path(os.environ.get("CSOD_LOCAL_DATA", HERE.parents[2]))
OUT = HERE.parent / "data" / "derived" / "profile_dataset_summary.csv"


def truthy(s):
    return s.astype(str).str.strip().str.lower().isin(["true", "1", "yes", "t"])


def year_of(s):
    y = pd.to_numeric(s.astype(str).str.extract(r"((?:18|19|20)\d{2})")[0], errors="coerce")
    return y.where((y >= 1850) & (y <= 2026))


def main():
    loc = pd.read_csv(HERE.parent / "data" / "derived" / "profile_locations.csv")
    rd = lambda f: pd.read_csv(LOCAL / f, low_memory=False)
    rows = []

    w, wl = rd("wosis_canada_profiles_v2.csv"), rd("wosis_canada_layers_v2.csv")
    rows.append(dict(dataset="WoSIS", profiles=len(w), layers=len(wl), years=year_of(w.date),
                     bottom=pd.to_numeric(w.profile_bottom_cm, errors="coerce"),
                     soc=wl.OrgC.notna().mean(), bd=wl.BDOD.notna().mean(),
                     stock_present=wl.OrgC_stock_kgm2.notna().mean(), stock_computable=truthy(wl.OrgC_stock_computable).mean(),
                     depth_datum="Profile top; organic surface layers flagged (organic_surface)",
                     qualifiers="Concentration observations mostly; stock sums partial, no coarse-fragment adjustment"))
    n, nl = rd("npdb_canada_profiles_v1.csv"), rd("npdb_canada_layers_v1_upload_fixed.csv")
    rows.append(dict(dataset="NPDB", profiles=len(n), layers=len(nl), years=year_of(n.cal_year),
                     bottom=pd.to_numeric(n.profile_bottom_cm, errors="coerce"),
                     soc=nl.carbon_pct.notna().mean(), bd=nl.bulk_density.notna().mean(),
                     stock_present=nl.stock_Mgha.notna().mean(), stock_computable=truthy(nl.stock_computable).mean(),
                     depth_datum="Mineral surface = 0 cm; LFH horizons above 0 cm",
                     qualifiers=f"{int(truthy(n.flag_location_conf_poor).sum()):,} profiles flagged for poor location confidence"))
    cl = rd("canpeat_layers_v1.csv")
    cp = cl.groupby("profile_uid").agg(year=("Year", "first"), bottom=("lower_depth", "max"))
    bdf = cl.BD_MEAS_EST.astype(str).str.strip().str.upper().value_counts()
    rows.append(dict(dataset="NRCan peat", profiles=len(cp), layers=len(cl), years=year_of(cp.year),
                     bottom=pd.to_numeric(cp.bottom, errors="coerce"),
                     soc=cl.OrgC.notna().mean(), bd=cl.BDOD.notna().mean(),
                     stock_present=cl.TOTC_Stock.notna().mean(), stock_computable=np.nan,
                     depth_datum="Peat surface; full sampled column",
                     qualifiers=(f"Bulk density {int(bdf.get('M', 0)):,} measured / {int(bdf.get('E', 0)):,} estimated rows; "
                                 "provider flags 736 measured vs 35,929 estimated organic-C rows (flags omitted from v1)")))
    j, jl = rd("janousek_profiles_v1.csv"), rd("janousek_layers_v1.csv")
    rows.append(dict(dataset="Janousek", profiles=len(j), layers=len(jl), years=year_of(j.year),
                     bottom=pd.to_numeric(j.total_depth_cm, errors="coerce"),
                     soc=jl.OrgC_pct.notna().mean(), bd=jl.BDOD.notna().mean(),
                     stock_present=jl.OrgC_Stock_kgm2.notna().mean(), stock_computable=np.nan,
                     depth_datum="Sediment surface",
                     qualifiers="Pacific coast Alaska to Mexico; repeated source layer IDs flagged; 13 profiles with thickness/boundary mismatches"))
    r, rl = rd("riley_profiles_v1.csv"), rd("riley_layers_v1.csv")
    rows.append(dict(dataset="Riley", profiles=len(r), layers=len(rl), years=pd.Series(dtype=float),
                     bottom=pd.to_numeric(r.profile_bottom_cm, errors="coerce"),
                     soc=rl.organic_carbon_pct.notna().mean(), bd=np.nan,
                     stock_present=np.nan, stock_computable=np.nan,
                     depth_datum="Peat surface",
                     qualifiers="Groups are NTS + peatland + sampling point; bulk-density units unverified (not used); no dates"))

    out = []
    for d in rows:
        L = loc[loc.dataset == d["dataset"]]
        yrs, b = d["years"].dropna(), d["bottom"]
        out.append({
            "dataset": d["dataset"], "profiles": d["profiles"], "layers": d["layers"],
            "located": len(L), "outside_canada_ecozones": int(L.ecozone.isna().sum()),
            "year_min": int(yrs.min()) if len(yrs) else None, "year_max": int(yrs.max()) if len(yrs) else None,
            "profiles_dated": int(len(yrs)),
            "median_deepest_layer_cm": round(float(b.median()), 1),
            "share_reaching_30cm": round(float((b >= 30).mean()), 4), "share_reaching_100cm": round(float((b >= 100).mean()), 4),
            "share_reaching_200cm": round(float((b >= 200).mean()), 4),
            "layers_with_soc": round(float(d["soc"]), 4), "layers_with_bd": None if pd.isna(d["bd"]) else round(float(d["bd"]), 4),
            "layers_with_stock_value": None if pd.isna(d["stock_present"]) else round(float(d["stock_present"]), 4),
            "layers_stock_computable_flag": None if pd.isna(d["stock_computable"]) else round(float(d["stock_computable"]), 4),
            "depth_datum": d["depth_datum"], "qualifiers": d["qualifiers"],
        })
    pd.DataFrame(out).to_csv(OUT, index=False, lineterminator="\n")
    print(pd.DataFrame(out)[["dataset", "profiles", "layers", "outside_canada_ecozones", "year_min", "year_max"]].to_string(index=False))


if __name__ == "__main__":
    main()
