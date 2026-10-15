// Exact asset IDs; QC version 2026-10-15.2.
var ASSETS = [
  {
    "asset_record_id": "A001",
    "resource_id": "M_SOTHE_STOCK",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/sc/sc_250m_v20",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/sc_250m_v20",
    "asset_type": "IMAGE",
    "depth_support": "0\u2013100 cm maintainer assumption"
  },
  {
    "asset_record_id": "A002",
    "resource_id": "M_SOTHE_UNC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/sc/sc_uncertainty_250m_v20",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/sc_uncertainty_250m_v20",
    "asset_type": "IMAGE",
    "depth_support": "0\u2013100 cm maintainer assumption"
  },
  {
    "asset_record_id": "A003",
    "resource_id": "M_SOTHE_CONC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_0cm_250m_version10",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_0cm_250m_version10",
    "asset_type": "IMAGE",
    "depth_support": "0 cm point-depth label"
  },
  {
    "asset_record_id": "A004",
    "resource_id": "M_SOTHE_CONC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_5cm_250m_version10",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_5cm_250m_version10",
    "asset_type": "IMAGE",
    "depth_support": "5 cm point-depth label"
  },
  {
    "asset_record_id": "A005",
    "resource_id": "M_SOTHE_CONC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_15cm_250m_version10",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_15cm_250m_version10",
    "asset_type": "IMAGE",
    "depth_support": "15 cm point-depth label"
  },
  {
    "asset_record_id": "A006",
    "resource_id": "M_SOTHE_CONC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_30cm_250m_version10",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_30cm_250m_version10",
    "asset_type": "IMAGE",
    "depth_support": "30 cm point-depth label"
  },
  {
    "asset_record_id": "A007",
    "resource_id": "M_SOTHE_CONC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_60cm_250m_version10",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_60cm_250m_version10",
    "asset_type": "IMAGE",
    "depth_support": "60 cm point-depth label"
  },
  {
    "asset_record_id": "A008",
    "resource_id": "M_SOTHE_CONC",
    "source_id": "projects/sat-io/open-datasets/carbon_stocks_ca/scc/scc_100cm_250m_version10",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/sothe_2022/scc_100cm_250m_version10",
    "asset_type": "IMAGE",
    "depth_support": "100 cm point-depth label"
  },
  {
    "asset_record_id": "A009",
    "resource_id": "M_SG_SOC",
    "source_id": "projects/soilgrids-isric/soc_mean",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/soc_mean",
    "asset_type": "IMAGE",
    "depth_support": "Six intervals to 200 cm"
  },
  {
    "asset_record_id": "A010",
    "resource_id": "M_SG_BD",
    "source_id": "projects/soilgrids-isric/bdod_mean",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/bdod_mean",
    "asset_type": "IMAGE",
    "depth_support": "Six intervals to 200 cm"
  },
  {
    "asset_record_id": "A011",
    "resource_id": "M_SG_OCD",
    "source_id": "projects/soilgrids-isric/ocd_mean",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/ocd_mean",
    "asset_type": "IMAGE",
    "depth_support": "Six intervals to 200 cm"
  },
  {
    "asset_record_id": "A012",
    "resource_id": "M_SG_OCS",
    "source_id": "projects/soilgrids-isric/ocs_mean",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/soilgrids_v2/ocs_mean",
    "asset_type": "IMAGE",
    "depth_support": "0\u201330 cm"
  },
  {
    "asset_record_id": "A013",
    "resource_id": "M_NCSCD_30",
    "source_id": "projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC30_0012deg",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/ncscdv2/NCSCDv2_Canada_WGS84_SOCC30_0012deg",
    "asset_type": "IMAGE",
    "depth_support": "0\u201330 cm"
  },
  {
    "asset_record_id": "A014",
    "resource_id": "M_NCSCD_100",
    "source_id": "projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC100_0012deg",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/ncscdv2/NCSCDv2_Canada_WGS84_SOCC100_0012deg",
    "asset_type": "IMAGE",
    "depth_support": "0\u2013100 cm"
  },
  {
    "asset_record_id": "A015",
    "resource_id": "M_NCSCD_200",
    "source_id": "projects/carbon-learning-library/assets/NCSCDv2_Canada_WGS84_SOCC200_0012deg",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/ncscdv2/NCSCDv2_Canada_WGS84_SOCC200_0012deg",
    "asset_type": "IMAGE",
    "depth_support": "100\u2013200 cm"
  },
  {
    "asset_record_id": "A016",
    "resource_id": "M_THERMOKARST",
    "source_id": "projects/carbon-learning-library/assets/Circumpolar_Thermokarst_Landscapes",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/olefeldt_2016/Circumpolar_Thermokarst_Landscapes",
    "asset_type": "TABLE",
    "depth_support": "0\u20133 m associated SOC"
  },
  {
    "asset_record_id": "A017",
    "resource_id": "M_LI_DEPTH",
    "source_id": "projects/northstarlabs/assets/McMaster_PeatDepth_30m",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMaster_PeatDepth_30m",
    "asset_type": "IMAGE",
    "depth_support": "Variable modelled peat depth"
  },
  {
    "asset_record_id": "A018",
    "resource_id": "M_LI_DEPTH_UNC",
    "source_id": "projects/northstarlabs/assets/McMaster_Uncertainty_PeatDepth_30m",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMaster_Uncertainty_PeatDepth_30m",
    "asset_type": "IMAGE",
    "depth_support": "Variable modelled peat depth"
  },
  {
    "asset_record_id": "A019",
    "resource_id": "M_LI_C",
    "source_id": "projects/ee-cathalpdoherty2/assets/McMasterCarbon30mkgm2version1",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMasterCarbon30mkgm2version1",
    "asset_type": "IMAGE",
    "depth_support": "Variable modelled peat depth"
  },
  {
    "asset_record_id": "A020",
    "resource_id": "M_LI_C_UNC",
    "source_id": "projects/ee-cathalpdoherty2/assets/McMasterUncertaintyCarbon30mkgm2",
    "destination_id": "projects/northstarlabs/assets/carbon_state_of_data/soils/maps/li_2025_hbl/McMasterUncertaintyCarbon30mkgm2",
    "asset_type": "IMAGE",
    "depth_support": "Variable modelled peat depth"
  },
  {
    "asset_record_id": "A021",
    "resource_id": "M_GENG_BD",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_0_5_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_0_5_cm",
    "asset_type": "IMAGE",
    "depth_support": "0\u20135 cm"
  },
  {
    "asset_record_id": "A022",
    "resource_id": "M_GENG_BD",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_5_15_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_5_15_cm",
    "asset_type": "IMAGE",
    "depth_support": "5\u201315 cm"
  },
  {
    "asset_record_id": "A023",
    "resource_id": "M_GENG_BD",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_15_30_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_15_30_cm",
    "asset_type": "IMAGE",
    "depth_support": "15\u201330 cm"
  },
  {
    "asset_record_id": "A024",
    "resource_id": "M_GENG_BD",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_30_60_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_30_60_cm",
    "asset_type": "IMAGE",
    "depth_support": "30\u201360 cm"
  },
  {
    "asset_record_id": "A025",
    "resource_id": "M_GENG_BD",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_60_100_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/BD_60_100_cm",
    "asset_type": "IMAGE",
    "depth_support": "60\u2013100 cm"
  },
  {
    "asset_record_id": "A026",
    "resource_id": "M_GENG_SOC",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_0_5_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_0_5_cm",
    "asset_type": "IMAGE",
    "depth_support": "0\u20135 cm"
  },
  {
    "asset_record_id": "A027",
    "resource_id": "M_GENG_SOC",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_5_15_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_5_15_cm",
    "asset_type": "IMAGE",
    "depth_support": "5\u201315 cm"
  },
  {
    "asset_record_id": "A028",
    "resource_id": "M_GENG_SOC",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_15_30_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_15_30_cm",
    "asset_type": "IMAGE",
    "depth_support": "15\u201330 cm"
  },
  {
    "asset_record_id": "A029",
    "resource_id": "M_GENG_SOC",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_30_60_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_30_60_cm",
    "asset_type": "IMAGE",
    "depth_support": "30\u201360 cm"
  },
  {
    "asset_record_id": "A030",
    "resource_id": "M_GENG_SOC",
    "source_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_60_100_cm",
    "destination_id": "projects/northstarlabs/assets/canada_carbon_collection/SOC_60_100_cm",
    "asset_type": "IMAGE",
    "depth_support": "60\u2013100 cm"
  }
];

// Carbon State of Data: step 2 soil-map QC, 15 October 2026.
// Read-only: no exports, copies, conversions, reprojection or ACL changes.
// ASSETS is generated above from the exact catalogue asset IDs.
// Default runs metadata/ACL/schema checks for all 30 assets.
// After that succeeds, change RUN_PIXEL_CHECKS to true and rerun.
var RUN_PIXEL_CHECKS = false;
var SAMPLE_POINTS = 512;
var SEED = 20261015;
var results = [];
var metadata = {};
var QC_VERSION = '2026-10-15.2';
var canadaWindow = ee.Geometry.Rectangle([-141, 41, -52, 84], null, false);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    var out = {};
    Object.keys(value).sort().forEach(function(k) { out[k] = canonical(value[k]); });
    return out;
  }
  return value;
}
function same(a, b) { return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b)); }
function errorText(error) { return error ? String(error.message || error) : null; }
function bands(asset) { return asset.bands || []; }
function normalizedType(type) {
  var t = String(type || '').replace(/_/g, '').toUpperCase();
  return t === 'IMAGECOLLECTION' ? 'IMAGE_COLLECTION' : t;
}
function grid(band) {
  if (band.grid) return band.grid;
  return {crsCode: band.crs || null, affineTransform: band.crs_transform || null,
    dimensions: band.dimensions || null};
}
function normalizeAsset(asset) {
  asset.returned_type = asset.type;
  asset.type = normalizedType(asset.type);
  asset.bands = bands(asset).map(function(b) {
    var out = {};
    Object.keys(b).forEach(function(k) { out[k] = b[k]; });
    out.grid = grid(b);
    return out;
  });
  return asset;
}
function readAsset(id, callback) {
  ee.data.getAsset(id, function(asset, error) {
    if (error || !asset) return callback(null, error);
    asset = normalizeAsset(asset);
    if (asset.type !== 'IMAGE') return callback(asset, null);
    var image = ee.Image(id);
    // A null short CRS is common for custom projections. Read the full WKT.
    var projections = bands(asset).map(function(b) {
      var p = image.select([b.id]).projection();
      return ee.Dictionary({band: b.id, wkt: p.wkt(), nominal_scale_m: p.nominalScale()});
    });
    ee.List(projections).evaluate(function(value, projectionError) {
      if (projectionError) asset.projection_error = errorText(projectionError);
      else value.forEach(function(p, i) {
        asset.bands[i].grid.crsWkt = p.wkt;
        asset.bands[i].nominal_scale_m = p.nominal_scale_m;
      });
      callback(asset, null);
    });
  });
}
function compactAsset(asset) {
  return {id: asset.id || asset.name, type: asset.type,
    returned_type: asset.returned_type, version: asset.version,
    bands: bands(asset), projection_error: asset.projection_error || null,
    property_keys: Object.keys(asset.properties || {}).filter(function(k) {
      return k !== 'system:footprint';
    }), note: 'Footprint coordinates and property contents omitted to keep output bounded.'};
}
function hasGrid(band) {
  var g = grid(band);
  return !!((g.crsCode || g.crsWkt) && g.affineTransform);
}
function gridMatch(source, dest) {
  var s = bands(source), d = bands(dest);
  return s.length > 0 && s.length === d.length && s.every(function(b, i) {
    return hasGrid(b) && hasGrid(d[i]) && b.id === d[i].id &&
      same(grid(b), grid(d[i]));
  });
}
function emit(row, next) {
  results.push(row);
  print('QC_ROW ' + row.asset_record_id + '\n' + JSON.stringify(row, null, 2));
  next();
}
function readACL(id, callback) {
  var collection = 'projects/northstarlabs/assets/canada_carbon_collection';
  var scope = id.indexOf(collection + '/') === 0 ? collection : id;
  try {
    ee.data.getAssetAcl(scope, function(acl, error) {
      if (error || !acl) return callback({status: 'unverified', error: errorText(error)});
      // The JS API omits all_users_can_read when no public viewer grant exists.
      var known = typeof acl.all_users_can_read === 'boolean' || Array.isArray(acl.readers);
      callback({
        status: acl.all_users_can_read === true ? 'public_acl' :
          known ? 'no_public_grant_in_returned_acl' : 'unverified',
        all_users_can_read: known ? acl.all_users_can_read === true : null,
        acl_scope: scope, inherited_collection_scope: scope !== id,
        returned_keys: Object.keys(acl),
        note: 'Read-only ACL observation, not a separate-account access or licence test.'
      });
    });
  } catch (error) { callback({status: 'unverified', error: errorText(error)}); }
}
function tableQC(entry, row, next) {
  var src = ee.FeatureCollection(entry.source_id);
  var dst = ee.FeatureCollection(entry.destination_id);
  ee.Dictionary({
    source_rows: src.size(), destination_rows: dst.size(),
    source_first_feature_fields: ee.Feature(src.first()).propertyNames().sort(),
    destination_first_feature_fields: ee.Feature(dst.first()).propertyNames().sort(),
    source_first_geometry_type: ee.Feature(src.first()).geometry().type(),
    destination_first_geometry_type: ee.Feature(dst.first()).geometry().type()
    ,source_geometry_types: src.map(function(f) {
      return f.set('_qc_geom_type', f.geometry().type());
    }).aggregate_histogram('_qc_geom_type')
    ,destination_geometry_types: dst.map(function(f) {
      return f.set('_qc_geom_type', f.geometry().type());
    }).aggregate_histogram('_qc_geom_type')
    ,destination_rows_with_coordinate_fields: dst.filter(
      ee.Filter.notNull(['LATITUDE', 'LONGITUDE'])).size()
  }).evaluate(function(value, error) {
    row.table_check = error ? {error: errorText(error)} : value;
    row.numerical_status = error ? 'table_check_error' :
      'table_count_schema_and_geometry_inventory_not_full_equivalence';
    emit(row, next);
  });
}
function sampleImage(entry, sourceAsset, destAsset, row, next) {
  var copied = entry.source_id !== entry.destination_id;
  if (copied && !gridMatch(sourceAsset, destAsset)) {
    row.numerical_status = 'skipped_grid_or_band_mismatch_or_missing_grid';
    return emit(row, next);
  }
  var src = ee.Image(entry.source_id), dst = ee.Image(entry.destination_id);
  // Bounding windows include masked edges; no country boundary dependency.
  var window = src.geometry().bounds(100).union(dst.geometry().bounds(100), 100)
    .intersection(canadaWindow, 100);
  var points = ee.FeatureCollection.randomPoints({
    region: window, points: SAMPLE_POINTS, seed: SEED, maxError: 100
  });
  var summaries = bands(destAsset).map(function(b) {
    var s = src.select([b.id]).toDouble(), d = dst.select([b.id]).toDouble();
    var sv = s.mask().gt(0).unmask(0, false).rename('sv');
    var dv = d.mask().gt(0).unmask(0, false).rename('dv');
    // Fill values only for sampling; separate validity fields retain missingness.
    var stack = s.unmask(0, false).rename('s')
      .addBands(d.unmask(0, false).rename('d')).addBands(sv).addBands(dv);
    var sampled = stack.sampleRegions({collection: points,
      projection: d.projection(), geometries: false, tileScale: 4});
    var checked = sampled.map(function(f) {
      return f.set({
        abs_diff: ee.Number(f.get('s')).subtract(ee.Number(f.get('d'))).abs(),
        mask_mismatch: ee.Number(f.get('sv')).neq(ee.Number(f.get('dv')))
      });
    });
    var common = checked.filter(ee.Filter.and(ee.Filter.eq('sv', 1), ee.Filter.eq('dv', 1)));
    var valid = checked.filter(ee.Filter.eq('dv', 1));
    return ee.Dictionary({
      band: b.id, source_projection: s.projection(), destination_projection: d.projection(),
      nominal_scale_m: d.projection().nominalScale(),
      requested_points: SAMPLE_POINTS, returned_points: checked.size(),
      source_valid_points: checked.filter(ee.Filter.eq('sv', 1)).size(),
      destination_valid_points: valid.size(), common_valid_points: common.size(),
      mask_mismatch_points: checked.filter(ee.Filter.eq('mask_mismatch', 1)).size(),
      max_abs_difference: common.aggregate_max('abs_diff'),
      destination_min: valid.aggregate_min('d'), destination_max: valid.aggregate_max('d'),
      destination_mean: valid.aggregate_mean('d'),
      destination_negative_points: valid.filter(ee.Filter.lt('d', 0)).size(),
      destination_zero_points: valid.filter(ee.Filter.eq('d', 0)).size()
    });
  });
  ee.List(summaries).evaluate(function(value, error) {
    if (error) {
      row.numerical_status = 'error'; row.numerical_error = errorText(error);
    } else {
      row.samples = value;
      if (!copied) row.numerical_status = 'uploaded_asset_sampled_original_tiff_comparison_pending';
      else if (value.some(function(v) {
        return v.returned_points !== SAMPLE_POINTS || !v.common_valid_points;
      })) row.numerical_status = 'inconclusive_insufficient_samples';
      else if (value.some(function(v) {
        return v.mask_mismatch_points > 0 || v.max_abs_difference !== 0;
      })) row.numerical_status = 'sample_mismatch_review';
      else row.numerical_status = 'sample_agreement_only_not_full_raster_validation';
    }
    emit(row, next);
  });
}
function inspect(entry, next) {
  var row = {qc_version: QC_VERSION, asset_record_id: entry.asset_record_id, resource_id: entry.resource_id,
    source_id: entry.source_id, destination_id: entry.destination_id,
    checked_utc: new Date().toISOString(), expected_type: entry.asset_type,
    depth_support: entry.depth_support};
  readAsset(entry.destination_id, function(dest, error) {
    if (error || !dest) {
      row.metadata_status = 'destination_error'; row.error = errorText(error);
      return emit(row, next);
    }
    row.destination_metadata = compactAsset(dest);
    metadata[entry.asset_record_id] = dest;
    row.metadata_status = dest.type === entry.asset_type ? 'type_matches' : 'type_mismatch';
    readACL(entry.destination_id, function(acl) {
      row.public_read = acl;
      function compare(source, sourceError) {
        if (sourceError || !source) {
          row.source_error = errorText(sourceError);
          row.numerical_status = 'source_unavailable';
          return emit(row, next);
        }
        row.source_metadata = compactAsset(source);
        var copied = entry.source_id !== entry.destination_id;
        row.copy_grid_schema = entry.asset_type === 'IMAGE' && copied ?
          gridMatch(source, dest) : null;
        if (entry.asset_type === 'TABLE') return tableQC(entry, row, next);
        if (dest.type !== 'IMAGE' || source.type !== 'IMAGE') {
          row.numerical_status = 'skipped_type_mismatch'; return emit(row, next);
        }
        if (RUN_PIXEL_CHECKS) return sampleImage(entry, source, dest, row, next);
        row.numerical_status = 'not_run_set_RUN_PIXEL_CHECKS_true';
        emit(row, next);
      }
      if (entry.source_id === entry.destination_id) compare(dest, null);
      else readAsset(entry.source_id, compare);
    });
  });
}
function alignmentReport() {
  // Grid comparisons only; equal grids do not establish equal masks/units/depths.
  var pairs = [['A001', 'A002'], ['A009', 'A010'], ['A009', 'A011'],
    ['A009', 'A012'], ['A013', 'A014'], ['A014', 'A015'],
    ['A017', 'A018'], ['A017', 'A019'], ['A019', 'A020']];
  for (var i = 0; i < 5; i++) pairs.push(['A0' + (21 + i), 'A0' + (26 + i)]);
  var rows = pairs.map(function(pair) {
    var a = metadata[pair[0]], b = metadata[pair[1]];
    var ag = a && bands(a)[0], bg = b && bands(b)[0];
    return {left: pair[0], right: pair[1],
      first_band_grid_equal: ag && bg && hasGrid(ag) && hasGrid(bg) ?
        same(grid(ag), grid(bg)) : null,
      note: 'False may include differing extents; inspect CRS, transform and dimensions.'};
  });
  print('QC_ALIGNMENT_JSON\n' + JSON.stringify(rows, null, 2));
}
function run(index) {
  if (index >= ASSETS.length) {
    alignmentReport();
    print('QC_SUMMARY_JSON\n' + JSON.stringify({
      qc_version: QC_VERSION, planned: ASSETS.length, reported: results.length,
      pixel_checks_requested: RUN_PIXEL_CHECKS,
      results: results.map(function(r) { return {asset_record_id: r.asset_record_id,
        metadata_status: r.metadata_status, numerical_status: r.numerical_status,
        public_read: r.public_read}; }),
      note: 'No conversions, stock integration, ACL writes or cloud uploads performed.'
    }, null, 2));
    return;
  }
  try { inspect(ASSETS[index], function() { run(index + 1); }); }
  catch (error) { emit({asset_record_id: ASSETS[index].asset_record_id,
    metadata_status: 'error', error: errorText(error)}, function() { run(index + 1); }); }
}
print('STEP 2 — ' + ASSETS.length + ' assets. Pixel checks: ' + RUN_PIXEL_CHECKS);
run(0);
