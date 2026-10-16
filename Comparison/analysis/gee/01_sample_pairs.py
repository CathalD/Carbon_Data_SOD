"""Sample every comparison pair at area-uniform random points.

Design
  * 30,000 points, uniform in area (Canada Albers equal-area, ESRI:102001),
    inside the terrestrial ecozones; 1,500 more inside the Hudson Plain
    ecozone for the Li vs PEATGRIDS peat pairs. Seeded, so reproducible.
  * Each point reads both products of a pair on the pair's comparison grid
    (coarser native grid, finer product mean-aggregated). Values are in the
    common unit for the quantity (see common.py).
  * Bands are sampled independently (sampling.py): a point missing one depth
    or one product is missing only for that pair, never for the others.
  * Ecozone is attached locally from the AAFC ecozone polygons.

Output: ../../data/derived/pair_samples_<family>.csv
Run:    ../../../../.venv/bin/python 01_sample_pairs.py [--only family1,family2]
"""

import time
import warnings
from pathlib import Path

import ee
import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Point

import common
import sampling

warnings.filterwarnings("ignore")
HERE = Path(__file__).resolve().parent
DATA = HERE.parents[1] / "data"
OUT = DATA / "derived"
OUT.mkdir(parents=True, exist_ok=True)
SEED, N_CANADA, N_HBL, CHUNK = 42, 30000, 1500, 1000
# Aggregating 30 m Li pixels to 1 km is costly per request, so peat uses small chunks.
CHUNK_BY_FAMILY = {"peat": 250}
ALBERS = "ESRI:102001"


def ecozones():
    ez = gpd.read_file(DATA / "ecozones" / "Ecozones" / "ecozones.shp").to_crs(4326)
    ez["ecozone"] = ez["ZONE_NAME"].str.replace("PLain", "Plain").str.replace("MixedWood", "Mixedwood")
    return ez.dissolve("ecozone").reset_index()[["ecozone", "geometry"]]


def random_points(zones, n, seed):
    rng = np.random.default_rng(seed)
    za = zones.to_crs(ALBERS)
    minx, miny, maxx, maxy = za.total_bounds
    got, total = [], 0
    while total < n:
        x = rng.uniform(minx, maxx, 2 * n)
        y = rng.uniform(miny, maxy, 2 * n)
        cand = gpd.GeoDataFrame(geometry=gpd.points_from_xy(x, y), crs=ALBERS)
        inside = gpd.sjoin(cand, za, predicate="within", how="inner")
        got.append(inside)
        total += len(inside)
    g = pd.concat(got).iloc[:n].to_crs(4326)
    return pd.DataFrame({"lon": g.geometry.x.round(6), "lat": g.geometry.y.round(6), "ecozone": g["ecozone"].values})


def sample(img, df, label, chunk_size=CHUNK):
    """Sample img (already on its comparison grid) at df points; bands independent."""
    got = sampling.sample_bands(img, df, label, chunk_size)
    return df.merge(got, on="pid", how="left")


def family_image(fam_pairs):
    bands = []
    for p in fam_pairs:
        img, _ = common.pair_image(p)
        bands.append(img.select(["a", "b"], [f"a__{p['id']}", f"b__{p['id']}"]))
    return ee.Image.cat(bands)


def main(only=None):
    """Sample all pair families, or only the named ones (reusing the saved points)."""
    if only and (OUT / "random_points_canada.csv").exists():
        canada = pd.read_csv(OUT / "random_points_canada.csv")
        hbl = pd.read_csv(OUT / "random_points_hudson_plain.csv")
    else:
        zones = ecozones()
        canada = random_points(zones, N_CANADA, SEED)
        canada.insert(0, "pid", range(len(canada)))
        hbl = random_points(zones[zones.ecozone == "Hudson Plain"], N_HBL, SEED + 1)
        hbl.insert(0, "pid", range(len(hbl)))
        canada.to_csv(OUT / "random_points_canada.csv", index=False)
        hbl.to_csv(OUT / "random_points_hudson_plain.csv", index=False)
    print(f"points: canada={len(canada)} hudson_plain={len(hbl)}", flush=True)

    fams = {}
    for p in common.pairs():
        fams.setdefault(p["family"], []).append(p)
    for fam, ps in fams.items():
        if only and fam not in only:
            continue
        pts = hbl if ps[0]["region"] == "hbl" else canada
        t0 = time.time()
        df = sample(family_image(ps), pts, fam, CHUNK_BY_FAMILY.get(fam, CHUNK))
        df.to_csv(OUT / f"pair_samples_{fam}.csv", index=False)
        valid = {p["id"]: int(df[[f"a__{p['id']}", f"b__{p['id']}"]].notna().all(axis=1).sum())
                 if f"a__{p['id']}" in df else 0 for p in ps}
        print(f"ok {fam:9s} {time.time() - t0:5.0f}s  both-valid: {valid}", flush=True)


if __name__ == "__main__":
    import sys
    # Optional: --only fam1,fam2 to re-sample selected families with the saved points.
    main(set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None)
