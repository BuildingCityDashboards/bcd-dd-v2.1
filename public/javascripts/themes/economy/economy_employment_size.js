
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['employees-by-size', 'engaged-by-size', 'active-enterprises']
  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
  d3.select('#chart-' + chartDivIds[2]).style('display', 'none')

  const parseYear = d3.timeParse('%Y')

  // The API change on 2020-12-01 resulted in a dimension labelling error which is fixed here
  const fixLabel = function (l) {
    const labelMap = {
      'Employment Size': 'C02175V02621',
      County: 'C02451V02968',
      Year: 'TLIST(A1)'
    }
    return labelMap[l] || l
  }

  // console.log('fetch cso json')
  const STATBANK_BASE_URL =
    // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
    'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/BRA08/JSON-stat/2.0/en'
  const TABLE_CODE = 'BRA08'
  const STATS = ['Active Enterprises', 'Persons Engaged', 'Employees']
  try {
    addSpinner('chart-' + chartDivIds[0], '<b>CSO</b> for data: <i>BRA08 - Business Demography NACE Rev 2 by Employment Size, County, Year and Statistic</i>')
    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // the categories will be the label on each plot trace
    const categories = dataset.Dimension(2).Category().map(c => {
      return c.label
    })

    const EXCLUDE = 'All persons engaged size classes' // categories[0] // exclude 'All size...' trace
    //
    const sizeFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[fixLabel('County')] === 'Dublin' &&
        d.STATISTIC === STATS[2] &&
        d[fixLabel('Employment Size')] !== EXCLUDE) {
          d.label = d[fixLabel('Year')]
          d.date = parseYear(+d[fixLabel('Year')])
          d.value = +d.value
          return d
        }
      }
    )

    const engagedFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[fixLabel('County')] === 'Dublin' &&
        d.STATISTIC === STATS[1] &&
        d[fixLabel('Employment Size')] !== EXCLUDE) {
          d.label = d[fixLabel('Year')]
          d.date = parseYear(+d[fixLabel('Year')])
          d.value = +d.value
          return d
        }
      }
    )

    const activeFiltered = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (d[fixLabel('County')] === 'Dublin' &&
        d.STATISTIC === STATS[0] &&
        d[fixLabel('Employment Size')] !== EXCLUDE) {
          d.label = d[fixLabel('Year')]
          d.date = parseYear(+d[fixLabel('Year')])
          d.value = +d.value
          return d
        }
      }
    )

    const sizeContent = {
      e: 'chart-' + chartDivIds[0],
      xV: 'date',
      yV: 'value',
      d: sizeFiltered,
      k: fixLabel('Employment Size'),
      ks: categories.filter(d => {
        return d !== EXCLUDE
      }),
      tX: 'Years',
      tY: 'Persons employed',
      formaty: 'tenThousandsShort'

    }
    const engagedContent = {
      e: 'chart-' + chartDivIds[1],
      xV: 'date',
      yV: 'value',
      d: engagedFiltered,
      k: fixLabel('Employment Size'),
      ks: categories, // used for the tooltip
      tX: 'Years',
      tY: 'Persons engaged',
      formaty: 'tenThousandsShort'

    }

    const activeContent = {
      e: 'chart-' + chartDivIds[2],
      xV: 'date',
      yV: 'value',
      d: activeFiltered,
      k: fixLabel('Employment Size'),
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

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[0]).style.display === 'none') {
        activeBtn(this)
        d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
        redraw(employedChart, STATS[2])
      }
    })
    //
    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[1]).style.display === 'none') {
        activeBtn(this)
        d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
        d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
        redraw(engagedChart, STATS[1])
      }
    })

    d3.select('#btn-' + chartDivIds[2]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[2]).style.display === 'none') {
        activeBtn(this)
        d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[2]).style('display', 'block')
        // activeChart.tickNumber = 12
        redraw(activeChart, STATS[0])
      }
    })

    window.addEventListener('resize', () => {
      if (d3.select('#chart-' + chartDivIds[0]).style.display !== 'none') {
        redraw(employedChart, STATS[2])
      } else if (d3.select('#chart-' + chartDivIds[1]).style.display !== 'none') {
        redraw(engagedChart, STATS[1])
      } else {
        redraw(activeChart, STATS[0])
      }
    })
  } catch (e) {
    console.log('Error creating Business Demography chart')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIds[0])
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
