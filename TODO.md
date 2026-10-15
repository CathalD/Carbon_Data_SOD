# Carbon State of Data TODOs

Updated 15 October 2026. Current status: complete maintainer pixel-mode QC received; map/layer/profile access complete per maintainer. Covariate catalogue finished; 20-profile baseline pilot completed with coverage/radar review flags before bulk processing. Circumpolar thermokarst/Olefeldt deferred. Community cores are excluded. The covariate notebook is retained unchanged as a reference.

## Step 4 — extraction pilot complete

- [x] Select four Canadian profiles from each of five hosted sources, seed 20261015; Janousek restricted to BC.
- [x] Execute the unchanged 47-band baseline at 20 points: 20 rows retained, 855/860 predictor cells available, all 80 QA values present.
- [x] Verify all 20 source-layer links (367 horizon rows), schema, finite/range checks, coordinates and source-coverage masks.
- [x] Diagnose one coastal climate gap and radar ratio tails; verify default/exact median discrepancy at the largest-tail point.
- [x] Publish [pilot report](docs/soil_covariate_pilot.md), aggregate QA and Pilot_QC Sheet tab. Detailed CSV/manifests remain local.
- [ ] Obtain explicit approval before publishing exact selected-profile coordinates and detailed rows to GitHub; automatic review rejected that payload.
- [ ] Define explicit coastal climate handling and versioned median/robust-radar policy; rerun affected points before bulk extraction.
- [ ] Define modelling eligibility and temporal/coordinate support for historical profiles; validate 100/250 m and study-specific stacks separately.

## Current catalogue additions

- [x] Maintain the existing Google Sheet (16 tabs), adding 17 detailed Li evidence entries (217 total), 114 extraction decisions, 10 scale profiles and 11 study/workflow stacks.
- [x] Publish [covariate plan](docs/covariate_extraction_plan.md), machine-readable tables, Li Table S1 manifest and dated maintainer access record.
- [ ] Implement versioned extraction after resolving each selected Hold/Conditional dependency, preserving native support, response depth and leakage-safe grouped/spatial validation.

## Master catalogue — original step 1 complete (historical counts)

- [x] Create the [native Google Sheets master catalogue](https://docs.google.com/spreadsheets/d/14PeDcxAptEf7DOpgLtIN93S5dyVWewP6_hn5nvtTjKU/edit): 10 linked tabs, 24 study records, 28 ground-data resources, 29 study-ground links, 200 covariate/evidence entries, 28 map records, 51 asset records, 20 other sources, all 117 non-empty original spreadsheet rows and a data dictionary.
- [x] Separate geographic analysis scope, native raster grid, model/output grid, extraction support, temporal context and depth basis; record ground data used by each study and unresolved evidence explicitly.
- [x] Verify all 8,873 populated cells against the authored catalogue, apply filters/frozen identifiers and status/evidence dropdowns, and preserve source URLs for export.
- [ ] Step 2: complete the metadata, numerical and public-access checks below before derived products or new extraction workflows. The Sheet does not certify unresolved assets or reproduce every study's exact retained feature list.

## Step 2 — soil depth, methods and quality checks

- [x] Add QC_register (30 assets), Soil_methods (five hosted ground sources and 18 soil-map records) and Soil_depth_QC to the existing Google Sheet; preserve original source rows.
- [x] Audit local layer boundaries, gaps, overlaps and thickness semantics; record exact preparation hashes and distinguish local evidence from live GEE readback.
- [x] Record NRCan peat SAMP_CARB_MGHA → TOTC_Stock naming mismatch, repeated whole-core Org_C_MGHA, missing carbon estimation flags, and Janousek sampled-depth thresholds/extrapolation.
- [x] Verify provider units/depth/method documentation for SoilGrids, Geng, NCSCDv2 and Li; retain uncertainty/import caveats and the Sothe 0–1 m working assumption.
- [x] Prepare read-only [06_Soil_Map_QC.js](scripts/06_Soil_Map_QC.js), exact-ID manifest and [run instructions](docs/soil_quality_checks.md). JavaScript syntax and 30-ID manifest validated locally.
- [x] Receive first maintainer metadata pass: all 30 destinations returned metadata (29 Image, one Table). Original type_mismatch flags were a script parser bug; 19 copied images have matching returned band metadata. Evidence archived.
- [x] Receive corrected QC v2026-10-15.2 metadata and pixel outputs: full WKT, Geng collection-scope ACL and thermokarst geometry inventory. Source/copy both contain 95 Empty features and mixed geometry; polygon suitability remains unresolved.
- [x] Complete native-grid pixel pass: maintainer summary planned=30, reported=30, pixel_checks_requested=true. All 19 copied images have zero sampled value/mask mismatches; ten Geng images sampled without original-TIFF comparison; thermokarst inventories match. Archive: data/catalogue/soil_map_qc_pixels_complete_20261015.json. Full raster equivalence and source encoding remain unverified.
- [ ] Resolve flagged depth intervals, missing method/estimation provenance and source units before publishing standardized-depth stocks. Review 182 Janousek thickness/boundary discrepancies against original sampling/compaction semantics.
- [ ] Restore omitted source method/estimation fields in new versioned profile preparations after agreeing on correction rules; do not overwrite current assets during QC.

- [x] Receive partial pixel output: A001–A004 have zero sampled value/mask mismatches (207/229/264/265 common valid pixels from 512 seeded points each). Other six supplied rows report not_run; no final summary provided.
- [x] Retain completed current pixel-run summary and all 30 results. No numerical execution errors reported; 19 copied-image sample agreements. Historical returned copy/collection ACL scopes had no public grant. Superseded for current access status by maintainer confirmation on 15 October; independent verification not claimed.

## Soil maps — active

- [ ] Inspect Sothe stock (`carbon_stocks_ca/sc`) and concentration (`carbon_stocks_ca/scc`) collection members, bands, depths, units and uncertainty definitions. Runtime output confirms two stock/uncertainty images and six concentration point-depth IDs; stock and uncertainty each have one `b1`. Both use 0–1 m under the maintainer's working assumption; source confirmation remains deferred.
- [ ] Inspect SoilGrids SOC, bulk-density, carbon-density and stock images; record actual band names, scaling and available depth intervals. Runtime output confirms six SOC/BD/OCD bands and only `ocs_0-30cm_mean` for stock. Check offset grid origins before pixelwise operations.
- [x] Record completed Geng prediction uploads: all ten exact BD/SOC image IDs supplied on 15 October 2026, each with one band, under ImageCollection `projects/northstarlabs/assets/canada_carbon_collection`. Maintainer runtime output also loads all ten expected IDs, with none missing or extra.
- [ ] Complete metadata and numerical QC for all ten supplied Geng image IDs: 100 m grid/CRS, alignment, band names, stored scaling, NoData and physical units. Runtime access is confirmed in supplied output; provider physical units are SOC % and BD g/cm³.
- [ ] Add Geng Q5/Q95 layers for both properties at all five depths after the prediction layers; keep quantiles separate from predictions. Preserve the source release and Open Government Licence attribution.
- [x] Record supplied NCSCDv2 Canada WGS84 0.012° SOCC30/SOCC100/SOCC200 assets in `projects/carbon-learning-library/assets/`. No further upload requested for these three layers.
- [ ] Verify the three NCSCDv2 imports: expected depth supports 0–30, 0–100 and 100–200 cm, native hg C/m² versus any import conversion, grid, masks and access. Do not assume SOCC200 is cumulative 0–200 cm. The 200–300 cm layer is not yet supplied.
- [x] Record supplied thermokarst reference `projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes`.
- Deferred by maintainer: thermokarst geometry, units and source-version follow-up. Access completed per maintainer. Supplied output confirms 132,089 features and fields. `TSOC_kgC` is a total-mass label, not stock density; preserve polygon support.
- [ ] Locate a working Hengl Alberta raster/field-data archive. The published viewer has a certificate hostname mismatch in the verified connection check. Public GEE asset not found in the searches performed.
- [ ] Retain Treat and Janousek as review/core-based references rather than new raster upload tasks. Any independently derived map needs its own provenance.
- [ ] Record image IDs, bands, depths, prediction statistic, uncertainty type, geography, version, licence and runtime verification in the master catalogue spreadsheet.
- [x] Maintainer confirms access to all maps/layers/profiles complete on 15 October 2026. Record owned assets as Maintainer reports public; no independent anonymous-session test claimed.

- [x] Add ABCFlux v2 (ORNL DAAC 2448) to resource tables only, with its own citation; exclude it from map loading/visualization as requested.

- [x] Prepare native-copy script and exact 16-pair provenance manifest for external maps under `soils/maps`; no resampling or conversion.
- [x] Run `scripts/04_Copy_External_Soil_Maps.js` in GEE and confirm all 16 destinations: maintainer output reports copied=16, failed=0, skipped_existing=0, each with expected type. Geng stays in its existing collection; ABCFlux stays table-only. Evidence summary is recorded in the copy manifest.
- [ ] Check grid alignment before derived products: SoilGrids SOC/BD origins differ from OCD/OCS; NCSCDv2 SOCC30 origin differs from SOCC100/SOCC200.

## Li regional peat maps — new batch

- [x] Catalogue four supplied Li et al. (2025) Hudson Bay Lowlands GEE IDs, paper and Borealis archive; record regional 30 m output and variable modelled peat-depth support.
- [x] Copy all four Li maps into `soils/maps/li_2025_hbl`: maintainer output confirms four individual copied/type-readback results and four successful local metadata results. One `b1`, 30 m nominal scale and identical affine transforms; short CRS null, properties empty. Total copied assets now 20, across the original 16 and Li four.
- [ ] Check Li imported units/scaling, CRS, pixel alignment, masks and uncertainty encoding against archived files. Keep variable-depth stocks distinct from fixed-depth SOC products.
- [ ] Catalogue Li public validation peat depths, with source licence and duplicate checks. Training depths require an MNR agreement; do not list as open.
- [x] Catalogue Li Table S1: 16 Boruta-retained variables plus rejected TWI, native/output support, dates and regional context. Exact coastline/river source and two radar arithmetic recipes remain explicitly on Hold.
- [x] Assign Sothe `sc_250m_v20` and `sc_uncertainty_250m_v20` to 0–1 m as explicitly requested by the maintainer; retain a working-assumption label, not source verification.
- [ ] Independently confirm the assumed Sothe 0–1 m depth against original release identity when available; verify uncertainty definition, units and the differing grid origins before paired analysis.

## Ground-data provenance — deferred

- [ ] Restore NRCan peat source flags: `C_ORG_MEAS_EST`, `C_ORG_EST_TYPE`, `C_TOT_MEAS_EST`, `C_TOT_EST_TYPE`, core measured percentages, and coordinate-accuracy notes. Current v1 omitted these. Preserve measured versus estimated values in analysis/validation.
- [ ] Restore Janousek estuary, ecosystem, ecoregion, climate-zone, tidal-elevation, vegetation, depth-standard stock and estimation/extrapolation metadata by original core ID. Do not replace tidal elevation with an unvalidated generic DEM.
- [ ] Identify Riley's exact OGS report(s)/table, bulk-density units, original core grouping, coordinate derivation and reuse terms; resolve four groups with overlapping intervals before stock integration.
- [ ] Reconcile shared profiles across WoSIS, NPDB, NRCan peat and other compilations before counting independent observations or defining validation folds.
- [x] Record ground-asset access completed per maintainer on 15 October 2026.
- [ ] Verify original source licences/redistribution terms; access to a hosted table does not establish every historical source's reuse terms.

## Covariate catalogue — complete; historical reproduction gaps remain

- [ ] Expand Sothe Table S2's 29 named entries into the reported 40-feature manifest and identify the exact 25 retained features. Definitions are already catalogued in `data/catalogue/sothe_2022_soc_covariates.json`.
- [ ] Recover the Sothe Geoderma concentration release's exact six interval boundaries. GBC prediction point depths alone do not identify them.
- [ ] Resolve Table S2's evapotranspiration resolution discrepancy and soil-class source scale; document historical/current product substitutions.
- [ ] Complete Hengl's exact retained-feature/importance and data-release metadata.
- [x] Finish Extraction_plan (114 decisions/recipes), Scale_profiles (10 profiles) and Study_stacks (11 stacks). Separate native/output grids, field/context support, time/depth and proposed validation. Preserve unchanged notebook; no extraction executed.

## Forest maps — existing outstanding work

- [ ] Confirm SCANFI v2 download/ingestion status and populate the prepared `forests/maps/scanfi_v2_biomass` collection. Earlier download was reported in progress; completion has not been confirmed.

## Other resources — targeted gap review, 15 October 2026

- [x] Add README Other resources section, 20-resource regional/pool review and structured discovery register. These entries are not new GEE ingestions.
- [ ] Inspect documented PEATGRIDS GEE bands, release 2.0.1 stock units, variable-depth basis, Canadian mask and uncertainty; then decide which assets to copy.
- [ ] Assess Shaw upland forest profiles and revised McNicol BC soil database together: retain original depth datum, location/estimation flags, shared-source relationships and reuse terms.
- [ ] Inspect Arsenault Argenteuil and Martens coastal BC original archive files; distinguish new observations from existing NRCan peat data and bathymetric grid from regional output support.
- [ ] Inspect Gross Alberta multi-pool CSVs and Pendea Lake Simcoe cores for coordinates, depths, units and licences before ingestion.
- [ ] Catalogue Epstein marine-sediment stock/density/uncertainty rasters as a distinct marine pool; check masks, source observations and native versus output grid.
- [ ] Inspect Lamping regional forest biomass/structure release; identify released snag products and documented carbon conversion; underlying true plot data are confidential.
- [ ] Cross-match Clayoquot/Cowichan source/core IDs against Janousek before adding observations.
- [ ] Use Can-Peat as a metadata portal, C-PEAT as a separately deduplicated Canadian-core candidate and Hugelius v2 as coarse reference; do not count metadata listings as data.
- [ ] Pursue grassland/root biomass, deadwood/litter and Atlantic/Arctic coastal-data gaps. Pyle pasture coordinates are withheld; Chizen/Cowichan raw archives remain author-request leads. No messages have been sent.
