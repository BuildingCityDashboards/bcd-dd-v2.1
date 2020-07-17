import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { stackNest } from '../../modules/bcd-data.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'
import { addSpinner } from '../../modules/bcd-ui.js'
import { removeSpinner } from '../../modules/bcd-ui.js'
import { addErrorMessage } from '../../modules/bcd-ui.js'

(async () => {
  let chartDivIds = ['#chart-completions-house', '#chart-completions-scheme', '#chart-completions-apartment']
  const parseYear = d3.timeParse('%Y')
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
// NDQ06: New Dwelling Completion by Local Authority, Type of House and Quarter
  const TABLE_CODE = 'NDQ06'
  try {
    addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>New Dwelling Completion</i>`)

    let json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)

    if (json) {
      {
        removeSpinner(chartDivIds[0])
      }

      let dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

      let dimensions = dataset.Dimension().map(dim => {
        return dim.label
      })
    // console.log(dimensions)

      let categoriesLA = dataset.Dimension(dimensions[0]).Category().map(c => {
        return c.label
      })
    // console.log(categoriesLA)

      let categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
        return c.label
      })
    // console.log(categoriesType)

      let categoriesStat = dataset.Dimension(dimensions[3]).Category().map(c => {
        return c.label
      })
    // console.log(categoriesStat)

  //
      let completionsTable = dataset.toTable(
     { type: 'arrobj' },
     (d, i) => {
       if ((d[dimensions[0]] === categoriesLA[6] ||
          d[dimensions[0]] === categoriesLA[25] ||
          d[dimensions[0]] === categoriesLA[26] ||
          d[dimensions[0]] === categoriesLA[28])
          && !isNaN(+d.value)) {
         d[dimensions[0]] = getTraceNameLA(d[dimensions[0]])
         d.date = convertQuarterToDate(d['Quarter'])
         d.label = d['Quarter']
         d.value = +d.value
         return d
       }
     })
    //
    // console.log(completionsTable)

      let completionsHouse = {
        e: '#chart-completions-house',
        d: completionsTable.filter(d => {
          return d[dimensions[1]] === categoriesType[0]
        }),
        ks: categoriesLA,
        k: dimensions[0],
        xV: 'date',
        yV: 'value',
        tX: 'Year',
        tY: categoriesStat[0]
      }
    //
      let completionsHouseChart = new MultiLineChart(completionsHouse)

      let completionsScheme = {
        e: '#chart-completions-scheme',
        d: completionsTable.filter(d => {
          return d[dimensions[1]] === categoriesType[1]
        }),
        ks: categoriesLA,
        k: dimensions[0],
        xV: 'date',
        yV: 'value',
        tX: 'Year',
        tY: categoriesStat[0]
      }
    //
      let completionsSchemeChart = new MultiLineChart(completionsScheme)

      let completionsApartment = {
        e: '#chart-completions-apartment',
        d: completionsTable.filter(d => {
          return d[dimensions[1]] === categoriesType[2]
        }),
        ks: categoriesLA,
        k: dimensions[0],
        xV: 'date',
        yV: 'value',
        tX: 'Year',
        tY: categoriesStat[0]
      }
    //
      let completionsApartmentChart = new MultiLineChart(completionsApartment)

      const chart1 = 'completions-house'
      const chart2 = 'completions-scheme'
      const chart3 = 'completions-apartment'

      d3.select('#chart-' + chart1).style('display', 'block')
      d3.select('#chart-' + chart2).style('display', 'none')
      d3.select('#chart-' + chart3).style('display', 'none')

      function redraw () {
        if (document.querySelector('#chart-' + chart1).style.display !== 'none') {
          completionsHouseChart.drawChart()
          completionsHouseChart.addTooltip('Single house completions,  ', '', 'label')
        }
        if (document.querySelector('#chart-' + chart2).style.display !== 'none') {
          completionsSchemeChart.drawChart()
          completionsSchemeChart.addTooltip('Scheme house completions, ', '', 'label')
        }
        if (document.querySelector('#chart-' + chart3).style.display !== 'none') {
          completionsApartmentChart.drawChart()
          completionsApartmentChart.addTooltip('Apartmnent completions, ', '', 'label')
        }
      }
      redraw()

      d3.select('#btn-' + chart1).on('click', function () {
        activeBtn(this)
        d3.select('#chart-' + chart1).style('display', 'block')
        d3.select('#chart-' + chart2).style('display', 'none')
        d3.select('#chart-' + chart3).style('display', 'none')
        redraw()
      })

      d3.select('#btn-' + chart2).on('click', function () {
        activeBtn(this)
        d3.select('#chart-' + chart1).style('display', 'none')
        d3.select('#chart-' + chart2).style('display', 'block')
        d3.select('#chart-' + chart3).style('display', 'none')
        redraw()
      })

      d3.select('#btn-' + chart3).on('click', function () {
        activeBtn(this)
        d3.select('#chart-' + chart1).style('display', 'none')
        d3.select('#chart-' + chart2).style('display', 'none')
        d3.select('#chart-' + chart3).style('display', 'block')
        redraw()
      })

      window.addEventListener('resize', () => {
        redraw()
      })
    }
  } catch (e) {
    console.log('Error creating housing completion charts')
    console.log(e)

    removeSpinner(chartDivIds[0])
    addErrorMessage(chartDivIds[0], e)
  }
})()

const getTraceNameLA = function (s) {
  // Allows color get by name when data order is not guaranteed
  const SHORTS = {
    'Dublin (City Council)': 'Dublin City',
    'Dun Laoire/Rathdown (County Council)': 'Dún Laoghaire-Rathdown',
    'Fingal (County Council)': 'Fingal',
    'South Dublin Co. Co. (County Council)': 'South Dublin'
  }

  return SHORTS[s] || s
}
