import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
let publicTransportChart
let publicTransportURL = '../data/Economy/data_gov_economic_monitor/indicator-.8.-public-transport.csv'

Promise.all([
  d3.csv(publicTransportURL)
])
.then(data => {
  let publicTransportData = data[0]
  let publicTransportColumns = publicTransportData.columns.slice(1)
  if (document.getElementById('chart-public-transport-trips')) {
    let busEireannData = getData(publicTransportColumns[1])
    let dublinBusData = getData(publicTransportColumns[2])
    let irishRailData = getData(publicTransportColumns[3])
    let luasData = getData(publicTransportColumns[4])

    let longData = busEireannData.concat(dublinBusData).concat(irishRailData).concat(luasData)

    const publicTransportOptions = {
      e: '#chart-public-transport-trips',
      d: longData,
      k: 'variable', // key whose value will name the traces (group by)
      xV: 'date',
      yV: 'value',
      tX: 'Quarter',
      tY: 'Trips (millions)'
    }
    publicTransportChart = new MultiLineChart(publicTransportOptions)
    publicTransportChart.drawChart()
    publicTransportChart.addTooltip('Tonnage, ', 'thousands', 'label')

    function getData (key) {
      let longArray = publicTransportData.map(d => {
      // the date is re-formatted  "'Q'Q YY" -> "YYYY'Q'Q"
        let yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        let obj = {
          label: d.Quarter,
          value: parseFloat(d[key].replace(/,/g, '')) / 1000000,
          variable: key,
          date: convertQuarterToDate(yearQuarter)
        }
        return obj
      }).filter(d => {
        return !Number.isNaN(d['value'])
      })
      return longArray
    }
  }
})
