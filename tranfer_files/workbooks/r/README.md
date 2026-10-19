# Carbon comparison workbooks in R

Download [r-comparison-workbook.zip](r-comparison-workbook.zip), extract it, and open **CarbonComparisons.Rproj** in RStudio. Start with **01_map_comparisons.R** and run one numbered section at a time. You can download individual scripts with GitHub's **Raw → Download** button, but keep the helper and configuration files beside them.

The first run uses the report's saved samples, so you can learn the workflow without an Earth Engine connection. Change `MODE <- 'gee'` to fetch map values again through **rgee**. Both routes calculate the results in R and save plots, CSVs and settings on your computer.

## First run

1. Install the R packages once, from the RStudio Console:

   ```r
   install.packages(c('ggplot2', 'jsonlite', 'dplyr', 'tidyr'))
   ```

2. Open `01_map_comparisons.R`. Keep `MODE <- 'saved'` and run sections 1–8. It starts with Sothe versus SoilGrids 0–100 cm stock and a 500-point trial.
3. Look at the scatter plot, distribution of differences and sampled maps. Read the depth/pool notes before interpreting the results. Files appear in `outputs/`.
4. Set `MAX_POINTS <- Inf` to use all reference points. Set `RUN_ALL_PAIRS <- TRUE` to run every map pair. With saved data and no AOI restriction, the statistics reproduce the pinned report values.

Run sections in order. If a package is missing, install it, then rerun the section. `helpers.R` contains the repeated data-loading and Earth Engine steps; the numbered scripts explain the calculations and include questions to explore.

## Fetch the maps through rgee

You need your own registered Earth Engine Cloud project and access to the listed public assets. The workbook never substitutes the catalogue maintainer's project.

```r
install.packages('rgee')
# Only if you do not already have a working rgee Python environment:
rgee::ee_install()
# Restart R after installation, then follow the authentication instructions:
rgee::ee_Authenticate()
```

Follow the [official rgee installation guide](https://r-spatial.github.io/rgee/) for Python/environment setup. `rgee` uses Python's Earth Engine API and NumPy behind the R interface. If you already have an environment, configure it using the guide instead of installing another. Windows users should follow its platform-specific instructions.

In the workbook, change:

```r
MODE <- 'gee'
EE_PROJECT <- 'your-registered-project-id'
MAX_POINTS <- 500
```

Run the numbered sections again. The script calls [`ee_Initialize`](https://r-spatial.github.io/rgee/reference/ee_Initialize.html) without Drive or Cloud Storage access. Begin with one pair and a small point count; all 30,000 national points across 17 pairs can take time. Peat uses the separate 1,500-point Hudson Plain selection. Requests are read-only and downloaded in small chunks. If one times out, retry that pair with fewer points; existing output folders remain available.

## What you can run

| Workbook | Comparisons |
|---|---|
| `01_map_comparisons.R` | All 17 published map pairs: Sothe/SoilGrids and Sothe/NCSCDv2 0–100 cm stocks; SoilGrids/NCSCDv2 0–30 cm stocks; Geng/SoilGrids SOC and density at five intervals each; Li/PEATGRIDS thickness and full-column carbon; SCANFI/ESA 2020 biomass; McMaster/WWF multi-pool forest carbon versus calculated SCANFI aboveground carbon |
| `02_profile_comparisons.R` | Observed versus mapped SOC and density at matching mineral-soil intervals; 0–30/0–100 cm site stocks with each supported datum; NRCan recorded peat thickness versus Li and PEATGRIDS |

The second script starts with SOC at 0–5 cm. Change `VARIABLE` to `bd`, `stock` or `peat_depth`; change `INTERVAL` and, for stocks, `STOCK_DATUM`. It retains source dataset labels and samples each map at its native grid. Run the listed depth/variable combinations to reproduce the scope of the report's profile comparisons. There are no forest plot-to-map results or covariate-performance regressions in this release.

## Try your area

Set `AOI_BBOX <- c(west, south, east, north)` in longitude/latitude degrees. This filters the existing reference points or eligible profile locations. For example:

```r
AOI_BBOX <- c(-86, 50, -79, 55)
```

A small area can contain too few national reference points. The workbook stops if none remain; it does not silently invent a sample or treat missing coverage as zero. An AOI subset changes the question, so it will not reproduce national statistics. The maps display paired sample locations, rather than full rasters or the published hexagon summaries.

## Keep these distinctions

- **Quantity:** biomass, carbon concentration, density, carbon stock per area and peat thickness have different units. They are never combined in one ranking.
- **Depth:** mineral-surface, organic-inclusive profile-surface and full peat-column values stay separate. SoilGrids 1 m stock is derived from carbon density and requires all five intervals.
- **Pools:** the McMaster/WWF forest pair intentionally has different pools and reference periods; it is exploratory. SCANFI carbon uses an explicit 0.5 carbon fraction. Geng and Li imported encodings retain the report's unresolved verification notes.
- **Grid and missing values:** map pairs use the coarser native grid, mean-aggregating the finer map. At profiles, each map uses its own native grid. PEATGRIDS NaN/negative missing values are masked; recorded zero values remain valid. Shared zero/nonpositive forest pixels are excluded as in the report. [Earth Engine documents the aggregation weights](https://developers.google.com/earth-engine/apidocs/ee-image-reduceresolution).
- **Interpretation:** A − B, RMSD and correlations describe agreement; shared training sources prevent an independent-validation interpretation. Point counts are not counts of independent pixels. Profile preparations retain cross-border records; use an explicit area selection when you need only Canadian sites. Sample values must not be summed into national or AOI carbon totals.

## What is downloaded, and what is not

`pairs.json` and `products.csv` record the pair definitions, assets, bands and conversion factors. `snapshot.json` pins the source revision; `input_checksums.json` checks the CSV inputs. Within a full repository checkout, matching local files are used. A standalone workbook downloads the pinned report CSVs into `data_cache/`. These are public report samples and prepared observations, not copies of entire rasters. Internet access is required for this initial standalone download.

The profile workbook uses **already prepared depth-matched observations** from the report. It can fetch map values again in rgee, but does not reconstruct every provider's raw profile/layer preparation from GEE. Rebuilding those observations is a separate step: [original preparation scripts and requirements](https://github.com/CathalD/Carbon_Data_SOD/tree/main/Comparison/analysis/R). They need the original prepared local profile/layer inputs, which are not all included in this repository. No missing density is filled in by this workbook.

Saved inputs are pinned to source commit `90ed020c1198c6ab723684b0b44e8707dc65e232`. Live assets may change independently, so a new live run need not exactly reproduce the saved snapshot. Each run saves its settings, product/pair definitions and R session information. Live map-pair runs also save the comparison grid CRS and transform. Keep these with your figures. Cite the original datasets and the source report's [methods](https://cathald.github.io/Carbon_Data_SOD/report/methods.html).
