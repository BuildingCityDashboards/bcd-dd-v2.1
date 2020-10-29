
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  d3.select('#chart-employees-by-size').style('display', 'block')
  d3.select('#chart-engaged-by-size').style('display', 'none')
  d3.select('#chart-active-enterprises').style('display', 'none')

  const parseYear = d3.timeParse('%Y')

  // console.log('fetch cso json')
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'BRA08'
  const STATS = ['Active Enterprises (Number)', 'Persons Engaged (Number)', 'Employees (Number)']
  try {
    addSpinner('chart-employees-by-size', '<b>CSO</b> for data: <i>BRA08 - Business Demography NACE Rev 2 by Employment Size, County, Year and Statistic</i>')
    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

    if (json) {
      removeSpinner('chart-employees-by-size')
    }

    const dataset = JSONstat(json).Dataset(0)
    // the categories will be the label on each plot trace
    const categories = dataset.Dimension(0).Category().map(c => {
      return c.label
    })
    // console.log(categories)

    const EXCLUDE = categories[0] // exclude 'All size...' trace
    //
    const sizeFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d.County === 'Dublin' &&
        d.Statistic === STATS[2] &&
        d['Employment Size'] !== EXCLUDE) {
          d.label = d.Year
          d.date = parseYear(+d.Year)
          d.value = +d.value
          return d
        }
      }
    )

    const engagedFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d.County === 'Dublin' &&
        d.Statistic === STATS[1] &&
        d['Employment Size'] !== EXCLUDE) {
          d.label = d.Year
          d.date = parseYear(+d.Year)
          d.value = +d.value
          return d
        }
      }
    )

    const activeFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d.County === 'Dublin' &&
        d.Statistic === STATS[0] &&
        d['Employment Size'] !== EXCLUDE) {
          d.label = d.Year
          d.date = parseYear(+d.Year)
          d.value = +d.value
          return d
        }
      }
    )

    const sizeContent = {
      e: 'chart-employees-by-size',
      xV: 'date',
      yV: 'value',
      d: sizeFiltered,
      k: 'Employment Size',
      ks: categories.filter(d => {
        return d !== EXCLUDE
      }), // used for the tooltip
      tX: 'Years',
      tY: 'Persons employed',
      formaty: 'tenThousandsShort'

    }
    const engagedContent = {
      e: 'chart-engaged-by-size',
      xV: 'date',
      yV: 'value',
      d: engagedFiltered,
      k: 'Employment Size',
      ks: categories, // used for the tooltip
      tX: 'Years',
      tY: 'Persons engaged',
      formaty: 'tenThousandsShort'


    }

    const activeContent = {
      e: 'chart-active-enterprises',
      xV: 'date',
      yV: 'value',
      d: activeFiltered,
      k: 'Employment Size',
      ks: categories, // used for the tooltip
      tX: 'Years',
      tY: 'Active enterprises',
      formaty: 'tenThousandsShort'


    }

    const employedChart = new BCDMultiLineChart(sizeContent)
    redraw(employedChart, STATS[2])

    const engagedChart = new BCDMultiLineChart(engagedContent)
    // redraw(engagedChart, STATS[1])

    const activeChart = new BCDMultiLineChart(activeContent)
    // redraw(activeChart, STATS[0])

    d3.select('#btn-employees-by-size').on('click', function () {
      activeBtn(this)
      d3.select('#chart-employees-by-size').style('display', 'block')
      d3.select('#chart-engaged-by-size').style('display', 'none')
      d3.select('#chart-active-enterprises').style('display', 'none')
      redraw(employedChart, STATS[2])
    })
    //
    d3.select('#btn-engaged-by-size').on('click', function () {
      activeBtn(this)
      d3.select('#chart-employees-by-size').style('display', 'none')
      d3.select('#chart-engaged-by-size').style('display', 'block')
      d3.select('#chart-active-enterprises').style('display', 'none')
      redraw(engagedChart, STATS[1])
    })

    d3.select('#btn-active-enterprises').on('click', function () {
      activeBtn(this)
      d3.select('#chart-employees-by-size').style('display', 'none')
      d3.select('#chart-engaged-by-size').style('display', 'none')
      d3.select('#chart-active-enterprises').style('display', 'block')
      // activeChart.tickNumber = 12
      redraw(activeChart, STATS[0])
    })

    window.addEventListener('resize', () => {
      if (d3.select('#chart-employees-by-size').style.display !== 'none') {
        redraw(employedChart, STATS[2])
      } else if (d3.select('#chart-engaged-by-size').style.display !== 'none') {
        redraw(engagedChart, STATS[1])
      } else {
        redraw(activeChart, STATS[0])
      }
    })
  } catch (e) {
    console.log('Error creating Business Demography chart')
    console.log(e)
    removeSpinner('chart-employees-by-size')
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-employees-by-size', eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-employees-by-size')
      main()
    })
  }
})()

function redraw (chart, stat) {
  chart.drawChart()
  chart.addTooltip(stat + ' for Year ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10])
}
