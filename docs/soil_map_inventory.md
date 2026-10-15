# Soil map inventory

Catalogue checks: 14 October 2026; maintainer-supplied GEE runtime output: 15 October 2026. The supplied output confirms loading and the metadata summarized below. The assistant has not independently executed GEE. Project copies are prepared, not yet confirmed complete.

| Resource | Geographic support and grid | Product/depth | GEE availability | Next action |
|---|---|---|---|---|
| Sothe concentration | Canada, 250 m | SOC concentration; six point-depth labels: 0, 5, 15, 30, 60, 100 cm | [Awesome GEE](https://gee-community-catalog.org/projects/scs/), ImageCollection `projects/sat-io/open-datasets/carbon_stocks_ca/scc` | Six image IDs confirmed; copy natively; verify depth semantics and stored units |
| Sothe stocks | Canada, 250 m | kg C/m², cumulative 0–0.3, 0–1 and 0–2 m plus uncertainty | [Awesome GEE](https://gee-community-catalog.org/projects/scs/), ImageCollection `projects/sat-io/open-datasets/carbon_stocks_ca/sc` | Two members confirmed: stock and uncertainty; inspect bands before assigning study depth products |
| SoilGrids 2.0 | Global, 250 m | SOC/density by six depth intervals to 200 cm; native stock release 0–30 cm | [ISRIC GEE documentation](https://docs.isric.org/globaldata/soilgrids/access_on_gee.html) and [Awesome GEE](https://gee-community-catalog.org/projects/isric/) | SOC/BD/OCD each six bands; OCS only `ocs_0-30cm_mean`; native copies prepared |
| Geng 100 m grids | Canada, 100 m | SOC % and BD g/cm³, five layers to 100 cm; Q5/Q95 available | User reports completed ImageCollection and supplies all ten image IDs | All ten load; stored scaling/masks remain unchecked; then uncertainty layers |
| NCSCDv2 | Canada WGS84 0.012° supplied assets | Three layers supplied: SOCC30, SOCC100, SOCC200; last expected 100–200 cm | User-supplied GEE IDs below | Verify depth interpretation and imported scaling; 200–300 cm not supplied |
| Olefeldt thermokarst | Circumpolar landscape polygons | Thermokarst fractions/types and associated 0–3 m SOC | User supplies `projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes` | 132,089 features and schema reported; verify geometry and field definitions; retain [ORNL citation](https://doi.org/10.3334/ORNLDAAC/1332) |
| Hengl Alberta | Alberta agricultural lands, 30 m | SOC/density and integrated stock to 1 m | No matching public GEE asset found; viewer access unresolved | [Published viewer](https://g3w.soils.app/en/map/alberta-soil-carbon/) is a visualization link; obtain a downloadable raster release |
| Treat 2024 | Circumpolar synthesis | Review of stock/flux products | No original raster from this review | Retain [review](https://doi.org/10.1029/2023JG007638); catalogue cited original maps separately |
| Janousek 2025 | Pacific coastal core/estuary analyses | Core-based stocks at 30/50/100 cm | No new uniform raster in this study | Retain [paper](https://doi.org/10.1029/2024GB008239) and [core archive](https://doi.org/10.25573/serc.28127486.v1) |

“No matching public GEE asset found” means the catalogue/provider searches did not reveal a documented asset ID. It is not proof that nobody has hosted a private, unindexed or differently named copy. Searches covered Awesome GEE pages, the catalogue repository and general Earth Engine/provider references for the named products. Similar products are not substituted for the exact studies.

## Newly supplied GEE references

Supplied output on 15 October 2026 confirms these references load in the maintainer's GEE session. Values, source preprocessing, reuse terms and public-read access remain unverified. Native copies under our project are prepared below; original IDs remain the provenance references.

| Resource | Exact asset ID | Interpretation to verify |
|---|---|---|
| Olefeldt thermokarst landscapes | `projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes` | 132,089 features; `TSOC_kgC` and component SOC fields are total-mass labels, not kg/m² density; verify source definitions |
| NCSCDv2 SOCC30 | `projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC30_0012deg` | Expected stock for 0–30 cm |
| NCSCDv2 SOCC100 | `projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC100_0012deg` | Expected stock for 0–100 cm |
| NCSCDv2 SOCC200 | `projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC200_0012deg` | Original source's deep layer is 100–200 cm, not assumed cumulative 0–200 cm; confirm the imported file |

The selected NCSCDv2 assets are WGS84 **0.012°** rasterizations, not the previously proposed Canada LAEA 1 km package. Preserve the angular grid and latitude-dependent cell dimensions. [Hugelius et al. Table 3](https://essd.copernicus.org/articles/5/393/2013/essd-5-393-2013.pdf) defines the deep 100–200 cm stock layer. No 200–300 cm asset has been supplied. Cumulative 0–200 cm would be a separate derived sum of 0–100 and 100–200 cm, after units/masks are checked. Do not add the overlapping 0–30 cm layer again.

### Related flux observations — catalogue only

| Resource | Measurements and support | Access | Use in this repository |
|---|---|---|---|
| ABCFlux v2: Arctic-Boreal CO2 and CH4 In-situ Flux and Environmental Data | Monthly CO2 exchange (NEE, GPP, ecosystem respiration) and CH4 fluxes; Arctic-boreal terrestrial/freshwater sites, 1984–2024; 1,024 sites | [NASA Earthdata record](https://www.earthdata.nasa.gov/data/catalog/ornl-cloud-arctic-boreal-co2-flux-v2-2448-1), [dataset DOI](https://doi.org/10.3334/ORNLDAAC/2448), [Virkkala et al. data paper](https://doi.org/10.5194/essd-18-6357-2026) | Table/resource link only; excluded from map loading and visualization |

This is an independently cited flux synthesis related to the subject of Treat's review, not a new raster produced by Treat et al. (2024). Flux rates are different quantities from soil carbon stocks; retain variable-specific units, measurement methods, temporal aggregation and sign conventions. Do not assign an arbitrary raster resolution to site observations.

## Existing SoilGrids images

- SOC concentration: `projects/soilgrids-isric/soc_mean`
- Bulk density: `projects/soilgrids-isric/bdod_mean`
- Organic carbon density: `projects/soilgrids-isric/ocd_mean`
- Organic carbon stock: `projects/soilgrids-isric/ocs_mean`

[ISRIC units](https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html) are authoritative: SOC stored dg/kg → g/kg by dividing by 10; BD stored cg/cm³ → kg/dm³ by dividing by 100; density stored hg/m³ → kg/m³ by dividing by 10; stock t/ha → kg/m² by dividing by 10. Inspect the actual stock asset's bands rather than assuming all depth products have the same schema. Uncertainty images/quantiles need separate access checks.

## Geng collection — ten prediction images uploaded

ImageCollection: `projects/northstarlabs/assets/canada_carbon_collection`.

The user supplied all ten exact IDs and an image table on 15 October 2026 showing one band per image. Ingestion is recorded as complete. The subsequent Code Editor output loads all ten expected images with no missing or extra IDs. Expanded entries show band `b1` and 100 m transforms; the SOC 15–30 cm metadata block is collapsed in the pasted output. Pixel values, stored scaling, masks and complete alignment checks remain pending. The table's last-modified times are 14 October 2026 ingestion metadata, not map observation dates; start/end dates were unset.

All image names below are relative to the collection root and confirmed by the supplied table.

| Depth | Bulk-density image | SOC-concentration image |
|---|---|---|
| 0–5 cm | `BD_0_5_cm` | `SOC_0_5_cm` |
| 5–15 cm | `BD_5_15_cm` | `SOC_5_15_cm` |
| 15–30 cm | `BD_15_30_cm` | `SOC_15_30_cm` |
| 30–60 cm | `BD_30_60_cm` | `SOC_30_60_cm` |
| 60–100 cm | `BD_60_100_cm` | `SOC_60_100_cm` |

These are predicted density/concentration layers, not integrated carbon stocks. [CanSIS](https://sis.agr.gc.ca/cansis/nsdb/psm/index.html) lists BD in g/cm³ and SOC in percent, on a 100 m grid. Check stored encoding, scaling and NoData against the original GeoTIFFs. Q5/Q95 layers remain a later task; proposed suffixes are `_Q5` and `_Q95` and no such uploads have been confirmed.

## NCSCDv2 upload note

The [raster download page](https://bolin.su.se/data/ncscd/tiff.php) specifies stored carbon stocks in **hg C/m²**, even though publications commonly discuss kg C/m². Confirm the selected files' metadata and divide by 10 when converting hg to kg. The Canada LAEA package has 1 km grid spacing; the geographic package has 0.012° cells whose ground dimensions vary with latitude. Rasterization does not improve the detail of the source soil polygons.

## Read-only verification script

Use [`03_Soil_Map_Catalogue.js`](../scripts/03_Soil_Map_Catalogue.js) in the Earth Engine Code Editor. It lists Sothe collection members, SoilGrids metadata, all ten Geng image references, thermokarst table schema and all three supplied NCSCDv2 images. Geng loading is now enabled. ABCFlux is deliberately absent from map objects. The script starts no export or upload.

See [TODOs](../TODO.md) for deferred provenance and active ingestion checks.

## Native copies under soils/maps

Run [04_Copy_External_Soil_Maps.js](../scripts/04_Copy_External_Soil_Maps.js) in the authenticated Earth Engine Code Editor. It uses [ee.data.copyAsset](https://developers.google.com/earth-engine/apidocs/ee-data-copyasset) with overwrite disabled. Copies preserve native rasters/tables without clipping, reprojection, resampling, unit conversion or stock integration. SoilGrids retains global extent. This is a direct asset operation: no export Tasks need to be started.

The [copy manifest](../data/catalogue/soil_map_copy_manifest.json) records all 16 exact source/destination pairs and citations. **Prepared only; successful copying has not yet been reported.** The script checks the existing root, creates the following child folders, reads each source, skips existing destinations, copies missing assets and reads back destination types. Save its Console summary as execution evidence. A skipped destination is not certified as equivalent to the source.

Root: `projects/northstarlabs/assets/carbon_state_of_data/soils/maps`.

| Child folder | Assets | Contents |
|---|---:|---|
| `sothe_2022` | 8 images | Two stock/uncertainty members and six concentration point-depth images; original basenames retained |
| `soilgrids_v2` | 4 images | `soc_mean`, `bdod_mean`, `ocd_mean`, `ocs_mean` |
| `ncscdv2` | 3 images | Supplied Canada SOCC30/100/200 rasterizations; original basenames retained |
| `olefeldt_2016` | 1 table | `Circumpolar_Thermokarst_Landscapes` |

Geng remains at `projects/northstarlabs/assets/canada_carbon_collection`, already hosted in our project. ABCFlux is excluded as requested. Copies do not establish licences or public sharing; verify those separately.

### Findings from the supplied runtime output

- Sothe stock collection has `sc_250m_v20` and `sc_uncertainty_250m_v20`. The stock bands were not expanded in the output, so the study's three integrated depths are not yet confirmed as separately available bands in this release. Never mosaic stock and uncertainty together.
- Sothe concentration has point-depth labels 0, 5, 15, 30, 60 and 100 cm. These names do not establish six interval averages; do not relabel them 0–5, 5–15, etc. The exact Geoderma release/depth relationship remains a provenance task.
- SoilGrids SOC, BD and OCD show six bands; OCS has one band, `ocs_0-30cm_mean`. All report 250 m nominal scale, but the SOC/BD x-origin (−17960089.445510544) differs from OCD/OCS (−17960764.70917111). Do not assume cell alignment for pixelwise arithmetic. A null short CRS string with a custom projection does not justify forcing EPSG:4326.
- NCSCDv2 rasters have `b1`, EPSG:4326 and 0.012° steps (GEE nominal scale about 1335.83 m, not constant ground dimensions). SOCC30 has a different grid origin from SOCC100/SOCC200. Preserve these copies and choose an explicit analysis grid before deriving sums or differences.
- Thermokarst has 132,089 features, with `AREA_ha`, `TSOC_kgC`, component total-carbon and landscape-area fields. Total polygon kg C and area-normalized kg C/m² are different quantities; no density conversion has been applied.
