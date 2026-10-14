// Carbon State of Data: read-only soil map catalogue inspection.
// Catalogue-listed IDs; runtime results must be checked by the user.

var maps = {
  sotheStocks: ee.ImageCollection(
    'projects/sat-io/open-datasets/carbon_stocks_ca/sc'),
  sotheConcentration: ee.ImageCollection(
    'projects/sat-io/open-datasets/carbon_stocks_ca/scc'),
  soilGridsSOC: ee.Image('projects/soilgrids-isric/soc_mean'),
  soilGridsBD: ee.Image('projects/soilgrids-isric/bdod_mean'),
  soilGridsDensity: ee.Image('projects/soilgrids-isric/ocd_mean'),
  soilGridsStock: ee.Image('projects/soilgrids-isric/ocs_mean')
};

function inspectCollection(label, collection) {
  print(label + ' — image count', collection.size());
  print(label + ' — image IDs', collection.aggregate_array('system:id'));
  print(label + ' — members and metadata', collection);
}

function inspectImage(label, image) {
  print(label + ' — bands', image.bandNames());
  print(label + ' — pixel types', image.bandTypes());
  // Select first band because a multi-band image can have mixed projections.
  print(label + ' — first-band grid', image.select([0]).projection());
  print(label + ' — first-band nominal pixel size (m)',
    image.select([0]).projection().nominalScale());
  print(label + ' — properties', image.toDictionary());
}

inspectCollection('Sothe soil stocks', maps.sotheStocks);
inspectCollection('Sothe SOC concentration', maps.sotheConcentration);
inspectImage('SoilGrids SOC', maps.soilGridsSOC);
inspectImage('SoilGrids bulk density', maps.soilGridsBD);
inspectImage('SoilGrids carbon density', maps.soilGridsDensity);
inspectImage('SoilGrids carbon stock', maps.soilGridsStock);

// Change to true only after BD_0_5_cm finishes ingesting.
var CHECK_GENG_FIRST_LAYER = false;
if (CHECK_GENG_FIRST_LAYER) {
  maps.gengBD0to5 = ee.Image(
    'projects/northstarlabs/assets/canada_carbon_collection/BD_0_5_cm');
  inspectImage('Geng bulk density 0–5 cm', maps.gengBD0to5);
}

// Do not mosaic stock/concentration and uncertainty collection members together.
// No unit conversion or depth integration is performed in this inspection.
