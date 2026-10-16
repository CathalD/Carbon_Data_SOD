# Soil map quality checks: current status

Latest run: QC v2026-10-15.2, all 30 hosted soil-map assets. The full register is [`data/downloads/QC_register.csv`](../data/downloads/QC_register.csv); the chronological record of earlier passes is in [`archive/verification/2026-10-15/`](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/archive/verification/2026-10-15).

| Check | Result |
|---|---|
| Metadata readback | All 30 assets returned metadata (29 images, 1 table). |
| Copied-image sample agreement | 19 copied images (8 Sothe, 4 SoilGrids, 3 NCSCDv2, 4 Li): 512 seeded points per band, zero difference, no mask mismatches. Sample agreement, not full raster equality. |
| Geng uploads | 10 images sampled; not yet compared with the original GeoTIFFs. |
| Thermokarst table | Source and copy counts, schema and geometry-type distributions match; 95 empty features and mixed geometry, so polygon suitability is unresolved. |
| Public access | All 30 assets publicly readable (Geng through its collection). |
| Sothe stock depth | 0–1 m, confirmed by the maintainer (2026-10-16). |

**Still open:** source-file units and NoData for Geng and the Li imports, thermokarst geometry provenance, and cross-product grid alignment before any pixel arithmetic beyond the comparison report. Sample agreement does not establish physical units, depth or uncertainty meaning.

QC script: [`scripts/06_Soil_Map_QC.js`](../scripts/06_Soil_Map_QC.js).
