# Soil map inventory

Catalogue checks: 14 October 2026. This inventory distinguishes published catalogue references, our project uploads, and resources that still need hosting. No new GEE runtime verification was performed by the assistant for these soil maps.

| Resource | Geographic support and grid | Product/depth | GEE availability | Next action |
|---|---|---|---|---|
| Sothe concentration | Canada, 250 m | SOC concentration; exact six interval boundaries pending release check | [Awesome GEE](https://gee-community-catalog.org/projects/scs/), ImageCollection `projects/sat-io/open-datasets/carbon_stocks_ca/scc` | Reference existing collection; inspect members and metadata |
| Sothe stocks | Canada, 250 m | kg C/m², cumulative 0–0.3, 0–1 and 0–2 m plus uncertainty | [Awesome GEE](https://gee-community-catalog.org/projects/scs/), ImageCollection `projects/sat-io/open-datasets/carbon_stocks_ca/sc` | Reference existing collection; separate stock/uncertainty images |
| SoilGrids 2.0 | Global, 250 m | SOC/density by six depth intervals to 200 cm; native stock release 0–30 cm | [ISRIC GEE documentation](https://docs.isric.org/globaldata/soilgrids/access_on_gee.html) and [Awesome GEE](https://gee-community-catalog.org/projects/isric/) | Reference existing images; verify actual bands and scale factors |
| Geng 100 m grids | Canada, 100 m | SOC % and BD g/cm³, five layers to 100 cm; Q5/Q95 available | No matching public GEE asset found; user upload in progress | Finish ten prediction images in `canada_carbon_collection`, then uncertainty layers |
| NCSCDv2 | Circumpolar polygons; Canada LAEA rasterization 1 km or WGS84 0.012° | Stock depth layers to 300 cm | No matching public GEE asset found | [Download provider rasters](https://bolin.su.se/data/ncscd/tiff.php); Canada LAEA is a proposed choice, not an existing project asset |
| Olefeldt thermokarst | Circumpolar landscape polygons | Thermokarst fractions/types and associated 0–3 m SOC | No matching public GEE asset found | [ORNL DAAC dataset](https://doi.org/10.3334/ORNLDAAC/1332); obtain and upload vector attributes |
| Hengl Alberta | Alberta agricultural lands, 30 m | SOC/density and integrated stock to 1 m | No matching public GEE asset found; viewer access unresolved | [Published viewer](https://g3w.soils.app/en/map/alberta-soil-carbon/) is a visualization link; obtain a downloadable raster release |
| Treat 2024 | Circumpolar synthesis | Review of stock/flux products | No original raster from this review | Retain [review](https://doi.org/10.1029/2023JG007638); catalogue cited original maps separately |
| Janousek 2025 | Pacific coastal core/estuary analyses | Core-based stocks at 30/50/100 cm | No new uniform raster in this study | Retain [paper](https://doi.org/10.1029/2024GB008239) and [core archive](https://doi.org/10.25573/serc.28127486.v1) |

“No matching public GEE asset found” means the catalogue/provider searches did not reveal a documented asset ID. It is not proof that nobody has hosted a private, unindexed or differently named copy. Searches covered Awesome GEE pages, the catalogue repository and general Earth Engine/provider references for the named products. Similar products are not substituted for the exact studies.

## Existing SoilGrids images

- SOC concentration: `projects/soilgrids-isric/soc_mean`
- Bulk density: `projects/soilgrids-isric/bdod_mean`
- Organic carbon density: `projects/soilgrids-isric/ocd_mean`
- Organic carbon stock: `projects/soilgrids-isric/ocs_mean`

[ISRIC units](https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html) are authoritative: SOC stored dg/kg → g/kg by dividing by 10; BD stored cg/cm³ → kg/dm³ by dividing by 100; density stored hg/m³ → kg/m³ by dividing by 10; stock t/ha → kg/m² by dividing by 10. Inspect the actual stock asset's bands rather than assuming all depth products have the same schema. Uncertainty images/quantiles need separate access checks.

## Geng upload naming plan

Root: `projects/northstarlabs/assets/canada_carbon_collection/`. Keep the user's current root. The exact `BD_0_5_cm` ID has been supplied; all other names below are proposed, not verified uploads.

| Interval | Bulk density name | SOC concentration name |
|---|---|---|
| 0–5 cm | `BD_0_5_cm` — user-reported, uploading | `SOC_0_5_cm` — proposed |
| 5–15 cm | `BD_5_15_cm` — proposed | `SOC_5_15_cm` — proposed |
| 15–30 cm | `BD_15_30_cm` — proposed | `SOC_15_30_cm` — proposed |
| 30–60 cm | `BD_30_60_cm` — proposed | `SOC_30_60_cm` — proposed |
| 60–100 cm | `BD_60_100_cm` — proposed | `SOC_60_100_cm` — proposed |

These are predicted density/concentration layers, not integrated carbon stocks. [CanSIS](https://sis.agr.gc.ca/cansis/nsdb/psm/index.html) lists all five intervals and Q5/Q95 downloads. Physical units do not automatically establish GeoTIFF encoding/scaling: retain the source files and metadata and check values/NoData after ingestion. Proposed later quantile names append `_Q5` or `_Q95` to each prediction name.

## NCSCDv2 upload note

The [raster download page](https://bolin.su.se/data/ncscd/tiff.php) specifies stored carbon stocks in **hg C/m²**, even though publications commonly discuss kg C/m². Confirm the selected files' metadata and divide by 10 when converting hg to kg. The Canada LAEA package has 1 km grid spacing; the geographic package has 0.012° cells whose ground dimensions vary with latitude. Rasterization does not improve the detail of the source soil polygons.

## Read-only verification script

Use [`03_Soil_Map_Catalogue.js`](../scripts/03_Soil_Map_Catalogue.js) in the Earth Engine Code Editor. It lists Sothe collection members and SoilGrids bands/types/grid metadata. The Geng check is disabled until the first upload finishes; enable it only after the user confirms completion. The script starts no export or upload.

See [TODOs](../TODO.md) for deferred provenance and active ingestion checks.

