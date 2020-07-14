import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { StackedAreaChart } from '../../modules/StackedAreaChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'

(async () => {
  const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM05' // gives no of outsideState and ave household size
  let json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

  let dataset = JSONstat(json).Dataset(0)
  console.log('dataset')
  console.log(dataset)
  console.log('dim')
  let dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })
  console.log(dimensions)

  let categoriesType = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  let categoriesStatus = dataset.Dimension(dimensions[1]).Category().map(c => {
    return c.label
  })

  let categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
    return c.label
  })

  let categoriesRegion = dataset.Dimension(dimensions[3]).Category().map(c => {
    return c.label
  })

  let categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
    return c.label
  })

  console.log('categories of ' + dimensions[3])
  console.log(categoriesStamp)

  // let STATS = ['Population (Number)']
  // = ['Total Birth', 'Great Britain', 'U.S.A.', 'Other Countries']
  //
  let housePriceTable = dataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if (d[dimensions[0]] === categoriesType[0]
         && d[dimensions[1]] === categoriesStatus[0]
         && d[dimensions[2]] === categoriesStamp[0]
         && (d[dimensions[3]] === categoriesRegion[0]
           || d[dimensions[3]] === categoriesRegion[18]
           || d[dimensions[3]] === categoriesRegion[19]
           || d[dimensions[3]] === categoriesRegion[20]
           || d[dimensions[3]] === categoriesRegion[21])
         && (d[dimensions[5]] === categoriesStat[2]
         || d[dimensions[5]] === categoriesStat[3])) {
         d.date = parseYearMonth(d['Month'])
         d.label = d['Month']
         d.value = +d.value
         return d
       }
     })
  //
  console.log(housePriceTable)

  let housePriceMean = {
    e: '#chart-house-price-mean',
    d: housePriceTable.filter(d => {
      return d[dimensions[5]] === categoriesStat[2]
    }),
    ks: categoriesRegion,
    k: dimensions[3],
    xV: 'date',
    yV: 'value',
    tX: 'Year',
    tY: categoriesStat[2]
  }
  //
  let housePriceMeanChart = new MultiLineChart(housePriceMean)

  let housePriceMedian = {
    e: '#chart-house-price-median',
    d: housePriceTable.filter(d => {
      return d[dimensions[5]] === categoriesStat[3]
    }),
    ks: categoriesRegion,
    k: dimensions[3],
    xV: 'date',
    yV: 'value',
    tX: 'Year',
    tY: categoriesStat[3]
  }
  //
  let housePriceMedianChart = new MultiLineChart(housePriceMedian)

  const chart1 = 'house-price-mean'
  const chart2 = 'house-price-median'
  function redraw () {
    if (document.querySelector('#chart-' + chart1).style.display !== 'none') {
      housePriceMeanChart.drawChart()
      housePriceMeanChart.addTooltip('Mean house price,  ', '', 'label')
    }
    if (document.querySelector('#chart-' + chart2).style.display !== 'none') {
      housePriceMedianChart.drawChart()
      housePriceMedianChart.addTooltip('Median house price, ', '', 'label')
    }
  }
  redraw()

  d3.select('#chart-' + chart1).style('display', 'block')
  d3.select('#chart-' + chart2).style('display', 'none')

  d3.select('#btn-' + chart1).on('click', function () {
    activeBtn(this)
    d3.select('#chart-' + chart1).style('display', 'block')
    d3.select('#chart-' + chart2).style('display', 'none')
    redraw()
  })

  d3.select('#btn-' + chart2).on('click', function () {
    activeBtn(this)
    d3.select('#chart-' + chart1).style('display', 'none')
    d3.select('#chart-' + chart2).style('display', 'block')
    redraw()
  })

  window.addEventListener('resize', () => {
    redraw()
  })
})()

// if (document.getElementById('chart-house-prices')) {
//   // setup chart and data for quarterly house prices chart
//   // process the data
//   const housePriceMeansData = datafiles[4],
//     housePriceMeansType = housePriceMeansData.columns.slice(2),
//     housePriceMeansDate = housePriceMeansData.columns[0],
//     housePriceMeansRegions = housePriceMeansData.columns[1],
//     housePriceMeansDataProcessed = dataSets(housePriceMeansData, housePriceMeansType),
//     yLabels4 = []
//
//   housePriceMeansDataProcessed.forEach(d => {
//     d.label = (d[housePriceMeansDate])
//     d[housePriceMeansDate] = convertQuarter(d[housePriceMeansDate])
//   })
//
//   const housePriceMeansContent = {
//     e: '#chart-house-prices',
//     d: housePriceMeansDataProcessed,
//     k: housePriceMeansRegions,
//     xV: housePriceMeansDate,
//     yV: 'value',
//     tX: 'Quarters',
//     tY: '€'
//   }
//
//   // draw the chart
//   housePriceMeansChart = new MultiLineChart(housePriceMeansContent)
//
//   function redraw () {
//     housePriceMeansChart.ySF = 'millions'
//     housePriceMeansChart.drawChart()
//     housePriceMeansChart.addTooltip('In thousands - ', 'thousands', 'label', '€')
//   }
//   redraw()
//
//   window.addEventListener('resize', () => {
//     redraw()
//   })
// }

if (document.getElementById('chart-HPM06')) {
  // new chart Price Index
  //   const HPM06 = datafiles[11],
  //     HPM06R = HPM06.columns[1],
  //     HPM06V = HPM06.columns[2],
  //     HPM06V2 = HPM06.columns[3],
  //     HPM06V3 = HPM06.columns[3],
  //     HPM06D = HPM06.columns[0]
  //
  // // create content object
  //   const HPM06Content = chartContent(HPM06, HPM06R, HPM06V, HPM06D, '#chart-HPM06')
  //   HPM06Content.tX = 'Months'
  //   HPM06Content.tY = 'Price Index (Base 100)'
  //
  // // draw the chart
  //   HPM06Charts = new MultiLineChart(HPM06Content)
  //   function redraw () {
  //     HPM06Charts.drawChart() // draw axis
  //     HPM06Charts.addTooltip('Price Index - ', '', 'label') // add tooltip
  //     HPM06Charts.addBaseLine(100) // add horizontal baseline
  //   }
  //   window.addEventListener('resize', () => {
  //     redraw()
  //   })
}

if (document.getElementById('chart-HPM06') && document.getElementById('chart-house-prices')) {
    // d3.select('#chart-house-prices').style('display', 'block')
    // d3.select('#chart-HPM06').style('display', 'none')
    //
    // d3.select('#btn-house-prices').on('click', function () {
    //   activeBtn(this)
    //   d3.select('#chart-house-prices').style('display', 'block')
    //   d3.select('#chart-HPM06').style('display', 'none')
    //   housePriceMeansChart.drawChart()
    //   housePriceMeansChart.addTooltip('In thousands - ', 'thousands', 'label', '€')
    // })
    //
    // d3.select('#btn-HPM06').on('click', function () {
    //   activeBtn(this)
    //
    //   d3.select('#chart-house-prices').style('display', 'none')
    //   d3.select('#chart-HPM06').style('display', 'block')
    //   HPM06Charts.drawChart() // draw axis
    //   HPM06Charts.addTooltip('Price Index - ', '', 'label') // add tooltip
    //   HPM06Charts.addBaseLine(100) // add horizontal baseline
    // })
    //
    // // window.addEventListener('resize', () => {
    // //   redraw()
    // // })
}

function convertQuarter (q) {
  let splitted = q.split('Q')
  let year = splitted[0]
  let quarterEndMonth = splitted[1] * 3 - 2
  let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
  return date
}

function qToQuarter (q) {
  let splitted = q.split('Q')
  let year = splitted[0]
  let quarter = splitted[1]
  let quarterString = ('Quarter ' + quarter + ' ' + year)
  return quarterString
}

function dataSets (data, columns) {
  let coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      // d[columns[i]] !== "null" ? d[columns[i]] = +d[columns[i]] : d[columns[i]] = "unavailable";
      d[columns[i]] = +d[columns[i]]
    }
    return d
  })
  return coercedData
}

function formatQuarter (date) {
  let newDate = new Date()
  newDate.setMonth(date.getMonth() + 1)
  let year = (date.getFullYear())
  let q = Math.ceil((newDate.getMonth()) / 3)
  return 'Quarter ' + q + ' ' + year
}

function filterbyDate (data, dateField, date) {
  return data.filter(d => {
    return d[dateField] >= new Date(date)
  })
}

function filterByDateRange (data, dateField, dateOne, dateTwo) {
  return data.filter(d => {
    return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo)
  })
}

function nestData (data, label, name, value) {
  let nested_data = d3.nest()
    .key(function (d) {
      return d[label]
    })
    .entries(data) // its the string not the date obj

  let mqpdata = nested_data.map(function (d) {
    let obj = {
      label: d.key
    }
    d.values.forEach(function (v) {
      obj[v[name]] = v[value]
      obj.date = v.date
    })
    return obj
  })
  return mqpdata
}

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
