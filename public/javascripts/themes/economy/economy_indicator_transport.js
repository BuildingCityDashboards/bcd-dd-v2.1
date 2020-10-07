import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { MultiLineChart } from '../../modules/MultiLineChart.js'

(async () => {
  const publicTransportURL = '/api/economicmonitor/indicator/8'
  const publicTransportData = await d3.csv(publicTransportURL)

  try {
    const publicTransportColumns = publicTransportData.columns.slice(1)

    const getData = (key, newKey) => {
      const longArray = publicTransportData.map(d => {
        // the date is re-formatted  "'Q'Q YY" -> "YYYY'Q'Q"
        const yearQuarter = '20' + d.Quarter.toString().split(' ')[1] + d.Quarter.toString().split(' ')[0]
        const value = parseFloat(d[key].replace(/,/g, ''))
        const variable = newKey || key
        const obj = {
          label: yearQuarter.replace(/Q/, ' Quarter '),
          value: value,
          variable: variable,
          date: convertQuarterToDate(yearQuarter)
        }
        // console.log(obj)

        return obj
      }).filter(d => {
        return !Number.isNaN(d.value)
      })
      return longArray
    }

    if (document.getElementById('chart-public-transport-trips')) {
      const busEireannData = getData(publicTransportColumns[1], 'Bus Éireann') // bodge to replace non utf8 encoded characters
      const dublinBusData = getData(publicTransportColumns[2])
      const irishRailData = getData(publicTransportColumns[3])
      const luasData = getData(publicTransportColumns[4])

      const longData = busEireannData.concat(dublinBusData).concat(irishRailData).concat(luasData)

      // console.log(longData)

      const publicTransportOptions = {
        e: '#chart-public-transport-trips',
        d: longData,
        k: 'variable', // key whose value will name the traces (group by)
        xV: 'date',
        yV: 'value',
        tX: 'Quarter',
        tY: 'Trips (millions)',
        ySF: 'millions'
      }
      const publicTransportChart = new MultiLineChart(publicTransportOptions)

      const redraw = () => {
        publicTransportChart.drawChart()
        publicTransportChart.addTooltip('Millions of trips, ', 'thousands', 'label')
      }

      redraw()

      window.addEventListener('resize', () => {
        redraw()
      })
    }
  } catch (e) {
    console.log(e)
  }
})()
