# State of Data summary

A visual, descriptive inventory of what the catalogue holds, split into **forest** and **soils** and, within each, **field data → covariates → maps**. Open `state_of_data_summary.html` in a browser; it is a single self-contained file.

It reports counts, coverage, depth reach, variable completeness, scale and depth support, and verification status as recorded. It does **not** harmonise units or depths, compute stocks, compare map values, remove duplicate profiles or fit anything. Those are the comparison steps in `../README.md`.

## Rebuild

From this folder, with the project venv (`Carbon_Resources/.venv`, packages pinned in `../../requirements.txt`):

```bash
../../../.venv/bin/python gee_map_previews.py   # Earth Engine previews + outlines (~15 min)
../../../.venv/bin/python build_summary.py      # tables, charts data, final HTML (~30 s)
```

`gee_map_previews.py --only key1,key2` re-renders selected panels only.

## Inputs

- `../../Carbon State of Data Summary Sheet.xlsx`: Studies, Ground_data, Study_ground, Covariates, Maps, Other_sources
- `../../data/catalogue/`: QC register, completed pixel-check record, depth audit
- `../../TODO.md`: open and closed tasks
- Prepared profile/layer CSVs in `Carbon_Resources/` (the parent of this repo): WoSIS v2, NPDB v1, NRCan peat v1, Janousek v1, Riley v1
- Live Earth Engine reads (project `northstarlabs`)

## Reading the outputs

- **Map previews:** each panel uses its own 2nd–98th percentile colour stretch in the map's stored units. Colours are not comparable between panels.
- **Profile maps:** coordinates are rounded to 0.01° for display.
- **Janousek country split:** approximate, by point-in-outline against simplified LSIB boundaries (the v1 table leaves country blank).
- **Map QC status:** taken from `soil_map_qc_register.json`, which is newer than the workbook's Assets tab.

## Files

| File | What it is |
|---|---|
| `build_summary.py` | Reads the inputs, writes `summary_data.json` and the HTML |
| `gee_map_previews.py` | Renders `thumbs/*.png`, `map_previews.json`, `outlines.json` |
| `template.html` | Page layout and charts (D3); data is injected at build time |
| `state_of_data_summary.html` | Standalone output to open or share |
| `artifact_page.html` | Same page as a fragment, for publishing |
