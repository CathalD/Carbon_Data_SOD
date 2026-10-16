# Simplifying Carbon State of Data

Audit date: 16 October 2026. Audience: researchers, analysts, policy and conservation practitioners. Preserve reproducibility, with technical methods separate from the main pages.

## Recommendation

Make this **one catalogue with a small set of comparisons**, presented through one Quarto site. Lead with the data available in Canada. Use the project’s ingestion and verification work to qualify those records, rather than making project progress the subject of the site.

Keep three main navigation items: **Data and summaries · Comparisons · How to use**. Within each, use **Forests** and **Soils**, each organised as **Ground data · Covariates · Maps**. Covariates means environmentally correlated variables used to describe conditions or support carbon estimation. Put **Methods**, **Downloads**, **Sources** and **Contribute** in secondary navigation. Reuse the existing R/Python analysis and Quarto styling. No new application framework, database, API or comprehensive modelling pipeline is needed.

This is the agreed content hierarchy. An overview is a short introduction within the first focus, rather than a fourth main destination. **How to use** remains visible as a placeholder for future Google Earth Engine (GEE) apps.

The most valuable simplification is removing duplicate sources of information. The current report and dashboard read an older workbook while the downloadable catalogue contains newer information. Hiding sections without resolving that split would leave a simpler-looking site with contradictory content.

## Audit scope and evidence

The audit accounts for all **185 tracked files** on `comparison-analysis` (`6d33582`, 50.13 MB), all **91 deployment files** on `gh-pages` (`72cea02`, 10.12 MB), and the local generated/untracked files outside `.git`. The remote `main` snapshot (`052a51b`) has 66 files; its paths are covered by the source inventory. Remote branch heads were checked again for this audit. No implementation changes or deletions were made by this audit.

The accompanying [file audit](file_audit.csv) gives each source, deployment and local generated file a disposition, reason and any prerequisite. Source membership in `main` is recorded. JSON files were parsed, CSV schemas and row counts inspected, workbook sheets compared with public exports, code/report dependencies traced, and deployment references checked. Generated libraries, images and shapefile components were assessed by role and dependency; this was not a new pixel-level validation of every raster or a rerun of all analyses. Git object history, parent-directory source databases and the restricted Google Sheet were outside this repository audit.

**Working changes observed during the audit:** the scientific correction work is already modifying the depth harmoniser, sampling, PEATGRIDS masks, derived tables and map rendering. The new untracked `analysis/gee/sampling.py` is a source dependency, not a disposable cache. `_setup.R` is moving toward maps summarised directly from comparison samples. Those edits were inspected for their architectural implications but are still in progress and were not validated here. The counts and published-image findings below describe the committed/deployed snapshots, not the partially regenerated tables. The CSV marks tracked files that changed locally.

If the new sample-based hexagon maps become the chosen display, they offer a further simplification: retire `03_pair_maps.py`, the complete `pair_maps/` PNG/JSON directory and its resource-copy rule after every report call is migrated. That would remove a separate Earth Engine rendering step and redundant map metadata. Keep the sample-based display labelled with its aggregation and minimum-count rule. Do not retain both rendering pipelines without a distinct reader need.

Concrete findings:

- The root README is **7,707 words**. It combines catalogue browsing, source summaries, extraction design, operational history and release status.
- The workbook has **200 covariate rows**, versus **217** in the public CSV. Compared with the workbook, the CSVs change five ground-resource depth descriptions, four map unit/scaling descriptions, six uncertainty definitions and 41 asset public-access fields. Both page builders still read the workbook.
- There are two presentation systems: the Quarto report and a separate 847-line D3 template, each with its own classifications, layout and data assembly.
- **16 of 45 pair-map PNGs** are copied into the deployed site but referenced by no published HTML page. They total **1,569,711 bytes**, about **15.5% of the deployed build**. They are the A/B maps for SOC and bulk density at 5–15, 15–30, 30–60 and 60–100 cm. Their difference maps are used.
- `artifact_page.html` is a **2.01 MB** alternate dashboard export with no current Quarto consumer.
- `profile_layers_harmonised.csv` is a **6.30 MB** intermediate written by the harmoniser and not read by the current reports or other tracked analysis scripts. It may still be useful for reproduction; archive it before stopping tracking, because the raw preparation files are outside the repository.
- The covariate notebook and 20-profile pilot form a separate prospective modelling workflow. They do not feed the published map comparisons. Published studies’ covariate descriptions remain useful metadata and should be retained.

## The three focuses and reader journey

| Main focus | What the reader should be able to do | Contents |
|---|---|---|
| 1. Data and summaries | Understand what carbon data exist in Canada and what they contain | Short introduction; Forests and Soils summaries; ground datasets, environmental covariates and maps; coverage, quantities, depth/pool, dates, units and access |
| 2. Comparisons | Understand how the data differ and what can be compared | The same Forests/Soils and Ground data/Covariates/Maps structure; concise findings; eligible quantitative comparisons; explicit gaps; expandable diagnostics |
| 3. How to use | Find practical tools for using the data | The same Forests/Soils and Ground data/Covariates/Maps structure, with clearly labelled placeholders for future GEE apps; existing source/download links remain usable |

Methods remain secondary and explain pair definitions, conversions, masks, grids, sampling, depth matching, shared training, uncertainty and limitations. Downloads and sources provide the current catalogue, pinned analysis snapshot, reproduction instructions and original citations.

### Repeat this structure within every focus

```text
Data and summaries / Comparisons / How to use
  Forests
    Ground data
    Covariates (environmentally correlated variables)
    Maps
  Soils
    Ground data
    Covariates (environmentally correlated variables)
    Maps
```

These are sections or anchors within three main pages, not a requirement to create 18 separate pages. Keep regional, peat, coastal and other ecosystem distinctions as labels within the relevant records; preserve distinct pools and quantities.

| Section | Data and summaries | Comparisons | How to use, for now |
|---|---|---|---|
| Forests — Ground data | Plot/tree measurements, support, coverage, dates, measured versus estimated quantities and access | Compare coverage, measurement definitions, dates and support; state where plot-to-map comparison is unavailable | Future GEE app placeholder for exploring forest observations |
| Forests — Covariates | Environmental variable families, source products, native grids, temporal coverage and documented study roles | Compare which variables studies use, their spatial/temporal support and the evidence for selection or importance | Future GEE app placeholder for exploring forest covariates |
| Forests — Maps | Biomass/carbon products, pool, year, extent, resolution, uncertainty and access | Eligible map-to-map comparisons and links to ground-data relationships | Future GEE app placeholder for exploring forest maps |
| Soils — Ground data | Profiles/cores/layers, variables, coverage, depth datum, dates, measured/estimated flags and access | Compare coverage, completeness and depth support; show eligible observations-to-map comparisons with training overlap visible | Future GEE app placeholder for exploring soil observations |
| Soils — Covariates | Environmental variable families, source products, grids, temporal coverage and study roles | Compare inputs and their support across soil/peat studies; distinguish documented inputs, retained variables and reported importance | Future GEE app placeholder for exploring soil covariates |
| Soils — Maps | Concentration, density, fixed-depth stock and full-column peat products, with units and depth/pool explicit | Group comparisons by quantity, depth, region and year; retain peat thickness and peat carbon separately | Future GEE app placeholder for exploring soil and peat maps |

For covariates, comparing documented inputs and support is already useful. It does not require running the archived extraction pilot, fitting a new model or claiming that correlation establishes predictive importance. Ground-data summaries and comparisons likewise remain useful where no eligible map comparison exists. Keep all six sections visible and state a specific evidence gap where necessary, rather than removing a section or manufacturing a result.

Use one cross-link for a relationship such as ground observations versus a map; do not duplicate the analysis under both sections. The hierarchy organises the explanation while the underlying data and calculations remain shared.

### How to use: placeholder scope

Show: **“GEE apps are planned. This section will provide tools to explore and use the ground data, environmental covariates and maps.”** Under Forests and Soils, retain the three labelled subsections with a short “App forthcoming” note. Link to existing provider downloads or working examples where relevant. App scope, release dates and interfaces remain to be defined; this plan adds no app implementation work.

Suggested opening text:

> **Carbon data for Canada**  
> Explore ground observations, environmental covariates and maps for Canadian forests and soils. See what the data contain, how they compare, and where to access them. GEE tools for using the data are planned.

Add one scope sentence: “Coverage is strongest for forest biomass and terrestrial soils; regional coastal, wetland and other resources are included where documented.” Do not imply an exhaustive inventory of every Canadian carbon dataset.

### A compact dataset record

Show these first: **name/version; quantity; Canadian coverage; grid or observation support; depth/pool; reference period; access; source link**. Place the unit next to the quantity. Provide a short “Use and limitations” sentence.

Expand for: training/validation sources and roles; measurement/model method; uncertainty definition; preprocessing and exact GEE asset/band; licence; verification date and evidence. Keep these fields in the underlying catalogue even when they are hidden in the default view.

Use filters for **ecosystem, data type, quantity, geographic coverage and access**. A simple text search plus these controls is sufficient. Start with a readable static table if necessary; filtering can be a small enhancement. Keep regional, coastal, grassland, marine and flux records discoverable. “Not ingested by this project” must never mean “unavailable to the reader”. Label fluxes, concentrations, thickness and biomass separately from carbon stocks.

Preserve existing IDs. Add explicit ecosystem/data-type labels where necessary instead of hardcoding lists of forest IDs and assigning everything else to soil. A presentation crosswalk can group multiple bands, uncertainty layers and versions under one dataset record without changing the underlying asset IDs. Do not publish a new headline dataset count until that counting rule is defined.

## Specific content cuts

| Current location/content | Decision | Replacement or destination |
|---|---|---|
| Homepage’s 15-row comparison table plus “Agreement by comparison” ranking | Remove from the introductory summary | Link to Comparisons and show 2–3 qualified findings. Different quantities, regions and masks should not look like one quality leaderboard. Full metrics remain in comparison details. |
| Separate “State of Data summary” navigation item | Merge into Data and summaries | One inventory, one set of source records, consistent navigation. Preserve its old URL as a small redirect after migration. |
| Dashboard “At a glance” project-ingestion matrix | Replace | Coverage and available data types. Remove “0 ingested” forest headline; public forest sources exist even though this project has not ingested plots. |
| Dashboard counts of studies, covariate entries, hosted assets and completed tasks | Remove from primary pages | Keep relevant release counts in technical metadata. These counts do not help choose a carbon dataset. |
| “Open work from the project TODO” and further-leads count chart | Remove | Keep outstanding work in one maintainer backlog. Put the actual further resources in the catalogue. |
| Forest “Placeholder” paragraph and future plot-comparison plan | Cut to one factual sentence | “No forest plot-to-map comparison is included in this release.” Retain available plot datasets in Data and summaries. Keep this evidence gap distinct from the future-app placeholders in How to use. |
| Forest and soil covariate-family heatmaps/counts | Replace duplicated count charts with one concise comparison | Keep Covariates visible in both domains and all three focuses. Summarise variable families, source grids, periods and study roles; keep exact evidence in details. Entry counts are not predictor importance. |
| Repeated native-covariate versus output-grid charts | Consolidate or omit | Resolution/support columns plus one plain-language method note. Retain a technical chart only if it supports a specific conclusion. |
| Two implementations of profile-location maps | Keep one | Reuse the static R figure in the observation catalogue, with its geographic and count qualifications. |
| Profile counts by ecozone | Move to observation details | Useful for sampling coverage, but not required before a reader can find a dataset. |
| Deepest-recorded-depth chart and complete-interval chart | Keep distinct, but expose one at a time | Catalogue: recorded depth support. Comparison methods: usable complete intervals. They measure different things and must not be merged numerically. |
| Layer-variable completeness heatmap | Condense | Per-dataset “SOC / density / stock available” fields, with measured/estimated qualifications. Retain detailed completeness in technical outputs if useful. |
| Sampling decade chart | Replace on main page | Date range and missing-date note per dataset. Preserve the distribution in downloadable summaries if needed. |
| Detailed depth-audit table and asset QC history | Move to Methods/verification | A specific limitation stays beside any affected comparison; raw logs do not belong in the main reading path. |
| Thirteen independent preview panels, including uncertainty maps | Reduce and attach to dataset records | One useful preview per dataset/quantity. Put uncertainty previews in details only where the statistic is defined. Retain clear per-panel legends. |
| SOC/BD A–B–difference strip followed by all-depth difference maps | Remove repeated 0–5 cm difference panel | One strip for a chosen default interval; an expanded depth view for remaining intervals. Do not silently average across depths. |
| SOC/BD distribution boxplots and selected-depth median table | Move to diagnostic details; remove duplicated median table | Retain source-specific distributions where needed to interpret differences, especially peat versus mineral soils. |
| Separate long “Products not compared” tables | Condense | State the main reasons once: quantity, depth/pool, year, region, spatial support, unresolved encoding. Link each affected dataset to its specific reason. |
| “What would make it comparable” ingestion/planning column | Move to backlog | The reader needs the reason for exclusion, not a to-do list for the maintainer. |
| Sothe unit/depth diagnosis from map ratios | Remove from public conclusions | Keep the product in the catalogue with source/import limitations. Hold its quantitative result outside the main comparison until identity and units are resolved. |
| Repeated generic caveats on every page | Consolidate | One short comparison note and linked Methods. Keep result-specific limitations directly beside the result. |
| Root README’s detailed dataset essays | Migrate unique facts, then remove duplication | Dataset details become the owning location. README becomes a roughly 400–600-word project entry point. |
| README extraction catalogue, pilot and proposed modelling sections | Move out of primary documentation | Preserve under a clearly labelled archived research workflow. |
| QC documents’ “first pass”, “partial output”, “further progress” narratives | Archive | Publish the latest check and what remains unresolved; preserve the chronological evidence separately. |

### Comparisons worth retaining

Keep the existing descriptive approach. Ground data, covariates and maps each have an explicit comparison section under Forests and Soils. Ground-data coverage/support comparisons and covariate input/support comparisons belong alongside the following quantitative map analyses. After the earlier scientific corrections, retain:

1. **Forest aboveground biomass:** SCANFI versus ESA CCI for the matched year. State explicitly that this is biomass, not total ecosystem carbon.
2. **Fixed-depth soil properties/stocks:** concentration at matched intervals and eligible stock comparisons. Bulk density is a supporting diagnostic, accessible in details. A matching depth label alone does not resolve organic-horizon or soil-fraction differences.
3. **Peat:** Li versus PEATGRIDS thickness and full-column carbon in their shared region, presented as separate quantities.
4. **Maps versus observations:** retain as a secondary comparison section, with eligibility, sample support and training overlap visible. Do not market it as independent validation.

For each pair, show **what is compared and why; region/year/depth/grid; one map strip; one sentence interpreting the result; mean A−B, RMSD and n**. Put scatter/hexbin plots, regional breakdowns, means A/B and correlation in details. “Within ±25%” can remain in the downloadable statistics if its purpose is justified, but remove it as the universal homepage score. Do not replace it with another composite ranking.

The complete depth series should remain available. The purpose is to shorten the default reading path, not discard scientifically distinct comparisons.

## File and analysis changes

The [file-by-file audit](file_audit.csv) is the complete disposition list. These are the consequential groups.

### Remove or stop producing

- **`Comparison/state_of_data_summary/artifact_page.html`:** delete the alternate generated export and its write call in `build_summary.py`. No current site consumer was found. Keep the published standalone page until its content has migrated.
- **16 unused A/B pair PNGs:** stop copying them to `gh-pages` now; retain source-side generated copies if useful for diagnosis. At the next regeneration, produce only requested display panels. Update the resource glob, manifest and generator together rather than deleting referenced manifest entries blindly.
- **`profile_layers_harmonised.csv`:** remove from the active tracked tree only after preserving a versioned snapshot or proving regeneration from documented inputs. It is a write-only intermediate in the current pipeline, not a report input.
- **Unused calculations:** `agree_stats()` computes `median_diff` but no current output consumes it. `build_summary.py` computes unused `bottom_hist`, `bottom_p90`, `bd_flags`, `cov_evidence` and `pixel_scope` payload fields. Remove those calculations/payload fields if retaining the builder during migration. `n_located` is also not consumed by the current template; retain it only if it becomes the chosen explicit coverage count.
- **Unused profile sampling:** `pg_carbon` and `li_carbon` are sampled into `profile_map_values.csv`, but the current profile report uses only peat thickness. Stop those two profile-carbon extractions unless adding a defined full-column observational comparison. Preserve the map-to-map peat-carbon analysis.
- **Local output:** `_site/`, `.quarto/`, execution logs and `.DS_Store` are disposable build/runtime artefacts. Keep them ignored; add a root ignore rule for `.DS_Store`. Do not manually maintain duplicates of the deployed build.

### Preserve but take out of the active public workflow

- **Covariate experiment:** `MultiScale_CovariateExtraction.ipynb`, both `07_*Pilot*.py` scripts, `docs/covariate_extraction_plan.md`, `docs/soil_covariate_pilot.md`, the extraction-plan/scale-profile/study-stack JSONs and CSVs, and `soil_covariate_pilot_summary.json`. Preserve their exact snapshot and dependency links under `archive/covariate-pilot/`, or in an immutable release archive. They are not prerequisites for browsing or reproducing the current comparisons.
- **Completed import work:** `03_Soil_Map_Catalogue.js`, `04_Copy_External_Soil_Maps.js`, `05_Copy_Li_HBL_Maps.js` and their execution manifests belong in maintenance/history, not reader quickstarts. Keep `06_Soil_Map_QC.js` and its input definitions available for future checks.
- **Dated evidence:** keep completed QC, metadata, access and download-verification records under dated verification runs. Partial/progress records and the earlier maintainer access report are historical evidence; stop presenting them as current status. The dashboard currently reads the completed pixel record, so extract the latest compact status before moving that dependency.
- **Older workbook:** preserve it as a dated source snapshot. It should not feed current pages or compete with newer metadata. Its `Source_archive` sheet contains provenance and must not be discarded with a presentation cleanup.
- **Release notes and manifests:** retain v0.1.0 and RC history as historical records. Do not edit old release claims to describe a new build. Produce one new manifest for the simplified release, distinguishing catalogue metadata, derived sample data and original field records.

### Keep as active inputs

- All six `pair_samples_*.csv` files are used through dynamically constructed filenames. **They are not unused**, despite having no literal filename references in some source searches.
- Keep `profile_intervals.csv`, `profile_map_values.csv`, `profile_locations.csv`, `peat_core_depths.csv`, `pairs.json` and the random point files. They support rendering, analysis or repeatable sampling. Keep them outside the public site bundle unless explicitly offered as downloads.
- Keep the ecozone geometry and required shapefile components together. `.sbn/.sbx` are optional indexes, but removing two tiny files is not a meaningful simplification. No format migration is necessary.
- Preserve uncertainty definitions, soil-method records, depth audits, training/validation relationships, exclusions, source citations and original data terms. Those are essential scientific context, even when moved behind the main pages.
- Keep both short public examples: Python and Earth Engine Code Editor serve different users. Link them from How to use as existing access aids while the GEE apps remain placeholders.

## One source of catalogue truth

For this release, use the **current public catalogue tables** as the starting point, after reconciling known corrections. They contain updates missing from the workbook. Keep `data/downloads/*.csv` as the canonical tabular snapshot initially; there is no need to rename every file to achieve this.

Make both the website and complete JSON download derive from those tables. If the collaborative Google Sheet remains the editing interface, require one explicit export/validation step into the committed snapshot. The public build must not need access to that Sheet. Do not manually edit the workbook, table JSONs, CSVs and HTML as four independent authorities.

Retain separate tables where the relationships are real: Studies, Ground_data, Study_ground, Maps, Assets, Other_sources, Soil_methods and QC_register. Preserve Covariates as an active catalogue table: its concise summaries and comparisons are primary content, while detailed variable recipes and source evidence are expandable. Remove project-only extraction planning tables from the default catalogue download; retain their archived release.

Source-specific JSONs such as Li/Sothe evidence may hold information absent from the CSVs. Preserve those unique facts as evidence records before retiring overlapping representations. A lack of direct code references is not sufficient grounds to delete scientific provenance.

Keep two separate facts in the data model: **provider access** and **project verification/comparison eligibility**. For example, a product can be openly downloadable yet not ingested here, or available in GEE but excluded because its depth is unresolved. Avoid one overloaded “ready” status or a new confidence score.

## Minimal repository structure

Keep the existing `Comparison/` directory during the first pass to avoid gratuitous path changes:

```text
README.md                         short entry point
CITATION.cff / CONTRIBUTING.md     citation and correction process
data/downloads/                   canonical current catalogue tables
data/catalogue/                   unique source evidence and current QC definitions
Comparison/
  _quarto.yml / assets/           one site configuration and stylesheet
  index.qmd                      Data and summaries: Forests / Soils, each with Ground data / Covariates / Maps
  compare.qmd                    Comparisons: same domain and data-type structure
  use.qmd                        How to use: same structure; future GEE app placeholders
  report/                        linked detail pages and methods, where needed
  analysis/                      existing R and Python scripts
  data/derived/                  versioned analysis inputs for rendering
  data/ecozones/                 analysis geometry
scripts/                         catalogue export and maintenance/QC tools
docs/                            reproduction and current maintenance guidance
examples/                        short access examples
references/                      citations
archive/                         older workbook, pilot, completed import/QC history
```

Archive can be an immutable release asset instead of another large in-tree copy. Choose one home for each archived snapshot. Do not duplicate the whole repository into an archive folder.

After migration, retire the standalone dashboard’s `template.html`, `build_summary.py`, `summary_data.json` and duplicate HTML output. Reuse any required profile-summary calculation and map-preview generator first. Keep the old dashboard URL as a redirect. Its thumbnails can become ordinary referenced images; base64-embedding the same data in multiple HTML files is unnecessary for GitHub Pages.

Use one default source branch after the cleanup is reviewed; retain `gh-pages` as generated output. There is no need for permanent parallel `main` and `comparison-analysis` versions of the public project. Keep existing release tags intact.

## Reproducibility with less maintenance

Separate **rendering the published snapshot** from **refreshing the analysis**:

- Rendering uses committed catalogue tables, derived sample tables and figures. It should require Quarto and the declared R packages, with no Earth Engine authentication and no files in the maintainer’s parent directory.
- Refreshing uses the R/Python analysis, original preparations and Earth Engine. Add a small input manifest with the source/version, expected filename/schema/hash, access route and local path setting. The current parent-directory assumptions and hardcoded `northstarlabs` project should become explicit settings.
- Record the source revision, catalogue snapshot, analysis configuration and generation date once per build. Keep all pages on that same snapshot.
- Replace the broad environment snapshot with a short dependency declaration for each actual workflow. The current Python requirements do not document the R/Quarto environment. Include directly used dependencies such as Pillow for thumbnail processing and hexbin for R hex plots where applicable. Keep the archived notebook’s environment separate. A small script and documented commands are enough; a workflow orchestration framework is unnecessary.
- Add only useful checks: unique/joinable IDs, required quantity/unit/depth/version fields, matched catalogue counts, no missing site resources, no unresolved-unit result included as a settled comparison, and a clean snapshot render. Keep targeted numerical checks for conversions, masks and aggregation. Avoid tests that merely restate a table’s contents.

## Implementation order and completion criteria

| Order | Work | Done when |
|---|---|---|
| 1 | Reconcile the catalogue and define the source snapshot | Pages and downloads use the same records; workbook/CSV differences are resolved or preserved explicitly; IDs and unique source facts are retained |
| 2 | Apply the earlier scientific corrections | PEATGRIDS masks, sampling footprint, map aggregation, density units and depth eligibility are corrected; affected analyses are regenerated |
| 3 | Reorganise the existing pages | Three main focuses are visible: Data and summaries, Comparisons, How to use. Each contains Forests and Soils, each with Ground data, Covariates and Maps. App sections are placeholders; technical detail is secondary |
| 4 | Remove duplication and unused output | Alternate fragment, unused published PNGs, duplicate chart/table views and public TODO/pilot sections are gone; old URLs resolve |
| 5 | Archive completed/experimental work | Every archived dependency has a stable home; the current build no longer reads old snapshots; reproduction inputs remain obtainable or clearly identified |
| 6 | Render and publish a coherent release | Clean-clone snapshot build succeeds; desktop/mobile navigation works; all internal/download/source links resolve; one version/date is visible throughout |

A reader should be able to follow the same Forests/Soils and Ground data/Covariates/Maps structure from summaries to comparisons to the future tools section. They should be able to identify a dataset’s quantity, Canadian coverage, depth/pool, year and access route without reading Methods. A researcher should be able to reach the exact comparison definition, source evidence and reproduction instructions from the same record. That is the test of whether the simplification has worked.
