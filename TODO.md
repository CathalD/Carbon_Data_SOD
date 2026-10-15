# Carbon State of Data TODOs

Updated 15 October 2026. Current priority: copy external soil maps into the project and complete numerical/provenance checks. Community cores are excluded. The covariate notebook is retained unchanged as a reference.

## Soil maps — active

- [ ] Inspect Sothe stock (`carbon_stocks_ca/sc`) and concentration (`carbon_stocks_ca/scc`) collection members, bands, depths, units and uncertainty definitions. Runtime output confirms two stock/uncertainty images and six concentration point-depth IDs; stock bands and depth definitions still need checking.
- [ ] Inspect SoilGrids SOC, bulk-density, carbon-density and stock images; record actual band names, scaling and available depth intervals. Runtime output confirms six SOC/BD/OCD bands and only `ocs_0-30cm_mean` for stock. Check offset grid origins before pixelwise operations.
- [x] Record completed Geng prediction uploads: all ten exact BD/SOC image IDs supplied on 15 October 2026, each with one band, under ImageCollection `projects/northstarlabs/assets/canada_carbon_collection`. Maintainer runtime output also loads all ten expected IDs, with none missing or extra.
- [ ] Complete metadata and numerical QC for all ten supplied Geng image IDs: 100 m grid/CRS, alignment, band names, stored scaling, NoData and physical units. Runtime access is confirmed in supplied output; provider physical units are SOC % and BD g/cm³.
- [ ] Add Geng Q5/Q95 layers for both properties at all five depths after the prediction layers; keep quantiles separate from predictions. Preserve the source release and Open Government Licence attribution.
- [x] Record supplied NCSCDv2 Canada WGS84 0.012° SOCC30/SOCC100/SOCC200 assets in `projects/carbon-learning-library/assets/`. No further upload requested for these three layers.
- [ ] Verify the three NCSCDv2 imports: expected depth supports 0–30, 0–100 and 100–200 cm, native hg C/m² versus any import conversion, grid, masks and access. Do not assume SOCC200 is cumulative 0–200 cm. The 200–300 cm layer is not yet supplied.
- [x] Record supplied thermokarst reference `projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes`.
- [ ] Complete thermokarst geometry, units, source version and public-permission checks. Supplied output confirms 132,089 features and fields. `TSOC_kgC` is a total-mass label, not stock density; preserve polygon support.
- [ ] Locate a working Hengl Alberta raster/field-data archive. The published viewer has a certificate hostname mismatch in the verified connection check. Public GEE asset not found in the searches performed.
- [ ] Retain Treat and Janousek as review/core-based references rather than new raster upload tasks. Any independently derived map needs its own provenance.
- [ ] Record image IDs, bands, depths, prediction statistic, uncertainty type, geography, version, licence and runtime verification in the master catalogue spreadsheet.
- [ ] Verify public-read permissions for project-hosted maps intended for community reuse.

- [x] Add ABCFlux v2 (ORNL DAAC 2448) to resource tables only, with its own citation; exclude it from map loading/visualization as requested.

- [x] Prepare native-copy script and exact 16-pair provenance manifest for external maps under `soils/maps`; no resampling or conversion.
- [ ] Run `scripts/04_Copy_External_Soil_Maps.js` in GEE; save Console results and confirm all 16 destinations. Prepared is not copied. Geng stays in its existing collection; ABCFlux stays table-only.
- [ ] Check grid alignment before derived products: SoilGrids SOC/BD origins differ from OCD/OCS; NCSCDv2 SOCC30 origin differs from SOCC100/SOCC200.

## Ground-data provenance — deferred

- [ ] Restore NRCan peat source flags: `C_ORG_MEAS_EST`, `C_ORG_EST_TYPE`, `C_TOT_MEAS_EST`, `C_TOT_EST_TYPE`, core measured percentages, and coordinate-accuracy notes. Current v1 omitted these. Preserve measured versus estimated values in analysis/validation.
- [ ] Restore Janousek estuary, ecosystem, ecoregion, climate-zone, tidal-elevation, vegetation, depth-standard stock and estimation/extrapolation metadata by original core ID. Do not replace tidal elevation with an unvalidated generic DEM.
- [ ] Identify Riley's exact OGS report(s)/table, bulk-density units, original core grouping, coordinate derivation and reuse terms; resolve four groups with overlapping intervals before stock integration.
- [ ] Reconcile shared profiles across WoSIS, NPDB, NRCan peat and other compilations before counting independent observations or defining validation folds.
- [ ] Verify source licences and public-read permissions for ground assets; obtaining a table is not proof of unrestricted redistribution rights.

## Covariate evidence — deferred

- [ ] Expand Sothe Table S2's 29 named entries into the reported 40-feature manifest and identify the exact 25 retained features. Definitions are already catalogued in `data/catalogue/sothe_2022_soc_covariates.json`.
- [ ] Recover the Sothe Geoderma concentration release's exact six interval boundaries. GBC prediction point depths alone do not identify them.
- [ ] Resolve Table S2's evapotranspiration resolution discrepancy and soil-class source scale; document historical/current product substitutions.
- [ ] Complete Hengl's exact retained-feature/importance and data-release metadata.
- [ ] Record native grid, model/output grid, extraction footprint/neighbourhood, geographic training/validation context and time period independently for every study stack.

## Forest maps — existing outstanding work

- [ ] Confirm SCANFI v2 download/ingestion status and populate the prepared `forests/maps/scanfi_v2_biomass` collection. Earlier download was reported in progress; completion has not been confirmed.
