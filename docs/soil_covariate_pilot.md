# Step 4 — small soil-covariate extraction pilot

Executed live in Earth Engine on **15 October 2026**, project `northstarlabs`.

**Workflow result: PASS. Modelling readiness: REVIEW before bulk processing.** Twenty selected profile rows returned with the expected 43 predictors, four observation-count QA fields and six metadata fields. Nineteen profiles have all predictors; one coastal profile lacks five climate values. This is a workflow/data-availability check, not a fitted-model accuracy assessment.

## Sample and method

Four profiles were selected from each of WoSIS v2, NPDB, NRCan peat (hosted under `canpeat`), Riley and Janousek. Selection used seed 20261015, stable source IDs and the lowest four uniform pseudo-random values per source. Carbon values were not used to select profiles.

Janousek was restricted to the **BC** source-region code (183 eligible rows); its full North American table has 1,284 rows. Other region codes were not assumed Canadian from a continental bounding rectangle. Four other source assets are Canadian preparations. The sample spans approximately 45.36–67.65°N and 72.21–134.28°W; it is not a representative validation sample for all of Canada.

The original notebook remains unchanged. [Runner](../scripts/07_Run_Soil_Covariate_Pilot.py) verifies notebook Git blob `b98e8b33f861e8b9dc1c1535fd78c165cde9c8f0` and executes only its helpers/stack cells, not its full-data selectors, bulk exporters, community validation or raster download cells. It substitutes a metadata-only allow-list of selected hosted profile points.

The pilot uses the original **2019–2023** windows, exact Canada Lambert 30 m transform, and **120 m/1000 m radii**. These are output/context supports, not proof that climate, source DEMs or uncertain field coordinates have 30 m precision. It tests the 47-band notebook baseline only, not every catalogue study-specific feature or the proposed 100/250 m stacks.

## Returned data

| Source | Selected/returned profiles | Complete predictor rows | Missing predictor cells |
|---|---:|---:|---:|
| WoSIS | 4/4 | 4 | 0 |
| NPDB | 4/4 | 4 | 0 |
| NRCan peat | 4/4 | 4 | 0 |
| Riley | 4/4 | 4 | 0 |
| Janousek — BC | 4/4 | 3 | 5 |
| **Total** | **20/20** | **19** | **5 of 860** |

**855/860 predictor cells are available (99.4% in this sample).** This is not a Canada-wide coverage estimate. All 80 observation-count QA cells are present. Counts range from 18–129 for spring Sentinel-2, 31–187 for summer Sentinel-2, 18–145 for Dynamic World and 49–436 for Sentinel-1.

All 20 source identifiers join to hosted soil-layer tables, matching **367 horizon rows**. Covariates were extracted once per profile; horizons are linked later by source ID. The joins do not prove that records are independent across compilations or that all horizons support a common stock integration depth.

The output has 20 rows × 53 columns. No carbon response values were exported, no stocks integrated, no Earth Engine asset created/overwritten and no full-dataset export task launched. Five synchronous four-profile shards took about 398 seconds in total, excluding graph setup and diagnostics.

## Findings to address before scaling

1. **Coastal climate coverage:** one BC coastal profile has all five ERA5-Land descriptors missing. A separate native-grid January 2019 mask check confirms its climate cell is masked; the other 19 locations are available. Keep these five values missing. A later model needs an explicit coastal coverage/exclusion or validated alternative-climate policy; do not silently borrow a nearby land cell.

2. **Radar temporal tails and median approximation:** three profiles trigger the descriptive review rule “linear VV/VH SD > 10 × its median.” This is a pilot diagnostic, not a published physical bound or automatic removal rule. At one NPDB profile, 429 observations include a ratio of **17,137.27** on 2 August 2020, with VV **24.07 dB** and VH **−18.27 dB**. Its exported temporal SD **825.9682** agrees with a direct population-SD calculation **825.96823**: the large spread is present in the acquisitions, not a CSV conversion error.

   The default exported ratio median is **11.19982**, while the direct acquisition median is **8.20532**. An explicit Earth Engine `ee.Reducer.median(maxRaw=10000)` check returns **8.20532** too. Earth Engine documents histogram-based medians above the reducer's raw-value threshold; this result supports approximation sensitivity in this high-dynamic-range example. [Official median reducer documentation](https://developers.google.com/earth-engine/apidocs/ee-reducer-median).

   Use an explicit median policy and assess robust/log-domain variability or acquisition QA in a **new stack version**, then rerun the affected pilot points. Do not relabel the archived baseline values as exact medians, assume the extreme acquisition is invalid without inspection, or silently clip it. Field dates and land-cover change matter at this old soil location.

3. **Field support and time:** 11 selected records have dates outside 2019–2023 and nine have unknown/indeterminate dates. WoSIS location uncertainty is 100 m–1 km or 1–10 km; one NPDB point reports 150 m confidence and another has poor location confidence. Riley's datum remains unverified; some other source precision is unrecorded. Extraction succeeds at these coordinates, but that does not establish precise contemporary training targets.

4. **Water and terrain interpretation:** JRC's three water descriptors follow the notebook's zero-fill convention; zero does not prove universal absence of water. Coastal CDEM elevations are not tidal elevations. Keep Janousek field tidal/estuary context distinct from generic DEM covariates.

No changes were applied to the baseline notebook, missing-value policy or sensor recipes during this run.

## Files and checks

The [aggregate summary](../data/catalogue/soil_covariate_pilot_summary.json) records source counts, per-band availability/ranges, date categories and review status. The existing [Google Sheet](https://docs.google.com/spreadsheets/d/14PeDcxAptEf7DOpgLtIN93S5dyVWewP6_hn5nvtTjKU/edit) has a **Pilot_QC** tab with the 20 selected profiles and review flags.

Detailed extracted CSV, selected-point GeoJSON, layer-join evidence, native climate coverage, acquisition diagnosis and run hashes are saved in the working workspace. Exact profile coordinates and row payload have not been published to GitHub; publication requires explicit approval following automatic review. In the local CSV, `-9999` is a missing-value sentinel, never a physical measurement; decode to NA before modelling.

Checks passed for row/identifier retention, expected schema, finite numeric encoding, observation counts, broad physical ranges, coordinate preservation and source-layer joins. Radar distribution/median checks and field/date/precision caveats remain visible. Published-model validity, geolocation truth, universal raster equivalence, 100/250 m recipes and full-Canada coverage were not tested.

## Reproduce

Use Python with `earthengine-api==1.6.11` (the version used here) and Google Application Default Credentials authorized for `northstarlabs`. Credentials are never part of the repository. The runner stops if the notebook blob has changed.

```sh
python scripts/07_Run_Soil_Covariate_Pilot.py --profiles /path/to/selected_profiles.geojson --output-dir /tmp/carbon_pilot_recheck
python scripts/07_Check_Pilot_Outputs.py --profiles /path/to/selected_profiles.geojson --results /tmp/carbon_pilot_recheck
```

With the local detailed archive, include the acquisition diagnosis when checking its CSV:

```sh
python scripts/07_Check_Pilot_Outputs.py --profiles /path/to/selected_profiles.geojson --results /path/to/pilot/results --radar-diagnostic /path/to/radar_ratio_diagnostic.json
```

The diagnostic argument validates archived diagnostic numbers; independently repeating native climate/acquisition requests requires the corresponding source/time/grid definitions recorded in the local diagnostic files. An implementation change needs a new output version and another targeted check. Community cores and circumpolar resources remain excluded.
