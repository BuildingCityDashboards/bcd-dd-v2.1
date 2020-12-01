/** * This the Gross Value Added per Capita at Basic Prices Chart ***/
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  // console.log('fetch cso json')
  const parseYear = d3.timeParse('%Y')

  const STATBANK_BASE_URL =
    // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
    'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/RAA06/JSON-stat/2.0/en'
  const TABLE_CODE = 'RAA06'
  const STAT = 'Gross Value Added (GVA) per person at Basic Prices (Euro)'
  // document.getElementById('chart-gva').innerHTML = 'Fetching data from CSO...'

  try {
    addSpinner('chart-gva', `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>${STAT}</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL)
    if (json) {
      removeSpinner('chart-gva')
    }

    const gvaDataset = JSONstat(json).Dataset(0)
    console.log(gvaDataset)

    const gvaFiltered = gvaDataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d.C02196V04140 === 'Dublin' ||
          d.C02196V04140 === 'Dublin and Mid-East' ||
          d.C02196V04140 === 'State') &&
          d.STATISTIC === STAT) {
          // d.label = d.C02196V04140
          d.date = parseYear(+d['TLIST(A1)'])
          d.value = +d.value
          return d
        }
      }
    )

    console.log(gvaFiltered)

    const gvaContent = {
      e: 'chart-gva',
      xV: 'date',
      yV: 'value',
      d: gvaFiltered,
      k: 'C02196V04140',
      // ks: ['Dublin', 'Dublin and Mid-East', 'State'],
      tX: 'Years',
      tY: 'GVA pp. (€)',
      formaty: 'tenThousandsShort',
      margins: {
        left: 52
      }

    }

    const gvaChart = new BCDMultiLineChart(gvaContent)
    redraw(gvaChart)
    window.addEventListener('resize', () => {
      redraw(gvaChart)
    })
  } catch (e) {
    console.log('Error creating GVA chart')
    console.log(e)
    removeSpinner('chart-gva')
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-gva', eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-gva')
      main()
    })
  }
})()

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('GVA per person in ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22])
}
