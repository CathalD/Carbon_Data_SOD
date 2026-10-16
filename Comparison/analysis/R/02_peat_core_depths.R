# Peat thickness recorded at NRCan peat cores, for comparison with the
# modelled peat-thickness maps (PEATGRIDS nationally, Li et al. in the HBL).
#
# ORG_DEPTH is the provider's per-core organic (peat) depth in cm; it is the
# same on every layer row of a core, so the first value per core is taken.
# Cores flagged as permafrost are kept and labelled. The deepest sampled layer
# is also kept: where it is shallower than ORG_DEPTH the core did not reach
# the peat base, which is expected and not an error.
#
# Output: ../../data/derived/peat_core_depths.csv
# Run   : /Library/Frameworks/R.framework/Resources/bin/Rscript 02_peat_core_depths.R

suppressPackageStartupMessages({ library(dplyr); library(readr) })

args <- commandArgs(trailingOnly = FALSE)
here <- dirname(normalizePath(sub("^--file=", "", args[grep("^--file=", args)])))
local_dir <- normalizePath(file.path(here, "..", "..", "..", ".."))
out_dir <- file.path(here, "..", "..", "data", "derived")

read_csv(file.path(local_dir, "canpeat_layers_v1.csv"), show_col_types = FALSE, guess_max = 1e5) |>
  group_by(profile_uid) |>
  summarise(org_depth_cm = first(ORG_DEPTH), deepest_layer_cm = max(lower_depth, na.rm = TRUE),
            permafrost = any(PERMAFROST == "Y", na.rm = TRUE), year = first(Year), .groups = "drop") |>
  mutate(dataset = "NRCan peat") |>
  write_csv(file.path(out_dir, "peat_core_depths.csv"))
message("peat core depths written")
