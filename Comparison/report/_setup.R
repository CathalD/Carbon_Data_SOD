# Shared setup for the comparison report pages.
# Everything here reads files committed under Comparison/data, so the site can
# be re-rendered without Earth Engine access.

suppressPackageStartupMessages({
  library(dplyr)
  library(tidyr)
  library(readr)
  library(ggplot2)
  library(scales)
  library(sf)
  library(readxl)
  library(jsonlite)
  library(knitr)
  library(htmltools)
  library(patchwork)
})

# Pages render from Comparison/ (index) or Comparison/report/ (sections).
comp_dir <- if (file.exists("_quarto.yml")) normalizePath(".") else normalizePath("..")
data_dir <- file.path(comp_dir, "data")
derived <- file.path(data_dir, "derived")
repo_dir <- normalizePath(file.path(comp_dir, ".."))
xlsx <- file.path(repo_dir, "Carbon State of Data Summary Sheet.xlsx")

knitr::opts_chunk$set(fig.align = "left", out.width = "100%", dev = "png", dpi = 144)

# ---------------------------------------------------------------- look
pal <- list(
  ink = "#141916", ink2 = "#4a524c", muted = "#7c847d", rule = "#dcdfd6", surface = "#fbfbf8",
  forest = "#2d6a3b", soil = "#8a5a2b", s1 = "#2a78d6", s2 = "#eb6834", s3 = "#1baf7a",
  s4 = "#eda100", s5 = "#e87ba4", s6 = "#008300",
  seq = c("#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"),
  div = c("#104281", "#3987e5", "#9ec5f4", "#f0efec", "#f2a7a6", "#e34948", "#8f1d1c")
)
# Fixed categorical order for the five profile datasets (colour follows the dataset, never rank).
dataset_levels <- c("WoSIS", "NPDB", "NRCan peat", "Janousek", "Riley")
dataset_cols <- setNames(c(pal$s1, pal$s2, pal$s3, pal$s4, pal$s5), dataset_levels)

theme_sod <- function(base = 11) {
  theme_minimal(base_size = base, base_family = "") %+replace%
    theme(
      plot.title = element_text(face = "bold", size = rel(1.05), hjust = 0, margin = margin(b = 4)),
      plot.subtitle = element_text(colour = pal$ink2, hjust = 0, margin = margin(b = 8)),
      plot.caption = element_text(colour = pal$muted, hjust = 0, size = rel(0.8)),
      axis.title = element_text(colour = pal$ink2, size = rel(0.9)),
      axis.text = element_text(colour = pal$muted),
      panel.grid.major = element_line(colour = "#e6e8e1", linewidth = 0.3),
      panel.grid.minor = element_blank(),
      strip.text = element_text(face = "bold", hjust = 0, colour = pal$ink, margin = margin(b = 4, t = 4)),
      legend.position = "top", legend.justification = "left",
      legend.title = element_text(colour = pal$ink2, size = rel(0.85)),
      legend.text = element_text(colour = pal$ink2, size = rel(0.85)),
      plot.background = element_rect(fill = "white", colour = NA),
      panel.spacing = unit(10, "pt")
    )
}
theme_set(theme_sod())

fmt_n <- function(x) format(round(x), big.mark = ",", trim = TRUE)
fmt_s <- function(x, d = 3) ifelse(is.na(x), "–", formatC(signif(x, d), format = "fg", big.mark = ","))

# ---------------------------------------------------------------- data
pairs <- fromJSON(file.path(derived, "pairs.json"), simplifyDataFrame = TRUE)
exclusions <- read_csv(file.path(data_dir, "comparison_exclusions.csv"), show_col_types = FALSE)

ecozones <- local({
  ez <- st_read(file.path(data_dir, "ecozones", "Ecozones", "ecozones.shp"), quiet = TRUE)
  ez$ecozone <- gsub("MixedWood", "Mixedwood", gsub("PLain", "Plain", ez$ZONE_NAME))
  ez |> st_transform(3978) |> st_make_valid() |> group_by(ecozone) |> summarise(.groups = "drop") |>
    st_simplify(dTolerance = 3000, preserveTopology = TRUE)
})

# Long table of sampled pair values: one row per point x pair.
read_pair_samples <- function(family) {
  f <- file.path(derived, paste0("pair_samples_", family, ".csv"))
  if (!file.exists(f)) return(NULL)
  d <- read_csv(f, show_col_types = FALSE)
  ids <- pairs$id[pairs$family == family]
  bind_rows(lapply(ids, function(pair_id) {
    tibble(pid = d$pid, lon = d$lon, lat = d$lat, ecozone = d$ecozone, id = pair_id,
           a = d[[paste0("a__", pair_id)]], b = d[[paste0("b__", pair_id)]])
  })) |> filter(!is.na(a), !is.na(b))
}

# Agreement statistics. "Within 25%" = |A - B| <= 0.25 x mean(A, B).
agree_stats <- function(d) {
  d |> summarise(
    n = n(), mean_a = mean(a), mean_b = mean(b), bias = mean(a - b), median_diff = median(a - b),
    rmsd = sqrt(mean((a - b)^2)), r = suppressWarnings(cor(a, b)),
    within25 = mean(abs(a - b) <= 0.25 * (a + b) / 2), .groups = "drop")
}

# ---------------------------------------------------------------- figures
hex_pair <- function(d, unit, a_lab, b_lab, bins = 60, limits = NULL, facet = NULL) {
  lim <- limits %||% as.numeric(quantile(c(d$a, d$b), c(0, 0.995), na.rm = TRUE))
  g <- ggplot(d, aes(b, a)) +
    geom_hex(bins = bins) +
    geom_abline(slope = 1, intercept = 0, colour = pal$ink, linewidth = 0.4, linetype = "22") +
    scale_fill_gradientn(colours = pal$seq, trans = "log10", name = "points", labels = label_comma()) +
    coord_equal(xlim = lim, ylim = lim) +
    labs(x = paste0(b_lab, " (", unit, ")"), y = paste0(a_lab, " (", unit, ")"))
  if (!is.null(facet)) g <- g + facet_wrap(facet, nrow = 1)
  g
}

ecozone_bias <- function(d, unit, a_lab, b_lab, min_n = 30) {
  s <- d |> group_by(ecozone) |>
    summarise(n = n(), med = median(a - b), q1 = quantile(a - b, 0.25), q3 = quantile(a - b, 0.75), .groups = "drop") |>
    filter(n >= min_n, !is.na(ecozone)) |>
    mutate(ecozone = reorder(ecozone, med))
  ggplot(s, aes(med, ecozone)) +
    geom_vline(xintercept = 0, colour = pal$ink2, linewidth = 0.4) +
    geom_segment(aes(x = q1, xend = q3, yend = ecozone), colour = pal$s1, alpha = 0.45, linewidth = 2.2, lineend = "round") +
    geom_point(size = 2.6, colour = pal$s1, fill = pal$s1, stroke = 0.8, shape = 21) +
    geom_text(aes(x = pmax(q3, med), label = paste0("n=", fmt_n(n))), hjust = -0.25, size = 2.8, colour = pal$muted) +
    scale_x_continuous(expand = expansion(mult = c(0.05, 0.18))) +
    labs(x = paste0(a_lab, " minus ", b_lab, " (", unit, ")"), y = NULL,
         caption = "Point = median difference; bar = interquartile range of sampled pixels. Ecozones with fewer than 30 points omitted.")
}

# ---------------------------------------------------------------- hexagon maps
# Maps are drawn from the SAME comparison-grid samples as the statistics: each
# hexagon shows the mean of the sampled pixels inside it (A, B and A - B), using
# only points where both products are valid. The aggregation is explicit and
# the eligibility rules match the numbers in the tables.
canada_3978 <- st_union(ecozones)
hudson_3978 <- ecozones |> filter(ecozone == "Hudson Plain") |> st_union()

hex_summary <- function(d, region, cellsize, min_n) {
  hex <- st_make_grid(region, cellsize = cellsize, square = FALSE) |> st_sf(geometry = _) |>
    mutate(hex = row_number())
  pts <- st_as_sf(d, coords = c("lon", "lat"), crs = 4326) |> st_transform(3978)
  joined <- st_join(pts, hex, join = st_within) |> st_drop_geometry()
  agg <- joined |> filter(!is.na(hex)) |> group_by(across(any_of(c("id", "hex")))) |>
    summarise(n = n(), a = mean(a), b = mean(b), diff = mean(a - b), .groups = "drop") |>
    filter(n >= min_n)
  hex |> inner_join(agg, by = "hex")
}

hex_map_theme <- theme(axis.text = element_blank(), panel.grid = element_blank(), panel.grid.major = element_blank(),
                       legend.position = "bottom", legend.title = element_text(size = rel(0.8), vjust = 0.8),
                       legend.key.width = unit(26, "pt"), legend.key.height = unit(6, "pt"),
                       plot.title = element_text(size = rel(0.95)))

hex_trio <- function(d, unit, a_lab, b_lab, region = canada_3978, cellsize = 100000, min_n = 5) {
  h <- hex_summary(d, region, cellsize, min_n)
  lim <- as.numeric(quantile(c(h$a, h$b), c(0.02, 0.98), na.rm = TRUE))
  dlim <- as.numeric(quantile(abs(h$diff), 0.95, na.rm = TRUE))
  bb <- st_bbox(region)
  base <- function() list(geom_sf(data = st_sf(geometry = region), fill = "#eef0ea", colour = NA),
                          coord_sf(xlim = bb[c(1, 3)], ylim = bb[c(2, 4)], datum = NA))
  seq_fill <- scale_fill_gradientn(colours = pal$seq, limits = lim, oob = squish, name = unit, breaks = scales::breaks_pretty(3))
  pa <- ggplot() + base() + geom_sf(data = h, aes(fill = a), colour = NA) + seq_fill + labs(title = paste("A ·", a_lab))
  pb <- ggplot() + base() + geom_sf(data = h, aes(fill = b), colour = NA) + seq_fill + labs(title = paste("B ·", b_lab))
  pd <- ggplot() + base() + geom_sf(data = h, aes(fill = diff), colour = NA) +
    scale_fill_gradientn(colours = pal$div, limits = c(-dlim, dlim), oob = squish, name = unit, breaks = scales::breaks_pretty(3)) +
    labs(title = "A − B", subtitle = "red: A higher · blue: B higher")
  (pa | pb | pd) & hex_map_theme
}

hex_diff_facets <- function(d, unit, labels, region = canada_3978, cellsize = 100000, min_n = 5) {
  h <- hex_summary(d, region, cellsize, min_n) |> mutate(panel = factor(labels[id], unname(labels)))
  dlim <- as.numeric(quantile(abs(h$diff), 0.95, na.rm = TRUE))
  bb <- st_bbox(region)
  ggplot() + geom_sf(data = st_sf(geometry = region), fill = "#eef0ea", colour = NA) +
    geom_sf(data = h, aes(fill = diff), colour = NA) +
    scale_fill_gradientn(colours = pal$div, limits = c(-dlim, dlim), oob = squish, name = paste("A − B,", unit)) +
    facet_wrap(~panel, nrow = 1) + coord_sf(xlim = bb[c(1, 3)], ylim = bb[c(2, 4)], datum = NA) + hex_map_theme
}

hex_caption <- function(cellsize, min_n) sprintf(
  "A and B share one colour scale. Each hexagon (%d km across) shows the mean of the sampled comparison-grid pixels inside it, using only points where both products have data; hexagons with fewer than %d points are left blank. These are the same points as the statistics.",
  round(cellsize / 1000), min_n)

datum_pill <- function(status) {
  cls <- c(matched = "ok", `to verify` = "prov", `may differ` = "prov", `pools differ` = "prov")[status]
  label <- c(matched = "matched", `to verify` = "datum to verify", `may differ` = "datum may differ", `pools differ` = "pools differ")[status]
  sprintf("<span class='pill %s'>%s</span>", ifelse(is.na(cls), "", cls), ifelse(is.na(label), status, label))
}

stats_table <- function(s, unit, digits = 3) {
  s |> transmute(
    Comparison = label, Points = fmt_n(n),
    `Mean A` = fmt_s(mean_a, digits), `Mean B` = fmt_s(mean_b, digits),
    `Mean A − B` = fmt_s(bias, digits), RMSD = fmt_s(rmsd, digits),
    r = sprintf("%.2f", r), `Within ±25%` = percent(within25, accuracy = 1)) |>
    kable(align = c("l", rep("r", 7)), caption = paste0("Units: ", unit, ". A minus B; RMSD = root-mean-square difference; r = Pearson correlation."))
}
