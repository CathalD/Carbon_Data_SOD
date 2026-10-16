# Comparison site: build and reproduce

This folder holds the Quarto site published at <https://cathald.github.io/Carbon_Data_SOD/>: **Data and summaries**, **Comparisons** and **How to use**, plus Methods, Downloads, Sources and Contribute.

There are two separate jobs. Most updates only need the first.

## 1. Render the published snapshot (no Earth Engine)

Everything the pages read is committed: the catalogue CSVs in `../data/downloads/`, and analysis outputs in `data/derived/`, `data/previews/` and `data/ecozones/`.

Requirements:

- [Quarto](https://quarto.org) 1.9 or later.
- R 4.4 or later with: `dplyr tidyr readr ggplot2 scales sf readxl jsonlite knitr rmarkdown htmltools patchwork hexbin DT`.

```bash
cd Comparison
quarto render                 # writes Comparison/_site/
quarto publish gh-pages       # publishes _site to the gh-pages branch
```

If more than one R is installed, point Quarto at the right one, for example `QUARTO_R=/Library/Frameworks/R.framework/Resources/bin/R`.

## 2. Refresh the analysis (Earth Engine + prepared profile tables)

**Settings:**

- `EE_PROJECT`: your Earth Engine Cloud project (default `northstarlabs`).
- `CSOD_LOCAL_DATA`: the folder holding the prepared profile and layer CSVs (default: the folder containing this repository).

**Inputs:** listed in [`analysis/inputs_manifest.csv`](analysis/inputs_manifest.csv), which records each local table's row count and SHA-256, and every Earth Engine asset used. Regenerate it with `python analysis/make_inputs_manifest.py`.

**Python packages:** `analysis/requirements.txt`.

**Steps:** run from `Comparison/analysis/`, in order.

```bash
Rscript R/01_profile_intervals.R      # profile layers -> map intervals (two depth datums)
Rscript R/02_peat_core_depths.R       # recorded peat depth per NRCan core
python gee/01_sample_pairs.py         # comparison-grid values at 30,000 random points
python gee/02_sample_profiles.py      # native-grid map values at profile locations
python profile_summary.py             # per-dataset soil summary for Data and summaries
Rscript R/03_comparison_statistics.R  # one statistics table for all pairs
python gee/catalogue_previews.py      # optional: refresh the dataset preview images
```

Each script's header documents its inputs, outputs and method. The pair definitions (quantities, unit conversions, grids, depth datum) live in `analysis/gee/common.py` and are written to `data/derived/pairs.json`.

## Layout

| Path | Purpose |
|---|---|
| `index.qmd`, `compare.qmd`, `use.qmd` | The three main pages |
| `downloads.qmd`, `sources.qmd`, `contribute.qmd`, `report/methods.qmd` | Secondary pages |
| `report/_setup.R` | Shared data loading, statistics, figures and the repository branch used for links |
| `analysis/` | Earth Engine (Python) and R analysis scripts |
| `data/derived/` | Versioned analysis outputs read by the site |
| `data/previews/` | One preview image per map product, with `previews.json` |
| `data/ecozones/` | AAFC terrestrial ecozones (Open Government Licence – Canada) |
| `data/comparison_exclusions.csv` | Product pairs not compared, and why |

Catalogue IDs map to forests/soils, data type and ecosystem through `../data/catalogue/presentation_crosswalk.csv`. Earlier planning notes are in `../archive/notes/`.
