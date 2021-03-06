
import { fetchJsonFromUrlAsync } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { GroupedBarChart } from '../../modules/GroupedBarChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'

(async function main () {
  d3.select('#chart-households').style('display', 'block')
  d3.select('#chart-households-size').style('display', 'none')

  let houseHoldsChart, houseHoldCompositionChart
  let houseHoldsContent, houseHoldsTT, houseHoldCompositionContent, houseHoldCompositionTT
  const parseYear = d3.timeParse('%Y')
  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // CNA33 - Number of households and number of persons resident by Type of Private Accommodation, Province County or City, CensusYear and Statistic

  const TABLE_CODE = 'CNA33' // gives no of households and ave household size
  const STATS = ['Number of Households  (Number)', 'Number of Persons Resident (Number)']

  // CNA29 - Private Permanent Households by Number of Persons, Province County or City and CensusYear

  const DIMENSION = 'Province County or City'
  const json = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + TABLE_CODE)

  const dataset = JSONstat(json).Dataset(0)
  // alert(dataset)
  // // the categories will be the label on each plot trace
  const categories = dataset.Dimension(DIMENSION).Category().map(c => {
    return c.label
  })

  const dublinLAs = [categories[3], categories[4], categories[5], categories[6]]
  //
  // let EXCLUDE = categories[0] // exclude 'All NACE economic sectors' trace
  // //
  //
  const householdsFiltered = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if ((d[DIMENSION] === categories[3] ||
        d[DIMENSION] === categories[4] ||
        d[DIMENSION] === categories[5] ||
        d[DIMENSION] === categories[6]) &&
        d.Statistic === STATS[0] &&
        d.value !== null &&
        d['Type of Private Accommodation'] === 'All households' &&
        +d['Census Year'] >= 1986) {
        d.date = parseYear(+d['Census Year'])
        d.label = +d['Census Year']
        d.value = +d.value
        return d
      }
    })
  //  console.log(householdsFiltered)

  houseHoldsContent = {
    e: 'chart-households',
    d: householdsFiltered,
    ks: dublinLAs,
    k: DIMENSION,
    xV: 'date',
    yV: 'value',
    tX: 'Census years',
    tY: STATS[0].split('(')[0],
    formaty: 'hundredThousandsShort'
  }

  houseHoldsChart = new BCDMultiLineChart(houseHoldsContent)

  redraw(houseHoldsChart)

  window.addEventListener('resize', () => {
    redraw(houseHoldsChart)
  })

  d3.select('#btn-households').on('click', function () {
    if (document.getElementById('chart-households').style.display === 'none') {
      activeBtn(this)
      d3.select('#chart-households').style('display', 'block')
      d3.select('#chart-households-size').style('display', 'none')
      redraw(houseHoldsChart)
    }
  })

  d3.select('#btn-households-size').on('click', function () {
    if (document.getElementById('chart-households').style.display === 'none') {
      activeBtn(this)
      d3.select('#chart-households').style('display', 'none')
      d3.select('#chart-households-size').style('display', 'block')
    }
  })
})()

function redraw (chart) {
  // houseHoldsChart.tickNumber = 31
  chart.drawChart()
  // houseHoldsChart.addTooltip(houseHoldsTT)
  chart.addTooltip('Number of households in ', '', 'label')
  chart.showSelectedLabelsX([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10])
}

// if (document.getElementById('chart-householdComposition')) {
//   d3.csv('../data/Demographics/CNA29.csv').then(data => {
//     const columnNames = data.columns.slice(2)
//     const xValue = data.columns[0]

//     const valueData = data.map(d => {
//       for (var i = 0, n = columnNames.length; i < n; i++) {
//         d[columnNames[i]] = +d[columnNames[i]]
//       }
//       return d
//     })

//     const houseHoldCompositionContent = {
//       e: '#chart-householdComposition',
//       d: valueData,
//       ks: columnNames,
//       xV: xValue,
//       tX: 'Person per Household',
//       tY: 'Number of Households',
//       ySF: 'millions'
//     }
//     // console.log(houseHoldCompositionContent)

//     const houseHoldCompositionTT = {
//       title: 'Person per Household:',
//       datelabel: xValue,
//       format: 'thousands'
//     }

//     let houseHoldCompositionChart = new GroupedBarChart(houseHoldCompositionContent)
//     houseHoldCompositionChart.drawChart()
//     houseHoldCompositionChart.addTooltip(houseHoldCompositionTT)
//     houseHoldCompositionChart.hideRate(true)

//     window.addEventListener('resize', () => {
//       // console.log('redraw households comp')
//       houseHoldCompositionChart = new GroupedBarChart(houseHoldCompositionContent)
//       houseHoldCompositionChart.drawChart()
//       houseHoldCompositionChart.addTooltip(houseHoldCompositionTT)
//       houseHoldCompositionChart.hideRate(true)
//     })

//     // d3.select(window).on("resize", function() {
//     //   console.log("Resize");
//     //   houseHoldCompositionChart.drawChart();
//     //   houseHoldCompositionChart.addTooltip(houseHoldCompositionTT);
//     // });
//   }).catch(function (error) {
//     console.log(error)
//   })
// }
