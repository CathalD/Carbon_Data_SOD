# Workbook checks

Checked on 19 October 2026 with R 4.6.0 and rgee 1.1.8:

- All 17 complete saved map comparisons match the pinned report statistics (relative numerical tolerance 1e-11).
- Live Earth Engine checks use three shared valid locations per pair, testing all 17 pairs, their unit conversions and coarser native grids. Differences from the saved values were below 3 × 10⁻¹⁴ in the corresponding units.
- Every map layer used in the profile comparisons was checked at two valid profile locations on its own native grid.
- Missing, zero and constant-value statistical cases were checked. Both numbered scripts were run with their default saved-data settings. All 15 supported profile variable/depth/datum exercises also completed. Both numbered scripts also completed end to end in live mode (30 map reference points and five profiles). The standalone ZIP was tested outside the repository, including its pinned-input downloads.

These small live checks are not a new full national live run or verification of entire raster files. The saved report inputs and their checksums remain pinned; Earth Engine assets and users' local environments can change. To repeat the saved numerical check from this repository, run `Rscript ../checks/check_saved.R` while your working directory is `workbooks/r/`.
