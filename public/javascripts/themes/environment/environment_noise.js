import { ChartLinePopup } from '../../modules/bcd-chart-line-popup.js'
import { formatDateAsDDMMYY } from '../../modules/bcd-date.js'

(async () => {
  proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
  +x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
  var firstProjection = 'EPSG:29902'
  var secondProjection = 'EPSG:4326'

  let osmnoiseMonitors = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
  })
  let noiseMap = new L.Map('map-noise-monitors')
  noiseMap.setView(new L.LatLng(dubLat, dubLng), 11)
  noiseMap.addLayer(osmnoiseMonitors)
  let noiseMapIcon = L.icon({
    iconUrl: './images/environment/microphone-black-shape.svg',
    iconSize: [20, 20] // orig size
    // iconAnchor: [iconAX, iconAY] //,
   // popupAnchor: [-3, -76]
  })
  const noiseMarker = L.Marker.extend({
    options: {
      id: 0
    }
  })

  const noisePopupOptons = {
    // 'maxWidth': '500',
    // 'className': 'leaflet-popup'
  }

  try {
    let noiseSitesLayer = new L.LayerGroup()
    let noiseSites = await getSites('./data/Environment/soundsites.json', 'sound_monitoring_sites')
    let allSitesPromises = noiseSites.map(async d => {
      let marker = new noiseMarker(
        new L.LatLng(d.lng, d.lat), {
          id: d.id,
          // icon: trafficCounterMapIcon,
          opacity: 0.9,
          title: 'Noise Monitor Site', // shown in rollover tooltip
          alt: 'noise monitor icon',
          icon: noiseMapIcon
        })
      marker.bindPopup(getPopup(d), noisePopupOptons)
      marker.on('popupopen', () => {
        getPlot(d)
      })
      noiseSitesLayer.addLayer(marker)
      let siteReadings = await getSiteReadings(d)
      return siteReadings
    })
    let allSitesData = await Promise.all(allSitesPromises)

    noiseMap.addLayer(noiseSitesLayer)
    // noiseMap.fitBounds(noiseCluster.getBounds())
    console.log(allSitesData)

    const noiseChartOptions = {
      e: '#chart-noise-monitors',
      d: allSitesData[1],
      k: 'id', // ?
      // ks: keys, // For StackedAreaChart-formatted data need to provide keys
      xV: 'date', // expects a date object
      yV: 'value',
      tX: 'Time', // string axis title
      tY: 'dB'
    }

    let noiseChart = new MultiLineChart(noiseChartOptions)
    noiseChart.drawChart()
    // noiseChart.addTooltip('Noise Level % Change - ', 'percentage2', 'label')

    d3.select('#map-noise-monitors').style('display', 'block')
    d3.select('#chart-noise-monitors').style('display', 'none')

    d3.select('#btn-noise-chart').on('click', function () {
      activeBtn(this)
      d3.select('#chart-noise-monitors').style('display', 'block')
      d3.select('#map-noise-monitors').style('display', 'none')
      noiseChart.drawChart()
      // noiseChart.addTooltip('Noise Level % Change - ', 'percentage2', 'label')
    })

    d3.select('#btn-noise-map').on('click', function () {
      activeBtn(this)
      d3.select('#chart-noise-monitors').style('display', 'none')
      d3.select('#map-noise-monitors').style('display', 'block')
    })
  } catch (e) {
    console.log(e)
  }
})()

async function getSites (url, key) {
  // need to be able to look up the static data using cosit as key
  // want an array of objects for dublin counters
  let siteData = await d3.json(url)
  siteData = siteData[key].map(site => {
    let obj = {
      id: +site.site_id,
      name: site.name,
      'lat': +site.lat,
      'lng': +site.lon
    }
    return obj
  })
  return siteData
}

function getPopup (d_) {
  let str = ''
  if (!d_.id) {
    str += '<div class="leaflet-popup-error">' +
      '<div class="row ">' +
      "We can't get this data right now, please try again later" +
      '</div>' +
      '</div>'
    return str
  }
  str += '<div id="noise-site-' + d_.id + '">'
  str += '<div class="leaflet-popup-title">'
  str += '<span>' // id for name div
  if (d_.name) {
    str += '<strong>' + d_.name + '</strong>'
  }
  str += '</span>' //
  str += '</div>' // close title div
  str += '<div id="noise-site-' + d_.id + '-subtitle" class="leaflet-popup-subtitle">Latest data for '
  str += '</div>' // close subtitle
  str += '<div class="leaflet-popup-chart" id="noise-site-' + d_.id + '-plot">' + '' + '</div>'
  str += '</div>' // close popup

  return str
}

async function getSiteReadings (d_) {
  // console.log(d_)

  let readings = await d3.json('../data/Environment/noise_levels/sound_reading_' + d_.id + '.json')
  // console.log(readings.times)

  let data = readings.dates.map((d, i) => {
    let date = d.split('/')[0]
    let m = parseInt(d.split('/')[1]) - 1
    let y = d.split('/')[2]
    date = new Date(y, m, date) // convert key date string to date

    let h = readings.times[i].split(':')[0]
    let min = readings.times[i].split(':')[1]
    date.setHours(h)
    date.setMinutes(min)
    // console.log(date)

    // let divId = `noise-site-${d_.id}`
    // document.getElementById(divId + '-subtitle').innerHTML = `Latest data for ${readings.dates[0]}`
    return {
      date: date,
      value: +readings.aleq[i],
      label: date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
    }
  })
  return data
}

async function getPlot (d_) {
  let divId = `noise-site-${d_.id}`
  let data = await getSiteReadings(d_)

  // console.log(data[0])

  // console.log(divId + '-subtitle')
  const options = {
    d: data,
    e: '#' + divId + '-plot',
    yV: 'value',
    xV: 'date',
    dL: 'label',
    titleLabel: 'dB'
  }
  let chart = new ChartLinePopup(options)
  return chart
}

// // Get the readings so far today
// async function getReadings (d_) {
//   ld3.json('../data/Environment/noise_levels/sound_reading_' + d_.id + '.json')
//     .then(function (reading) {
//       if (reading.aleq) {
//         let lastRead = reading.aleq[reading.aleq.length - 1]
//         let lastTime = reading.times[reading.times.length - 1]
//         let lastDate = reading.dates[reading.dates.length - 1]
//         // p_.setContent(getnoisesiteContent(d_, ) +
//         //   '<h2>' + lastRead + ' dB</h2>' +
//         //   'Updated at ' +
//         //   lastTime +
//         //   ' on ' + lastDate
//         // )
//         // p_.update()
//       } else {
//         // p_.setContent(p_.getContent() +
//         //   '<br> Data currently unavailable')
//         // p_.update()
//       }
//     })
// }

// function getPlot (d) {
//   let sid_ = d.options.id
//   d3.json('/api/noise/noisesites/' + sid_ + '/today').then(function (stationData) {
//     let noisesiteSpark = dc.lineChart('#noise-spark-' + sid_)
//     if (stationData.length == 0) {
//       let str = '<div class="popup-error">' +
//         '<div class="row ">' +
//         "We can't get the noise monitoring data right now, please try again later" +
//         '</div>' +
//         '</div>'
//       return d3.select('#bike-spark-' + sid_)
//         .html(str)
//     }
//     let standsCount = stationData[0].bike_stands
//     let ndx = crossfilter(stationData)
//     let timeDim = ndx.dimension(function (d) {
//       return d['last_update']
//     })
//     let latest = timeDim.top(1)[0].last_update
//
//     let availableBikesGroup = timeDim.group().reduceSum(function (d) {
//       return d['available_bikes']
//     })
//
//     let start = moment.utc().startOf('day').add(3, 'hours')
//     let end = moment.utc().endOf('day').add(2, 'hours')
//
//     noisesiteSpark.width(250).height(100)
//     noisesiteSpark.dimension(timeDim)
//     noisesiteSpark.group(availableBikesGroup)
//
//     noisesiteSpark.x(d3.scaleTime().domain([start, end]))
//     noisesiteSpark.y(d3.scaleLinear().domain([0, standsCount]))
//     noisesiteSpark.margins({
//       left: 20,
//       top: 15,
//       right: 20,
//       bottom: 20
//     })
//     noisesiteSpark.xAxis().ticks(3)
//     noisesiteSpark.renderArea(true)
//     noisesiteSpark.renderDataPoints(false)
//     //        noisesiteSpark.renderDataPoints({radius: 10});//, fillOpacity: 0.8, strokeOpacity: 0.0});
//     noisesiteSpark.renderLabel(false) //, fillOpacity: 0.8, strokeOpacity: 0.0}); //labels on points -> how to apply to last point only?
//     noisesiteSpark.label(function (d) {
//       if (d.x === latest) {
//         console.log(JSON.stringify(d))
//         let hour = new Date(d.x).getHours()
//         let mins = new Date(d.x).getMinutes().toString().padStart(2, '0')
//         let end = ((d.y == 1) ? ' bike' : ' bikes')
//         //                let str = hour + ':' + mins +
//         let str = JSON.stringify(d.y) + end
//         //                console.log(str);
//         return str
//       }
//       return ''
//     })
//
//     noisesiteSpark.renderVerticalGridLines(true)
//     noisesiteSpark.useRightYAxis(true)
//     noisesiteSpark.xyTipsOn(false)
//     noisesiteSpark.brushOn(false)
//     noisesiteSpark.clipPadding(15)
//     noisesiteSpark.render()
//   })
// }

function processnoisesites (data_) {
  // console.log("noise data \n"+ JSON.stringify(data_));
  data_.forEach(function (d) {
    d.type = 'noise Level Monitor'
    // console.log("d:" + JSON.stringify(d["lat"]));
  })
  initMapnoisesites(data_)
}
