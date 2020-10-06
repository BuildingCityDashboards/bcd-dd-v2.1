import { getDateFromToday, formatDateAsDDMMYY } from '../../modules/bcd-date.js'

import { getTrafficQueryForDate, groupByNumber } from '../../modules/bcd-helpers-traffic.js'

import { ChartLinePopup } from '../../modules/bcd-chart-line-popup.js'
/************************************
 * Traffic counter data
 ************************************/

(async () => {
  const stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>'
  const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
  const dubLat = 53.3498
  const dubLng = -6.2603
  const min_zoom = 8
  const max_zoom = 18
  const zoom = 10

  let osmTrafficCounters
  let trafficCountersMap
  try {
    osmTrafficCounters = new L.TileLayer(stamenTonerUrl_Lite, {
      minZoom: min_zoom,
      maxZoom: max_zoom,
      attribution: stamenTonerAttrib
    })

    trafficCountersMap = new L.Map('map-traffic-counters', {
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile
    })
    trafficCountersMap.setView(new L.LatLng(dubLat, dubLng), zoom)
    trafficCountersMap.addLayer(osmTrafficCounters)
  } catch (e) {
    console.log(e)
  }

  const trafficCounterMapIcon = L.icon({
    iconUrl: '/images/transport/car-15.svg',
    iconSize: [20, 20] // orig size
    // iconAnchor: [iconAX, iconAY] //,
    // popupAnchor: [-3, -76]
  })

  const trafficCounterMarker = L.Marker.extend({
    options: {
      id: 0
    }
  })

  const trafficCounterPopupOptons = {
    // 'maxWidth': '500',
    // 'className': 'leaflet-popup'
  }

  try {
    const dublinCounters = await getCounters()
    const daysToFetch = [-1, -2, -3, -8, -15, -22, -29, -36, -43, -85, -183]
    const readingsGrouped = await getReadings(daysToFetch)

    // create markers for each counter, join reading to static site data and add to map
    const trafficCounters = new L.LayerGroup()
    dublinCounters.forEach(d => {
      d.values = getReadingsForCounter(readingsGrouped, d)
      const marker = new trafficCounterMarker(
        new L.LatLng(d.lat, d.lng), {
          id: d.id,
          icon: trafficCounterMapIcon,
          opacity: 0.9,
          title: d.description.split(',')[0], // shown in rollover tooltip
          alt: 'traffic counter icon'
        })

      marker.bindPopup(getPopup(d), trafficCounterPopupOptons)
      marker.on('popupopen', () => {
        getPlot(d)
      })

      trafficCounters.addLayer(marker)
    })
    // console.log('dublinCounters final -')
    // console.log(dublinCounters[0])

    trafficCountersMap.addLayer(trafficCounters)
  } catch (e) {
    console.error('error fetching traffic data')
    console.error(e)
  }
})()

async function getCounters () {
  // need to be able to look up the static data using cosit as key
  // want an array of objects for dublin counters
  const counterSiteData = await d3.text('../../data/Transport/tmu-traffic-counters.dat')
  const rows = await d3.tsvParseRows(counterSiteData)
  console.log(rows.length)
  const counters = rows
    .filter(row => {
      return row[0].includes('Dublin')
    })
    .map(row => {
      const obj = {
        id: +row[1],
        description: row[0],
        lat: +row[5],
        lng: +row[6]
      }
      return obj
    })

  return counters
}

async function getReadings (days) {
  const queries = days.map(d => {
    return getTrafficQueryForDate(getDateFromToday(d))
  })

  const responsePromises = queries.map(async q => {
    const response = await d3.csv('../api/traffic?q=' + q)
    return response
  })
  const responses = await Promise.all(responsePromises)

  let readings = groupByNumber(responses[responses.length - 1], 'cosit')
  for (let i = responses.length - 2; i >= 0; i -= 1) {
    readings = groupByNumber(responses[i], 'cosit', readings)
  }

  return readings
}

function getPopup (d_) {
  let str = ''
  if (!d_.id) {
    str += '<div class="leaflet-popup-error">' +
      '<div class="row ">' +
      "We can't get this traffic counter data right now, please try again later" +
      '</div>' +
      '</div>'
    return str
  }
  // let str = '<div class="traffic-counter-popup-container" >'
  str += '<div class="leaflet-popup-title">'
  str += '<span id="traffic-counter-id-' + d_.id + '">' // id for name div
  if (d_.description) {
    str += '<strong>' + d_.description.split(',')[1] + '\t #' + d_.id + '</strong>'
  }
  str += '</span>' //
  str += '</div>' // close title div
  str += '<div class="leaflet-popup-subtitle">'
  // str += '<div class="row">'
  if (d_.description) {
    str += '<span>' + d_.description.split(',')[0] + '</span>'
  }
  str += '</div>' // close subtitle
  // str += '<div class="row ">'
  str += '<div class="leaflet-popup-chart" id="traffic-counter-' + d_.id + '-total">' + '' + '</div>'
  // str += '</div>' // close row
  // str += '</div>' // closes container
  return str
}

function getPlot (d_) {
  const div = `#traffic-counter-${d_.id}-total`
  d_.values.forEach(d => {
    d.date = new Date(d.date) // convert key date string to date
    d.total = +d.total
    d.label = formatDateAsDDMMYY(d.date)
  })

  const config = {
    d: d_.values,
    e: div,
    yV: 'total',
    xV: 'date',
    dL: 'label',
    titleLabel: 'daily vehicles'
  }
  const chart = new ChartLinePopup(config)

  return chart
}

function getReadingsForCounter (rs_, d_) {
  try {
    const dateKeys = Object.keys(rs_[d_.id].dates)
    const values = dateKeys.map(
      date => {
        return { date: date, total: rs_[d_.id].dates[date].total }
      })

    return values
  } catch (e) {
    console.warn('traffic sensor #' + d_.id + ' ' + e)
    return []
  }
}
