# Downloads

The catalogue describes available datasets, studies, variables, maps and access. These tables are metadata, not the underlying forest or soil measurements. Retain identifiers as strings; blank values do not mean zero.

| Table | Records in this snapshot | CSV |
|---|---:|---|
| Assets | 51 | [Assets.csv](../data/downloads/Assets.csv) |
| Covariates | 217 | [Covariates.csv](../data/downloads/Covariates.csv) |
| Data_dictionary | 192 | [Data_dictionary.csv](../data/downloads/Data_dictionary.csv) |
| Ground_data | 28 | [Ground_data.csv](../data/downloads/Ground_data.csv) |
| Maps | 28 | [Maps.csv](../data/downloads/Maps.csv) |
| Other_sources | 20 | [Other_sources.csv](../data/downloads/Other_sources.csv) |
| QC_register | 30 | [QC_register.csv](../data/downloads/QC_register.csv) |
| Soil_methods | 23 | [Soil_methods.csv](../data/downloads/Soil_methods.csv) |
| Studies | 24 | [Studies.csv](../data/downloads/Studies.csv) |
| Study_ground | 29 | [Study_ground.csv](../data/downloads/Study_ground.csv) |

[Complete catalogue JSON](../data/downloads/carbon_catalogue.json) is generated from the CSVs. To refresh it after editing the tables, install `scripts/requirements.txt` and run `python scripts/build_catalogue_json.py` from the new repository root. The exported snapshot retains its original metadata until regenerated.

The [catalogue evidence](../data/catalogue/) preserves source citations, depth and QC records, access checks and presentation labels. Access verification dates describe those checks; they are not a guarantee of current provider availability.

## Prepared analysis outputs

- [Comparison statistics and sample tables](../analysis/source_snapshot/Comparison/data/derived/).
- [Pair definitions](../analysis/source_snapshot/Comparison/data/derived/pairs.json).
- [Figure source manifest](images/summaries/source_manifest.json).
- [Reproduction and input requirements](../analysis/README.md).

These outputs support the versioned source comparisons. They do not supply missing forest plot summaries, full-product raster distributions or chosen-area totals.

[Sources](../SOURCES.md) · [Source terms](release_licensing.md)
