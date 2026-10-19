# Plain report website

The current plain report has three pages: Data and summaries, Comparisons, and How to use. Figures are visible; tables open in dropdowns. Methods, sources and downloads are linked separately.

Copy this `site/` folder together with `data/` and `analysis/` from the transfer package. Do not copy it by itself: rendering reads the catalogue in `../data/` and the preserved analysis inputs in `../analysis/source_snapshot/Comparison/data/`.

Install Quarto and the R packages listed in `../analysis/source_snapshot/Comparison/README.md`, then run:

```bash
cd site
quarto render
```

The result is `site/_site/`. No Earth Engine access is needed to render it. The historical analysis snapshot stays unchanged.

For company publication, configure GitHub Pages in that repository and set `website.site-url` in `_quarto.yml` to the company's actual Pages URL. No company URL or access has been assumed. The report currently links to the public source catalogue and explorer script; update those links when company copies are ready. This folder does not create a published Earth Engine App.

The Markdown pages in `../docs/` retain the earlier planning scaffold. Edit the QMD files in this folder to change the plain website.
