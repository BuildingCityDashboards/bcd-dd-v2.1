
const getMapFig5 = async function () {
// Custom map icons

  let planningMapLayerSizes = []

  // let osmPlanning = new L.TileLayer(stamenTonerUrl_Lite, {
  //   minZoom: min_zoom,
  //   maxZoom: max_zoom,
  //   attribution: stamenTonerAttrib
  // })

  // let planningMap = new L.Map('map-sticky-housing')
  // planningMap.setView(new L.LatLng(dubLat, dubLng), zoom)
  // planningMap.addLayer(osmPlanning)
  // let markerRefPlanning // TODO: fix horrible hack!!!
  // planningMap.on('popupopen', function (e) {
  //   markerRefPlanning = e.popup._source
  // // console.log("ref: "+JSON.stringify(e));
  // })

  let data1 = await d3.json('/data/Stories/Housing/part_3/Dublin_Housing_Task_Force_Q3_2019_T1.geojson')

  return processPlanningPermissions(data1.features, 1)

  // let data2 = await d3.json('/data/Stories/Housing/part_3/Dublin_Housing_Task_Force_Q3_2019_T2A.geojson')
  //
  // processPlanningPermissions(data2.features, 2)
}

// //************

function processPlanningPermissions (data_, tier) {
  proj4.defs('EPSG:2157', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')

  var firstProjection = 'EPSG:2157' // ITM
  var secondProjection = 'EPSG:4326' // WGS84
  data_.forEach(function (d) {
    let result = proj4(firstProjection, secondProjection,
      [+d.properties['ITM_X_Coordinate'], +d.properties['ITM_Y_Coordinate']])
    d.lat = result[1]
    d.lng = result[0]
    if (tier == 1) {
      d.type = 'Tier 1'
    }
    if (tier == 2) {
      d.type = 'Tier 2A'
    }
  })
  // planningMapLayerSizes[0] = data_.length
  // console.log(regionData);
  return initMapPlanning(data_)
};

// pretty error

function initMapPlanning (data__) {
  let planningCluster = L.markerClusterGroup()
  let planningMapIcon = L.icon({
    iconUrl: '/images/icons/circle-stroked-15.svg',
    iconSize: [30, 30], // orig size
    iconAnchor: [iconAX, iconAY] //,
  // popupAnchor: [-3, -76]
  })

  let customPlanningMarker = L.Marker.extend({
    options: {
      sid: 0,
      sfn: ''
    }
  })
  data__.forEach((d, i) => {
    planning_ref = d.properties['Planning_Reference']
    fname = planning_ref

    // console.log(d.lat, ", ", d.lng)
    let m = new customPlanningMarker(
      new L.LatLng(+d.lat, +d.lng), {
        icon: planningMapIcon,
        sid: d.id,
        sfn: fname
      })

    planningCluster.addLayer(m)
    // m.bindPopup(getstr(fname));
    m.bindTooltip(planningPermissionsPopupInit(d))
  })
    // m.on('popupopen', getBikesStationPopup)

      // planningMap.addLayer(planningCluster)
  return planningCluster
};

function planningPermissionsPopupInit (d_) {
  let key = 'Planning_Reference'
  let str = ``;
  // Catch null development names or blanks or single space
  (d_.properties[key] && d_.properties[key] !== '' && d_.properties[key] !== ' ') ? str += `<b>${d_.properties[key]}</b><br>` : str += '<b>Unknown reference ID</b><br>'

  if (d_.properties['Planning_Reference'] && d_.type == 'Tier 1') {
    str += '<br>'
    // str += `<b>Planning Reference ID number</b>: ${d_.properties[key]}<br>`

    str += `<b>${d_.type}</b><br>`
    str += `<b>Units permitted</b>: ${d_.properties['Planning_Permission__Units_Perm']}<br>`
    str += `<b>Units comleted</b>: ${d_.properties['Units_Completed_to_Date']}<br>`
    str += `<b>Units under construction</b>: ${d_.properties['Units_Under_Construction']}<br>`
    str += `<b>Units permitted, not started</b>: ${d_.properties['Units_Permitted_But_Not_Commenc']}<br>`
    str += `<b>Activity on site</b>: ${d_.properties['Activity_On_Site']}<br>`
  } else {
    str += '<br>'

    str += `<b>${d_.type}</br><br>`
    str += `<b>Proposed dwelling units</b>: ${d_.properties['Proposed_Dwelling_Units']}<br>`
  }
  return str
}

