# Soil map inventory

Catalogue checks: 14 October 2026; user-supplied asset update: 15 October 2026. This inventory distinguishes published catalogue references, our project uploads, and resources that still need hosting. No new GEE runtime verification was performed by the assistant for these soil maps.

| Resource | Geographic support and grid | Product/depth | GEE availability | Next action |
|---|---|---|---|---|
| Sothe concentration | Canada, 250 m | SOC concentration; exact six interval boundaries pending release check | [Awesome GEE](https://gee-community-catalog.org/projects/scs/), ImageCollection `projects/sat-io/open-datasets/carbon_stocks_ca/scc` | Reference existing collection; inspect members and metadata |
| Sothe stocks | Canada, 250 m | kg C/m², cumulative 0–0.3, 0–1 and 0–2 m plus uncertainty | [Awesome GEE](https://gee-community-catalog.org/projects/scs/), ImageCollection `projects/sat-io/open-datasets/carbon_stocks_ca/sc` | Reference existing collection; separate stock/uncertainty images |
| SoilGrids 2.0 | Global, 250 m | SOC/density by six depth intervals to 200 cm; native stock release 0–30 cm | [ISRIC GEE documentation](https://docs.isric.org/globaldata/soilgrids/access_on_gee.html) and [Awesome GEE](https://gee-community-catalog.org/projects/isric/) | Reference existing images; verify actual bands and scale factors |
| Geng 100 m grids | Canada, 100 m | SOC % and BD g/cm³, five layers to 100 cm; Q5/Q95 available | User reports completed ImageCollection and supplies all ten image IDs | Verify all images, grids, units and masks; then uncertainty layers |
| NCSCDv2 | Canada WGS84 0.012° supplied assets | Three layers supplied: SOCC30, SOCC100, SOCC200; last expected 100–200 cm | User-supplied GEE IDs below | Verify depth interpretation and imported scaling; 200–300 cm not supplied |
| Olefeldt thermokarst | Circumpolar landscape polygons | Thermokarst fractions/types and associated 0–3 m SOC | User supplies `projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes` | Verify table schema and attribution; retain [ORNL citation](https://doi.org/10.3334/ORNLDAAC/1332) |
| Hengl Alberta | Alberta agricultural lands, 30 m | SOC/density and integrated stock to 1 m | No matching public GEE asset found; viewer access unresolved | [Published viewer](https://g3w.soils.app/en/map/alberta-soil-carbon/) is a visualization link; obtain a downloadable raster release |
| Treat 2024 | Circumpolar synthesis | Review of stock/flux products | No original raster from this review | Retain [review](https://doi.org/10.1029/2023JG007638); catalogue cited original maps separately |
| Janousek 2025 | Pacific coastal core/estuary analyses | Core-based stocks at 30/50/100 cm | No new uniform raster in this study | Retain [paper](https://doi.org/10.1029/2024GB008239) and [core archive](https://doi.org/10.25573/serc.28127486.v1) |

“No matching public GEE asset found” means the catalogue/provider searches did not reveal a documented asset ID. It is not proof that nobody has hosted a private, unindexed or differently named copy. Searches covered Awesome GEE pages, the catalogue repository and general Earth Engine/provider references for the named products. Similar products are not substituted for the exact studies.

## Newly supplied GEE references

Reported by the repository maintainer on 15 October 2026; access, schema, values and public-read permissions are not yet independently tested. References are retained in their existing projects.

| Resource | Exact asset ID | Interpretation to verify |
|---|---|---|
| Olefeldt thermokarst landscapes | `projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes` | Expected vector collection; inspect polygon fields and SOC/landscape-fraction definitions |
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

The user supplied all ten exact IDs and an image table on 15 October 2026 showing one band per image. Ingestion is recorded as complete from that evidence; successful loading, band names, pixel values and grid alignment remain unchecked. The table's last-modified times are 14 October 2026 ingestion metadata, not map observation dates; start/end dates were unset.

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
