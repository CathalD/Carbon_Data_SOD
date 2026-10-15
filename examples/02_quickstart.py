"""Read public carbon assets and optionally download a small demonstration raster.

Use your own Earth Engine-enabled Cloud project. No asset writes or bulk exports.
"""
import argparse
import json
import math
from pathlib import Path
import urllib.request
import urllib.error

import ee
import google.auth
from google.auth.exceptions import DefaultCredentialsError

SOIL_ROOT='projects/northstarlabs/assets/carbon_state_of_data/soils/'
SOC_ASSET=SOIL_ROOT+'maps/soilgrids_v2/soc_mean'
PROFILE_ASSET=SOIL_ROOT+'profiles/wosis_canada_profiles_v2'
FOREST_ASSET='projects/sat-io/open-datasets/ESA/ESA_CCI_AGB'

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project',required=True,help='Your own Earth Engine-enabled Cloud project')
    parser.add_argument('--output-dir',type=Path,help='Optional local demonstration GeoTIFF download')
    parser.add_argument('--authenticate',action='store_true',help='Run the interactive Earth Engine sign-in first')
    args=parser.parse_args()
    if args.authenticate:ee.Authenticate()
    try:
        credentials,_=google.auth.default(scopes=['https://www.googleapis.com/auth/earthengine','https://www.googleapis.com/auth/cloud-platform'])
        ee.Initialize(credentials=credentials,project=args.project)
    except DefaultCredentialsError:
        ee.Initialize(project=args.project)
    ee.data.setDeadline(90000)
    soc=ee.Image(SOC_ASSET)
    profiles=ee.FeatureCollection(PROFILE_ASSET)
    forest=ee.ImageCollection(FOREST_ASSET)
    bands=soc.bandNames().getInfo()
    if 'soc_0-5cm_mean' not in bands:raise RuntimeError('Unexpected SoilGrids band schema')
    # SoilGrids soc_mean stores dg/kg: divide by 10 for g/kg.
    # This factor does not apply to other providers or to carbon stock.
    soc_gkg=soc.select('soc_0-5cm_mean').divide(10).rename('soc_0_5cm_g_kg')
    # Synthetic demonstration area near Saskatoon, not a selected profile site.
    region=ee.Geometry.Rectangle([-106.70,52.10,-106.60,52.16],geodesic=False)
    summary=ee.Dictionary({
        'soil_bands':soc.bandNames(),
        'hosted_wosis_profile_rows':profiles.size(),
        'hosted_wosis_profile_fields':profiles.first().propertyNames(),
        'forest_collection_images':forest.size(),
        'forest_first_image_bands':ee.Image(forest.first()).bandNames(),
        'demo_soc_mean_g_kg':soc_gkg.reduceRegion(reducer=ee.Reducer.mean(),geometry=region,crs=soc.projection(),scale=250,maxPixels=10000),
        'soil_quantity':'SOC concentration, mean, 0–5 cm; not stock',
        'forest_quantity':'Aboveground biomass and SD; not automatically carbon',
        'permissions':'Examples require public asset read and your own authorized Earth Engine project'
    }).getInfo()
    print(json.dumps(summary,indent=2))
    if args.output_dir:
        args.output_dir.mkdir(parents=True,exist_ok=True)
        # This source's custom Mollweide WKT is readable by EE but its GeoTIFF
        # writer rejects it. Use an explicit demo grid in local UTM zone 13N.
        # This download is reprojected (nearest neighbour), not a native copy.
        projection_crs='EPSG:32613'
        projection={'transform':[250,0,0,0,-250,0]}
        # getDownloadURL ignores region when CRS+transform are given. Compute a
        # small aligned window explicitly instead of accidentally requesting a
        # source-wide raster. This example uses the declared 250 m UTM grid.
        dx,sx,x0,sy,dy,y0=projection['transform']
        if sx or sy or dx<=0 or dy>=0:raise RuntimeError('Expected a north-up source grid')
        pairs=region.bounds(1,ee.Projection(projection_crs)).coordinates().getInfo()[0]
        xs=[p[0] for p in pairs];ys=[p[1] for p in pairs]
        c0=math.floor((min(xs)-x0)/dx);c1=math.ceil((max(xs)-x0)/dx)
        r0=math.floor((max(ys)-y0)/dy);r1=math.ceil((min(ys)-y0)/dy)
        width,height=c1-c0,r1-r0
        if not 0<width*height<=10000:raise RuntimeError('Demonstration window outside size limit')
        tile_transform=[dx,0,x0+c0*dx,0,dy,y0+r0*dy]
        url=soc_gkg.clip(region).getDownloadURL({'crs':projection_crs,'crs_transform':tile_transform,'dimensions':[width,height],'format':'GEO_TIFF'})
        destination=args.output_dir/'soilgrids_soc_0_5cm_demo_g_kg.tif'
        try:
            with urllib.request.urlopen(url,timeout=90) as response:body=response.read()
        except urllib.error.HTTPError as error:
            try:message=json.loads(error.read()).get('error',{}).get('message','Download failed')
            except Exception:message='Download failed'
            raise RuntimeError(str(error.code)+': '+message[:500]) from None
        if body[:4] not in [b'II*\x00',b'MM\x00*']:raise RuntimeError('Expected GeoTIFF download')
        destination.write_bytes(body)
        (args.output_dir/'quickstart_result.json').write_text(json.dumps(summary,indent=2))
        print('Downloaded demonstration GeoTIFF:',destination,'bytes:',len(body),'dimensions:',width,height)

if __name__=='__main__':
    main()
