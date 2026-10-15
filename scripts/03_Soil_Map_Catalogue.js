// Carbon State of Data — soil map references, updated 15 October 2026.
// Read-only inspection: no exports, uploads, unit conversions or integration.
// User-reported assets remain subject to runtime and public-read checks.

var gengRoot = 'projects/northstarlabs/assets/canada_carbon_collection';
var ncscdRoot = 'projects/carbon-learning-library/assets/';
var gengNames = [
  'BD_0_5_cm', 'BD_5_15_cm', 'BD_15_30_cm', 'BD_30_60_cm',
  'BD_60_100_cm', 'SOC_0_5_cm', 'SOC_5_15_cm', 'SOC_15_30_cm',
  'SOC_30_60_cm', 'SOC_60_100_cm'
];

var maps = {
  sotheStocks: ee.ImageCollection(
    'projects/sat-io/open-datasets/carbon_stocks_ca/sc'),
  sotheConcentration: ee.ImageCollection(
    'projects/sat-io/open-datasets/carbon_stocks_ca/scc'),
  soilGridsSOC: ee.Image('projects/soilgrids-isric/soc_mean'),
  soilGridsBD: ee.Image('projects/soilgrids-isric/bdod_mean'),
  soilGridsDensity: ee.Image('projects/soilgrids-isric/ocd_mean'),
  soilGridsStock: ee.Image('projects/soilgrids-isric/ocs_mean'),
  geng: ee.ImageCollection(gengRoot),
  thermokarst: ee.FeatureCollection(ncscdRoot +
    'Circumpolar_Thermokarst_Landscapes'),
  ncscd30: ee.Image(ncscdRoot +
    'NCSCDv2_Canada_WGS84_SOCC30_0012deg'),
  ncscd100: ee.Image(ncscdRoot +
    'NCSCDv2_Canada_WGS84_SOCC100_0012deg'),
  ncscd200: ee.Image(ncscdRoot +
    'NCSCDv2_Canada_WGS84_SOCC200_0012deg')
};

function inspectCollection(label, collection) {
  print(label + ' — image count', collection.size());
  print(label + ' — image IDs', collection.aggregate_array('system:id'));
}

function inspectImage(label, image) {
  print(label + ' — metadata', ee.Dictionary({
    bands: image.bandNames(),
    band_count: image.bandNames().size(),
    band_types: image.bandTypes(),
    first_band_crs: image.select([0]).projection().crs(),
    first_band_transform_wkt: image.select([0]).projection().transform(),
    first_band_nominal_scale_m:
      image.select([0]).projection().nominalScale(),
    properties: image.toDictionary()
  }));
}

inspectCollection('Sothe soil stocks', maps.sotheStocks);
inspectCollection('Sothe SOC concentration', maps.sotheConcentration);
inspectImage('SoilGrids SOC', maps.soilGridsSOC);
inspectImage('SoilGrids bulk density', maps.soilGridsBD);
inspectImage('SoilGrids carbon density', maps.soilGridsDensity);
inspectImage('SoilGrids carbon stock', maps.soilGridsStock);

inspectCollection('Geng collection', maps.geng);
var actualGengIDs = maps.geng.aggregate_array('system:id');
var expectedGengIDs = ee.List(gengNames.map(function(name) {
  return gengRoot + '/' + name;
}));
print('Geng expected prediction images — missing IDs',
  expectedGengIDs.removeAll(actualGengIDs));
print('Geng additional collection members',
  ee.List(actualGengIDs).removeAll(expectedGengIDs));
gengNames.forEach(function(name) {
  inspectImage('Geng ' + name, ee.Image(gengRoot + '/' + name));
});

print('Thermokarst — feature count', maps.thermokarst.size());
print('Thermokarst — sample fields',
  ee.Feature(maps.thermokarst.first()).propertyNames());
print('Thermokarst — example feature', maps.thermokarst.limit(1));
inspectImage('NCSCDv2 SOCC30 — source interval 0–30 cm', maps.ncscd30);
inspectImage('NCSCDv2 SOCC100 — source interval 0–100 cm', maps.ncscd100);
inspectImage('NCSCDv2 SOCC200 — source interval 100–200 cm; verify import',
  maps.ncscd200);

// NCSCDv2 native rasters store hg C/m2; verify whether imports were converted.
// SOCC200 is not assumed to be cumulative 0–200 cm. Do not convert or sum here.
// Inspect Geng SOC encoding/NoData; provider physical units are % and BD g/cm3.
// Last-modified dates are ingestion metadata, not field or prediction dates.
// ABCFlux v2 (ORNL DAAC 2448) is catalogue/table-only: excluded from maps.
