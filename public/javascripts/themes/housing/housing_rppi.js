import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'

(async () => {
  try {
    const parseYear = d3.timeParse('%Y')
    const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
    const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
    const TABLE_CODE = 'HPM09' // gives no of outsideState and ave household size
    let json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
    let dataset = JSONstat(json).Dataset(0)

    let dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })

    let categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
  //
    let categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })

    let houseRppiTable = dataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if ((d[dimensions[0]] === categoriesRegion[4]
           || d[dimensions[0]] === categoriesRegion[8]
           || d[dimensions[0]] === categoriesRegion[9]
           || d[dimensions[0]] === categoriesRegion[10]
           || d[dimensions[0]] === categoriesRegion[11])
         && d[dimensions[2]] === categoriesStat[0]) {
         d.date = parseYearMonth(d['Month'])
         d.label = d['Month']
         d.value = +d.value
         return d
       }
     })

    let houseRppi = {
      e: '#chart-house-rppi',
      d: houseRppiTable.filter(d => {
        return parseInt(d.date.getFullYear()) >= 2010
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: ''
    }

    let houseRppiChart = new MultiLineChart(houseRppi)

    function redraw () {
      houseRppiChart.drawChart()
      houseRppiChart.addTooltip('RPPI for ', '', 'label')
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating RPPI chart')
    console.log(e)
  }
})()

