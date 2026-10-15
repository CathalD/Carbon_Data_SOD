# Step 2 — soil metadata, depth and methods QC

Reviewed 15 October 2026. The master Google Sheet now includes **QC_register**, **Soil_methods** and **Soil_depth_QC**. This pass checks provider documentation and local prepared tables. It has **not** executed the new QC script against Earth Engine or changed any uploaded data.

## Depth and method distinctions

Keep original upper/lower sample boundaries, sample thickness and depth datum. Preserve organic versus mineral horizons, surface litter, sediment compaction and peat-column depth. Sampled maximum depth is different from a standardized stock integration depth and from a modelled peat base.

Record analytical carbon and bulk-density methods, measured/estimated flags, gap filling, stock formula, coarse-fragment treatment and uncertainty. Dataset-level descriptions do not establish one common lab protocol for every contributing survey.

The 23-row [method register](../data/catalogue/soil_methods.json) links five hosted soil sources and 18 soil map records to their depth/method definitions. The [30-asset register](../data/catalogue/soil_map_qc_register.json) separates documented source units from unverified imported scaling.

## Prepared-table depth audit

| Ground ID | Layer rows | Missing boundary rows | Nonpositive intervals | Groups with overlap | Groups with gap | Thickness differs from bottom−top |
|---|---:|---:|---:|---:|---:|---:|
| G_WOSIS | 43,055 | 0 | 0 | 191 | 392 | 0 |
| G_NPDB | 48,371 | 1928 | 1371 | 62 | 50 | 0 |
| G_NRCAN_PEAT | 37,072 | 349 | 0 | 8 | 13 | 0 |
| G_JANOUSEK | 23,018 | 0 | 3 | 9 | 13 | 182 |
| G_RILEY | 1,584 | 0 | 0 | 4 | 24 | 0 |

Counts concern local CSVs already prepared for ingestion, not an independent readback of the GEE tables. Missing means at least one boundary is not a finite number. Overlap/gap counts use positive intervals and compare the next top with the greatest preceding bottom. They do not assess missing surface/deep coverage. Thickness mismatch uses an absolute tolerance of 0.000001 cm.

These are review flags, not automatic deletion rules. Negative NPDB tops may represent organic horizons or source codes. Janousek sample lengths may differ from boundary spans because of source sampling/compaction conventions. Raw depth extrema do not establish valid coverage for every profile. No intervals have been repaired or stocks recomputed.

The [audit record](../data/catalogue/soil_depth_audit.json) includes SHA-256 fingerprints of the exact local preparations.

## Method findings requiring preservation

- **WoSIS:** retain per-variable analytical methods and units. Current organic-stock sums cover only computable layers and omit coarse-fragment corrections; they are not standardized-depth stock measurements. [ISRIC methods and units](https://docs.isric.org/globaldata/wosis/faq-wosis.html).
- **NRCan peat:** the preparation renamed organic-carbon field `SAMP_CARB_MGHA` to `TOTC_Stock`. Record its organic-carbon meaning explicitly. `Org_C_MGHA` is repeated whole-core metadata and must not be summed over layers. Restore omitted carbon estimation flags and BD estimation types. The source includes measured values and gap-filled estimates. [Provider metadata](https://www.download-telecharger.services.geo.ca/pub/nrcan_rncan/Forests_Foret/peatlands/Metadata.pdf).
- **Janousek:** source integration uses 30/50/100 cm targets with minimum sampled lengths of 20/35/75 cm, respectively, and extends deepest values where needed. The preparation uses `sample_length` in stock calculation. Review the 182 boundary/thickness discrepancies and retain extrapolation flags; do not overwrite lengths automatically. [Paper methods §2.2](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024GB008239).
- **NPDB/Riley:** original calculation/window definitions or density units remain unresolved. Retain source identifiers, horizon codes and flags; do not infer a fixed-depth total.

## Map interpretation

- **SoilGrids:** the delivered stock layer is 0–30 cm and excludes overlying organic layers. Ground stock targets were calculated before mapping; multiplying the delivered mean SOC and BD maps does not reproduce that stock model. [ISRIC](https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html).
- **Geng:** SOC (%) and BD (g/cm³) are separate properties. Provider documentation specifies 100 m, a Canada LCC projection, depth-dependent bedrock masks and legacy training concentrated in 1980–2000. Full imported CRS/encoding still needs comparison. [CanSIS product specification](https://sis.agr.gc.ca/cansis/nsdb/psm/index.html).
- **NCSCDv2:** SOCC200 represents 100–200 cm; the source raster units are hg C/m². Check whether the imports changed them. [Depth definition](https://essd.copernicus.org/articles/5/393/2013/), [raster units/grid](https://bolin.su.se/data/ncscd/tiff.php).
- **Li:** regional carbon follows variable modelled peat depth. Archive units are cm for depth and kg C/m² for carbon; uncertainty represents base-model disagreement (±1 SD). Imported encoding remains pending. [Borealis archive](https://borealisdata.ca/citation?persistentId=doi%3A10.5683%2FSP3%2FTIRAXJ).
- **Sothe:** retain the maintainer's 0–1 m assignment for both hosted stock and uncertainty. The 4TU v2 record describes a 1 m package, but exact correspondence to the hosted v20 files remains unproved. Source uncertainty descriptions conflict, so no SD interpretation is assigned. [Versioned archive](https://data.4tu.nl/datasets/b8073f2c-1dc0-4a1a-98b0-19abf6cb7193/2).

## Run the live checks

1. Paste [06_Soil_Map_QC.js](../scripts/06_Soil_Map_QC.js) into the GEE Code Editor with project `northstarlabs`. Leave `RUN_PIXEL_CHECKS = false` for the first pass.
2. Run once. It reads all 30 exact asset IDs, complete asset/band/grid metadata, ACLs, and thermokarst count/schema. It prints plain JSON under `QC_ROW`, `QC_ALIGNMENT_JSON` and `QC_SUMMARY_JSON`; no collapsed object expansion is needed.
3. Review the metadata output, then set `RUN_PIXEL_CHECKS = true` and rerun. The second pass samples 512 seeded points per image within its bounding window intersected with a broad Canadian latitude/longitude window. This is not a country mask and not a global validation.
4. Copied image comparisons require matching band IDs and full grid metadata. A mismatch or incomplete grid skips pixel comparison. Matching samples do not establish whole-raster equivalence. Zero common valid samples is inconclusive.
5. Geng samples describe the uploaded images only; source and destination are the same asset, so this is not independent TIFF equivalence. Physical units still require source-file scale/offset/NoData confirmation.
6. Table counts and first-feature schema do not establish full table equivalence. ACL read failure means unverified, not private. An observed public ACL does not establish source reuse rights or a successful separate-account test.

The script makes no exports, uploads, conversions, stock integration or permission changes. API references: [getAsset](https://developers.google.com/earth-engine/apidocs/ee-data-getasset), [getAssetAcl](https://developers.google.com/earth-engine/apidocs/ee-data-getassetacl), [sampleRegions](https://developers.google.com/earth-engine/apidocs/ee-image-sampleregions).

Step 2 remains open until the live outputs, unresolved import encodings and method/provenance gaps are reviewed.

