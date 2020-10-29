import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { BCDStackedAreaChart } from '../../modules/BCDStackedAreaChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'
import { fetchCsvFromUrlAsyncTimeout } from '../../modules/bcd-async.js'

(async function main () {
  // const employmentSectorURL = '../data/Economy/data_gov_economic_monitor/indicator-2-employment-by-sector.csv'
  const employmentSectorURL = '/api/economicmonitor/indicator/2'
  try {
    addSpinner('chart-indicator-employment-services', '<b>data.gov.ie</b> for data: <i>Dublin Economic Monitor, Indicator 2 - Employment by Sector</i>')
    const data = await fetchCsvFromUrlAsyncTimeout(employmentSectorURL)
    if (data) {
      removeSpinner('chart-indicator-employment-services')
    }

    const employmentSectorData = d3.csvParse(data)
    const keys = Object.keys(employmentSectorData[0])
    const longKeys = keys.slice(1, 17)

    // shorten the long column names
    employmentSectorData.forEach(d => {
      for (let i = 0; i < longKeys.length; i += 1) {
        if (SHORT_KEYS[longKeys[i]]) {
          d[SHORT_KEYS[longKeys[i]]] = d[longKeys[i]]
          delete d[longKeys[i]]
        }
      }
    })
    // console.log(employmentSectorData)

    const employmentSectorColumns = Object.keys(employmentSectorData[0]).slice(1)
    // console.log('employmentSectorColumns')
    // console.log(employmentSectorColumns)

    if (document.getElementById('chart-indicator-employment-services')) {
    // console.log('employmentSectorColumns')
    // console.log(employmentSectorColumns)
      const serviceCols = employmentSectorColumns.slice(6, 15).concat(employmentSectorColumns.slice(18, 19))
      // console.log('serviceCols')
      // console.log(serviceCols)

      const serviceData = employmentSectorData.map(d => {
        const yearQuarter = '20' + d.Quarter.split(' ')[1] + d.Quarter.split(' ')[0]
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

      // console.log(serviceCols)

      const employmentService = {
        e: 'chart-indicator-employment-services',
        d: serviceData,
        ks: serviceCols,
        xV: 'date',
        yV: serviceCols,
        tX: 'Quarter',
        tY: 'Employees',
        margins: {
          left: 72
        }, 
        formaty: 'hundredThousandsShort'
      }
      const employmentServiceChart = new BCDStackedAreaChart(employmentService)

      redraw(employmentServiceChart)

      window.addEventListener('resize', () => {
        redraw(employmentServiceChart)
      })
    }
  } catch (e) {
    console.log('Error creating Employment by Sector chart')
    console.log(e)
    removeSpinner('chart-indicator-employment-services')
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-indicator-employment-services', eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-indicator-employment-services')
      main()
    })
  }
})()

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('Numbers employed, ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10])
}

const SHORT_KEYS = {
  "Dublin Employment ('000) - Construction (F)": 'Construction',
  "Dublin Employment ('000) - Wholesale and retail trade, repair of motor vehicles and motorcycles (G)": 'Motor vehicles',
  "Dublin Employment ('000) - Transportation and storage (H)": 'Transportation',
  "Dublin Employment ('000) - Accommodation and food service activities (I)": 'Accommodation & food',
  "Dublin Employment ('000) - Information and communication (J)": 'ICT',
  "Dublin Employment ('000) - Professional, scientific and technical activities (M)": 'Professional, Scientific & Technical',
  "Dublin Employment ('000) - Administrative and support service activities (N)": 'Admin',
  "Dublin Employment ('000) - Public administration and defence, compulsory social security (O)": 'Public Admin',
  "Dublin Employment ('000) - Education (P)": 'Education',
  "Dublin Employment ('000) - Human health and social work activities (Q)": 'Health & Social',
  "Dublin Employment ('000) - Industry (B to E)": 'Industry',
  "Dublin Employment ('000) - Industry and Construction (B to F)": 'Industry & Construction',
  "Dublin Employment ('000) - Services (G to U)": 'Services',
  "Dublin Employment ('000) - Financial, insurance and real estate activities (K,L)": 'Financial',
  "Dublin Employment ('000) - Other NACE activities (R to U)": 'Other',
  "Dublin Employment ('000) - Not stated": 'Not stated',
  'Private Sector': 'Private Sec.'

}
