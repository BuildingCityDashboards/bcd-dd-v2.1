import { getDateFromToday } from '../../modules/bcd-date.mjs'
import { getTrafficQueryForDate } from '../../modules/bcd-helpers-traffic.mjs'
import { groupByNumber } from '../../modules/bcd-helpers-traffic.mjs'
import { trafficJoin } from '../../modules/bcd-helpers-traffic.mjs'

(async () => {
/************************************
 * Traffic counter data
 ************************************/

  let osmTrafficCounters = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
  })
  let trafficCountersMap = new L.Map('map-traffic-counters')
  trafficCountersMap.setView(new L.LatLng(dubLat, dubLng), zoom)
  trafficCountersMap.addLayer(osmTrafficCounters)
  let markerRefTrafficCounters // TODO: fix horrible hack!!!
  trafficCountersMap.on('popupopen', function (e) {
    markerRefDisabledPark = e.popup._source

   // console.log("ref: "+JSON.stringify(e));
  })

  let trafficCountersMapIcon = L.icon({
    iconUrl: '/images/transport/car-15.svg',
    iconSize: [20, 20] // orig size
    // iconAnchor: [iconAX, iconAY] //,
   // popupAnchor: [-3, -76]
  })

  const trafficCountersMarker = L.Marker.extend({
    options: {
      id: 0
    }
  })

  const trafficCountersPopupOptons = {
    // 'maxWidth': '500',
    className: 'trafficCounterPopup'
  }

  let trafficCountersCluster = L.markerClusterGroup()

  try {
    // need to be able to look up the static data using cosit as key
    // want an array of objects for dublin sensors
    const counterSiteData = await d3.text('./data/transport/tmu-traffic-counters.dat')
    let rows = await d3.tsvParseRows(counterSiteData)
    // console.log(rows.length)
    let dublinSensors = rows
    .filter(row => {
      return row[0].includes('Dublin')
    })
    .map(row => {
      let obj = {
        id: +row[1],
        'description': row[0],
        'lat': +row[5],
        'lng': +row[6]
      }
      return obj
    })

    // console.log(dublinSensors)
    let yesterdayQuery = getTrafficQueryForDate(getDateFromToday(-1))
    // console.log('yesterdayQuery: ' + yesterdayQuery)

    let minus8DaysQuery = getTrafficQueryForDate(getDateFromToday(-8))
    // console.log('minus7Days: ' + minus7DaysQuery)

    let minus29DaysQuery = getTrafficQueryForDate(getDateFromToday(-29))
    // console.log('minus29DaysQuery: ' + minus29DaysQuery)

    let minus85DaysQuery = getTrafficQueryForDate(getDateFromToday(-85))
    // console.log('minus85DaysQuery: ' + minus85DaysQuery)

    let dataCSVQuery1 = await d3.csv('api/traffic?q=' + yesterdayQuery) // returns array of objects
    // console.log('dataCSVQuery[0]: ')
    // console.log(dataCSVQuery1[0])

    let dataCSVQuery8 = await d3.csv('api/traffic?q=' + minus8DaysQuery)
    // console.log('dataCSVQuery: ' + dataCSVQuery7.length)

    let dataCSVQuery29 = await d3.csv('api/traffic?q=' + minus29DaysQuery)
    // console.log('dataCSVQuery: ' + dataCSVQuery28.length)

    let dataCSVQuery85 = await d3.csv('api/traffic?q=' + minus85DaysQuery)
    // console.log('dataCSVQuery :' + dataCSVQuery84.length)

    // need the vehicle count, indexed by cosit number
    let dataObj1 = groupByNumber(dataCSVQuery1, 'cosit')
    // let dataObj8 = groupByNumber(dataCSVQuery8, 'cosit')
    // let dataObj29 = groupByNumber(dataCSVQuery29, 'cosit')
    // let dataObj85 = groupByNumber(dataCSVQuery85, 'cosit')

    console.log('dataObj1: ')
    console.log(dataObj1)

    // for each dublin sensor object in the array, join the count
    // mutates original array

    trafficJoin(dublinSensors, dataObj1)

    // trafficJoin(dublinSensors, dataObj7)
    // trafficJoin(dublinSensors, dataObj28)
    // trafficJoin(dublinSensors, dataObj84)

    console.log('dublinSensors final -')
    console.log(dublinSensors[0])

    dublinSensors.forEach(d => {
      let marker = new trafficCountersMarker(
        new L.LatLng(d.lat, d.lng), {
          id: d.id,
          icon: trafficCountersMapIcon,
          opacity: 0.9,
          title: d.description.split(',')[0], // shown in rollover tooltip
          alt: 'traffic counter icon'

        })
      trafficCountersMap.addLayer(marker)
      marker.bindPopup(getPopup(d))
      // marker.on('click', loggy(d))
    })
    // trafficCountersMap.addLayer(trafficCountersCluster)
  } catch (e) {
    console.error('error fetching traffic data')
    console.error(e)
  }
})()

function getPopup (d_) {
  if (!d_.id) {
    const str = '<div class="popup-error">' +
      '<div class="row ">' +
      "We can't get this traffic counter data right now, please try again later" +
      '</div>' +
      '</div>'
    return str
  }
  let str = '<div class="traffic-counter-popup-container">'
  str += '<div class="row ">'
  str += '<span id="traffic-counter-id-' + d_.id + '" class="col-9">' // id for name div
  if (d_.description) {
    str += '<strong>' + d_.description.split(',')[1] + '\t #' + d_.id + '</strong>'
  }
  str += '</span>' // close bike name div
  str += '</div>' // close row
  str += '<div class="row">'
  if (d_.description) {
    str += '<span class="col-9">' + d_.description.split(',')[0] + '</span>'
  }
  str += '</div>' // close row
  str += '<div class="row ">'
  str += '<span class="col-12" id="traffic-counter-' + d_.id + '-total" >' + unpackSensorData(d_) + '</span>'
  str += '</div>' // close row

  // initialise div to hold chart with id linked to station id
  // if (d_.st_ID) {
  //   str += '<div class="row ">'
  //   str += '<span id="bike-spark-' + d_.st_ID + '"></span>'
  //   str += '</div>'
  // }
  str += '</div>' // closes container
  return str
}

function unpackSensorData (d_) {
  try {
    return Object.keys(d_.dates)
  } catch (e) {
    return 'Error getting data for ' + d_.id
  }
}
