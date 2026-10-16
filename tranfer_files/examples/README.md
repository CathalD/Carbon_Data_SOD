# Working examples

Use an Earth Engine-enabled Cloud project that you control. Public asset sharing does not give you quota permissions on the catalogue maintainer’s project.

## Code Editor

Copy [01_load_carbon_data.js](01_load_carbon_data.js) into the [Earth Engine Code Editor](https://code.earthengine.google.com/). It checks the WoSIS schema/count, SoilGrids depth bands and ESA CCI biomass collection, and displays a small synthetic demonstration area. Optional Drive export is disabled until `CREATE_DEMO_EXPORT` is set to `true`; start the task in the Tasks panel yourself.

## Python

```sh
python -m pip install -r examples/requirements.txt
python examples/02_quickstart.py --project YOUR_PROJECT_ID --authenticate --output-dir demo_output
```

With existing Earth Engine or Application Default Credentials, omit `--authenticate`. The script performs read-only data requests and a small local GeoTIFF download. It never changes assets or sharing and never starts bulk exports. Credentials and signed download URLs are not saved in the repository.

The source SoilGrids SOC band stores dg/kg; `/10` gives g/kg. This is concentration at **0–5 cm**, not carbon stock, and the factor must not be transferred to Geng or other products. The ESA product is aboveground biomass, not automatically carbon.

The GeoTIFF is a **reprojected 250 m EPSG:32613 demonstration** using nearest-neighbour resampling; source data use custom Mollweide WKT. This avoids a verified Earth Engine GeoTIFF-writer limitation. Output dimensions are bounded to 10,000 pixels. Use source-grid metadata and explicit transformations for scientific pixelwise comparisons; do not treat this demo as an unchanged provider raster.

## Validation performed

The Python example was executed against live assets on 15 October 2026 and downloaded a valid 29 × 28 GeoTIFF. It returned 8,825 WoSIS profile rows, six SoilGrids SOC depth bands and 10 ESA CCI images with AGB/SD bands. The Code Editor example passed JavaScript syntax checking; its equivalent read/data expressions were tested through Python. The optional browser/Drive export was not submitted. These checks used an authorized session; the owned-source public ACLs were separately inspected.

The [multiscale notebook](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/archive/covariate-pilot/MultiScale_CovariateExtraction.ipynb) is a reference baseline, not the recommended first-run public example: it needs a donor table that is not included in the public pilot package. Its [pilot findings](https://github.com/CathalD/Carbon_Data_SOD/blob/6b125781e40267867399372d65b2fd72fc30670d/archive/covariate-pilot/soil_covariate_pilot.md), including radar and coastal climate issues, remain unresolved for bulk modelling.
