import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'

import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['house-rppi', 'apartment-rppi']
  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM09' // gives no of outsideState and ave household size
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }
    const dataset = JSONstat(json).Dataset(0)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })

    const categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    //
    const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    console.log(categoriesStat)

    // to keep track of the trqace namesw that we will plot
    const traceNames = []

    // categoriesRegion.filter(d => {
    //   console.log(d)
    //   return d === categoriesRegion[4] || categoriesRegion[8] || categoriesRegion[9] || categoriesRegion[10] || categoriesRegion[11]
    // })
    // console.log('useRegions')
    console.log(categoriesRegion)

    const houseRppiTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        d.date = parseYearMonth(d.Month)
        if ((d[dimensions[0]] === categoriesRegion[4] ||
          d[dimensions[0]] === categoriesRegion[8] ||
          d[dimensions[0]] === categoriesRegion[9] ||
          d[dimensions[0]] === categoriesRegion[10] ||
          d[dimensions[0]] === categoriesRegion[11] ||
          d[dimensions[0]] === categoriesRegion[2] ||
          d[dimensions[0]] === categoriesRegion[7] ||
          d[dimensions[0]] === categoriesRegion[12]) &&
          d[dimensions[2]] === categoriesStat[0] &&
          (parseInt(d.date.getFullYear()) >= 2010)) {
          d.label = d.Month
          d.value = +d.value
          // track the available values of only the filtered entries
          if (!traceNames.includes(d[dimensions[0]])) {
            traceNames.push(d[dimensions[0]])
          }
          return d
        }
      })
    // console.log(traceNames)

    // console.log(houseRppiTable)

    const houseRppi = {
      e: 'chart-' + chartDivIds[0],
      d: houseRppiTable
        .filter(d => {
          return (d[dimensions[0]] === categoriesRegion[4] ||
          d[dimensions[0]] === categoriesRegion[8] ||
          d[dimensions[0]] === categoriesRegion[9] ||
          d[dimensions[0]] === categoriesRegion[10] ||
          d[dimensions[0]] === categoriesRegion[11])
        }),
      ks: traceNames.filter(d => {
        return (d === categoriesRegion[4] ||
        d === categoriesRegion[8] ||
        d === categoriesRegion[9] ||
        d === categoriesRegion[10] ||
        d === categoriesRegion[11])
      }),
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'RPPI',
      margins: {
        left: 48
      }
    }

    const houseRppiChart = new BCDMultiLineChart(houseRppi)
    redraw(houseRppiChart)

    const apartmentRppi = {
      e: 'chart-' + chartDivIds[1],
      d: houseRppiTable.filter(d => {
        return (d[dimensions[0]] === categoriesRegion[2] ||
        d[dimensions[0]] === categoriesRegion[7] ||
        d[dimensions[0]] === categoriesRegion[12])
      }),
      ks: traceNames.filter(d => {
        return (d === categoriesRegion[2] ||
        d === categoriesRegion[7] ||
        d === categoriesRegion[12])
      }),
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: '',
      tY: 'RPPI',
      margins: {
        left: 48
      }
    }
    const apartmentRppiChart = new BCDMultiLineChart(apartmentRppi)

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
      redraw(houseRppiChart)
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[0]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
      redraw(apartmentRppiChart)
    })

    window.addEventListener('resize', () => {
      if (document.querySelector('' + chartDivIds[0]).style.display !== 'none') {
        redraw(houseRppiChart)
      }
      if (document.querySelector('' + chartDivIds[1]).style.display !== 'none') {
        redraw(apartmentRppiChart)
      }
    })
  } catch (e) {
    console.log('Error creating RPPI chart')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton(chartDivIds[0], eMsg)
    console.log(eMsg)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('RPPI for ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
  chart.addBaseLine(100)
}
