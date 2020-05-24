import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
let employmentSectorChart
let employmentSectorURL = '../data/Economy/data_gov_economic_monitor/indicator-2-employment-by-sector.csv'

Promise.all([
  d3.csv(employmentSectorURL)
])
.then(data => {
  let employmentSectorData = data[0]

  let employmentSectorColumns = employmentSectorData.columns.slice(1)

  if (document.getElementById('chart-indicator-employment-sector')) {
    let broadSectorCols = employmentSectorColumns.slice(16, 21)

    let broadSectorData = employmentSectorData.map(d => {
      let yearQuarter = '20' + d.Quarter.split(' ')[1] + d.Quarter.split(' ')[0]
      d.label = yearQuarter
      d.date = convertQuarterToDate(yearQuarter)
      for (var i = 0, n = broadSectorCols.length; i < n; i++) {
        d[broadSectorCols[i]] = parseFloat(d[broadSectorCols[i]].replace(/,/g, ''))
      }
      return d
    })
    .filter(d => {
      return !Number.isNaN(d.Education)
      // parseInt(d.Quarter.split(' ')[1]) < 50
    })

    const employmentSector = {
      e: '#chart-indicator-employment-sector',
      d: broadSectorData,
      ks: broadSectorCols,
      xV: 'date',
      yV: broadSectorCols,
      tX: 'Quarter',
      tY: 'Employees (millions)'
    }
    employmentSectorChart = new StackedAreaChart(employmentSector)
    employmentSectorChart.drawChart()
    employmentSectorChart.addTooltip(', ', 'thousands', 'label')
  }
})
