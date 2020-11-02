import { ChartLinePopup } from '../../modules/bcd-chart-line-popup.js'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addErrorMessage } from '../../modules/bcd-ui.js'
import { isToday } from '../../modules/bcd-date.js'
import { getDefaultMapOptions, getDublinLatLng } from '../../modules/bcd-maps.js'

(async () => {
  // console.log('load noise charts')

  d3.select('#map-noise-monitors').style('display', 'block')
  d3.select('#chart-noise-monitors').style('display', 'none')

  const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'

  try {
    proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
  +x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
    var firstProjection = 'EPSG:29902'
    var secondProjection = 'EPSG:4326'

    const osmnoiseMonitors = new L.TileLayer(stamenTonerUrl_Lite, getDefaultMapOptions())
    const noiseMap = new L.Map('map-noise-monitors', {
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile
    })
    noiseMap.setView(getDublinLatLng(), 11)
    noiseMap.addLayer(osmnoiseMonitors)
    const noiseMapIcon = L.icon({
      iconUrl: '../images/environment/microphone-black-shape.svg',
      iconSize: [20, 20] // orig size
      // iconAnchor: [iconAX, iconAY] //,
      // popupAnchor: [-3, -76]
    })
    const NoiseMarker = L.Marker.extend({
      options: {
        id: 0
      }
    })

    const noisePopupOptons = {
      // 'maxWidth': '500',
      // 'className': 'leaflet-popup'
    }

    const noiseSitesLayer = new L.LayerGroup()
    const noiseSites = await getSites('../data/Environment/soundsites.json', 'sound_monitoring_sites')
    // console.log(noiseSites)

    const allSitesPromises = noiseSites.map(async d => {
      const marker = new NoiseMarker(
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
      const siteReadings = await getSiteReadings(d)
      // console.log(siteReadings);
      return siteReadings
    })
    const allSitesData = await Promise.all(allSitesPromises)
    // console.log(allSitesData);
    let allSitesFlat = allSitesData.flat(1)
    allSitesFlat = allSitesFlat.filter((s) => {
      return isToday(s.date)
    })

    noiseMap.addLayer(noiseSitesLayer)

    const noiseChartOptions = {
      e: 'chart-noise-monitors',
      d: allSitesFlat,
      k: 'name', // ?
      // ks: keys, // For StackedAreaChart-formatted data need to provide keys
      xV: 'date', // expects a date object
      yV: 'value',
      tX: 'Time today', // string axis title
      tY: 'dB'
    }

    const noiseChart = new BCDMultiLineChart(noiseChartOptions)

    d3.select('#btn-noise-chart').on('click', function () {
      if (document.getElementById('chart-noise-monitors').style.display === 'none') {
        activeBtn(this)
        d3.select('#chart-noise-monitors').style('display', 'block')
        d3.select('#map-noise-monitors').style('display', 'none')
        redraw(noiseChart)
      }
    })

    d3.select('#btn-noise-map').on('click', function () {
      if (document.getElementById('map-noise-monitors').style.display === 'none') {
        activeBtn(this)
        d3.select('#chart-noise-monitors').style('display', 'none')
        d3.select('#map-noise-monitors').style('display', 'block')
      }
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating noise level chart')
    console.log(e)
  }
})()

async function getSites (url, key) {
  // need to be able to look up the static data using cosit as key
  // want an array of objects for dublin counters
  // console.log(url)
  let siteData = await d3.json(url)
  // console.log(siteData);
  siteData = siteData[key].map(site => {
    const obj = {
      id: +site.site_id,
      name: site.name,
      lat: +site.lat,
      lng: +site.lon
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
  // console.log(str);
  return str
}

async function getSiteReadings (d_) {
  const readings = await d3.json('../data/Environment/sound_levels/sound_reading_' + d_.id + '.json')
  // console.log(readings)

  const data = readings.dates.map((d, i) => {
    let date = d.split('/')[0]
    const m = parseInt(d.split('/')[1]) - 1
    const y = d.split('/')[2]
    date = new Date(y, m, date) // convert key date string to date

    const h = readings.times[i].split(':')[0]
    const min = readings.times[i].split(':')[1]
    date.setHours(h)
    date.setMinutes(min)
    // console.log(date)

    // let divId = `noise-site-${d_.id}`
    // document.getElementById(divId + '-subtitle').innerHTML = `Latest data for ${readings.dates[0]}`
    // console.log(date)
    const datum = {
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
  const divId = `noise-site-${d_.id}`
  const data = await getSiteReadings(d_)
  // console.log(data)
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
    const chart = new ChartLinePopup(options)
    return chart
  }

  const str = '<div class="popup-error">' +
    '<div class="row ">' +
    "We can't get the noise monitoring data for this location right now, please try again later" +
    '</div>' +
    '</div>'
  // return d3.select('#bike-spark-' + sid_)
  //   .html(str)
  document.getElementById(divId + '-plot').innerHTML = str
  return str
}

function redraw (chart) {
  if (document.querySelector('#chart-noise-monitors').style.display !== 'none') {
    chart.drawChart()
    chart.addTooltip('Noise Level (Decibels) - ', '', 'label')
  }
}
