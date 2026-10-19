# Transfer package for the new repository

This folder is the working copy of the company repository material prepared so far. We can continue adding to it here.

## Copy the repository files

Download [company-repository.zip](handover/company-repository.zip) using **Download raw file**, extract it, and upload the extracted contents to the company repository root through **Add file → Upload files**. Keep all folder names. The ZIP contains the report drafts, figures, catalogue, references, access examples, supporting scripts and versioned technical analysis.

If copying directly from this folder, copy everything except `handover/` and this `START_HERE.md` guide. The handover folder contains assembly instructions, the standalone HTML layout preview, earlier reviews and the ZIP. Those files are included here for continuity but need not be published in the company repository.

| Path | Contents |
|---|---|
| `README.md` | Report introduction, dataset tables and links |
| `docs/` | Summaries, comparisons, How to use, methods, downloads and source access/QC notes |
| `data/` | Editable catalogue tables and source evidence |
| `references/`, `SOURCES.md` | Scientific references and the original project's citation metadata |
| `examples/` | Existing Earth Engine access examples |
| `tools/gee/` | Carbon Data Explorer draft, export controls and embedded-catalogue builder |
| `scripts/` | Catalogue JSON builder and source QC example |
| `analysis/` | Summary-figure generator and a versioned source analysis snapshot |
| `CONTRIBUTING.md`, `.gitignore` | Contribution guidance and generated-file exclusions |

## Review the drafts

[Summaries](docs/summaries.md) · [Comparisons](docs/comparisons.md) · [How to use](docs/how-to-use.md) · [Setup guide](handover/repository_setup_guide.md)

Download `handover/summaries-preview.html` and open it in a browser to explore the proposed interactive layout. It embeds its original figures and does not update automatically when Markdown or PNG files change.

The agreed structure remains **Data and summaries · Comparisons · How to use**, each organised as **Forests / Soils → Ground data / Covariates / Maps**. GEE apps, forest ground-data summaries, full-product distributions and chosen-area totals remain explicit unfinished work. This is not yet a configured company GitHub Pages deployment.

The earlier reviews in `handover/planning/` retain their original snapshot context. Current comparison sources and figure inputs are versioned separately. Raw external profile/layer preparation files and Earth Engine credentials/assets are not part of this transfer.
