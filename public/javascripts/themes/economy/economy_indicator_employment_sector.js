import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { coerceWideTable } from '../../modules/bcd-data.js'
let employmentSectorURL = '../data/Economy/data_gov_economic_monitor/indicator-2-employment-by-sector.csv'

Promise.all([
  d3.csv(employmentSectorURL)
])
.then(data => {
  const SHORT_KEYS = {
    "Dublin Employment ('000) - Construction (F)": 'Construction (F)',
    "Dublin Employment ('000) - Wholesale and retail trade, repair of motor vehicles and motorcycles (G)": 'Wholesale & retail',
    "Dublin Employment ('000) - Transportation and storage (H)": 'Transportation',
    "Dublin Employment ('000) - Accommodation and food service activities (I)":	'Accommodation & food',
    "Dublin Employment ('000) - Information and communication (J)": 'ICT',
    "Dublin Employment ('000) - Professional, scientific and technical activities (M)": 'Professional, scientific & technical',
    "Dublin Employment ('000) - Administrative and support service activities (N)": 'Admin',
    "Dublin Employment ('000) - Public administration and defence, compulsory social security (O)": 'Public admin',
    "Dublin Employment ('000) - Education (P)":	'Education (P)',
    "Dublin Employment ('000) - Human health and social work activities (Q)": 'Health & social work',
    "Dublin Employment ('000) - Industry (B to E)": 'Industry (B to E)',
    "Dublin Employment ('000) - Industry and Construction (B to F)": 'Industry & Construction (B to F)',
    "Dublin Employment ('000) - Services (G to U)": 'Services (G to U)',
    "Dublin Employment ('000) - Financial, insurance and real estate activities (K,L)": 'Financial, insurance & real estate',
    "Dublin Employment ('000) - Other NACE activities (R to U)": 'Other',
    "Dublin Employment ('000) - Not stated":	'Not stated'

  }

  let employmentSectorData = data[0]
  const keys = Object.keys(employmentSectorData[0])
  let longKeys = keys.slice(1, 17)

  // shorten the long column names
  employmentSectorData.forEach(d => {
    for (let i = 0; i < longKeys.length; i += 1) {
      d[SHORT_KEYS[longKeys[i]]] = d[longKeys[i]]
      delete d[longKeys[i]]
    }
  })
  // console.log(employmentSectorData)

  let employmentSectorColumns = Object.keys(employmentSectorData[0]).slice(1)
  // console.log('employmentSectorColumns')
  // console.log(employmentSectorColumns)

  if (document.getElementById('chart-indicator-employment-sector')) {
    let broadSectorCols = employmentSectorColumns.slice(0, 5)

    let broadSectorData = employmentSectorData.map(d => {
      let yearQuarter = '20' + d.Quarter.split(' ')[1] + d.Quarter.split(' ')[0]
      d.label = yearQuarter
      d.date = convertQuarterToDate(yearQuarter)
      for (var i = 0, n = broadSectorCols.length; i < n; i++) {
        d[broadSectorCols[i]] = parseFloat(d[broadSectorCols[i]])
      }
      return d
    })
    .filter(d => {
      return !Number.isNaN(d.Education) && parseInt(d.date.getFullYear()) < 2050
      // parseInt(d.Quarter.split(' ')[1]) < 50
    })

    const employmentSector = {
      e: '#chart-indicator-employment-sector',
      d: broadSectorData,
      ks: broadSectorCols,
      xV: 'date',
      yV: broadSectorCols,
      tX: 'Quarter',
      tY: 'Employees (thousands)'
    }
    let employmentSectorChart = new StackedAreaChart(employmentSector)

    function redraw () {
      console.log('redraw sector')
      employmentSectorChart.drawChart()
      employmentSectorChart.addTooltip('Employees (thousands), ', 'thousands', 'label')
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  }

  if (document.getElementById('chart-indicator-employment-services')) {
    // console.log('employmentSectorColumns')
    // console.log(employmentSectorColumns)
    let serviceCols = employmentSectorColumns.slice(6, 15).concat(employmentSectorColumns.slice(18, 19))
    // console.log('serviceCols')
    // console.log(serviceCols)

    let serviceData = employmentSectorData.map(d => {
      let yearQuarter = '20' + d.Quarter.split(' ')[1] + d.Quarter.split(' ')[0]
      d.label = yearQuarter
      d.date = convertQuarterToDate(yearQuarter)
      for (let i = 0, n = serviceCols.length; i < n; i++) {
        // console.log(serviceCols[i])
        // console.log(d[serviceCols[i]])
        d[serviceCols[i]] = parseInt(parseFloat(d[serviceCols[i]]) * 1000)
      }
      return d
    })
    .filter(d => {
      return parseInt(d.date.getFullYear()) < 2050
    })
    // console.log(serviceData)

    const employmentService = {
      e: '#chart-indicator-employment-services',
      d: serviceData,
      ks: serviceCols,
      xV: 'date',
      yV: serviceCols,
      tX: 'Quarter',
      tY: 'Employees'
    }
    let employmentServiceChart = new StackedAreaChart(employmentService)

    function redraw () {
      employmentServiceChart.drawChart()
      employmentServiceChart.addTooltip(', ', '', 'label')
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  }
})
