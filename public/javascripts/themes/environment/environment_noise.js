import { ChartLinePopup } from '../../modules/bcd-chart-line-popup.js'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { formatDateAsDDMMYY } from '../../modules/bcd-date.js'
import { isToday } from '../../modules/bcd-date.js'
import { getDefaultMapOptions } from '../../modules/bcd-maps.js'
import { getDublinLatLng } from '../../modules/bcd-maps.js'
(async () => {
  // console.log('load noise charts')
  let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'

  try {
    proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
  +x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
    var firstProjection = 'EPSG:29902'
    var secondProjection = 'EPSG:4326'

    let osmnoiseMonitors = new L.TileLayer(stamenTonerUrl_Lite, getDefaultMapOptions())
    let noiseMap = new L.Map('map-noise-monitors', {
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile
    })
    noiseMap.setView(getDublinLatLng(), 11)
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

    let noiseSitesLayer = new L.LayerGroup()
    let noiseSites = await getSites('./data/Environment/soundsites.json', 'sound_monitoring_sites')
    let allSitesPromises = noiseSites.map(async d => {
      let marker = new noiseMarker(
        new L.LatLng(d.lng, d.lat), {
          id: d.id,
          opacity: 0.9,
          title: 'Noise Monitor Site', // shown in rollover tooltip
          alt: 'noise monitor icon',
          icon: noiseMapIcon,
          type: 'Noise Level Monitor'
        })
      marker.bindPopup(getPopup(d), noisePopupOptons)
      marker.on('popupopen', () => {
        getPopupPlot(d)
      })
      noiseSitesLayer.addLayer(marker)
      let siteReadings = await getSiteReadings(d)
      return siteReadings
    })
    let allSitesData = await Promise.all(allSitesPromises)
    let allSitesFlat = allSitesData.flat(1)
    allSitesFlat = allSitesFlat.filter((s, i) => {
      return isToday(s.date) && (parseInt(s.date.getHours()) < 10) // // TODO: remove demo hack
    })
    // console.log('allSitesFlat')
    // console.log(allSitesFlat)

    noiseMap.addLayer(noiseSitesLayer)
    // noiseMap.fitBounds(noiseCluster.getBounds())
    // console.log(allSitesFlat)

    const noiseChartOptions = {
      e: '#chart-noise-monitors',
      d: allSitesFlat,
      k: 'name', // ?
      // ks: keys, // For StackedAreaChart-formatted data need to provide keys
      xV: 'date', // expects a date object
      yV: 'value',
      tX: 'Time today', // string axis title
      tY: 'dB'
    }

    let noiseChart = new MultiLineChart(noiseChartOptions)

    function redraw () {
      if (document.querySelector('#chart-noise-monitors').style.display !== 'none') {
        noiseChart.drawChart()
        noiseChart.addTooltip('Noise Level (Decibels) - ', '', 'label')
      }
    }
    redraw()

    d3.select('#map-noise-monitors').style('display', 'block')
    d3.select('#chart-noise-monitors').style('display', 'none')

    d3.select('#btn-noise-chart').on('click', function () {
      activeBtn(this)
      d3.select('#chart-noise-monitors').style('display', 'block')
      d3.select('#map-noise-monitors').style('display', 'none')
      noiseChart.drawChart()
      noiseChart.addTooltip('Noise level (Decibels) - ', '', 'label')
    })

    d3.select('#btn-noise-map').on('click', function () {
      activeBtn(this)
      d3.select('#chart-noise-monitors').style('display', 'none')
      d3.select('#map-noise-monitors').style('display', 'block')
    })

    window.addEventListener('resize', () => {
      redraw()
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
  str += '<span><strong>' + d_.id + '. '// id for name div
  if (d_.name) {
    str += '' + d_.name
  }
  str += '</strong></span>' //
  str += '</div>' // close title div
  str += '<div id="noise-site-' + d_.id + '-subtitle" class="leaflet-popup-subtitle">'
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
    // console.log(date)
    let datum = {
      id: d_.id,
      name: d_.name,
      date: date,
      value: +readings.aleq[i],
      label: date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')

    }
    // if (i == 0) console.log(datum)
    return datum
  })
  return data
}

async function getPopupPlot (d_) {
  let divId = `noise-site-${d_.id}`
  let data = await getSiteReadings(d_)

    // isToday(s.date)

  // console.log(data[0])
  if (data[0]) {
  if (isToday(data[0].date)) {
    document.getElementById(divId + '-subtitle').innerHTML =
    data[0].date.toString().split(' ')[0] + ' ' +
    data[1].date.toString().split(' ')[1] + ' ' +
    data[2].date.toString().split(' ')[2]
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
  }
  let str = '<div class="popup-error">' +
          '<div class="row ">' +
          "We can't get the noise monitoring data for this location right now, please try again later" +
          '</div>' +
          '</div>'
        // return d3.select('#bike-spark-' + sid_)
        //   .html(str)
  document.getElementById(divId + '-plot').innerHTML = str
  return str
}

function activeBtn (e) {
  let btn = e
  $(btn).siblings().removeClass('active')
  $(btn).addClass('active')
}
