# Comparing carbon data in Canada

Different datasets can describe the same landscape in different ways. This page explains where their observations, environmental inputs and mapped estimates are comparable, where they differ, and what those differences mean when choosing data.

The structure follows the catalogue: **Forests** and **Soils**, each with **Ground data, Covariates and Maps**.

**Draft based on the source analysis snapshot of 16 October 2026.** Numerical results refer to the paired samples and processing definitions linked below. They describe agreement between products; they do not establish which product is most accurate.

## How to read the comparisons

- **Ground data:** compare coverage, measurements, dates, sampling support and methods. Observation records may overlap across compilations.
- **Covariates:** compare environmental inputs, source resolution, time periods and documented study roles. A variable's inclusion is distinct from evidence of its importance.
- **Maps:** compare compatible quantities, years, depth definitions and carbon pools. The two contextual comparisons involving different pools or derived stocks are labelled explicitly.

Statistics use locations where both products have valid values. National comparisons start from 30,000 random points across Canada's terrestrial ecozones; peat comparisons use 1,500 points in the Hudson Plain. The retained number differs by pair. These are sample summaries, not national carbon totals or counts of independent validation sites.

## Forests

### Ground data

**Main finding:** forest observation sources differ in what is measured and how those measurements become biomass or carbon estimates. Plot inventories, photo-interpreted attributes and sampled-tree biomass serve different purposes.

**Why it matters:** choose observations that match the target quantity, dates and geographic setting. A tree-level calibration dataset does not automatically provide a plot-level reference for a carbon map. Repeated measurements at a plot are not separate independent locations.

No forest plot-to-map comparison is included in the source release. The comparisons here concern dataset definitions and documented study roles.

<details>
<summary>View forest observation differences</summary>

| Observation source | What distinguishes it | Consequence for comparison |
|---|---|---|
| NFI ground plots | Field inventory observations; access to measurements and precise locations can differ | Check the available coordinates, sampling dates and measured or estimated quantities before matching to pixels. |
| NFI photo-interpreted plots | Reference attributes interpreted from aerial imagery; used to train SCANFI v1 | Keep them distinct from ground measurements and from external ground-validation data. |
| Québec permanent sample plots | Regional repeated measurements; documented external-validation connection to SCANFI | A validation relationship does not mean those plots trained the map. Retain measurement occasions. |
| New Brunswick CLI | Regional plots used in Betts et al.; the study reports 400 m² plots with nested small-tree plots | Plot design, target construction and regional coverage matter when transferring the study to another region. |
| NRCan ENFOR | Destructively sampled tree biomass supporting allometric equations | Tree calibration observations and plot-level biomass estimates have different roles. |
| BC provincial observations | Reference biomass for Sothe forest mapping; exact source release remains a catalogue gap | Do not assume a current provincial dataset is identical to the historical reference data. |

Sources: [Ground_data](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Ground_data.csv) and [Study_ground relationships](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Study_ground.csv).

</details>

### Covariates

**Main finding:** the forest studies combine different sources of structural, spectral and environmental information. Their shared use of satellite data does not mean they use the same variables, years or training targets.

**Why it matters:** a map developed in one region or with one reference dataset may behave differently elsewhere. A 30 m output grid does not establish 30 m accuracy, and a larger number of predictors does not establish a better model.

<details>
<summary>View forest study inputs and scale</summary>

| Study | Main environmental inputs recorded | Output grid | Interpretation |
|---|---|---|---|
| Betts et al. 2024 | Landsat time-series features | 30 m | Regional New Brunswick models; temporal feature definitions and field dates matter. |
| Sothe et al. 2022, forest carbon | Canopy-height metrics, L-band radar and Landsat | 250 m | Combines structural and spectral information; reference observations are concentrated in BC. |
| Qin et al. 2025 | Seasonal Sentinel-1/2 and annual L-band SAR | 30 m | Multi-sensor inputs; exact seasonal and variable definitions must be retained. |
| Guindon et al. 2024, SCANFI v1 | Summer/winter Landsat, climate, terrain and auxiliary inputs | 30 m | Regional modelling support and photo-interpreted training targets differ from the other workflows. |

Sources: [Studies](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Studies.csv) and [Covariates](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Covariates.csv). Model-level performance and individual-variable importance should not be pooled across studies as a common ranking.

</details>

### Maps

#### SCANFI and ESA CCI: aboveground biomass in 2020

**Main finding:** ESA CCI gives a higher average aboveground biomass than SCANFI at the paired sample locations: **84.4 versus 60.4 Mg/ha**. Their values are positively associated (**r = 0.71**), but the root-mean-square difference is **56.8 Mg/ha**.

**Why it matters:** the products share a broad association while differing substantially in estimated biomass. Dataset choice can therefore change a biomass estimate for an area. This comparison does not identify the more accurate product for that area.

Both products represent aboveground biomass for 2020. SCANFI's 30 m values are averaged to the ESA CCI 100 m grid. Locations where both products are zero are excluded; the retained sample also reflects differences in their masks and mapped biomass extent.

<details>
<summary>View statistics and comparison definition</summary>

**A:** SCANFI v1.2 aboveground biomass  
**B:** ESA CCI v6 aboveground biomass  
**Unit:** Mg/ha. Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 12,134 |
| Mean A | 60.4 |
| Mean B | 84.4 |
| Mean difference, A − B | -24.0 |
| Root-mean-square difference | 56.8 |
| Pearson correlation, r | 0.71 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

#### McMaster/WWF and SCANFI: a comparison of different carbon pools

**Main finding:** under the report's biomass-to-carbon conversion, the paired means are **4.54 kg C/m² for McMaster/WWF** and **3.23 kg C/m² for SCANFI aboveground carbon**.

**Why it matters:** the difference includes a difference in what is counted. McMaster/WWF includes aboveground, belowground and dead plant material; SCANFI contributes aboveground biomass converted to carbon. Their difference cannot be assigned wholly to additional pools or wholly to disagreement between models.

**This is a contextual comparison, not a comparison of equivalent carbon pools.** The reference periods also differ: McMaster/WWF inputs are mostly from 2015–2019, while SCANFI represents 2020. SCANFI is averaged to the approximately 250 m McMaster/WWF grid.

The report assumes a carbon fraction of **0.50** for SCANFI biomass. That is a conversion assumption, not a measured carbon fraction at each location.

<details>
<summary>View statistics and comparison definition</summary>

**A:** McMaster/WWF forest carbon, including belowground and dead pools  
**B:** SCANFI aboveground biomass × 0.50, converted to kg C/m²  
**Unit:** kg C/m². Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 10,616 |
| Mean A | 4.54 |
| Mean B | 3.23 |
| Mean difference, A − B | 1.30 |
| Root-mean-square difference | 2.97 |
| Pearson correlation, r | 0.59 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

## Soils

### Ground data

**Main finding:** the five prepared observation datasets cover different environments and provide different kinds of evidence. Peat datasets generally reach deeper recorded depths, while many mineral-soil records provide carbon concentration without the density information required to calculate stock.

**Why it matters:** select observations by location, measurement method, available variables and complete depth coverage. A dataset with many layers does not necessarily provide many independent sites or enough information for a standard-depth stock estimate.

The preparations contain **20,690 profile or sampling-location records**. They have not been deduplicated across datasets. Janousek includes observations along the Canadian, US and Mexican Pacific coast; the total is not a count of independent Canadian sites.

<details>
<summary>View soil observation coverage and recorded depth</summary>

| Dataset preparation | Profile records | Layer records | Median deepest recorded layer | Records reaching 1 m |
|---|---:|---:|---:|---:|
| WoSIS | 8,825 | 43,055 | 101 cm | 55.2% |
| NPDB | 9,017 | 48,371 | 100 cm | 62.4% |
| NRCan peat | 1,217 | 37,072 | 243 cm | 89.5% |
| Janousek | 1,284 | 23,018 | 60 cm | 48.4% |
| Riley | 347 | 1,584 | 250 cm | 95.7% |

“Reaching 1 m” means the deepest recorded layer reaches that depth. It does not establish continuous sampling or eligibility for a 0–100 cm carbon-stock calculation. Riley entries are location groups, not confirmed separate cores. These are preparation counts, not a survey of all Canadian observations.

Source: [Profile dataset summary](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/profile_dataset_summary.csv).

</details>

#### Comparing observations with maps

Depth datum is part of the comparison definition. A depth measured below the mineral surface differs from the same nominal depth below the top of an organic horizon.

The source analysis uses mineral-surface preparations of WoSIS and NPDB for Geng and SoilGrids comparisons, profile-surface preparations for the organic-inclusive stock comparisons, and NRCan's recorded peat depth for peat-thickness comparisons. These are processing choices; unresolved source-depth definitions remain relevant.

**Training overlap limits interpretation.** WoSIS is connected to SoilGrids training, CanSIS/NPDB is Geng's source family, and historical WoSIS/peat compilations contributed to Sothe. Agreement with these observations cannot be assumed to be independent validation. Exact historical training subsets are not identical to the current preparations by default.

<details>
<summary>View observation eligibility and limitations</summary>

- Layers must cover the requested interval under the report's coverage rule; values are not extrapolated to fill missing depths.
- Riley bulk-density units remain unverified, so those density values are excluded from quantitative comparisons.
- Janousek profiles with inconsistent recorded thickness and layer boundaries are excluded from depth integration in the current analysis.
- Provider-estimated values and measured values retain different provenance. A value being present does not establish that it was measured directly.
- Prepared stocks have source-specific construction and coarse-fragment limitations. Correct unit conversion does not resolve those differences.
- A core samples a much smaller volume than a map pixel, and the observation and map dates may differ.

The [source comparison page](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/compare.qmd) provides the depth-matched observation-to-map diagnostics. Read those results with their eligibility and depth-datum labels. See also [methods](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/report/methods.qmd) and [soil-method records](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Soil_methods.csv).

</details>

### Covariates

**Main finding:** climate, terrain and vegetation information recur across soil studies, but the variables, dates, training observations and spatial supports differ. Regional peat and coastal studies also use environmental information specific to their setting.

**Why it matters:** a predictor used in one study is not automatically an appropriate substitute in another. Sampling a coarse climate layer at 30 m does not create 30 m climate information. Field measurements such as sediment fines or tidal elevation may have no equivalent national raster.

<details>
<summary>View soil and peat study inputs</summary>

| Study/product | Main inputs or method recorded | Output support | Interpretation |
|---|---|---|---|
| Sothe soil studies | Depth, climate, vegetation, temperature, terrain and spectral variables | 250 m | Distinguish concentration/density prediction from the subsequent construction of stocks. |
| SoilGrids 2.0 | Climate, terrain, ecology, geology, land cover and remote sensing | 250 m | Global training context; the output cell size does not describe every predictor's native resolution. |
| Geng soil grids | Climate normals, optical observations, terrain, surficial materials and depth/land-cover context | 100 m | Canadian observations are concentrated in southern agricultural areas. |
| Hengl Alberta study | Vegetation, climate and terrain at several scales | 30 m | Regional agricultural sampling and source-specific terrain derivatives. |
| Li peat-depth study | Seasonal optical/thermal and radar variables, elevation and distance context | 30 m | Regional Hudson/James Bay Lowlands model; historical recipes are not interchangeable with arbitrary contemporary substitutes. |
| Janousek coastal study | Tidal elevation, sediment fines, vegetation/salinity and estuary/climate context | Cores and study-specific models | Important field variables are not necessarily available as continuous national rasters. |
| NCSCDv2 | Soil maps, pedons and map-unit stock assignment | Polygon estimates and rasterisations | This is a different upscaling approach from a satellite-predictor model; it has no directly comparable predictor ranking. |

Sources: [Studies](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Studies.csv), [Covariates](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/Covariates.csv), and the original studies linked in those tables. No new covariate-effect model is fitted in this comparison.

</details>

### Maps

#### Sothe and SoilGrids: nominal 0–100 cm stocks with different construction

**Main finding:** the paired mean Sothe stock is **48.1 kg C/m²**, compared with **20.9 kg C/m²** for the SoilGrids-derived stock. Their values show little linear association in this sample (**r = 0.07**).

**Why it matters:** the products give different amounts and patterns of carbon, but their definitions must be resolved before using the gap as evidence of missing or overestimated carbon.

**The SoilGrids benchmark is derived in this analysis**, by integrating its carbon-density layers over 0–100 cm. It is distinct from the hosted native SoilGrids 0–30 cm stock product. SoilGrids excludes overlying organic layers, so the comparison is not automatically equivalent to an organic-inclusive surface-to-1 m stock. The source assigns Sothe a 0–1 m depth; the catalogue retains hosted-release identity and encoding caveats.

<details>
<summary>View statistics and comparison definition</summary>

**A:** Sothe/McMaster–WWF 0–1 m stock  
**B:** SoilGrids 0–100 cm stock derived from carbon density  
**Unit:** kg C/m². Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 19,900 |
| Mean A | 48.1 |
| Mean B | 20.9 |
| Mean difference, A − B | 27.1 |
| Root-mean-square difference | 50.8 |
| Pearson correlation, r | 0.07 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

#### Sothe and NCSCDv2: 0–100 cm stocks

**Main finding:** under the report's current depth and unit assignments, the paired means are **49.6 kg C/m² for Sothe** and **20.5 kg C/m² for NCSCDv2**, with **r = 0.28**.

**Why it matters:** a nominally matching depth interval does not produce interchangeable estimates. Sothe's mapped predictions and NCSCDv2's soil-map/pedon upscaling use different information and methods. The result does not establish which is closer to actual stocks at a particular location.

Sothe is averaged to the NCSCDv2 raster grid. Source depth definitions, organic-layer treatment and imported-file verification remain part of the interpretation; this is a qualified comparison rather than a settled equivalence of stock definitions.

<details>
<summary>View statistics and comparison definition</summary>

**A:** Sothe/McMaster–WWF 0–1 m stock  
**B:** NCSCDv2 0–100 cm stock  
**Unit:** kg C/m². Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 15,804 |
| Mean A | 49.6 |
| Mean B | 20.5 |
| Mean difference, A − B | 29.1 |
| Root-mean-square difference | 48.6 |
| Pearson correlation, r | 0.28 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

#### Geng and SoilGrids: carbon concentration by depth

**Main finding:** at 0–5 cm, SoilGrids has a higher paired mean concentration than Geng: **79.8 versus 62.5 g/kg**, with **r = 0.62**. Both the size of the difference and the number of usable paired points change with depth.

**Why it matters:** differences near the surface should not be assumed to apply uniformly down the profile. Compare matching intervals and retain each product's depth-datum and mask qualifications.

Geng's 100 m product is averaged to the SoilGrids 250 m grid. Geng's imported encoding and exact organic-surface treatment remain verification items in the source catalogue. These concentrations are not carbon stocks.

<details>
<summary>View concentration statistics for all five intervals</summary>

Units: **g/kg**. A = Geng; B = SoilGrids. Differences are A − B.

| Interval | Paired points | Mean Geng | Mean SoilGrids | Mean Geng − SoilGrids | RMSD | r |
|---|---:|---:|---:|---:|---:|---:|
| 0–5 cm | 17,575 | 62.5 | 79.8 | -17.3 | 49.2 | 0.62 |
| 5–15 cm | 17,414 | 55.2 | 65.6 | -10.4 | 42.8 | 0.62 |
| 15–30 cm | 17,330 | 50.6 | 52.0 | -1.4 | 41.4 | 0.66 |
| 30–60 cm | 17,261 | 41.6 | 47.1 | -5.6 | 43.1 | 0.69 |
| 60–100 cm | 17,121 | 40.5 | 46.7 | -6.2 | 45.4 | 0.68 |

</details>

<details>
<summary>View bulk density as a supporting diagnostic</summary>

Units: **g/cm³**. A = Geng; B = SoilGrids. Differences are A − B.

| Interval | Paired points | Mean Geng | Mean SoilGrids | Mean Geng − SoilGrids | RMSD | r |
|---|---:|---:|---:|---:|---:|---:|
| 0–5 cm | 17,573 | 1.180 | 0.913 | 0.267 | 0.338 | 0.02 |
| 5–15 cm | 17,412 | 1.220 | 1.119 | 0.100 | 0.224 | -0.05 |
| 15–30 cm | 17,328 | 1.283 | 1.234 | 0.048 | 0.195 | -0.06 |
| 30–60 cm | 17,259 | 1.319 | 1.366 | -0.047 | 0.207 | -0.02 |
| 60–100 cm | 17,119 | 1.374 | 1.430 | -0.056 | 0.261 | 0.13 |

Bulk density affects stock construction, but similar mean density does not establish agreement in its spatial pattern. The near-zero correlations in several intervals illustrate why agreement cannot be reduced to a single mean or threshold. These rows compare mapped density; Riley's unverified field density is excluded from observation comparisons.

</details>

#### SoilGrids and NCSCDv2: released 0–30 cm stocks

**Main finding:** their paired means are **6.72 and 7.89 kg C/m²**, respectively, but the mapped values show little linear association (**r = −0.04**).

**Why it matters:** similar averages can conceal substantially different distributions across the landscape. A study needing local variation should not treat similarity in the overall mean as evidence that the maps are interchangeable.

**Depth treatment may differ.** SoilGrids excludes overlying organic layers; NCSCDv2's surface and organic-layer treatment must be checked for the intended use. The reported mean is for the shared valid sample, not a national mean for all land.

<details>
<summary>View statistics and comparison definition</summary>

**A:** SoilGrids released 0–30 cm stock  
**B:** NCSCDv2 0–30 cm stock  
**Unit:** kg C/m². Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 15,836 |
| Mean A | 6.72 |
| Mean B | 7.89 |
| Mean difference, A − B | -1.17 |
| Root-mean-square difference | 6.22 |
| Pearson correlation, r | -0.04 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

#### Li and PEATGRIDS: peat thickness and full-column carbon

**Main finding:** in the sampled Hudson Plain overlap, mean peat thickness is **179.7 cm for Li** and **205.8 cm for PEATGRIDS**, with **r = 0.63**. Mean full-column carbon is **84.5 versus 122.2 kg C/m²**, with little linear association between the carbon estimates (**r = −0.02**).

**Why it matters:** greater agreement in peat thickness does not establish agreement in peat carbon. Full-column stock also reflects how each product represents density and carbon content; the depth comparison alone does not identify the reason for the carbon difference.

Li's 30 m values are averaged to the PEATGRIDS approximately 1 km grid. The two quantities are assessed separately, at **1,230 valid paired locations**. The geographic sample is the Hudson Plain ecozone, not all Canadian peatlands.

PEATGRIDS thickness is in cm. Its areal carbon stock is converted from Mg C/m² to kg C/m² by multiplying by 1,000. Missing values are masked before sampling. Full-column peat stocks should not be ranked alongside fixed-depth 0–1 m stocks as if they measured the same quantity.

<details>
<summary>View statistics and comparison definition</summary>

**A:** Li peat thickness  
**B:** PEATGRIDS peat thickness  
**Unit:** cm. Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 1,230 |
| Mean A | 179.7 |
| Mean B | 205.8 |
| Mean difference, A − B | -26.1 |
| Root-mean-square difference | 47.9 |
| Pearson correlation, r | 0.63 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

<details>
<summary>View statistics and comparison definition</summary>

**A:** Li full-column peat carbon  
**B:** PEATGRIDS full-column peat carbon  
**Unit:** kg C/m². Differences are A − B.

| Statistic | Value |
|---|---:|
| Paired sample points | 1,230 |
| Mean A | 84.5 |
| Mean B | 122.2 |
| Mean difference, A − B | -37.6 |
| Root-mean-square difference | 52.1 |
| Pearson correlation, r | -0.02 |

[Source statistics](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Pair definitions](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/pairs.json)

</details>

## Choosing data for an area of interest

Start with the quantity, carbon pool, depth and reference period needed for the question. Then check geographic applicability, observation support, source methods and access. Use these comparisons to identify differences worth investigating; use independent, suitable observations to assess accuracy where they are available.

Avoid adding overlapping pools, counting shared observations twice, or treating alternative estimates of the same stock as additional carbon. Regional, coastal and marine products remain useful resources even where no compatible quantitative pair is included here.

## Methods and source snapshot

**Source revision:** [6b125781e40267867399372d65b2fd72fc30670d](https://github.com/CathalD/Carbon_Data_SOD/commit/6b125781e40267867399372d65b2fd72fc30670d). The tables above are transcribed from that version's committed results; they have not been recomputed for this draft.

<details>
<summary>View statistical definitions and sampling limits</summary>

- **Mean difference:** average A − B. Its sign depends on the stated order; it is not a measurement of error against truth.
- **RMSD:** root-mean-square difference, in the same unit as the quantity. It includes differences in level and variation and is not an accuracy estimate here.
- **Pearson r:** linear association across the sampled values. High correlation can coexist with a substantial difference in level; low correlation does not, by itself, diagnose a unit error.
- **Sampling:** 30,000 initial area-uniform national points and 1,500 Hudson Plain points, with pair-specific validity. Forest pairs exclude shared zeros. Different pairs cover different retained footprints, so a product's mean can change between comparisons.
- **Spatial support:** finer maps are mean-aggregated to the pair's comparison grid. The source report's hexagon figures summarise those sampled values; they are not a new high-resolution raster or independent observations.
- **Uncertainty:** source layers can represent standard deviation, quantiles or model disagreement. No common uncertainty propagation or uncertainty ranking is performed here.
- **Interpretation:** shared training, observation dates, masks, source encodings and depth definitions can all affect the results. The analysis does not isolate their individual contributions.

[Full methods](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/report/methods.qmd) · [Original comparison source](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/Comparison/compare.qmd) · [Download statistics CSV](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/6b125781e40267867399372d65b2fd72fc30670d/Comparison/data/derived/comparison_statistics.csv) · [Dataset catalogue](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/data/downloads/)

</details>
