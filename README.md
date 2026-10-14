# Carbon State of Data

A community catalogue of forest and soil carbon data for Canada, connecting field observations, environmental covariates and carbon maps.

**Plot observations → landscape covariates → fitted models → carbon maps**

Field observations establish the relationship between carbon and ecosystem characteristics. Spatial covariates extend that relationship across the landscape through a fitted model. For forests, inventories often measure tree dimensions and species; biomass and carbon are then estimated using documented allometric equations and conversion factors.

This repository is being built, starting with forest resources. The catalogue spreadsheet will record sources, access conditions, Earth Engine asset IDs, scales, units, methods and uncertainty. Expand the entries below for details.

## Scales and evidence

| Scale | Information to record |
|---|---|
| Geographic context | Observation coverage, training/validation regions, local modelling zones and final map extent |
| Raster resolution | Native covariate pixel spacing and the grid used for extraction, modelling and map output |
| Observation support | Plot area, nested plots, measurement dates and coordinate accuracy |
| Extraction scale | Pixel, plot footprint, buffer or neighbourhood used to extract predictors |
| Temporal context | Field measurement date, covariate acquisition/composite period and prediction year |

<details>
<summary>How to interpret scale and predictive evidence</summary>

A Canada-wide map may combine regional models, and observations may be unevenly distributed across provinces. Record these separately. A 30 m pixel is not a 30 m field plot, and resampling a coarse layer to a finer grid does not create finer observations.

Each study–covariate entry will record whether a variable was considered, retained after selection, ranked by importance, or tested through a predictive comparison. Record the validation design, metric and study region. Whole-model performance does not establish the independent contribution of every predictor or its performance in a new region.

Ground measurements, photo-interpreted attributes, allometrically estimated biomass, satellite-derived estimates and map predictions retain their own provenance.

</details>

## 1. Forest ground observations

| Resource | Measurements and geographic context | Access and connection to studies |
|---|---|---|
| Canada's National Forest Inventory (NFI) | National ground-plot forest measurements | [Access/contact](https://nfi.nfis.org/en/contact) and [request form](https://nfi.nfis.org/en/datarequestform); coordinate precision and redistribution require confirmation |
| Québec permanent sample plots | Tree and ecological observations in 400 m² plots, principally south of 52° N | [Public GeoPackage and documentation](https://www.donneesquebec.ca/recherche/dataset/placettes-echantillons-permanentes-1970-a-aujourd-hui); used for SCANFI external validation |
| New Brunswick Continuous Land Inventory (CLI) | Regional forest plots used by Betts et al. | [Study](https://onlinelibrary.wiley.com/doi/full/10.1111/gcb.17541) and [analysis archive](https://doi.org/10.6084/m9.figshare.27055528.v1); complete geolocated inventory availability remains to be checked |
| NRCan ENFOR sampled-tree biomass | Canadian tree-level destructive biomass measurements | [Dataset](https://open.canada.ca/data/en/dataset/fbad665e-8ac9-4635-9f84-e4fd53a6253c); supports national allometric equations |
| NASA ABoVE burned/unburned forest plots | Field measurements and derived carbon pools in Alaska, Northwest Territories and Saskatchewan, 1983–2016 | [Published CSV dataset](https://daac.ornl.gov/ABOVE/guides/ABoVE_Plot_Data_Burned_Sites.html); boreal disturbance applications |
| Ontario Vegetation Sampling Network (VSN) | Ground plots supporting Ontario's LiDAR-enhanced forest inventory | [Government description](https://publications.gc.ca/collections/collection_2025/rncan-nrcan/Fo123-2-40-2025-eng.pdf); public measurement download not yet confirmed |

<details>
<summary>NFI — national ground measurements and access</summary>

Request tree measurements, plot metadata, measurement dates, biomass estimates and their calculation methods. Specify the intended geographic area and ask which coordinates can be supplied for covariate extraction.

The [NFI access policy](https://nfi.nfis.org/resources/general/NFI-Business-Process-Version-8.0.pdf) distinguishes access to plot measurements from access to precise locations. Permission to obtain data does not establish permission to republish them in Earth Engine.

Catalogue the request route where public redistribution is unavailable. Keep ground plots separate from NFI photo-plots.

</details>

<details>
<summary>Québec permanent plots — open regional data and repeated measurements</summary>

The dataset describes more than 12,000 permanent plots established since 1970, with repeated measurements. Observations include species, diameter, selected heights and ages, and ecological characteristics.

Download the GeoPackage, code dictionary and README together. The [data guide](https://www.mrnf.gouv.qc.ca/documents/forets/inventaire/guide-donnees-dendometriques.pdf) describes relational tables and the plot–measurement key `ID_PE_MES`. Preserve measurement occasions when joining trees to plots.

The dataset page specifies CC BY 4.0. Ground-plot biomass must retain its allometric method. Québec plots provide a documented external-validation connection to the [SCANFI study](https://doi.org/10.1139/cjfr-2023-0118).

</details>

<details>
<summary>New Brunswick CLI — regional reference data for Betts et al.</summary>

The study used 6,049 plots established in 2016–2020, with 400 m² main plots and nested 50 m² small-tree plots. Tree observations were converted to plot biomass using documented equations.

The publication links an analysis archive, but we have not inspected it to confirm availability of the full geolocated tree/plot inventory. Retain that distinction between an analysis archive and a verified ground-data download.

</details>

<details>
<summary>ENFOR — measured tree biomass and allometric calibration</summary>

Nearly 9,000 trees from 33 species have dry-mass observations for stem wood, stem bark, branches, foliage and twigs. These underpin the Lambert et al. (2005) and Ung et al. (2008) national biomass equations.

- [English CSV](https://apps-scf-cfs.rncan.gc.ca/opendata/Enfor/EnforCanadaBiomassFinalData_v2007-ENG.csv)
- [English metadata](https://apps-scf-cfs.rncan.gc.ca/opendata/Enfor/EnforCanadaBiomassMetadata_v2010-ENG.doc)
- [NRCan biomass calculator and equation parameters](https://apps-scf-cfs.nrcan.gc.ca/calc/en/biomass-calculator?wbdisable=true)

These are tree-level calibration observations. Check coordinates and sampling support before treating them as geolocated plot targets. The government record specifies the Open Government Licence – Canada.

</details>

<details>
<summary>ABoVE — boreal field observations and disturbance carbon</summary>

The synthesis includes burned and unburned sites, tree biophysical measurements, stand age, disturbance history, soil organic-layer measurements and derived combustion estimates.

Retain field measurements separately from reconstructed or calculated carbon pools. Its sampling context is boreal disturbance; link it to the corresponding studies before proposing a general forest-biomass predictor stack.

Download formats and variable definitions are described in the [dataset guide](https://daac.ornl.gov/ABOVE/guides/ABoVE_Plot_Data_Burned_Sites.html). A public GEE table has not yet been confirmed.

</details>

<details>
<summary>Ontario VSN — regional ground plots for LiDAR-supported inventory</summary>

The network supports calibration and validation of Ontario's LiDAR-enhanced forest resources inventory. Catalogue it as a ground-data resource whose access route still needs confirmation.

Obtain the measurement tables, field protocol, dates, plot footprints, coordinate accuracy and redistribution terms from the provider before preparing public GEE assets.

</details>

## 2. Study-supported covariates

| Study | Geographic modelling context | Model/map grid | Predictor evidence |
|---|---|---|---|
| [Betts et al. 2024](https://onlinelibrary.wiley.com/doi/full/10.1111/gcb.17541) | New Brunswick; overlapping 60 × 60 km local zones plus a province-wide model | 30 m | 54 Landsat CCDC features; held-out biomass correlation r = 0.77 |
| [Sothe et al. 2022](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2021GB007213) | Canada-wide forest mapping; reference observations concentrated in BC with additional provinces | 250 m | 58 of 78 predictors retained; canopy-height metrics ranked highest, followed by PALSAR and Landsat variables; five-fold R² = 0.52 |
| [Qin et al. 2025](https://doi.org/10.1016/j.isprsjprs.2025.05.022) | Canada's treed lands | 30 m | Seasonal Sentinel-1/2 and annual L-band SAR; stratified ten-fold validation; exact feature definitions and rankings still to extract |
| [Guindon et al. 2024 — SCANFI](https://doi.org/10.1139/cjfr-2023-0118) | National output assembled from regional tile models | 30 m | Summer/winter Landsat, climate, terrain and auxiliary predictors; photo-plot training and external ground validation |

<details>
<summary>Betts — regional Landsat time-series stack</summary>

The stack contains eight harmonic coefficients plus one fitting RMSE per spectral band, across six bands: 54 variables. Model zones generally required at least 100 CLI plots. The mapping period was 1985–2020.

Initial implementation: six-band Landsat surface reflectance and derived CCDC intercept, trend, seasonal harmonic coefficients and fitting error. Preserve temporal matching to plot measurements.

The original workflow used Landsat Collection 1. A Collection 2 implementation must document its preprocessing changes and be validated.

</details>

<details>
<summary>Sothe — national forest structure, radar and reflectance stack</summary>

Initial implementation: maximum canopy height, height percentiles 85 and 95, PALSAR HH/HV backscatter, Landsat reflectance and documented spectral indices. Confirm individual retained features against Supporting Information Table S1.

Most forest covariates represented 2015–2019 and were aggregated/resampled to 250 m. The published height metrics came from spatial modelling of ICESat-2 observations.

The methods identify BC provincial observations and NFI observations from other provinces. Some rounded coordinates were unsuitable for 250 m spatial matching. The exact BC source release remains to be identified.

</details>

<details>
<summary>Qin — national seasonal optical and radar stack</summary>

Proposed extraction variables: Sentinel-1 VV/VH and seasonal Sentinel-2 reflectance, alongside annual PALSAR HH/HV. The paper supports the multi-sensor modelling approach; the exact band subset, seasonal windows, transformations and variable-level evidence must be recovered before calling this a reproduced study stack.

[Publication and access links](https://www.sciencedirect.com/science/article/pii/S0924271625002096) include the authors' GEE App and mapping scripts. Match the forest mask, observation dates and validation procedure.

</details>

<details>
<summary>SCANFI — regional models, photo-interpreted targets and ground validation</summary>

SCANFI v1 trained on NFI photo-interpreted plots; biomass targets included estimates derived from inventory volume and biomass equations. Ground plots served external validation.

Initial implementation: summer and winter Landsat reflectance composites. Climate, terrain and auxiliary layers will be specified after extracting their exact definitions from the methods.

Record regional modelling/search support alongside the 30 m output grid. Keep internal photo-plot validation and independent ground validation metrics separate. Version 2 metadata and methods must be recorded separately from the 2024 v1 study.

</details>

### Covariates proposed for the first extraction workflows

These variables are planned; extraction scripts and derived assets are not yet published. Study-specific subsets will retain their own definitions and evidence.

| Covariate family | Variables to extract or derive | Source pixel spacing | Intended modelling grid/context | Source and implementation status |
|---|---|---|---|---|
| Landsat reflectance | Blue, green, red, NIR, SWIR1, SWIR2 | 30 m | Regional 30 m; national 250 m after aggregation | [Collection 2 Landsat 8 example](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2); sensor/date harmonization required for longer series |
| Landsat temporal features | CCDC intercept, trend, three sine/cosine pairs and fitting RMSE per band; summer/winter reflectance composites | Derived from 30 m observations | Betts regional 30 m and SCANFI tile models | Derived features with study-specific fitting/composite rules |
| Canopy height | Maximum, p85 and p95 height | 250 m mapped product; underlying LiDAR observations are samples | Sothe national 250 m | [Study-linked height collection](https://gee-community-catalog.org/projects/scs/), `projects/sat-io/open-datasets/carbon_stocks_ca/ch`; image/band selection pending |
| L-band radar | HH and HV backscatter | 25 m | National 30 m or 250 m stacks | [PALSAR yearly mosaics](https://developers.google.com/earth-engine/datasets/catalog/JAXA_ALOS_PALSAR_YEARLY_SAR); match release, years and calibration to the study |
| C-band radar | VV and VH backscatter; seasonal summaries | Collection includes different resolutions; choose a documented acquisition subset | Qin-style national 30 m; study-specific 250 m use | [Sentinel-1 GRD](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD), `COPERNICUS/S1_GRD`; seasonal definitions pending |
| Sentinel-2 reflectance | Red, red-edge, NIR and SWIR bands; seasonal summaries | 10–20 m for these bands | Qin-style national 30 m | [Harmonized surface reflectance](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED); exact subset and seasonal windows pending |
| Terrain | Elevation, slope and study-defined topographic indices | Depends on source DEM | Study-specific regional/national grids | Exact DEM, index definitions and neighbourhoods pending methods extraction |
| Climate and radiation | Study-defined temperature, precipitation and radiation summaries | Depends on source product | National gradients and regional context | Exact variables, temporal periods and datasets pending methods extraction |
| Ecological context | Forest type, species context and soil type where supported by methods | Depends on source product | Stratification, conversion or predictor role recorded separately | Exact study roles and retained variables pending; not all contextual layers are biomass predictors |

Covariate availability, temporal coverage, masking and aggregation rules must accompany every extraction workflow. For new regions, evaluate the selected stack with local observations.

## 3. Forest maps and modelled inventories

| Resource | Description | Access |
|---|---|---|
| McMaster/WWF forest carbon | Canadian forest carbon stock and uncertainty maps at 250 m | [Awesome GEE](https://gee-community-catalog.org/projects/scs/) |
| SCANFI v1.2 | Canadian 2020 forest attributes, including aboveground biomass, at 30 m | [Earth Engine catalogue](https://developers.google.com/earth-engine/datasets/catalog/projects_gcpm041u-lemur_assets_scanfi_v12_SCANFI_v1_2) |
| ESA CCI Biomass v6 | Aboveground woody biomass and uncertainty for selected years from 2007–2022 | [Awesome GEE](https://gee-community-catalog.org/projects/cci_agb/) |
| Canadian Satellite-Based Forest Inventory | Modelled forest polygons with biomass, structure, species and disturbance attributes | [Awesome GEE](https://gee-community-catalog.org/projects/ca_sbfi/) |

<details>
<summary>McMaster/WWF — carbon pools and exact asset references</summary>

The forest stock product includes aboveground, belowground and dead plant material, with carbon-stock units of kg C/m².

- Stock image: `projects/sat-io/open-datasets/carbon_stocks_ca/fc/fc_250m_version10`
- Uncertainty image: `projects/sat-io/open-datasets/carbon_stocks_ca/fc/fc_uncertainty_250m_version10`
- Both images use band `b1`; checked nominal pixel size is approximately 250.02 m.

Match the uncertainty image's definition to the source release before interpreting its values. Ground sources and predictor evidence are described in the Sothe entry above.

</details>

<details>
<summary>SCANFI — existing 2020 asset and historical v2 downloads</summary>

- Existing GEE image: `projects/gcpm041u-lemur/assets/scanfi_v12/SCANFI_v1_2`
- Biomass band: `biomass`, in tonnes/ha.
- Other attributes include height, crown closure, land cover and species composition.

[SCANFI v2 downloads](https://download-telecharger.services.geo.ca/pub/nrcan_rncan/Forests_Foret/SCANFI/v2/) provide 30 m maps in five-year intervals from 1985–2025. Our v2 GEE collection is being prepared; the existing public v1.2 asset is a separate release.

</details>

<details>
<summary>ESA CCI — biomass time series and standard deviation</summary>

GEE ImageCollection: `projects/sat-io/open-datasets/ESA/ESA_CCI_AGB`

Version 6 has ten images: 2007, 2010 and each year from 2015–2022. Bands are `AGB` and `SD`, representing aboveground woody biomass and its standard deviation in Mg/ha. The product uses a 100 m grid.

Retain its calibration and validation provenance from the source documentation. Satellite-derived estimates do not replace field observations in the ground-data catalogue.

</details>

<details>
<summary>SBFI — modelled stand polygons and biomass summaries</summary>

GEE FeatureCollection: `projects/sat-io/open-datasets/CA_FOREST/CA_SBFI/CA_SBFI_MERGED`

Confirmed field names:

| Field | Meaning | Units |
|---|---|---|
| `088_STRUCTURE_AGB_AVG` | Mean aboveground biomass density | tonnes/ha |
| `089_STRUCTURE_AGB_SD` | Within-polygon biomass variation | tonnes/ha |
| `091_STRUCTURE_AGB_TOTAL` | Total aboveground biomass | tonnes |
| `003_AREA_HA` | Polygon area | ha |

SBFI describes modelled stand conditions for 2020 with disturbance information for 1985–2020. Its polygons are a modelled inventory product. The biomass SD is a spatial summary statistic, not a model prediction-error estimate.

</details>

## Scope

- Field plot and soil core observations.
- Ecological, geographic, climatic and remote sensing covariates.
- Forest biomass, forest carbon and soil carbon maps.

Biomass and carbon are recorded separately. Consult each dataset's definitions, units, uncertainty documentation and licence before combining products. Source dependencies will be linked through ground-data, covariate-stack, study and map identifiers in the catalogue spreadsheet.

## Contributing

Suggest additions or corrections through [GitHub Issues](https://github.com/CathalD/Carbon_Data_SOD/issues). Include the dataset name, source link or DOI, licence, geographic context, pixel/plot support, and Earth Engine asset ID if available. For covariates, include the supporting study and predictive evidence.

Each dataset retains its original licence and citation requirements.
