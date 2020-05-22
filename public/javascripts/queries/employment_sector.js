import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

(async () => {
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'QNQ40'
  console.log('fetch cso json: ' + TABLE_CODE)
  let json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

  let dataset = JSONstat(json).Dataset(0)
  console.log(dataset)
  const DIMENSION = 'NACE Rev'
  // the categories will be the label on each plot trace
  let categories = dataset.Dimension(DIMENSION).Category().map(c => {
    return c.label
  })
  // console.log(categories[categories.length - 1])

  let EXCLUDE = categories[0] // exclude 'All NACE economic sectors' trace
  //

  let sectorFiltered = dataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if (d.Region === 'Dublin'
       && d.Sex === 'Both sexes'
       && d[DIMENSION] !== EXCLUDE
       && d[DIMENSION] !== categories[categories.length - 2] // 'Not stated'
      ) {
         d.label = d.Quarter
         d.date = convertQuarterToDate(d.Quarter)
         d.year = d.date.getFullYear()
         d.value = parseInt(d.value * 1000)
         return d
       }
     }
  )

  const sectorNested = stackNest(sectorFiltered, 'label', DIMENSION, 'value')

  const sectorContent = {
    e: '#chart-employment-sector',
    d: sectorNested,
    ks: categories, // used for the tooltip, traces
    xV: 'date',
    tX: 'Quarters',
    tY: 'Persons employed',
    ySF: ''

  }

  const sectorChart = new StackedAreaChart(sectorContent)
  sectorChart.drawChart()
  sectorChart.addTooltip(' for Year ', '', 'label')
})()
