"""Render map figures for each comparison pair from Earth Engine.

For each pair: product A and product B on ONE shared colour scale (they are
in the same unit after conversion), and the difference A - B on a diverging
scale symmetric about zero.

These are display figures at roughly 7 km per pixel (Canada) or 1.5 km (Hudson
Plain), in EPSG:3978. Earth Engine averages each product to the display grid
before differencing, so the maps show broad agreement patterns; the statistics
in the report come from 01_sample_pairs.py on each pair's comparison grid.

Outputs: ../../data/derived/pair_maps/<pair>_{a,b,diff}.png and pair_maps.json
Run:     ../../../../.venv/bin/python 03_pair_maps.py [--only id1,id2]
"""

import json
import sys
import urllib.request
import warnings
from pathlib import Path

import ee
import pandas as pd

import common

warnings.filterwarnings("ignore")
HERE = Path(__file__).resolve().parent
DERIVED = HERE.parents[1] / "data" / "derived"
OUT = DERIVED / "pair_maps"
OUT.mkdir(parents=True, exist_ok=True)

LSIB = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017")
CANADA = LSIB.filter(ee.Filter.eq("country_na", "Canada")).geometry().simplify(maxError=2000)
SEQ = ["cde2fb", "9ec5f4", "6da7ec", "3987e5", "256abf", "184f95", "0d366b"]
# Diverging blue (B higher) <-> grey <-> red (A higher)
DIV = ["104281", "3987e5", "9ec5f4", "f0efec", "f2a7a6", "e34948", "8f1d1c"]


def region_3978(geom):
    ring = geom.transform("EPSG:3978", 1000).bounds(1000, "EPSG:3978").coordinates().getInfo()[0]
    xs, ys = [c[0] for c in ring], [c[1] for c in ring]
    return ee.Geometry.Rectangle([min(xs), min(ys), max(xs), max(ys)], "EPSG:3978", False)


def thumb(img, vis, region, clip_geom, path, dims):
    land = ee.Image().byte().paint(ee.FeatureCollection([ee.Feature(clip_geom)]), 1) \
        .visualize(palette=["7d847a"], opacity=0.22)
    url = land.blend(img.clip(clip_geom).visualize(**vis)).getThumbURL(
        {"region": region, "crs": "EPSG:3978", "dimensions": dims, "format": "png"})
    urllib.request.urlretrieve(url, path)
    compress_png(path)


def compress_png(path, colors=128):
    """Palette-quantise in place (alpha kept) to keep the repository and site small."""
    from PIL import Image
    Image.open(path).convert("RGBA").quantize(colors=colors, method=Image.Quantize.FASTOCTREE).save(path, optimize=True)


def main(only=None):
    # The report reads the pair definitions from here, so Python and R share one source.
    prods = common.products()
    (DERIVED / "pairs.json").write_text(json.dumps(
        [{**p, "a_label": prods[p["a"]][2], "b_label": prods[p["b"]][2]} for p in common.pairs()], indent=1))
    hbl_pts = pd.read_csv(DERIVED / "random_points_hudson_plain.csv")
    prods = common.products()
    for p in common.pairs():
        if only and p["id"] not in only:
            continue
        a, _ = common.converted(p["a"])
        b, _ = common.converted(p["b"])
        if p["region"] == "hbl":
            li = prods["li_depth"][0]
            geom = li.geometry()
            dims = 640
        else:
            geom = CANADA
            dims = 720
        region = region_3978(geom)
        # Shared stretch and difference limit from the sampled comparison-grid values.
        s = pd.read_csv(DERIVED / f"pair_samples_{p['family']}.csv")
        av, bv = s[f"a__{p['id']}"], s[f"b__{p['id']}"]
        both = av.notna() & bv.notna()
        if p["family"] == "agb":
            both &= (av > 0) | (bv > 0)
        vals = pd.concat([av[both], bv[both]])
        lo, hi = float(vals.quantile(0.02)), float(vals.quantile(0.98))
        dlim = float((av[both] - bv[both]).abs().quantile(0.95))
        files = {}
        for tag, img, vis in [
            ("a", a, dict(min=lo, max=hi, palette=SEQ)),
            ("b", b, dict(min=lo, max=hi, palette=SEQ)),
            ("diff", a.subtract(b), dict(min=-dlim, max=dlim, palette=DIV)),
        ]:
            f = OUT / f"{p['id']}_{tag}.png"
            try:
                thumb(img, vis, region, geom, f, dims)
                files[tag] = f"pair_maps/{f.name}"
            except Exception as e:
                print(f"FAIL {p['id']} {tag}: {str(e)[:150]}", flush=True)
        rec = {"id": p["id"], "a_label": prods[p["a"]][2], "b_label": prods[p["b"]][2],
               "unit": p["unit"], "lo": lo, "hi": hi, "dlim": dlim, "files": files}
        # One file per pair so parallel runs never overwrite each other; then rebuild the index.
        (OUT / f"{p['id']}.json").write_text(json.dumps(rec, indent=1))
        print(f"ok {p['id']:12s} scale {lo:.3g}–{hi:.3g} {p['unit']}  diff ±{dlim:.3g}", flush=True)
        rebuild_index()


def rebuild_index():
    order = [p["id"] for p in common.pairs()]
    recs = {json.loads(f.read_text())["id"]: json.loads(f.read_text())
            for f in OUT.glob("*.json") if f.name != "pair_maps.json"}
    (OUT / "pair_maps.json").write_text(json.dumps([recs[i] for i in order if i in recs], indent=1))


if __name__ == "__main__":
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    main(only)
