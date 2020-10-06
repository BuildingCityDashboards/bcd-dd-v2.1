import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { hasCleanValue } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'

import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['chart-rent-prices']
  const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // RIQ02: RTB Average Monthly Rent Report by Number of Bedrooms, Property Type, Location and Quarter
  const TABLE_CODE = 'RIQ02'
  try {
    addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>RTB Average Monthly Rent Report</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner(chartDivIds[0])
    }
    const dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesBeds = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesBeds)
    const categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesType)
    //
    const categoriesLocation = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesLocation)

    const categoriesStat = dataset.Dimension(dimensions[4]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    const bedCategoryTraces = []

    const rentTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[1]] === categoriesType[0] &&
           d[dimensions[2]] === 'Dublin' &&
          hasCleanValue(d)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter
          d.value = +d.value
          if (!bedCategoryTraces.includes(d[dimensions[0]])) {
            bedCategoryTraces.push(d[dimensions[0]])
          }
          return d
        }
      })

    console.log(rentTable)

    console.log(bedCategoryTraces)
    //
    const rent = {
      e: '#chart-rent-prices',
      d: rentTable.filter(d => {
        return d[dimensions[0]] === categoriesBeds[0] // all beds
      }),
      ks: ['Dublin'],
      k: dimensions[2],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0]
    }
    //
    const rentChart = new MultiLineChart(rent)

    const rentByBeds = {
      e: '#chart-rent-by-beds',
      d: rentTable,
      // .filter(d => {
      // return parseInt(d.date.getFullYear()) >= 2010
      // }),
      ks: bedCategoryTraces,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0]
    }
    //
    const rentByBedsChart = new MultiLineChart(rentByBeds)
    //
    const chart1 = 'rent-prices'
    const chart2 = 'rent-by-beds'

    d3.select('#chart-' + chart1).style('display', 'block')
    d3.select('#chart-' + chart2).style('display', 'none')

    function redraw () {
      if (document.querySelector('#chart-' + chart1).style.display !== 'none') {
        rentChart.drawChart()
        rentChart.addTooltip('Rent price,  ', '', 'label')
      }
      if (document.querySelector('#chart-' + chart2).style.display !== 'none') {
        rentByBedsChart.drawChart()
        rentByBedsChart.addTooltip('Rent price, ', '', 'label')
      }
    }
    redraw()

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
    console.log('Error creating rent charts')
    console.log(e)
    removeSpinner(chartDivIds[0])
    e = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton(chartDivIds[0], e)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      console.log('retry')
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()
