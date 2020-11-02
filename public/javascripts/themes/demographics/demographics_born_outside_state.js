import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['born-outside-dublin', 'born-outside-state']

  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
  const parseYear = d3.timeParse('%Y')
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // CNA31: Populaton by Country of Birth, County and Year
  const TABLE_CODE = 'CNA31' // gives no of outsideState and ave household size

  try {
    addSpinner('chart-' + chartDivIds[0], '<b>CSO</b> for data: <i>Populaton by Country of Birth, County and Year</i>')
    const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log('dataset')
    // console.log(dataset)
    // console.log('dim')
    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesOfCountry = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })

    // console.log('categories of country')
    // console.log(categoriesOfCountry)

    // let STATS = ['Population (Number)']
    // = ['Total Birth', 'Great Britain', 'U.S.A.', 'Other Countries']

    const traceNames = []
    //
    const bornOutsideTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if (
          // d[DIMENSION] === 'State'||
          // (d[dimensions[0]] === categoriesOfCountry[0] ||
          (d[dimensions[0]] === categoriesOfCountry[0] ||
            d[dimensions[0]] === categoriesOfCountry[5] ||
            d[dimensions[0]] === categoriesOfCountry[8] ||
            d[dimensions[0]] === categoriesOfCountry[9]) &&
          (d.County === 'Dublin' ||
            d.County === 'State') &&
          +d.Year >= 1991) {
          d.date = parseYear(+d.Year)
          d.label = +d.Year
          d.value = +d.value
          if (!traceNames.includes(d[dimensions[0]])) {
            traceNames.push(d[dimensions[0]])
          }
          return d
        }
      })

    // console.log(bornOutsideTable)

    const bornOutsideDublin = {
      e: 'chart-born-outside-dublin',
      d: bornOutsideTable.filter(d => {
        return d.County === 'Dublin'
      }),
      ks: traceNames,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Population',
      formaty: 'hundredThousandsShort'
    }
    //
    const bornOutsideDublinChart = new BCDMultiLineChart(bornOutsideDublin)

    redraw(bornOutsideDublinChart)

    const bornOutsideState = {
      e: 'chart-born-outside-state',
      d: bornOutsideTable.filter(d => {
        return d.County === 'State'
      }),
      ks: traceNames,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Population',
      formaty: 'hundredThousandsShort'
    }

    const bornOutsideStateChart = new BCDMultiLineChart(bornOutsideState)
    // redraw(bornOutsideStateChart)

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[0]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
        d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
        redraw(bornOutsideDublinChart)
      }
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[1]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[0]])
        d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
        redraw(bornOutsideStateChart)
      }
    })

    window.addEventListener('resize', () => {
      // console.log('redraw outsideState')
      // bornOutsideDublinChart.tickNumber = 31
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        redraw(bornOutsideDublinChart)
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        redraw(bornOutsideStateChart)
      }
    })
  } catch (e) {
    console.log('Error creating demographics chart')
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

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('Population (thousands) in census year ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10])
}
