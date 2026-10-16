"""Independent QA of returned pilot values and input metadata."""
import argparse
from collections import Counter
import csv
import json
import math
from pathlib import Path

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--profiles',type=Path,default=Path('outputs/carbon_state_of_data/pilot/selected_profiles.geojson'))
parser.add_argument('--results',type=Path,default=Path('outputs/carbon_state_of_data/pilot/results'))
parser.add_argument('--radar-diagnostic',type=Path)
args=parser.parse_args()
results=args.results
rows=list(csv.DictReader((results/'pilot_covariates.csv').open()))
manifest=json.loads((results/'run_manifest.json').read_text())
features=json.loads(args.profiles.read_text())['features']
expected={f['properties']['pilot_id']:f for f in features}
meta=['pilot_id','source_code','source_id','source_asset','longitude','latitude']
bands=[f for f in rows[0] if f not in meta]
predictors=[b for b in bands if not b.startswith('qa_')]
qa=[b for b in bands if b.startswith('qa_')]
failures=[];warnings=[]
if len(rows)!=20 or set(r['pilot_id'] for r in rows)!=set(expected):failures.append('Row/ID mismatch')
if len(bands)!=47 or len(predictors)!=43 or len(qa)!=4:failures.append('Schema mismatch')
numeric={}
for r in rows:
    values={}
    for b in bands:
        try:v=float(r[b])
        except (ValueError,TypeError):failures.append([r['pilot_id'],b,'not numeric']);continue
        if not math.isfinite(v):failures.append([r['pilot_id'],b,'not finite'])
        values[b]=v
    numeric[r['pilot_id']]=values
    for b in qa:
        v=values[b]
        if v<0 or v!=int(v):failures.append([r['pilot_id'],b,'invalid count'])
    radar_sd=values['local_s1_vv_over_vh_linear_temporal_sd']
    radar_median=values['local_s1_vv_over_vh_linear_median']
    if radar_median>0 and radar_sd>10*radar_median:
        warnings.append([r['pilot_id'],'local_s1_vv_over_vh_linear_temporal_sd','SD exceeds ten times median: review temporal tail; diagnostic trigger only',radar_sd,radar_median])
    for b in predictors:
        v=values[b]
        if v==-9999:continue
        lower=upper=None
        if '_prob_mean' in b or b.endswith('_120m_mean') and b.startswith('local_dw_'):lower,upper=0,1
        elif b in ['local_s2_ndmi_spring_median','local_s2_ndvi_summer_median','local_s2_ndvi_120m_mean']:lower,upper=-1,1
        elif b=='local_slope_deg':lower,upper=0,90
        elif b in ['regional_jrc_water_occurrence_pct','regional_jrc_water_recurrence_pct']:lower,upper=0,100
        elif b=='regional_jrc_water_seasonality_months':lower,upper=0,12
        elif b=='regional_observed_water_distance_m':lower,upper=0,12000
        elif b=='broad_era5_mean_freezing_months':lower,upper=0,12
        elif b=='broad_era5_mean_temperature_c':lower,upper=-80,60
        elif b=='broad_era5_mean_annual_precip_mm':lower,upper=0,20000
        elif b=='regional_elevation_m':lower,upper=-500,9000
        elif '_sd' in b:lower=0
        elif 'linear_median' in b:lower=0
        if lower is not None and v<lower-1e-6:failures.append([r['pilot_id'],b,'below bound',v,lower])
        if upper is not None and v>upper+1e-6:failures.append([r['pilot_id'],b,'above bound',v,upper])
        if b=='local_s2_evi_summer_median' and not -1<=v<=2:warnings.append([r['pilot_id'],b,'unusual EVI',v])
    counts=expected[r['pilot_id']]['geometry']['coordinates']
    if abs(float(r['longitude'])-counts[0])>1e-10 or abs(float(r['latitude'])-counts[1])>1e-10:failures.append([r['pilot_id'],'coordinate changed'])
summaries=[]
for b in bands:
    vals=[numeric[r['pilot_id']][b] for r in rows]
    valid=[v for v in vals if v!=-9999]
    summaries.append({'band':b,'role':'QA' if b.startswith('qa_') else 'Predictor','valid_rows':len(valid),'missing_rows':len(vals)-len(valid),'minimum':min(valid) if valid else None,'maximum':max(valid) if valid else None,'unique_values':len(set(valid)),'constant_in_pilot':len(set(valid))<=1,'missing_by_source':{s:sum(numeric[r['pilot_id']][b]==-9999 for r in rows if r['source_code']==s) for s in sorted({r['source_code'] for r in rows})}})
with (results/'band_qa.csv').open('w',newline='') as h:
    cols=['band','role','valid_rows','missing_rows','minimum','maximum','unique_values','constant_in_pilot']
    w=csv.DictWriter(h,fieldnames=cols,extrasaction='ignore');w.writeheader();w.writerows(summaries)
profile_flags=[]
for f in features:
    p=f['properties'];flags=[]
    if p.get('positional_uncertainty'):flags.append('Coordinate uncertainty: '+p['positional_uncertainty'])
    if p.get('conf_metrs') is not None and p['conf_metrs']>30:flags.append('Coordinate confidence exceeds output grid: '+str(p['conf_metrs'])+' m')
    if p.get('flag_location_conf_poor'):flags.append('Source flags poor location confidence')
    if p.get('source_coordinate_datum_verified')==0:flags.append('Coordinate datum not verified')
    if p.get('positional_uncertainty') is None and p.get('conf_metrs') is None:flags.append('Coordinate precision not recorded')
    date=next((str(p[k]) for k in ['date','Year','year','cal_year'] if p.get(k) is not None),'unknown')
    if not date[:4].isdigit():flags.append('Sampling date unknown')
    elif not 2019<=int(date[:4])<=2023:flags.append('Sampling date outside 2019–2023 composite')
    vals=numeric[p['pilot_id']]
    missing=sum(vals[b]==-9999 for b in predictors)
    if missing:flags.append(str(missing)+' missing predictors')
    if vals['local_s1_vv_over_vh_linear_median']>0 and vals['local_s1_vv_over_vh_linear_temporal_sd']>10*vals['local_s1_vv_over_vh_linear_median']:flags.append('Radar linear-ratio SD dominated by temporal tail; review acquisitions')
    for b in qa:
        if vals[b]==0:flags.append('No observations: '+b)
    profile_flags.append({'pilot_id':p['pilot_id'],'source_code':p['source_code'],'sampling_date':date,'missing_predictors':missing,'flags':flags})
radar_check=None
if args.radar_diagnostic:
    radar_check=json.loads(args.radar_diagnostic.read_text())
    if not math.isclose(radar_check['recomputed_population_sd'],radar_check['exported_temporal_sd'],rel_tol=1e-6):failures.append('Radar temporal SD does not match acquisition-level population SD')
    if not math.isclose(radar_check['ee_median_maxRaw_10000'],radar_check['recomputed_median'],rel_tol=1e-10):failures.append('Exact radar median does not match acquisition-level median')
    if not math.isclose(radar_check['exported_median'],radar_check['recomputed_median'],rel_tol=1e-3):
        warnings.append([radar_check['pilot_id'],'Default median differs from exact median; use explicit reducer policy in a new version',radar_check['exported_median'],radar_check['recomputed_median']])
        next(f for f in profile_flags if f['pilot_id']==radar_check['pilot_id'])['flags'].append('Default radar median differs from exact acquisition median; revise reducer policy')
checks={'run_status':'PASS' if not failures else 'FAIL','scope':'Software/data-availability smoke test; not target-model validation or authorisation for bulk processing','row_count':len(rows),'source_counts':dict(Counter(r['source_code'] for r in rows)),'schema':{'metadata':len(meta),'predictors':len(predictors),'qa':len(qa)},'finite_and_range_failures':failures,'warnings':warnings,'predictor_missing_cells':sum(s['missing_rows'] for s in summaries if s['role']=='Predictor'),'predictor_total_cells':len(rows)*len(predictors),'bands':summaries,'profiles':profile_flags,'cautions':['Source metadata/dates/coordinate uncertainty retained; no target stock reconstruction.','JRC occurrence/seasonality/recurrence follow notebook unmask(0); zero does not prove universal absence of water.','No model fitted, accuracy score calculated, or Canada-wide extraction launched.','No study-specific Conditional/Hold feature is implemented by this baseline pilot.']}
checks['modelling_readiness']='REVIEW: climate coverage, radar tails, coordinate support and temporal mismatch before bulk processing'
checks['radar_acquisition_check']=radar_check
(results/'qa_summary.json').write_text(json.dumps(checks,indent=2,allow_nan=False))
print(json.dumps({k:v for k,v in checks.items() if k not in ['bands','profiles']},indent=2))
if failures:raise SystemExit(1)
