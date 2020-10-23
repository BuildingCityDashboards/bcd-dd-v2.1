import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { BCDStackedAreaChart } from '../../modules/BCDStackedAreaChart.js'
import { TimeoutError } from '../../modules/TimeoutError.js'
import { fetchCsvFromUrlAsyncTimeout } from '../../modules/bcd-async.js'

(async function main () {
  d3.select('#chart-indicator-port-total').style('display', 'block')
  d3.select('#chart-indicator-port-breakdown').style('display', 'none')
  const portTonnage = '../data/Economy/data_gov_economic_monitor/indicator-10-dublin-port-tonnage.csv'
  let portTotalChart
  let portBreakdownChart
  try {
    addSpinner('chart-indicator-port-total', '<b>data.gov.ie</b> for data: <i>Dublin Economic Monitor, Indicator 10 - Dublin Port</i>')
    const data = await fetchCsvFromUrlAsyncTimeout(portTonnage)
    if (data) {
      removeSpinner('chart-indicator-port-total')
    }
    const portData = d3.csvParse(data)
    const portColumns = portData.columns.slice(1)
    if (document.getElementById('chart-indicator-port-total')) {
      const longData = portData.map(d => {
        // the date is re-formatted  "'Q'Q YY" -> "YYYY'Q'Q"
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        let value = parseFloat(d[portColumns[0]].replace(/,/g, '')) / 1000000
        value = value.toPrecision(3)
        const obj = {
          value: value,
          variable: portColumns[0],
          date: convertQuarterToDate(yearQuarter),
          label: yearQuarter.replace(/Q/, ' Q')
        }
        return obj
      })

      const portTonnageCount = {
        e: 'chart-indicator-port-total',
        d: longData,
        k: 'variable', // key whose value will name the traces (group by)
        xV: 'date',
        yV: 'value',
        tX: 'Quarter',
        tY: 'Tonnes (millions)',
        margins: {
          left: 40
        }
      }
      portTotalChart = new BCDMultiLineChart(portTonnageCount)

      redraw(portTotalChart)
    }

    if (document.getElementById('chart-indicator-port-breakdown')) {
      const breakdownCols = portColumns.slice(10, 12)

      const portBreakdownData = portData.map(d => {
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        const obj = {
          label: yearQuarter.replace(/Q/, ' Q'),
          date: convertQuarterToDate(yearQuarter)
        }
        for (var i = 0, n = breakdownCols.length; i < n; i++) {
          obj[breakdownCols[i]] = parseFloat(d[breakdownCols[i]].replace(/,/g, '')) / 1000000
        }
        return obj
      }).filter(d => {
        return !Number.isNaN(d.Imports) && d.Imports !== 0
      })
      // console.log(portBreakdownData)

      const portTonnageBreakdown = {
        e: 'chart-indicator-port-breakdown',
        d: portBreakdownData,
        ks: ['Imports', 'Exports'],
        xV: 'date',
        yV: breakdownCols,
        tX: 'Quarter',
        tY: 'Tonnes (millions)',
        margins: {
          left: 40
        }
      }
      portBreakdownChart = new BCDStackedAreaChart(portTonnageBreakdown)
      // redraw(portBreakdownChart)
    }

    window.addEventListener('resize', () => {
      if (d3.select('#chart-indicator-port-total').style.display !== 'none') {
        redraw(portTotalChart)
      } else {
        redraw(portBreakdownChart)
      }
    })

    d3.select('#btn-indicator-port-total').on('click', function () {
      activeBtn(this)
      d3.select('#chart-indicator-port-total').style('display', 'block')
      d3.select('#chart-indicator-port-breakdown').style('display', 'none')
      redraw(portTotalChart)
    })

    d3.select('#btn-indicator-port-breakdown').on('click', function () {
      activeBtn(this)
      d3.select('#chart-indicator-port-total').style('display', 'none')
      d3.select('#chart-indicator-port-breakdown').style('display', 'block')
      redraw(portBreakdownChart)
    })
  } catch (e) {
    console.log('Error creating Dublin Port chart')
    console.log(e)
    removeSpinner('chart-indicator-port-total')
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-indicator-port-total', eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-indicator-port-total')
      main()
    })
  }
})()

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('Millions of tonnes, ', 'thousands', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12, 14])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14])
}
