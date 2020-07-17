import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'
import { addSpinner } from '../../modules/bcd-ui.js'
import { removeSpinner } from '../../modules/bcd-ui.js'
import { addErrorMessageButton } from '../../modules/bcd-ui.js'
import { removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  let chartDivIds = ['chart-rent-prices']
  const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
// RIQ02: RTB Average Monthly Rent Report by Number of Bedrooms, Property Type, Location and Quarter
  const TABLE_CODE = 'RIQ02'
  try {
    addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>RTB Average Monthly Rent Report</i>`)
    let json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner(chartDivIds[0])
    }
    let dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    let dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    let categoriesBeds = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesBeds)
    let categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesType)
  //
    let categoriesLocation = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesLocation)

    let categoriesStat = dataset.Dimension(dimensions[4]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    let rentTable = dataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if (d[dimensions[1]] === categoriesType[0] // type
           && d[dimensions[2]] === 'Dublin'
          && !isNaN(+d.value)) {
         d.date = convertQuarterToDate(d['Quarter'])
         d.label = d['Quarter']
         d.value = +d.value
         return d
       }
     })

    // console.log(rentTable)
    //
    let rent = {
      e: '#chart-rent-prices',
      d: rentTable.filter(d => {
        return d[dimensions[0]] === categoriesBeds[0] // all beds
      }),
      ks: categoriesLocation,
      k: dimensions[2],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0]
    }
    //
    let rentChart = new MultiLineChart(rent)

    let rentByBeds = {
      e: '#chart-rent-by-beds',
      d: rentTable,
      // .filter(d => {
        // return parseInt(d.date.getFullYear()) >= 2010
      // }),
      ks: categoriesBeds,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: categoriesStat[0]
    }
    //
    let rentByBedsChart = new MultiLineChart(rentByBeds)
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
    let errBtnID = addErrorMessageButton(chartDivIds[0], e)
    e = e instanceof TimeoutError ? e : 'An error occured'
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      console.log('retry')
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()
