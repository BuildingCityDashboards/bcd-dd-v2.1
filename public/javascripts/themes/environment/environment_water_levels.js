// let popupTime = d3.timeFormat('%a %B %d, %H:%M')
// let dubLat = 53.3498
// let dubLng = -6.2603
// let min_zoom = 8
// let max_zoom = 18
// let zoom = 10
// // tile layer with correct attribution
// let osmUrl = 'http://{s}.tile.openstreetprivateMap.org/{z}/{x}/{y}.png'
// let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-privateMapnik/{z}/{x}/{y}.png'
// let osmUrl_Hot = 'https://{s}.tile.openstreetprivateMap.fr/hot/{z}/{x}/{y}.png'
// let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
// let stamenTerrainUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
// let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
// let osmAttrib = 'Map data © <a href="http://openstreetprivateMap.org">OpenStreetMap</a> contributors'
// let osmAttrib_Hot = '&copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetprivateMap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
// let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>'
// let iconAX = 15 // icon Anchor X
// let iconAY = 15 // icon Anchor Y

try {
  proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\+x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
  var firstProjection = 'EPSG:29902'
  var secondProjection = 'EPSG:4326'
  let waterMapLayerSizes = []

// Add an id field to the markers to match with bike station id
  let customWaterStationMarker = L.Marker.extend({
    options: {
      sid: 0,
      sfn: ''
    }
  })

  let customWaterLayer = L.Layer.extend({

  })

  let watersStationPopupOptons = {
  // 'maxWidth': '500',
    className: 'watersStationPopup'
  }

/************************************
 * OPW Water Levels
 ************************************/
// Custom map icons
  let waterMapIcon = L.icon({
    iconUrl: '/images/environment/water-15.svg',
    iconSize: [15, 15], // orig size
    iconAnchor: [iconAX, iconAY] //,
  // popupAnchor: [-3, -76]
  })

  let osmWater = new L.TileLayer(stamenTerrainUrl, {
    minZoom: min_zoom,
    maxZoom: 12,
    attribution: stamenTonerAttrib
  })

  let waterMap = new L.Map('chart-water-map', {
    dragging: !L.Browser.mobile,
    tap: !L.Browser.mobile
  })
  waterMap.setView(new L.LatLng(dubLat, dubLng), zoom)
  waterMap.addLayer(osmWater)
  let markerRefWater // TODO: fix horrible hack!!!
  waterMap.on('popupopen', function (e) {
    markerRefWater = e.popup._source
  })

  let waterOPWCluster = L.markerClusterGroup()
  function processWaterLevels (data_) {
  // will filter out all data bar Greater Dublin
    let regionData = data_.filter(function (d) {
      return d.properties['station.region_id'] === null // Dublin OPW stations have null id
      ||
      d.properties['station.region_id'] === 10
    })
    regionData.forEach(function (d) {
      d.lat = +d.geometry.coordinates[1]
      d.lng = +d.geometry.coordinates[0]
      d.type = 'OPW GPRS Station Water Level Monitor'
    })
    waterMapLayerSizes[0] = regionData.length

    initMapWaterLevels(regionData)
  };

  function initMapWaterLevels (data__) {
    data__.forEach(function (d, i) {
      station_ref = d.properties['station.ref'].substring(5, 10)
      sensor_ref = d.properties['sensor.ref']
      fname = station_ref.concat('_', sensor_ref).concat('.csv')
      station_name = d.properties['station.name']

      let content = ''

      let m = new customWaterStationMarker(
      new L.LatLng(+d.lat, +d.lng), {
        icon: waterMapIcon,
        sid: d.id,
        sfn: fname
      })

      waterOPWCluster.addLayer(m)

      m.bindPopup(watersStationPopupInit(d), watersStationPopupOptons)
      m.on('popupopen', getOPWPopup)
      waterMap.addLayer(waterOPWCluster)
    })
  };

  function watersStationPopupInit (d_) {
    let station_ref = d_.properties['station.ref'].substring(5, 10)
    let sensor_ref = d_.properties['sensor.ref']
    let fname = station_ref.concat('_', sensor_ref).concat('.csv')
    if (!d_.id) {
      let str = '<div class="popup-error">' +
      '<div class="row ">' +
      "We can't get the Water station data right now, please try again later" +
      '</div>' +
      '</div>'
      return str
    }

    let str = '<div class="bike-popup-container">'
    if (d_.properties['station.name']) {
      str += '<div class="row ">'
      str += '<span id="bike-name-' + d_.id + '" class="leaflet-popup-title col-9">' // id for name div
      str += '<strong>' + d_.properties['station.name'] + 'test' + '</strong>'
      str += '</span>' // close bike name div

      str += '<span id="bike-banking-' + d_.id + '" class= "col-3"></span>'
      str += '</div>' // close row
    }

    str += '<div class="row ">'
    str += '<span id="bike-standcount-' + d_.id + '" class="col-9" ></span>'
    str += '</div>' // close row

  // initialise div to hold chart with id linked to station id
    if (d_.id) {
      str += '<div class=\"row \">'
      str += '<span id="bike-spark-' + d_.id + '"></span>'
      str += '</div>'
    }
    str += '</div>' // closes container
    return str
  }

  function getOPWPopup () {
    let ts = this.options.sfn
    let sid_ = this.options.sid
    var stationdReadingsPerMonthChart = dc.lineChart('#bike-spark-' + sid_)

    d3.csv('/api/wlstations/stations/' + ts).then(function (md) {
      md.forEach(function (d) {
        if (value) {
          var value = +d.value
        }
      })

      var ndx = crossfilter(md)
      var all = ndx.groupAll()

      var datetimeDimension = ndx.dimension(function (d) {
     // d3.isoParse
        return d3.isoParse(d.datetime)
      })

      var valuePerDayGroup = datetimeDimension.group().reduceSum(function (d) {
        return d.value
      })

      function reduceAddAvg (p, v, attr) {
        ++p.count
        p.sum += v[attr]
        p.avg = p.sum / p.count
        return p
      }

      function reduceRemoveAvg (p, v, attr) {
        --p.count
        p.sum -= v[attr]
        p.avg = p.sum / p.count
        return p
      }

      function reduceInitAvg () {
        return {count: 0, sum: 0, avg: 0}
      }

      var statesAvgGroup = datetimeDimension.group().reduce(reduceAddAvg, reduceRemoveAvg, reduceInitAvg, 'value')
      stationdReadingsPerMonthChart
    .width(200)
    .height(100)
    .margins({top: 10, right: 10, bottom: 20, left: 60})
    .dimension(datetimeDimension)
    .group(valuePerDayGroup)
    .x(d3.scaleTime().domain([new Date(md[0].datetime), new Date(md[md.length - 1].datetime)]))
    .y(d3.scaleLinear().domain([0, d3.max(md, function (d) { return d.value + 100 })]))
    .elasticX(false)
    .elasticY(true)
    .margins({
      left: 20,
      top: 15,
      right: 20,
      bottom: 20
    })
      .renderVerticalGridLines(false)
      .useRightYAxis(true)
      .xyTipsOn(false)
      .brushOn(false)
      .clipPadding(15)
      .renderArea(true)
      .renderDataPoints(true)
      .yAxisLabel('value')
      .renderHorizontalGridLines(false)
      // stationdReadingsPerMonthChart.xAxis(d3.axisTop())
      stationdReadingsPerMonthChart.xAxis().ticks(6)
      stationdReadingsPerMonthChart.yAxis().ticks(6)
      stationdReadingsPerMonthChart.render()
    })
  }
/************************************
 * Hydronet
 ************************************/
  let hydronetCluster = L.markerClusterGroup()

  d3.csv('/data/Environment/Register of Hydrometric Stations in Ireland 2017_Dublin.csv').then(function (data) {
    processHydronet(data)
  })

  function processHydronet (data_) {
    data_.forEach(function (d, i) {
      let result = proj4(firstProjection, secondProjection,
      [+d['EASTING'], +d['NORTHING']])
      d.lat = result[1]
      d.lng = result[0]
      d.type = 'Hydronet Water Level Monitor'
    //        console.log("d: " + d["EASTING"]+" | "+d["NORTHING"]);
    //        console.log("dlat " + d.lat+" | dlng "+d.lng);
    })
    waterMapLayerSizes.push(data_.length)
    initMapHydronet(data_)
  };

  function initMapHydronet (data__) {
    data__.forEach(function (d, k) {
      let marker = L.marker(new L.LatLng(d.lat, d.lng), {
        icon: waterMapIcon
      })
      marker.bindPopup(getHydronetContent(d, k))
    // marker.on('popupopen', console.log('OPW open'))
      hydronetCluster.addLayer(marker)
    })
    waterMapLayerSizes[1] = data__.length
    waterMap.addLayer(hydronetCluster)
  }

  function getHydronetContent (d_, k_) {
    let str = ''
    str += '<div class="leaflet-popup-title">'
    if (d_['Station Name']) {
      str += '<b>' + d_['Station Name'] + '</b><br>'
    }
    str += '</div>' // close title div
    if (d_.type) {
      str += '<div class="leaflet-popup-subtitle">'
      str += d_.type + '<br>'
      str += '</div>' // close subtitle
    }
    if (d_.Waterbody) {
      str += '<div class="leaflet-popup-subtitle">'
      str += 'at ' + d_.Waterbody + '<br>'
      str += '</div>' // close subtitle
    }
    if (d_.Owner) {
      str += '<div class="leaflet-popup-subtitle">'
      str += '<br>' + d_.Owner + '<br>'
      str += '</div>' // close subtitle
    }

    if (d_['Station Status']) {
      str += '<div class="leaflet-popup-subtitle" style= "color : green;" ">'
      str += 'Status: <b>' + d_['Station Status'] + '</b><br>'
      str += '</div>' // close subtitle
    }

    return str
  }

  function displayHydronet (k_) {
    return markerRefWater.getPopup().setContent(markerRefWater.getPopup().getContent() +
    '<br><br> Data not currently available<br><br>'
  )
  }

  let displayHydronetBounced = _.debounce(displayHydronet, 100) // debounce using underscore

/************************************
 * Button listeners
 ************************************/
// Note that one button is classed active by default and this must be dealt with

  d3.select('#water-opw-btn').on('click', function () {
    let cb = d3.select('#water-all-btn')
    let cbs = d3.select('#water-hydronet-btn')
    let cbt = d3.select('#water-opw-btn')
    if (cb.classed('active')) {
      cb.classed('active', false)
    }
    if (cbs.classed('active')) {
      cbs.classed('active', false)
    }

    d3.select('#water-site-count').html('<p>The map currently shows:</p><h4>' +
    waterMapLayerSizes[0] + ' OPW sites</h4>')

    waterMap.removeLayer(hydronetCluster)
    if (!waterMap.hasLayer(waterOPWCluster)) {
      waterMap.addLayer(waterOPWCluster)
    }
    waterMap.fitBounds(waterOPWCluster.getBounds())
    cbt.classed('active', true)
  })

  d3.select('#water-hydronet-btn').on('click', function () {
  /* let cb = d3.select('#water-all-btn')
  let cbt = d3.select('#water-hydronet-btn')
  if (cb.classed('active')) {
    cb.classed('active', false)
  } */

    let cb = d3.select('#water-all-btn')
    let cbs = d3.select('#water-opw-btn')
    let cbt = d3.select('#water-hydronet-btn')
    if (cb.classed('active')) {
      cb.classed('active', false)
    }
    if (cbs.classed('active')) {
      cbs.classed('active', false)
    }

    d3.select('#water-site-count').html('<p>The map currently shows:</p> <h4>' +
    waterMapLayerSizes[1] + ' EPA Hydronet sites</h4>')
    waterMap.removeLayer(waterOPWCluster)
    if (!waterMap.hasLayer(hydronetCluster)) {
      waterMap.addLayer(hydronetCluster)
    }
    waterMap.fitBounds(hydronetCluster.getBounds())
    cbt.classed('active', true)
  })

  d3.select('#water-all-btn').on('click', function () {
    let cb = d3.select('#water-hydronet-btn')
    let cbs = d3.select('#water-opw-btn')
    let cbt = d3.select(this)
    if (cb.classed('active')) {
      cb.classed('active', false)
    // cbt.classed('active', true)
    }
    if (cbs.classed('active')) {
      cbs.classed('active', false)
    }

    d3.select('#water-site-count').html('<p>The map currently shows:</p><h4>All ' +
    (waterMapLayerSizes[0] + waterMapLayerSizes[1]) + ' sites</h4>')

    if (!waterMap.hasLayer(waterOPWCluster)) {
      waterMap.addLayer(waterOPWCluster)
    }
    if (!waterMap.hasLayer(hydronetCluster)) {
      waterMap.addLayer(hydronetCluster)
    }
    waterMap.fitBounds(hydronetCluster.getBounds())
    cbt.classed('active', true)
  })
} catch (e) {
  console.log(e)
}
