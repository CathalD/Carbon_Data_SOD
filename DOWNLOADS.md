# Downloads

These are **catalogue metadata tables**, not individual soil/forest measurements. They contain study/data links, asset IDs, scales, depths, methods and status. All files below are UTF-8 and public on GitHub; the restricted working Google Sheet is not required.

[Complete catalogue JSON](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/v0.1.0/data/downloads/carbon_catalogue.json) · [Repository ZIP](https://codeload.github.com/CathalD/Carbon_Data_SOD/zip/refs/tags/v0.1.0) · [Version/hash manifest](data/catalogue/public_release_manifest.json)

Release tag: `v0.1.0`. CSV/JSON/ZIP links below are pinned to this release; the repository and working catalogue can continue to evolve.

## Current catalogue CSVs

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

Import each CSV as a separate Google Sheets tab or into your cloud table workflow. Keep identifiers as strings. Blank numeric cells mean unresolved/not applicable, never zero. The JSON preserves native numeric values. CSV imports may guess types: preserve leading-zero source identifiers.

## Raster and observation access

- Exact hosted Earth Engine references and original-provider links are in [Assets](data/downloads/Assets.csv). Earth Engine sign-in and your own enabled project are required even for public assets.
- [Working examples](examples/README.md) load public soil/forest resources and download a small demonstration GeoTIFF. The demo uses a declared 250 m UTM grid because the source custom Mollweide projection is not accepted by Earth Engine’s GeoTIFF writer; it is not a native-grid copy.
- Full-size rasters and ground tables should be obtained from the original provider or exported from the documented public asset using your own environment. The [official raster](https://developers.google.com/earth-engine/guides/exporting_images) and [table](https://developers.google.com/earth-engine/guides/exporting_tables) guides describe this. No permanent raster HTTP download is implied by an Earth Engine ID.
- Geng is public through the parent collection ACL. SCANFI v2’s hosted collection is public but empty; use its linked provider release until imagery is ingested.
- The existing [maintainer-uploaded workbook](https://raw.githubusercontent.com/CathalD/Carbon_Data_SOD/main/Carbon%20State%20of%20Data%20Summary%20Sheet.xlsx) is an older 10-tab snapshot. The current CSV/JSON package includes later catalogue and QC additions.

## Availability and scope

See [verified sharing](docs/public_access.md), [release notes](docs/releases/0.1.0.md), [source citations](SOURCES.md) and [licensing status](docs/release_licensing.md). Individual pilot points/rows are not included in this download package. Comparison results are forthcoming from the maintainer in [Comparison](Comparison/README.md).
