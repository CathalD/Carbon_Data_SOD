# Earth Engine tools

## Carbon Data Explorer (`carbon_data_explorer.js`)

An Earth Engine app for exploring Canada's soil and forest carbon data within an area of interest.

1. **Area of interest:** draw a polygon or rectangle, or paste a public table (FeatureCollection) asset ID.
2. **Forests or Soils.**
3. **Ground data · Covariates · Maps.** Each card has *Show on map*, *About* (original data → calculation → what is shown) and *Summarise in area*. Calculated layers also have *Add input layers*.

Behaviour:
- Soil profiles and peat cores are always on the map. Points inside the area use their dataset colour; points outside turn grey.
- Clicking a point opens its SOC and bulk-density depth charts. Clicking the map reads the value of every layer shown.
- Stocks and biomass are in kg/m². Area totals are in kg and in t or Mt.
- Uncertainty is reported as an area mean, never summed. Totals are never added across products or pools.

**Publish:** paste the script into the Code Editor, click Run, then go to Apps > New app.

**Refresh the embedded catalogue** after the catalogue CSVs change:

```bash
python tools/gee/build_catalogue_block.py
```
