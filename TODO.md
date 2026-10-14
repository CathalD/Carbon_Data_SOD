# Carbon State of Data TODOs

Updated 14 October 2026. Current priority: compile soil maps and verify their GEE references. Community cores are excluded. The covariate notebook is retained unchanged as a reference.

## Soil maps — active

- [ ] Inspect Sothe stock (`carbon_stocks_ca/sc`) and concentration (`carbon_stocks_ca/scc`) collection members, bands, depths, units and uncertainty definitions. Catalogue references exist; runtime access remains unchecked.
- [ ] Inspect SoilGrids SOC, bulk-density, carbon-density and stock images; record actual band names, scaling and available depth intervals. Do not infer six stock bands from the provider's generic six-band description.
- [ ] Finish Geng's ten prediction-layer uploads: bulk density and SOC for 0–5, 5–15, 15–30, 30–60 and 60–100 cm. User-reported first asset: `projects/northstarlabs/assets/canada_carbon_collection/BD_0_5_cm`; ingestion is in progress, not verified complete.
- [ ] Confirm the exact remaining Geng asset IDs rather than treating proposed names as existing assets. Check 100 m grid/CRS, alignment, bands, stored scaling, NoData and physical units. Provider lists SOC in percent and BD in g/cm³.
- [ ] Add Geng Q5/Q95 layers for both properties at all five depths after the prediction layers; keep quantiles separate from predictions. Preserve the source release and Open Government Licence attribution.
- [ ] Obtain NCSCDv2 Canada LAEA 1 km rasters or choose a documented alternative rasterization; public GEE asset not found in the searches performed. Inspect depth fields, masks and stored hg C/m² units before upload/conversion.
- [ ] Obtain Olefeldt thermokarst landscape polygons with attributes and citation; public GEE asset not found in the searches performed. Preserve polygon support instead of assigning a fictitious native raster size.
- [ ] Locate a working Hengl Alberta raster/field-data archive. The published viewer has a certificate hostname mismatch in the verified connection check. Public GEE asset not found in the searches performed.
- [ ] Retain Treat and Janousek as review/core-based references rather than new raster upload tasks. Any independently derived map needs its own provenance.
- [ ] Record image IDs, bands, depths, prediction statistic, uncertainty type, geography, version, licence and runtime verification in the master catalogue spreadsheet.
- [ ] Verify public-read permissions for project-hosted maps intended for community reuse.

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

