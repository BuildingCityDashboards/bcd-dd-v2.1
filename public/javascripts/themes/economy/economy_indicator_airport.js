import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
let airportPaxCountChart, airportPaxRateChart
let airportPax = '../data/Economy/data_gov_economic_monitor/indicator-.9.-dublin-airport-pax.csv'

Promise.all([
  d3.csv(airportPax)
])
.then(data => {
  let airportData = data[0]
  let airportColumns = airportData.columns.slice(1)
  if (document.getElementById('chart-indicator-airport-count')) {
    let longData = airportData.map(d => {
      let obj = {
        label: d.Quarter,
        value: parseInt(d[airportColumns[0]].replace(/,/g, '')),
        variable: airportColumns[0],
        date: convertQuarterToDate(d.Quarter)
      }
      return obj
    })

    const airportPaxCount = {
      e: '#chart-indicator-airport-count',
      d: longData,
      k: 'variable', // give the key whose value will name the traces (group by)
      xV: 'date',
      yV: 'value',
      tX: 'Quarter',
      tY: ''
    }
    airportPaxCountChart = new MultiLineChart(airportPaxCount)
    airportPaxCountChart.drawChart()
    airportPaxCountChart.addTooltip('Passengers, ', 'thousands', 'label')
  }
})

