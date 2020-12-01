import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'

import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['house-rppi', 'apartment-rppi']
  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  d3.select('#chart-' + chartDivIds[1]).style('display', 'none')

  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00

  const STATBANK_BASE_URL =
    // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
    'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HPM09/JSON-stat/2.0/en'
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  const TABLE_CODE = 'HPM09' // gives no of outsideState and ave household size

  // The API change on 2020-12-01 resulted in a dimension labelling error which is fixed here
  const fixLabel = function (l) {
    const labelMap = {
      'Type of Residential Property': 'C02803V03373',
      Statistic: 'STATISTIC',
      County: 'C02451V02968',
      Month: 'TLIST(M1)'
    }
    return labelMap[l] || l
  }

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }
    const dataset = JSONstat(json).Dataset(0)
    console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })

    console.log(dimensions)

    const categoriesRegion = dataset.Dimension(fixLabel(dimensions[2])).Category().map(c => {
      return c.label
    })

    console.log(categoriesRegion)
    //
    const categoriesStat = dataset.Dimension(fixLabel(dimensions[0])).Category().map(c => {
      return c.label
    })
    console.log(categoriesStat)

    // to keep track of the trace names that we will plot
    const traceNames = []

    // categoriesRegion.filter(d => {
    //   console.log(d)
    //   return d === categoriesRegion[4] || categoriesRegion[8] || categoriesRegion[9] || categoriesRegion[10] || categoriesRegion[11]
    // })
    // console.log('useRegions')
    // console.log(categoriesRegion)

    const houseRppiTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        d.date = parseYearMonth(d[fixLabel('Month')])
        if ((d[fixLabel(dimensions[2])] === categoriesRegion[1] ||
          d[fixLabel(dimensions[2])] === categoriesRegion[2] ||
          d[fixLabel(dimensions[2])] === categoriesRegion[3] ||
          d[fixLabel(dimensions[2])] === categoriesRegion[19] ||
          d[fixLabel(dimensions[2])] === categoriesRegion[4] ||
          d[fixLabel(dimensions[2])] === categoriesRegion[18]) &&
          d[fixLabel(dimensions[0])] === categoriesStat[0] &&
          parseInt(d.date.getFullYear()) >= 2010) {
          d[fixLabel(dimensions[2])] = d[fixLabel(dimensions[2])].replace('excluding', 'ex.')
          d.label = d[fixLabel('Month')]
          d.value = +d.value
          // track the available values of only the filtered entries
          if (!traceNames.includes(d[fixLabel(dimensions[2])])) {
            traceNames.push(d[fixLabel(dimensions[2])])
          }
          return d
        }
      })
    console.log(traceNames)

    console.log(houseRppiTable)

    const houseRppi = {
      e: 'chart-' + chartDivIds[0],
      d: houseRppiTable
        .filter(d => {
          return (d[fixLabel(dimensions[2])].includes('houses'))
        })
        .map(d => {
          d[fixLabel(dimensions[2])] = d[fixLabel(dimensions[2])].split(' - houses')[0]
          return d
        }),
      // ks: traceNames.filter(d => {
      //   return d.includes('houses')
      // }),
      k: fixLabel(dimensions[2]),
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'RPPI',
      margins: {
        left: 48
      }
    }

    const houseRppiChart = new BCDMultiLineChart(houseRppi)
    redraw(houseRppiChart)

    const apartmentRppi = {
      e: 'chart-' + chartDivIds[1],
      d: houseRppiTable.filter(d => {
        return (d[fixLabel(dimensions[2])].includes('apartments'))
      })
        .map(d => {
          d[fixLabel(dimensions[2])] = d[fixLabel(dimensions[2])].split(' - apartments')[0]
          return d
        }),
      // ks: ['Test','Test',' Test','Test'],
      k: fixLabel(dimensions[2]),
      xV: 'date',
      yV: 'value',
      tX: '',
      tY: 'RPPI',
      margins: {
        left: 48
      }
    }

    console.log(apartmentRppi)
    const apartmentRppiChart = new BCDMultiLineChart(apartmentRppi)

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[0]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1]])
        d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
        redraw(houseRppiChart)
      }
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[1]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[0]])
        d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
        redraw(apartmentRppiChart)
      }
    })

    window.addEventListener('resize', () => {
      if (document.getElementById('chart-' + chartDivIds[0]).style.display !== 'none') {
        redraw(houseRppiChart)
      }
      if (document.getElementById('chart-' + chartDivIds[1]).style.display !== 'none') {
        redraw(apartmentRppiChart)
      }
    })
  } catch (e) {
    console.log('Error creating RPPI chart')
    console.log(e)
    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = (e instanceof TimeoutError) ? e : 'An error occured fetching the data from the external provider (CSO)'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    console.log(eMsg)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()

function redraw (chart) {
  chart.drawChart()
  chart.addTooltip('RPPI for ', '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10, 12])
  chart.addBaseLine(100)
}
