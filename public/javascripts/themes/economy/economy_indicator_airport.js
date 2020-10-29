import { convertQuarterToDate } from '../../modules/bcd-date.js'
// import { coerceWideTable } from '../../modules/bcd-data.js'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'
import { fetchCsvFromUrlAsyncTimeout } from '../../modules/bcd-async.js'

(async function main () {
  let airportPaxCountChart
  const airportPax = '../data/Economy/data_gov_economic_monitor/indicator-.9.-dublin-airport-pax.csv'

  try {
    addSpinner('chart-indicator-airport-count', '<b>data.gov.ie</b> for data: <i>Dublin Economic Monitor, Indicator 9 - Dublin Airport Passengers</i>')
    let data = await fetchCsvFromUrlAsyncTimeout(airportPax)
    data = d3.csvParse(data)
    if (data) {
      removeSpinner('chart-indicator-airport-count')
    }
    const airportColumns = data.columns.slice(1)
    if (document.getElementById('chart-indicator-airport-count')) {
      const longData = data.map(d => {
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        const obj = {
          label: yearQuarter.replace(/Q/g, ' Q'),
          value: (parseInt(d[airportColumns[0]].replace(/,/g, '')) / 1000000).toFixed(2),
          variable: airportColumns[0],
          date: convertQuarterToDate(yearQuarter)
        }
        return obj
      })
      const airportPaxCount = {
        e: 'chart-indicator-airport-count',
        d: longData,
        k: 'variable', // give the key whose value will name the traces (group by)
        xV: 'date',
        yV: 'value',
        tX: 'Quarter',
        tY: 'Passengers (millions)',
        margins: {
          left: 40
        }
      }
      airportPaxCountChart = new BCDMultiLineChart(airportPaxCount)

      redraw(airportPaxCountChart)
      window.addEventListener('resize', () => {
        redraw(airportPaxCountChart)
      })
    }
  } catch (e) {
    console.log('Error creating Dublin Airport Passengers chart')
    console.log(e)
    removeSpinner('chart-indicator-airport-count')
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-indicator-airport-count', eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-indicator-airport-count')
      main()
    })
  }
})()

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('Millions of passengers, ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10])
}
