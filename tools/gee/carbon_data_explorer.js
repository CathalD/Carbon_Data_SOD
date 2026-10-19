/*******************************************************************************
 * Carbon Data Explorer
 * State of Carbon Data in Canada: Earth Engine app (tool 1)
 *
 * Explore Canada's soil and forest carbon maps, soil profiles and peat cores,
 * and the covariates the mapping studies used, for an area of interest that you
 * draw or load from an Earth Engine table asset.
 *
 *   Repository : https://github.com/CathalD/Carbon_Data_SOD  (tools/gee/)
 *   Site       : https://cathald.github.io/Carbon_Data_SOD/
 *
 * Rules the app follows (the same as the site's comparisons):
 *   - Every map is shown as published or with a documented calculation. Each
 *     layer's About card says what the original data were, what was calculated
 *     and what is shown.
 *   - Carbon and biomass per area are shown in kg/m². Area totals are given in
 *     kg and in tonnes or megatonnes, and are never added across products or
 *     pools. Uncertainty is summarised as an area mean, never summed.
 *   - No map is treated as truth.
 *
 * Publish: paste into the Code Editor, Run, then Apps > New app. Every asset
 * below is public. An area-of-interest asset pasted by a viewer must be public
 * (or shared with the app's Cloud project).
 *
 * The CATALOGUE block is generated: refresh it with
 *   python tools/gee/build_catalogue_block.py
 ******************************************************************************/

// @@DATA-START ----------------------------------------------------------------
var VERSION = '1.0.0';
var REPO = 'https://github.com/CathalD/Carbon_Data_SOD';
var SITE = 'https://cathald.github.io/Carbon_Data_SOD/';

var SOILS = 'projects/northstarlabs/assets/carbon_state_of_data/soils';
var MAPS = SOILS + '/maps';
var PROFILES = SOILS + '/profiles';
var GENG = 'projects/northstarlabs/assets/canada_carbon_collection';
var SATIO = 'projects/sat-io/open-datasets';
var SCANFI = 'projects/gcpm041u-lemur/assets/scanfi_v12/SCANFI_v1_2';
var SBFI = SATIO + '/CA_FOREST/CA_SBFI/CA_SBFI_MERGED';
var THERMOKARST = MAPS + '/olefeldt_2016/Circumpolar_Thermokarst_Landscapes';

var CANADA = ee.Geometry.Rectangle([-141.1, 41.6, -52.5, 83.2], null, false);
var INTERVALS = [[0, 5], [5, 15], [15, 30], [30, 60], [60, 100]];
var ESA_YEARS = [2007, 2010, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
var SUMMARY_CRS = 'EPSG:3978';       // Canada Atlas Lambert; areas come from ee.Image.pixelArea()
var MAX_SUMMARY_PIXELS = 5e6;        // larger areas are summarised on a coarser grid, which is stated

// ==== BEGIN GENERATED CATALOGUE (tools/gee/build_catalogue_block.py, 2026-10-16) ====
var CATALOGUE = {
  "built": "2026-10-16",
  "revision": "6b12578",
  "studies": {
    "S_BETTS_2024": {"name": "Betts et al. 2024", "year": "2024", "url": "https://doi.org/10.1111/gcb.17541", "domain": "forests"},
    "S_SOTHE_FOREST_2022": {"name": "Sothe et al. 2022 forest carbon", "year": "2022", "url": "https://doi.org/10.1029/2021GB007213", "domain": "forests"},
    "S_QIN_2025": {"name": "Qin et al. 2025", "year": "2025", "url": "https://doi.org/10.1016/j.isprsjprs.2025.05.022", "domain": "forests"},
    "S_SCANFI_V1": {"name": "Guindon et al. 2024 SCANFI v1", "year": "2024", "url": "https://doi.org/10.1139/cjfr-2023-0118", "domain": "forests"},
    "S_MATASCI_2018": {"name": "Matasci et al. 2018", "year": "2018", "url": "", "domain": "forests"},
    "S_SOTHE_CONC_2022": {"name": "Sothe et al. 2022 Geoderma", "year": "2022", "url": "https://doi.org/10.1016/j.geoderma.2021.115402", "domain": "soils"},
    "S_SOTHE_SOC_2022": {"name": "Sothe et al. 2022 GBC soil stocks", "year": "2022", "url": "https://doi.org/10.1029/2021GB007213", "domain": "soils"},
    "S_SOILGRIDS_2021": {"name": "Poggio et al. 2021 SoilGrids 2.0", "year": "2021", "url": "https://doi.org/10.5194/soil-7-217-2021", "domain": "soils"},
    "S_GENG_2025": {"name": "Geng et al. 2025 Soil Landscape Grids", "year": "2025", "url": "https://doi.org/10.1038/s41597-025-05460-4", "domain": "soils"},
    "S_HENGL_2023": {"name": "Hengl et al. 2023 Alberta", "year": "2023", "url": "https://doi.org/10.1139/facets-2023-0040", "domain": "soils"},
    "S_LI_2025": {"name": "Li et al. 2025 Hudson Bay Lowlands", "year": "2025", "url": "https://doi.org/10.1029/2024GL110679", "domain": "soils"},
    "S_JANOUSEK_2025": {"name": "Janousek et al. 2025 blue carbon", "year": "2025", "url": "https://doi.org/10.1029/2024GB008239", "domain": "soils"},
    "S_NCSCD_2013": {"name": "Hugelius et al. 2013 NCSCDv2", "year": "2013", "url": "https://doi.org/10.5194/essd-5-393-2013", "domain": "soils"},
    "S_OLEFELDT_2016": {"name": "Olefeldt et al. 2016 thermokarst", "year": "2016", "url": "https://doi.org/10.1038/ncomms13043", "domain": "soils"},
    "S_TREAT_2024": {"name": "Treat et al. 2024 review", "year": "2024", "url": "https://doi.org/10.1029/2023JG007638", "domain": "soils"},
    "S_MCNICOL_2019": {"name": "McNicol et al. 2019 NPCTR", "year": "2019", "url": "https://doi.org/10.1088/1748-9326/aaed52", "domain": "soils"},
    "S_ARSENAULT_2026": {"name": "Arsenault et al. 2026 Argenteuil", "year": "2026", "url": "https://doi.org/10.1029/2025JG009407", "domain": "soils"},
    "S_MARTENS_2026": {"name": "Martens and Kreyling 2026 coastal BC", "year": "2026", "url": "https://doi.org/10.1038/s41598-026-44791-z", "domain": "soils"},
    "S_LAMPING_2025": {"name": "Lamping et al. 2025 coastal forest maps", "year": "2025", "url": "https://doi.org/10.1016/j.foreco.2025.122576", "domain": "forests"},
    "S_GROSS_2022": {"name": "Gross et al. 2022 Alberta agroforestry", "year": "2022", "url": "https://doi.org/10.1111/gcb.16322", "domain": "both"},
    "S_PENDEA_2023": {"name": "Pendea et al. 2023 Lake Simcoe", "year": "2023", "url": "https://doi.org/10.1029/2023JG007561", "domain": "soils"},
    "S_CHASTAIN_2022": {"name": "Chastain et al. 2022 Clayoquot", "year": "2022", "url": "https://doi.org/10.5194/bg-19-5751-2022", "domain": "soils"},
    "S_EPSTEIN_2024": {"name": "Epstein et al. 2024 seabed sediment OC", "year": "2024", "url": "https://doi.org/10.5194/essd-16-2165-2024", "domain": "soils"},
    "W_COLAB_V1": {"name": "Repository multiscale covariate notebook", "year": "", "url": "", "domain": "soils"}
  },
  "maps": {
    "M_SOTHE_STOCK": {"name": "Sothe soil stock", "study": "S_SOTHE_SOC_2022", "quantity": "SOC stock", "depth": "0–100 cm (maintainer-confirmed 2026-10-16)", "units": "Study kg C/m²; stored encoding pending", "uncertainty": "Quantile-based uncertainty in source; archive/catalogue wording inconsistent. Exact imported statistic pending; not assigned ±SD.", "grid": "250", "url": "https://doi.org/10.1029/2021GB007213", "considerations": "One b1; empty properties. Do not infer multiple depth bands.", "domain": "soils"},
    "M_SOTHE_UNC": {"name": "Sothe soil stock uncertainty", "study": "S_SOTHE_SOC_2022", "quantity": "SOC stock uncertainty", "depth": "0–100 cm (maintainer-confirmed 2026-10-16)", "units": "Stored units/uncertainty encoding pending", "uncertainty": "Quantile-based uncertainty in source; archive/catalogue wording inconsistent. Exact imported statistic pending; not assigned ±SD.", "grid": "250", "url": "https://doi.org/10.1029/2021GB007213", "considerations": "Different source grid origin from prediction; no automatic cellwise matching.", "domain": "soils"},
    "M_SOTHE_CONC": {"name": "Sothe concentration depth images", "study": "S_SOTHE_CONC_2022", "quantity": "SOC concentration", "depth": "Point-depth names 0,5,15,30,60,100 cm; interval semantics unresolved", "units": "Study g/kg; stored scaling pending", "uncertainty": "Not assigned from stock uncertainty", "grid": "250", "url": "https://doi.org/10.4121/16619749", "considerations": "4TU stock archive methods describe point-depth predictions at 0,5,15,30,60,100 cm. Do not infer layer means; exact hosted concentration release identity pending.", "domain": "soils"},
    "M_SG_SOC": {"name": "SoilGrids soc_mean", "study": "S_SOILGRIDS_2021", "quantity": "SOC concentration", "depth": "Six intervals to 200 cm", "units": "dg/kg; /10 gives g/kg", "uncertainty": "Mean images; quantiles separate", "grid": "250", "url": "https://doi.org/10.5194/soil-7-217-2021", "considerations": "SOC/BD and OCD/OCS have different grid origins.", "domain": "soils"},
    "M_SG_BD": {"name": "SoilGrids bdod_mean", "study": "S_SOILGRIDS_2021", "quantity": "Bulk density", "depth": "Six intervals to 200 cm", "units": "cg/cm³; /100 gives kg/dm³", "uncertainty": "Mean images; quantiles separate", "grid": "250", "url": "https://doi.org/10.5194/soil-7-217-2021", "considerations": "SOC/BD and OCD/OCS have different grid origins.", "domain": "soils"},
    "M_SG_OCD": {"name": "SoilGrids ocd_mean", "study": "S_SOILGRIDS_2021", "quantity": "Organic carbon density", "depth": "Six intervals to 200 cm", "units": "hg/m³; /10 gives kg/m³", "uncertainty": "Mean images; quantiles separate", "grid": "250", "url": "https://doi.org/10.5194/soil-7-217-2021", "considerations": "SOC/BD and OCD/OCS have different grid origins.", "domain": "soils"},
    "M_SG_OCS": {"name": "SoilGrids ocs_mean", "study": "S_SOILGRIDS_2021", "quantity": "Organic carbon stock", "depth": "0–30 cm only in hosted band", "units": "t/ha; /10 gives kg/m²", "uncertainty": "Mean images; quantiles separate", "grid": "250", "url": "https://doi.org/10.5194/soil-7-217-2021", "considerations": "Published 0–30 cm stock excludes overlying organic layers; stock targets calculated at observations then mapped, not multiplied from delivered SOC/BD maps. Check grid origin.", "domain": "soils"},
    "M_GENG_BD": {"name": "Geng BD five depths", "study": "S_GENG_2025", "quantity": "Bulk density", "depth": "0–5,5–15,15–30,30–60,60–100 cm", "units": "Provider g/cm³; import encoding unverified", "uncertainty": "Q5/Q95 not uploaded", "grid": "100", "url": "https://doi.org/10.5281/zenodo.15473720", "considerations": "RF/QRF property predictions, not integrated stock. Provider masks vary with bedrock depth; predominantly 1980–2000 training, not field-scale or short-term-change evidence. See Soil_methods.", "domain": "soils"},
    "M_GENG_SOC": {"name": "Geng SOC five depths", "study": "S_GENG_2025", "quantity": "SOC concentration", "depth": "0–5,5–15,15–30,30–60,60–100 cm", "units": "Provider %; import encoding unverified", "uncertainty": "Q5/Q95 not uploaded", "grid": "100", "url": "https://doi.org/10.5281/zenodo.15473720", "considerations": "RF/QRF property predictions, not integrated stock. Provider masks vary with bedrock depth; predominantly 1980–2000 training, not field-scale or short-term-change evidence. See Soil_methods.", "domain": "soils"},
    "M_NCSCD_30": {"name": "NCSCDv2 SOCC30", "study": "S_NCSCD_2013", "quantity": "SOC stock", "depth": "0–30 cm", "units": "Source hg C/m² unless import converted", "uncertainty": "No paired per-pixel uncertainty assigned", "grid": "", "url": "https://bolin.su.se/data/ncscd/tiff.php", "considerations": "0.012°; nominal ~1335.83 m is not constant ground resolution. 200–300 cm missing.", "domain": "soils"},
    "M_NCSCD_100": {"name": "NCSCDv2 SOCC100", "study": "S_NCSCD_2013", "quantity": "SOC stock", "depth": "0–100 cm", "units": "Source hg C/m² unless import converted", "uncertainty": "No paired per-pixel uncertainty assigned", "grid": "", "url": "https://bolin.su.se/data/ncscd/tiff.php", "considerations": "0.012°; nominal ~1335.83 m is not constant ground resolution. 200–300 cm missing.", "domain": "soils"},
    "M_NCSCD_200": {"name": "NCSCDv2 SOCC200", "study": "S_NCSCD_2013", "quantity": "SOC stock", "depth": "100–200 cm", "units": "Source hg C/m² unless import converted", "uncertainty": "No paired per-pixel uncertainty assigned", "grid": "", "url": "https://bolin.su.se/data/ncscd/tiff.php", "considerations": "0.012°; nominal ~1335.83 m is not constant ground resolution. 200–300 cm missing.", "domain": "soils"},
    "M_THERMOKARST": {"name": "Circumpolar thermokarst landscapes", "study": "S_OLEFELDT_2016", "quantity": "Landscape SOC and fractions", "depth": "Associated 0–3 m SOC", "units": "TSOC_kgC field denotes polygon mass; inspect source", "uncertainty": "Expert uncertainty; no paired SD raster", "grid": "", "url": "https://doi.org/10.3334/ORNLDAAC/1332", "considerations": "132,089 features; preserve vector support.", "domain": "soils"},
    "M_LI_DEPTH": {"name": "Li peat_depth", "study": "S_LI_2025", "quantity": "peat_depth", "depth": "Variable modelled full peat column", "units": "Archive cm (peat depth); imported scale/offset/NoData pending", "uncertainty": "Archive ±1 SD among base-model estimates; model disagreement, not a 95% CI or total propagated error", "grid": "30", "url": "https://doi.org/10.5683/SP3/TIRAXJ", "considerations": "All four b1; same reported affine transform; full custom CRS and masks pending.", "domain": "soils"},
    "M_LI_DEPTH_UNC": {"name": "Li peat_depth_uncertainty", "study": "S_LI_2025", "quantity": "peat_depth_uncertainty", "depth": "Variable modelled full peat column", "units": "Archive cm (peat depth); imported scale/offset/NoData pending", "uncertainty": "Archive ±1 SD among base-model estimates; model disagreement, not a 95% CI or total propagated error", "grid": "30", "url": "https://doi.org/10.5683/SP3/TIRAXJ", "considerations": "All four b1; same reported affine transform; full custom CRS and masks pending.", "domain": "soils"},
    "M_LI_C": {"name": "Li peat_carbon_stock", "study": "S_LI_2025", "quantity": "peat_carbon_stock", "depth": "Variable modelled full peat column", "units": "Archive kg C/m² (full peat column); imported scale/offset/NoData pending", "uncertainty": "Archive ±1 SD among base-model estimates; model disagreement, not a 95% CI or total propagated error", "grid": "30", "url": "https://doi.org/10.5683/SP3/TIRAXJ", "considerations": "All four b1; same reported affine transform; full custom CRS and masks pending.", "domain": "soils"},
    "M_LI_C_UNC": {"name": "Li peat_carbon_stock_uncertainty", "study": "S_LI_2025", "quantity": "peat_carbon_stock_uncertainty", "depth": "Variable modelled full peat column", "units": "Archive kg C/m² (full peat column); imported scale/offset/NoData pending", "uncertainty": "Archive ±1 SD among base-model estimates; model disagreement, not a 95% CI or total propagated error", "grid": "30", "url": "https://doi.org/10.5683/SP3/TIRAXJ", "considerations": "All four b1; same reported affine transform; full custom CRS and masks pending.", "domain": "soils"},
    "M_FOREST_C": {"name": "McMaster WWF forest carbon", "study": "S_SOTHE_FOREST_2022", "quantity": "AGB+BGB+dead plant carbon", "depth": "Vegetation pools", "units": "kg C/m²", "uncertainty": "Separate uncertainty image", "grid": "250", "url": "https://doi.org/10.1029/2021GB007213", "considerations": "", "domain": "forests"},
    "M_SCANFI_V1": {"name": "SCANFI v1.2 biomass", "study": "S_SCANFI_V1", "quantity": "AGB and forest attributes", "depth": "Aboveground biomass", "units": "tonnes/ha biomass", "uncertainty": "No separate error layer assigned", "grid": "30", "url": "https://developers.google.com/earth-engine/datasets/catalog/projects_gcpm041u-lemur_assets_scanfi_v12_SCANFI_v1_2", "considerations": "", "domain": "forests"},
    "M_SCANFI_V2": {"name": "SCANFI v2 historical biomass", "study": "", "quantity": "AGB", "depth": "Aboveground biomass", "units": "Check release metadata", "uncertainty": "Pending", "grid": "30", "url": "https://download-telecharger.services.geo.ca/pub/nrcan_rncan/Forests_Foret/SCANFI/v2/", "considerations": "Live release check: project collection is public but contains 0 images on 2026-10-15. Provider download linked; hosted imagery is not ready.", "domain": "forests"},
    "M_ESA_CCI": {"name": "ESA CCI biomass v6", "study": "", "quantity": "Aboveground woody biomass", "depth": "Aboveground woody biomass", "units": "Mg/ha", "uncertainty": "SD band", "grid": "100", "url": "https://gee-community-catalog.org/projects/cci_agb/", "considerations": "10 images: 2007,2010,2015–2022. Biomass differs from carbon.", "domain": "forests"},
    "M_SBFI": {"name": "Canadian SBFI", "study": "", "quantity": "Modelled forest inventory AGB", "depth": "Stand polygon AGB", "units": "tonnes/ha mean; tonnes total", "uncertainty": "Within-polygon SD is not model error", "grid": "", "url": "https://gee-community-catalog.org/projects/ca_sbfi/", "considerations": "", "domain": "forests"},
    "M_PEATGRIDS": {"name": "PEATGRIDS", "study": "", "quantity": "Full modelled variable peat thickness; depth-resolved BD and carbon-content inputs", "depth": "Full modelled variable peat thickness; depth-resolved BD and carbon-content inputs", "units": "See release; stored encoding unverified", "uncertainty": "Source-specific; inspect files", "grid": "1000", "url": "https://doi.org/10.5281/zenodo.15070037", "considerations": "Catalogue: https://gee-community-catalog.org/projects/peatgrids/ . Distinguish per-area stock from total carbon per pixel. Version 2.0.1 clarifies stock units; verify encoding, units, masks and coverage against release before conversion. Shared training cores may overlap our compilations.", "domain": "soils"},
    "M_MCNICOL": {"name": "McNicol et al. NPCTR soil-carbon database and raster", "study": "S_MCNICOL_2019", "quantity": "1 m mineral soil plus overlying organic horizons; not automatically 1 m below peat/forest-floor surface", "depth": "1 m mineral soil plus overlying organic horizons; not automatically 1 m below peat/forest-floor surface", "units": "See release; stored encoding unverified", "uncertainty": "Source-specific; inspect files", "grid": "90.5", "url": "https://doi.org/10.5061/dryad.5jf6j1r", "considerations": "Preserve measured/estimated flags and coordinate-quality fields. The current README says water/ice are unmasked while the copied Methods text describes masking: inspect the actual raster. Reconcile source-profile overlap before counting independent sites.", "domain": "soils"},
    "M_HUGELIUS_PEAT": {"name": "Hugelius et al. northern peatland maps, version 2", "study": "", "quantity": "Peat depth and depth-derived stock; preserve peat fractions and area denominator", "depth": "Peat depth and depth-derived stock; preserve peat fractions and area denominator", "units": "See release; stored encoding unverified", "uncertainty": "Source-specific; inspect files", "grid": "10000", "url": "https://bolin.su.se/data/hugelius-2020-peatland-2", "considerations": "Distinct from NCSCDv2. Retain native units (carbon fields labelled hg/m²), peat fractions and version. Do not present 10 km cells as local 30 m evidence.", "domain": "soils"},
    "M_LAMPING": {"name": "Lamping et al. coastal forest biomass and structure maps", "study": "S_LAMPING_2025", "quantity": "Live aboveground and species biomass; inspect release attribute list for snag biomass, not a complete ecosystem carbon stock", "depth": "Live aboveground and species biomass; inspect release attribute list for snag biomass, not a complete ecosystem carbon stock", "units": "See release; stored encoding unverified", "uncertainty": "Source-specific; inspect files", "grid": "30", "url": "https://doi.org/10.5281/zenodo.13932139", "considerations": "Biomass is not carbon without a documented conversion. Publication reports snag-biomass attributes; verify released band/file coverage. Underlying true forest-plot locations are confidential; do not infer open geolocated training data from open maps.", "domain": "forests"},
    "M_EPSTEIN": {"name": "Epstein et al. Canadian continental-margin sediment OC", "study": "S_EPSTEIN_2024", "quantity": "Standing stock in upper 30 cm seabed sediment; density is a separate quantity", "depth": "Standing stock in upper 30 cm seabed sediment; density is a separate quantity", "units": "See release; stored encoding unverified", "uncertainty": "Source-specific; inspect files", "grid": "200", "url": "https://doi.org/10.5683/SP3/ICHVVA", "considerations": "High-priority new pool. Record seafloor area/rock mask, depth basis and approximated uncertainty; do not add overlapping terrestrial/coastal products without checking footprints.", "domain": "soils"},
    "M_HENGL": {"name": "Hengl Alberta SOC/BD/stock", "study": "S_HENGL_2023", "quantity": "SOC and BD predictions; derived stocks", "depth": "Four intervals to 100 cm", "units": "SOC study units; integrated stock t/ha", "uncertainty": "Exact released uncertainty files unresolved", "grid": "30", "url": "https://doi.org/10.1139/facets-2023-0040", "considerations": "Viewer access unresolved; no verified downloadable raster/GEE asset.", "domain": "soils"}
  },
  "ground": {
    "G_WOSIS": {"name": "WoSIS Canada v2", "measurement": "SOC concentration; partial stock inputs", "coverage": "Canada", "count": "8825", "depth": "Layer-specific cm; available-layer sums are not standardized 1 m stocks. See Soil_methods and Soil_depth_QC.", "access": "Project preparation; source access via ISRIC", "url": "https://docs.isric.org/globaldata/wosis/", "licence": "Source-specific terms; verify before redistribution", "considerations": "Only 102 layers have sufficient inputs for organic-stock calculation; incomplete stocks lack coarse-fragment correction. v2 supersedes v1.", "domain": "soils"},
    "G_NPDB": {"name": "National Pedon Database preparation", "measurement": "SOC and soil properties", "coverage": "Canada", "count": "9017", "depth": "Original horizons; negative tops/open bottoms require interpretation. Window bounds for stock_Mgha_in_window unresolved. See Soil_methods.", "access": "Project preparation; CanSIS source", "url": "https://sis.agr.gc.ca/cansis/nsdb/npdb/index.html", "licence": "Source-specific terms; verify before redistribution", "considerations": "Resolve shared original profiles across compilations.", "domain": "soils"},
    "G_NRCAN_PEAT": {"name": "NRCan Peat Profile Database", "measurement": "Peat carbon and bulk density", "coverage": "Canada peatlands", "count": "1217", "depth": "Variable peat-column samples; lower_depth = upper sample depth + thickness. See Soil_methods.", "access": "Project preparation; provider CSVs", "url": "https://open.canada.ca/data/en/dataset/e287b0dd-8b07-435b-8a76-0c7ec84ac228", "licence": "Source-specific terms; verify before redistribution", "considerations": "Restore carbon measured/estimated flags; existing asset name CanPeat is not Waterloo Can-Peat portal.", "domain": "soils"},
    "G_JANOUSEK": {"name": "Janousek coastal core preparation", "measurement": "Coastal sediment OC", "coverage": "Pacific coast Alaska–Mexico; BC subset", "count": "1284", "depth": "Original sample intervals; paper standardizes to 30/50/100 cm with minimum sampled depths 20/35/75 cm and extrapolation. See Soil_methods.", "access": "Project preparation; Smithsonian archive", "url": "https://doi.org/10.25573/serc.28127486.v1", "licence": "Source-specific terms; verify before redistribution", "considerations": "Restore local/estuary covariates and extrapolation flags; not all 1,284 cores are Canadian.", "domain": "soils"},
    "G_RILEY": {"name": "Riley OGS preparation", "measurement": "Peat properties and depth", "coverage": "Ontario", "count": "347", "depth": "Variable original intervals in cm; surface datum and density units unresolved. See Soil_methods.", "access": "Project preparation; exact original OGS release unresolved", "url": "", "licence": "Source-specific terms; verify before redistribution", "considerations": "Four groups have overlapping depth intervals; density units unresolved.", "domain": "soils"},
    "G_NFI": {"name": "National Forest Inventory ground plots", "measurement": "Tree dimensions and derived biomass", "coverage": "Canada", "count": "", "depth": "Vegetation pools", "access": "Request measurements and coordinate access", "url": "https://nfi.nfis.org/en/datarequestform", "licence": "Source-specific terms; verify before redistribution", "considerations": "Keep photo-plots distinct; access does not establish redistribution permission.", "domain": "forests"},
    "G_NFI_PHOTO": {"name": "NFI photo-interpreted plots", "measurement": "Modelled/interpreted forest attributes", "coverage": "Canada", "count": "", "depth": "Vegetation pools", "access": "Source access conditions", "url": "https://nfi.nfis.org/en", "licence": "Source-specific terms; verify before redistribution", "considerations": "SCANFI training targets include derived inventory biomass; not independent measured plot carbon.", "domain": "forests"},
    "G_QUEBEC": {"name": "Québec permanent sample plots", "measurement": "Tree and ecological observations", "coverage": "Québec principally south of 52° N", "count": "", "depth": "Vegetation pools", "access": "Public GeoPackage and dictionary", "url": "https://www.donneesquebec.ca/recherche/dataset/placettes-echantillons-permanentes-1970-a-aujourd-hui", "licence": "Source-specific terms; verify before redistribution", "considerations": "Preserve plot-measurement key ID_PE_MES; source says more than 12,000 plots; exact release count not loaded.", "domain": "forests"},
    "G_CLI": {"name": "New Brunswick CLI", "measurement": "Tree observations and calculated AGB", "coverage": "New Brunswick", "count": "6049", "depth": "Aboveground tree biomass", "access": "Analysis archive; full geolocated raw inventory not verified", "url": "https://doi.org/10.6084/m9.figshare.27055528.v1", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "forests"},
    "G_BC_INVENTORY": {"name": "BC provincial forest observations", "measurement": "Forest biomass", "coverage": "British Columbia", "count": "", "depth": "Vegetation pools", "access": "Provider/source identity unresolved", "url": "", "licence": "Source-specific terms; verify before redistribution", "considerations": "Named in Sothe methods; do not assume generic NFI release is identical.", "domain": "forests"},
    "G_ENFOR": {"name": "NRCan ENFOR sampled trees", "measurement": "Destructively measured tree biomass", "coverage": "Canada", "count": "", "depth": "Stem, bark, branches, foliage and twigs", "access": "Public CSV; nearly 9,000 trees/33 species reported", "url": "https://open.canada.ca/data/en/dataset/fbad665e-8ac9-4635-9f84-e4fd53a6253c", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "forests"},
    "G_ABOVE": {"name": "NASA ABoVE burned/unburned plot synthesis", "measurement": "Forest and organic-layer disturbance carbon", "coverage": "Alaska, NWT and Saskatchewan", "count": "", "depth": "Pool/depth varies", "access": "Public CSV and guide", "url": "https://daac.ornl.gov/ABOVE/guides/ABoVE_Plot_Data_Burned_Sites.html", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "forests"},
    "G_VSN": {"name": "Ontario Vegetation Sampling Network", "measurement": "Forest plot observations", "coverage": "Ontario", "count": "", "depth": "Vegetation and ecological attributes", "access": "Public measurements download not confirmed", "url": "https://publications.gc.ca/collections/collection_2025/rncan-nrcan/Fo123-2-40-2025-eng.pdf", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "forests"},
    "G_LEHIGH_PEAT": {"name": "Historical Lehigh peatland training compilation", "measurement": "Peat SOC", "coverage": "Canadian sites in Sothe training", "count": "43", "depth": "Layer-specific", "access": "Exact historical training subset pending", "url": "https://doi.org/10.1177/0959683614538073", "licence": "Source-specific terms; verify before redistribution", "considerations": "Not assumed identical to current NRCan peat preparation.", "domain": "soils"},
    "G_SOILGRIDS_GLOBAL": {"name": "SoilGrids global training profiles", "measurement": "Soil properties", "coverage": "Global", "count": "240000", "depth": "Variable to model depths", "access": "Training archive not equivalent to public WoSIS subset", "url": "https://doi.org/10.5194/soil-7-217-2021", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "soils"},
    "G_HENGL": {"name": "Alberta pilot-farm soil samples", "measurement": "SOC and bulk density", "coverage": "Alberta agriculture", "count": "404", "depth": "0–15,15–30,30–60,60–100 cm", "access": "Standalone field archive unresolved", "url": "https://doi.org/10.1139/facets-2023-0040", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "soils"},
    "G_LI_TRAIN": {"name": "Li peat-depth training", "measurement": "Peat depth", "coverage": "Hudson Bay Lowlands", "count": "495", "depth": "Full peat depth", "access": "Restricted; MNR data-sharing agreement", "url": "https://doi.org/10.1029/2024GL110679", "licence": "Source-specific terms; verify before redistribution", "considerations": "Not an open carbon-density/chemistry dataset.", "domain": "soils"},
    "G_LI_VALID": {"name": "Li public validation peat depths", "measurement": "Peat depth", "coverage": "Hudson Bay Lowlands", "count": "32", "depth": "Full peat depth", "access": "Borealis source; not yet ingested", "url": "https://doi.org/10.5683/SP3/TIRAXJ", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "soils"},
    "G_SHAW": {"name": "Shaw upland forest soils", "measurement": "Organic horizons plus mineral soil to 100 cm; preserve original depth datum", "coverage": "Canadian upland forests", "count": "3253", "depth": "Organic horizons plus mineral soil to 100 cm; preserve original depth datum", "access": "DataS1 ZIP and metadata supplement linked by publisher", "url": "https://doi.org/10.1002/ecy.2159", "licence": "Source-specific terms; verify before redistribution", "considerations": "Important missing named source. NFI contributes some stock summaries without matching horizon records; do not expect every pedon in every table. Check overlap with NPDB/WoSIS/McNicol and coordinate-quality flags. Publisher describes noncommercial reuse and commercial permission requirements; verify distribution terms before hosting.", "domain": "soils"},
    "G_MCNICOL": {"name": "McNicol NPCTR profiles", "measurement": "1 m mineral soil plus overlying organic horizons; not automatically 1 m below peat/forest-floor surface", "coverage": "Coastal British Columbia and southeast Alaska; restrict Canadian analysis to actual BC footprint", "count": "1300", "depth": "1 m mineral soil plus overlying organic horizons; not automatically 1 m below peat/forest-floor surface", "access": "Dryad XLSX, raster archive, README; database revised 2024", "url": "https://doi.org/10.5061/dryad.5jf6j1r", "licence": "Source-specific terms; verify before redistribution", "considerations": "Preserve measured/estimated flags and coordinate-quality fields. The current README says water/ice are unmasked while the copied Methods text describes masking: inspect the actual raster. Reconcile source-profile overlap before counting independent sites.", "domain": "soils"},
    "G_ARSENAULT": {"name": "Argenteuil peatlands", "measurement": "Variable peat-basin depth, not fixed 1 m SOC", "coverage": "Argenteuil, Québec; 28 fens, bogs and forested peatlands", "count": "28", "depth": "Variable peat-basin depth, not fixed 1 m SOC", "access": "Paper links Zenodo; Can-Peat provides a version-specific link; direct archive retrieval failed in this review", "url": "https://doi.org/10.5281/zenodo.17065341", "licence": "Source-specific terms; verify before redistribution", "considerations": "Can-Peat links version DOI 10.5281/zenodo.17065342. Confirm version and available files before ingestion. Record detailed bathymetry separately from regional upscaling and LiDAR covariate grids.", "domain": "soils"},
    "G_MARTENS": {"name": "Coastal BC peatlands", "measurement": "Peat and biomass pools; preserve sampled depths and pool definitions", "coverage": "Read Island and Porcher Island, coastal BC; six peatlands", "count": "6", "depth": "Peat and biomass pools; preserve sampled depths and pool definitions", "access": "Paper links Zenodo; archive landing retrieval failed in this review", "url": "https://doi.org/10.5281/zenodo.17533263", "licence": "Source-specific terms; verify before redistribution", "considerations": "Paper combines new samples with existing NRCan peat observations. Separate new observations from reused Peat Profile Database records. Paper labels archive above-/belowground biomass data: inspect actual files before assuming all profile and stock inputs are present.", "domain": "soils"},
    "G_GROSS": {"name": "Alberta agroforestry field measurements", "measurement": "Live biomass, deadwood and soil SOC (study includes approximately 1 m total soil); inspect table-specific depths", "coverage": "Central Alberta hedgerows, shelterbelts, grassland and adjacent cropland", "count": "", "depth": "Live biomass, deadwood and soil SOC (study includes approximately 1 m total soil); inspect table-specific depths", "access": "Dryad downloadable CSV tables", "url": "https://doi.org/10.5061/dryad.0zpc86711", "licence": "Source-specific terms; verify before redistribution", "considerations": "Useful multi-pool addition. SoilOCN.csv, LiveBiomassC.csv and Woodland.csv are stock-related; keep GHG flux files separately. Verify coordinates, sampled areas, depth increments and units before GEE upload.", "domain": "both"},
    "G_PENDEA": {"name": "Lake Simcoe wetland cores", "measurement": "Fixed upper 50 cm sampling plus dated-horizon stock/rate subsets", "coverage": "Lake Simcoe watershed, Ontario; four swamps and four marshes", "count": "8", "depth": "Fixed upper 50 cm sampling plus dated-horizon stock/rate subsets", "access": "Paper links public Borealis V1; archive file-level retrieval not tested", "url": "https://doi.org/10.5683/SP3/OJRV2I", "licence": "Source-specific terms; verify before redistribution", "considerations": "Adds nutrient-rich freshwater marshes/swamps. Keep 0–50 cm stocks separate from age-defined intervals and carbon accumulation rates; preserve hydrological class.", "domain": "soils"},
    "G_CLAYOQUOT": {"name": "Clayoquot marsh cores", "measurement": "20 cm, basal-peat and dated-horizon stock supports", "coverage": "Clayoquot Sound, BC; seven salt marshes", "count": "34", "depth": "20 cm, basal-peat and dated-horizon stock supports", "access": "PANGAEA bundle and tab-delimited datasets; CC BY 4.0 stated", "url": "https://doi.org/10.1594/PANGAEA.947825", "licence": "Source-specific terms; verify before redistribution", "considerations": "Retain compaction corrections and measured versus LOI-derived carbon. Likely overlap with Janousek compilation: cross-match original study/core IDs before counting additional sites.", "domain": "soils"},
    "G_EPSTEIN": {"name": "Continental-margin sediment OC observations", "measurement": "Standing stock in upper 30 cm seabed sediment; density is a separate quantity", "coverage": "Canadian continental margin including Pacific, Atlantic and Arctic regions", "count": "2518", "depth": "Standing stock in upper 30 cm seabed sediment; density is a separate quantity", "access": "Paper links Borealis GeoTIFFs and source review data/code", "url": "https://doi.org/10.5683/SP3/ICHVVA", "licence": "Source-specific terms; verify before redistribution", "considerations": "High-priority new pool. Record seafloor area/rock mask, depth basis and approximated uncertainty; do not add overlapping terrestrial/coastal products without checking footprints.", "domain": "soils"},
    "G_NCSCD": {"name": "NCSCDv2 source pedons", "measurement": "Permafrost SOC", "coverage": "Circumpolar", "count": "", "depth": "Variable; mapped supports to 3 m", "access": "Bolin pedon download; Canadian subset not prepared", "url": "https://bolin.su.se/data/ncscd/pedon.php", "licence": "Source-specific terms; verify before redistribution", "considerations": "", "domain": "soils"},
    "G_CASFRI": {"name": "CASFRI harmonized forest inventories", "measurement": "Forest inventory attributes", "coverage": "Canada", "count": "", "depth": "Variable inventory attributes", "access": "Original spreadsheet resource; exact release/access unresolved", "url": "https://nfi.nfis.org/en/about", "licence": "Source-specific terms; verify before redistribution", "considerations": "Schema harmonization is not a single independent ground sample database. Original link retained, not verified as the CASFRI data endpoint.", "domain": "forests"}
  },
  "profiles": {
    "WoSIS": {"profiles": "8825", "layers": "43055", "year_min": "1939.0", "year_max": "2013.0", "median_deepest_layer_cm": "101.0", "share_reaching_30cm": "0.9173", "share_reaching_100cm": "0.5522", "depth_datum": "Profile top; organic surface layers flagged (organic_surface)", "qualifiers": "Concentration observations mostly; stock sums partial, no coarse-fragment adjustment"},
    "NPDB": {"profiles": "9017", "layers": "48371", "year_min": "1943.0", "year_max": "2015.0", "median_deepest_layer_cm": "100.0", "share_reaching_30cm": "0.959", "share_reaching_100cm": "0.6244", "depth_datum": "Mineral surface = 0 cm; LFH horizons above 0 cm", "qualifiers": "1,564 profiles flagged for poor location confidence"},
    "NRCan peat": {"profiles": "1217", "layers": "37072", "year_min": "1967.0", "year_max": "2017.0", "median_deepest_layer_cm": "243.0", "share_reaching_30cm": "1.0", "share_reaching_100cm": "0.8948", "depth_datum": "Peat surface; full sampled column", "qualifiers": "Bulk density 0 measured / 0 estimated rows; provider flags 736 measured vs 35,929 estimated organic-C rows (flags omitted from v1)"},
    "Janousek": {"profiles": "1284", "layers": "23018", "year_min": "", "year_max": "", "median_deepest_layer_cm": "60.0", "share_reaching_30cm": "0.9953", "share_reaching_100cm": "0.4844", "depth_datum": "Sediment surface", "qualifiers": "Pacific coast Alaska to Mexico; repeated source layer IDs flagged; 13 profiles with thickness/boundary mismatches"},
    "Riley": {"profiles": "347", "layers": "1584", "year_min": "", "year_max": "", "median_deepest_layer_cm": "250.0", "share_reaching_30cm": "0.9885", "share_reaching_100cm": "0.9568", "depth_datum": "Peat surface", "qualifiers": "Groups are NTS + peatland + sampling point; bulk-density units unverified (not used); no dates"}
  },
  "covariates": [
    ["S_SOTHE_SOC_2022", "L8_B4", "Reflectance", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_B5", "Reflectance", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_B6", "Reflectance", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_B7", "Reflectance", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_NDWI", "Biophysical parameters", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_NDSI", "Biophysical parameters", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_brightness", "Biophysical parameters", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_greenness", "Biophysical parameters", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_wetness", "Biophysical parameters", "30", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "MODIS_NDVI", "Biophysical parameters", "250", "2000-2019", "MODIS/061/MOD13Q1 (current substitute; historical release differs)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "MODIS_EVI", "Biophysical parameters", "250", "2000-2019", "MODIS/061/MOD13Q1 (current substitute; historical release differs)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "MODIS_ET", "Climate", "500", "2000-2019", "", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "MODIS_temp_day", "Climate", "1000", "2000-2019", "Study MODIS temperature product; exact release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "MODIS_temp_night", "Climate", "1000", "2000-2019", "Study MODIS temperature product; exact release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "MODIS_temp_std", "Climate", "1000", "2000-2017", "Study MODIS temperature product; exact release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "Daymet_tmax", "Climate", "1000", "2000-2019", "NASA/ORNL/DAYMET_V4 (current substitute)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "Daymet_tmin", "Climate", "1000", "2000-2019", "NASA/ORNL/DAYMET_V4 (current substitute)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "Daymet_srad", "Climate", "1000", "2000-2019", "NASA/ORNL/DAYMET_V4 (current substitute)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "Daymet_ppt", "Climate", "1000", "2000-2019", "NASA/ORNL/DAYMET_V4 (current substitute)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_B10", "Climate", "100", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "L8_B11", "Climate", "100", "2015-2019", "Historical Landsat product; exact ID/release pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "DEM", "Terrain parameters", "30", "2006/2011", "ALOS study DEM; exact derivative implementation pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "slope", "Terrain parameters", "30", "-", "ALOS study DEM; exact derivative implementation pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "TPI", "Terrain parameters", "30", "-", "ALOS study DEM; exact derivative implementation pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "TRI", "Terrain parameters", "30", "-", "ALOS study DEM; exact derivative implementation pending", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "ALOS_L_HH", "Backscattering", "25", "2007/2018", "JAXA/ALOS/PALSAR/YEARLY/SAR (match release)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "ALOS_L_HV", "Backscattering", "25", "2007/2018", "JAXA/ALOS/PALSAR/YEARLY/SAR (match release)", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "soil_type", "Soil", "25000", "2011", "", "Candidate defined", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "DEPTH", "Soil", "", "1978-1995", "", "Candidate defined", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_intercept", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_trend", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_sin1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_cos1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_sin2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_cos2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_sin3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_cos3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_blue_fit_rmse", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_intercept", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_trend", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_sin1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_cos1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_sin2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_cos2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_sin3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_cos3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_green_fit_rmse", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_intercept", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_trend", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_sin1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_cos1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_sin2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_cos2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_sin3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_cos3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_red_fit_rmse", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_intercept", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_trend", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_sin1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_cos1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_sin2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_cos2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_sin3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_cos3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_nir_fit_rmse", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_intercept", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_trend", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_sin1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_cos1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_sin2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_cos2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_sin3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_cos3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir1_fit_rmse", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_intercept", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_trend", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_sin1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_cos1", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_sin2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_cos2", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_sin3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_cos3", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_BETTS_2024", "Landsat_swir2_fit_rmse", "Temporal optical", "30", "Study maps 1985–2020; temporal match plots", "Historical Landsat Collection 1; C2 reproduction requires harmonization", "Model input", "Planned study feature"],
    ["S_SOTHE_FOREST_2022", "maximum_canopy_height", "Structure", "250", "Mostly 2015–2019", "projects/sat-io/open-datasets/carbon_stocks_ca/ch", "Retained/ranked family", "Planned study feature"],
    ["S_SOTHE_FOREST_2022", "canopy_height_p85", "Structure", "250", "Mostly 2015–2019", "projects/sat-io/open-datasets/carbon_stocks_ca/ch", "Retained/ranked family", "Planned study feature"],
    ["S_SOTHE_FOREST_2022", "canopy_height_p95", "Structure", "250", "Mostly 2015–2019", "projects/sat-io/open-datasets/carbon_stocks_ca/ch", "Retained/ranked family", "Planned study feature"],
    ["S_SOTHE_FOREST_2022", "PALSAR_HH", "Radar", "25", "Mostly 2015–2019", "JAXA/ALOS/PALSAR/YEARLY/SAR", "Retained/ranked family", "Planned study feature"],
    ["S_SOTHE_FOREST_2022", "PALSAR_HV", "Radar", "25", "Mostly 2015–2019", "JAXA/ALOS/PALSAR/YEARLY/SAR", "Retained/ranked family", "Planned study feature"],
    ["S_SOTHE_FOREST_2022", "Landsat_reflectance_and_indices", "Optical", "30", "Mostly 2015–2019", "Study Landsat release pending", "Retained/ranked family", "Planned study feature"],
    ["S_QIN_2025", "Sentinel1_VV_VH", "Radar", "", "Study period; exact windows pending", "COPERNICUS/S1_GRD", "Model input", "Planned study feature"],
    ["S_QIN_2025", "Sentinel2_seasonal_reflectance", "Optical", "", "Study period; exact windows pending", "COPERNICUS/S2_SR_HARMONIZED", "Model input", "Planned study feature"],
    ["S_QIN_2025", "annual_PALSAR_HH_HV", "Radar", "25", "Study period; exact windows pending", "JAXA/ALOS/PALSAR/YEARLY/SAR", "Model input", "Planned study feature"],
    ["S_SCANFI_V1", "summer_winter_Landsat", "Optical", "30", "Study period; exact windows pending", "Historical Landsat release pending", "Model input", "Planned study feature"],
    ["S_SCANFI_V1", "climate", "Climate", "", "Study period; exact windows pending", "Exact products pending", "Model input", "Planned study feature"],
    ["S_SCANFI_V1", "terrain", "Terrain", "", "Study period; exact windows pending", "Exact DEM and derivatives pending", "Model input", "Planned study feature"],
    ["S_GENG_2025", "TerraClimate_tmax_tmin_precip", "Climate", "", "1958–2020", "IDAHO_EPSCOR/TERRACLIMATE", "Model input", "Planned study feature"],
    ["S_GENG_2025", "MODIS_day_night_LST", "Temperature", "1000", "Mar–Nov 2000–2017", "Study MODIS LST release pending", "Model input", "Planned study feature"],
    ["S_GENG_2025", "MOD13Q1_NDVI", "Vegetation", "250", "Mar–Sep 2000–2021 plus 2020 composites", "MODIS/061/MOD13Q1 (release match pending)", "Model input", "Planned study feature"],
    ["S_GENG_2025", "MCD43A4_band7", "Optical", "500", "Monthly source period to extract", "MODIS/061/MCD43A4 (release match pending)", "Model input", "Planned study feature"],
    ["S_GENG_2025", "Landsat8_peak_NDVI", "Optical", "30", "2020", "Landsat-8 study release pending", "Model input", "Planned study feature"],
    ["S_GENG_2025", "DEM_and_terrain_derivatives", "Terrain", "16", "Source epoch to extract", "Canadian elevation source in Table 1", "Model input", "Planned study feature"],
    ["S_GENG_2025", "land_cover", "Ecology", "", "2020", "Exact study 2020 land-cover product pending", "Model input", "Planned study feature"],
    ["S_GENG_2025", "depth_to_bedrock", "Geology", "", "Static", "Source release pending", "Model input", "Planned study feature"],
    ["S_GENG_2025", "surficial_materials", "Geology", "", "Static", "Surficial materials of Canada", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "ClimateNA_normals", "Climate", "1000", "1990–2010", "ClimateNA v7.3; GEE source unconfirmed", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "ALOS_terrain_30m", "Terrain", "30", "Static", "ALOS AW3D30; match derivative methods", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "ALOS_terrain_100m", "Terrain", "30", "Static", "Derived from ALOS; 100 m analysis support", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "ALOS_terrain_250m", "Terrain", "30", "Static", "Derived from ALOS; 250 m analysis support", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "MODIS_EVI", "Vegetation", "", "Study temporal definition pending", "Exact MODIS release pending", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "PROBA_V_NDVI", "Vegetation", "", "Study temporal definition pending", "Study PROBA-V release pending", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "GLAD_Landsat_P25_P50_P75", "Optical", "30", "Study temporal definition pending", "Study GLAD ARD seasonal composites", "Model input", "Planned study feature"],
    ["S_HENGL_2023", "geological_indicators", "Geology", "", "Static", "Source release pending", "Model input", "Planned study feature"],
    ["S_LI_2025", "distance_to_coastline", "Geography", "", "Source periods to extract", "Study coastline source pending", "Retained/ranked family", "Superseded family summary"],
    ["S_LI_2025", "elevation", "Terrain", "", "Source periods to extract", "Study DEM pending", "Retained/ranked family", "Superseded family summary"],
    ["S_LI_2025", "VH_to_VV_ratio", "Radar", "", "Source periods to extract", "Study Sentinel-1 source", "Retained/ranked family", "Superseded family summary"],
    ["S_LI_2025", "VV_minus_VH", "Radar", "", "Source periods to extract", "Study Sentinel-1 source", "Reported importance", "Superseded family summary"],
    ["S_LI_2025", "LST_mean_and_variability", "Temperature", "", "Source periods to extract", "Study long-term LST source", "Reported importance", "Superseded family summary"],
    ["S_LI_2025", "EVI_mean_and_variability", "Vegetation", "", "Source periods to extract", "Study long-term vegetation source", "Reported importance", "Superseded family summary"],
    ["S_LI_2025", "distance_to_river", "Hydrology", "", "Source periods to extract", "Study river source pending", "Reported importance", "Superseded family summary"],
    ["S_JANOUSEK_2025", "relative_tidal_elevation", "Terrain", "", "PRISM 1991–2020; other dates variable", "Local tidal datum and field elevations", "Model input", "Planned study feature"],
    ["S_JANOUSEK_2025", "sediment_fines_lt63um", "Sediment", "", "PRISM 1991–2020; other dates variable", "Core measurements upper 30 cm", "Model input", "Planned study feature"],
    ["S_JANOUSEK_2025", "vegetation_and_salinity", "Ecology", "", "PRISM 1991–2020; other dates variable", "Field ecosystem/vegetation groups", "Model input", "Planned study feature"],
    ["S_JANOUSEK_2025", "estuary_identity", "Geography", "", "PRISM 1991–2020; other dates variable", "Estuary metadata", "Model input", "Planned study feature"],
    ["S_JANOUSEK_2025", "ecoregion", "Ecology", "", "PRISM 1991–2020; other dates variable", "Level-1 source", "Model input", "Planned study feature"],
    ["S_JANOUSEK_2025", "Koppen_Geiger_zone", "Climate", "", "PRISM 1991–2020; other dates variable", "0.0083° climate-zone grid", "Model input", "Planned study feature"],
    ["S_JANOUSEK_2025", "PRISM_precip_temperature_VPD", "Climate", "800", "PRISM 1991–2020; other dates variable", "PRISM; US CA–OR–WA subset", "Model input", "Planned study feature"],
    ["S_SOTHE_SOC_2022", "land_cover_mask", "Mask", "", "Source-specific", "Original study correction layer pending", "Adjustment only", "Adjustment only"],
    ["S_SOTHE_SOC_2022", "ground_ice", "Stock correction", "", "Source-specific", "Original study correction layer pending", "Adjustment only", "Adjustment only"],
    ["S_SOTHE_SOC_2022", "coarse_fragments", "Stock correction", "", "Source-specific", "Original study correction layer pending", "Adjustment only", "Adjustment only"],
    ["S_SOTHE_SOC_2022", "rooting_depth", "Stock correction", "", "Source-specific", "Original study correction layer pending", "Adjustment only", "Adjustment only"],
    ["W_COLAB_V1", "local_s2_ndmi_spring_median", "Sentinel-2", "", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_ndmi_spring_temporal_sd", "Sentinel-2", "", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_ndvi_summer_median", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_ndvi_summer_temporal_sd", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_evi_summer_median", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_evi_summer_temporal_sd", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_ndvi_120m_mean", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s2_ndvi_120m_spatial_sd", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_tree_prob_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_tree_prob_temporal_sd", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_tree_120m_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_shrub_prob_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_shrub_prob_temporal_sd", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_shrub_120m_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_floodedveg_prob_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_floodedveg_prob_temporal_sd", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_floodedveg_120m_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_water_prob_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_water_prob_temporal_sd", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_dw_water_120m_mean", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vv_db_median", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vv_db_temporal_sd", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vh_db_median", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vh_db_temporal_sd", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vv_minus_vh_db_median", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vv_minus_vh_db_temporal_sd", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vv_over_vh_linear_median", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_s1_vv_over_vh_linear_temporal_sd", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_slope_deg", "Terrain", "23.19", "Static DEM release", "NRCan/CDEM", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_relative_elevation_120m", "Terrain", "23.19", "Static DEM release", "NRCan/CDEM", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "local_elevation_120m_sd", "Terrain", "23.19", "Static DEM release", "NRCan/CDEM", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_jrc_water_occurrence_pct", "Surface water", "30", "JRC historical 1984–2021 release", "JRC/GSW1_4/GlobalSurfaceWater", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_jrc_water_seasonality_months", "Surface water", "30", "JRC historical 1984–2021 release", "JRC/GSW1_4/GlobalSurfaceWater", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_jrc_water_recurrence_pct", "Surface water", "30", "JRC historical 1984–2021 release", "JRC/GSW1_4/GlobalSurfaceWater", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_observed_water_distance_m", "Surface water", "30", "JRC historical 1984–2021 release", "JRC/GSW1_4/GlobalSurfaceWater", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_elevation_m", "Terrain", "23.19", "Static DEM release", "NRCan/CDEM", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_relative_elevation_1000m", "Terrain", "23.19", "Static DEM release", "NRCan/CDEM", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "regional_elevation_1000m_sd", "Terrain", "23.19", "Static DEM release", "NRCan/CDEM", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "broad_era5_mean_temperature_c", "Climate", "11132", "2019–2023", "ECMWF/ERA5_LAND/MONTHLY_AGGR", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "broad_era5_monthly_temperature_sd_c", "Climate", "11132", "2019–2023", "ECMWF/ERA5_LAND/MONTHLY_AGGR", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "broad_era5_mean_annual_precip_mm", "Climate", "11132", "2019–2023", "ECMWF/ERA5_LAND/MONTHLY_AGGR", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "broad_era5_annual_precip_sd_mm", "Climate", "11132", "2019–2023", "ECMWF/ERA5_LAND/MONTHLY_AGGR", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "broad_era5_mean_freezing_months", "Climate", "11132", "2019–2023", "ECMWF/ERA5_LAND/MONTHLY_AGGR", "Candidate extension", "Implemented notebook"],
    ["W_COLAB_V1", "qa_s2_spring_observations", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "QA only", "Implemented notebook"],
    ["W_COLAB_V1", "qa_s2_summer_observations", "Sentinel-2", "10", "2019–2023; spring Apr–Jun or summer Jun–Aug", "COPERNICUS/S2_SR_HARMONIZED", "QA only", "Implemented notebook"],
    ["W_COLAB_V1", "qa_dynamic_world_observations", "Dynamic World", "10", "Jun–Aug 2019–2023", "GOOGLE/DYNAMICWORLD/V1", "QA only", "Implemented notebook"],
    ["W_COLAB_V1", "qa_sentinel1_observations", "Sentinel-1", "", "2019–2023", "COPERNICUS/S1_GRD", "QA only", "Implemented notebook"],
    ["S_SOILGRIDS_2021", "climate_normals", "Climate", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_SOILGRIDS_2021", "terrain_morphology", "Terrain", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_SOILGRIDS_2021", "vegetation_indices", "Vegetation", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_SOILGRIDS_2021", "spectral_summaries", "Optical", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_SOILGRIDS_2021", "geology_parent_material", "Geology", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_SOILGRIDS_2021", "land_cover_ecology", "Ecology", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_SOILGRIDS_2021", "hydrography", "Hydrology", "", "Legacy profiles; many summaries 2001–2015", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_MCNICOL_2019", "precipitation", "Climate", "", "Legacy profiles; archive revised 2024", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_MCNICOL_2019", "topographic_wetness_attributes", "Terrain", "", "Legacy profiles; archive revised 2024", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_MCNICOL_2019", "soil_forming_environment", "Ecology", "", "Legacy profiles; archive revised 2024", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_ARSENAULT_2026", "peatland_area_morphometry", "Geography", "", "Legacy/site dates to extract; data release 2025", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_ARSENAULT_2026", "LiDAR_elevation_slope_canopy", "Terrain", "", "Legacy/site dates to extract; data release 2025", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_ARSENAULT_2026", "surficial_deposits", "Geology", "", "Legacy/site dates to extract; data release 2025", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_LAMPING_2025", "climate_topography", "Environment", "", "Map epoch to inspect", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_LAMPING_2025", "satellite_predictors", "Remote sensing", "", "Map epoch to inspect", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_EPSTEIN_2024", "wave_current_exposure", "Oceanography", "", "Mixed sample dates; climatological predictor periods", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_EPSTEIN_2024", "oxygen", "Oceanography", "", "Mixed sample dates; climatological predictor periods", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_EPSTEIN_2024", "suspended_particulate_matter", "Oceanography", "", "Mixed sample dates; climatological predictor periods", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_EPSTEIN_2024", "seabed_terrain", "Terrain", "", "Mixed sample dates; climatological predictor periods", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_EPSTEIN_2024", "mud_content", "Sediment", "", "Mixed sample dates; climatological predictor periods", "Original study source definitions pending", "Model input", "Planned study feature"],
    ["S_NCSCD_2013", "soil_map_classes", "Classification", "", "Multi-decade legacy data", "Original study source definitions pending", "Model input", "Reference only"],
    ["S_OLEFELDT_2016", "permafrost_ground_ice", "Expert landscape input", "", "Landscape snapshot around 2015", "Original study source definitions pending", "Model input", "Deferred by maintainer"],
    ["S_OLEFELDT_2016", "sediment_ruggedness_ecoregion_histels", "Expert landscape input", "", "Landscape snapshot around 2015", "Original study source definitions pending", "Model input", "Deferred by maintainer"],
    ["S_LI_2025", "Distbay003", "Geography", "30", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "Study coastline vectors", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "Distriver003", "Hydrology", "30", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "Study HBL river vectors", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "SRTM", "Terrain", "30", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "USGS/SRTMGL1_003", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "TWI", "Terrain", "30", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "DEM-derived TWI", "Rejected in study", "Excluded from Li stack"],
    ["S_LI_2025", "LST05", "Thermal", "100", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "LANDSAT/LC08/C02/T1_L2", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "LSTsd05", "Thermal", "100", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "LANDSAT/LC08/C02/T1_L2", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "LST12", "Thermal", "100", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "LANDSAT/LC08/C02/T1_L2", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "LSTsd12", "Thermal", "100", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "LANDSAT/LC08/C02/T1_L2", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "vvvhRatio", "Radar", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S1_GRD", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "vvvhPlus2", "Radar", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S1_GRD", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "vvvhMinus", "Radar", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S1_GRD", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "VH", "Radar", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S1_GRD", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "VV", "Radar", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S1_GRD", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "EVI12", "Vegetation", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S2_SR_HARMONIZED", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "EVIsd12", "Vegetation", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S2_SR_HARMONIZED", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "EVI05", "Vegetation", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S2_SR_HARMONIZED", "Retained (Boruta)", "Source manifest expanded"],
    ["S_LI_2025", "EVIsd05", "Vegetation", "10", "L8 2013–2021; S1 2015–2022; S2 source 2015–2022; May–Sep or full year by variable", "COPERNICUS/S2_SR_HARMONIZED", "Retained (Boruta)", "Source manifest expanded"]
  ]
};
// ==== END GENERATED CATALOGUE ====

// ---------------------------------------------------------------- colours
// Sequential ramps (light = low). One ramp per quantity, so comparable layers share a scale.
var PAL = {
  soil: ['#fff7e1', '#fde2a2', '#f6b25b', '#de7a26', '#a84a17', '#5c2a0e'],
  conc: ['#fcf4e8', '#f1d7a8', '#d9a85e', '#a8742e', '#6b4417', '#3a230a'],
  bd: ['#f5f5f4', '#d2d3d0', '#a6a8a3', '#767873', '#4a4c48', '#22231f'],
  peat: ['#f1f4f8', '#c6d8ea', '#86b3d6', '#4688bd', '#1d5e95', '#0b3461'],
  forest: ['#f4faf0', '#cbe8bd', '#8ccf7e', '#43a55a', '#17753a', '#03441f'],
  unc: ['#faf8fc', '#dcd9ec', '#aaa3d0', '#7c6db4', '#55328f', '#2f0f5e'],
  terrain: ['#f6f3ea', '#ddd2b4', '#b7a072', '#8c7046', '#5c472a', '#2d2314'],
  water: ['#f2f8fb', '#c7e2ef', '#8cc3de', '#4c9bc8', '#1f6fa6', '#0a4371'],
  heat: ['#fff5f0', '#fcbba1', '#fb6a4a', '#cb181d', '#67000d'],
  temp: ['#2166ac', '#92c5de', '#f7f7f7', '#f4a582', '#b2182b'],   // diverging, neutral at 0 °C
  sar: ['#111111', '#4d4d4d', '#8c8c8c', '#c8c8c8', '#f5f5f5']
};
var VIS = {
  stock100: {min: 0, max: 100, palette: PAL.soil},
  stock30: {min: 0, max: 25, palette: PAL.soil},
  stock300: {min: 0, max: 150, palette: PAL.soil},
  stockUnc: {min: 0, max: 100, palette: PAL.unc},
  conc: {min: 0, max: 200, palette: PAL.conc},
  bd: {min: 0.2, max: 1.8, palette: PAL.bd},
  ocd: {min: 0, max: 80, palette: PAL.soil},
  peatDepth: {min: 0, max: 400, palette: PAL.peat},
  peatDepthUnc: {min: 0, max: 120, palette: PAL.unc},
  peatC: {min: 0, max: 200, palette: PAL.peat},
  peatCUnc: {min: 0, max: 80, palette: PAL.unc},
  forestC: {min: 0, max: 12, palette: PAL.forest},
  forestCUnc: {min: 0, max: 8, palette: PAL.unc},
  agb: {min: 0, max: 25, palette: PAL.forest},
  agbUnc: {min: 0, max: 10, palette: PAL.unc},
  agc: {min: 0, max: 12, palette: PAL.forest}
};
function intervalVis(t, b) { return {min: 0, max: (b - t) * 0.5, palette: PAL.soil}; }

// ---------------------------------------------------------------- image helpers
function firstBand(id) { return ee.Image(id).select(0); }
function soilgrids(prop, t, b) {
  return ee.Image(MAPS + '/soilgrids_v2/' + prop + '_mean').select(prop + '_' + t + '-' + b + 'cm_mean');
}
function geng(prop, t, b) { return ee.Image(GENG + '/' + prop + '_' + t + '_' + b + '_cm').select(0); }
// PEATGRIDS stores "no peat" as NaN in unmasked pixels; NaN >= 0 is false, so this masks them.
function nonnegative(img) { return img.updateMask(img.gte(0)); }
function depthLabel(t, b) { return t + '–' + b + ' cm'; }
function intervalsTo(maxDepth) { return INTERVALS.filter(function (iv) { return iv[1] <= maxDepth; }); }

// Geng: SOC (%) x bulk density (g/cm³) x thickness (cm) = Mg C/ha; / 10 = kg C/m².
function gengIntervalStock(t, b) {
  return geng('SOC', t, b).multiply(geng('BD', t, b)).multiply((b - t) / 10);
}
// SoilGrids: carbon density (hg/m³) / 10 = kg C/m³; x thickness (m) = kg C/m².
function sgIntervalStock(t, b) {
  return soilgrids('ocd', t, b).multiply(0.1 * (b - t) / 100);
}
// A stock needs every interval: the sum is blank wherever any interval is blank.
function sumAll(images, proj) {
  var stack = ee.Image.cat(images);
  return stack.reduce(ee.Reducer.sum())
    .updateMask(stack.mask().reduce(ee.Reducer.min()))
    .setDefaultProjection(proj);
}
function gengStock(maxDepth) {
  return sumAll(intervalsTo(maxDepth).map(function (iv) { return gengIntervalStock(iv[0], iv[1]); }),
                geng('SOC', 0, 5).projection());
}
function sgStock(maxDepth) {
  return sumAll(intervalsTo(maxDepth).map(function (iv) { return sgIntervalStock(iv[0], iv[1]); }),
                soilgrids('ocd', 0, 5).projection());
}
function esa(year, band) {
  return ee.Image(SATIO + '/ESA/ESA_CCI_AGB/CCI_BIOMASS_100m_AGB_' + year + '_V6').select(band);
}
// SBFI stand polygons painted with their mean AGB (t/ha -> kg/m²). Pass a region to limit the polygons used.
function sbfiAgb(region) {
  var fc = ee.FeatureCollection(SBFI);
  if (region) fc = fc.filterBounds(region);
  return ee.Image().float().paint(fc, '088_STRUCTURE_AGB_AVG').multiply(0.1);
}
// Thermokarst polygons: total SOC mass 0–3 m (kg C) / polygon area (m²) = mean kg C/m² per polygon.
function thermokarstPolygons() {
  return ee.FeatureCollection(THERMOKARST).filterBounds(CANADA).filter(ee.Filter.gt('AREA_ha', 0))
    .map(function (f) {
      return f.set('kgm2', ee.Number(f.get('TSOC_kgC')).divide(ee.Number(f.get('AREA_ha')).multiply(1e4)));
    });
}
function thermokarstDensity(region) {
  var fc = thermokarstPolygons();
  if (region) fc = fc.filterBounds(region);
  return ee.Image().float().paint(fc, 'kgm2');
}

// ---------------------------------------------------------------- map layers
// Each layer: one card in the app. A layer has one or more variants (depths, years);
// variant.image(region) returns the image in the units shown. `mass` marks layers in
// kg/m² whose area total is meaningful ('C' for carbon, 'biomass'); uncertainty layers
// and concentrations have no total.
var G_STOCK100 = 'SOC stock, 0–100 cm';
var G_STOCK30 = 'SOC stock, 0–30 cm';
var G_INTERVAL = 'SOC stock by depth interval';
var G_CONC = 'SOC concentration';
var G_BD = 'Bulk density';
var G_OCD = 'Organic carbon density';
var G_DEEP = 'Deeper soil carbon';
var G_PEAT = 'Peat (full modelled peat column)';
var G_FORESTC = 'Forest carbon (above + below ground + dead)';
var G_AGB = 'Aboveground biomass';
var G_AGC = 'Aboveground carbon (biomass × 0.5)';

var GROUP_NOTES = {};
GROUP_NOTES[G_STOCK100] = 'Compare within this group. SoilGrids removes overlying organic layers (mineral-soil depths); ' +
  'Sothe and NCSCDv2 do not. Geng follows pedon depths (mineral surface = 0, to verify).';
GROUP_NOTES[G_STOCK30] = 'Same nominal depth, but SoilGrids excludes overlying organic layers while NCSCDv2 is built ' +
  'from pedons measured from the soil surface.';
GROUP_NOTES[G_INTERVAL] = 'Calculated per interval from concentration and bulk density (Geng) or carbon density ' +
  '(SoilGrids). The colour scale grows with interval thickness.';
GROUP_NOTES[G_CONC] = 'Concentrations are in g/kg. Sothe values are point depths, not interval means.';
GROUP_NOTES[G_PEAT] = 'Li et al. covers the Hudson Bay Lowlands only; PEATGRIDS covers northern peatlands at 1 km.';
GROUP_NOTES[G_AGB] = 'Biomass, not carbon. SBFI stands draw at zoom level 10 or closer.';
GROUP_NOTES[G_AGC] = 'Aboveground only: not comparable with total forest carbon.';

function single(key, label, image, assets) { return [{key: key, label: label, image: image, assets: assets || []}]; }

var LAYERS = [
  // ============================== SOILS
  {key: 'sothe_stock', domain: 'soils', group: G_STOCK100,
    name: 'Sothe et al. soil organic carbon stock (McMaster/WWF)', short: 'Sothe SOC stock 0–1 m',
    source: 'Sothe et al. 2022 · McMaster University & WWF-Canada · 250 m', mapIds: ['M_SOTHE_STOCK'],
    chip: 'SOC stock · 0–100 cm · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 250, vis: VIS.stock100,
    variants: single('0_100', '0–100 cm', function () { return firstBand(MAPS + '/sothe_2022/sc_250m_v20'); },
                     [MAPS + '/sothe_2022/sc_250m_v20']),
    about: {original: 'Sothe et al. (2022) soil organic carbon stock for 0–1 m, stored in kg C/m² on a 250 m grid (band b1).',
            calc: 'None: shown as stored.', shown: 'SOC stock, 0–100 cm, kg C/m².'},
    note: 'Depth 0–1 m (confirmed by the maintainer, 16 Oct 2026). Overlying organic layers are not removed.'},
  {key: 'sothe_unc', domain: 'soils', group: G_STOCK100,
    name: 'Sothe et al. SOC stock uncertainty (McMaster/WWF)', short: 'Sothe SOC stock uncertainty',
    source: 'Sothe et al. 2022 · 250 m', mapIds: ['M_SOTHE_UNC'],
    chip: 'Uncertainty · 0–100 cm · kg C/m²', unit: 'kg C/m²', mass: null, uncertainty: true, scale: 250, vis: VIS.stockUnc,
    variants: single('0_100', '0–100 cm', function () { return firstBand(MAPS + '/sothe_2022/sc_uncertainty_250m_v20'); },
                     [MAPS + '/sothe_2022/sc_uncertainty_250m_v20']),
    about: {original: 'Sothe et al. (2022) uncertainty layer for the 0–1 m stock, 250 m (band b1), on a different grid origin from the prediction.',
            calc: 'None: shown as stored.',
            shown: 'Uncertainty as provided, kg C/m². The source describes it as quantile-based; the exact statistic is not yet confirmed, so it is not a ±1 SD.'}},
  {key: 'sg_stock100', domain: 'soils', group: G_STOCK100,
    name: 'SoilGrids 2.0 SOC stock, calculated for 0–100 cm', short: 'SoilGrids SOC stock 0–100 cm (calculated)',
    source: 'Poggio et al. 2021 · ISRIC · 250 m', mapIds: ['M_SG_OCD'],
    chip: 'SOC stock · 0–100 cm · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 250, vis: VIS.stock100,
    variants: single('0_100', '0–100 cm', function () { return sgStock(100); }, [MAPS + '/soilgrids_v2/ocd_mean']),
    about: {original: 'SoilGrids 2.0 organic carbon density (ocd_mean) for six depth intervals, stored in hg/m³ on a 250 m Homolosine grid.',
            calc: 'For 0–5, 5–15, 15–30, 30–60 and 60–100 cm: density ÷ 10 (kg C/m³) × interval thickness (m), then summed. ' +
                  'Pixels missing any interval are left blank. This is the same calculation as the site comparison.',
            shown: 'SOC stock, 0–100 cm, kg C/m² (calculated: SoilGrids releases no 0–100 cm stock).'},
    note: 'SoilGrids removes overlying organic layers, so carbon in peat or forest floor above the mineral surface is not counted.',
    inputs: function () {
      return INTERVALS.map(function (iv) {
        return {name: 'Input: SoilGrids carbon density ' + depthLabel(iv[0], iv[1]) + ' (hg/m³, as stored)',
                image: soilgrids('ocd', iv[0], iv[1]), vis: {min: 0, max: 800, palette: PAL.soil}};
      });
    }},
  {key: 'geng_stock100', domain: 'soils', group: G_STOCK100,
    name: 'Geng et al. SOC stock, calculated for 0–100 cm', short: 'Geng SOC stock 0–100 cm (calculated)',
    source: 'Geng et al. 2025 · Soil Landscape Grids of Canada · 100 m', mapIds: ['M_GENG_SOC', 'M_GENG_BD'],
    chip: 'SOC stock · 0–100 cm · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 100, vis: VIS.stock100,
    variants: single('0_100', '0–100 cm', function () { return gengStock(100); },
                     [GENG + '/SOC_{depth}_cm', GENG + '/BD_{depth}_cm']),
    about: {original: 'Geng et al. (2025) SOC concentration (%) and bulk density (g/cm³) for 0–5, 5–15, 15–30, 30–60 and 60–100 cm, 100 m.',
            calc: 'For each interval: SOC (%) × bulk density (g/cm³) × thickness (cm) = Mg C/ha, ÷ 10 = kg C/m²; summed over the five intervals. ' +
                  'Pixels missing any interval are left blank (about 2% of the mapped area, mostly where deeper layers are masked above shallow bedrock). ' +
                  'No coarse-fragment correction, so stony soils may be overestimated.',
            shown: 'SOC stock, 0–100 cm, kg C/m² (calculated).'},
    note: 'Geng follows pedon depths (mineral surface = 0, to verify).',
    inputs: function () { return gengInputs(INTERVALS); }},
  {key: 'ncscd100', domain: 'soils', group: G_STOCK100,
    name: 'NCSCDv2 SOC stock, 0–100 cm', short: 'NCSCDv2 SOC stock 0–100 cm',
    source: 'Hugelius et al. 2013 · Northern Circumpolar Soil Carbon Database · 0.012°', mapIds: ['M_NCSCD_100'],
    chip: 'SOC stock · 0–100 cm · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 1336, vis: VIS.stock100,
    variants: single('0_100', '0–100 cm', function () { return firstBand(MAPS + '/ncscdv2/NCSCDv2_Canada_WGS84_SOCC100_0012deg').multiply(0.1); },
                     [MAPS + '/ncscdv2/NCSCDv2_Canada_WGS84_SOCC100_0012deg']),
    about: {original: 'NCSCDv2 SOCC100, hg C/m² on a 0.012° grid.', calc: '÷ 10 (hg C/m² → kg C/m²).', shown: 'SOC stock, 0–100 cm, kg C/m².'},
    note: 'Polygon-based soil map gridded at 0.012° (about 1.3 km); ground resolution varies with latitude.'},

  {key: 'sg_ocs30', domain: 'soils', group: G_STOCK30,
    name: 'SoilGrids 2.0 SOC stock, 0–30 cm', short: 'SoilGrids SOC stock 0–30 cm',
    source: 'Poggio et al. 2021 · ISRIC · 250 m', mapIds: ['M_SG_OCS'],
    chip: 'SOC stock · 0–30 cm · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 250, vis: VIS.stock30,
    variants: single('0_30', '0–30 cm', function () { return soilgrids('ocs', 0, 30).multiply(0.1); }, [MAPS + '/soilgrids_v2/ocs_mean']),
    about: {original: 'SoilGrids 2.0 ocs_mean 0–30 cm, stored in t/ha (×10 encoding) on a 250 m grid.',
            calc: '÷ 10 (stored t/ha encoding → kg C/m²), as on the site.', shown: 'SOC stock, 0–30 cm, kg C/m².'},
    note: 'Released SoilGrids layer; overlying organic layers are excluded.'},
  {key: 'ncscd30', domain: 'soils', group: G_STOCK30,
    name: 'NCSCDv2 SOC stock, 0–30 cm', short: 'NCSCDv2 SOC stock 0–30 cm',
    source: 'Hugelius et al. 2013 · 0.012°', mapIds: ['M_NCSCD_30'],
    chip: 'SOC stock · 0–30 cm · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 1336, vis: VIS.stock30,
    variants: single('0_30', '0–30 cm', function () { return firstBand(MAPS + '/ncscdv2/NCSCDv2_Canada_WGS84_SOCC30_0012deg').multiply(0.1); },
                     [MAPS + '/ncscdv2/NCSCDv2_Canada_WGS84_SOCC30_0012deg']),
    about: {original: 'NCSCDv2 SOCC30, hg C/m² on a 0.012° grid.', calc: '÷ 10 (hg C/m² → kg C/m²).', shown: 'SOC stock, 0–30 cm, kg C/m².'}},
  {key: 'geng_stock30', domain: 'soils', group: G_STOCK30,
    name: 'Geng et al. SOC stock, calculated for 0–30 cm', short: 'Geng SOC stock 0–30 cm (calculated)',
    source: 'Geng et al. 2025 · 100 m', mapIds: ['M_GENG_SOC', 'M_GENG_BD'],
    chip: 'SOC stock · 0–30 cm · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 100, vis: VIS.stock30,
    variants: single('0_30', '0–30 cm', function () { return gengStock(30); }, [GENG + '/SOC_{depth}_cm', GENG + '/BD_{depth}_cm']),
    about: {original: 'Geng et al. (2025) SOC concentration (%) and bulk density (g/cm³) for 0–5, 5–15 and 15–30 cm, 100 m.',
            calc: 'For each interval: SOC (%) × bulk density (g/cm³) × thickness (cm) ÷ 10 = kg C/m²; summed. Pixels missing any interval are left blank. No coarse-fragment correction.',
            shown: 'SOC stock, 0–30 cm, kg C/m² (calculated).'},
    inputs: function () { return gengInputs(intervalsTo(30)); }},

  {key: 'geng_interval', domain: 'soils', group: G_INTERVAL,
    name: 'Geng et al. SOC stock per depth interval (calculated)', short: 'Geng SOC stock (calculated)',
    source: 'Geng et al. 2025 · 100 m', mapIds: ['M_GENG_SOC', 'M_GENG_BD'],
    chip: 'SOC stock per interval · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 100,
    variants: INTERVALS.map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]), vis: intervalVis(iv[0], iv[1]), t: iv[0], b: iv[1],
              image: function () { return gengIntervalStock(iv[0], iv[1]); },
              assets: [GENG + '/SOC_' + iv[0] + '_' + iv[1] + '_cm', GENG + '/BD_' + iv[0] + '_' + iv[1] + '_cm']};
    }),
    about: {original: 'Geng et al. (2025) SOC concentration (%) and bulk density (g/cm³) for the chosen interval, 100 m.',
            calc: 'SOC (%) × bulk density (g/cm³) × thickness (cm) = Mg C/ha; ÷ 10 = kg C/m². No coarse-fragment correction.',
            shown: 'SOC stock in the chosen interval, kg C/m² (calculated).'},
    inputs: function (v) { return gengInputs([[v.t, v.b]]); }},
  {key: 'sg_interval', domain: 'soils', group: G_INTERVAL,
    name: 'SoilGrids 2.0 SOC stock per depth interval (calculated)', short: 'SoilGrids SOC stock (calculated)',
    source: 'Poggio et al. 2021 · 250 m', mapIds: ['M_SG_OCD'],
    chip: 'SOC stock per interval · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 250,
    variants: INTERVALS.concat([[100, 200]]).map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]), vis: intervalVis(iv[0], iv[1]), t: iv[0], b: iv[1],
              image: function () { return sgIntervalStock(iv[0], iv[1]); }, assets: [MAPS + '/soilgrids_v2/ocd_mean']};
    }),
    about: {original: 'SoilGrids 2.0 organic carbon density (hg/m³) for the chosen interval, 250 m.',
            calc: 'Density ÷ 10 (kg C/m³) × interval thickness (m) = kg C/m².',
            shown: 'SOC stock in the chosen interval, kg C/m² (calculated).'},
    note: 'Mineral-soil depths: overlying organic layers are excluded.',
    inputs: function (v) {
      return [{name: 'Input: SoilGrids carbon density ' + v.label + ' (hg/m³, as stored)', image: soilgrids('ocd', v.t, v.b),
               vis: {min: 0, max: 800, palette: PAL.soil}}];
    }},

  {key: 'sothe_conc', domain: 'soils', group: G_CONC,
    name: 'Sothe et al. SOC concentration at point depths (McMaster/WWF)', short: 'Sothe SOC concentration',
    source: 'Sothe et al. 2022 · 250 m', mapIds: ['M_SOTHE_CONC'],
    chip: 'SOC concentration · point depth · g/kg', unit: 'g/kg', mass: null, scale: 250, vis: VIS.conc,
    variants: [0, 5, 15, 30, 60, 100].map(function (d) {
      var id = MAPS + '/sothe_2022/scc_' + d + 'cm_250m_version10';
      return {key: String(d), label: d + ' cm (point depth)', image: function () { return firstBand(id); }, assets: [id]};
    }),
    about: {original: 'Sothe et al. (2022) SOC concentration predicted at 0, 5, 15, 30, 60 and 100 cm, 250 m (band b1).',
            calc: 'None: shown as stored. The catalogue records the study unit as g/kg; the stored scaling is still to be confirmed.',
            shown: 'SOC concentration at the chosen point depth, g/kg (as stored).'},
    note: 'Point-depth predictions: do not read them as interval means.'},
  {key: 'sg_soc', domain: 'soils', group: G_CONC,
    name: 'SoilGrids 2.0 SOC concentration', short: 'SoilGrids SOC concentration',
    source: 'Poggio et al. 2021 · 250 m', mapIds: ['M_SG_SOC'],
    chip: 'SOC concentration · interval · g/kg', unit: 'g/kg', mass: null, scale: 250, vis: VIS.conc,
    variants: INTERVALS.concat([[100, 200]]).map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]),
              image: function () { return soilgrids('soc', iv[0], iv[1]).multiply(0.1); }, assets: [MAPS + '/soilgrids_v2/soc_mean']};
    }),
    about: {original: 'SoilGrids 2.0 soc_mean, dg/kg, 250 m.', calc: '÷ 10 (dg/kg → g/kg).', shown: 'SOC concentration in the chosen interval, g/kg.'}},
  {key: 'geng_soc', domain: 'soils', group: G_CONC,
    name: 'Geng et al. SOC concentration', short: 'Geng SOC concentration',
    source: 'Geng et al. 2025 · 100 m', mapIds: ['M_GENG_SOC'],
    chip: 'SOC concentration · interval · g/kg', unit: 'g/kg', mass: null, scale: 100, vis: VIS.conc,
    variants: INTERVALS.map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]),
              image: function () { return geng('SOC', iv[0], iv[1]).multiply(10); },
              assets: [GENG + '/SOC_' + iv[0] + '_' + iv[1] + '_cm']};
    }),
    about: {original: 'Geng et al. (2025) SOC concentration, %, 100 m.', calc: '× 10 (% → g/kg).', shown: 'SOC concentration in the chosen interval, g/kg.'}},

  {key: 'sg_bd', domain: 'soils', group: G_BD,
    name: 'SoilGrids 2.0 bulk density', short: 'SoilGrids bulk density',
    source: 'Poggio et al. 2021 · 250 m', mapIds: ['M_SG_BD'],
    chip: 'Bulk density · interval · g/cm³', unit: 'g/cm³', mass: null, scale: 250, vis: VIS.bd,
    variants: INTERVALS.concat([[100, 200]]).map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]),
              image: function () { return soilgrids('bdod', iv[0], iv[1]).multiply(0.01); }, assets: [MAPS + '/soilgrids_v2/bdod_mean']};
    }),
    about: {original: 'SoilGrids 2.0 bdod_mean, cg/cm³, 250 m.', calc: '÷ 100 (cg/cm³ → g/cm³).', shown: 'Bulk density of the fine earth in the chosen interval, g/cm³.'}},
  {key: 'geng_bd', domain: 'soils', group: G_BD,
    name: 'Geng et al. bulk density', short: 'Geng bulk density',
    source: 'Geng et al. 2025 · 100 m', mapIds: ['M_GENG_BD'],
    chip: 'Bulk density · interval · g/cm³', unit: 'g/cm³', mass: null, scale: 100, vis: VIS.bd,
    variants: INTERVALS.map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]),
              image: function () { return geng('BD', iv[0], iv[1]); }, assets: [GENG + '/BD_' + iv[0] + '_' + iv[1] + '_cm']};
    }),
    about: {original: 'Geng et al. (2025) bulk density, g/cm³, 100 m.', calc: 'None: shown as stored.', shown: 'Bulk density in the chosen interval, g/cm³.'}},
  {key: 'sg_ocd', domain: 'soils', group: G_OCD,
    name: 'SoilGrids 2.0 organic carbon density', short: 'SoilGrids carbon density',
    source: 'Poggio et al. 2021 · 250 m', mapIds: ['M_SG_OCD'],
    chip: 'Carbon density · interval · kg C/m³', unit: 'kg C/m³', mass: null, scale: 250, vis: VIS.ocd,
    variants: INTERVALS.concat([[100, 200]]).map(function (iv) {
      return {key: iv[0] + '_' + iv[1], label: depthLabel(iv[0], iv[1]),
              image: function () { return soilgrids('ocd', iv[0], iv[1]).multiply(0.1); }, assets: [MAPS + '/soilgrids_v2/ocd_mean']};
    }),
    about: {original: 'SoilGrids 2.0 ocd_mean, hg/m³, 250 m.', calc: '÷ 10 (hg/m³ → kg C/m³).',
            shown: 'Organic carbon per volume of soil in the chosen interval, kg C/m³. Multiply by thickness in metres for a stock (see the interval stock layer).'}},
  {key: 'ncscd200', domain: 'soils', group: G_DEEP,
    name: 'NCSCDv2 SOC stock, 100–200 cm', short: 'NCSCDv2 SOC stock 100–200 cm',
    source: 'Hugelius et al. 2013 · 0.012°', mapIds: ['M_NCSCD_200'],
    chip: 'SOC stock · 100–200 cm · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 1336, vis: VIS.stock100,
    variants: single('100_200', '100–200 cm', function () { return firstBand(MAPS + '/ncscdv2/NCSCDv2_Canada_WGS84_SOCC200_0012deg').multiply(0.1); },
                     [MAPS + '/ncscdv2/NCSCDv2_Canada_WGS84_SOCC200_0012deg']),
    about: {original: 'NCSCDv2 SOCC200 (the 100–200 cm layer), hg C/m², 0.012°.', calc: '÷ 10 (hg C/m² → kg C/m²).', shown: 'SOC stock, 100–200 cm, kg C/m².'}},
  {key: 'thermokarst', domain: 'soils', group: G_DEEP,
    name: 'Thermokarst landscapes: SOC 0–3 m per polygon (calculated)', short: 'Thermokarst landscapes SOC 0–3 m',
    source: 'Olefeldt et al. 2016 · polygons', mapIds: ['M_THERMOKARST'],
    chip: 'SOC stock · 0–3 m · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 1000, vis: VIS.stock300,
    variants: single('0_300', '0–300 cm', function (region) { return thermokarstDensity(region); }, [THERMOKARST]),
    regionImage: true,
    about: {original: 'Olefeldt et al. (2016) circumpolar thermokarst landscape polygons. TSOC_kgC is the total SOC mass (kg C, 0–3 m) in each polygon; AREA_ha is its area.',
            calc: 'TSOC_kgC ÷ (AREA_ha × 10,000) = mean SOC per m² for each polygon, painted onto the map. Polygons with zero area are dropped.',
            shown: 'Polygon-mean SOC stock, 0–3 m, kg C/m² (calculated). One value per polygon, so it shows no variation within a polygon.'},
    inputs: function () {
      return [{name: 'Input: thermokarst landscape polygons (outlines)',
               image: ee.FeatureCollection(THERMOKARST).filterBounds(CANADA).style({color: '444444', fillColor: '00000000', width: 0.6}), vis: {}}];
    }},

  {key: 'li_depth', domain: 'soils', group: G_PEAT,
    name: 'Li et al. peat depth, Hudson Bay Lowlands (McMaster)', short: 'Li peat depth',
    source: 'Li et al. 2025 · McMaster University · 30 m', mapIds: ['M_LI_DEPTH'],
    chip: 'Peat depth · full column · cm', unit: 'cm', mass: null, scale: 30, vis: VIS.peatDepth,
    variants: single('full', 'Full peat column', function () { return firstBand(MAPS + '/li_2025_hbl/McMaster_PeatDepth_30m'); },
                     [MAPS + '/li_2025_hbl/McMaster_PeatDepth_30m']),
    about: {original: 'Li et al. (2025) modelled peat depth, cm, 30 m (b1).', calc: 'None: shown as stored.', shown: 'Peat depth, cm.'},
    note: 'Hudson Bay Lowlands only.'},
  {key: 'li_depth_unc', domain: 'soils', group: G_PEAT,
    name: 'Li et al. peat depth uncertainty', short: 'Li peat depth uncertainty',
    source: 'Li et al. 2025 · 30 m', mapIds: ['M_LI_DEPTH_UNC'],
    chip: 'Uncertainty · cm', unit: 'cm', mass: null, uncertainty: true, scale: 30, vis: VIS.peatDepthUnc,
    variants: single('full', 'Full peat column', function () { return firstBand(MAPS + '/li_2025_hbl/McMaster_Uncertainty_PeatDepth_30m'); },
                     [MAPS + '/li_2025_hbl/McMaster_Uncertainty_PeatDepth_30m']),
    about: {original: 'Li et al. (2025) peat-depth uncertainty, cm, 30 m.', calc: 'None: shown as stored.',
            shown: '±1 SD among the base-model estimates, cm: model disagreement, not a 95% interval or total error.'}},
  {key: 'li_carbon', domain: 'soils', group: G_PEAT,
    name: 'Li et al. peat carbon stock, Hudson Bay Lowlands (McMaster)', short: 'Li peat carbon',
    source: 'Li et al. 2025 · 30 m', mapIds: ['M_LI_C'],
    chip: 'Peat carbon · full column · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 30, vis: VIS.peatC,
    variants: single('full', 'Full peat column', function () { return firstBand(MAPS + '/li_2025_hbl/McMasterCarbon30mkgm2version1'); },
                     [MAPS + '/li_2025_hbl/McMasterCarbon30mkgm2version1']),
    about: {original: 'Li et al. (2025) peat carbon stock for the full peat column, kg C/m², 30 m.', calc: 'None: shown as stored.',
            shown: 'Peat carbon stock, full modelled column, kg C/m².'},
    note: 'Hudson Bay Lowlands only.'},
  {key: 'li_carbon_unc', domain: 'soils', group: G_PEAT,
    name: 'Li et al. peat carbon uncertainty', short: 'Li peat carbon uncertainty',
    source: 'Li et al. 2025 · 30 m', mapIds: ['M_LI_C_UNC'],
    chip: 'Uncertainty · kg C/m²', unit: 'kg C/m²', mass: null, uncertainty: true, scale: 30, vis: VIS.peatCUnc,
    variants: single('full', 'Full peat column', function () { return firstBand(MAPS + '/li_2025_hbl/McMasterUncertaintyCarbon30mkgm2'); },
                     [MAPS + '/li_2025_hbl/McMasterUncertaintyCarbon30mkgm2']),
    about: {original: 'Li et al. (2025) peat-carbon uncertainty, kg C/m², 30 m.', calc: 'None: shown as stored.',
            shown: '±1 SD among the base-model estimates, kg C/m²: model disagreement, not a 95% interval or total error.'}},
  {key: 'pg_thickness', domain: 'soils', group: G_PEAT,
    name: 'PEATGRIDS peat thickness', short: 'PEATGRIDS peat thickness',
    source: 'PEATGRIDS v2 · 1 km', mapIds: ['M_PEATGRIDS'],
    chip: 'Peat thickness · full column · cm', unit: 'cm', mass: null, scale: 1000, vis: VIS.peatDepth,
    variants: single('full', 'Full peat column', function () {
      return nonnegative(ee.Image(SATIO + '/PEATGRIDS/THICKNESS_CM').select('THICKNESS_CM_MEAN'));
    }, [SATIO + '/PEATGRIDS/THICKNESS_CM']),
    about: {original: 'PEATGRIDS THICKNESS_CM_MEAN, cm, 1 km. Pixels outside peatlands are stored as NaN.',
            calc: 'NaN pixels masked (no other change).', shown: 'Modelled peat thickness, cm.'}},
  {key: 'pg_thickness_sd', domain: 'soils', group: G_PEAT,
    name: 'PEATGRIDS peat thickness standard deviation', short: 'PEATGRIDS thickness SD',
    source: 'PEATGRIDS v2 · 1 km', mapIds: ['M_PEATGRIDS'],
    chip: 'Uncertainty · cm', unit: 'cm', mass: null, uncertainty: true, scale: 1000, vis: VIS.peatDepthUnc,
    variants: single('full', 'Full peat column', function () {
      var img = ee.Image(SATIO + '/PEATGRIDS/THICKNESS_CM');
      return img.select('THICKNESS_CM_STDEV').updateMask(img.select('THICKNESS_CM_MEAN').gte(0));
    }, [SATIO + '/PEATGRIDS/THICKNESS_CM']),
    about: {original: 'PEATGRIDS THICKNESS_CM_STDEV, cm, 1 km.', calc: 'Masked where the mean is missing.',
            shown: 'Standard deviation as provided by PEATGRIDS, cm (see the release for its definition).'}},
  {key: 'pg_carbon', domain: 'soils', group: G_PEAT,
    name: 'PEATGRIDS peat carbon stock', short: 'PEATGRIDS peat carbon',
    source: 'PEATGRIDS v2 · 1 km', mapIds: ['M_PEATGRIDS'],
    chip: 'Peat carbon · full column · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 1000, vis: VIS.peatC,
    variants: single('full', 'Full peat column', function () {
      return nonnegative(ee.Image(SATIO + '/PEATGRIDS/C_STOCK_MGC_PER_M2').select('C_STOCK_MgC_per_m2_MEAN')).multiply(1000);
    }, [SATIO + '/PEATGRIDS/C_STOCK_MGC_PER_M2']),
    about: {original: 'PEATGRIDS C_STOCK_MgC_per_m2_MEAN, Mg C/m², 1 km.', calc: 'NaN pixels masked; × 1000 (Mg C/m² → kg C/m²).',
            shown: 'Peat carbon stock, full modelled column, kg C/m².'}},
  {key: 'pg_carbon_sd', domain: 'soils', group: G_PEAT,
    name: 'PEATGRIDS peat carbon standard deviation', short: 'PEATGRIDS carbon SD',
    source: 'PEATGRIDS v2 · 1 km', mapIds: ['M_PEATGRIDS'],
    chip: 'Uncertainty · kg C/m²', unit: 'kg C/m²', mass: null, uncertainty: true, scale: 1000, vis: VIS.peatCUnc,
    variants: single('full', 'Full peat column', function () {
      var img = ee.Image(SATIO + '/PEATGRIDS/C_STOCK_MGC_PER_M2');
      return img.select('C_STOCK_MgC_per_m2_STDEV').updateMask(img.select('C_STOCK_MgC_per_m2_MEAN').gte(0)).multiply(1000);
    }, [SATIO + '/PEATGRIDS/C_STOCK_MGC_PER_M2']),
    about: {original: 'PEATGRIDS C_STOCK_MgC_per_m2_STDEV, Mg C/m², 1 km.', calc: 'Masked where the mean is missing; × 1000 (→ kg C/m²).',
            shown: 'Standard deviation as provided by PEATGRIDS, kg C/m².'}},

  // ============================== FORESTS
  {key: 'mcm_forest', domain: 'forests', group: G_FORESTC,
    name: 'Sothe et al. forest carbon (McMaster/WWF)', short: 'McMaster/WWF forest carbon',
    source: 'Sothe et al. 2022 · McMaster University & WWF-Canada · 250 m', mapIds: ['M_FOREST_C'],
    chip: 'Vegetation carbon · above + below + dead · kg C/m²', unit: 'kg C/m²', mass: 'C', scale: 250, vis: VIS.forestC,
    variants: single('total', 'All vegetation pools', function () { return firstBand(SATIO + '/carbon_stocks_ca/fc/fc_250m_version10'); },
                     [SATIO + '/carbon_stocks_ca/fc/fc_250m_version10']),
    about: {original: 'Sothe et al. (2022) forest carbon: aboveground + belowground biomass + dead plant carbon, kg C/m², 250 m.',
            calc: 'None: shown as stored.', shown: 'Forest vegetation carbon (above + below ground + dead), kg C/m².'},
    note: 'Inputs mostly 2015–2019. Includes belowground and dead carbon, so it is larger than any aboveground-only layer.'},
  {key: 'mcm_forest_unc', domain: 'forests', group: G_FORESTC,
    name: 'Sothe et al. forest carbon uncertainty', short: 'McMaster/WWF forest carbon uncertainty',
    source: 'Sothe et al. 2022 · 250 m', mapIds: ['M_FOREST_C'],
    chip: 'Uncertainty · kg C/m²', unit: 'kg C/m²', mass: null, uncertainty: true, scale: 250, vis: VIS.forestCUnc,
    variants: single('total', 'All vegetation pools', function () { return firstBand(SATIO + '/carbon_stocks_ca/fc/fc_uncertainty_250m_version10'); },
                     [SATIO + '/carbon_stocks_ca/fc/fc_uncertainty_250m_version10']),
    about: {original: 'Sothe et al. (2022) forest-carbon uncertainty image, kg C/m², 250 m.', calc: 'None: shown as stored.',
            shown: 'Uncertainty as provided, kg C/m².'}},
  {key: 'scanfi_agb', domain: 'forests', group: G_AGB,
    name: 'SCANFI v1.2 aboveground biomass, 2020', short: 'SCANFI aboveground biomass',
    source: 'Guindon et al. 2024 · Canadian Forest Service · 30 m', mapIds: ['M_SCANFI_V1'],
    chip: 'Aboveground biomass · 2020 · kg/m²', unit: 'kg/m²', mass: 'biomass', scale: 30, vis: VIS.agb,
    variants: single('2020', '2020', function () { return ee.Image(SCANFI).select('biomass').multiply(0.1); }, [SCANFI]),
    about: {original: 'SCANFI v1.2 biomass band, t/ha, 30 m, 2020.', calc: '× 0.1 (t/ha → kg/m²).', shown: 'Aboveground tree biomass, kg/m² (biomass, not carbon).'}},
  {key: 'esa_agb', domain: 'forests', group: G_AGB,
    name: 'ESA CCI aboveground biomass v6', short: 'ESA CCI aboveground biomass',
    source: 'ESA Climate Change Initiative Biomass v6 · 100 m', mapIds: ['M_ESA_CCI'],
    chip: 'Aboveground biomass · by year · kg/m²', unit: 'kg/m²', mass: 'biomass', scale: 100, vis: VIS.agb, timeSeries: true,
    variants: ESA_YEARS.slice().reverse().map(function (y) {
      return {key: String(y), label: String(y), year: y, image: function () { return esa(y, 'AGB').multiply(0.1); },
              assets: [SATIO + '/ESA/ESA_CCI_AGB/CCI_BIOMASS_100m_AGB_' + y + '_V6']};
    }),
    about: {original: 'ESA CCI Biomass v6 AGB band, Mg/ha, 100 m; images for 2007, 2010 and 2015–2022.', calc: '× 0.1 (Mg/ha → kg/m²).',
            shown: 'Aboveground woody biomass for the chosen year, kg/m². Area summaries include a chart across all years.'}},
  {key: 'esa_agb_sd', domain: 'forests', group: G_AGB,
    name: 'ESA CCI aboveground biomass standard deviation', short: 'ESA CCI biomass SD',
    source: 'ESA CCI Biomass v6 · 100 m', mapIds: ['M_ESA_CCI'],
    chip: 'Uncertainty · by year · kg/m²', unit: 'kg/m²', mass: null, uncertainty: true, scale: 100, vis: VIS.agbUnc,
    variants: ESA_YEARS.slice().reverse().map(function (y) {
      return {key: String(y), label: String(y), image: function () { return esa(y, 'SD').multiply(0.1); },
              assets: [SATIO + '/ESA/ESA_CCI_AGB/CCI_BIOMASS_100m_AGB_' + y + '_V6']};
    }),
    about: {original: 'ESA CCI Biomass v6 SD band, Mg/ha, 100 m.', calc: '× 0.1 (Mg/ha → kg/m²).', shown: 'Per-pixel standard deviation of AGB as provided, kg/m².'}},
  {key: 'sbfi_agb', domain: 'forests', group: G_AGB,
    name: 'SBFI stand-level aboveground biomass', short: 'SBFI stand AGB',
    source: 'Spatialized Canadian forest inventory (SBFI) · stand polygons', mapIds: ['M_SBFI'],
    chip: 'Aboveground biomass · stand mean · kg/m²', unit: 'kg/m²', mass: 'biomass', scale: 30, vis: VIS.agb,
    minZoom: 10, maxSummaryKm2: 10000, regionImage: true,
    variants: single('mean', 'Stand mean', function (region) { return sbfiAgb(region); }, [SBFI]),
    about: {original: 'SBFI stand polygons; 088_STRUCTURE_AGB_AVG is the mean modelled AGB in each polygon, t/ha.',
            calc: '× 0.1 (t/ha → kg/m²), painted per polygon.', shown: 'Stand-mean aboveground biomass, kg/m².'},
    note: 'More than 10 million polygons: draws at zoom level 10 or closer, and area summaries are limited to 10,000 km².'},
  {key: 'scanfi_agc', domain: 'forests', group: G_AGC,
    name: 'SCANFI v1.2 aboveground carbon, 2020 (calculated)', short: 'SCANFI aboveground carbon',
    source: 'Guindon et al. 2024 · 30 m', mapIds: ['M_SCANFI_V1'],
    chip: 'Aboveground carbon · 2020 · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 30, vis: VIS.agc,
    variants: single('2020', '2020', function () { return ee.Image(SCANFI).select('biomass').multiply(0.05); }, [SCANFI]),
    about: {original: 'SCANFI v1.2 biomass band, t/ha, 30 m, 2020.', calc: '× 0.5 carbon fraction × 0.1 (t/ha → kg/m²) = × 0.05. As used on the site.',
            shown: 'Aboveground carbon, kg C/m² (calculated). Aboveground only.'},
    inputs: function () {
      return [{name: 'Input: SCANFI v1.2 biomass (t/ha, as stored)', image: ee.Image(SCANFI).select('biomass'), vis: {min: 0, max: 250, palette: PAL.forest}}];
    }},
  {key: 'esa_agc', domain: 'forests', group: G_AGC,
    name: 'ESA CCI aboveground carbon v6 (calculated)', short: 'ESA CCI aboveground carbon',
    source: 'ESA CCI Biomass v6 · 100 m', mapIds: ['M_ESA_CCI'],
    chip: 'Aboveground carbon · by year · kg C/m² · calculated', unit: 'kg C/m²', mass: 'C', scale: 100, vis: VIS.agc, timeSeries: true,
    variants: ESA_YEARS.slice().reverse().map(function (y) {
      return {key: String(y), label: String(y), year: y, image: function () { return esa(y, 'AGB').multiply(0.05); },
              assets: [SATIO + '/ESA/ESA_CCI_AGB/CCI_BIOMASS_100m_AGB_' + y + '_V6']};
    }),
    about: {original: 'ESA CCI Biomass v6 AGB band, Mg/ha, 100 m.', calc: '× 0.5 carbon fraction × 0.1 (Mg/ha → kg/m²) = × 0.05.',
            shown: 'Aboveground carbon for the chosen year, kg C/m² (calculated). Aboveground only.'},
    inputs: function (v) {
      return [{name: 'Input: ESA CCI AGB ' + v.label + ' (Mg/ha, as stored)', image: esa(v.year, 'AGB'), vis: {min: 0, max: 250, palette: PAL.forest}}];
    }}
];

function gengInputs(intervals) {
  var out = [];
  intervals.forEach(function (iv) {
    out.push({name: 'Input: Geng SOC ' + depthLabel(iv[0], iv[1]) + ' (%, as stored)', image: geng('SOC', iv[0], iv[1]),
              vis: {min: 0, max: 20, palette: PAL.conc}});
    out.push({name: 'Input: Geng bulk density ' + depthLabel(iv[0], iv[1]) + ' (g/cm³, as stored)', image: geng('BD', iv[0], iv[1]), vis: VIS.bd});
  });
  return out;
}

// ---------------------------------------------------------------- covariates
// One entry per Earth Engine dataset named in the catalogue's Covariates table. Each
// shows a representative layer; the study's exact feature definitions are listed in About.
function cdem() {
  var col = ee.ImageCollection('NRCan/CDEM');
  return col.mosaic().select('elevation').setDefaultProjection(col.first().projection());
}
function era5(band) { return ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR').filterDate('2019-01-01', '2024-01-01').select(band); }
function terraclimate(band) { return ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filterDate('1991-01-01', '2021-01-01').select(band); }
function daymet(band) { return ee.ImageCollection('NASA/ORNL/DAYMET_V4').filterDate('2019-01-01', '2020-01-01').select(band); }
function mod13(band) {
  return ee.ImageCollection('MODIS/061/MOD13Q1').filterDate('2000-01-01', '2022-01-01')
    .filter(ee.Filter.calendarRange(3, 9, 'month')).select(band).mean().multiply(0.0001);
}
function palsar(pol) {
  var dn = ee.Image(ee.ImageCollection('JAXA/ALOS/PALSAR/YEARLY/SAR').filterDate('2018-01-01', '2019-01-01').first()).select(pol);
  return dn.updateMask(dn.gt(0)).pow(2).log10().multiply(10).subtract(83);   // gamma-nought, dB (JAXA formula)
}
function s1(pol) {
  return ee.ImageCollection('COPERNICUS/S1_GRD').filterDate('2020-06-01', '2020-09-01')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', pol))
    .select(pol).median();
}
function s2ndvi() {
  return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterDate('2020-06-01', '2020-09-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 60))
    .map(function (img) {
      var scl = img.select('SCL');
      var clear = scl.eq(4).or(scl.eq(5)).or(scl.eq(6));   // vegetation, bare, water
      return img.normalizedDifference(['B8', 'B4']).rename('NDVI').updateMask(clear);
    }).median();
}
function dw(band) { return ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1').filterDate('2020-06-01', '2020-09-01').select(band).mean(); }
function l8lst() {
  return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2').filterDate('2020-05-01', '2020-10-01')
    .filter(ee.Filter.lt('CLOUD_COVER', 60))
    .map(function (img) {
      var qa = img.select('QA_PIXEL');
      var clear = qa.bitwiseAnd(2).eq(0).and(qa.bitwiseAnd(8).eq(0)).and(qa.bitwiseAnd(16).eq(0));  // dilated cloud, cloud, shadow
      return img.select('ST_B10').multiply(0.00341802).add(149.0).subtract(273.15).rename('LST').updateMask(clear);
    }).median();
}
function cov(key, label, unit, vis, image, shown) { return {key: key, label: label, unit: unit, vis: vis, image: image, shown: shown}; }

var COV_SOURCES = [
  {id: 'NRCan/CDEM', name: 'Canadian Digital Elevation Model (NRCan CDEM)', scale: 23, variants: [
    cov('elevation', 'Elevation', 'm', {min: 0, max: 1500, palette: PAL.terrain}, cdem, 'Elevation, static DEM.'),
    cov('slope', 'Slope', '°', {min: 0, max: 30, palette: PAL.terrain}, function () { return ee.Terrain.slope(cdem()); }, 'Slope from the CDEM.')]},
  {id: 'ECMWF/ERA5_LAND/MONTHLY_AGGR', name: 'ERA5-Land monthly climate', scale: 11132, variants: [
    cov('t2m', 'Mean air temperature 2019–2023', '°C', {min: -15, max: 15, palette: PAL.temp},
        function () { return era5('temperature_2m').mean().subtract(273.15); }, 'Mean 2 m air temperature, 2019–2023.'),
    cov('precip', 'Mean annual precipitation 2019–2023', 'mm', {min: 0, max: 1500, palette: PAL.water},
        function () { return era5('total_precipitation_sum').sum().divide(5).multiply(1000); }, 'Mean annual total precipitation, 2019–2023.')]},
  {id: 'IDAHO_EPSCOR/TERRACLIMATE', name: 'TerraClimate monthly climate', scale: 4638, variants: [
    cov('pr', 'Mean annual precipitation 1991–2020', 'mm', {min: 0, max: 1500, palette: PAL.water},
        function () { return terraclimate('pr').sum().divide(30); }, 'Mean annual precipitation, 1991–2020.'),
    cov('tmmx', 'Mean monthly maximum temperature 1991–2020', '°C', {min: -20, max: 20, palette: PAL.temp},
        function () { return terraclimate('tmmx').mean().multiply(0.1); }, 'Mean of monthly maximum temperature, 1991–2020.')]},
  {id: 'NASA/ORNL/DAYMET_V4', name: 'Daymet V4 daily weather', scale: 1000, variants: [
    cov('tmax', 'Mean daily maximum temperature 2019', '°C', {min: -20, max: 20, palette: PAL.temp},
        function () { return daymet('tmax').mean(); }, 'Mean daily maximum temperature, 2019 (one year shown for speed).'),
    cov('prcp', 'Total precipitation 2019', 'mm', {min: 0, max: 1500, palette: PAL.water},
        function () { return daymet('prcp').sum(); }, 'Total precipitation, 2019.')]},
  {id: 'MODIS/061/MOD13Q1', name: 'MODIS vegetation indices (MOD13Q1)', scale: 250, variants: [
    cov('ndvi', 'NDVI, March–September mean 2000–2021', 'NDVI', {min: 0, max: 1, palette: PAL.forest},
        function () { return mod13('NDVI'); }, 'Mean NDVI for March–September, 2000–2021.'),
    cov('evi', 'EVI, March–September mean 2000–2021', 'EVI', {min: 0, max: 0.6, palette: PAL.forest},
        function () { return mod13('EVI'); }, 'Mean EVI for March–September, 2000–2021.')]},
  {id: 'MODIS/061/MCD43A4', name: 'MODIS nadir reflectance (MCD43A4)', scale: 500, variants: [
    cov('b7', 'Band 7 (shortwave infrared) reflectance, June–August 2020', 'reflectance', {min: 0, max: 0.3, palette: PAL.terrain},
        function () {
          return ee.ImageCollection('MODIS/061/MCD43A4').filterDate('2020-06-01', '2020-09-01')
            .select('Nadir_Reflectance_Band7').mean().multiply(0.0001);
        }, 'Mean band 7 nadir reflectance, June–August 2020.')]},
  {id: 'JAXA/ALOS/PALSAR/YEARLY/SAR', name: 'ALOS PALSAR yearly radar mosaic', scale: 25, variants: [
    cov('hv', 'HV backscatter 2018', 'dB', {min: -30, max: -5, palette: PAL.sar}, function () { return palsar('HV'); }, 'HV gamma-nought, 2018 mosaic.'),
    cov('hh', 'HH backscatter 2018', 'dB', {min: -20, max: 0, palette: PAL.sar}, function () { return palsar('HH'); }, 'HH gamma-nought, 2018 mosaic.')]},
  {id: 'COPERNICUS/S1_GRD', name: 'Sentinel-1 radar (GRD)', scale: 10, variants: [
    cov('vh', 'VH median, June–August 2020', 'dB', {min: -30, max: -10, palette: PAL.sar}, function () { return s1('VH'); }, 'Median VH backscatter, IW mode, June–August 2020.'),
    cov('vv', 'VV median, June–August 2020', 'dB', {min: -20, max: 0, palette: PAL.sar}, function () { return s1('VV'); }, 'Median VV backscatter, IW mode, June–August 2020.')]},
  {id: 'COPERNICUS/S2_SR_HARMONIZED', name: 'Sentinel-2 surface reflectance', scale: 10, variants: [
    cov('ndvi', 'NDVI median, June–August 2020', 'NDVI', {min: 0, max: 1, palette: PAL.forest}, s2ndvi,
        'Median NDVI, June–August 2020, cloud and shadow masked with the scene classification.')]},
  {id: 'GOOGLE/DYNAMICWORLD/V1', name: 'Dynamic World land-cover probabilities', scale: 10, variants: [
    cov('trees', 'Tree probability, June–August 2020', 'probability', {min: 0, max: 1, palette: PAL.forest}, function () { return dw('trees'); }, 'Mean tree probability, June–August 2020.'),
    cov('shrub_and_scrub', 'Shrub probability, June–August 2020', 'probability', {min: 0, max: 1, palette: PAL.terrain}, function () { return dw('shrub_and_scrub'); }, 'Mean shrub-and-scrub probability, June–August 2020.'),
    cov('flooded_vegetation', 'Flooded vegetation probability, June–August 2020', 'probability', {min: 0, max: 1, palette: PAL.peat}, function () { return dw('flooded_vegetation'); }, 'Mean flooded-vegetation probability, June–August 2020.'),
    cov('water', 'Water probability, June–August 2020', 'probability', {min: 0, max: 1, palette: PAL.water}, function () { return dw('water'); }, 'Mean water probability, June–August 2020.')]},
  {id: 'JRC/GSW1_4/GlobalSurfaceWater', name: 'JRC Global Surface Water', scale: 30, variants: [
    cov('occurrence', 'Water occurrence 1984–2021', '%', {min: 0, max: 100, palette: PAL.water},
        function () { return ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence'); }, 'Share of valid observations with water, 1984–2021.'),
    cov('recurrence', 'Water recurrence 1984–2021', '%', {min: 0, max: 100, palette: PAL.water},
        function () { return ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('recurrence'); }, 'How often water returns from year to year, 1984–2021.'),
    cov('seasonality', 'Water seasonality', 'months', {min: 0, max: 12, palette: PAL.water},
        function () { return ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('seasonality'); }, 'Months with water in 2021.')]},
  {id: 'LANDSAT/LC08/C02/T1_L2', name: 'Landsat 8 surface temperature (Collection 2)', scale: 30, variants: [
    cov('lst', 'Land surface temperature, May–September 2020 median', '°C', {min: 0, max: 40, palette: PAL.heat}, l8lst,
        'Median surface temperature from ST_B10, May–September 2020, cloud and shadow masked.')]},
  {id: SATIO + '/carbon_stocks_ca/ch', name: 'Canopy height (Sothe et al. 2022 forest inputs)', scale: 250, variants: [
    cov('p95', '95th percentile canopy height', 'm', {min: 0, max: 30, palette: PAL.forest},
        function () { return firstBand(SATIO + '/carbon_stocks_ca/ch/ch_95perc_height_250m'); }, '95th percentile canopy height, 250 m.'),
    cov('p85', '85th percentile canopy height', 'm', {min: 0, max: 30, palette: PAL.forest},
        function () { return firstBand(SATIO + '/carbon_stocks_ca/ch/ch_85perc_height_250m'); }, '85th percentile canopy height, 250 m.'),
    cov('max', 'Maximum canopy height', 'm', {min: 0, max: 40, palette: PAL.forest},
        function () { return firstBand(SATIO + '/carbon_stocks_ca/ch/ch_max_height_250m'); }, 'Maximum canopy height, 250 m.')]}
];

// Covariate rows: [study, feature, family, native grid (m), window, source, evidence, status]
function sourceOf(row) {
  for (var i = 0; i < COV_SOURCES.length; i++) if (row[5].indexOf(COV_SOURCES[i].id) === 0) return COV_SOURCES[i];
  return null;
}
function matchStatus(sourceText) {
  var s = sourceText.toLowerCase();
  if (s.indexOf('substitute') >= 0) return 'substitute';
  if (s.indexOf('pending') >= 0 || s.indexOf('match') >= 0) return 'release to confirm';
  return 'same dataset';
}
function covariateRows(domain, study) {
  return (CATALOGUE.covariates || []).filter(function (r) {
    var s = (CATALOGUE.studies || {})[r[0]];
    return s && s.domain === domain && (study === 'all' || r[0] === study);
  });
}
function covariateItems(domain, study) {
  var rows = covariateRows(domain, study);
  var items = [];
  COV_SOURCES.forEach(function (src) {
    var matched = rows.filter(function (r) { return sourceOf(r) === src; });
    if (!matched.length) return;
    items.push({key: 'cov_' + domain + '_' + src.id.replace(/[^A-Za-z0-9]/g, '_'), domain: domain, section: 'covariates',
                name: src.name, short: src.name, source: src.id + ' · native ' + src.scale + ' m', mapIds: [],
                chip: 'Covariate · ' + matched.length + ' study feature' + (matched.length === 1 ? '' : 's'),
                mass: null, scale: src.scale, rows: matched,
                variants: src.variants.map(function (v) {
                  return {key: v.key, label: v.label, unit: v.unit, vis: v.vis, image: v.image, shown: v.shown, assets: [src.id]};
                })});
  });
  return {items: items, unmatched: rows.filter(function (r) { return !sourceOf(r); })};
}

// ---------------------------------------------------------------- ground data
// Field names and units per prepared table. SOC is shown in g/kg, bulk density in g/cm³,
// stocks in kg C/m² (Mg/ha × 0.1).
var GROUND = [
  {id: 'wosis', name: 'WoSIS', long: 'WoSIS soil profiles (Canada, v2)', groundId: 'G_WOSIS', summaryKey: 'WoSIS', color: '#2a78d6',
    profiles: PROFILES + '/wosis_canada_profiles_v2', layers: PROFILES + '/wosis_canada_layers_v2',
    top: 'upper_depth', bottom: 'lower_depth', profileBottom: 'profile_bottom_cm', year: 'date',
    soc: {field: 'OrgC', factor: 1, label: 'Organic C'}, socAlt: {field: 'TOTC', factor: 1, label: 'Total C'}, bd: {field: 'BDOD', factor: 1},
    stock: [{field: 'sum_OrgC_stock_kgm2', factor: 1, label: 'Organic C, sum of layers with a stock', depthField: 'profile_bottom_cm',
             flag: 'OrgC_stock_all_layers_computable', flagFalse: 'partial: some layers have no computable stock'}],
    depthNote: 'Depths from the profile top; organic surface layers are flagged in the source.'},
  {id: 'npdb', name: 'NPDB', long: 'National Pedon Database (Canada)', groundId: 'G_NPDB', summaryKey: 'NPDB', color: '#eb6834',
    profiles: PROFILES + '/npdb_canada_profiles_v1', layers: PROFILES + '/npdb_canada_layers_v1',
    top: 'top_depth_cm', bottom: 'bot_depth_cm', profileBottom: 'profile_bottom_cm', year: 'cal_year',
    soc: {field: 'carbon_pct', factor: 10, label: 'Organic C'}, socAlt: null, bd: {field: 'bulk_density', factor: 1},
    stock: [{field: 'std_stock_Mgha', factor: 0.1, label: 'Organic C to the standard depth', depthField: 'std_depth_cm',
             flag: 'std_stock_complete', flagFalse: 'incomplete: missing data within the standard depth'},
            {field: 'total_stock_Mgha', factor: 0.1, label: 'Organic C, whole profile', depthField: 'profile_bottom_cm',
             flag: 'total_is_lower_bound', flagTrue: 'lower bound: some layers lack data'}],
    depthNote: 'Layer depths as recorded: mineral surface = 0 cm; organic (LFH) horizons have negative depths above it.'},
  {id: 'canpeat', name: 'NRCan peat', long: 'NRCan Peat Profile Database', groundId: 'G_NRCAN_PEAT', summaryKey: 'NRCan peat', color: '#1baf7a',
    profiles: PROFILES + '/canpeat_profiles_v1', layers: PROFILES + '/canpeat_layers_v1',
    top: 'upper_depth', bottom: 'lower_depth', profileBottom: 'Total_depth_cm', year: 'Year',
    soc: {field: 'OrgC', factor: 10, label: 'Organic C'}, socAlt: {field: 'TOTC', factor: 10, label: 'Total C'}, bd: {field: 'BDOD', factor: 1},
    stock: [{field: 'Org_C_MGHA', factor: 0.1, label: 'Organic C, whole core', depthField: 'Total_depth_cm'},
            {field: 'Total_C_MgCha', factor: 0.1, label: 'Total C, whole core', depthField: 'Total_depth_cm'}],
    depthNote: 'Depths from the peat surface; the full sampled column. Most bulk densities are estimated, not measured.'},
  {id: 'janousek', name: 'Janousek', long: 'Janousek coastal (blue carbon) cores', groundId: 'G_JANOUSEK', summaryKey: 'Janousek', color: '#eda100',
    profiles: PROFILES + '/janousek_profiles_v1', layers: PROFILES + '/janousek_layers_v1',
    top: 'upper_depth', bottom: 'lower_depth', profileBottom: 'total_depth_cm', year: 'year',
    soc: {field: 'OrgC_pct', factor: 10, label: 'Organic C'}, socAlt: {field: 'TOTC_pct', factor: 10, label: 'Total C'}, bd: {field: 'BDOD', factor: 1},
    stock: [{field: 'sum_OrgC_Stock_kgm2', factor: 1, label: 'Organic C, sum of layers', depthField: 'total_depth_cm'}],
    depthNote: 'Depths from the sediment surface. Covers the Pacific coast from Alaska to Mexico.'},
  {id: 'riley', name: 'Riley', long: 'Riley peatland samples (Ontario Geological Survey)', groundId: 'G_RILEY', summaryKey: 'Riley', color: '#e87ba4',
    profiles: PROFILES + '/riley_profiles_v1', layers: PROFILES + '/riley_layers_v1',
    top: 'upper_depth_cm', bottom: 'lower_depth_cm', profileBottom: 'profile_bottom_cm', year: null,
    soc: {field: 'organic_carbon_pct', factor: 10, label: 'Organic C'}, socAlt: {field: 'total_carbon_pct', factor: 10, label: 'Total C'}, bd: null,
    stock: [],
    depthNote: 'Depths from the peat surface. Bulk-density units are unverified, so bulk density is not shown. No sampling dates.'}
];
function groundById(id) { return GROUND.filter(function (d) { return d.id === id; })[0]; }

// ---------------------------------------------------------------- server-side queries
function merge(a, b) {
  var out = {}, k;
  for (k in a) if (a.hasOwnProperty(k)) out[k] = a[k];
  for (k in b) if (b.hasOwnProperty(k)) out[k] = b[k];
  return out;
}
function variantOf(item, key) {
  for (var i = 0; i < item.variants.length; i++) if (item.variants[i].key === key) return item.variants[i];
  return item.variants[0];
}
function visOf(item, v) { return v.vis || item.vis; }
function unitOf(item, v) { return v.unit || item.unit; }
function scaleOf(item, v) { return v.scale || item.scale; }

// Native grid, unless the area holds more than MAX_SUMMARY_PIXELS cells; then the next
// coarser round grid. The grid used is always reported.
function chooseScale(nativeScale, areaM2) {
  if (areaM2 / (nativeScale * nativeScale) <= MAX_SUMMARY_PIXELS) return nativeScale;
  var need = Math.sqrt(areaM2 / MAX_SUMMARY_PIXELS);
  var nice = [30, 50, 100, 250, 500, 1000, 2000, 5000, 10000, 20000];
  for (var i = 0; i < nice.length; i++) if (nice[i] >= need) return nice[i];
  return 50000;
}

// Area statistics for one image: sums of value×area and area (for an area-weighted mean
// and, for kg/m² layers, the total in kg) plus pixel percentiles.
function summaryDict(image, aoi, scale) {
  var v = image.rename('v');
  var opts = {geometry: aoi, crs: SUMMARY_CRS, scale: scale, maxPixels: 1e13, tileScale: 4};
  var area = ee.Image.pixelArea();
  var sums = ee.Image.cat([v.multiply(area).rename('va'), area.updateMask(v.mask().gt(0)).rename('a')])
    .reduceRegion(merge(opts, {reducer: ee.Reducer.sum()}));
  var pct = v.reduceRegion(merge(opts, {reducer: ee.Reducer.percentile([5, 50, 95])}));
  return ee.Dictionary(sums).combine(pct);
}
// Area-weighted mean for every year of a time-series layer.
function seriesDict(item, aoi, scale) {
  var keys = item.variants.map(function (v) { return v.key; });
  var dicts = item.variants.map(function (v) {
    var img = v.image().rename('v');
    var area = ee.Image.pixelArea();
    return ee.Image.cat([img.multiply(area).rename('va'), area.updateMask(img.mask().gt(0)).rename('a')])
      .reduceRegion({reducer: ee.Reducer.sum(), geometry: aoi, crs: SUMMARY_CRS, scale: scale, maxPixels: 1e13, tileScale: 4});
  });
  return ee.Dictionary.fromLists(keys, dicts);
}
// Value of each image at a point: {id: {v: value or null}}.
function pointValues(entries, pt) {
  return ee.Dictionary.fromLists(entries.map(function (e) { return e.id; }), entries.map(function (e) {
    return e.image.rename('v').reduceRegion({reducer: ee.Reducer.first(), geometry: pt, crs: SUMMARY_CRS, scale: e.scale});
  }));
}
function pointSeries(item, pt) {
  return ee.Dictionary.fromLists(item.variants.map(function (v) { return v.key; }), item.variants.map(function (v) {
    return v.image().rename('v').reduceRegion({reducer: ee.Reducer.first(), geometry: pt, crs: SUMMARY_CRS, scale: scaleOf(item, v)});
  }));
}

// Text fields such as '12', '1939-??-??' or 2010 to numbers (-1 when absent).
function toNumber(value, regex) {
  var s = ee.String(ee.Algorithms.If(value, ee.Algorithms.String(value), ''));
  var m = s.match(regex || '-?[0-9]+([.][0-9]+)?');
  return ee.Number(ee.Algorithms.If(m.size().gt(0), ee.Number.parse(m.get(0)), -1));
}
function toYear(value) { return toNumber(value, '(18|19|20)[0-9][0-9]'); }

function groundSummaryDict(ds, aoi) {
  var prof = ee.FeatureCollection(ds.profiles).filterBounds(aoi);
  var withNum = prof.map(function (f) {
    var out = f.set('_bottom', toNumber(f.get(ds.profileBottom)));
    return ds.year ? out.set('_year', toYear(f.get(ds.year))) : out;
  });
  var d = {
    profiles: prof.size(),
    reach30: withNum.filter(ee.Filter.gte('_bottom', 30)).size(),
    reach100: withNum.filter(ee.Filter.gte('_bottom', 100)).size(),
    layers: ee.FeatureCollection(ds.layers).filterBounds(aoi).size()
  };
  if (ds.year) {
    var dated = withNum.filter(ee.Filter.gt('_year', 0));
    d.dated = dated.size();
    d.yearMin = ee.Algorithms.If(dated.size().gt(0), dated.aggregate_min('_year'), null);
    d.yearMax = ee.Algorithms.If(dated.size().gt(0), dated.aggregate_max('_year'), null);
  }
  return ee.Dictionary(d);
}
function nearestProfile(datasets, pt, toleranceM) {
  var zone = pt.buffer(toleranceM);
  return ee.FeatureCollection(datasets.map(function (ds) {
    return ee.FeatureCollection(ds.profiles).filterBounds(zone).map(function (f) {
      return f.set('_ds', ds.id, '_dist', f.geometry().distance(pt, 1));
    });
  })).flatten().sort('_dist').first();
}
function profileLayers(ds, uid) {
  var fields = [ds.top, ds.bottom];
  if (ds.soc) fields.push(ds.soc.field);
  if (ds.socAlt) fields.push(ds.socAlt.field);
  if (ds.bd) fields.push(ds.bd.field);
  return ee.FeatureCollection(ds.layers).filter(ee.Filter.eq('profile_uid', uid)).select(fields, null, false).sort(ds.top);
}

// ---------------------------------------------------------------- formatting
function addCommas(s) {
  var parts = String(s).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
function fmt(x) {
  if (x === null || x === undefined || !isFinite(x)) return '–';
  var a = Math.abs(x);
  var d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : a >= 0.01 ? 3 : 4;
  if (a === 0) d = 0;
  return addCommas(Number(x).toFixed(d));
}
var SUPERSCRIPT = {'0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'};
function sci(x) {
  var e = Math.floor(Math.log(x) / Math.LN10);
  var m = x / Math.pow(10, e);
  if (m >= 9.995) { m = m / 10; e = e + 1; }
  return m.toFixed(2) + ' × 10' + String(e).split('').map(function (c) { return SUPERSCRIPT[c]; }).join('');
}
// Mass in kg, with tonnes (below a million tonnes) or megatonnes.
function fmtMass(kg, what) {
  var suffix = what === 'C' ? ' C' : '';
  var kgText = Math.abs(kg) >= 1e9 ? sci(kg) + ' kg' : addCommas(Math.round(kg)) + ' kg';
  var t = kg / 1000;
  var tText = Math.abs(t) >= 1e6 ? fmt(t / 1e6) + ' Mt' : addCommas(Math.round(t)) + ' t';
  return kgText + suffix + ' (' + tText + suffix + ')';
}
// @@DATA-END ------------------------------------------------------------------


// @@UI-START ------------------------------------------------------------------
var COLOR = {ink: '#1f2a24', muted: '#5b6660', line: '#d9dedb', accent: '#1d6b48', aoi: 'd6336c', link: '#1c5cab'};
var S = {
  title: {fontSize: '20px', fontWeight: 'bold', color: COLOR.ink, margin: '8px 8px 0 8px'},
  intro: {fontSize: '12px', color: COLOR.muted, margin: '4px 8px 6px 8px', whiteSpace: 'pre-wrap'},
  step: {fontSize: '14px', fontWeight: 'bold', color: COLOR.accent, margin: '14px 8px 4px 8px'},
  group: {fontSize: '13px', fontWeight: 'bold', color: COLOR.ink, margin: '12px 8px 2px 8px'},
  text: {fontSize: '12px', color: COLOR.ink, margin: '2px 8px', whiteSpace: 'pre-wrap'},
  key: {fontSize: '11px', fontWeight: 'bold', color: COLOR.muted, margin: '6px 8px 0 8px'},
  small: {fontSize: '11px', color: COLOR.muted, margin: '2px 8px', whiteSpace: 'pre-wrap'},
  chip: {fontSize: '11px', color: COLOR.accent, margin: '2px 8px'},
  link: {fontSize: '11px', color: COLOR.link, margin: '2px 8px'},
  card: {border: '1px solid ' + COLOR.line, margin: '4px 6px', padding: '2px 0 4px 0'},
  cardTitle: {fontSize: '12px', fontWeight: 'bold', color: COLOR.ink, margin: '4px 8px 0 8px', whiteSpace: 'pre-wrap'},
  btn: {margin: '2px 2px'}
};

var state = {
  domain: null, aoi: null, aoiLabel: '', aoiArea: null, aoiOutline: null, drawing: false,
  shown: {}, showButtons: {}, inputLayers: [], groundOn: {}, covStudy: {forests: 'all', soils: 'all'},
  selectedLayer: null
};
GROUND.forEach(function (ds) { state.groundOn[ds.id] = true; });

function label(text, style) { return ui.Label(text, style || S.text); }
function link(text, url) { return ui.Label({value: text, style: S.link, targetUrl: url}); }
function row(widgets, style) { return ui.Panel(widgets, ui.Panel.Layout.flow('horizontal', true), style || {margin: '0 6px'}); }
function button(text, onClick) { return ui.Button({label: text, onClick: onClick, style: S.btn}); }
function keyValue(key, value) { return [ui.Label(key, S.key), ui.Label(value, S.text)]; }

// ---------------------------------------------------------------- map
var mapView = ui.Map();
var LIGHT = [
  {stylers: [{saturation: -100}, {lightness: 35}]},
  {featureType: 'road', stylers: [{visibility: 'off'}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
  {featureType: 'water', stylers: [{color: '#dbe4e9'}]},
  {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#9aa29e'}]}
];
mapView.setOptions('Light', {Light: LIGHT}, ['Light', 'HYBRID', 'TERRAIN']);
mapView.setControlVisibility({layerList: true, zoomControl: true, scaleControl: true, mapTypeControl: true,
                              fullscreenControl: false, drawingToolsControl: false});
mapView.setCenter(-96, 60, 4);
mapView.style().set('cursor', 'crosshair');

var dataLayers = [];
var overlayLayers = [];
function addDataLayer(layer) { mapView.layers().insert(dataLayers.length, layer); dataLayers.push(layer); }
function removeDataLayer(layer) {
  mapView.layers().remove(layer);
  var i = dataLayers.indexOf(layer);
  if (i >= 0) dataLayers.splice(i, 1);
}
// Overlays (area outline, ground data) always sit above the data layers; the selected-profile
// marker sits on top of everything.
function setOverlays(list) {
  overlayLayers.forEach(function (l) { mapView.layers().remove(l); });
  if (state.selectedLayer) mapView.layers().remove(state.selectedLayer);
  overlayLayers = list;
  overlayLayers.forEach(function (l) { mapView.layers().add(l); });
  if (state.selectedLayer) mapView.layers().add(state.selectedLayer);
}
function setSelected(layer) {
  if (state.selectedLayer) mapView.layers().remove(state.selectedLayer);
  state.selectedLayer = layer;
  if (layer) mapView.layers().add(layer);
}

// ---------------------------------------------------------------- panels
var left = ui.Panel({style: {width: '410px', padding: '4px'}});
var right = ui.Panel({style: {width: '390px', padding: '4px'}});
var results = ui.Panel();
var legend = ui.Panel({style: {position: 'bottom-left', padding: '6px 4px', width: '270px'}});
mapView.add(legend);

function resultCard(title, widgets) {
  var card = ui.Panel({style: S.card});
  var close = ui.Button({label: '✕', style: {margin: '0 4px 0 0', padding: '0'}});
  close.onClick(function () { results.remove(card); });
  card.add(ui.Panel([ui.Label(title, merge(S.cardTitle, {stretch: 'horizontal'})), close], ui.Panel.Layout.flow('horizontal')));
  widgets.forEach(function (w) { card.add(w); });
  results.insert(0, card);
  return card;
}

// ---------------------------------------------------------------- area of interest
var drawing = mapView.drawingTools();
drawing.setShown(false);
drawing.setLinked(false);
drawing.setDrawModes(['polygon', 'rectangle']);
var aoiDrawLayer = ui.Map.GeometryLayer({geometries: [], name: 'Area of interest (drawn)', color: COLOR.aoi});
drawing.layers().add(aoiDrawLayer);
var aoiStatus = label('No area set. Points use their dataset colours; summaries need an area.', S.small);
var assetBox = ui.Textbox({placeholder: 'projects/…/assets/my_area', style: {stretch: 'horizontal', margin: '2px 4px 2px 8px'}});

function startDrawing(shape) {
  clearAoi();
  state.drawing = true;
  drawing.setShape(shape);
  drawing.draw();
  aoiStatus.setValue(shape === 'polygon' ? 'Click on the map to add corners; double-click to finish.'
                                         : 'Click and drag on the map to draw a rectangle.');
}
function onAoiDrawn() {
  drawing.setShape(null);
  state.drawing = false;
  if (aoiDrawLayer.geometries().length() === 0) return;
  setAoi(aoiDrawLayer.toGeometry(), 'drawn area', false);
}
drawing.onDraw(ui.util.debounce(onAoiDrawn, 400));
drawing.onEdit(ui.util.debounce(onAoiDrawn, 400));

function loadAssetAoi() {
  var id = (assetBox.getValue() || '').replace(/^\s+|\s+$/g, '');
  if (!id) { aoiStatus.setValue('Paste a table asset ID first.'); return; }
  aoiStatus.setValue('Loading ' + id + ' …');
  var fc = ee.FeatureCollection(id);
  fc.size().evaluate(function (n, err) {
    if (err || !n) {
      aoiStatus.setValue('Could not read ' + id + '. It must be a table (FeatureCollection) asset that is public or shared with this app. ' +
                         (err || 'The table is empty.'));
      return;
    }
    aoiDrawLayer.geometries().reset([]);
    setAoi(fc.geometry(10), id + ' (' + n + ' feature' + (n === 1 ? '' : 's') + ')', true);
  });
}
function setAoi(geom, name, outline) {
  state.aoi = geom;
  state.aoiLabel = name;
  state.aoiArea = null;
  state.aoiOutline = outline ? ui.Map.Layer(ee.FeatureCollection([ee.Feature(geom)]).style(
    {color: COLOR.aoi, fillColor: '00000000', width: 2}), {}, 'Area of interest') : null;
  aoiStatus.setValue('Area of interest: ' + name + ' · measuring…');
  geom.area(10).evaluate(function (m2, err) {
    if (state.aoi !== geom) return;
    if (err) { aoiStatus.setValue('The area could not be measured: ' + err); return; }
    state.aoiArea = m2;
    aoiStatus.setValue('Area of interest: ' + name + ' · ' + fmt(m2 / 1e6) + ' km²');
  });
  if (outline) mapView.centerObject(geom);
  refreshPoints();
}
function clearAoi() {
  aoiDrawLayer.geometries().reset([]);
  state.aoi = null;
  state.aoiArea = null;
  state.aoiLabel = '';
  state.aoiOutline = null;
  aoiStatus.setValue('No area set. Points use their dataset colours; summaries need an area.');
  refreshPoints();
}
function requireAoi() {
  if (!state.aoi) {
    resultCard('No area of interest', [label('Draw an area or load a table asset first (step 1).')]);
    return false;
  }
  if (state.aoiArea === null) {
    resultCard('Still measuring the area', [label('Try again in a moment.')]);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------- ground data points
function pointStyle(ds) { return {color: '1f1f1f', fillColor: ds.color.slice(1) + 'ee', pointSize: 4, width: 0.6}; }
function refreshPoints() {
  var on = GROUND.filter(function (ds) { return state.groundOn[ds.id]; });
  var list = [];
  if (state.aoiOutline) list.push(state.aoiOutline);
  if (state.aoi) {
    if (on.length) {
      var all = ee.FeatureCollection(on.map(function (ds) { return ee.FeatureCollection(ds.profiles); })).flatten();
      list.push(ui.Map.Layer(all.style({color: '6f6f6f', fillColor: 'c4c4c4aa', pointSize: 3, width: 0.5}), {},
                             'Ground data outside the area'));
    }
    on.forEach(function (ds) {
      list.push(ui.Map.Layer(ee.FeatureCollection(ds.profiles).filterBounds(state.aoi).style(pointStyle(ds)), {},
                             ds.name + ' inside the area'));
    });
  } else {
    on.forEach(function (ds) {
      list.push(ui.Map.Layer(ee.FeatureCollection(ds.profiles).style(pointStyle(ds)), {}, ds.name));
    });
  }
  setOverlays(list);
  refreshLegend();
}

// ---------------------------------------------------------------- legend
function swatch(color) {
  return ui.Label('', {backgroundColor: color, padding: '5px', margin: '5px 6px 0 8px', border: '1px solid #1f1f1f'});
}
function colorBar(palette) {
  return ui.Thumbnail({image: ee.Image.pixelLonLat().select(0),
                       params: {bbox: [0, 0, 1, 0.1], dimensions: '200x10', format: 'png', min: 0, max: 1, palette: palette},
                       style: {stretch: 'horizontal', margin: '2px 8px', maxHeight: '12px'}});
}
function refreshLegend() {
  legend.clear();
  legend.add(ui.Label('Ground data', merge(S.key, {margin: '0 8px'})));
  GROUND.forEach(function (ds) {
    if (state.groundOn[ds.id]) legend.add(ui.Panel([swatch(ds.color), ui.Label(ds.name + (state.aoi ? ' (inside the area)' : ''), S.small)],
                                                    ui.Panel.Layout.flow('horizontal')));
  });
  if (state.aoi) legend.add(ui.Panel([swatch('#c4c4c4'), ui.Label('Outside the area', S.small)], ui.Panel.Layout.flow('horizontal')));
  Object.keys(state.shown).forEach(function (k) {
    var s = state.shown[k], vis = visOf(s.item, s.variant);
    legend.add(ui.Label(s.item.short + (s.item.variants.length > 1 ? ' · ' + s.variant.label : ''), merge(S.key, {margin: '6px 8px 0 8px'})));
    if (vis.palette) {
      legend.add(colorBar(vis.palette));
      legend.add(ui.Panel([ui.Label(fmt(vis.min), S.small), ui.Label(unitOf(s.item, s.variant), merge(S.small, {stretch: 'horizontal', textAlign: 'center'})),
                           ui.Label(fmt(vis.max) + '+', S.small)], ui.Panel.Layout.flow('horizontal')));
    }
    if (s.item.minZoom && mapView.getZoom() < s.item.minZoom) legend.add(ui.Label('Zoom in to level ' + s.item.minZoom + ' to draw', S.small));
  });
}
mapView.onChangeZoom(function (zoom) {
  var changed = false;
  Object.keys(state.shown).forEach(function (k) {
    var s = state.shown[k];
    if (s.item.minZoom) { s.layer.setShown(zoom >= s.item.minZoom); changed = true; }
  });
  if (changed) refreshLegend();
});

// ---------------------------------------------------------------- showing layers
function layerName(item, v) { return item.short + (item.variants.length > 1 ? ' · ' + v.label : '') + ' (' + unitOf(item, v) + ')'; }
function showItem(item, variantKey) {
  hideItem(item.key, true);
  var v = variantOf(item, variantKey);
  var layer = ui.Map.Layer(v.image(), visOf(item, v), layerName(item, v), item.minZoom ? mapView.getZoom() >= item.minZoom : true);
  addDataLayer(layer);
  state.shown[item.key] = {item: item, variant: v, layer: layer};
  if (state.showButtons[item.key]) state.showButtons[item.key].setLabel('Hide');
  refreshLegend();
}
function hideItem(key, keepButton) {
  var s = state.shown[key];
  if (!s) return;
  removeDataLayer(s.layer);
  delete state.shown[key];
  if (!keepButton && state.showButtons[key]) state.showButtons[key].setLabel('Show on map');
  refreshLegend();
}
function removeAllLayers() {
  Object.keys(state.shown).forEach(function (k) { hideItem(k); });
  state.inputLayers.forEach(removeDataLayer);
  state.inputLayers = [];
}
function addInputs(item, variantKey) {
  var v = variantOf(item, variantKey);
  var inputs = item.inputs(v);
  inputs.forEach(function (inp) {
    var layer = ui.Map.Layer(inp.image, inp.vis, inp.name, false);
    addDataLayer(layer);
    state.inputLayers.push(layer);
  });
  resultCard('Input layers: ' + item.short, [
    label('Added ' + inputs.length + ' input layer' + (inputs.length === 1 ? '' : 's') + ', switched off. Tick them in the Layers menu at the top right of the map.'),
    label(inputs.map(function (i) { return '• ' + i.name; }).join('\n'), S.small)]);
}

// ---------------------------------------------------------------- about
function showAbout(item, variantKey) {
  var v = variantOf(item, variantKey);
  var w = [];
  if (item.section === 'covariates') {
    w = w.concat(keyValue('What is shown', v.label + ' (' + v.unit + '). ' + v.shown));
    w = w.concat(keyValue('Earth Engine dataset', item.source));
    w.push(ui.Label('Study features using this dataset', S.key));
    w.push(label('This app shows one representative layer per dataset. The features below are how each study used it; ' +
                 '"substitute" or "release to confirm" means the Earth Engine version differs from, or is not yet matched to, the study input.', S.small));
    item.rows.forEach(function (r) {
      var study = (CATALOGUE.studies[r[0]] || {}).name || r[0];
      w.push(label('• ' + study + ': ' + r[1] + ' (' + r[2] + (r[3] ? ', ' + r[3] + ' m' : '') + (r[4] ? ', ' + r[4] : '') + '). ' +
                   r[6] + '; ' + matchStatus(r[5]) + '.', S.small));
    });
    resultCard('About: ' + item.name, w);
    return;
  }
  w = w.concat(keyValue('What is shown', item.about.shown + (item.variants.length > 1 ? ' Showing: ' + v.label + '.' : '')));
  w = w.concat(keyValue('Original data', item.about.original));
  w = w.concat(keyValue('Calculation', item.about.calc));
  if (item.note) w = w.concat(keyValue('Depth, pools and coverage', item.note));
  item.mapIds.forEach(function (id) {
    var m = (CATALOGUE.maps || {})[id];
    if (!m) return;
    w = w.concat(keyValue('Catalogue record ' + id, m.name + '. Units as recorded: ' + m.units + '.'));
    if (m.uncertainty) w = w.concat(keyValue('Uncertainty', m.uncertainty));
    if (m.considerations) w = w.concat(keyValue('Considerations', m.considerations));
    if (m.url) w.push(link('Source: ' + m.url, m.url));
  });
  var assets = (v.assets || []).map(function (a) {
    return a.replace('{depth}', (v.t !== undefined ? v.t + '_' + v.b : '0_5 … 60_100'));
  });
  if (assets.length) w = w.concat(keyValue('Earth Engine assets', assets.join('\n')));
  w.push(link('Data and summaries on the site', SITE));
  resultCard('About: ' + item.short, w);
}

// ---------------------------------------------------------------- area summaries
function summaryText(item, v, d, scale) {
  var unit = unitOf(item, v);
  var a = d.a || 0;
  var lines = [];
  if (!a) return ['No data in the area for this layer.'];
  var mean = d.va / a;
  lines.push('Area with data: ' + fmt(a / 1e6) + ' km² of ' + fmt(state.aoiArea / 1e6) + ' km² (' + fmt(100 * Math.min(1, a / state.aoiArea)) + '%)');
  lines.push((item.uncertainty ? 'Mean uncertainty (area-weighted): ' : 'Mean (area-weighted): ') + fmt(mean) + ' ' + unit);
  lines.push('Median of pixels (5th–95th percentile): ' + fmt(d.v_p50) + ' (' + fmt(d.v_p5) + '–' + fmt(d.v_p95) + ') ' + unit);
  if (item.mass && !item.uncertainty) lines.push('Total ' + (item.mass === 'C' ? 'carbon' : 'biomass') + ': ' + fmtMass(d.va, item.mass));
  if (item.uncertainty) lines.push('Uncertainty is reported as a mean only: it is not summed into a total.');
  return lines;
}
function summariseItem(item, variantKey) {
  if (!requireAoi()) return;
  var v = variantOf(item, variantKey);
  var title = item.short + (item.variants.length > 1 ? ' · ' + v.label : '');
  if (item.maxSummaryKm2 && state.aoiArea / 1e6 > item.maxSummaryKm2) {
    resultCard(title, [label('This layer can be summarised for areas up to ' + addCommas(item.maxSummaryKm2) + ' km². Draw a smaller area.')]);
    return;
  }
  var nativeScale = scaleOf(item, v);
  var scale = chooseScale(nativeScale, state.aoiArea);
  var status = label('Summarising on a ' + addCommas(scale) + ' m grid…', S.small);
  var card = resultCard(title, [label(item.chip || '', S.chip), status]);
  var image = item.regionImage ? v.image(state.aoi) : v.image();
  summaryDict(image, state.aoi, scale).evaluate(function (d, err) {
    if (err) { status.setValue('Could not summarise: ' + err + ' Try a smaller area.'); return; }
    card.remove(status);
    summaryText(item, v, d, scale).forEach(function (line) { card.add(label(line)); });
    card.add(label('Grid: ' + addCommas(scale) + ' m in ' + SUMMARY_CRS + (scale > nativeScale
      ? ' (native ' + addCommas(nativeScale) + ' m; the area is large, so values are averages of finer pixels).' : ' (native).'), S.small));
  });
  if (item.timeSeries) {
    var chartStatus = label('Charting all years…', S.small);
    card.add(chartStatus);
    seriesDict(item, state.aoi, scale).evaluate(function (d, err) {
      card.remove(chartStatus);
      if (err) { card.add(label('Could not chart the years: ' + err, S.small)); return; }
      var rows = item.variants.slice().reverse().map(function (x) {
        var s = d[x.key] || {};
        return [x.label, s.a ? s.va / s.a : null];
      });
      card.add(ui.Chart([['Year', 'Area-weighted mean (' + item.unit + ')']].concat(rows), 'LineChart', {
        title: 'Area-weighted mean by year', legend: {position: 'none'}, pointSize: 4, lineWidth: 2, colors: ['#17753a'],
        vAxis: {title: item.unit, minValue: 0}, hAxis: {title: 'Year'}, height: 220}));
    });
  }
}
function summariseShown() {
  var keys = Object.keys(state.shown);
  if (!keys.length) { resultCard('Nothing to summarise', [label('Show at least one map or covariate layer first.')]); return; }
  keys.forEach(function (k) { summariseItem(state.shown[k].item, state.shown[k].variant.key); });
}

function downloadLink(fc, filename, text) {
  var l = ui.Label(text + ' (preparing…)', S.link);
  fc.getDownloadURL({format: 'CSV', filename: filename, callback: function (url, err) {
    if (url) { l.setValue(text); l.setUrl(url); } else { l.setValue(text + ': ' + err); }
  }});
  return l;
}
function summariseGround(list) {
  if (!requireAoi()) return;
  var status = label('Counting…', S.small);
  var card = resultCard('Ground data in the area', [status]);
  ee.Dictionary.fromLists(list.map(function (ds) { return ds.id; }), list.map(function (ds) { return groundSummaryDict(ds, state.aoi); }))
    .evaluate(function (d, err) {
      if (err) { status.setValue('Could not count: ' + err); return; }
      card.remove(status);
      list.forEach(function (ds) {
        var s = d[ds.id];
        var years = ds.year ? (s.yearMin ? ' · sampled ' + s.yearMin + '–' + s.yearMax + ' (' + addCommas(s.dated) + ' dated)' : ' · no dates') : ' · no dates recorded';
        card.add(ui.Panel([swatch(ds.color), ui.Label(ds.long, S.cardTitle)], ui.Panel.Layout.flow('horizontal')));
        card.add(label(addCommas(s.profiles) + ' profiles (' + addCommas(s.reach30) + ' reach 30 cm, ' + addCommas(s.reach100) +
                       ' reach 100 cm) · ' + addCommas(s.layers) + ' layers' + years));
        if (s.profiles > 0) {
          var slug = ds.id + '_in_area';
          card.add(row([downloadLink(ee.FeatureCollection(ds.profiles).filterBounds(state.aoi), slug + '_profiles', 'Profiles CSV'),
                        downloadLink(ee.FeatureCollection(ds.layers).filterBounds(state.aoi), slug + '_layers', 'Layers CSV')]));
        }
      });
    });
}

// ---------------------------------------------------------------- clicking the map
function depthChart(series, xTitle) {
  var cols = [{id: 'x', label: xTitle, type: 'number'}];
  series.forEach(function (s, i) { cols.push({id: 's' + i, label: s.label, type: 'number'}); });
  var rows = [];
  series.forEach(function (s, i) {
    s.points.forEach(function (p) {
      var c = [{v: p[0]}];
      for (var j = 0; j < series.length; j++) c.push({v: j === i ? p[1] : null});
      rows.push({c: c});
    });
  });
  return ui.Chart({cols: cols, rows: rows}, 'ScatterChart', {
    hAxis: {title: xTitle, minValue: 0}, vAxis: {title: 'Depth (cm)', direction: -1},
    lineWidth: 2, pointSize: 3, colors: ['#1d6b48', '#a8461a'], height: 240,
    legend: {position: series.length > 1 ? 'top' : 'none'}, chartArea: {left: 52, top: 30, width: '72%', height: '70%'}});
}
// Step outline of one variable down the profile: each layer contributes its top and bottom.
function stepPoints(layers, ds, field, factor) {
  var pts = [];
  layers.forEach(function (f) {
    var p = f.properties, val = p[field], top = p[ds.top], bot = p[ds.bottom];
    if (val === null || val === undefined || top === null || top === undefined) return;
    pts.push([val * factor, top]);
    if (bot !== null && bot !== undefined) pts.push([val * factor, bot]);
  });
  return pts;
}
function showProfile(f) {
  var ds = groundById(f.properties._ds);
  var p = f.properties;
  var coords = f.geometry && f.geometry.coordinates ? f.geometry.coordinates : null;
  var info = [];
  info.push('Profile ' + p.profile_uid + (coords ? ' · ' + coords[1].toFixed(4) + ', ' + coords[0].toFixed(4) : ''));
  info.push(ds.year ? 'Sampled: ' + (p[ds.year] === null || p[ds.year] === undefined || p[ds.year] === '' ? 'not recorded' : p[ds.year]) : 'Sampled: no dates in this dataset');
  if (p[ds.profileBottom] !== undefined && p[ds.profileBottom] !== null) info.push('Deepest layer: ' + p[ds.profileBottom] + ' cm');
  ds.stock.forEach(function (s) {
    var val = p[s.field];
    if (val === null || val === undefined) return;
    var flag = '';
    if (s.flag && s.flagFalse && (p[s.flag] === false || p[s.flag] === 0)) flag = ' (' + s.flagFalse + ')';
    if (s.flag && s.flagTrue && (p[s.flag] === true || p[s.flag] === 1)) flag = ' (' + s.flagTrue + ')';
    info.push(s.label + ': ' + fmt(val * s.factor) + ' kg C/m²' + (s.depthField && p[s.depthField] !== undefined ? ' over 0–' + p[s.depthField] + ' cm' : '') + flag);
  });
  var status = label('Loading layers…', S.small);
  var card = resultCard(ds.long, [label(info.join('\n')), label('Depth reference: ' + ds.depthNote, S.small), status]);
  if (coords) {
    setSelected(ui.Map.Layer(ee.Geometry.Point(coords).buffer(Math.max(mapView.getScale() * 7, 30)),
                             {color: '000000'}, 'Selected profile', true, 0.5));
  }
  profileLayers(ds, p.profile_uid).evaluate(function (fc, err) {
    card.remove(status);
    if (err) { card.add(label('Could not load layers: ' + err, S.small)); return; }
    var layers = fc.features;
    card.add(label(layers.length + ' layer' + (layers.length === 1 ? '' : 's') + ' in the layers table.', S.small));
    var socSeries = [];
    if (ds.soc) socSeries.push({label: ds.soc.label, points: stepPoints(layers, ds, ds.soc.field, ds.soc.factor)});
    if (ds.socAlt) socSeries.push({label: ds.socAlt.label, points: stepPoints(layers, ds, ds.socAlt.field, ds.socAlt.factor)});
    socSeries = socSeries.filter(function (s) { return s.points.length; });
    if (socSeries.length) card.add(depthChart(socSeries, 'Carbon (g/kg)'));
    else card.add(label('No carbon concentrations recorded for this profile.', S.small));
    if (ds.bd) {
      var bdPts = stepPoints(layers, ds, ds.bd.field, ds.bd.factor);
      if (bdPts.length) card.add(depthChart([{label: 'Bulk density', points: bdPts}], 'Bulk density (g/cm³)'));
      else card.add(label('No bulk densities recorded for this profile.', S.small));
    }
  });
}
mapView.onClick(function (coords) {
  if (state.drawing) return;
  var pt = ee.Geometry.Point([coords.lon, coords.lat]);
  var keys = Object.keys(state.shown).filter(function (k) { return state.shown[k].layer.getShown(); });
  if (keys.length) {
    var status = label('Reading values…', S.small);
    var card = resultCard('Values at ' + coords.lat.toFixed(4) + ', ' + coords.lon.toFixed(4), [status]);
    var entries = keys.map(function (k) {
      var s = state.shown[k];
      return {id: k, image: s.item.regionImage ? s.variant.image(pt.buffer(50)) : s.variant.image(), scale: scaleOf(s.item, s.variant)};
    });
    pointValues(entries, pt).evaluate(function (d, err) {
      card.remove(status);
      if (err) { card.add(label('Could not read values: ' + err, S.small)); return; }
      keys.forEach(function (k) {
        var s = state.shown[k] || {};
        if (!s.item) return;
        var val = d[k] ? d[k].v : null;
        card.add(label(s.item.short + (s.item.variants.length > 1 ? ' · ' + s.variant.label : '') + ': ' +
                       (val === null || val === undefined ? 'no data' : fmt(val) + ' ' + unitOf(s.item, s.variant))));
      });
    });
    keys.forEach(function (k) {
      var s = state.shown[k];
      if (!s.item.timeSeries) return;
      pointSeries(s.item, pt).evaluate(function (d, err) {
        if (err || !d) return;
        var rows = s.item.variants.slice().reverse().map(function (x) { return [x.label, d[x.key] ? d[x.key].v : null]; });
        card.add(ui.Chart([['Year', s.item.short + ' (' + s.item.unit + ')']].concat(rows), 'LineChart', {
          title: s.item.short + ' at this point', legend: {position: 'none'}, pointSize: 4, lineWidth: 2,
          colors: ['#17753a'], vAxis: {title: s.item.unit, minValue: 0}, height: 200}));
      });
    });
  }
  var on = GROUND.filter(function (ds) { return state.groundOn[ds.id]; });
  if (on.length) {
    nearestProfile(on, pt, Math.max(mapView.getScale() * 8, 30)).evaluate(function (f) { if (f) showProfile(f); });
  }
});

// ---------------------------------------------------------------- cards and sections
function itemCard(item) {
  var card = ui.Panel({style: S.card});
  card.add(ui.Label(item.name, S.cardTitle));
  card.add(ui.Label(item.chip, S.chip));
  card.add(ui.Label(item.source, S.small));
  var select = null;
  var shownNow = state.shown[item.key];
  if (item.variants.length > 1) {
    select = ui.Select({
      items: item.variants.map(function (v) { return {label: v.label, value: v.key}; }),
      value: shownNow ? shownNow.variant.key : item.variants[0].key,
      style: {margin: '2px 8px'},
      onChange: function (k) { if (state.shown[item.key]) showItem(item, k); }
    });
    card.add(select);
  }
  function current() { return select ? select.getValue() : item.variants[0].key; }
  var showBtn = button(shownNow ? 'Hide' : 'Show on map', function () {
    if (state.shown[item.key]) hideItem(item.key);
    else showItem(item, current());
  });
  state.showButtons[item.key] = showBtn;
  var buttons = [showBtn, button('About', function () { showAbout(item, current()); }),
                 button('Summarise in area', function () { summariseItem(item, current()); })];
  if (item.inputs) buttons.push(button('Add input layers', function () { addInputs(item, current()); }));
  card.add(row(buttons, {margin: '0 4px'}));
  if (item.note) card.add(ui.Label(item.note, S.small));
  return card;
}
function section(title, widgets, open) {
  var body = ui.Panel(widgets);
  body.style().set('shown', open);
  var head = ui.Button({label: (open ? '▾  ' : '▸  ') + title, style: {stretch: 'horizontal', margin: '6px 6px 2px 6px'}});
  head.onClick(function () {
    open = !open;
    body.style().set('shown', open);
    head.setLabel((open ? '▾  ' : '▸  ') + title);
  });
  return ui.Panel([head, body]);
}

function groundCard(ds) {
  var info = (CATALOGUE.profiles || {})[ds.summaryKey] || {};
  var card = ui.Panel({style: S.card});
  card.add(ui.Panel([swatch(ds.color), ui.Label(ds.long, S.cardTitle)], ui.Panel.Layout.flow('horizontal')));
  var years = info.year_min ? ' · ' + Math.round(info.year_min) + '–' + Math.round(info.year_max) : ' · no dates';
  card.add(ui.Label(addCommas(info.profiles || '?') + ' profiles · ' + addCommas(info.layers || '?') + ' layers' + years, S.chip));
  card.add(ui.Label(ds.depthNote, S.small));
  var box = ui.Checkbox({label: 'Show on map', value: state.groundOn[ds.id], style: {margin: '2px 8px', fontSize: '12px'},
                         onChange: function (v) { state.groundOn[ds.id] = v; refreshPoints(); }});
  card.add(row([box, button('About', function () { groundAbout(ds); }),
                button('Summarise in area', function () { summariseGround([ds]); })], {margin: '0 4px'}));
  return card;
}
function groundAbout(ds) {
  var g = (CATALOGUE.ground || {})[ds.groundId] || {};
  var info = (CATALOGUE.profiles || {})[ds.summaryKey] || {};
  var w = [];
  w = w.concat(keyValue('Measurement', g.measurement || '–'));
  w = w.concat(keyValue('Coverage', g.coverage || '–'));
  w = w.concat(keyValue('Depth reference', ds.depthNote));
  if (info.median_deepest_layer_cm) {
    w = w.concat(keyValue('Depth reach', 'Median deepest layer ' + fmt(Number(info.median_deepest_layer_cm)) + ' cm; ' +
                          fmt(100 * Number(info.share_reaching_30cm)) + '% reach 30 cm and ' + fmt(100 * Number(info.share_reaching_100cm)) + '% reach 100 cm.'));
  }
  w = w.concat(keyValue('Units shown', 'Carbon in g/kg (source % × 10 where needed), bulk density in g/cm³, profile stocks in kg C/m² (Mg/ha × 0.1).'));
  if (info.qualifiers) w = w.concat(keyValue('Qualifiers', info.qualifiers));
  if (g.considerations) w = w.concat(keyValue('Considerations', g.considerations));
  if (g.licence) w = w.concat(keyValue('Licence', g.licence));
  w = w.concat(keyValue('Earth Engine assets', ds.profiles + '\n' + ds.layers));
  if (g.url) w.push(link('Source: ' + g.url, g.url));
  resultCard('About: ' + ds.long, w);
}
function groundContent(domain) {
  var w = [];
  if (domain === 'forests') {
    w.push(label('No open forest plot locations are available in Earth Engine. National Forest Inventory plot locations are confidential. ' +
                 'The forest ground sources in the catalogue are listed below. Soil profiles and peat cores stay on the map.', S.small));
    Object.keys(CATALOGUE.ground || {}).forEach(function (id) {
      var g = CATALOGUE.ground[id];
      if (g.domain !== 'forests' && g.domain !== 'both') return;
      var card = ui.Panel({style: S.card});
      card.add(ui.Label(g.name, S.cardTitle));
      card.add(ui.Label(g.measurement + (g.coverage ? ' · ' + g.coverage : ''), S.small));
      if (g.access) card.add(ui.Label('Access: ' + g.access, S.small));
      if (g.url && g.url.indexOf('http') === 0) card.add(link('Source', g.url));
      w.push(card);
    });
    return w;
  }
  w.push(label('Soil profiles and peat cores are always on the map. Inside your area they use their dataset colour; outside it they turn grey. ' +
               'Click a point to see its depth profile.', S.small));
  w.push(row([button('Summarise all ground data in area', function () { summariseGround(GROUND); })]));
  GROUND.forEach(function (ds) { w.push(groundCard(ds)); });
  return w;
}

function covariateContent(domain) {
  var studies = {};
  covariateRows(domain, 'all').forEach(function (r) { studies[r[0]] = (studies[r[0]] || 0) + 1; });
  var options = [{label: 'All studies', value: 'all'}].concat(Object.keys(studies).sort().map(function (id) {
    return {label: ((CATALOGUE.studies[id] || {}).name || id) + ' (' + studies[id] + ' features)', value: id};
  }));
  var list = ui.Panel();
  var select = ui.Select({items: options, value: state.covStudy[domain], style: {margin: '2px 8px', stretch: 'horizontal'},
                          onChange: function (v) { state.covStudy[domain] = v; render(); }});
  function render() {
    list.clear();
    var res = covariateItems(domain, select.getValue());
    if (!res.items.length) list.add(label('None of the selected covariates are matched to an Earth Engine dataset.', S.small));
    res.items.forEach(function (item) { list.add(itemCard(item)); });
    if (res.unmatched.length) list.add(unmatchedCard(res.unmatched));
  }
  render();
  return [label('Covariates are the environmental layers the mapping studies used as predictors. Each card is an Earth Engine dataset named in the ' +
                'catalogue; it shows one representative layer, and About lists the study features that use it.', S.small),
          select, list];
}
function unmatchedCard(rows) {
  var byStudy = {};
  rows.forEach(function (r) { (byStudy[r[0]] = byStudy[r[0]] || []).push(r); });
  var card = ui.Panel({style: S.card});
  card.add(ui.Label('Not matched to an Earth Engine dataset', S.cardTitle));
  card.add(ui.Label(Object.keys(byStudy).map(function (id) {
    return '• ' + ((CATALOGUE.studies[id] || {}).name || id) + ': ' + byStudy[id].length + ' feature' + (byStudy[id].length === 1 ? '' : 's');
  }).join('\n'), S.small));
  card.add(row([button('List features', function () {
    var w = [label('These study inputs are historical releases, local products or sources not yet matched in Earth Engine.', S.small)];
    rows.forEach(function (r) {
      w.push(label('• ' + ((CATALOGUE.studies[r[0]] || {}).name || r[0]) + ': ' + r[1] + ' (' + r[2] + '). Source: ' + (r[5] || 'not recorded') + '.', S.small));
    });
    resultCard('Covariates not in Earth Engine', w);
  })]));
  return card;
}

function mapsContent(domain) {
  var items = LAYERS.filter(function (i) { return i.domain === domain; });
  var w = [label(domain === 'soils'
    ? 'Grouped by quantity and depth so only comparable layers sit together. McMaster/WWF (Sothe et al.) layers come first. Stocks are in kg C/m².'
    : 'Pools and units are explicit: biomass is not carbon, and aboveground layers are not total forest carbon. McMaster/WWF (Sothe et al.) comes first.', S.small)];
  var groups = [];
  items.forEach(function (i) { if (groups.indexOf(i.group) < 0) groups.push(i.group); });
  groups.forEach(function (g) {
    w.push(ui.Label(g, S.group));
    if (GROUP_NOTES[g]) w.push(ui.Label(GROUP_NOTES[g], S.small));
    items.filter(function (i) { return i.group === g; }).forEach(function (i) { w.push(itemCard(i)); });
  });
  var used = {};
  LAYERS.forEach(function (i) { i.mapIds.forEach(function (id) { used[id] = true; }); });
  var others = Object.keys(CATALOGUE.maps || {}).filter(function (id) {
    var m = CATALOGUE.maps[id];
    return !used[id] && (m.domain === domain || m.domain === 'both');
  });
  if (others.length) {
    w.push(ui.Label('Also in the catalogue (not in Earth Engine here)', S.group));
    others.forEach(function (id) {
      var m = CATALOGUE.maps[id];
      var card = ui.Panel({style: S.card});
      card.add(ui.Label(m.name, S.cardTitle));
      card.add(ui.Label(m.quantity + (m.depth ? ' · ' + m.depth : ''), S.small));
      if (m.url && m.url.indexOf('http') === 0) card.add(link('Source', m.url));
      w.push(card);
    });
  }
  return w;
}

// ---------------------------------------------------------------- domain switch
var forestBtn = ui.Button({label: 'Forests', style: {stretch: 'horizontal', margin: '2px 4px 2px 8px'}});
var soilBtn = ui.Button({label: 'Soils', style: {stretch: 'horizontal', margin: '2px 8px 2px 4px'}});
var exploreTitle = ui.Label('3  Explore', S.step);
exploreTitle.style().set('shown', false);
var explore = ui.Panel();
function setDomain(domain) {
  state.domain = domain;
  forestBtn.setLabel(domain === 'forests' ? '● Forests' : 'Forests');
  soilBtn.setLabel(domain === 'soils' ? '● Soils' : 'Soils');
  exploreTitle.setValue('3  Explore ' + (domain === 'soils' ? 'soils' : 'forests'));
  exploreTitle.style().set('shown', true);
  state.showButtons = {};
  explore.clear();
  explore.add(section('Ground data', groundContent(domain), true));
  explore.add(section('Covariates', covariateContent(domain), false));
  explore.add(section('Maps', mapsContent(domain), true));
}
forestBtn.onClick(function () { setDomain('forests'); });
soilBtn.onClick(function () { setDomain('soils'); });

// ---------------------------------------------------------------- layout
left.add(ui.Label('Carbon Data Explorer', S.title));
left.add(label('Soil and forest carbon maps, soil profiles, peat cores and covariates for Canada, for an area you choose. ' +
               'Part of the State of Carbon Data in Canada.', S.intro));
left.add(row([link('Site', SITE), link('Repository', REPO + '/tree/main/tools/gee')]));
left.add(ui.Label('1  Area of interest', S.step));
left.add(label('Draw an area, or paste the ID of a public Earth Engine table asset.', S.small));
left.add(row([button('Draw polygon', function () { startDrawing('polygon'); }),
              button('Draw rectangle', function () { startDrawing('rectangle'); }),
              button('Clear', clearAoi)]));
left.add(ui.Panel([assetBox, button('Load asset', loadAssetAoi)], ui.Panel.Layout.flow('horizontal')));
left.add(aoiStatus);
left.add(ui.Label('2  Choose forests or soils', S.step));
left.add(ui.Panel([forestBtn, soilBtn], ui.Panel.Layout.flow('horizontal')));
left.add(exploreTitle);
left.add(explore);
left.add(label('Catalogue ' + CATALOGUE.built + (CATALOGUE.revision ? ' (' + CATALOGUE.revision + ')' : '') + ' · app v' + VERSION +
               '. Maps are shown as published or with the calculation stated in About; no map is treated as truth.', S.small));

right.add(ui.Label('Results', S.title));
right.add(label('Summaries, layer details and clicked values appear here, newest first. Click the map to read the values of the layers shown; ' +
                'click a profile point to see its depth profile.', S.intro));
right.add(row([button('Summarise shown layers', summariseShown), button('Remove map layers', removeAllLayers),
               button('Clear results', function () { results.clear(); })]));
right.add(results);

ui.root.clear();
ui.root.setLayout(ui.Panel.Layout.flow('horizontal'));
ui.root.add(left);
ui.root.add(mapView);
ui.root.add(right);
refreshPoints();
// @@UI-END --------------------------------------------------------------------
