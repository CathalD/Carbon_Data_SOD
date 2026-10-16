"""Read map values at every profile location, at each map's NATIVE grid.

Each profile takes the value of the map pixel that contains it; nothing is
aggregated or interpolated. Values are converted to the common unit for the
quantity with the documented factors in common.py.

Inputs : prepared profile tables in Carbon_Resources/ (parent of the repo)
Outputs: ../../data/derived/profile_locations.csv   (profile_uid, dataset, lon, lat, ecozone)
         ../../data/derived/profile_map_values.csv  (one row per profile, one column per map band)
Run:     ../../../../.venv/bin/python 02_sample_profiles.py
"""

import time
import warnings
from pathlib import Path

import ee
import geopandas as gpd
import pandas as pd

import common
import sampling

warnings.filterwarnings("ignore")
HERE = Path(__file__).resolve().parent
DATA = HERE.parents[1] / "data"
OUT = DATA / "derived"
LOCAL = HERE.parents[3]  # Carbon_Resources
CHUNK = 1000

# Map groups that share one native grid; keys refer to common.products().
GROUPS = {
    "geng": [f"geng_{q}_{t}_{b}" for q in ("soc", "bd") for t, b in common.INTERVALS],
    "soilgrids": [f"sg_{q}_{t}_{b}" for q in ("soc", "bd") for t, b in common.INTERVALS] + ["sg_ocs_0_30"],
    "ncscd": ["ncscd_0_30", "ncscd_0_100"],
    "sothe": ["sothe_0_100"],
    "peatgrids": ["pg_depth", "pg_carbon"],
    "li": ["li_depth", "li_carbon"],
    "soilgrids_derived": ["sg_ocs_0_100_derived"],
}


def profile_locations():
    rows = []
    for ds, f, uid, lon, lat in [
        ("WoSIS", "wosis_canada_profiles_v2.csv", "profile_uid", "longitude", "latitude"),
        ("NPDB", "npdb_canada_profiles_v1.csv", "profile_uid", "longitude", "latitude"),
        ("Janousek", "janousek_profiles_v1.csv", "profile_uid", "longitude", "latitude"),
        ("Riley", "riley_profiles_v1.csv", "profile_uid", "longitude", "latitude"),
    ]:
        d = pd.read_csv(LOCAL / f, low_memory=False)
        rows.append(pd.DataFrame({"profile_uid": d[uid], "dataset": ds, "lon": d[lon], "lat": d[lat]}))
    c = pd.read_csv(LOCAL / "canpeat_layers_v1.csv", low_memory=False)
    c = c.groupby("profile_uid").agg(lon=("longitude", "first"), lat=("latitude", "first")).reset_index()
    rows.append(c.assign(dataset="NRCan peat")[["profile_uid", "dataset", "lon", "lat"]])
    loc = pd.concat(rows, ignore_index=True).dropna(subset=["lon", "lat"])
    ez = gpd.read_file(DATA / "ecozones" / "Ecozones" / "ecozones.shp").to_crs(4326)
    ez["ecozone"] = ez["ZONE_NAME"].str.replace("PLain", "Plain").str.replace("MixedWood", "Mixedwood")
    g = gpd.GeoDataFrame(loc, geometry=gpd.points_from_xy(loc.lon, loc.lat), crs=4326)
    g = gpd.sjoin(g, ez[["ecozone", "geometry"]], predicate="within", how="left").drop(columns=["index_right"])
    g = g[~g.index.duplicated()]
    out = pd.DataFrame(g.drop(columns="geometry"))
    out.insert(0, "pid", range(len(out)))
    return out


def group_image(keys):
    prods = common.products()
    bands = [prods[k][0].multiply(prods[k][1]).rename(k) for k in keys]
    return ee.Image.cat(bands), prods[keys[0]][0].projection()


def sample(img, proj, df, label):
    """Native-grid values at profile points; each band independent (sampling.py)."""
    return sampling.sample_bands(img, df, label, CHUNK)


def main(only=None):
    """Sample all map groups, or only the named groups (merged into the existing table)."""
    loc = profile_locations()
    loc.to_csv(OUT / "profile_locations.csv", index=False)
    print(f"profile locations: {len(loc)}  by dataset: {loc.dataset.value_counts().to_dict()}", flush=True)
    vals = loc[["pid"]].copy()
    prev = OUT / "profile_map_values.csv"
    if only and prev.exists():
        old = pd.read_csv(prev)
        drop = [k for g in only for k in GROUPS[g]]
        vals = loc[["pid"]].merge(old.drop(columns=["profile_uid", "dataset"] + [c for c in drop if c in old], errors="ignore"),
                                  on="pid", how="left")
    for name, keys in GROUPS.items():
        if only and name not in only:
            continue
        t0 = time.time()
        img, proj = group_image(keys)
        pts = loc if name != "li" else loc[loc.ecozone == "Hudson Plain"]
        got = sample(img, proj, pts, name)
        vals = vals.merge(got, on="pid", how="left")
        print(f"ok {name:10s} {time.time() - t0:5.0f}s  non-null first band: {int(vals[keys[0]].notna().sum())}", flush=True)
    loc[["pid", "profile_uid", "dataset"]].merge(vals, on="pid").to_csv(OUT / "profile_map_values.csv", index=False)


if __name__ == "__main__":
    import sys
    main(set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None)
