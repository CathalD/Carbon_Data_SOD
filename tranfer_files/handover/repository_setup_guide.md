# Building the company repository

## 1. Add the prepared files

Download and extract [company-repository.zip](company-repository.zip). In the company repository, choose **Add file → Upload files** and upload all extracted files and folders to the repository root. If files already exist, review the replacements before saving. Follow the company's normal branch and review process.

Alternatively, create/edit `README.md`, `docs/summaries.md` and `docs/comparisons.md` on GitHub and paste their Markdown. The figures still need to be uploaded under `docs/images/summaries/`.

Do not copy `.git`, rendered-site caches or analysis logs. This package does not contain them.

## 2. Review the content

Open the README and check the dropdown tables and page links. Open the summaries and comparisons pages and check that figures display. The summaries page contains example figures and explicit unfinished panels. Open the downloaded `summaries-preview.html` in a browser to explore the proposed interactive layout; it is a separate layout preview.

Use the same structure throughout: **Data and summaries · Comparisons · How to use**, with **Forests / Soils → Ground data / Covariates / Maps** in each. Keep detailed methods separate from the main reading path. The How to use placeholder, methods and downloads pages are included. GEE apps and the final company website configuration remain to be prepared.

Keep the source citations, revision links, figure manifest, depth definitions, carbon pools, units, sampling limits and unfinished labels when copying. A plot's carbon stock per unit area does not automatically provide a regional total.

## 3. Complete the missing summaries

Use the labelled slots to add forest ground-data coverage, covariate summaries and distributions calculated from defined raster footprints. Chosen-area totals require a stated boundary, stock quantity and units, depth/pool/year, valid area and missing-data treatment. Comparisons should use a common eligible footprint. GEE apps remain placeholders until implemented.

## 4. Publish the website

These Markdown files can be reviewed directly on GitHub. They are content drafts, not a complete GitHub Pages deployment. Agree the content first, then prepare the Pages configuration/theme, navigation and rendered pages. Test links and images under the repository's website path and on a narrow screen before publishing.

## 5. Keep the analysis reproducible

The full analysis project remains in [Carbon_Data_SOD](https://github.com/CathalD/Carbon_Data_SOD). A versioned source analysis snapshot, its available prepared outputs and reproduction instructions are now included under `analysis/`. Raw external preparation inputs still need to be supplied separately for a full analysis refresh. Preserve the cited source revisions and distinguish source-example figures from newly calculated results.

This package is stored in Cathal's source repository for manual transfer; it does not change the company repository.
