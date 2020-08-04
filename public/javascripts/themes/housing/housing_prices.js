import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { StackedAreaChart } from '../../modules/StackedAreaChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'
import { addSpinner } from '../../modules/bcd-ui.js'
import { removeSpinner } from '../../modules/bcd-ui.js'
import { addErrorMessageButton } from '../../modules/bcd-ui.js'
import { removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  let chartDivIds = ['chart-house-price-mean', 'chart-house-price-median']
  const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM05' // gives no of outsideState and ave household size
  try {
    addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    let json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner(chartDivIds[0])
    }

    let dataset = JSONstat(json).Dataset(0)
  // console.log('dataset')
  // console.log(dataset)
  // console.log('dim')
    let dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
  // console.log(dimensions)

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

  // console.log('categories of ' + dimensions[3])
  // console.log(categoriesStamp)

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
  // console.log(housePriceTable)

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
  } catch (e) {
    console.log('Error creating House Price chart')
    console.log(e)
    removeSpinner(chartDivIds[0])
    e = e instanceof TimeoutError ? e : 'An error occured'
    let errBtnID = addErrorMessageButton(chartDivIds[0], e)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()
