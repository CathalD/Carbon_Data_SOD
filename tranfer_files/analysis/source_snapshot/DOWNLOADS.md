# Downloads

These are **catalogue metadata tables**, not individual soil or forest measurements. They contain study and data links, asset IDs, scales, depths, methods and status. All files are UTF-8; the working Google Sheet is not required.

## Current catalogue

The CSVs below are the single source of catalogue truth. [`carbon_catalogue.json`](data/downloads/carbon_catalogue.json) is generated from them by [`scripts/build_catalogue_json.py`](scripts/build_catalogue_json.py) and carries its version and source revision. The website reads the same tables: <https://cathald.github.io/Carbon_Data_SOD/downloads.html>.

| Table | Data rows | CSV |
|---|---:|---|
| Studies | 24 | [Studies.csv](data/downloads/Studies.csv) |
| Ground_data | 28 | [Ground_data.csv](data/downloads/Ground_data.csv) |
| Study_ground | 29 | [Study_ground.csv](data/downloads/Study_ground.csv) |
| Covariates | 217 | [Covariates.csv](data/downloads/Covariates.csv) |
| Maps | 28 | [Maps.csv](data/downloads/Maps.csv) |
| Assets | 51 | [Assets.csv](data/downloads/Assets.csv) |
| Other_sources | 20 | [Other_sources.csv](data/downloads/Other_sources.csv) |
| QC_register | 30 | [QC_register.csv](data/downloads/QC_register.csv) |
| Soil_methods | 23 | [Soil_methods.csv](data/downloads/Soil_methods.csv) |
| Data_dictionary | 192 | [Data_dictionary.csv](data/downloads/Data_dictionary.csv) |

Keep identifiers as strings. Blank numeric cells mean unresolved or not applicable, never zero. CSV imports may guess types, so preserve leading-zero source identifiers.

Comparison outputs (pair samples, statistics and pair definitions) are in [`Comparison/data/derived/`](Comparison/data/derived/); see the site's Downloads page.

## v0.1.0 release (pinned)

These links point at the `v0.1.0` tag and do not change. That release also included three covariate-extraction planning tables, which are now in [`archive/covariate-pilot/`](archive/covariate-pilot/).

[Complete catalogue JSON](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/carbon_catalogue.json) · [Repository ZIP](https://codeload.github.com/CathalD/Carbon_Data_SOD/zip/refs/tags/v0.1.0) · [Version/hash manifest](data/catalogue/public_release_manifest.json) · [Release notes](docs/releases/0.1.0.md)

| Table | Data rows | CSV download |
|---|---:|---|
| Studies | 24 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Studies.csv) |
| Ground_data | 28 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Ground_data.csv) |
| Study_ground | 29 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Study_ground.csv) |
| Covariates | 217 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Covariates.csv) |
| Maps | 28 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Maps.csv) |
| Assets | 51 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Assets.csv) |
| Other_sources | 20 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Other_sources.csv) |
| Data_dictionary | 192 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Data_dictionary.csv) |
| QC_register | 30 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/QC_register.csv) |
| Soil_methods | 23 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Soil_methods.csv) |
| Extraction_plan | 114 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Extraction_plan.csv) |
| Scale_profiles | 10 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Scale_profiles.csv) |
| Study_stacks | 11 | [Download](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/Study_stacks.csv) |

## Raster and observation access

- Exact hosted Earth Engine references and original-provider links are in [Assets](data/downloads/Assets.csv). Earth Engine sign-in and your own enabled project are required even for public assets.
- [Working examples](examples/README.md) load public soil and forest resources and download a small demonstration GeoTIFF.
- Full-size rasters and ground tables should be obtained from the original provider, or exported from the documented public asset in your own environment ([raster](https://developers.google.com/earth-engine/guides/exporting_images) and [table](https://developers.google.com/earth-engine/guides/exporting_tables) export guides). An Earth Engine ID does not imply a permanent raster download.
- The earlier maintainer workbook (10 tabs, 2026-10-15) is kept in [`archive/catalogue-snapshots/`](archive/catalogue-snapshots/); the current CSVs include later corrections.

See [verified sharing](docs/public_access.md), [source citations](SOURCES.md) and [licensing status](docs/release_licensing.md).
