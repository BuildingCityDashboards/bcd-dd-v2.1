/************************************
 * Bikes
 ************************************/
import { BCDStackedAreaChart } from '../../modules/BCDStackedAreaChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'

Promise.all([
  d3.json('/data/Transport/dublinbikes/day.json'),
  d3.json('/data/Transport/dublinbikes/week.json'),
  d3.json('/data/Transport/dublinbikes/month.json')
])
  .then(data => {
    // console.log("Bikes data length " + data[0].length);
    // const dayFormat = d3.timeFormat("%a, %I:%M");
    const keys = ['Bikes in use', 'Bikes available'] // this controls stacking order

    const dataDay = data[0]
    const dataWeek = data[1]
    const dataMonth = data[2]

    // TODO: is coercing to a date on the client  slow for large query spans (month)?

    /* For stacked area chart */
    dataDay.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      d.date = new Date(d.date)
    })

    dataWeek.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      d.date = new Date(d.date)
    })

    dataMonth.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      d.date = new Date(d.date)
    })

    /* For multiline chart */
    // dataDay.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });
    //
    // dataWeek.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });
    //
    // dataMonth.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });

    // console.log('Bikes Keys: ' + JSON.stringify(keys))
    // console.log(dataDay)

    const dublinBikesContent = {
      e: 'chart-dublinbikes',
      d: dataDay,
      // k: dublinBikesData, //?
      ks: keys, // For StackedAreaChart-formatted data need to provide keys
      xV: 'date', // expects a date object
      yV: 'value',
      tX: 'Time', // string axis title
      tY: 'No of bikes'
    }

    const dublinBikesChart = new BCDStackedAreaChart(dublinBikesContent)
    redraw(dataDay)

    d3.select('#btn-dublinbikes-day').on('click', function () {
      redraw(dataDay)
      activeBtn('#btn-dublinbikes-day')
    })

    d3.select('#btn-dublinbikes-week').on('click', function () {
      redraw(dataWeek)
      activeBtn('#btn-dublinbikes-week')
    })

    d3.select('#btn-dublinbikes-month').on('click', function () {
      redraw(dataMonth)
      activeBtn('#btn-dublinbikes-month')
    })

    window.addEventListener('resize', () => {
      redraw()
    })

    function redraw (data) {
      if (data) {
        dublinBikesChart.d = data
        updateTextInfo(data)
      }
      dublinBikesChart.drawChart()
      dublinBikesChart.addTooltip('Dublin Bikes at ', 'thousands', 'label', '', '')
      dublinBikesChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12, 14])
      dublinBikesChart.showSelectedLabelsY([0, 3, 6, 9, 12, 15])
    }
  }).catch(function (error) {
    console.log(error)
  })

function chartContent (data, key, value, date, selector) {
  data.forEach(function (d) { // could pass types array and coerce each matching key using dataSets()
    d.label = d[date]
    d.date = parseYearMonth(d[date])
    d[value] = +d[value]
  })

  // nest the processed data by regions
  const nest = d3.nest().key(d => {
    return d[key]
  }).entries(data)

  // get array of keys from nest
  const keys = []
  nest.forEach(d => {
    keys.push(d.key)
  })

  return {
    e: selector,
    d: nest,
    xV: date,
    yV: value
  }
}

function updateTextInfo (data) {
  // console.log("Bikes data " + JSON.stringify(data) + "\n");
  const peakUse = getMax(data, 'Bikes in use')
  d3.select('#bikes-in-use-count').text(peakUse['Bikes in use'])
  d3.select('#max-bikes-use-time').text(peakUse.label.split(',')[0])
  d3.select('#bikes-available').text(peakUse['Bikes available'])
  // d3.select('#stands-count').html(bikeStands);

  // console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
  // console.log("# of bike stations is " + data_.length + "\n");
}
// ars are array and property to be evaluated as a string
function getMax (data, p) {
  const max = data.reduce((acc, curr) => {
    return acc[p] > curr[p] ? acc : curr
  })
  // console.log('Bikes info ' + JSON.stringify(max))
  return max
};
