# Soil observations versus maps workbook ---------------------------------------
# This uses the report's prepared depth-matched observations. It does not
# pretend that all raw provider measurements are interchangeable.
# Open CarbonComparisons.Rproj; run each section in order. See README.md.

# 1. Choose a quantity and depth -----------------------------------------------
MODE <- 'saved'                  # 'gee' samples map values again at the sites.
VARIABLE <- 'soc'                 # 'soc', 'bd', 'stock', or 'peat_depth'
INTERVAL <- '0-5'                 # soc/bd: 0-5,5-15,15-30,30-60,60-100
                                 # stock: 0-30 or 0-100; peat_depth ignores this.
STOCK_DATUM <- 'mineral'          # stock only: 'mineral' or 'surface'
MAX_PROFILES <- 500               # Inf = every eligible reference profile.
AOI_BBOX <- NULL                  # c(west,south,east,north), optional
EE_PROJECT <- Sys.getenv('EE_PROJECT', unset = 'YOUR_EARTH_ENGINE_PROJECT_ID')

# 2. Load observed intervals and coordinates -----------------------------------
source('helpers.R')
require_packages(c('dplyr', 'tidyr'))
observations <- read_input('profile_intervals.csv')
locations <- read_input('profile_locations.csv')
if (VARIABLE %in% c('soc', 'bd')) {
  stopifnot(INTERVAL %in% c('0-5', '5-15', '15-30', '30-60', '60-100'))
  v <- if (VARIABLE == 'soc') 'soc_gkg' else 'bd'
  observed <- observations[observations$datum == 'mineral' & observations$variable == v & observations$interval == INTERVAL, ]
  keys <- paste0(c('geng_', 'sg_'), VARIABLE, '_', gsub('-', '_', INTERVAL))
  unit <- if (VARIABLE == 'soc') 'g/kg' else 'g/cm³'
  datum <- 'mineral'
} else if (VARIABLE == 'stock') {
  stopifnot(INTERVAL %in% c('0-30', '0-100'), STOCK_DATUM %in% c('mineral', 'surface'))
  observed <- observations[observations$datum == STOCK_DATUM & observations$variable == 'stock_kgm2' & observations$interval == INTERVAL, ]
  keys <- if (STOCK_DATUM == 'mineral') {
    if (INTERVAL == '0-30') 'sg_ocs_0_30' else 'sg_ocs_0_100_derived'
  } else {
    if (INTERVAL == '0-30') 'ncscd_0_30' else c('sothe_0_100', 'ncscd_0_100')
  }
  unit <- 'kg C/m²'; datum <- STOCK_DATUM
} else if (VARIABLE == 'peat_depth') {
  peat <- read_input('peat_core_depths.csv')
  observed <- data.frame(profile_uid = peat$profile_uid, dataset = peat$dataset, observed = peat$org_depth_cm)
  keys <- c('pg_depth', 'li_depth'); unit <- 'cm'; datum <- 'recorded peat surface'
} else stop('Choose soc, bd, stock or peat_depth.')
print(head(observed)); print(products[products$key %in% keys, ], row.names = FALSE)
# Mineral surface: WoSIS/NPDB organic surface layers removed, first remaining
# layer starts at zero. Profile surface: organic layers included. Never pool
# these datums. Thickness-weighted concentration/density requires full interval
# coverage without gaps/overlaps. Stocks use provider layer stocks, allocated
# to interval overlap. Riley density and invalid Janousek intervals are excluded
# in these preparations. Raw-layer integration is separate (README).

# 3. Choose sites, then obtain native-grid map values ---------------------------
points <- merge(locations, unique(observed[c('profile_uid', 'dataset')]), by = c('profile_uid', 'dataset'))
points <- select_points(points, AOI_BBOX, MAX_PROFILES)
if (MODE == 'saved') {
  values <- read_input('profile_map_values.csv')
  values <- values[values$pid %in% points$pid, c('pid', 'profile_uid', 'dataset', keys)]
} else if (MODE == 'gee') {
  require_packages('rgee')
  if (EE_PROJECT == 'YOUR_EARTH_ENGINE_PROJECT_ID' || !nzchar(EE_PROJECT)) stop('Set EE_PROJECT first.')
  rgee::ee_Initialize(project = EE_PROJECT, drive = FALSE, gcs = FALSE)
  values <- points[c('pid', 'profile_uid', 'dataset')]
  for (key in keys) {
    pts <- points
    # Match the original report's Li sampling footprint.
    if (key == 'li_depth') pts <- pts[!is.na(pts$ecozone) & pts$ecozone == 'Hudson Plain', ]
    if (!nrow(pts)) { values[[key]] <- NA_real_; next }
    sampled <- sample_image(product_image(key)$rename(key), pts, key, 100L)
    values[[key]] <- sampled[[key]][match(values$pid, sampled$pid)]
  }
} else stop('MODE must be saved or gee.')
# At sites, sample each map at its OWN native grid. Do not aggregate all maps
# onto one grid: this question differs from the map-to-map comparison.
long <- tidyr::pivot_longer(values, cols = dplyr::all_of(keys), names_to = 'map', values_to = 'mapped')
matched <- merge(observed, long, by = c('profile_uid', 'dataset'))
paired <- matched[is.finite(matched$observed) & is.finite(matched$mapped), ]
if (!nrow(paired)) stop('No eligible observed/map pairs; enlarge the selection or change variable/depth.')

# 4. Compare values, retaining dataset and datum -------------------------------
# Here A = map and B = observed, so positive mean_diff means map > observed.
# Shared training data prevent an independent-validation interpretation.
groups <- split(paired, interaction(paired$map, paired$dataset, drop = TRUE))
statistics <- do.call(rbind, lapply(groups, function(d) {
  cbind(data.frame(map = d$map[1], dataset = d$dataset[1], quantity = VARIABLE,
                   interval = if (VARIABLE == 'peat_depth') 'full column' else INTERVAL,
                   datum = datum, unit = unit), summarise_values(d$mapped, d$observed))
}))
rownames(statistics) <- NULL
print(statistics)
# Exercise: why does each map have a different n at the same depth?
# These are paired records, not deduplicated independent sites.

# 5. Plot observations versus maps and save ------------------------------------
plot <- ggplot2::ggplot(paired, ggplot2::aes(observed, mapped, colour = dataset)) +
  ggplot2::geom_point(alpha = 0.35, size = 0.8) + ggplot2::geom_abline(slope = 1, intercept = 0, linetype = 2) +
  ggplot2::facet_wrap(~map) + ggplot2::coord_equal() + ggplot2::theme_bw() +
  ggplot2::labs(x = paste('Observed,', unit), y = paste('Map,', unit),
                title = paste(VARIABLE, if (VARIABLE == 'peat_depth') 'full peat thickness' else INTERVAL),
                subtitle = paste('Datum:', datum, '- agreement is not independent validation'))
print(plot)
run_dir <- new_run(paste('profiles', VARIABLE, if (VARIABLE == 'peat_depth') 'full_column' else INTERVAL, sep = '_'), MODE)
write.csv(matched, file.path(run_dir, 'matched_including_missing.csv'), row.names = FALSE, na = '')
write.csv(statistics, file.path(run_dir, 'profile_statistics.csv'), row.names = FALSE, na = '')
ggplot2::ggsave(file.path(run_dir, 'observed_vs_maps.png'), plot, width = 9, height = 5, dpi = 150)
jsonlite::write_json(list(mode = MODE, variable = VARIABLE, interval = INTERVAL, datum = datum,
                         max_profiles = MAX_PROFILES, bbox = AOI_BBOX, keys = keys,
                         n_requested_profiles = nrow(points), reference_commit = snapshot$source_commit,
                         fetched_at = format(Sys.time(), tz = 'UTC', usetz = TRUE),
                         ee_project = if (MODE == 'gee') EE_PROJECT else NULL),
                    file.path(run_dir, 'run_settings.json'), auto_unbox = TRUE, pretty = TRUE, null = 'null')
message('Saved to: ', normalizePath(run_dir))
# Next: change VARIABLE/INTERVAL and re-run. Use Inf for every eligible profile.
# Concentration and density are compared at five intervals; stocks at 0–30 and
# 0–100 cm with each supported datum. Peat thickness is a separate full-column
# measurement. There is no observed forest-plot comparison in this release.
