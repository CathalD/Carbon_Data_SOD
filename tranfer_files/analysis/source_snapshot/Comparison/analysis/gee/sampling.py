"""Per-band point sampling that never couples validity across bands.

Image.sampleRegions drops a point when ANY band is masked, which would impose
one footprint on every depth/variable in a multi-band image. reduceRegions with
a per-band `first` reducer instead returns each band independently: a masked
band is simply missing for that point. Sampling happens in the projection of the
image's first band (each pair image is already on its comparison grid; each
profile group shares one native grid), so no scale or crs is passed.
"""

import time

import ee
import pandas as pd


def sample_bands(img, df, label, chunk_size=1000, id_col="pid"):
    parts = []
    reducer = ee.Reducer.first().forEachBand(img)
    for start in range(0, len(df), chunk_size):
        chunk = df.iloc[start:start + chunk_size]
        fc = ee.FeatureCollection([ee.Feature(ee.Geometry.Point([r.lon, r.lat]), {id_col: int(getattr(r, id_col))})
                                   for r in chunk.itertuples()])
        for attempt in range(4):
            try:
                parts.append(ee.data.computeFeatures({
                    "expression": img.reduceRegions(collection=fc, reducer=reducer, tileScale=4),
                    "fileFormat": "PANDAS_DATAFRAME"}))
                break
            except Exception as e:
                print(f"   {label} chunk {start}: {str(e)[:120]} (retry)", flush=True)
                time.sleep(20 * (attempt + 1))
        else:
            raise RuntimeError(f"{label}: chunk {start} failed")
    out = pd.concat(parts, ignore_index=True) if parts else pd.DataFrame(columns=[id_col])
    return out.drop(columns=["geo"], errors="ignore")
