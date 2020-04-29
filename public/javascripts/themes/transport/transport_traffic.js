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
    dublinSensors.forEach(d => {
      let marker = new trafficCountersMarker(
        new L.LatLng(d.lat, d.lng), {
          id: d.id,
          icon: trafficCountersMapIcon,
          opacity: 0.9,
          title: d.description.split(',')[0], // shoen in rollover tooltip
          alt: 'traffic counter icon'

        })

      marker.bindPopup(getDefaultPopup(d))
      trafficCountersMap.addLayer(marker)
    })

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
    dublinSensors.forEach(s => {
      updatePopup(s)
    })
    // trafficJoin(dublinSensors, dataObj7)
    // trafficJoin(dublinSensors, dataObj28)
    // trafficJoin(dublinSensors, dataObj84)

    console.log('dublinSensors final -')
    console.log(dublinSensors[0])
  } catch (e) {
    console.error('error fetching traffic data')
    console.error(e)
  }
})()

function getDefaultPopup (d_) {
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
  str += '<span class="col-12" id="traffic-counter-' + d_.id + '-total" > <i>No data</i></span>'
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

function updatePopup (s_) {
  document.getElementById('traffic-counter-1113-total').innerHTML = '50000'
}

    // const dayFormat = d3.timeFormat("%a, %I:%M");
//     let keys = ['Bikes in use', 'Bikes available'] // this controls stacking order
//
//     let dataDay = data[0]
//     let dataWeek = data[1]
//     let dataMonth = data[2]
//
//     // TODO: is coercing to a date on the client  slow for large query spans (month)?
//
//     /* For stacked area chart */
//     dataDay.forEach(d => {
//       //  d["Total available (daily)"] = +d["Total available (daily)"];
//       d['date'] = new Date(d['date'])
//     })
//
//     dataWeek.forEach(d => {
//       //  d["Total available (daily)"] = +d["Total available (daily)"];
//       d['date'] = new Date(d['date'])
//     })
//
//     dataMonth.forEach(d => {
//       //  d["Total available (daily)"] = +d["Total available (daily)"];
//       d['date'] = new Date(d['date'])
//     })
//
//     /* For multiline chart */
//     // dataDay.forEach(d => {
//     //   // d["available_bikes"] = +d["available_bikes"];
//     //   d["key"] = d["key"].replace(/_/g, " ");
//     //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
//     //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
//     //
//     //   // keys.push(d["key"]);
//     //   d["values"].forEach(v => {
//     //     v["date"] = new Date(v["date"]); //parse to date
//     //   });
//     // });
//     //
//     // dataWeek.forEach(d => {
//     //   // d["available_bikes"] = +d["available_bikes"];
//     //   d["key"] = d["key"].replace(/_/g, " ");
//     //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
//     //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
//     //
//     //   // keys.push(d["key"]);
//     //   d["values"].forEach(v => {
//     //     v["date"] = new Date(v["date"]); //parse to date
//     //   });
//     // });
//     //
//     // dataMonth.forEach(d => {
//     //   // d["available_bikes"] = +d["available_bikes"];
//     //   d["key"] = d["key"].replace(/_/g, " ");
//     //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
//     //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
//     //
//     //   // keys.push(d["key"]);
//     //   d["values"].forEach(v => {
//     //     v["date"] = new Date(v["date"]); //parse to date
//     //   });
//     // });
//
//     // console.log("Bikes Keys: " + JSON.stringify(keys));
//
//     const dublinBikesContent = {
//       e: '#chart-dublinbikes',
//       d: dataDay,
//       // k: dublinBikesData, //?
//       ks: keys, // For StackedAreaChart-formatted data need to provide keys
//       xV: 'date', // expects a date object
//       yV: 'value',
//       tX: 'Time', // string axis title
//       tY: 'No of bikes'
//     }
//
//     trafficChart = new StackedAreaChart(dublinBikesContent)
//     trafficChart.drawChart()
//     // addTooltip(title, format, dateField, prefix, postfix)
//     // format just formats comms for thousands etc
//     trafficChart.addTooltip('Dublin Bikes at ', 'thousands', 'label', '', '')
//     updateTextInfo(dataDay)
//
//     d3.select('#dublinbikes_day').on('click', function () {
//       activeBtn(this, trafficChart)
//       trafficChart.d = dataDay
//       trafficChart.drawChart()
//       // trafficChart.updateChart();
//       trafficChart.addTooltip('Dublin Bikes at ', 'thousands', 'label', '', '')
//     })
//
//     d3.select('#dublinbikes_week').on('click', function () {
//       activeBtn(this, trafficChart)
//       trafficChart.d = dataWeek
//       trafficChart.drawChart()
//       // trafficChart.updateChart();
//       trafficChart.addTooltip('Dublin Bikes at ', 'thousands', 'label', '', '')
//     })
//
//     d3.select('#dublinbikes_month').on('click', function () {
//       activeBtn(this, trafficChart)
//       trafficChart.d = dataMonth
//       trafficChart.drawChart()
//       // trafficChart.updateChart();
//       trafficChart.addTooltip('Dublin Bikes at ', 'thousands', 'label', '', '')
//     })
//   }).catch(function (error) {
//     console.log(error)
//   })
//
// // End of bikes data load
//
// function chartContent (data, key, value, date, selector) {
//   data.forEach(function (d) { // could pass types array and coerce each matching key using dataSets()
//     d.label = d[date]
//     d.date = parseYearMonth(d[date])
//     d[value] = +d[value]
//   })
//
//   // nest the processed data by regions
//   const nest = d3.nest().key(d => {
//     return d[key]
//   }).entries(data)
//
//   // get array of keys from nest
//   const keys = []
//   nest.forEach(d => {
//     keys.push(d.key)
//   })
//
//   return {
//     e: selector,
//     d: nest,
//     xV: date,
//     yV: value
//   }
// }
//
// function activeBtn (e, trafficChart) {
//   let btn = e
//   // var act = e.active ? true : false
//   // newOpacity = active ? 0 : 1;
//   $(btn).siblings().removeClass('active')
//   $(btn).addClass('active')
//   let G_chart = trafficChart
//   G_chart.updateChart()
// }
//
// function updateTextInfo (data) {
//   // console.log("Bikes data " + JSON.stringify(data) + "\n");
//   let peakUse = getMax(data, 'Bikes in use')
//   d3.select('#bikes-in-use-count').text(peakUse['Bikes in use'])
//   d3.select('#max-bikes-use-time').text(peakUse['label'].split(',')[0])
//   d3.select('#bikes-available').text(peakUse['Bikes available'])
//   // d3.select('#stands-count').html(bikeStands);
//
//   // console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
//   // console.log("# of bike stations is " + data_.length + "\n");
// }
// // ars are array and property to be evaluated as a string
// function getMax (data, p) {
//   let max = data.reduce((acc, curr) => {
//     return acc[p] > curr[p] ? acc : curr
//   })
//   console.log('Bikes info ' + JSON.stringify(max))
//   return max
// };
