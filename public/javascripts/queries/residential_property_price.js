import { fetchCsvFromUrlAsyncTimeout, fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'
import { convertQuarterToDate, getDateFromCommonString } from '../modules/bcd-date.js'
import { stackNest } from '../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../modules/BCDMultiLineChart.js'
import { BCDStackedAreaChart } from '../modules/BCDStackedAreaChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../modules/bcd-ui.js'
import { getTraceDefaults, getLayoutDefaults } from '../modules/bcd-plotly-utils.js'

import { TimeoutError } from '../modules/TimeoutError.js'

const dublinPostcodes =
['Dublin 1', 'Dublin 2', 'Dublin 3', 'Dublin 4', 'Dublin 5', 'Dublin 6', 'Dublin 7', 'Dublin 6W', 'Dublin 9', 'Dublin 8', 'Dublin 11', 'Dublin 10', 'Dublin 13', 'Dublin 12', 'Dublin 15', 'Dublin 14', 'Dublin 17', 'Dublin 16', 'Dublin 18', 'Dublin 20', 'Dublin 22', 'Dublin 24']

async function main (options) {
  const timeSelectorOptions = {
    buttons: [{
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '1m'
    }, {
      step: 'month',
      stepmode: 'backward',
      count: 6,
      label: '6m'
    }, {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1y'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 5,
      label: '5y'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 10,
      label: '10y'
    }, {
      step: 'all'
    }]
  }

  const valueRange = {
    min: 50000,
    max: 1000000
  }

  const postcodeButtons = dublinPostcodes.map((p) => {
    return {
      method: 'restyle',
      args: ['visible', dublinPostcodes.map(pc => {
        return p === pc
      })],
      label: p
    }
  })

  postcodeButtons.push(
    {
      method: 'restyle',
      args: ['visible', dublinPostcodes.map(pc => {
        return true
      })],
      label: 'All Dublin'
    }
  )

  const layoutInitial = {
    title: 'Property Price Query',
    xaxis: {
      rangeselector: timeSelectorOptions
      // rangeslider: {}
    },
    yaxis: {
      fixedrange: true,
      range: [valueRange.min, valueRange.max]
    },
    updatemenus: [{
      y: 1,
      yanchor: 'top',
      buttons: postcodeButtons
    }]
  }
  console.log(layoutInitial)

  const pprLayout = Object.assign(getLayoutDefaults('scatter'), layoutInitial)
  // console.log(pprLayout)

  const chartId = 'chart-property-price'
  const pprPlot = document.getElementById(chartId)
  // const pprTraceOptions = {
  //   x: [],
  //   y: [],
  //   type: 'scatter',
  //   mode: 'markers'
  // }
  // Initialise a blank plot
  Plotly.newPlot(chartId, [], pprLayout, {})

  pprPlot.on('plotly_click', function (data) {
    let pts = ''
    let d = {}
    for (let i = 0; i < data.points.length; i++) {
      pts = 'x = ' + data.points[i].x + '\ny = ' +
          data.points[i].y + '\n\n'
      d = data.points[i].customdata
    }
    console.log('Closest point clicked:\n\n' + pts)
    console.log(d)
  })

  pprPlot.on('plotly_relayout', async function () {
    console.log('Relayout event:\n\n')
    console.log(arguments)

    // check if the trace exists (named by year)

    const graphDiv = document.getElementById(chartId)
    console.log(graphDiv.data.length)

    if (arguments[0]['xaxis.range[0]'] != null) {
      const startYear = new Date(arguments[0]['xaxis.range[0]']).getFullYear()
      // let yearsPlotted = graphDiv.data.map(d => {
      //   return d.name
      // })
      for (let yr = +startYear; yr < 2020; yr += 1) {
        // console.log(yearsPlotted) // => returns the number of traces
        // if (!yearsPlotted.includes('ppr-' + yr + '-' + d.replace(' ', '-'))) {
        try {
          const traces = await getPPRTraceForYear(yr)
          if (traces != null) {
            let xs = []
            let ys = []
            let cs = []
            let is = []
            // console.log(graphDiv.data)
            traces.forEach((trace, i) => {
              console.log(trace)
              xs.push(trace.x)
              ys.push(trace.y)
              cs.push(trace.customdata)
              is.push(i)
            })

            Plotly.extendTraces(chartId, { x: xs, y: ys, customdata: cs }, is)

            // Plotly.extendTraces(chartId, { x: [trace.x], y: [trace.y] }, [0])
            // console.log('add trace')
          }
        } catch (e) {
          console.log(e)
        }
        // }
      }
    }
  })

  try {
    // const API_REQ = '/api/residentialpropertyprice/'
    const traces2020 = await getPPRTraceForYear(2020)
    traces2020[0].visible = true
  
    Plotly.addTraces(chartId, traces2020)

    // addTrendTraces()
  } catch (e) {
    console.log('Error creating Property Price query chart')
    console.log(e)
  //   removeSpinner(chartDivIds[0])
  //   const eMsg = e instanceof TimeoutError ? e : 'An error occured'
  //   const errBtnID = addErrorMessageButton(chartDivIds[0], eMsg)
  //   // console.log(errBtnID)
  //   d3.select(`#${errBtnID}`).on('click', function () {
  //     removeErrorMessageButton(chartDivIds[0])
  //     main()
  //   })
  }
}

export { main }

async function getPPRTraceForYear (year) {
  try {
    const pprCSV = await fetchCsvFromUrlAsyncTimeout(`../data/Housing/PPR/PPR-${year}-Dublin.csv`)
    // console.log(pprCSV)
    const pprJSON = d3.csvParse(pprCSV)
    console.log(pprJSON)
    const pprDates = {} // x-axis data indexed by postcode
    const pprValues = {} // y-axis data indexed by postcode
    const pprCustomData = {}
    pprJSON.forEach(d => {
      // if (d['Postal Code'] === 'Dublin 1') { // && v > valueRange.min && v < valueRange.max) {

      if (!pprDates[`${d['Postal Code']}`]) {
        pprDates[`${d['Postal Code']}`] = []
      }
      //  Plotly accepts dates in the format YYY-MM-DD and DD/MM/YYYY
      pprDates[`${d['Postal Code']}`].push(getDateFromCommonString(d['Date of Sale (dd/mm/yyyy)']))
      // pprCustomData.push(d)
      if (!pprValues[`${d['Postal Code']}`]) {
        pprValues[`${d['Postal Code']}`] = []
      }
      const v = parseInt(d['Price (�)'].replace(/[�,]/g, ''))
      pprValues[`${d['Postal Code']}`].push(v)

      if (!pprCustomData[`${d['Postal Code']}`]) {
        pprCustomData[`${d['Postal Code']}`] = []
      }
      pprCustomData[`${d['Postal Code']}`].push(d)
      // console.log('>'+d['Postal Code']+'<')
      // console.log(v)
      // }
    })

    // console.log(pprDates)
    // console.log(pprValues)
    // console.log(dublinPostcodes)
    const pprTraces = dublinPostcodes.map(d => {
      console.log(d)
      console.log(pprValues[d]);
      const pprTraceData = {
        x: pprDates[d] || [],
        y: pprValues[d] || [],
        customdata: pprCustomData[d] || []
      }
      const pprTrace = Object.assign(pprTraceData, getTraceDefaults('scatter'))
      pprTrace.name = 'ppr-' + year + '-' + d.replace(' ', '-')
      console.log(pprTraceData);
      return pprTraceData
    })

    console.log(pprTraces)
    // const pprTraces = [pprTrace]
    return pprTraces
  } catch (e) {
    return null
  }
}

async function addTrendTraces () {
  // const chartDivIds = ['chart-house-price-mean', 'chart-house-price-median']
  // const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  // const STATBANK_BASE_URL =
  //   'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'

  const STATIC_URL = '../data/statbank/HPM04.json'
  // // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  // const TABLE_CODE = 'HPM04' // gives no of outsideState and ave household size

  //   addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
  const json = await fetchJsonFromUrlAsyncTimeout(STATIC_URL)
  //   if (json) {
  //     removeSpinner(chartDivIds[0])
  //   }

  const dataset = JSONstat(json).Dataset(0)
  //   // console.log('dataset')
  //   // console.log(dataset)
  //   // console.log('dim')
  const dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })
  console.log(dimensions)

  const categoriesDwelling = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  const categoriesEircode = dataset.Dimension(dimensions[1]).Category().map(c => {
    return c.label
  })

  console.log(categoriesEircode)

  const categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
    return c.label
  })

  const categoriesBuyer = dataset.Dimension(dimensions[3]).Category().map(c => {
    return c.label
  })

  const categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
    return c.label
  })

  //   // console.log('categories of ' + dimensions[3])
  // console.log(categoriesStamp)

  // const traceNames = []

  const ppTrend = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      d.date = parseYearMonth(d.Month)
      d.year = d.date.getFullYear()
      if (d[dimensions[0]] === categoriesDwelling[0] &&
          d[dimensions[1]] === categoriesEircode[19] &&
          d.year === 2020 &&
          d[dimensions[2]] === categoriesStamp[0] &&
          d[dimensions[3]] === categoriesBuyer[0] &&
           d[dimensions[5]] === categoriesStat[2]
      ) {
        d.label = d.Month
        d.value = +d.value
        return d
      }
    })

  const ppTrendDates = []
  const ppTrendCustomData = []
  const ppTrendVals = ppTrend.map(d => {
    ppTrendDates.push(d.date)
    ppTrendCustomData.push(d)
    return d.value
  })
  console.log(ppTrend)

  Plotly.prependTraces(chartId, { x: ppTrendDates, y: ppTrendVals, customdata: ppTrendCustomData }, [0])
  console.log()
}

// console.log(traceNames)

// const housePriceMean = {
//   e: 'chart-house-price-mean',
//   d: ppTrend.filter(d => {
//     return d[dimensions[5]] === categoriesStat[2]
//   }),
//   ks: traceNames,
//   k: dimensions[3],
//   xV: 'date',
//   yV: 'value',
//   tX: 'Year',
//   tY: categoriesStat[2],
//   formaty: 'hundredThousandsShort'
// }
// //
// const housePriceMeanChart = new BCDMultiLineChart(housePriceMean)

// const housePriceMedian = {
//   e: 'chart-house-price-median',
//   d: ppTrend.filter(d => {
//     return d[dimensions[5]] === categoriesStat[3]
//   }),
//   ks: traceNames,
//   k: dimensions[3],
//   xV: 'date',
//   yV: 'value',
//   tX: 'Year',
//   tY: categoriesStat[3],
//   formaty: 'hundredThousandsShort'
// }
// //
// const housePriceMedianChart = new BCDMultiLineChart(housePriceMedian)

// const chart1 = 'house-price-mean'
// const chart2 = 'house-price-median'
// function redraw () {
//   if (document.querySelector('#chart-' + chart1).style.display !== 'none') {
//     housePriceMeanChart.drawChart()
//     housePriceMeanChart.addTooltip('Mean house price,  ', '', 'label')
//     housePriceMeanChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
//     housePriceMeanChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14])
//   }
//   if (document.querySelector('#chart-' + chart2).style.display !== 'none') {
//     housePriceMedianChart.drawChart()
//     housePriceMedianChart.addTooltip('Median house price, ', '', 'label')
//     housePriceMedianChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
//     housePriceMedianChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14])
//   }
// }
// redraw()

// d3.select('#chart-' + chart1).style('display', 'block')
// d3.select('#chart-' + chart2).style('display', 'none')

// d3.select('#btn-' + chart1).on('click', function () {
//   if (document.getElementById('chart-' + chart1).style.display === 'none') {
//     activeBtn(this)
//     d3.select('#chart-' + chart1).style('display', 'block')
//     d3.select('#chart-' + chart2).style('display', 'none')
//     redraw()
//   }
// })

// d3.select('#btn-' + chart2).on('click', function () {
//   if (document.getElementById('chart-' + chart2).style.display === 'none') {
//     activeBtn(this)
//     d3.select('#chart-' + chart1).style('display', 'none')
//     d3.select('#chart-' + chart2).style('display', 'block')
//     redraw()
//   }
// })

// window.addEventListener('resize', () => {
//   redraw()
// })
