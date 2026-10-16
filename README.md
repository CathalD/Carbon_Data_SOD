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
