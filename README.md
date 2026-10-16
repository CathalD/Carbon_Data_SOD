# Carbon State of Data

A catalogue of forest and soil carbon data for Canada: ground observations, the environmental covariates studies use, and the carbon maps built from them, with like-for-like comparisons between products.

**Website: <https://cathald.github.io/Carbon_Data_SOD/>**

- **Data and summaries:** what exists for Canadian forests and soils, with coverage, quantity, depth or pool, period and access for each dataset.
- **Comparisons:** where maps agree and disagree when they report the same quantity at the same depth, led by the McMaster/WWF maps (Sothe et al. 2022), plus maps against soil profiles.
- **How to use:** working examples now; Google Earth Engine apps are planned.

Coverage is strongest for forest biomass and terrestrial soils; regional coastal, wetland and other resources are included where documented.

## Get the data

- **Catalogue tables:** [`data/downloads/`](data/downloads/) holds the canonical CSVs (Studies, Ground_data, Study_ground, Covariates, Maps, Assets, Other_sources, QC_register, Soil_methods, Data_dictionary) and `carbon_catalogue.json`, generated from them. See [DOWNLOADS.md](DOWNLOADS.md).
- **Maps and ground tables:** exact Earth Engine asset IDs and provider links are in [`Assets.csv`](data/downloads/Assets.csv). Hosted assets are publicly readable; you need your own Earth Engine project.
- **Examples:** [`examples/`](examples/README.md) has a Code Editor script and a Python quickstart.

These are catalogue metadata, not redistributed measurements. Obtain full rasters and field data from the original providers under their terms.

## Repository layout

| Path | Contents |
|---|---|
| `data/downloads/` | Canonical catalogue tables (edit these, then run `scripts/build_catalogue_json.py`) |
| `data/catalogue/` | Source evidence: QC register, depth audit, soil methods, study citations, the presentation crosswalk |
| `Comparison/` | The website and comparison analysis; see [`Comparison/README.md`](Comparison/README.md) to render or reproduce |
| `scripts/` | Catalogue JSON builder and the soil-map QC script |
| `docs/` | Current QC status, public access, licensing, release notes, maintainer backlog |
| `examples/` | Short access examples |
| `references/` | BibTeX for the catalogued studies |
| `archive/` | Completed imports, the covariate pilot, superseded QC records and earlier snapshots ([index](archive/README.md)) |

## Maintaining the catalogue

The CSVs in `data/downloads/` are the single source of catalogue truth. If the working Google Sheet is used for editing, export it to these CSVs and check the result before committing; the public build never reads the Sheet. The website and the JSON are both generated from the CSVs, so they cannot drift apart.

## Cite and contribute

Cite the original publication and data release for every dataset you use; the catalogue citation is in [`CITATION.cff`](CITATION.cff), and source citations are in [SOURCES.md](SOURCES.md). Each dataset keeps its own licence ([licensing status](docs/release_licensing.md)).

Suggest additions or corrections through [GitHub Issues](https://github.com/CathalD/Carbon_Data_SOD/issues); see [CONTRIBUTING.md](CONTRIBUTING.md).





# State of Carbon Data in Canada

Canada has a wealth of carbon data, but finding the right dataset, understanding what it represents and applying it to a particular place can be difficult. Information is spread across research publications, government portals and data archives, with different formats, methods and access requirements.

This report brings those resources together to help communities, researchers, conservation practitioners and decision-makers understand what is available and how it can support their work. It covers ground observations, environmental variables and mapped estimates of forest biomass and soil carbon, including peat.

The report has three main focuses:

1. **[Data and summaries](#1-data-and-summaries):** what data exist, what they contain and how to access them.
2. **[Comparisons](#2-comparisons):** how the data differ and which products can be compared meaningfully.
3. **[How to use](#3-how-to-use):** practical tools for using the data, with Google Earth Engine apps planned.

Each focus follows the same structure: **Forests** and **Soils**, each organised into **ground data, covariates and maps**.

**Development status:** this repository is being assembled. Detailed catalogue records and reviewed comparisons will be added as the report develops. GEE apps are planned.

## Understanding the data

Ground observations provide measurements at specific plots, trees, soil profiles or cores. Some carbon quantities are measured directly; others are estimated from measurements, such as tree dimensions or soil carbon concentration and bulk density. Their uncertainty depends on the sampling and calculation methods.

**Covariates** are environmental variables used to describe conditions or help estimate carbon beyond the sampled locations. They include vegetation, climate, terrain, geology and information from optical, radar and LiDAR observations. A variable's use in a study does not, by itself, establish its predictive importance elsewhere.

**Maps** extend estimates across a landscape using observations, covariates and modelling or other upscaling methods. Their suitability depends on the quantity represented, geographic coverage, dates, spatial support and uncertainty.

Forests and soils are presented separately because their observations, methods and products often differ. They remain ecologically connected: vegetation supplies organic matter to soils, while soil conditions influence vegetation growth. Forest-floor and soil carbon beneath forests are included under Soils, with links to relevant forest resources.

## 1. Data and summaries

### Forests

- **Ground data:** forest inventories, plot measurements and sampled-tree datasets, including resources such as Canada's National Forest Inventory, Québec permanent sample plots and NRCan ENFOR biomass observations. Summaries describe measurements, coverage, dates, plot or tree support and access.
- **Covariates:** environmental variables used by forest studies, including canopy structure, optical reflectance, radar, climate and terrain. Summaries distinguish source resolution, model output resolution, time periods and documented study roles.
- **Maps:** forest biomass and carbon products, including SCANFI, ESA CCI biomass and McMaster/WWF carbon maps. Records distinguish aboveground biomass from carbon and identify the pools included in each product.

### Soils

- **Ground data:** soil profiles, peat cores and sediment observations, including WoSIS, the National Pedon Database, NRCan peat profiles and coastal datasets. Summaries describe variables, locations, dates, depth intervals and whether values are measured or estimated.
- **Covariates:** environmental variables used by soil and peat studies, including vegetation, climate, terrain, parent material, hydrology and prediction depth. Summaries retain the geographic and temporal context of their use.
- **Maps:** soil carbon concentration, carbon density, fixed-depth stocks and peat products, including SoilGrids, Geng, Sothe, NCSCDv2, Li and PEATGRIDS. Peat thickness and full-column peat carbon are identified separately from fixed-depth soil stocks.

Each dataset record will identify its source and version, quantity and units, Canadian coverage, spatial support, depth or carbon pool, reference period, access route and principal limitations. Regional and cross-border datasets will be labelled accordingly. Inclusion in the catalogue does not mean a dataset has been downloaded or hosted by this project.

## 2. Comparisons

### Forests

- **Ground data:** compare geographic coverage, observation dates, sampling support, measured variables and methods used to estimate biomass or carbon.
- **Covariates:** compare the environmental inputs studies use, their spatial and temporal support, and documented evidence for variable selection or importance.
- **Maps:** compare products with compatible quantities, pools, years and coverage. Explain differences in scope where products cannot be compared directly.

### Soils

- **Ground data:** compare coverage, variable availability, sampling depth, depth datum and completeness. Identify shared observations across compilations where known.
- **Covariates:** compare environmental inputs and their support across soil and peat studies, distinguishing documented inputs from proposed variables.
- **Maps:** compare compatible quantities and depth intervals within shared geographic coverage. Keep concentration, density, stock, peat thickness and full-column peat carbon distinct.

Map-to-observation comparisons will identify differences between a plot or core and the area represented by a map cell. Shared training data will be recorded where known. Agreement between products is not, by itself, evidence of accuracy or independent validation.

Detailed methods, unit conversions, sampling rules and diagnostics will accompany the comparisons.

## 3. How to use

**Google Earth Engine apps are planned.** They will provide tools to explore and use the data. This section is a placeholder while those tools are developed.

| Domain | Ground data | Covariates | Maps |
|---|---|---|---|
| Forests | Tools forthcoming | Tools forthcoming | Tools forthcoming |
| Soils | Tools forthcoming | Tools forthcoming | Tools forthcoming |

In the meantime, dataset records will provide original source and download links, along with Earth Engine asset references where available. Access requirements vary by provider; some observations require a data request.

## Scope and interpretation

Coverage is strongest for forest biomass and terrestrial soils. Regional peatland, wetland, coastal and other resources are included where documented; this is not an exhaustive inventory of all carbon data in Canada.

When selecting or combining datasets:

- Check the quantity and units: biomass, carbon concentration, carbon density, carbon stock and flux are different quantities.
- Match the carbon pool, depth definition, geographic coverage and reference period.
- Consider the underlying observation and information support. A smaller map cell does not automatically mean more accurate or more detailed information.
- Retain uncertainty definitions and check for overlapping observations or carbon pools before combining results.

## Sources and contributions

This report builds on the [Carbon State of Data catalogue and analysis](https://github.com/CathalD/Carbon_Data_SOD). Original publications and data releases will be cited alongside the relevant records. Each dataset retains its source terms and citation requirements.

This is intended as a community resource. To suggest a missing dataset or report a correction, contact [science@wwfcanada.org](mailto:science@wwfcanada.org) or [cdoherty@wwfcanada.org](mailto:cdoherty@wwfcanada.org). Please include the dataset name, source link or DOI, and a short description of the addition or correction.

