# Carbon comparisons workbook -------------------------------------------------
# Open CarbonComparisons.Rproj in RStudio. Run one section at a time with
# Ctrl+Enter (Windows/Linux) or Cmd+Return (Mac). The README explains setup.
# First pass: use the saved samples. Second pass: change MODE to "gee".
# Outputs stay on your computer under outputs/. Nothing is uploaded to GEE.

# 1. Choose your comparison ----------------------------------------------------
MODE <- 'saved'                 # 'saved' or 'gee'
PAIR_ID <- 'sothe_sg_0_100'      # Start with Sothe versus derived SoilGrids 1 m stock.
MAX_POINTS <- 500               # Small learning run; Inf uses every reference point.
AOI_BBOX <- NULL                # Optional c(west, south, east, north), e.g. c(-86, 50, -79, 55)
RUN_ALL_PAIRS <- FALSE          # TRUE runs every one of the 17 report pairs.
EE_PROJECT <- Sys.getenv('EE_PROJECT', unset = 'YOUR_EARTH_ENGINE_PROJECT_ID')

# 2. Load the workbook and review what is comparable ---------------------------
source('helpers.R')
print(pairs[c('id', 'quantity', 'unit', 'datum_status')], row.names = FALSE)
pair <- pair_spec(PAIR_ID)
print(pair[c('a_label', 'b_label', 'quantity', 'unit', 'datum', 'note')], row.names = FALSE)
# Pause: do these products represent the same pool, depth datum and year?
# Some report pairs are exploratory exceptions. Their differences cannot all
# be attributed to model disagreement. Read the datum/notes before proceeding.
print(products[products$key %in% c(pair$a, pair$b), ], row.names = FALSE)

# 3. Connect to Earth Engine (skip automatically in saved mode) -----------------
if (MODE == 'gee') {
  require_packages('rgee')
  if (EE_PROJECT == 'YOUR_EARTH_ENGINE_PROJECT_ID' || !nzchar(EE_PROJECT)) stop('Set EE_PROJECT to your registered project ID.')
  # If you have an existing Python environment with earthengine-api and numpy,
  # set RETICULATE_PYTHON to its executable BEFORE loading rgee; restart R first.
  # Otherwise follow the one-time rgee setup in README.md.
  rgee::ee_Initialize(project = EE_PROJECT, drive = FALSE, gcs = FALSE)
}

# 4. Obtain A and B in common units on the coarser native grid ------------------
raw <- get_pair_samples(pair, MODE, AOI_BBOX, MAX_POINTS)
head(raw)
# In gee mode, product_image() applies the conversions in products.csv.
# pair_layers() mean-aggregates the finer map onto the coarser native grid.
# See helpers.R to inspect those steps; no upsampling or gap filling is used.
# SoilGrids 0–100 cm stock = sum[OCD(hg/m³) / 10 × layer thickness(m)].
# It is derived, not a released SoilGrids stock layer; every interval is needed.

# 5. Keep shared coverage and calculate agreement ------------------------------
d <- eligible(raw, pair)
cat('Requested:', nrow(raw), 'points; eligible:', nrow(d), '\n')
if (!nrow(d)) stop('No paired values here. Choose a larger area or more points.')
# Missing values stay missing. Forest pairs exclude shared zero/non-forest.
# Paired points may share pixels: n is points, not independent observations.
A <- d$a
B <- d$b
mean_A <- mean(A)
mean_B <- mean(B)
mean_difference <- mean(A - B)              # Positive: A is higher.
RMSD <- sqrt(mean((A - B)^2))               # Disagreement, not error against truth.
Pearson_r <- safe_cor(A, B)                 # Spatial association, not accuracy.
share_within_25pct <- mean(abs(A - B) <= 0.25 * (A + B) / 2)
print(data.frame(mean_A, mean_B, mean_difference, RMSD, Pearson_r, share_within_25pct))
# Exercise: can two maps have a high r and still disagree on their stock means?
# Do not sum sample values to estimate a national/area carbon total. These
# sampled means are descriptive; a defensible total needs an area estimator.

# 6. Draw the comparisons ------------------------------------------------------
plots <- comparison_plots(d, pair)
print(plots$scatter)                        # Dashed 1:1 line, not a fitted model.
print(plots$differences)
print(plots$sampled_maps)
print(plots$difference_map)
# Maps show sampled locations, not wall-to-wall rasters or the report's hexagons.
# Exercise: compare the histogram with the difference map. Is the mean driven
# by one region? Do the depth/pool notes help explain that region?

# 7. Save your results and settings --------------------------------------------
run_dir <- new_run(PAIR_ID, MODE)
settings <- list(mode = MODE, pair_id = PAIR_ID, max_points = MAX_POINTS,
                 bbox = AOI_BBOX, all_pairs = RUN_ALL_PAIRS,
                 ee_project = if (MODE == 'gee') EE_PROJECT else NULL,
                 fetched_at = format(Sys.time(), tz = 'UTC', usetz = TRUE),
                 reference_commit = snapshot$source_commit)
jsonlite::write_json(settings, file.path(run_dir, 'run_settings.json'), auto_unbox = TRUE, pretty = TRUE, null = 'null')
result <- save_pair(raw, pair, run_dir)
print(result)
message('Saved CSVs, four figures and settings to: ', normalizePath(run_dir))

# 8. Reproduce a published statistic -------------------------------------------
# Use MODE = 'saved', MAX_POINTS = Inf, AOI_BBOX = NULL, then re-run sections 1–7.
# Compare result with the pinned published statistics:
reference <- read_input('comparison_statistics.csv')
print(reference[reference$id == PAIR_ID, ], row.names = FALSE)
# A 500-point trial or regional subset is not expected to reproduce national
# values. Live assets can also change after the report snapshot was created.

# 9. Run all 17 pairs when you are ready ---------------------------------------
if (RUN_ALL_PAIRS) {
  all_stats <- vector('list', nrow(pairs))
  for (i in seq_len(nrow(pairs))) {
    p <- pairs[i, , drop = FALSE]
    message('\nPair ', i, '/', nrow(pairs), ': ', p$id, '\n', p$datum)
    values <- get_pair_samples(p, MODE, AOI_BBOX, MAX_POINTS)
    all_stats[[i]] <- save_pair(values, p, run_dir)
  }
  all_stats <- do.call(rbind, all_stats)
  write.csv(all_stats, file.path(run_dir, 'all_comparison_statistics.csv'), row.names = FALSE, na = '')
  print(all_stats[c('id', 'unit', 'n', 'mean_diff', 'rmsd', 'pearson_r')], row.names = FALSE)
}
# Peat pairs automatically use the Hudson Plain reference points, not Canada.
# All-point live sampling can take a long time; run one pair first. Reduce
# MAX_POINTS if a request times out. No Drive export or new GEE asset is created.
