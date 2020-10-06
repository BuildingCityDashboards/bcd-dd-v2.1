import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'

import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['chart-house-rppi']

  const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM09' // gives no of outsideState and ave household size
  try {
    addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner(chartDivIds[0])
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

    // to keep track of the trqace namesw that we will plot
    const traceNames = []

    // categoriesRegion.filter(d => {
    //   console.log(d)
    //   return d === categoriesRegion[4] || categoriesRegion[8] || categoriesRegion[9] || categoriesRegion[10] || categoriesRegion[11]
    // })
    // console.log('useRegions')
    // console.log(categoriesRegion)

    const houseRppiTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[dimensions[0]] === categoriesRegion[4] ||
           d[dimensions[0]] === categoriesRegion[8] ||
           d[dimensions[0]] === categoriesRegion[9] ||
           d[dimensions[0]] === categoriesRegion[10] ||
           d[dimensions[0]] === categoriesRegion[11]) &&
         d[dimensions[2]] === categoriesStat[0]) {
          d.date = parseYearMonth(d.Month)
          d.label = d.Month
          d.value = +d.value
          // track the available values of only the filtered entries
          if (!traceNames.includes(d[dimensions[0]])) {
            traceNames.push(d[dimensions[0]])
          }
          return d
        }
      })
    console.log(traceNames)

    console.log(houseRppiTable)

    const houseRppi = {
      e: '#chart-house-rppi',
      d: houseRppiTable.filter(d => {
        return parseInt(d.date.getFullYear()) >= 2010
      }),
      ks: traceNames,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: ''
    }

    const houseRppiChart = new MultiLineChart(houseRppi)

    function redraw () {
      houseRppiChart.drawChart()
      houseRppiChart.addTooltip('RPPI for ', '', 'label')
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating RPPI chart')
    console.log(e)

    removeSpinner(chartDivIds[0])
    e = (e instanceof TimeoutError) ? e : 'An error occured'
    const errBtnID = addErrorMessageButton(chartDivIds[0], e)
    console.log('e')
    console.log(e)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()
