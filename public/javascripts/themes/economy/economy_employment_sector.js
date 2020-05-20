/** * This the Gross Value Added per Capita at Basic Prices Chart ***/

import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

(async () => {
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  const TABLE_CODE = 'QNQ40'
  console.log('fetch cso json: ' + TABLE_CODE)
  let json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

  let dataset = JSONstat(json).Dataset(0)
  console.log(dataset)
  const DIMENSION = 'NACE Rev 2 Economic Sector'
  // the categories will be the label on each plot trace
  let categories = dataset.Dimension(DIMENSION).Category().map(c => {
    return c.label
  })
  console.log(categories)

  let EXCLUDE = categories[0] // exclude 'All NACE economic sectors' trace
  //

  let sectorFiltered = dataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if (d.Region === 'Dublin'
       && d.Sex === 'Both sexes'
       && d[DIMENSION] !== EXCLUDE) {
         d.label = d.Quarter
         d.date = convertQuarterToDate(d.Quarter)
         d.value = +d.value
         return d
       }
     }
  )
  console.log(sectorFiltered)

  // let activeFiltered = dataset.toTable(
  //    { type: 'arrobj' },
  //    (d, i) => {
  //      if (d.County === 'Dublin'
  //    && d.Statistic === STATS[0]
  //    && d['Employment Size'] !== EXCLUDE) {
  //        d.label = d.Year
  //        d.date = parseYear(+d.Year)
  //        d.value = +d.value
  //        return d
  //      }
  //    }
  // )

  const sectorContent = {
    e: '#chart-employment-sector',
    xV: 'date',
    yV: 'value',
    d: sectorFiltered,
    k: DIMENSION,
    ks: categories, // used for the tooltip
    tX: 'Years',
    tY: 'Persons employed'

  }
  // const engagedContent = {
  //   e: '#chart-engaged-by-size',
  //   xV: 'date',
  //   yV: 'value',
  //   d: engagedFiltered,
  //   k: 'Employment Size',
  //   ks: categories, // used for the tooltip
  //   tX: 'Years',
  //   tY: 'Persons engaged'
  //
  // }
  //
  // const activeContent = {
  //   e: '#chart-active-enterprises',
  //   xV: 'date',
  //   yV: 'value',
  //   d: activeFiltered,
  //   k: 'Employment Size',
  //   ks: categories, // used for the tooltip
  //   tX: 'Years',
  //   tY: 'Active enterprises'
  //
  // }

  const sectorChart = new MultiLineChart(sectorContent)
  sectorChart.drawChart()
  // sectorChart.addTooltip(' for Year ', '', 'label')

  // const engagedChart = new MultiLineChart(engagedContent)
  // engagedChart.drawChart()
  // engagedChart.addTooltip(STATS[1] + ' for Year ', '', 'label')
  //
  // const activeChart = new MultiLineChart(activeContent)
  // activeChart.drawChart()
  // activeChart.addTooltip(STATS[0] + ' for Year ', '', 'label')

  // d3.select('#chart-employees-by-size').style('display', 'block')
  // d3.select('#chart-engaged-by-size').style('display', 'none')
  // d3.select('#chart-active-enterprises').style('display', 'none')
  //
  // d3.select('#btn-employees-by-size').on('click', function () {
  //   activeBtn(this)
  //   d3.select('#chart-employees-by-size').style('display', 'block')
  //   d3.select('#chart-engaged-by-size').style('display', 'none')
  //   d3.select('#chart-active-enterprises').style('display', 'none')
  //   // sectorChart.tickNumber = 12
  //   sectorChart.drawChart()
  //   sectorChart.addTooltip(STATS[2] + ' for Year ', '', 'label')
  //     // sectorChart.hideRate(true) // hides the rate column in the tooltip when the % change chart is shown
  // })
  // //
  // d3.select('#btn-engaged-by-size').on('click', function () {
  //   activeBtn(this)
  //   d3.select('#chart-employees-by-size').style('display', 'none')
  //   d3.select('#chart-engaged-by-size').style('display', 'block')
  //   d3.select('#chart-active-enterprises').style('display', 'none')
  //   // unemploymentStack.tickNumber = 12
  //   //   unemploymentStack.getData(unempData);
  //   engagedChart.drawChart()
  //   engagedChart.addTooltip(STATS[1] + ' for Year ', '', 'label')
  // })
  //
  // d3.select('#btn-active-enterprises').on('click', function () {
  //   activeBtn(this)
  //   d3.select('#chart-employees-by-size').style('display', 'none')
  //   d3.select('#chart-engaged-by-size').style('display', 'none')
  //   d3.select('#chart-active-enterprises').style('display', 'block')
  //   // activeChart.tickNumber = 12
  //   activeChart.drawChart()
  //   activeChart.addTooltip(STATS[0] + ' for Year ', '', 'label')
    // activeChart.hideRate(true)
  // })
})()
