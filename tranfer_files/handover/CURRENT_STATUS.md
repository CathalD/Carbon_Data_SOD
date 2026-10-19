# What is ready and what comes next

The transfer folder now contains the public drafts, figures, catalogue, citations, access examples, source QC notes and technical analysis material assembled so far. `START_HERE.md` explains what to copy.

The three focuses are **Data and summaries · Comparisons · How to use**. Keep **Forests / Soils → Ground data / Covariates / Maps** within each.

| Focus | Prepared so far | Still to populate |
|---|---|---|
| Data and summaries | Dataset tables; eleven example product maps; eight soil-observation charts covering locations, depth, SOC, bulk density and site stocks | Forest observation summaries; additional covariate summaries; full-product distributions; chosen-area totals |
| Comparisons | Source-based draft findings, comparison statistics and eligibility limitations | Additional supported comparisons; clear links between summary panels and relevant comparisons |
| How to use | Six-section placeholder page, existing access examples and Carbon Data Explorer tool draft | GEE apps and their instructions |
| Supporting material | Methods, downloads, citations, QC/source evidence, figure generator and versioned analysis snapshot | Company-specific Pages configuration and final navigation/format review |

Site stocks and chosen-area totals remain separate outputs. Alternative map estimates must not be added together. Retain depth datum, carbon pool, units, dates and coverage with every quantitative result.

Edit the public pages under `docs/` and the catalogue under `data/downloads/`. The original analysis copy under `analysis/source_snapshot/` preserves the evidence behind the transferred results. The older reports under `handover/planning/` describe their own earlier revisions.

After editing the transfer folder, run `python handover/update_package.py` from this folder to refresh the ZIP and checksums. This does not upload files; saving changes to the source GitHub repository is a separate step.

The `tools/gee/` draft now shows soil points only when Profiles is expanded, clips rasters to the AOI and prepares raster/ground CSV downloads. It remains a Code Editor script for testing; a company GEE app has not been published.
