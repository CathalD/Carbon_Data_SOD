# Copying these files into the company repository

This folder holds the prepared report files. The folder name `tranfer_files` follows the requested spelling.

## What to copy

Copy **`README.md` and the entire `docs` folder** into the root of the new repository. Keep the folder structure so images and page links work.

```text
README.md
docs/
  summaries.md
  comparisons.md
  images/
    summaries/
      ...19 figures and source_manifest.json
```

You can browse and copy the Markdown directly on GitHub. For all files together, open [company-repository.zip](handover/company-repository.zip), select **Download raw file**, and extract it on your computer. Upload the extracted README and docs folder through **Add file → Upload files** in the company repository, following its normal review process. Upload the extracted files rather than the ZIP.

The `handover` folder and this guide are for assembling and reviewing the repository. They do not need to go into the company report.

## Preview and status

- [README](README.md): introduction, catalogue tables in dropdowns, and the three agreed focuses.
- [Visual summaries](docs/summaries.md): example product maps, soil-observation locations, depth coverage, SOC, bulk density and site-stock charts.
- [Comparisons](docs/comparisons.md): draft findings with source revisions and scientific limitations.
- [Interactive layout preview](handover/summaries-preview.html): download and open in a browser; GitHub's file view shows HTML source.
- [Setup guide](handover/repository_setup_guide.md): upload, review and publishing steps.

The report follows **Data and summaries · Comparisons · How to use**. Within each focus, use **Forests / Soils → Ground data / Covariates / Maps**. GEE apps remain planned.

Panels marked “To add” are unfinished. Full-product raster distributions, chosen-area carbon totals and forest ground-data summaries have not been calculated for this scaffold. Site stocks and area totals use separate definitions. Peat depth, full-peat-column carbon and fixed-depth soil carbon must retain their distinct labels.

The source manifest records the figure inputs and source snapshot. Comparison results have their own versioned source links. The full reproducible analysis remains in the source repository; this folder is the report transfer package.
