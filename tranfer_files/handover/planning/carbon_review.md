# Carbon State of Data — scientific and publishing review

Reviewed 16 October 2026. Review only: no repository files or published pages were changed.

**Assessment:** the current GitHub Pages build works and the presentation is readable. Before treating the comparisons as settled results, correct the PEATGRIDS mask, sampling support, map aggregation and unverified field-density units. These are focused corrections; the site does not need a redesign.

## What was reviewed

The local analysis, prepared profile tables, provider documentation, four live PEATGRIDS pixel checks, and the published site. Remote branches checked: `main` at `052a51b`, `comparison-analysis` at `6d33582`, and `gh-pages` at `72cea02`. The report source is on `comparison-analysis`; `gh-pages` contains the rendered site. [The deployment succeeded](https://github.com/CathalD/Carbon_Data_SOD/actions/runs/38904491905).

## Findings to address before presenting results

### 1. PEATGRIDS dark areas are a missing-data rendering error

The preview selects `C_STOCK_MGC_PER_M2 / C_STOCK_MgC_per_m2_MEAN`. This is **carbon stock over the full modelled peat column**, in Mg C/m². PEATGRIDS also supplies thickness separately as `THICKNESS_CM / THICKNESS_CM_MEAN`, in cm. The stock conversion **×1,000 to kg C/m² is correct**. The separate total-carbon-per-pixel product must not be substituted for areal stock. [Provider metadata](https://zenodo.org/records/15070037/files/metadata_PEATGRIDS_v_2_1.txt?download=1)

At Southern Ontario (−80.5, 43.5), the Prairies (−106, 50), and Baffin Island (−70, 69), live pixels had NaN values but a mask of 1. They rendered as RGB (13, 54, 107), the darkest colour. A Hudson Bay Lowlands check (−83.5, 53.5) returned a valid 0.08482 Mg C/m² and 181.35 cm thickness. Thus the suspicious dark areas cannot be interpreted as high carbon.

Apply `image.updateMask(image.gte(0))` to these nonnegative PEATGRIDS variables **before statistics, aggregation, sampling and visualisation**. The [community catalogue example](https://gee-community-catalog.org/projects/peatgrids/) uses this mask too. Keep missing data distinct from zero. The supplied [diagnostic figure](peatgrids_display_check.png) retains the original carbon colour limits, making the mask effect directly visible.

Relevant source: [preview rendering](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/state_of_data_summary/gee_map_previews.py#L105), [product conversion](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/analysis/gee/common.py#L96), and [profile group construction](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/analysis/gee/02_sample_profiles.py#L69). The latter bypasses `converted()`, so fixing only that helper would leave profile sampling untreated. Regenerate affected outputs after correction; the impact on reported statistics has not been quantified here.

### 2. Sampling imposes an undocumented shared footprint across depths

`family_image()` concatenates all SOC or density depth pairs before `sampleRegions()`. Earth Engine excludes a sampled pixel when any band is masked. The current outputs consequently have identical validity across all ten SOC columns (17,121/30,000 locations) and all ten density columns (17,119/30,000). Profile sampling similarly couples SOC, density and stock availability within each product group. This means a valid shallow observation can be lost because another depth or variable is missing. [Earth Engine sampling behaviour](https://developers.google.com/earth-engine/apidocs/ee-image-sampleregions)

Sample each comparison pair on its explicit target projection, and each profile variable independently, retaining missing values for the appropriate pair. Alternatively, retain a common footprint deliberately and state that design prominently. The current prose describes pairwise overlap, so pair-specific sampling is the simpler match. Recompute sample counts and agreement summaries. [Pair sampler](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/analysis/gee/01_sample_pairs.py#L61)

### 3. Map figures do not explicitly implement the aggregation described

`03_pair_maps.py` obtains native converted images and subtracts them directly. It does not call `pair_image()` or explicitly mean-aggregate to its stated display grid. Earth Engine projection and pyramid behaviour therefore determine the rendered result; the code does not establish the same comparison support as the numerical summaries.

Use the already-defined `pair_image()` for both maps and their difference, then explicitly aggregate for display if needed. Keep the pairwise validity mask and displayed eligibility rules consistent with the statistics. Revise the caption to describe the actual operation. [Map generation](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/analysis/gee/03_pair_maps.py#L63)

### 4. Riley density is included despite unverified units

The harmoniser passes `dry_bulk_density_source` directly into the common density variable while commenting that its units are unverified. The derived intervals contain 1,583 Riley density entries; 342 Riley profiles have density-map values. These should not be displayed as verified g/cm³ measurements.

Keep Riley in the inventory, but exclude its density from quantitative agreement results until the source unit is confirmed. Do not infer the conversion from its numerical range. [Harmonisation lines 55–58](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/analysis/R/01_profile_intervals.R#L55)

### 5. Matching depth labels is necessary but insufficient

NPDB depths are shifted by the minimum top depth in each profile. Of 9,017 profiles, 3,712 start negative, 5,303 at zero and two above zero. Moving the organic surface to zero changes the datum for comparison with mineral-soil depth products. SoilGrids documentation says organic layers above mineral soil were removed in its preparation. These differences need an explicit eligibility rule, even when both outputs say “0–30 cm”. Coarse-fragment treatment and the definition of bulk density also matter to stock equivalence. [SoilGrids documentation](https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html)

Keep fixed-depth mineral-soil stocks, organic-inclusive stocks, and full-column peat stocks visibly distinct. The Li–PEATGRIDS thickness and full-column carbon pairs are sensible categories, provided the extent masks and processing are corrected. Do not combine full peat columns with 0–1 m stock rankings.

## Unit audit

The factors below are dimensionally correct and agree with provider documentation. This verifies the intended conversions; it does **not** establish that every private imported asset exactly matches the cited release. Preserve the repository’s unresolved import checks, particularly Geng and Sothe.

| Quantity/product | Source unit → comparison unit | Finding |
|---|---|---|
| SoilGrids SOC concentration | dg/kg ÷ 10 → g/kg | Correct |
| Geng SOC concentration | % × 10 → g/kg | Correct provider factor; exact imported encoding still pending |
| SoilGrids bulk density | cg/cm³ ÷ 100 → g/cm³ | Correct; kg/dm³ and g/cm³ are numerically identical |
| Geng bulk density | g/cm³ → g/cm³ | Correct provider factor; imported encoding pending |
| SoilGrids OC stock | t/ha ÷ 10 → kg C/m² | Correct |
| NCSCD gridded OC stock | hg C/m² ÷ 10 → kg C/m² | Correct raster convention; do not assume vector products use the same convention |
| SoilGrids OC density | hg/m³ ÷ 10 → kg C/m³ | Volumetric density, not areal stock; depth integration is required |
| PEATGRIDS carbon stock | Mg C/m² × 1,000 → kg C/m² | Correct; full modelled peat column |
| PEATGRIDS and Li peat thickness | cm → cm | Correct intended units; divide by 100 only if displaying metres |
| Li peat carbon | kg C/m² → kg C/m² | Correct study unit; full modelled peat column |
| Sothe soil stock | kg C/m² → kg C/m² | Source archive identifies top 1 m; exact identity/encoding of hosted `sc_250m_v20` still needs verification |
| SCANFI and ESA CCI aboveground biomass | tonnes/ha = Mg/ha | Correct; biomass is not carbon mass |
| McMaster forest carbon | kg C/m² | A carbon product containing multiple pools; not interchangeable with aboveground biomass |
| NPDB and NRCan layer stocks | Mg C/ha ÷ 10 → kg C/m² | Correct dimensional conversion; retain source-specific construction caveats |
| Riley bulk density | Unverified → proposed g/cm³ | Not cleared for comparison |

Sources: [SoilGrids](https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html), [Geng/CanSIS](https://sis.agr.gc.ca/cansis/nsdb/psm/index.html), [NCSCD rasters](https://bolin.su.se/data/ncscd/tiff.php), [PEATGRIDS metadata](https://zenodo.org/records/15070037/files/metadata_PEATGRIDS_v_2_1.txt?download=1), [Li paper](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024GL110679), [Sothe archive](https://data.4tu.nl/datasets/b8073f2c-1dc0-4a1a-98b0-19abf6cb7193/2), [SCANFI](https://developers.google.com/earth-engine/datasets/catalog/projects_gcpm041u-lemur_assets_scanfi_v12_SCANFI_v1_2), [ESA biomass](https://climate.esa.int/en/projects/biomass/data/).

### Field-stock arithmetic

For density in g/cm³ and thickness in cm:

- `C(g/kg) × density × thickness / 100` gives kg C/m².
- `C(%) × density × thickness / 10` gives kg C/m².

These expressions assume appropriate density/volume definitions; they do not supply a missing coarse-fragment correction. All 102 complete WoSIS rows in the current v2 table reproduce the first expression, and all 23,017 complete Janousek rows reproduce the second, to floating-point precision. NRCan provider stocks are close to the corresponding Mg/ha expression across 36,665 complete rows, but are not exactly identical; preserve the provider values and document their construction.

The legacy external `01_WOSIS…R` preparation script still contains `/10` for g/kg input, which would be ten times too high in kg/m². The currently consumed v2 CSV is corrected. Ensure the corrected preparation is the documented regeneration path. Janousek’s 182 recorded thickness/boundary discrepancies also need resolution or exclusion before strict depth integration. Arithmetic agreement alone does not settle those interval problems.

Uncertainty requires a separate label: an SD, a quantile interval and a relative uncertainty index are not interchangeable. SoilGrids' uncertainty index is dimensionless, not a stock SD. An uncertainty image with a median above the stock median does not by itself prove a unit error.

## Communication and GitHub Pages

- **Deployment and layout pass the checks performed.** The homepage, soil report and summary rendered successfully. Homepage and summary at 390 px had no page-level horizontal overflow; the desktop soil report loaded all 43 images. The published HTML link/asset audit found no missing local targets. Wide tables can scroll within their containers. Earlier redirect/missing-page concerns are resolved in the current branch.
- **Fix source links.** Quarto’s “View source” and the footer point into `main/Comparison`, but that directory is on `comparison-analysis`. Set `repo-branch: comparison-analysis` and update the footer, or move the source before switching those links. [Configuration](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/_quarto.yml)
- **Refresh the summary snapshot.** It embeds old “Not public ACL” statuses and hardcodes “None … has a public read grant yet”, while the current register records public ACLs for all 30 assets. Rebuild the embedded data and derive the sentence from that data. Replace “today” and “live” with a generation timestamp and source revision. [QC sentence](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/state_of_data_summary/template.html#L801)
- **Preserve training versus validation roles.** The forest callout collects linked ground resources without filtering roles, then says the maps were “built on” them. Separate training inputs from external validation; shared validation data do not establish shared training. [Callout](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/state_of_data_summary/template.html#L512)
- **Remove distribution-based unit diagnoses.** The Sothe flags and ratio interpretation suggest that high values establish a unit/depth problem. Use source metadata and imported-file identity to settle that question. Suggested wording: “The difference warrants checking source identity, depth definition and processing; agreement alone cannot verify units.” [Preview flags](https://github.com/CathalD/Carbon_Data_SOD/blob/6d33582/Comparison/state_of_data_summary/build_summary.py#L88)
- **Keep essential qualifications visible.** Use “20,690 profile records, including 1,130 outside Canada; not deduplicated” near the headline. The total is reproducible, but is not a count of independent Canadian sites. Separate “stock available” from “stock computable” where the current metric mixes them. Show organic-layer/depth qualifications beside charts rather than only on hover.
- **Make chart details work by keyboard and touch.** Several focusable SVG charts have only mouse-move tooltip handlers. Reuse the lineage chart’s focus/blur pattern and add tap support. The static summary also depends on external D3; a load-failure message or local copy would avoid a mostly empty page if that dependency fails.

## Recommended order

1. Correct PEATGRIDS validity handling and exclude unverified Riley density.
2. Make sampling and displayed maps use the stated comparison support; rerun affected results.
3. Resolve depth-datum eligibility and preserve source/import uncertainty explicitly.
4. Rebuild the summary, correct source links and make the small wording/accessibility fixes.

No national totals or replacement agreement statistics were computed in this review. The diagnostic maps test the confirmed rendering issue; they are not a new peat extent validation.
