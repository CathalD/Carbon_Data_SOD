// Paste into https://code.earthengine.google.com/ using your own enabled project.
// Public data reads only. Earth Engine sign-in is still required.
var ROOT = 'projects/northstarlabs/assets/carbon_state_of_data/soils/';
var profiles = ee.FeatureCollection(ROOT + 'profiles/wosis_canada_profiles_v2');
var soil = ee.Image(ROOT + 'maps/soilgrids_v2/soc_mean');
var forest = ee.ImageCollection('projects/sat-io/open-datasets/ESA/ESA_CCI_AGB');

print('WoSIS profile rows (not an independence count)', profiles.size());
print('WoSIS schema', profiles.first().propertyNames());
print('SoilGrids depth bands', soil.bandNames());
print('ESA CCI image count', forest.size());
print('ESA CCI first image bands', ee.Image(forest.first()).bandNames());

// This scaling is specific to SoilGrids soc_mean: dg/kg -> g/kg.
var soc = soil.select('soc_0-5cm_mean').divide(10).rename('soc_g_kg');
var demo = ee.Geometry.Rectangle([-106.70, 52.10, -106.60, 52.16], null, false);
Map.centerObject(demo, 10);
Map.addLayer(soc.clip(demo), {min: 0, max: 80, palette: ['fff7bc','fec44f','d95f0e','662506']}, 'Mean SOC concentration 0–5 cm, g/kg');
Map.addLayer(demo, {color: '444444'}, 'Synthetic demo area', false);

// The forest layer is biomass, not carbon. This is a separate product/support.
var agb = ee.Image(forest.first()).select('AGB');
Map.addLayer(agb.clip(demo), {min: 0, max: 150, palette: ['ffffcc','78c679','006837']}, 'ESA CCI aboveground biomass, source units', false);

// Optional: create a small GeoTIFF export only after changing this to true.
var CREATE_DEMO_EXPORT = false;
if (CREATE_DEMO_EXPORT) {
  Export.image.toDrive({
    image: soc.clip(demo),
    description: 'CarbonSOD_SoilGrids_0_5cm_demo',
    region: demo,
    // Reprojected demo grid: custom source Mollweide WKT may not export.
    crs: 'EPSG:32613',
    scale: 250,
    fileFormat: 'GeoTIFF',
    maxPixels: 10000
  });
}
