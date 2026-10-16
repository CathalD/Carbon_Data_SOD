from pathlib import Path
import os,json,shutil,hashlib
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

import argparse
PROJECT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description='Rebuild the summaries example figures from prepared source tables.')
parser.add_argument('--source-root', type=Path, default=PROJECT/'analysis/source_snapshot')
parser.add_argument('--output-dir', type=Path, default=PROJECT/'docs/images/summaries')
args=parser.parse_args()
ROOT=args.source_root.resolve()
OUT=args.output_dir.resolve()
OUT.mkdir(parents=True,exist_ok=True)
DER=ROOT/'Comparison/data/derived'
order=['WoSIS','NPDB','NRCan peat','Janousek','Riley']
colors=dict(zip(order,['#2878b8','#dd7730','#209f7b','#a88719','#a8589e']))
plt.rcParams.update({'font.size':10,'axes.titlesize':12,'axes.labelsize':10,'axes.spines.top':False,'axes.spines.right':False,'figure.facecolor':'white','axes.facecolor':'white','savefig.facecolor':'white'})
iv=pd.read_csv(DER/'profile_intervals.csv')
summary=pd.read_csv(DER/'profile_dataset_summary.csv')
loc=pd.read_csv(DER/'profile_locations.csv')
source_note='Example from committed source snapshot 0861884 • 16 Oct 2026'
def save(fig,key):
    fig.savefig(OUT/(key+'.png'),dpi=145,bbox_inches='tight');plt.close(fig)

# Source geometry and points, aggregated visually by overplotting at national scale.
ez=gpd.read_file(ROOT/'Comparison/data/ecozones/Ecozones/ecozones.shp').to_crs(3978)
pts=gpd.GeoDataFrame(loc,geometry=gpd.points_from_xy(loc.lon.round(2),loc.lat.round(2)),crs=4326).to_crs(3978)
x0,y0,x1,y1=ez.total_bounds
fig,axes=plt.subplots(1,5,figsize=(15.5,4.0))
for ax,ds in zip(axes,order):
    ez.plot(ax=ax,color='#edf0eb',edgecolor='#c7cec6',linewidth=.15)
    pts[pts.dataset==ds].plot(ax=ax,color=colors[ds],markersize=1.2,alpha=.4)
    ax.set(xlim=(x0,x1),ylim=(y0,y1),title=ds);ax.set_axis_off()
fig.suptitle('Where the prepared soil observations are located',fontsize=16,y=1.03)
fig.text(.5,.03,'Canada view; cross-border records extend beyond the frame. Display coordinates rounded to 0.01°. Records are not deduplicated.',ha='center',fontsize=10)
fig.text(.5,-.02,source_note,ha='center',fontsize=9,color='#58625b')
fig.subplots_adjust(wspace=.04,bottom=.13)
save(fig,'soil-observation-locations')

fig,axes=plt.subplots(1,2,figsize=(12,4.0),gridspec_kw={'width_ratios':[1.2,1]})
for k,depth in enumerate([30,100,200]):
    y=np.arange(5)+(k-1)*.16
    vals=summary.set_index('dataset').loc[order,f'share_reaching_{depth}cm']*100
    axes[0].scatter(vals,y,label=f'{depth} cm',s=40,marker=['o','s','^'][k],color=['#9ac7df','#397faf','#173d61'][k])
axes[0].set(yticks=range(5),yticklabels=order,xlim=(-3,103),xlabel='Profiles whose deepest layer reaches depth (%)',title='Recorded depth reach')
axes[0].invert_yaxis();axes[0].legend(frameon=False,loc='upper center',bbox_to_anchor=(.5,-.22),ncol=3)
cols=['layers_with_soc','layers_with_bd','layers_with_stock_value'];matrix=summary.set_index('dataset').loc[order,cols].astype(float).to_numpy()
im=axes[1].imshow(np.ma.masked_invalid(matrix),vmin=0,vmax=1,cmap='Blues',aspect='auto')
for i in range(5):
    for j in range(3):
        v=matrix[i,j];label='unverified' if (i==4 and j==1) else ('not available' if not np.isfinite(v) else f'{v*100:.1f}%')
        axes[1].text(j,i,label,ha='center',va='center',fontsize=9,color='white' if np.isfinite(v) and v>.65 else '#18261e')
axes[1].set(xticks=range(3),xticklabels=['SOC','Bulk density','Layer stock'],yticks=range(5),yticklabels=order,title='Layer rows with a value')
fig.suptitle('Coverage of depth and measured or estimated variables',fontsize=15,y=1.03)
fig.text(.5,-.055,'Reaching a depth does not establish continuous sampling. Presence of a value does not establish that it was measured directly.',ha='center',fontsize=10)
fig.text(.5,-.11,source_note,ha='center',fontsize=9,color='#58625b')
fig.tight_layout();save(fig,'soil-depth-and-availability')

intervals=['0-5','5-15','15-30','30-60','60-100']
mid=np.array([2.5,10,22.5,45,80])
for datum in ['mineral','surface']:
    ds_order=['WoSIS','NPDB'] if datum=='mineral' else order
    z=iv[iv.datum.eq(datum)]
    label='Mineral surface' if datum=='mineral' else 'Profile surface / prepared datum'
    fig,axes=plt.subplots(1,2,figsize=(11.5,4.6),sharey=True)
    for ax,var,unit in zip(axes,['soc_gkg','bd'],['SOC concentration (g/kg)','Bulk density (g/cm³)']):
        for ds in ds_order:
            d=z[z.dataset.eq(ds)&z.variable.eq(var)&z.interval.isin(intervals)]
            if d.empty:continue
            q=d.groupby('interval')['observed'].quantile([.25,.5,.75]).unstack().reindex(intervals)
            ax.plot(q[.5],mid,'o-',color=colors[ds],label=ds,markersize=4,linewidth=1.6)
            ax.fill_betweenx(mid,q[.25],q[.75],color=colors[ds],alpha=.10)
        ax.set(xlabel=unit,title='Median and interquartile range',ylim=(100,0),yticks=mid,yticklabels=['0–5','5–15','15–30','30–60','60–100']);ax.grid(axis='y',color='#e5e8e3',linewidth=.5)
        if var=='soc_gkg':ax.set_xscale('log')
    axes[0].set_ylabel('Depth interval (cm)')
    handles=[Line2D([0],[0],color=colors[ds],marker='o',label=ds) for ds in ds_order]
    fig.legend(handles=handles,loc='lower center',ncol=len(ds_order),frameon=False,bbox_to_anchor=(.5,-.015))
    fig.suptitle(f'Soil properties by depth • {label}',fontsize=15,y=1.03)
    fig.text(.5,-.065,'Different profiles can contribute to each depth. These are cross-sectional summaries, not trajectories of individual cores.',ha='center',fontsize=9)
    fig.text(.5,-.11,'Riley density is excluded. Prepared interval eligibility and source methods apply. '+source_note,ha='center',fontsize=8.5,color='#58625b')
    fig.tight_layout();save(fig,'soil-depth-profiles-'+datum)

    # ECDFs retain every finite selected-interval value; nonpositive values omitted only from log axes.
    fig,axes=plt.subplots(1,2,figsize=(11.5,4.0))
    omitted={}
    for ax,var,unit in zip(axes,['soc_gkg','bd'],['SOC concentration (g/kg; log scale)','Bulk density (g/cm³)']):
        for ds in ds_order:
            values=z.loc[z.dataset.eq(ds)&z.variable.eq(var)&z.interval.eq('0-5'),'observed'].dropna().to_numpy()
            values=values[np.isfinite(values)]
            if var=='soc_gkg':omitted[ds]=int((values<=0).sum());values=values[values>0]
            if not len(values):continue
            x=np.sort(values);y=np.arange(1,len(x)+1)/len(x)*100
            ax.step(x,y,where='post',label=f'{ds} (n={len(x):,})',color=colors[ds],linewidth=1.5)
        ax.set(xlabel=unit,ylabel='Profiles at or below value (%)',ylim=(0,102));ax.grid(axis='y',linewidth=.5,color='#e5e8e3');ax.legend(frameon=False,fontsize=8.5,loc='lower right')
        if var=='soc_gkg':ax.set_xscale('log')
    fig.suptitle(f'Value distributions at 0–5 cm • {label}',fontsize=15,y=1.03)
    fig.text(.5,-.02,'Cumulative distributions; one value per eligible profile at this interval. SOC log axis excludes nonpositive values: '+str(sum(omitted.values()))+'.',ha='center',fontsize=9)
    fig.text(.5,-.075,source_note,ha='center',fontsize=9,color='#58625b')
    fig.tight_layout();save(fig,'soil-distributions-'+datum)

    fig,axes=plt.subplots(1,2,figsize=(11.5,4.0),sharey=True)
    for ax,interval in zip(axes,['0-30','0-100']):
        for i,ds in enumerate(ds_order):
            vals=z.loc[z.dataset.eq(ds)&z.variable.eq('stock_kgm2')&z.interval.eq(interval),'observed'].dropna().to_numpy()
            vals=vals[np.isfinite(vals)&(vals>0)]
            if len(vals)>=5:
                ax.boxplot([vals],positions=[i],orientation='horizontal',widths=.48,showfliers=False,patch_artist=True,boxprops={'facecolor':colors[ds],'alpha':.35},medianprops={'color':'#18261e'},whiskerprops={'color':colors[ds]},capprops={'color':colors[ds]})
            elif len(vals):ax.scatter(vals,np.full(len(vals),i),color=colors[ds],s=22)
            ax.text(1.02,i,f'n={len(vals):,}' if len(vals) else 'not available',transform=ax.get_yaxis_transform(),ha='left',va='center',fontsize=9,clip_on=False)
        ax.set_xscale('log');ax.set(yticks=range(len(ds_order)),yticklabels=ds_order,ylim=(-.6,len(ds_order)-.4),xlabel='Site stock (kg C/m²; log scale)',title=interval.replace('-','–')+' cm')
    axes[0].invert_yaxis()
    fig.suptitle(f'Standard-depth site stocks • {label}',fontsize=15,y=1.04)
    fig.text(.5,-.025,'Prepared full-interval stocks; source construction and estimated values differ. Boxes: median/IQR, whiskers: 1.5×IQR; outliers hidden.',ha='center',fontsize=9)
    fig.text(.5,-.08,'Small groups shown as points. These distributions do not estimate Canada-wide stocks. '+source_note,ha='center',fontsize=8.5,color='#58625b')
    fig.tight_layout();save(fig,'soil-site-stocks-'+datum)

previews=json.loads((ROOT/'Comparison/data/previews/previews.json').read_text())
keys=['forest_carbon','scanfi_biomass','esa_cci_2020','canopy_height_max','sothe_stock','soilgrids_ocs','geng_soc_0_5','ncscd_100','li_peat_depth','li_peat_carbon','peatgrids_stock']
selected=[]
for p in previews:
    if p['key'] not in keys:continue
    f=ROOT/'Comparison/data/previews'/p['file'];dest=OUT/('map-'+f.name);shutil.copy2(f,dest)
    selected.append({**p,'file':'images/summaries/'+dest.name})

manifest={'source_commit':'0861884e5414699cac2acab5f08c3ba4464c7490','description':'Illustrative descriptive figures for the summaries-page scaffold; no new AOI totals or full-product raster distributions calculated.','source_files':{},'figures':[p.name for p in OUT.glob('*.png')],'map_previews':selected}
for p in [DER/'profile_intervals.csv',DER/'profile_dataset_summary.csv',DER/'profile_locations.csv',ROOT/'Comparison/data/previews/previews.json']:
    manifest['source_files'][str(p.relative_to(ROOT))]=hashlib.sha256(p.read_bytes()).hexdigest()
(OUT/'source_manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'figures':len(manifest['figures']),'previews':len(selected),'source_commit':manifest['source_commit']}))
