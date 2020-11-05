import { fetchCsvFromUrlAsyncTimeout, fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'
import { convertQuarterToDate } from '../modules/bcd-date.js'
import { stackNest } from '../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../modules/BCDMultiLineChart.js'
import { BCDStackedAreaChart } from '../modules/BCDStackedAreaChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../modules/bcd-ui.js'

import { TimeoutError } from '../modules/TimeoutError.js'

async function main (options) {
  const API_REQ = '/api/residentialpropertyprice/'

  const pprCSV = await fetchCsvFromUrlAsyncTimeout('../data/Housing/PPR/PPR-2020-Dublin.csv')
  console.log(pprCSV)
  const pprJSON = d3.csvParse(pprCSV)
  console.log(pprJSON)

  // const csv = await fetchCsvFromUrlAsyncTimeout(uri)
  // const json = d3.csvParse(csv)
  // console.log(json)

  //  Plotly accepts dates in the format YYY-MM-DD and DD/MM/YYYY
  const dates = pprJSON.map(d =>{
    return d['Date of Sale (dd/mm/yyyy)']
  })
  const values = pprJSON.map(d =>{
    console.log(d['Price (�)']);
    let v = parseInt(d['Price (�)'].replace(/[�,]/g, ''))
    console.log(v);
    return v
  })

  var trace1 = {
    // x: ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04', '2020-01-05'],
    // x: ['02/01/2020', '02/01/2020', '02/01/2020', '05/01/2020', '06/01/2020'],
    x: dates,
    y: values,
    type: 'scatter',
    mode: 'markers'
  }

  // var trace2 = {
  //   x: [0, 1, 2, 3, 4, 5],
  //   y: [1, 0.5, 0.7, -1.2, 0.3, 0.4],
  //   type: 'bar'
  // }

  var data = [trace1]

  Plotly.newPlot('chart-property-price', data)

  // const chartDivIds = ['chart-house-price-mean', 'chart-house-price-median']
  // const parseYear = d3.timeParse('%Y')
  // const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  // const STATBANK_BASE_URL =
  //   'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'

  // const STATIC_URL = '../data/statbank/HPM04.json'
  // // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  // const TABLE_CODE = 'HPM04' // gives no of outsideState and ave household size
  // try {
  //   addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
  //   const json = await fetchJsonFromUrlAsyncTimeout(STATIC_URL)
  //   if (json) {
  //     removeSpinner(chartDivIds[0])
  //   }

  //   const dataset = JSONstat(json).Dataset(0)
  //   // console.log('dataset')
  //   // console.log(dataset)
  //   // console.log('dim')
  //   const dimensions = dataset.Dimension().map(dim => {
  //     return dim.label
  //   })
  //   console.log(dimensions)

  //   const categoriesType = dataset.Dimension(dimensions[0]).Category().map(c => {
  //     return c.label
  //   })

  //   const categoriesStatus = dataset.Dimension(dimensions[1]).Category().map(c => {
  //     return c.label
  //   })

  //   const categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
  //     return c.label
  //   })

  //   const categoriesRegion = dataset.Dimension(dimensions[3]).Category().map(c => {
  //     return c.label
  //   })

  //   const categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
  //     return c.label
  //   })

  //   // console.log('categories of ' + dimensions[3])
  // console.log(categoriesStamp)

  // let STATS = ['Population (Number)']
  // = ['Total Birth', 'Great Britain', 'U.S.A.', 'Other Countries']
  //
  // const traceNames = []

  // const housePriceTable = dataset.toTable(
  //   { type: 'arrobj' },
  //   (d, i) => {
  //     if (d[dimensions[0]] === categoriesType[0] &&
  //       d[dimensions[1]] === categoriesStatus[0] &&
  //       d[dimensions[2]] === categoriesStamp[0] &&
  //       (d[dimensions[3]] === categoriesRegion[0] ||
  //         d[dimensions[3]] === categoriesRegion[18] ||
  //         d[dimensions[3]] === categoriesRegion[19] ||
  //         d[dimensions[3]] === categoriesRegion[20] ||
  //         d[dimensions[3]] === categoriesRegion[21]) &&
  //       (d[dimensions[5]] === categoriesStat[2] ||
  //         d[dimensions[5]] === categoriesStat[3])) {
  //       d.date = parseYearMonth(d.Month)
  //       d.label = d.Month
  //       d.value = +d.value
  //       if (!traceNames.includes(d[dimensions[3]])) {
  //         traceNames.push(d[dimensions[3]])
  //       }
  //       return d
  //     }
  //   })
  // //
  // // console.log(housePriceTable)
  // // console.log(traceNames)

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
  // } catch (e) {
  //   console.log('Error creating Property Price query chart')
  //   console.log(e)
  //   removeSpinner(chartDivIds[0])
  //   const eMsg = e instanceof TimeoutError ? e : 'An error occured'
  //   const errBtnID = addErrorMessageButton(chartDivIds[0], eMsg)
  //   // console.log(errBtnID)
  //   d3.select(`#${errBtnID}`).on('click', function () {
  //     removeErrorMessageButton(chartDivIds[0])
  //     main()
  //   })
  // }
}

export { main }
