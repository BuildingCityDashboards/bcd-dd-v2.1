/** * This the Gross Value Added per Capita at Basic Prices Chart ***/

import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

(async () => {
  // console.log('fetch cso json')
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'RAA06'
  let STAT = 'Gross Value Added (GVA) per person at Basic Prices (Euro)'

  let json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)
  let gvaDataset = JSONstat(json).Dataset(0)

  let gvaFiltered = gvaDataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if ((d.Region === 'Dublin'
       || d.Region === 'Dublin and Mid-East'
       || d.Region === 'State')
       && d.Statistic === STAT) {
         d.label = d.Year
         d.date = parseYear(+d.Year)
         d.value = +d.value
         return d
       }
     }
  )

  const gvaContent = {
    e: '#chart-gva',
    xV: 'date',
    yV: 'value',
    d: gvaFiltered,
    k: 'Region',
    ks: ['Dublin', 'Dublin and Mid-East', 'State'],
    tX: 'Years',
    tY: '€'

  }

  const gvaChart = new MultiLineChart(gvaContent)
  gvaChart.drawChart()
  gvaChart.addTooltip(STAT + 'Year:', '', 'label')
})()

