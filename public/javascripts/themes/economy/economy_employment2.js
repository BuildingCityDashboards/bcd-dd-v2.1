import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'

import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['employment', 'emp-rate']//['employment', 'labour', 'unemployed']

  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // QLF08: Persons aged 15 years and over by Region, Quarter and Statistic
  const TABLE_CODE = 'QLF08'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`)

    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)

    if (json) {
	  removeSpinner('chart-' + chartDivIds[0])
	 // console.log('0A' + JSON.stringify(json))
    }

    const dataset = JSONstat(json).Dataset(0)
    //console.log('1A'+ dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    //console.log('2A'+ dimensions)

    const categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    //console.log('3A'+ categoriesRegion)

    // const categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
    //   return c.label
    // })
    // console.log(categoriesType)

    const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    //console.log('4A' + categoriesStat)

    
    const employedCountTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[dimensions[0]] === 'Southern' ||
          d[dimensions[0]] === 'South-West' ||
          d[dimensions[0]] === categoriesRegion[0]) &&
          !isNaN(+d.value)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter
          d.value = +d.value * 1000
          return d
        }
      })
    
   console.log(employedCountTable)

    const employedCount = {
      e: '#chart-' + chartDivIds[0],
      d: employedCountTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[0]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[0])
    }
    //
    const employedCountChart = new MultiLineChart(employedCount)

    const labourCount = {
      e: '#chart-' + chartDivIds[1],
      d: employedCountTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[2]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[2])
    }

    //const labourCountChart = new MultiLineChart(labourCount)

    // const unemployedCount = {
    //   e: '#chart-' + chartDivIds[2],
    //   d: employedCountTable.filter(d => {
    //     return d[dimensions[2]] === categoriesStat[1]
    //   }),
    //   ks: categoriesRegion,
    //   k: dimensions[0],
    //   xV: 'date',
    //   yV: 'value',
    //   tX: 'Year',
    //   tY: getShortLabel(categoriesStat[1])
    // }

//     const unemployedCountChart = new MultiLineChart(unemployedCount)

//     d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
//     d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
//     d3.select('#chart-' + chartDivIds[2]).style('display', 'none')

//     const redraw = () => {
//       if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
//         employedCountChart.drawChart()
//         employedCountChart.addTooltip(',  ', '', 'label')
//       }
//       if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
//         labourCountChart.drawChart()
//         labourCountChart.addTooltip(', ', '', 'label')
//       }
//       if (document.querySelector('#chart-' + chartDivIds[2]).style.display !== 'none') {
//         unemployedCountChart.drawChart()
//         unemployedCountChart.addTooltip(', ', '', 'label')
//       }
//     }
//     redraw()

//     d3.select('#btn-' + chartDivIds[0]).on('click', function () {
//       activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1], 'btn-' + chartDivIds[2]])
//       d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
//       d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
//       d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
//       redraw()
//     })

//     d3.select('#btn-' + chartDivIds[1]).on('click', function () {
//       activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[2], 'btn-' + chartDivIds[0]])
//       d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
//       d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
//       d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
//       redraw()
//     })

//     d3.select('#btn-' + chartDivIds[2]).on('click', function () {
//       activeBtn('btn-' + chartDivIds[2], ['btn-' + chartDivIds[0], 'btn-' + chartDivIds[1]])
//       d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
//       d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
//       d3.select('#chart-' + chartDivIds[2]).style('display', 'block')
//       redraw()
//     })

//     window.addEventListener('resize', () => {
//       redraw()
//     })
  } catch (e) {
    console.log('Error creating housing completion charts')
    console.log(e)

    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      console.log('retry')
      removeErrorMessageButton(chartDivIds[0])
      main()
    })
  }
})()

const getShortLabel = function (s) {
  // Allows color get by name when data order is not guaranteed
  const SHORTS = {
    'Persons aged 15 years and over in Employment (Thousand)': 'Persons in Employment',
    'Unemployed Persons aged 15 years and over (Thousand)': 'Unemployed Persons',
    'Persons aged 15 years and over in Labour Force (Thousand)': 'Persons in Labour Force'
  }

  return SHORTS[s] || s
}