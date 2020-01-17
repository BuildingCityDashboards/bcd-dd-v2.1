/* TODO:
The following TODO list addresses issues #27 #22 #21 #16 #15 #14 #13
* Working bike symbology
* Working bike traces
  - Add day/ week/ month selection
* Update !bikes data periodically
* Add different icons for different transport modes
* Add car park data
  - Add day popup trace as per bikes
* Add bike station comparisons to popups
* Check API status periodically and update symbol
  - Enable/disable buttons accordingly
  - Add tooltip to say data unavailable over button
  - Animate activity symbol (when refreshing data?)
* Add current time indicator
* Add last/ next refresh time indicator
* Remove button in Bus popup
* Unify popup designs
* Redesign legend
* Convert icons to vector graphics
* Keep popups open when map data refreshes
* Place popups over controls or make them sit away from controls.
* Place icons in filter buttons
 * Test support for DOM node methods on Firefox
 */

//* **@todo: refactor to use ES6 imports ***/

/*
API activity checks that the buttons are not disabled

*/

/************************************
 * Design Pattern
 ************************************/
/************************************
 * Page load
 *** Get station list
 *** Draw markers with default icons
 *** Set timeout
 ***** Get latest snapshot (exAPI)
 ******* Draw/redraw markers with symbology on Map
 *** Marker click
 ***** Get station trend data (exAPI)
 ******* Draw marker popup
 ************************************/
// Manage periodic async data fetching
const setIntervalAsync = SetIntervalAsync.dynamic.setIntervalAsync
const clearIntervalAsync = SetIntervalAsync.clearIntervalAsync
// let group = new L.LayerGroup();
// let TrainLayerGroup = new L.LayerGroup();
const MWayLayerGroup = new L.LayerGroup()

const myIcon = L.icon({
  iconUrl: 'images/pin24.png',
  iconRetinaUrl: 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
})

/* let m50_N = new L.geoJSON(null, {
  "style": {
    "color": "#000000",
    "weight": 5,
    "opacity": 0.65
  },

  }

);

let m50_S = new L.geoJSON(null, {
  "style": {
    "color": "#ff0CCC",
    "weight": 5,
    "opacity": 0.65
  },

});

let n4_N = new L.geoJSON(null, {
  "style": {
    "color": "#000000",
    "weight": 5,
    "opacity": 0.65
  },

});

let n4_S = new L.geoJSON(null, {
  "style": {
    "color": "#bbc980",
    "weight": 5,
    "opacity": 0.65
  },

}); */
// Update the API activity icon and time
// called from the individual getting-around modules
function updateAPIStatus (activity, age, isLive) {
  const d = new Date()
  const tf = moment(d).format('hh:mm a')
  if (isLive) {
    d3.select(activity).attr('src', '/images/icons/activity.svg')
    d3.select(age)
      .text('Live @  ' + tf)
  } else {
    d3.select(activity).attr('src', '/images/icons/alert-triangle.svg')
    d3.select(age)
      .text('No data @ ' + tf)
  }
}

const bikesClusterToggle = true
const busClusterToggle = true
const trainClusterToggle = true
const luasClusterToggle = false
const carparkClusterToggle = true

zoom = 11 // zoom on page load
maxZoom = 26
// the default tile layer
const gettingAroundOSM = new L.TileLayer(cartoDb, {
  minZoom: 2,
  maxZoom: maxZoom, // seems to fix 503 tileserver errors
  attribution: stamenTonerAttrib
})

var thunderAttr = { attribution: '© OpenStreetMap contributors. Tiles courtesy of Andy Allan' }
var transport = L.tileLayer(
  '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
  thunderAttr
)

/* let gettingAroundtransport = L.tileLayer(
            '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
            thunderAttr
        ); */
/* L.tileLayer(
    'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; '+mapLink+' Contributors & '+translink,
        maxZoom: 18,
    }).addTo(map); */
const tl = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap contributors'
})

const gettingAroundMap = new L.Map('getting-around-map')
gettingAroundMap.setView(new L.LatLng(dubLat, dubLng), zoom)
// gettingAroundMap.addLayer(gettingAroundOSM);
gettingAroundMap.addLayer(tl)
let markerRefPublic // TODO: fix horrible hack!!!
gettingAroundMap.on('popupopen', function (e) {
  markerRefPublic = e.popup._source
  // console.log("ref: "+JSON.stringify(e));
})

/* gettingAroundMap.on('click', function(e) {
    alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
}); */
// add location control to global name space for testing only
// on a production site, omit the "lc = "!
L.control.locate({
  strings: {
    title: 'Zoom to your location'
  }
}).addTo(gettingAroundMap)

var osmGeocoder = new L.Control.OSMGeocoder({
  placeholder: 'Enter street name, area etc.',
  bounds: dublinBounds
})
gettingAroundMap.addControl(osmGeocoder)

var trafficinfo = L.control()
trafficinfo.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'LTR') // create a div with a class "info"
  this._div.innerHTML = '<h8> Live Traffic Info</h8>' + '<br>' +
  '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#40FF00";/> </svg>' + '<h8> Fast </h8>' + '</svg>' + '<br>' +
  '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#FF5733";/> </svg>' + ' <h8> Slow </h8>' + '</svg>' + '<br>' +
  '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#FF0000";/> </svg>' + '<h8> Slower </h8>' + '</svg>' + '<br>' +
  '<svg height="10" width="10"> <rect  width="10"  height="10" fill= "#848484"; /> </svg>' + '<h8> No Data </h8>' + '</svg>'
  return this._div
}

/* info.update = function (props) {
  this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
      '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
      : 'Hover over a state');
}; */

trafficinfo.addTo(gettingAroundMap)
function processTravelTimes (data_) {
  d3.keys(data_).forEach(

    function (d) {
      console.debug(JSON.stringify(d)) // to show meassge to web console at the "debug" log level

      data_[d].data.forEach(function (d_) {
        console.debug('From ' + d_.from_name + ' to ' + d_.to_name +
          ' (' + d_.distance / 1000 + ' km)' +
          '\nFree flow ' + d_.free_flow_travel_time + ' seconds' +
          '\nCurrent time ' + d_.current_travel_time + ' seconds'
        )
      })
    }
  )
};

const fetchtraindata2 = function () {
  d3.xml('/data/Transport/Train_data.XML')
    .then((data) => {
      // updatetrainsmarkers(data);
      // AddTrainStations_Layer(data);
      updatetrainsmarkers(data)
      // updateAPIStatus('#train-activity-icon', '#train-age', true);
    })
    .catch(function (err) {
      updateAPIStatus('#train-activity-icon', '#train-age', false)
    })
}

function updatetrainsmarkers (xmldata) {
  const xmlDoc = xmldata
  const l = xmlDoc.getElementsByTagName('ArrayOfObjTrainPositions')[0].childNodes
  const x = xmlDoc.getElementsByTagName('TrainLatitude')
  const y = xmlDoc.getElementsByTagName('TrainLongitude')

  for (i = 0; i < l.length; i++) {
    const lat = x[i].firstChild.nodeValue
    const lon = y[i].firstChild.nodeValue
    if (lat < 54 && lon > -7) {
      var Smarker = L.marker([lat, lon], { Icon: '' })
      // .on('mouseover', function() {
      //  this.bindPopup(PubMsg + '<br>' + Direction).openPopup();
      // });
      TrainLayerGroup.addLayer(Smarker)
    }

    TrainLayerGroup.addTo(gettingAroundMap)
  }
}

d3.select('#bikes-checkbox').on('click', function () {
  const cb = d3.select(this)
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false)
      if (gettingAroundMap.hasLayer(bikesCluster)) {
        gettingAroundMap.removeLayer(bikesCluster)
      }
    } else {
      cb.classed('active', true)
      if (!gettingAroundMap.hasLayer(bikesCluster)) {
        gettingAroundMap.addLayer(bikesCluster)
      }
    }
  }
}
)

d3.select('#carparks-checkbox').on('click', function () {
  const cb = d3.select(this)
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false)
      if (gettingAroundMap.hasLayer(carparkCluster)) {
        gettingAroundMap.removeLayer(carparkCluster)
        gettingAroundMap.fitBounds(luasCluster.getBounds())
      }
    } else {
      cb.classed('active', true)
      if (!gettingAroundMap.hasLayer(carparkCluster)) {
        gettingAroundMap.addLayer(carparkCluster)
      }
    }
  }
})

// TODO: catch cluster or layer
d3.select('#luas-checkbox').on('click', function () {
  const cb = d3.select(this)
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false)
      if (gettingAroundMap.hasLayer(luasLineRed)) {
        gettingAroundMap.removeLayer(luasLineRed)
        gettingAroundMap.removeLayer(luasLineGreen)
        gettingAroundMap.removeLayer(luasIcons)
        gettingAroundMap.removeLayer(luasLayer)
      }
    } else {
      cb.classed('active', true)
      if (!gettingAroundMap.hasLayer(luasLineRed)) {
        gettingAroundMap.addLayer(luasLineRed)
        gettingAroundMap.addLayer(luasLineGreen)
        chooseLookByZoom()
      }
    }
  }
})

d3.select('#motorways-checkbox').on('click', function () {
  const cb = d3.select(this)
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false)
      if (gettingAroundMap.hasLayer(MWayLayerGroup)) {
        gettingAroundMap.removeLayer(MWayLayerGroup)
      }
    } else {
      cb.classed('active', true)
      if (!gettingAroundMap.hasLayer(MWayLayerGroup)) {
        gettingAroundMap.addLayer(MWayLayerGroup)
      }
    }
  }
})

d3.select('#trains-checkbox').on('click', function () {
  const cb = d3.select(this)
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false)
      if (gettingAroundMap.hasLayer(TrainLayerGroup)) {
        gettingAroundMap.removeLayer(TrainLayerGroup)
      }
    } else {
      cb.classed('active', true)
      if (!gettingAroundMap.hasLayer(TrainLayerGroup)) {
        gettingAroundMap.addLayer(TrainLayerGroup)
      }
    }
  }
})

d3.select('#bus-checkbox').on('click', function () {
  const cb = d3.select(this)
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false)
      if (gettingAroundMap.hasLayer(busCluster)) {
        // console.log('Remove train Layrers');
        gettingAroundMap.removeLayer(busCluster)
        // gettingAroundMap.removeLayer(layerGroup);
      }
    } else {
      cb.classed('active', true)
      if (!gettingAroundMap.hasLayer(busCluster)) {
        // console.log('Add train Layrers');
        gettingAroundMap.addLayer(busCluster)
        // gettingAroundMap.addLayer(layerGroup);
      }
    }
  }
})

function getColor (d) {
  return d > 3000 ? '#800026'
    : d > 500 ? '#BD0026'
      : d > 200 ? '#E31A1C'
        : d > 100 ? '#FC4E2A'
          : d > 50 ? '#FD8D3C'
            : d > 20 ? '#FEB24C'
              : d > 10 ? '#FED976'
                : '#FFEDA0'
}

// initalise API activity icons
d3.json('/data/api-status.json')
  .then(function (data) {
    // console.log("api status "+JSON.stringify(data));
    if (data.dublinbikes.status === 200 && !(d3.select('#bikes-checkbox').classed('disabled'))) {
      d3.select('#bike-activity-icon').attr('src', '/images/icons/activity.svg')
      d3.select('#bike-age')
        .text('Awaitng data...') // TODO: call to getAge function from here
    } else {
      d3.select('#bike-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
      d3.select('#bike-age')
        .text('Unavailable')
    }

    if (data.dublinbus.status === 200 && !(d3.select('#bus-checkbox').classed('disabled'))) {
      d3.select('#bus-activity-icon').attr('src', '/images/icons/activity.svg')
      d3.select('#bus-age')
        .text('Awaitng data...') // TODO: call to getAge function from here
    } else {
      d3.select('#bus-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
      d3.select('#bus-age')
        .text('Unavailable')
    }

    if (data.carparks.status === 200 && !(d3.select('#carparks-checkbox').classed('disabled'))) {
      d3.select('#parking-activity-icon').attr('src', '/images/icons/activity.svg')
      d3.select('#parking-age')
        .text('Awaitng data...') // TODO: call to getAge function from here
    } else {
      d3.select('#parking-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
      d3.select('#parking-age')
        .text('Unavailable')
    }

    if (data.luas.status === 200 && !(d3.select('#luas-checkbox').classed('disabled'))) {
      d3.select('#luas-activity-icon').attr('src', '/images/icons/activity.svg')
      d3.select('#luas-age')
        .text('Awaitng data...')
    } else {
      d3.select('#luas-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
      d3.select('#luas-age')
        .text('Unavailable')
    }

    if (data.train.status === 200 && !(d3.select('#trains-checkbox').classed('disabled'))) {
      d3.select('#train-activity-icon').attr('src', '/images/icons/activity.svg')
      d3.select('#train-age')
        .text('Awaitng data...')
    } else {
      d3.select('#train-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
      d3.select('#train-age')
        .text('Unavailable')
    }

    if (data.traveltimes.status === 200 && !(d3.select('#motorways-checkbox').classed('disabled'))) {
      d3.select('#motorway-activity-icon').attr('src', '/images/icons/activity.svg')
      d3.select('#motorway-age')
        .text('Awaitng data...')
    } else {
      d3.select('#motorway-activity-icon').attr('src', '/images/icons/alert-triangle.svg')
      d3.select('#motorway-age')
        .text('Unavailable')
    }
  })
  .catch(function (err) {
    console.error('Error fetching API status file data')
  })

// fetchtraindata2();
