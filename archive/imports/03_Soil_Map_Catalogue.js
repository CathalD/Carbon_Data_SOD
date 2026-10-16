// Carbon State of Data — soil map references, updated 15 October 2026.
// Read-only inspection: no exports, uploads, unit conversions or integration.
// Local copies confirmed by maintainer Console output: 16 copied, 0 failed.
// Numerical values, source depth/unit definitions and public-read checks remain pending.

var gengRoot = 'projects/northstarlabs/assets/canada_carbon_collection';
var mapsRoot = 'projects/northstarlabs/assets/carbon_state_of_data/soils/maps/';
var ncscdRoot = mapsRoot + 'ncscdv2/';
var sotheRoot = mapsRoot + 'sothe_2022/';
var sotheStockNames = ['sc_250m_v20', 'sc_uncertainty_250m_v20'];
var sotheConcentrationNames = [
  'scc_0cm_250m_version10', 'scc_5cm_250m_version10',
  'scc_15cm_250m_version10', 'scc_30cm_250m_version10',
  'scc_60cm_250m_version10', 'scc_100cm_250m_version10'
];
var gengNames = [
  'BD_0_5_cm', 'BD_5_15_cm', 'BD_15_30_cm', 'BD_30_60_cm',
  'BD_60_100_cm', 'SOC_0_5_cm', 'SOC_5_15_cm', 'SOC_15_30_cm',
  'SOC_30_60_cm', 'SOC_60_100_cm'
];

var maps = {
  sotheStocks: ee.ImageCollection.fromImages(sotheStockNames.map(function(name) {
    return ee.Image(sotheRoot + name);
  })),
  sotheConcentration: ee.ImageCollection.fromImages(sotheConcentrationNames.map(function(name) {
    return ee.Image(sotheRoot + name);
  })),
  soilGridsSOC: ee.Image(mapsRoot + 'soilgrids_v2/soc_mean'),
  soilGridsBD: ee.Image(mapsRoot + 'soilgrids_v2/bdod_mean'),
  soilGridsDensity: ee.Image(mapsRoot + 'soilgrids_v2/ocd_mean'),
  soilGridsStock: ee.Image(mapsRoot + 'soilgrids_v2/ocs_mean'),
  geng: ee.ImageCollection(gengRoot),
  thermokarst: ee.FeatureCollection(mapsRoot + 'olefeldt_2016/' +
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
sotheStockNames.concat(sotheConcentrationNames).forEach(function(name) {
  inspectImage('Sothe local ' + name, ee.Image(sotheRoot + name));
});
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

// Li et al. (2025): variable modelled peat-column depth, regional 30 m.
// Four local copies confirmed in maintainer output; source IDs remain in provenance.
// Paper and archive definitions: data/catalogue/li_2025_hbl_maps.json
inspectImage('Li peat_depth — local copy; units/full CRS/masks QC pending',
  ee.Image('projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMaster_PeatDepth_30m'));
inspectImage('Li peat_depth_uncertainty — local copy; units/full CRS/masks QC pending',
  ee.Image('projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMaster_Uncertainty_PeatDepth_30m'));
inspectImage('Li peat_carbon_stock — local copy; units/full CRS/masks QC pending',
  ee.Image('projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMasterCarbon30mkgm2version1'));
inspectImage('Li peat_carbon_stock_uncertainty — local copy; units/full CRS/masks QC pending',
  ee.Image('projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMasterUncertaintyCarbon30mkgm2'));
