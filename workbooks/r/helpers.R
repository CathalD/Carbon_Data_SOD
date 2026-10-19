# Shared utilities. The two numbered scripts are the workbooks to read first.
# This file never installs packages, authenticates, or runs an analysis on sourcing.
require_packages <- function(packages) {
  missing <- packages[!vapply(packages, requireNamespace, logical(1), quietly = TRUE)]
  if (length(missing)) stop('Install these R packages first: ', paste(missing, collapse = ', '), call. = FALSE)
}
require_packages(c('jsonlite', 'ggplot2'))
if (!file.exists('pairs.json')) stop('Open CarbonComparisons.Rproj, or set your working directory to this workbook folder.')
pairs <- jsonlite::fromJSON('pairs.json')
products <- read.csv('products.csv', stringsAsFactors = FALSE, check.names = FALSE)
snapshot <- jsonlite::fromJSON('snapshot.json')

read_input <- function(filename) {
  # Prefer a full-repository copy; a standalone ZIP fetches the same pinned CSV.
  candidates <- c(file.path('../../Comparison/data/derived', filename),
                  file.path('../../analysis/source_snapshot/Comparison/data/derived', filename))
  cache <- file.path('data_cache', snapshot$source_commit, filename)
  found <- candidates[file.exists(candidates)]
  # Only use local files if they agree with the pinned source commit's checksums.
  # Downloads are cached per commit; clear that cache to retrieve a fresh copy.
  expected <- input_hashes[[filename]]
  if (is.null(expected)) stop('Input not listed in input_checksums.json: ', filename)
  valid <- function(p) file.exists(p) && identical(unname(tools::md5sum(p)), expected)
  good <- found[vapply(found, valid, logical(1))]
  if (length(good)) path <- good[1] else {
    path <- cache
    if (!valid(path)) {
      dir.create(dirname(path), recursive = TRUE, showWarnings = FALSE)
      url <- sprintf('https://raw.githubusercontent.com/%s/%s/%s/%s',
                     snapshot$repository, snapshot$source_commit, snapshot$data_path, filename)
      message('Downloading report input: ', filename)
      utils::download.file(url, path, mode = 'wb', quiet = TRUE)
      if (!valid(path)) stop('Downloaded input does not match the pinned checksum: ', filename)
    }
  }
  read.csv(path, stringsAsFactors = FALSE, check.names = FALSE, na.strings = c('', 'NA'))
}
input_hashes <- jsonlite::fromJSON('input_checksums.json', simplifyVector = FALSE)

select_points <- function(points, bbox = NULL, max_points = Inf, seed = 42L) {
  if (!all(c('pid', 'lon', 'lat') %in% names(points)) || anyDuplicated(points$pid)) stop('Points need unique pid, lon and lat.')
  points <- points[is.finite(points$lon) & is.finite(points$lat), , drop = FALSE]
  if (!is.null(bbox)) {
    if (length(bbox) != 4 || any(!is.finite(bbox)) || bbox[1] >= bbox[3] || bbox[2] >= bbox[4]) stop('bbox must be west, south, east, north.')
    points <- points[points$lon >= bbox[1] & points$lon <= bbox[3] & points$lat >= bbox[2] & points$lat <= bbox[4], , drop = FALSE]
  }
  if (!is.numeric(max_points) || length(max_points) != 1 || is.na(max_points) || max_points < 1) stop('max_points must be positive or Inf.')
  if (nrow(points) > max_points) {
    set.seed(seed)
    points <- points[sort(sample.int(nrow(points), as.integer(max_points))), , drop = FALSE]
  }
  if (!nrow(points)) stop('No reference points fall in this selection. Enlarge the area or supply your own points.')
  points
}

eligible <- function(d, pair) {
  keep <- is.finite(d$a) & is.finite(d$b)
  # Match the report: do not let shared zero-forest pixels inflate agreement.
  if (pair$domain == 'forest') keep <- keep & (d$a > 0 | d$b > 0)
  d[keep, , drop = FALSE]
}
safe_cor <- function(a, b, method = 'pearson') {
  if (length(a) < 3 || stats::sd(a) == 0 || stats::sd(b) == 0) return(NA_real_)
  stats::cor(a, b, method = method)
}
summarise_values <- function(a, b) {
  keep <- is.finite(a) & is.finite(b); a <- a[keep]; b <- b[keep]
  if (!length(a)) return(data.frame(n = 0L, mean_a = NA_real_, mean_b = NA_real_, mean_diff = NA_real_,
                                   rmsd = NA_real_, pearson_r = NA_real_, spearman_rho = NA_real_, within_25pct = NA_real_))
  data.frame(n = length(a), mean_a = mean(a), mean_b = mean(b), mean_diff = mean(a - b),
             rmsd = sqrt(mean((a - b)^2)), pearson_r = safe_cor(a, b),
             spearman_rho = safe_cor(a, b, 'spearman'),
             within_25pct = mean(abs(a - b) <= 0.25 * (a + b) / 2))
}

pair_spec <- function(id) {
  p <- pairs[pairs$id == id, , drop = FALSE]
  if (nrow(p) != 1) stop('Unknown pair_id: ', id)
  p
}
product_image <- function(key) {
  p <- products[products$key == key, , drop = FALSE]
  if (nrow(p) != 1) stop('Unknown product: ', key)
  ee <- rgee::ee
  if (p$recipe == 'soilgrids_stock_100') {
    # OCD is carbon per volume, not concentration: no bulk-density multiplication.
    source <- ee$Image(p$asset)
    tops <- c(0, 5, 15, 30, 60); bottoms <- c(5, 15, 30, 60, 100)
    layers <- lapply(seq_along(tops), function(i) source$select(sprintf('ocd_%d-%dcm_mean', tops[i], bottoms[i])))
    stocks <- lapply(seq_along(layers), function(i) layers[[i]]$multiply(0.1 * (bottoms[i] - tops[i]) / 100))
    all_valid <- do.call(ee$Image$cat, lapply(layers, function(x) x$mask()))$reduce(ee$Reducer$min())
    return(do.call(ee$Image$cat, stocks)$reduce(ee$Reducer$sum())$updateMask(all_valid)$setDefaultProjection(layers[[1]]$projection()))
  }
  image <- ee$Image(p$asset)
  image <- if (p$band == 'FIRST') image$select(0L) else image$select(p$band)
  if (p$recipe == 'peat_nonnegative') image <- image$updateMask(image$gte(0))
  image$multiply(p$multiplier)
}
pair_layers <- function(pair) {
  ee <- rgee::ee
  a <- product_image(pair$a); b <- product_image(pair$b)
  # The pair definition fixes the coarser native grid, including its origin.
  target <- if (pair$grid == 'b') b$projection() else a$projection()
  if (pair$grid == 'b') a <- a$reduceResolution(ee$Reducer$mean(), maxPixels = 4096L)$reproject(target)
  else b <- b$reduceResolution(ee$Reducer$mean(), maxPixels = 4096L)$reproject(target)
  list(image = a$rename('a')$addBands(b$rename('b')), projection = target)
}

sample_image <- function(image, points, bands, chunk_size = 250L) {
  # Small read-only requests: no uploads, Drive or Cloud Storage required.
  # first().forEachBand() preserves each band's own missing-data footprint.
  ee <- rgee::ee
  if (!nrow(points)) stop('No points to sample.')
  result <- vector('list', ceiling(nrow(points) / chunk_size))
  for (i in seq_along(result)) {
    ix <- seq.int((i - 1L) * chunk_size + 1L, min(i * chunk_size, nrow(points)))
    features <- lapply(ix, function(j) ee$Feature(ee$Geometry$Point(as.list(c(points$lon[j], points$lat[j]))), list(pid = as.integer(points$pid[j]))))
    fc <- ee$FeatureCollection(features)
    reducer <- ee$Reducer$first()$forEachBand(image)
    info <- image$reduceRegions(collection = fc, reducer = reducer, tileScale = 4L)$getInfo()
    rows <- lapply(info$features, function(f) {
      properties <- f$properties
      vals <- lapply(bands, function(k) if (is.null(properties[[k]])) NA_real_ else as.numeric(properties[[k]]))
      names(vals) <- bands
      as.data.frame(c(list(pid = as.integer(properties$pid)), vals), check.names = FALSE)
    })
    result[[i]] <- do.call(rbind, rows)
    message('Sampled ', max(ix), ' / ', nrow(points), ' points')
  }
  got <- do.call(rbind, result)
  merge(points, got, by = 'pid', all.x = TRUE, sort = FALSE)
}
get_pair_samples <- function(pair, mode, bbox = NULL, max_points = Inf) {
  if (!mode %in% c('saved', 'gee')) stop('mode must be saved or gee.')
  points <- read_input(if (pair$region == 'hbl') 'random_points_hudson_plain.csv' else 'random_points_canada.csv')
  points <- select_points(points, bbox, max_points)
  if (mode == 'saved') {
    d <- read_input(paste0('pair_samples_', pair$family, '.csv'))
    d <- d[match(points$pid, d$pid), , drop = FALSE]
    out <- points
    out$a <- d[[paste0('a__', pair$id)]]; out$b <- d[[paste0('b__', pair$id)]]
  } else {
    layers <- pair_layers(pair)
    out <- sample_image(layers$image, points, c('a', 'b'), if (pair$region == 'hbl') 100L else 250L)
    attr(out, 'comparison_projection') <- layers$projection$getInfo()
  }
  out
}

comparison_plots <- function(d, pair) {
  a <- pair$a_label; b <- pair$b_label; unit <- pair$unit
  scatter <- ggplot2::ggplot(d, ggplot2::aes(b, a)) +
    ggplot2::geom_point(alpha = 0.2, size = 0.6) + ggplot2::geom_abline(slope = 1, intercept = 0, linetype = 2) +
    ggplot2::coord_equal() + ggplot2::theme_bw() +
    ggplot2::labs(x = paste(b, unit, sep = '\n'), y = paste(a, unit, sep = '\n'), title = pair$quantity)
  difference <- ggplot2::ggplot(d, ggplot2::aes(a - b)) + ggplot2::geom_histogram(bins = 50, colour = 'white') +
    ggplot2::geom_vline(xintercept = 0, linetype = 2) + ggplot2::theme_bw() +
    ggplot2::labs(x = paste('A − B,', unit), y = 'Paired sample points', title = 'Distribution of differences')
  long <- rbind(data.frame(lon = d$lon, lat = d$lat, product = 'A', value = d$a),
                data.frame(lon = d$lon, lat = d$lat, product = 'B', value = d$b))
  maps <- ggplot2::ggplot(long, ggplot2::aes(lon, lat, colour = value)) + ggplot2::geom_point(size = 0.55) +
    ggplot2::facet_wrap(~product) + ggplot2::scale_colour_gradient(low = '#cde2fb', high = '#0d366b', name = unit) +
    ggplot2::coord_quickmap() + ggplot2::theme_bw() + ggplot2::labs(x = 'Longitude', y = 'Latitude', title = 'Paired sample values: A and B share one scale')
  delta <- ggplot2::ggplot(d, ggplot2::aes(lon, lat, colour = a - b)) + ggplot2::geom_point(size = 0.65) +
    ggplot2::scale_colour_gradient2(low = 'blue', mid = 'white', high = 'red', midpoint = 0, name = unit) +
    ggplot2::coord_quickmap() + ggplot2::theme_bw() + ggplot2::labs(x = 'Longitude', y = 'Latitude', title = 'A − B at sampled locations', subtitle = 'Red: A higher; blue: B higher. Blank space is not zero.')
  list(scatter = scatter, differences = difference, sampled_maps = maps, difference_map = delta)
}
new_run <- function(label, mode) {
  path <- file.path('outputs', paste(format(Sys.time(), '%Y%m%d_%H%M%S'), label, mode, sep = '_'))
  dir.create(path, recursive = TRUE, showWarnings = FALSE)
  for (f in c('pairs.json', 'products.csv', 'snapshot.json', 'input_checksums.json')) file.copy(f, path, overwrite = TRUE)
  writeLines(capture.output(sessionInfo()), file.path(path, 'sessionInfo.txt'))
  path
}
save_pair <- function(raw, pair, directory) {
  d <- eligible(raw, pair)
  grid <- attr(raw, 'comparison_projection')
  if (!is.null(grid)) jsonlite::write_json(grid, file.path(directory, paste0(pair$id, '_grid.json')), auto_unbox = TRUE, pretty = TRUE)
  stats <- cbind(pair[c('id', 'quantity', 'unit', 'a_label', 'b_label', 'datum', 'datum_status', 'note')], summarise_values(d$a, d$b))
  stats$n_requested <- nrow(raw); stats$n_missing_or_nonfinite <- sum(!is.finite(raw$a) | !is.finite(raw$b))
  stats$n_excluded_nonpositive_forest <- if (pair$domain == 'forest') sum(is.finite(raw$a) & is.finite(raw$b) & raw$a <= 0 & raw$b <= 0) else 0L
  utils::write.csv(raw, file.path(directory, paste0(pair$id, '_samples.csv')), row.names = FALSE, na = '')
  utils::write.csv(stats, file.path(directory, paste0(pair$id, '_statistics.csv')), row.names = FALSE, na = '')
  if (nrow(d)) {
    plots <- comparison_plots(d, pair)
    for (name in names(plots)) ggplot2::ggsave(file.path(directory, paste0(pair$id, '_', name, '.png')), plots[[name]], width = 8, height = 5, dpi = 150)
  }
  stats
}
