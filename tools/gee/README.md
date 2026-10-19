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
- Clicking a point opens its SOC and bulk-density depth charts. Clicking the map reads the value of every layer shown.
- Stocks and biomass are in kg/m². Area totals are in kg and in t or Mt.
- Uncertainty is reported as an area mean, never summed. Totals are never added across products or pools.

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
