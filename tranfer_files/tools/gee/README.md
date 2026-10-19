# Earth Engine tools

## Carbon Data Explorer (`carbon_data_explorer.js`)

An Earth Engine app for exploring Canada's soil and forest carbon data within an area of interest.

1. **Area of interest:** draw a polygon or rectangle, or paste a public table (FeatureCollection) asset ID.
2. **Forests or Soils.**
3. **Ground data · Covariates · Maps.** In Soils, expand **Ground data · Profiles** to show the checked profile datasets. Each raster card has *Show on map*, *About* (original data → calculation → what is shown) and *Summarise in area*. Calculated layers also have *Add input layers*.

Behaviour:
- Soil profiles and peat cores start hidden. They appear only while **Soils → Ground data · Profiles** is open. Collapsing it or switching to Forests hides them. Dataset checkboxes retain your choices.
- When profiles are shown, points inside the area use their dataset colour; points outside turn grey. Point layers are created on demand and reused; drawing a replacement AOI keeps the current display until the new shape is finished.
- Rasters, covariates and any added input layers are clipped to the AOI. Set an AOI before showing them. Changing the AOI updates existing layers; clearing it masks the rasters until another AOI is set.
- **Show AOI polygon** controls both drawn and loaded AOI visuals. Hiding the polygon keeps the AOI active for clipping, summaries, comparisons and exports. Drawing a replacement temporarily shows the shape while you draw, then restores your visibility choice.
- Clicking a point opens its SOC and bulk-density depth charts. Clicking the map reads the value of every layer shown.
- Stocks and biomass are in kg/m². Area totals are in kg and in t or Mt.
- Uncertainty is reported as an area mean, never summed. Totals are never added across products or pools.

## Compare mapping products

Showing a map with an eligible comparison opens a card in **Results**. You can also select **Compare** on its map card.

1. The map you added is **A**. Select an appropriate **B** from the dropdown; it does not need to be shown on the map.
2. Check the quantity, depth or year and the scientific notes. The initial grid is the coarser product's nominal pixel size, or a visibly coarser suggested grid for a large AOI. You can change it within the stated range.
3. Choose **Run comparison in AOI**. Results capture that AOI and pair: each product's coverage, shared comparison-grid coverage, pixel count, mean A/B, mean difference **A − B**, RMSD and Pearson correlation. Stock/biomass totals use that shared area. The scatter plot displays up to 1,000 sampled pixels, with a 1:1 reference line.
4. Optionally choose **Show difference map (A − B)**. Blue means A is lower and red means A is higher. Its stretch is ±2 RMSD (±1 if RMSD is zero); values beyond that range saturate. The difference is available through **Export AOI data** while shown, and is removed when the AOI changes. Existing result cards retain their original AOI labels; run again for a new area.

Configured families include nominal 0–100 and 0–30 cm soil stocks, matching Geng/SoilGrids depth intervals for stock/concentration/bulk density, Li/PEATGRIDS full-column thickness or carbon, and SCANFI/ESA aboveground biomass or calculated aboveground carbon for a matching year. Point-depth concentration, uncertainty and total multi-pool forest carbon layers have no configured comparison partners.

Sothe versus SoilGrids/Geng at 0–100 cm is **exploratory**. SoilGrids 1 m stock is integrated from carbon density. Geng 1 m stock is integrated from concentration × bulk density × thickness without coarse-fragment correction, and its imported encoding and mineral-surface interpretation remain to verify. Retain the depth-datum and organic-layer notes: matching nominal depths do not establish identical carbon pools or support. Map agreement is not accuracy or independent validation.

The calculation first mean-aggregates both products onto the coarser product's native grid (ties use B's grid). A requested coarser grid uses a second explicit mean aggregation in that projection. Missing cells are masked; finer-scale valid coverage can differ within a coarsened cell. Statistics use **all eligible grid pixels**, equally weighted, and totals use pixel areas on shared coverage. Forest pairs exclude cells where both products are zero. The source report's published metrics use random comparison points; this interactive AOI calculation uses the grid pixels themselves, so it is not an exact rerun of those published summaries. No uncertainty propagation or bias correction is performed.

## Export AOI data

Choose **Export AOI data** in Results, then **Prepare download links**:

- Each currently shown raster, including input layers switched on in the map Layers menu, has a clipped GeoTIFF download. Main products export data values in their displayed units; input layers retain the source units stated in their names. The thermokarst outline input is explicitly labelled as an RGB display outline, not carbon values. Missing pixels remain masked.
- The output grid is **EPSG:3978** at each layer's nominal pixel size. This is a reprojected export, not the provider's original grid. An optional grid size can make the export coarser; the actual pixel size is shown for each file. Resolution is never silently reduced.
- Checked soil datasets provide separate profile and layer CSVs inside the AOI, even when their map points are hidden. CSVs retain the original fields and source units. Layers are selected by the IDs of profiles inside the AOI, so records without geometry are included. Unchecked datasets are omitted; datasets without profiles in the AOI are labelled rather than exported.
- The panel captures its AOI, dataset choices and shown product variants when opened. After changing the AOI or layers, open a new export panel. Download links are temporary.

Earth Engine [direct raster downloads](https://developers.google.com/earth-engine/apidocs/ee-image-getdownloadurl) are limited to 32 MB and 10,000 pixels per dimension. Use a smaller AOI or an explicitly coarser grid if needed. In the Code Editor, **Create Drive export task** additionally creates a batch task; start it yourself from **Tasks**. The published App uses direct download links and does not start Drive tasks automatically.

**Publish:** paste the script into the Code Editor, click Run, then go to Apps > New app.

**Refresh the embedded catalogue** after the catalogue CSVs change:

```bash
python tools/gee/build_catalogue_block.py
```

The builder reads the original `Comparison/data/derived/` profile summary, or the preserved `analysis/source_snapshot/Comparison/data/derived/` copy when used in the transferred company repository.
