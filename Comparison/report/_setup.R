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
pair_maps <- if (file.exists(file.path(derived, "pair_maps", "pair_maps.json")))
  fromJSON(file.path(derived, "pair_maps", "pair_maps.json"), simplifyDataFrame = FALSE) else list()
names(pair_maps) <- vapply(pair_maps, `[[`, "", "id")
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

# HTML strip: A and B on a shared scale, then A - B.
pair_maps_html <- function(id) {
  m <- pair_maps[[id]]
  if (is.null(m)) return(HTML("<p class='text-muted'>Map figures not yet rendered.</p>"))
  rel <- function(f) file.path("..", "data", "derived", f)
  lg <- function(cls, lo, hi) sprintf("<div class='legend'><span>%s</span><div class='bar %s'></div><span>%s</span></div>", lo, cls, hi)
  fig <- function(tag, title, legend) {
    f <- m$files[[tag]]
    if (is.null(f)) return("")
    sprintf("<figure><img src='%s' alt='%s' loading='lazy'><figcaption><span class='t'>%s</span>%s</figcaption></figure>",
            rel(f), htmlEscape(title), htmlEscape(title), legend)
  }
  u <- m$unit
  HTML(paste0("<div class='pair-maps'>",
    fig("a", paste0("A · ", m$a_label), lg("seq", fmt_s(m$lo), paste(fmt_s(m$hi), u))),
    fig("b", paste0("B · ", m$b_label), lg("seq", fmt_s(m$lo), paste(fmt_s(m$hi), u))),
    fig("diff", "A − B", lg("div", paste0("−", fmt_s(m$dlim), " (B higher)"), paste0("+", fmt_s(m$dlim), " (A higher)"))),
    "</div>"))
}

diff_multiples_html <- function(ids, labels) {
  rel <- function(f) file.path("..", "data", "derived", f)
  items <- mapply(function(id, lab) {
    m <- pair_maps[[id]]
    if (is.null(m) || is.null(m$files$diff)) return("")
    sprintf("<figure><img src='%s' alt='Difference %s' loading='lazy'><figcaption>%s<br>±%s %s</figcaption></figure>",
            rel(m$files$diff), lab, lab, fmt_s(m$dlim), m$unit)
  }, ids, labels)
  HTML(paste0("<div class='small-multiples'>", paste(items, collapse = ""), "</div>"))
}

stats_table <- function(s, unit, digits = 3) {
  s |> transmute(
    Comparison = label, Points = fmt_n(n),
    `Mean A` = fmt_s(mean_a, digits), `Mean B` = fmt_s(mean_b, digits),
    `Mean A − B` = fmt_s(bias, digits), RMSD = fmt_s(rmsd, digits),
    r = sprintf("%.2f", r), `Within ±25%` = percent(within25, accuracy = 1)) |>
    kable(align = c("l", rep("r", 7)), caption = paste0("Units: ", unit, ". A minus B; RMSD = root-mean-square difference; r = Pearson correlation."))
}
