// Copy 16 external soil maps into the project. Run once in the GEE Code Editor.
// Native copies: no clipping, reprojection, resampling, scaling or stock calculations.
// Existing destination assets are never overwritten. Geng is already in this project.
// Copies run through the asset API, not Tasks-tab exports. Watch the Console.
// SoilGrids copies keep GLOBAL extent; source citations are in the companion manifest.
// API: https://developers.google.com/earth-engine/apidocs/ee-data-copyasset
// Preparation is not proof of execution or public-read access.
//
// Source/destination ledger: data/catalogue/soil_map_copy_manifest.json
var ROOT = 'projects/northstarlabs/assets/carbon_state_of_data/soils/maps';
var ASSETS = [
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/sc/sc_250m_v20",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/sc_250m_v20",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/sc/sc_uncertainty_250m_v20",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/sc_uncertainty_250m_v20",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_0cm_250m_version10",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_0cm_250m_version10",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_5cm_250m_version10",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_5cm_250m_version10",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_15cm_250m_version10",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_15cm_250m_version10",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_30cm_250m_version10",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_30cm_250m_version10",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_60cm_250m_version10",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_60cm_250m_version10",
    "type": "IMAGE"
  },
  {
    "source": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_100cm_250m_version10",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_100cm_250m_version10",
    "type": "IMAGE"
  },
  {
    "source": "projects/soilgrids-isric/soc_mean",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/soc_mean",
    "type": "IMAGE"
  },
  {
    "source": "projects/soilgrids-isric/bdod_mean",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/bdod_mean",
    "type": "IMAGE"
  },
  {
    "source": "projects/soilgrids-isric/ocd_mean",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/ocd_mean",
    "type": "IMAGE"
  },
  {
    "source": "projects/soilgrids-isric/ocs_mean",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/ocs_mean",
    "type": "IMAGE"
  },
  {
    "source": "projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC30_0012deg",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/ncscdv2/NCSCDv2_Canada_WGS84_SOCC30_0012deg",
    "type": "IMAGE"
  },
  {
    "source": "projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC100_0012deg",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/ncscdv2/NCSCDv2_Canada_WGS84_SOCC100_0012deg",
    "type": "IMAGE"
  },
  {
    "source": "projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC200_0012deg",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/ncscdv2/NCSCDv2_Canada_WGS84_SOCC200_0012deg",
    "type": "IMAGE"
  },
  {
    "source": "projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes",
    "destination": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/olefeldt_2016/Circumpolar_Thermokarst_Landscapes",
    "type": "TABLE"
  }
];
var GROUPS = ['sothe_2022', 'soilgrids_v2', 'ncscdv2', 'olefeldt_2016'];
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
