import { fetchCsvFromUrlAsyncTimeout, fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'
import { convertQuarterToDate } from '../modules/bcd-date.js'
import { stackNest } from '../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../modules/BCDMultiLineChart.js'
import { BCDStackedAreaChart } from '../modules/BCDStackedAreaChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../modules/bcd-ui.js'
import { getTraceDefaults, getLayoutDefaults } from '../modules/bcd-plotly-utils.js'

import { TimeoutError } from '../modules/TimeoutError.js'

async function main (options) {
  const pprLayout = Object.assign({}, getLayoutDefaults('scatter'))
  const chartId = 'chart-property-price'
  const pprPlot = document.getElementById(chartId)
  const pprTraceOptions = {
    x: [],
    y: [],
    type: 'scatter',
    mode: 'markers'
  }
  Plotly.newPlot(chartId, [], pprLayout, {})

  const API_REQ = '/api/residentialpropertyprice/'

  const pprCSV = await fetchCsvFromUrlAsyncTimeout('../data/Housing/PPR/PPR-2020-Dublin.csv')
  // console.log(pprCSV)
  const pprJSON = d3.csvParse(pprCSV)
  // console.log(pprJSON)

  //  Plotly accepts dates in the format YYY-MM-DD and DD/MM/YYYY
  const valueRange = {
    min: 250000,
    max: 450000
  }
  let maxValue = 0
  let maxRecord = {}
  const pprDates = [] // x-axis data
  const pprCustomData = []
  const pprValues = pprJSON.map(d => {
    const v = parseInt(d['Price (�)'].replace(/[�,]/g, ''))
    if (v <= valueRange.max && v >= valueRange.min) {
      pprDates.push(d['Date of Sale (dd/mm/yyyy)'])
      pprCustomData.push(d)
      // console.log(d['Price (�)'])
      // console.log(v)
      if (v > maxValue) {
        maxRecord = d
        maxValue = v
      }
      return v
    }
  })
  console.log(maxRecord)

  const pprTraceData = {
    x: pprDates,
    y: pprValues,
    customdata: pprCustomData
  }

  const pprTrace = Object.assign(pprTraceData, getTraceDefaults('scatter'))
  // const pprTraces = [pprTrace]
  Plotly.addTraces(chartId, pprTrace)

  // Plotly.addTraces(chartId, [{y: [2,1,2]}, {y: [4, 5, 7]}]);

  // pprPlot.on('plotly_click', function (data) {
  //   let pts = ''
  //   let d = {}
  //   for (let i = 0; i < data.points.length; i++) {
  //     pts = 'x = ' + data.points[i].x + '\ny = ' +
  //           data.points[i].y + '\n\n'
  //     d = data.points[i].customdata
  //   }
  //   console.log('Closest point clicked:\n\n' + pts)
  //   console.log(d)
  // })

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

    const housePriceTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        d.date = parseYearMonth(d.Month)
        d.year = d.date.getFullYear()
        if (d[dimensions[0]] === categoriesDwelling[0] &&
          d[dimensions[1]] === categoriesEircode[19] &&
          d.year === 2020 &&
          d[dimensions[2]] === categoriesStamp[0] &&
          d[dimensions[3]] === categoriesBuyer[0] &&
           d[dimensions[5]] === categoriesStat[0]
        ) {
          d.label = d.Month
          d.value = +d.value
          // if (!traceNames.includes(d[dimensions[3]])) {
          //   traceNames.push(d[dimensions[3]])
          // }
          return d
        }
      })
    //
    // console.log(housePriceTable)

    // Plotly.addTraces(chartId, { x: ['02/01/2020', '01/03/2020', '01/06/2020'], y: [350000, 350000, 350000] })

    // console.log(traceNames)

    // const housePriceMean = {
    //   e: 'chart-house-price-mean',
    //   d: housePriceTable.filter(d => {
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
    //   d: housePriceTable.filter(d => {
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
