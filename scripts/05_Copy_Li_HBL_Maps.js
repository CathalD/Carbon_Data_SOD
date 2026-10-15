// Copy four Li et al. (2025) Hudson Bay Lowlands maps into soils/maps/li_2025_hbl.
// Paper: https://doi.org/10.1029/2024GL110679
// Archive: https://doi.org/10.5683/SP3/TIRAXJ
// Carbon stocks cover VARIABLE modelled peat depth, not a fixed depth interval.
// Native copies: no clipping, reprojection, resampling, scaling or stock calculations.
// Existing destination assets are never overwritten. Geng is already in this project.
// Copies run through the asset API, not Tasks-tab exports. Watch the Console.
// Two sources are in northstarlabs; two are in ee-cathalpdoherty2.
// Originals are retained. Units/scaling/masks must be checked against archived rasters.
// API: https://developers.google.com/earth-engine/apidocs/ee-data-copyasset
// Preparation is not proof of execution or public-read access.
//
// Source/destination ledger: data/catalogue/li_2025_hbl_maps.json
var ROOT = 'projects/northstarlabs/assets/carbon_state_of_data/soils/maps';
var ASSETS = [
  {
    "source": "projects/northstarlabs/assets/McMaster_PeatDepth_30m",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMaster_PeatDepth_30m",
    "type": "IMAGE"
  },
  {
    "source": "projects/northstarlabs/assets/McMaster_Uncertainty_PeatDepth_30m",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMaster_Uncertainty_PeatDepth_30m",
    "type": "IMAGE"
  },
  {
    "source": "projects/ee-cathalpdoherty2/assets/McMasterCarbon30mkgm2version1",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMasterCarbon30mkgm2version1",
    "type": "IMAGE"
  },
  {
    "source": "projects/ee-cathalpdoherty2/assets/McMasterUncertaintyCarbon30mkgm2",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMasterUncertaintyCarbon30mkgm2",
    "type": "IMAGE"
  }
];
var GROUPS = ['li_2025_hbl'];
var results = [];

function assetType(asset) {
  return String(asset.type || '').toUpperCase().replace(/_/g, '');
}
function expectedType(actual, expected) {
  return actual === expected ||
    (expected === 'TABLE' && actual === 'FEATURECOLLECTION');
}
function report(index, status, message) {
  var row = ASSETS[index];
  results.push({
    source: row.source, destination: row.destination,
    status: status, message: message || ''
  });
  print(status + ': ' + row.destination, message || '');
  copyNext(index + 1);
}
function finish() {
  var counts = {copied: 0, skipped_existing: 0, failed: 0};
  results.forEach(function(row) { counts[row.status] += 1; });
  print('COPY SUMMARY', counts);
  print('Source/destination results — save with the catalogue', results);
  print('Refresh Assets. Existing destinations were skipped without equivalence checks. ' +
    'Verify source units/masks and destination public-read access separately.');
  results.forEach(function(row) {
    if (row.status === 'failed') return;
    var image = ee.Image(row.destination);
    ee.Dictionary({bands: image.bandNames(), properties: image.toDictionary(),
      nominal_scale_m: image.select([0]).projection().nominalScale(),
      crs: image.select([0]).projection().crs(),
      transform: image.select([0]).projection().transform()
    }).evaluate(function(details, error) {
      print('LI LOCAL METADATA ' + row.destination, error || JSON.stringify(details, null, 2));
    });
  });
}
// getAsset failures can mean missing assets or insufficient permissions. A subsequent
// create/copy is non-overwriting; its error is retained rather than assuming absence.
function ensureGroup(index) {
  if (index === GROUPS.length) {
    copyNext(0);
    return;
  }
  var path = ROOT + '/' + GROUPS[index];
  ee.data.getAsset(path, function(asset, error) {
    if (!error && asset) {
      if (assetType(asset) !== 'FOLDER') {
        print('STOP: destination group exists but is not a folder', path);
        return;
      }
      ensureGroup(index + 1);
      return;
    }
    // Omit properties entirely: even an empty properties object is rejected for folders.
    ee.data.createAsset({type: 'Folder'}, path, false, undefined, function(created, createError) {
      if (!createError) {
        ensureGroup(index + 1);
        return;
      }
      // A concurrent run may have created the folder. Confirm its type.
      ee.data.getAsset(path, function(recheck, recheckError) {
        if (!recheckError && recheck && assetType(recheck) === 'FOLDER') {
          ensureGroup(index + 1);
        } else {
          print('STOP: cannot create/read folder', path, String(createError));
        }
      });
    });
  });
}
function copyNext(index) {
  if (index === ASSETS.length) {
    finish();
    return;
  }
  var row = ASSETS[index];
  ee.data.getAsset(row.source, function(source, sourceError) {
    if (sourceError || !source) {
      report(index, 'failed', 'Source unavailable: ' + String(sourceError));
      return;
    }
    if (!expectedType(assetType(source), row.type)) {
      report(index, 'failed', 'Unexpected source type: ' + source.type);
      return;
    }
    ee.data.getAsset(row.destination, function(existing, existingError) {
      if (!existingError && existing) {
        report(index, expectedType(assetType(existing), row.type) ?
          'skipped_existing' : 'failed',
          'Destination exists; no overwrite or provenance equivalence check. Type: ' +
          existing.type);
        return;
      }
      ee.data.copyAsset(row.source, row.destination, false, function(unused, copyError) {
        if (copyError) {
          report(index, 'failed', 'Copy rejected: ' + String(copyError));
          return;
        }
        ee.data.getAsset(row.destination, function(copied, readError) {
          if (readError || !copied || !expectedType(assetType(copied), row.type)) {
            report(index, 'failed',
              'Copy returned successfully but destination readback/type check failed. ' +
              'Refresh Assets before rerunning: ' + String(readError));
            return;
          }
          report(index, 'copied', 'Destination exists with expected type; numerical QC pending.');
        });
      });
    });
  });
}

print('Planned native copies', ASSETS);
print('Destination', ROOT);
ee.data.getAsset(ROOT, function(asset, error) {
  if (error || !asset || assetType(asset) !== 'FOLDER') {
    print('STOP: open your northstarlabs project and confirm the soils/maps folder exists.',
      String(error || 'Not a folder'));
    return;
  }
  ensureGroup(0);
});
