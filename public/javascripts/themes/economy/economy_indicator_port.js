import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
let portTonnageChart, portBreakdownChart
let portTonnage = '../data/Economy/data_gov_economic_monitor/indicator-10-dublin-port-tonnage.csv'

Promise.all([
  d3.csv(portTonnage)
])
.then(data => {
  let portData = data[0]
  let portColumns = portData.columns.slice(1)
  if (document.getElementById('chart-indicator-port-total')) {
    let longData = portData.map(d => {
      // the date is re-formatted  "'Q'Q YY" -> "YYYY'Q'Q"
      let yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
      let obj = {
        label: d.Quarter,
        value: parseFloat(d[portColumns[0]].replace(/,/g, '')) / 1000000,
        variable: portColumns[0],
        date: convertQuarterToDate(yearQuarter)
      }
      return obj
    })

    const portTonnageCount = {
      e: '#chart-indicator-port-total',
      d: longData,
      k: 'variable', // key whose value will name the traces (group by)
      xV: 'date',
      yV: 'value',
      tX: 'Quarter',
      tY: 'Tonnes (millions)'
    }
    portTonnageChart = new MultiLineChart(portTonnageCount)
    portTonnageChart.drawChart()
    portTonnageChart.addTooltip('Tonnage, ', 'thousands', 'label')
  }

  if (document.getElementById('chart-indicator-port-breakdown')) {
    console.log(portColumns)
    let breakdownCols = portColumns.slice(2, 4)

    let portBreakdownData = portData.map(d => {
      let yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
      d.label = yearQuarter
      d.date = convertQuarterToDate(yearQuarter)
      for (var i = 0, n = breakdownCols.length; i < n; i++) {
        d[breakdownCols[i]] = parseFloat(d[breakdownCols[i]].replace(/,/g, '')) / 1000000
      }
      return d
    }).filter(d => {
      return !Number.isNaN(d.Imports)
    })
    console.log(portBreakdownData)

    const portTonnageBreakdown = {
      e: '#chart-indicator-port-breakdown',
      d: portBreakdownData,
      ks: breakdownCols,
      xV: 'date',
      yV: breakdownCols,
      tX: 'Quarter',
      tY: 'Tonnes (millions)'
    }
    portBreakdownChart = new StackedAreaChart(portTonnageBreakdown)
    portBreakdownChart.drawChart()
    portBreakdownChart.addTooltip('Tonnage, ', 'thousands', 'label')
  }
})
