# Analysis and figure sources

The public drafts are in `../docs/`. Technical material stays here.

## Rebuild the summary figures

From the new repository root:

```sh
python -m pip install -r analysis/requirements.txt
python analysis/build_summary_figures.py
```

This recreates the eight soil-observation charts, copies eleven selected product previews and writes their source manifest under `docs/images/summaries/`. It uses the bundled prepared tables and ecozone geometry; Earth Engine is not needed. Use `--output-dir` to write elsewhere while reviewing changes. Keep the manifest with the figures.

The original example inputs were recorded at source commit `0861884e5414699cac2acab5f08c3ba4464c7490`. The four hashed inputs are identical in the bundled `6b125781e40267867399372d65b2fd72fc30670d` snapshot. The generator retains the original example label.

The standalone HTML preview in `../handover/` embeds its images. Rebuilding PNGs does not automatically update that preview or the page text.

## Original comparison workflow

`source_snapshot/` preserves the original analysis layout, scripts, prepared derived tables, comparison samples, preview images, ecozone geometry, catalogue and Quarto report sources at the revision recorded in `source_snapshot/SNAPSHOT.json`. These files are a reference snapshot; edit the new public drafts under `docs/`.

See [the source reproduction guide](source_snapshot/Comparison/README.md) for requirements and the analysis sequence. The committed outputs support inspection and re-rendering without Earth Engine. Refreshing the full analysis additionally needs the original prepared profile/layer inputs, which are external to the source repository, and an authorised Earth Engine project with access to the listed assets. Those inputs and credentials are not supplied here. The original scripts retain their source assumptions about input locations; configure or adapt them before refreshing.

The snapshot includes the original website configuration for reproduction. Its publishing destination identifies the source project; it is not a company website configuration. Do not run its publishing command as the company deployment step.

Root `data/downloads/` contains the editable catalogue for the new repository. The copy inside the analysis snapshot records what supported the original results and should remain versioned as a snapshot. Updating the catalogue alone does not refresh comparison results.
