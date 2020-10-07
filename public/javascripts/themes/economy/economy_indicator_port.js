import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
import { activeBtn } from '../../modules/bcd-ui.js'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { StackedAreaChart } from '../../modules/StackedAreaChart.js'
let portTotalChart, portBreakdownChart
const portTonnage = '../data/Economy/data_gov_economic_monitor/indicator-10-dublin-port-tonnage.csv'

Promise.all([
  d3.csv(portTonnage)
])
  .then(data => {
    const portData = data[0]
    const portColumns = portData.columns.slice(1)
    if (document.getElementById('chart-indicator-port-total')) {
      const longData = portData.map(d => {
      // the date is re-formatted  "'Q'Q YY" -> "YYYY'Q'Q"
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        const obj = {

          value: parseFloat(d[portColumns[0]].replace(/,/g, '')) / 1000000,
          variable: portColumns[0],
          date: convertQuarterToDate(yearQuarter),
          label: yearQuarter.replace(/Q/, ' Q')
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
      portTotalChart = new MultiLineChart(portTonnageCount)
      function redraw () {
        portTotalChart.drawChart()
        portTotalChart.addTooltip('Total tonnage through port, ', 'thousands', 'label')
      }
      redraw()

      window.addEventListener('resize', () => {
        redraw()
      })
    }

    if (document.getElementById('chart-indicator-port-breakdown')) {
      const breakdownCols = portColumns.slice(10, 12)

      const portBreakdownData = portData.map(d => {
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        d.label = yearQuarter.replace(/Q/, ' Q')
        d.date = convertQuarterToDate(yearQuarter)
        for (var i = 0, n = breakdownCols.length; i < n; i++) {
          d[breakdownCols[i]] = parseFloat(d[breakdownCols[i]].replace(/,/g, '')) / 1000000
        }
        return d
      }).filter(d => {
        return !Number.isNaN(d.Imports) && d.Imports !== 0
      })

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
      portBreakdownChart.addTooltip('Total tonnage through port, ', 'thousands', 'label')
    }

    d3.select('#chart-indicator-port-total').style('display', 'block')
    d3.select('#chart-indicator-port-breakdown').style('display', 'none')

    d3.select('#btn-indicator-port-total').on('click', function () {
      activeBtn(this)
      d3.select('#chart-indicator-port-total').style('display', 'block')
      d3.select('#chart-indicator-port-breakdown').style('display', 'none')
      portTotalChart.drawChart()
      portTotalChart.addTooltip('Tonnage, ', 'thousands', 'label')
    })

    d3.select('#btn-indicator-port-breakdown').on('click', function () {
      activeBtn(this)
      d3.select('#chart-indicator-port-total').style('display', 'none')
      d3.select('#chart-indicator-port-breakdown').style('display', 'block')
      portBreakdownChart.drawChart()
      portBreakdownChart.addTooltip('Tonnage, ', 'thousands', 'label')
    })
  })
