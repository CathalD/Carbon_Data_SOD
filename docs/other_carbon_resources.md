# Other carbon resources — Canadian gaps and regional sources

Reviewed 15 October 2026 against the repository README. This is a targeted discovery review, not an exhaustive census or a record of new ingestion. The detailed [structured register](../data/catalogue/other_carbon_resources.json) records access qualifications and next actions for 20 resources.

The largest additions are forest organic/mineral soil profiles, regional peat bathymetry, grassland/agroforestry observations, freshwater marshes/swamps and seabed sediment carbon. A resource appearing here does not mean it is loaded into our GEE project.

## Discovery

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Can-Peat Canadian Peatland Data Portal](https://uwaterloo.ca/can-peat/research/canadian-peatland-data-portal) | Canada; dataset-specific local/regional coverage | No raster grid; Stock, peat properties, depth, flux and ancillary records | Public discovery portal; access varies by linked dataset. Prioritize assessment. |
| [Blue Carbon Canada publications and data directory](https://www.bluecarboncanada.ca/publications-data) | Canadian coastal/marine research | Resource-specific; Sediment, coastal vegetation, kelp, habitat and flux resources | Public directory; individual files/access vary. Catalogue/link first. |

## Forest soils

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Shaw et al. Canadian upland forest soil profile and carbon stocks database](https://doi.org/10.1002/ecy.2159) | Canadian upland forests | 3,253 pedons; 16,167 horizon records in source publication; Organic horizons plus mineral soil to 100 cm; preserve original depth datum | DataS1 ZIP and metadata supplement linked by publisher. Prioritize assessment. |
| [McNicol et al. NPCTR soil-carbon database and raster](https://doi.org/10.5061/dryad.5jf6j1r) · [paper](https://doi.org/10.1088/1748-9326/aaed52) | Coastal British Columbia and southeast Alaska; restrict Canadian analysis to actual BC footprint | About 1,300 profile descriptions; reported map grid 90.5 m; 1 m mineral soil plus overlying organic horizons; not automatically 1 m below peat/forest-floor surface | Dryad XLSX, raster archive, README; database revised 2024. Prioritize assessment. |

## Peatlands

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Arsenault et al. temperate peatland bathymetry and C/N/P stocks](https://doi.org/10.5281/zenodo.17065341) · [paper](https://doi.org/10.1029/2025JG009407) | Argenteuil, Québec; 28 fens, bogs and forested peatlands | Site peat-depth interpolation to 1 m² cells; not a wall-to-wall 1 m regional carbon raster; Variable peat-basin depth, not fixed 1 m SOC | Paper links Zenodo; Can-Peat provides a version-specific link; direct archive retrieval failed in this review. Prioritize assessment. |
| [Martens and Kreyling coastal BC peatland carbon](https://doi.org/10.5281/zenodo.17533263) · [paper](https://doi.org/10.1038/s41598-026-44791-z) | Read Island and Porcher Island, coastal BC; six peatlands | Plot/core measurements; no uniform raster verified; Peat and biomass pools; preserve sampled depths and pool definitions | Paper links Zenodo; archive landing retrieval failed in this review. Prioritize assessment. |
| [PEATGRIDS](https://doi.org/10.5281/zenodo.15070037) · [paper](https://doi.org/10.1016/j.catena.2025.109243) | Global peatlands including Canada; not a Canada-specific regional model | Reported 1 km output; Full modelled variable peat thickness; depth-resolved BD and carbon-content inputs | Zenodo release 2.0.1 and documented Awesome GEE assets. Prioritize assessment. |
| [Hugelius et al. northern peatland maps, version 2](https://bolin.su.se/data/hugelius-2020-peatland-2) | Northern Hemisphere north of 23° N; includes Canada | 10 km projected GeoTIFF or 0.1° WGS84 GeoTIFF/NetCDF; coarse synthesis; Peat depth and depth-derived stock; preserve peat fractions and area denominator | Bolin Centre download. Catalogue/link first. |
| [C-PEAT Global Peatland Carbon Database v.2025](https://doi.org/10.1594/PANGAEA.986891) · [paper](https://essd.copernicus.org/articles/18/6485/2026/) | Global; Canadian subset must be selected and counted | 267 cores globally in data paper; Canadian count not established; Variable core depths and age models | PANGAEA archive and ESSD data paper. Catalogue/link first. |

## Forest biomass and deadwood

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Lamping et al. coastal forest biomass and structure maps](https://doi.org/10.5281/zenodo.13932139) · [paper](https://doi.org/10.1016/j.foreco.2025.122576) | Coastal southern Alaska and British Columbia | 30 m maps; Live aboveground and species biomass; inspect release attribute list for snag biomass, not a complete ecosystem carbon stock | Zenodo GeoTIFF archive. Prioritize assessment. |

## Grasslands and agroforestry

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Gross et al. central Alberta agroforestry carbon pools](https://doi.org/10.5061/dryad.0zpc86711) · [paper](https://doi.org/10.1111/gcb.16322) | Central Alberta hedgerows, shelterbelts, grassland and adjacent cropland | Local study; no raster output established; Live biomass, deadwood and soil SOC (study includes approximately 1 m total soil); inspect table-specific depths | Dryad downloadable CSV tables. Prioritize assessment. |
| [Pyle and Bork pasture composition, management and soil properties](https://doi.org/10.5061/dryad.c2fqz6175) | 102 pastures around Edmonton, Alberta | Local pasture sampling; coordinates withheld by privacy agreement; Upper 15 cm mineral-soil carbon concentration and ancillary properties; not ready-made SOC stocks | Dryad CSV and README; locations explicitly unavailable. Catalogue/link first. |
| [Southern interior BC pasture soil-carbon modelling study](https://doi.org/10.1080/15481603.2017.1302181) | 65 grazed/non-grazed pastures, southern interior British Columbia | MODIS NDVI 250 m versus handheld 1 m measurements; these are predictor supports; SC study depth/stock definitions need full source extraction | Paper found; standalone downloadable ground-data archive not verified. Catalogue/link first. |

## Freshwater wetlands

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Chizen et al. drained prairie pothole wetland SOC](https://doi.org/10.3389/fenvs.2024.1353802) | Saskatchewan Prairie Pothole Region; 33 drained wetlands in research description | Wetland/core/depth increments; no public map verified; SOC plus particulate and mineral-associated fractions; preserve sampled depth/time | Paper and supplement; raw data stated available from authors. Catalogue/link first. |
| [Pendea et al. Lake Simcoe freshwater wetland soils](https://doi.org/10.5683/SP3/OJRV2I) · [paper](https://doi.org/10.1029/2023JG007561) | Lake Simcoe watershed, Ontario; four swamps and four marshes | Eight 50 cm cores; no raster; Fixed upper 50 cm sampling plus dated-horizon stock/rate subsets | Paper links public Borealis V1; archive file-level retrieval not tested. Prioritize assessment. |

## Coastal and marine

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [Chastain/Kohfeld et al. Clayoquot Sound salt-marsh cores](https://doi.org/10.1594/PANGAEA.947825) · [paper](https://doi.org/10.5194/bg-19-5751-2022) | Clayoquot Sound, BC; seven salt marshes | 34 cores collected in 2016; site support, no raster; 20 cm, basal-peat and dated-horizon stock supports | PANGAEA bundle and tab-delimited datasets; CC BY 4.0 stated. Prioritize assessment. |
| [Cowichan Estuary blue carbon study](https://doi.org/10.3389/fmars.2022.857586) | Cowichan Estuary, Vancouver Island, BC | Habitat/core support; no verified public stock raster; Top 20 cm organic and inorganic sediment carbon, plus vegetation | Paper and supplement; raw data promised by authors, standalone archive not verified. Catalogue/link first. |
| [Epstein et al. Canadian continental-margin sediment OC](https://doi.org/10.5683/SP3/ICHVVA) · [paper](https://doi.org/10.5194/essd-16-2165-2024) | Canadian continental margin including Pacific, Atlantic and Arctic regions | 200 m output; predictor sources can be coarser; Standing stock in upper 30 cm seabed sediment; density is a separate quantity | Paper links Borealis GeoTIFFs and source review data/code. Prioritize assessment. |

## Other contextual resources

| Resource and original source | Geographic context | Observation/map support and depth/pool | Access and role |
|---|---|---|---|
| [ECCC freshwater sediment-quality observations](https://open.canada.ca/data/en/dataset/0af54117-bb0b-4e86-8f3f-2f277158e071) | 20 lakes across Canada, sampled 2011–2016 | One to three sampling locations per lake; Organic and inorganic carbon concentrations; no complete stock inventory established | Open Government CSV resources; OGL-Canada stated. Catalogue/link first. |
| [Parks Canada Carbon Atlas — forests of national parks](https://publications.gc.ca/collections/collection_2024/pc/R62-581-2023-eng.pdf) | 31 Canadian national parks, report summaries 1990–2020 | Park-level summaries; no reusable raster verified; Biomass and dead organic matter, including deadwood/litter/soil | Public government report; machine-readable spatial archive unverified. Catalogue/link first. |

## Which peat resource is which?

- **NRCan Peat Profile Database:** the 1,217-site source already represented by our assets named `canpeat_profiles_v1` and `canpeat_layers_v1`. The [provider record](https://open.canada.ca/data/en/dataset/e287b0dd-8b07-435b-8a76-0c7ec84ac228) is the source; asset names are retained.
- **Can-Peat:** Waterloo-led research network and [metadata portal](https://uwaterloo.ca/can-peat/research/canadian-peatland-data-portal). Follow its records to original providers. It already indexes Li; a portal listing is not another set of observations.
- **C-PEAT:** a separate global peat-core synthesis. Filter Canadian cores and resolve original-study overlap.
- **Can-Peat's integrated-map activity:** the [project page](https://uwaterloo.ca/can-peat/projects/develop-integrated-map-canadian-peatland-soil-carbon-stocks) describes synthesis/mapping work; this review did not verify a released national raster from that activity. Do not list a proposed deliverable as an available asset.

## GEE availability

PEATGRIDS is the newly identified map product with documented [Awesome GEE access](https://gee-community-catalog.org/projects/peatgrids/). Catalogue listing is verified; runtime access, actual bands, Canadian mask and version have not been tested here.

```javascript
var peatThickness = ee.Image('projects/sat-io/open-datasets/PEATGRIDS/THICKNESS_CM');
var peatCarbonPerArea = ee.Image('projects/sat-io/open-datasets/PEATGRIDS/C_STOCK_MGC_PER_M2');
var peatCarbonPerPixel = ee.Image('projects/sat-io/open-datasets/PEATGRIDS/C_STOCK_MGC');
```

BD/carbon-content IDs are also in the structured register. Per-pixel mass and per-area stock are different products. The provider's 2.0.1 release clarifies units; inspect the source release and raster encoding before conversion. These are variable-peat-depth stocks, not fixed 1 m SOC. No copy/export script is started by this review.

For the remaining newly listed products, no matching GEE asset ID was verified in the targeted catalogue/provider searches. This is not proof that no public or private copy exists. Data archives and papers are the access route until exact asset IDs are supplied or independently located.

## Access, overlap and depth checks that change how these can be used

- McNicol's current README and embedded Methods disagree about water/ice masking. Check the actual release. Preserve the forest-floor/mineral-soil datum and gap-filling flags.
- Shaw contains NFI-derived site stock summaries without corresponding horizon rows. Check repeated original profiles across Shaw, WoSIS, NPDB and McNicol before counting independent evidence.
- Martens reuses NRCan peat data alongside new observations. Separate new sample identifiers.
- Clayoquot and Cowichan may contribute to the existing Janousek synthesis. Compare core/source identifiers before claiming extra Canadian sites.
- Pyle's pasture locations are withheld; those records cannot support spatial predictor extraction without a legitimate location source. Carbon percentage alone is not SOC stock.
- Chizen and Cowichan describe raw data obtainable from authors; an open paper is not a verified open data package. No author has been contacted.
- The Arsenault and Martens data links are source-confirmed, but direct Zenodo landing-page retrieval failed during this review. File lists, licences and completeness remain to inspect.
- Lamping's maps are open archives, while underlying true forest-plot data are confidential. Biomass-to-carbon conversion and released snag coverage need explicit definitions.
- ECCC lake sediment observations are chemistry, not a ready-made lake-carbon stock inventory. Parks Carbon Atlas is modelled reporting, not independent ground validation.

## What remains weakly covered

This is our assessment of catalogue coverage, not a claim that these data do not exist.

| Pool/context | Gap remaining after these additions |
|---|---|
| Grassland and shrubland vegetation | Ground observations and Canadian maps of live aboveground/root carbon remain thinner than forest coverage; land-cover masks and NDVI are not stocks |
| Deadwood, litter and forest floor | Forest-floor profiles and snag/agroforestry resources help, but national deadwood/litter fields need independent pool definitions and reporting context |
| Atlantic/Arctic coastal wetlands | Existing Janousek coverage is Pacific; prioritize original Atlantic/Arctic marsh and seagrass archives through Blue Carbon Canada and Parks research |
| Inland waters | Sediment carbon concentration, burial flux, total sediment stock and dissolved carbon are separate; a national comparable stock product was not established here |
| Deep permafrost/peat | Original 200–300 cm NCSCDv2 layer is still missing from our hosted assets; variable full-peat stocks need a separate depth category |
| Urban trees, agricultural trials and inorganic/pyrogenic C | Useful later resource categories; not silently included in SOC or forest biomass totals |

## Suggested ingestion order

1. Inspect PEATGRIDS in GEE; catalogue exact units, depth basis and Canadian coverage.
2. Inspect Shaw and the revised McNicol database together, retaining source IDs and avoiding duplicate profiles.
3. Inspect Argenteuil bathymetry and coastal BC peat data for new regional observations.
4. Add Gross's Alberta multi-pool field tables and Pendea's freshwater-wetland cores after schema and access checks.
5. Add Epstein's marine sediment product as a distinct marine pool; evaluate regional biomass and coastal core archives next.

The current Sothe **0–1 m maintainer assumption**, Li **variable modelled peat depth**, community-core exclusion and unchanged covariate notebook remain in effect. Do not sum overlapping SOC/peat/marine products or use mapped estimates as new ground observations.
