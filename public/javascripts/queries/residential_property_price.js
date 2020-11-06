import { fetchCsvFromUrlAsyncTimeout, fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'
import { convertQuarterToDate, getDateFromCommonString } from '../modules/bcd-date.js'
import { stackNest } from '../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../modules/BCDMultiLineChart.js'
import { BCDStackedAreaChart } from '../modules/BCDStackedAreaChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../modules/bcd-ui.js'
import { getTraceDefaults, getLayoutDefaults } from '../modules/bcd-plotly-utils.js'

import { TimeoutError } from '../modules/TimeoutError.js'

async function main (options) {
  const selectorOptions = {
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
    },{
      step: 'year',
      stepmode: 'backward',
      count: 5,
      label: '5y'
    },{
      step: 'year',
      stepmode: 'backward',
      count: 10,
      label: '10y'
    }, {
      step: 'all'
    }]
  }

  const layoutInitial = {
    title: 'Property Price Query',
    xaxis: {
      rangeselector: selectorOptions,
      // rangeslider: {}
    },
    yaxis: {
      fixedrange: true
    }
  }

  const pprLayout = Object.assign(getLayoutDefaults('scatter'), layoutInitial )
  console.log(pprLayout)

  const chartId = 'chart-property-price'
  const pprPlot = document.getElementById(chartId)
  const pprTraceOptions = {
    x: [],
    y: [],
    type: 'scatter',
    mode: 'markers'
  }

  Plotly.newPlot(chartId, [], pprLayout, {})

  // Plotly.d3.csv(rawDataURL, function(err, rawData) {
  //     if(err) throw err;

  //     var data = prepData(rawData);
  //

  //     Plotly.newPlot('myDiv', data, layout);
  // });

  const API_REQ = '/api/residentialpropertyprice/'

  const pprCSV = await fetchCsvFromUrlAsyncTimeout('../data/Housing/PPR/PPR-2020-Dublin.csv')
  // console.log(pprCSV)
  const pprJSON = d3.csvParse(pprCSV)
  // console.log(pprJSON)

  //  Plotly accepts dates in the format YYY-MM-DD and DD/MM/YYYY
  const valueRange = {
    min: 50000,
    max: 1000000
  }
  let minValue = valueRange.min
  let maxValue = valueRange.max
  let maxRecord = {}
  let minRecord = {}
  const pprDates = [] // x-axis data
  const pprValues = [] // y-axis data
  const pprCustomData = []

  pprJSON.forEach(d => {
    const v = parseInt(d['Price (�)'].replace(/[�,]/g, ''))
    if (d['Postal Code'] === 'Dublin 1' && v > valueRange.min && v < valueRange.max) {
      pprDates.push(getDateFromCommonString(d['Date of Sale (dd/mm/yyyy)']))
      pprCustomData.push(d)
      pprValues.push(v)
      // console.log('>'+d['Postal Code']+'<')
      // console.log(v)

      if (v < minValue) {
        minRecord = d
        minValue = v
      }
      if (v > maxValue) {
        maxRecord = d
        maxValue = v
      }
    }
  })

  console.log('len ' + pprValues.length)
  console.log(pprValues)

  const pprTraceData = {
    x: pprDates,
    y: pprValues,
    customdata: pprCustomData
  }

  const pprTrace = Object.assign(pprTraceData, getTraceDefaults('scatter'))
  // const pprTraces = [pprTrace]
  Plotly.addTraces(chartId, pprTrace)

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

  // const chartDivIds = ['chart-house-price-mean', 'chart-house-price-median']
  // const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  // const STATBANK_BASE_URL =
  //   'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'

  const STATIC_URL = '../data/statbank/HPM04.json'
  // // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  // const TABLE_CODE = 'HPM04' // gives no of outsideState and ave household size
  try {
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

    Plotly.addTraces(chartId, { x: ppTrendDates, y: ppTrendVals, customdata: ppTrendCustomData })

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
