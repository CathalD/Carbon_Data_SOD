# Covariates: variables, evidence and scale

Updated 15 October 2026. **Catalogue complete; the 47-band notebook baseline has a completed 20-profile pilot at 30 m. Study-specific and bulk extraction have not run.** The existing [multiscale notebook](../MultiScale_CovariateExtraction.ipynb) is unchanged.

The [master Google Sheet](https://docs.google.com/spreadsheets/d/14PeDcxAptEf7DOpgLtIN93S5dyVWewP6_hn5nvtTjKU/edit) now has three linked planning tabs:

- **Extraction_plan:** 114 named feature/recipe decisions, with source, derivation, reason, evidence, geographic scope, native/output support, time and implementation gaps.
- **Scale_profiles:** 10 geographic/spatial profiles, including field support and proposed validation.
- **Study_stacks:** 11 study/workflow stacks linking evidence to extraction decisions.

Machine-readable versions: [extraction plan](../data/catalogue/covariate_extraction_plan.json), [scale profiles](../data/catalogue/covariate_scale_profiles.json), [study stacks](../data/catalogue/study_covariate_stacks.json). These are JSON tables with stable IDs and scalar cells; the Sheet supports tab-by-tab CSV export.

## What we will extract and why

| Family | Named variables/recipes | Reason and evidence | Use and support |
|---|---|---|---|
| Vegetation and moisture | Sentinel-2 NDVI, EVI, NDMI; seasonal medians and temporal SD; Landsat reflectance/indices; MODIS NDVI/EVI | Vegetation productivity, canopy/substrate moisture and seasonality; documented in soil, peat and forest studies, with retention distinguished per study | 10/20 m Sentinel-2 and 30 m Landsat sources; MODIS 250 m. Sample/aggregate for declared 30, 100 or 250 m analysis grid |
| Radar | Sentinel-1 VV/VH, difference, correctly defined ratios and variability; PALSAR HH/HV | Structural and wetness sensitivity; source-specific Li and national model support | Preserve dB versus linear arithmetic. Li VH/VV is not the notebook's VV/VH. Ambiguous Li ratio/mean recipes are on Hold |
| Terrain and hydrology | Elevation, slope, aspect components, curvature, TPI, relief, wetness/contributing-area indices and landform derivatives | Drainage, water accumulation and landscape position; national soil and regional peat/agriculture evidence | Source DEM and derivative grid explicit. CDEM, SRTM and AW3D30 are not interchangeable bare-earth surfaces; SRTM lacks northern Canada coverage |
| Climate and surface temperature | Daymet temperature/precipitation; TerraClimate temperature/precipitation; ERA5-Land; MODIS LST seasonality and day/night difference | Broad climatic controls and soil temperature/moisture context | Native information remains about 1 km Daymet, 4.6 km TerraClimate, 11.1 km ERA5-Land or 1 km MODIS LST after resampling |
| Land cover and water | Dynamic World tree/shrub/flooded vegetation/water probabilities and temporal variability; JRC water; land-cover proportions | Ecosystem state, wetness and landscape composition | Notebook 30 m samples with explicit 120 m radius context. Validate product coverage and target-date fit |
| Geology and ecology | Surficial/parent materials, bedrock depth, ecozones/ecoregions | Parent material and geographic/ecological context in soil studies | Conditional: original vector/raster support, category encoding and region-holdout validation required |
| Regional peat context | Distance to bay/river, SRTM, seasonal EVI/LST and Sentinel-1 | Li Table S1 identifies 16 Boruta-retained variables for HBL peat depth; TWI was rejected | Coast/river source definitions and two radar recipes are held pending exact source matching; do not imply Canada-wide validity |
| Forest-specific | Landsat/CCDC temporal features, radar, climate/topography, source-specific canopy height summaries | Forest structure, productivity and disturbance history; published national/regional model input evidence | Candidate stack depends on ground response, inventory date, canopy-product lineage and regional validation |
| Coastal field context | Tidal elevation, fines, vegetation/salinity and estuary | Janousek field/local associations | Field-only unless independently mapped and validated; generic DEM is not a substitute for tidal elevation |
| Depth and QA | Layer depth/thickness and profile/core ID; coordinates, missingness and quality indicators | Define response support and prevent leakage/invalid comparisons | Descriptors/QA are not automatically predictors. Existing SOC/BD/carbon/biomass predictions are benchmarks, excluded from default target predictors |

The unchanged notebook defines **43 candidate predictors plus four QA bands**. Its 47-band contract, 2019–2023 composites, 30 m sample grid, and 120 m/1000 m context radii remain unchanged. Its stack definitions were sampled in the [20-profile pilot](soil_covariate_pilot.md); the notebook and bulk exporters remain unchanged. Those baseline candidates are workflow definitions, not 43 independently proven predictors.

Across the 114 decisions there are 43 Notebook baseline, 40 Study-specific, 16 Conditional, four Hold, four Field-only, four QA only, two Exclude and one Required metadata. A row may describe a multi-band recipe (for example the 54 CCDC features); do not treat the row count as a band count. Published input, retained, importance-ranked and proposed features have separate evidence labels.

## Where and at what scale

| Geographic analysis context | Output grid | Field and source support | Application |
|---|---:|---|---|
| Canada, soil properties | 250 m | Group horizons by profile; retain fine-sensor aggregation and coarse climate support | Sothe-based national candidates; SoilGrids benchmark |
| Canada, agricultural soil context | 100 m | Legacy soil points; native DEM, monthly satellite and climate supports retained | Geng stack; agricultural sampling support does not establish equal validation in northern peatlands |
| Hudson and James Bay Lowlands | 30 m | Peat-depth observations; source-specific seasonal radar/optical/thermal composites | Li regional stack; carbon represents a variable modelled whole peat column |
| Alberta agricultural lands | 30 m | Probe intervals, farms and native sensor/DEM support | Hengl regional candidate stack |
| New Brunswick / Canada forest contexts | 30 or 250 m, study dependent | Plot footprints, allometric targets, dates and regional coverage | Separate Betts, SCANFI, Sothe forest and Qin stacks |
| Pacific coastal estuaries | No new uniform raster grid assumed | Cores, local tidal datum, estuary/region and response-depth eligibility | Janousek field associations; BC applicability kept separate |
| Neighbourhood context within a declared study | 30 m output; 120 or 1000 m radius | Radius describes contextual window, not finer information or geographic validation extent | Notebook context profiles |

For continuous fine layers, aggregate to the target cell/support; for categories, use suitable proportions or documented categorical rules. Resampling coarse climate to 30 m does not create 30 m climate observations. Hengl's 100/250 m terrain grids are distinct from proposed neighbourhood radii.

Match source-specific seasonal windows and acquisition dates to ground dates. Historical studies and the unchanged notebook use different periods. Sentinel-2 surface reflectance begins in 2017; a proposed SR recipe cannot silently reproduce a 2015 source record. Source scaling, QA, masks, CRS and grid origin must be explicit before implementation.

## Ground targets, depth and validation

Keep original carbon/BD units, measurement versus estimation, layer top/bottom, datum, sampled thickness, compaction and integration/extrapolation flags. Separate fixed-depth stocks, variable peat-column carbon and concentrations. Sothe's hosted stock and uncertainty remain **0–1 m by maintainer assumption**, not independently source-verified.

Join covariates to profile/core/plot identifiers and coordinates with stated accuracy; do not count horizons or repeated measurements as independent locations. Deduplicate shared source compilations. Group all records from the same profile/plot inside a fold, use spatial/region or farm/estuary holdouts as appropriate, and perform imputation/feature selection inside training folds. These are proposed project validation rules, not claims that each historical study followed them.

Do not use carbon predictions derived from overlapping training observations as default independent covariates for carbon targets. Any later benchmark-assisted model requires explicit lineage and leakage-safe evaluation.

## Evidence and remaining source-matching gaps

- **Li:** [paper and supplement](https://doi.org/10.1029/2024GL110679); [17-entry manifest](../data/catalogue/li_2025_hbl_covariates.json) includes 16 retained and TWI rejected. Exact coast/river vectors and the published ratio/mean radiometric domain remain unresolved.
- **Sothe soil:** [paper](https://doi.org/10.1029/2021GB007213) and [Table S2 catalogue](../data/catalogue/sothe_2022_soc_covariates.json). The 29 named entries, reported 40 candidates and 25 selected features are not an exact reconstructed retained list; evapotranspiration/soil-class support discrepancies remain explicit.
- **Geng:** [paper and Table 1](https://doi.org/10.1038/s41597-025-05460-4). Monthly input families and terrain layers are recorded; the reported 70 inputs are not fabricated into an exact expanded manifest. MODIS LST period/source-release matching remains a gap.
- **Hengl:** [paper](https://doi.org/10.1139/facets-2023-0040); exact retained importance and accessible release remain to be matched. Source-grid scales are kept separate from proposed context radii.
- **Janousek:** [paper](https://doi.org/10.1029/2024GB008239); field drivers are not presumed available wall-to-wall.

Official product links, source dates, units and derivations are included row by row in the extraction plan. Conditional/Hold status prevents unresolved historical definitions being presented as implemented exact reproductions. The catalogue can be complete while those reproduction gaps remain open.

## Pilot result

[Step 4](soil_covariate_pilot.md) returned 20/20 rows with 855/860 predictor values available, all QA fields present and all source-layer joins valid. One coastal ERA5-Land mask gap and radar ratio tail/default-median sensitivity require review before bulk processing. The Sheet now includes Pilot_QC. This is not model validation and does not implement every study-specific feature or 100/250 m adaptation.

## Access and scope

The maintainer confirms all map/layer/profile access complete on 15 October 2026. Owned current assets are marked **Maintainer reports public**, with [dated access record](../data/catalogue/access_status_20261015.json); no independent anonymous access test is claimed. Historical restricted training data remain restricted unless separately released.

Circumpolar thermokarst/Olefeldt work is deferred by maintainer. NCSCDv2 maps remain historical references; no active circumpolar covariate extraction. Community cores remain excluded and ABCFlux remains a table-only resource.
