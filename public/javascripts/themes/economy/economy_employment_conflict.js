import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { MultiLineChart } from '../../modules/MultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['employment', 'labour', 'unemployed', 'ilo-employment', 'ilo-unemployment']

<<<<<<< HEAD
/** * This QNQ22 employment and unemployment Charts ***/

Promise.all([
  d3.csv(annual),
  d3.csv(QNQ22)
=======
  const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // QLF08: Persons aged 15 years and over by Region, Quarter and Statistic
  const TABLE_CODE = 'QLF08'
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`)
    addSpinner('chart-' + chartDivIds[3], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`)
>>>>>>> staging

    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL + TABLE_CODE)

    if (json) {
      removeSpinner(chartDivIds[0])
      removeSpinner(chartDivIds[3])
    }

    const dataset = JSONstat(json).Dataset(0)
    // console.log(dataset)

    const dimensions = dataset.Dimension().map(dim => {
      return dim.label
    })
    // console.log(dimensions)

    const categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesRegion)

    // const categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
    //   return c.label
    // })
    // console.log(categoriesType)

    const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
      return c.label
    })
    // console.log(categoriesStat)

    //
    const employmentTable = dataset.toTable(
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
    //
    // console.log(employmentTable)

    const employedCount = {
      e: '#chart-' + chartDivIds[0],
      d: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[0]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[0])
    }
    // //
    const employedCountChart = new MultiLineChart(employedCount)

    const labourCount = {
      e: '#chart-' + chartDivIds[1],
      d: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[2]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[2])
    }

    const labourCountChart = new MultiLineChart(labourCount)

    const unemployedCount = {
      e: '#chart-' + chartDivIds[2],
      d: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[1]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[1])
    }

    const unemployedCountChart = new MultiLineChart(unemployedCount)

    const participationRate = {
      e: '#chart-' + chartDivIds[3],
      d: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[4]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[4])
    }

    const participationRateChart = new MultiLineChart(participationRate)

    const unemployedRate = {
      e: '#chart-' + chartDivIds[4],
      d: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[3]
      }),
      ks: categoriesRegion,
      k: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: getShortLabel(categoriesStat[3])
    }

    const unemployedRateChart = new MultiLineChart(unemployedRate)

<<<<<<< HEAD
//
// // #chart-overseas-vistors
//      // load csv data and turn value into a number
// d3.csv('../data/Economy/overseasvisitors.csv').then(data => {
//   let columnNames = data.columns.slice(1),
//     xValue = data.columns[0]
//
//   data.forEach(d => {
//     for (var i = 0, n = columnNames.length; i < n; ++i) {
//       d[columnNames[i]] = +d[columnNames[i]]
//     }
//     return d
//   })
//
//   let overseasVisitorsData = data
//
//   const tooltipContent = {
//       title: 'Oversea Vistors (Millions) - Year',
//       datelabel: xValue,
//       format: 'thousands'
//     },
//
//     overseasVisitorContent = {
//       e: '#chart-overseas-vistors',
//       d: overseasVisitorsData,
//       ks: columnNames,
//       xV: xValue,
//       tX: 'Years',
//       tY: 'Visitors (Millions)'
//              // ySF: "percentage"
//     },
//
//     overseasvisitorsChart = new GroupedBarChart(overseasVisitorContent)
//   overseasvisitorsChart.addTooltip(tooltipContent)
// })
//      // catch any error and log to console
//      .catch(function (error) {
//        console.log(error)
//      })
=======
    d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
    d3.select('#chart-' + chartDivIds[3]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[4]).style('display', 'none')
>>>>>>> staging

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        employedCountChart.drawChart()
        employedCountChart.addTooltip(',  ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
        labourCountChart.drawChart()
        labourCountChart.addTooltip(', ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[2]).style.display !== 'none') {
        unemployedCountChart.drawChart()
        unemployedCountChart.addTooltip(', ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[3]).style.display !== 'none') {
        participationRateChart.drawChart()
        participationRateChart.addTooltip(', ', '', 'label')
      }
      if (document.querySelector('#chart-' + chartDivIds[4]).style.display !== 'none') {
        unemployedRateChart.drawChart()
        unemployedRateChart.addTooltip(', ', '', 'label')
      }
    }
    redraw()

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[1], 'btn-' + chartDivIds[2]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[1]).on('click', function () {
      activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[2], 'btn-' + chartDivIds[0]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[2]).on('click', function () {
      activeBtn('btn-' + chartDivIds[2], ['btn-' + chartDivIds[0], 'btn-' + chartDivIds[1]])
      d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
      d3.select('#chart-' + chartDivIds[2]).style('display', 'block')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[3]).on('click', function () {
      activeBtn('btn-' + chartDivIds[3], ['btn-' + chartDivIds[4]])
      d3.select('#chart-' + chartDivIds[3]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[4]).style('display', 'none')
      redraw()
    })

    d3.select('#btn-' + chartDivIds[4]).on('click', function () {
      activeBtn('btn-' + chartDivIds[4], ['btn-' + chartDivIds[3]])
      d3.select('#chart-' + chartDivIds[4]).style('display', 'block')
      d3.select('#chart-' + chartDivIds[3]).style('display', 'none')
      redraw()
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating housing completion charts')
    console.log(e)

    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      // console.log('retry')
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
    'Persons aged 15 years and over in Labour Force (Thousand)': 'Persons in Labour Force',
    'ILO Unemployment Rate (15 - 74 years) (%)': 'ILO Unemployment Rate (%)',
    'ILO Participation Rate (15 years and over) (%)': 'ILO Participation Rate (%)'
  }

  return SHORTS[s] || s
}
