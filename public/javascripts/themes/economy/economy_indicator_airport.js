import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
let airportPaxCountChart, airportPaxRateChart
const airportPax = '../data/Economy/data_gov_economic_monitor/indicator-.9.-dublin-airport-pax.csv'

Promise.all([
  d3.csv(airportPax)
])
  .then(data => {
    const airportData = data[0]
    const airportColumns = airportData.columns.slice(1)
    // console.log('airport')
    // console.log(airportData)
    if (document.getElementById('chart-indicator-airport-count')) {
      const longData = airportData.map(d => {
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        const obj = {
          label: yearQuarter.replace(/Q/g, ' qurater '),
          value: (parseInt(d[airportColumns[0]].replace(/,/g, '')) / 1000000).toFixed(2),
          variable: airportColumns[0],
          date: convertQuarterToDate(yearQuarter)
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
        tY: 'Passengers (millions)'
      }
      airportPaxCountChart = new BCDMultiLineChart(airportPaxCount)
      function redraw() {
        airportPaxCountChart.drawChart()
        airportPaxCountChart.addTooltip('Millions of passengers, ', '', 'label')
      }
      redraw()
      window.addEventListener('resize', () => {
        redraw()
      })
    }
  })
