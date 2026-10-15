"""Bounded pilot of the unchanged 47-band notebook, without its bulk exporters.

Requires earthengine-api and existing Google Application Default Credentials.
No assets or Cloud Storage objects are written. Results are local JSON/CSV.
"""
import argparse
import ast
import csv
from datetime import datetime, timezone
import hashlib
import json
import math
from pathlib import Path
import time
import urllib.request

import ee
import google.auth

NOTEBOOK_BLOB = 'b98e8b33f861e8b9dc1c1535fd78c165cde9c8f0'
NOTEBOOK_URL = 'https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/main/MultiScale_CovariateExtraction.ipynb'


def literal(code, name):
    for node in ast.parse(code).body:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == name for t in node.targets):
            return ast.literal_eval(node.value)
    raise ValueError('Notebook definition missing: '+name)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--notebook', type=Path)
    parser.add_argument('--profiles', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--source', help='Optional single-source shard; default all selected sources')
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    raw = args.notebook.read_bytes() if args.notebook else urllib.request.urlopen(NOTEBOOK_URL, timeout=30).read()
    # Ignore only an extra file-ending newline introduced by a text transport.
    candidates = [raw, raw.rstrip(b'\n')+b'\n', raw.rstrip(b'\n')]
    matched = next((b for b in candidates if hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==NOTEBOOK_BLOB), None)
    if matched is None:
        raise RuntimeError('Notebook changed: expected pinned blob '+NOTEBOOK_BLOB)
    nb = json.loads(matched)
    code = {i: ''.join(c['source']) for i,c in enumerate(nb['cells']) if c['cell_type']=='code'}
    config = literal(code[1], 'CONFIG')
    names = literal(code[2], 'EXPECTED_BAND_NAMES')
    if len(names)!=47 or len(set(names))!=47: raise RuntimeError('Invalid baseline manifest')
    creds,_=google.auth.default(scopes=['https://www.googleapis.com/auth/earthengine','https://www.googleapis.com/auth/cloud-platform'])
    ee.Initialize(credentials=creds, project='northstarlabs')
    ee.data.setDeadline(180000)
    crs = literal(code[1], 'ROUTE_L_CRS')
    transform = literal(code[1], 'ROUTE_L_TRANSFORM_30M')
    env={'ee':ee,'math':math,'CONFIG':config,'EXPECTED_BAND_NAMES':names,'OUTPUT_PROJECTION':ee.Projection(crs,transform)}
    # Only stack/helper cells, never notebook authentication, CSV selection,
    # community-validation, Drive mount, exporters or raster download cells.
    for index in [3,4,5,6,7]:
        exec(compile(code[index],f'pinned_notebook_cell_{index}','exec'),env)
    selected=json.loads(args.profiles.read_text())['features']
    if len(selected)>20: raise RuntimeError('Pilot is limited to 20 input profiles')
    if len({f['properties']['pilot_id'] for f in selected})!=len(selected):raise RuntimeError('Duplicate pilot IDs')
    meta=['pilot_id','source_code','source_id','source_asset','longitude','latitude']
    sources=sorted({f['properties']['source_code'] for f in selected})
    if args.source:
        if args.source not in sources:raise RuntimeError('Unknown source')
        sources=[args.source]
    for source in sources:
        destination=args.output_dir/(source+'_samples.json')
        if destination.exists():
            print('Cached shard',source,flush=True)
            continue
        features=[]
        for f in selected:
            p=f['properties']
            if p['source_code']!=source:continue
            if f['geometry']['type']!='Point':raise RuntimeError('Non-point profile')
            x,y=f['geometry']['coordinates'][:2]
            m={k:p[k] for k in meta if k not in ['longitude','latitude']}
            m.update(longitude=x,latitude=y)
            features.append(ee.Feature(ee.Geometry.Point([x,y]),m))
        print('Sampling',source,len(features),'profiles',flush=True)
        start=time.monotonic()
        result=env['point_sampling_image'].sampleRegions(collection=ee.FeatureCollection(features),properties=meta,projection=env['OUTPUT_PROJECTION'],tileScale=8,geometries=False).getInfo()
        payload={'source':source,'elapsed_seconds':round(time.monotonic()-start,2),'expected_rows':len(features),'features':result['features']}
        destination.write_text(json.dumps(payload,indent=2,allow_nan=False))
        print('Returned',source,len(result['features']),'rows in',payload['elapsed_seconds'],'seconds',flush=True)
    rows=[]
    for source in sources:
        rows.extend(f['properties'] for f in json.loads((args.output_dir/(source+'_samples.json')).read_text())['features'])
    expected=[f['properties']['pilot_id'] for f in selected if f['properties']['source_code'] in sources]
    actual=[r['pilot_id'] for r in rows]
    errors=[]
    if sorted(actual)!=sorted(expected):errors.append('Selected/returned IDs differ or duplicates occurred')
    if any(set(r)!=(set(meta)|set(names)) for r in rows):errors.append('Unexpected/missing exported fields')
    fields=meta+names
    with (args.output_dir/'pilot_covariates.csv').open('w',newline='') as handle:
        w=csv.DictWriter(handle,fieldnames=fields,extrasaction='raise');w.writeheader();w.writerows(rows)
    summary={'run_utc':datetime.now(timezone.utc).isoformat(),'ee_api_version':ee.__version__,'notebook_blob':NOTEBOOK_BLOB,'selected_profiles_sha256':hashlib.sha256(args.profiles.read_bytes()).hexdigest(),'csv_sha256':hashlib.sha256((args.output_dir/'pilot_covariates.csv').read_bytes()).hexdigest(),'project':'northstarlabs','expected_rows':len(expected),'actual_rows':len(rows),'predictor_bands':43,'qa_bands':4,'native_information_support':'Varies by source; 30 m output is not 30 m climate/terrain information','output_crs':crs,'output_transform':transform,'output_grid_m':30,'context_radii_m':[120,1000],'period':'2019-2023','sampling':'Pinned notebook sampleRegions at exact 30 m projection; no buffer averaging or target-based filtering','missing_sentinel':-9999,'scope':'Workflow smoke test; not predictive validation or full catalogue extraction','community_included':False,'circumpolar_included':False,'carbon_response_exported':False,'errors':errors}
    (args.output_dir/'run_manifest.json').write_text(json.dumps(summary,indent=2))
    print(json.dumps(summary,indent=2),flush=True)
    if errors:raise RuntimeError('; '.join(errors))


if __name__=='__main__':
    main()
