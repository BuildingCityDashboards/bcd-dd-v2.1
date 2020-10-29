import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { hasCleanValue } from '../../modules/bcd-data.js'
import { convertQuarterToDate, isFutureDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['rent-prices', 'rent-by-beds']
  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // RIQ02: RTB Average Monthly Rent Report by Number of Bedrooms, Property Type, Location and Quarter
  const TABLE_CODE = 'RIQ02'

  const STATIC_URL = '../../data/statbank/RIQ02.json'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>RTB Average Monthly Rent Report</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATIC_URL)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
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
    console.log(categoriesBeds)
    const categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
      return c.label
    })
    console.log(categoriesType)
    //

    const regionReg = /(Dublin)(\b [1-4]\b)/
    const categoriesLocation = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    }).filter(c => {
      return c.search(regionReg) === 0 || (c === 'Dublin') // returns 'Dublin', 'Dublin N' 1 <= N <= 6
    })
    console.log(categoriesLocation)

    const categoriesStat = dataset.Dimension(dimensions[4]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    const rentTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[dimensions[1]] === categoriesType[0] && // type
          (d[dimensions[2]].search(regionReg) === 0 ||
          d[dimensions[2]] === 'Dublin') &&
          hasCleanValue(d)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter
          d.value = +d.value
          return d
        }
      })

    // console.log(rentTable)
    //
    const rent = {
      elementId: 'chart-' + chartDivIds[0],
      data: rentTable
        .filter(d => {
          return d[dimensions[0]] === categoriesBeds[0] && !isFutureDate(d.date) // all beds
        }),
      tracenames: categoriesLocation,
      tracekey: dimensions[2],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Monthly rent (€)',
      margins: {
        left: 64
      }
    }
    //
    const rentChart = new BCDMultiLineChart(rent)

    const rentByBeds = {
      elementId: 'chart-' + chartDivIds[1],
      data: rentTable
        .filter(d => {
          return d[dimensions[2]] === 'Dublin' && !isFutureDate(d.date)
        }),
      tracenames: categoriesBeds,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Monthly rent (€)',
      margins: {
        left: 64
      }
    }
    //
    const rentByBedsChart = new BCDMultiLineChart(rentByBeds)
    //

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        rentChart.drawChart()
        rentChart.addTooltip('Rent price,  ', '', 'label')
        rentChart.showSelectedLabelsX([0, 3, 6, 9, 12])
        rentChart.showSelectedLabelsY([3, 6, 9])
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        rentByBedsChart.drawChart()
        rentByBedsChart.addTooltip('Rent price, ', '', 'label')
        rentByBedsChart.showSelectedLabelsX([0, 3, 6, 9, 12])
        rentByBedsChart.showSelectedLabelsY([3, 6, 9])
      }
    }
    redraw()

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
      redraw()
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating rent charts')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      // console.log('retry')
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
})()
