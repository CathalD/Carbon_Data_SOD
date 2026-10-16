# One table of agreement statistics for every comparison pair, read by the
# Comparisons page and offered as a download.
#
# Statistics per pair (points where both products have data; for forest pairs,
# points where both are zero are excluded as shared non-forest):
#   n, mean A, mean B, mean A - B, RMSD, Pearson r, Spearman rho, and the share
#   within +/-25% (|A - B| <= 0.25 x mean(A, B)) - a descriptive closeness
#   measure kept for download, not a ranking across pairs.
#
# Input : ../../data/derived/pair_samples_*.csv, pairs.json
# Output: ../../data/derived/comparison_statistics.csv
# Run   : Rscript 03_comparison_statistics.R

suppressPackageStartupMessages({ library(dplyr); library(readr); library(jsonlite); library(purrr) })

args <- commandArgs(trailingOnly = FALSE)
here <- dirname(normalizePath(sub("^--file=", "", args[grep("^--file=", args)])))
derived <- normalizePath(file.path(here, "..", "..", "data", "derived"))
pairs <- fromJSON(file.path(derived, "pairs.json"), simplifyDataFrame = TRUE)

stats <- map_dfr(unique(pairs$family), function(fam) {
  d <- read_csv(file.path(derived, paste0("pair_samples_", fam, ".csv")), show_col_types = FALSE)
  map_dfr(pairs$id[pairs$family == fam], function(pid) {
    a <- d[[paste0("a__", pid)]]; b <- d[[paste0("b__", pid)]]
    keep <- !is.na(a) & !is.na(b)
    if (pairs$domain[pairs$id == pid] == "forest") keep <- keep & (a > 0 | b > 0)
    a <- a[keep]; b <- b[keep]
    tibble(id = pid, n = length(a), mean_a = mean(a), mean_b = mean(b), mean_diff = mean(a - b),
           rmsd = sqrt(mean((a - b)^2)), pearson_r = cor(a, b), spearman_rho = cor(a, b, method = "spearman"),
           within_25pct = mean(abs(a - b) <= 0.25 * (a + b) / 2))
  })
}) |>
  left_join(pairs |> select(id, domain, quantity, unit, a_label, b_label, datum_status), by = "id") |>
  mutate(order = match(id, pairs$id)) |> arrange(order) |> select(-order) |>
  relocate(id, domain, quantity, a_label, b_label, unit, datum_status)

write_csv(stats, file.path(derived, "comparison_statistics.csv"))
message(sprintf("comparison_statistics.csv: %d pairs", nrow(stats)))
