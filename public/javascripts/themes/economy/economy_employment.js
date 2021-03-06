import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { hasCleanValue } from '../../modules/bcd-data.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'

import { TimeoutError } from '../../modules/TimeoutError.js'

(async function main () {
  const chartDivIds = ['employment', 'labour', 'unemployed', 'ilo-employment', 'ilo-unemployment']
  d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
  // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
  d3.select('#chart-' + chartDivIds[3]).style('display', 'none')

  const STATBANK_BASE_URL =
    'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
  // QLF08: Persons aged 15 years and over by Region, Quarter and Statistic
  const TABLE_CODE = 'QLF08'
  const STATIC_DATA_URL = '../data/statbank/QLF08.json'

  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`)
    addSpinner('chart-' + chartDivIds[3], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`)

    const json = await fetchJsonFromUrlAsyncTimeout(STATIC_DATA_URL)

    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
      removeSpinner('chart-' + chartDivIds[3])
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
    const traceNames = []
    //
    const employmentTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[dimensions[0]] === 'Dublin' ||
        d[dimensions[0]] === 'Mid-East') &&
        // || d[dimensions[0]] === categoriesRegion[0])
          hasCleanValue(d)) {
          d.date = convertQuarterToDate(d.Quarter)
          d.label = d.Quarter.replace('Q', ', Q')
          d.value = +d.value
          if (!traceNames.includes(d[dimensions[0]])) {
            traceNames.push(d[dimensions[0]])
          }
          return d
        }
      })
    //
    // console.log(employmentTable)
    // console.log(traceNames)

    const employedCount = {
      elementId: 'chart-' + chartDivIds[0],
      data: employmentTable.filter(d => {
        if (d[dimensions[2]] === categoriesStat[0]) d.value = d.value * 1000
        return d[dimensions[2]] === categoriesStat[0]
      }),
      tracenames: traceNames,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: '',
      tY: getShortLabel(categoriesStat[0]),
      formaty: 'hundredThousandsShort'
    }
    // //
    const employedCountChart = new BCDMultiLineChart(employedCount)

    const participationRate = {
      elementId: 'chart-' + chartDivIds[3],
      data: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[4]
      }),
      tracenames: traceNames,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: '',
      tY: getShortLabel(categoriesStat[4])
    }

    const participationRateChart = new BCDMultiLineChart(participationRate)

    // const labourCount = {
    //   elementId: 'chart-' + chartDivIds[1],
    //   data: employmentTable.filter(d => {
    //     return d[dimensions[2]] === categoriesStat[2]
    //   }),
    //   tracenames: categoriesRegion,
    //   tracekey: dimensions[0],
    //   xV: 'date',
    //   yV: 'value',
    //   tX: 'Year',
    //   tY: getShortLabel(categoriesStat[2])
    // }

    // const labourCountChart = new BCDMultiLineChart(labourCount)

    const unemployedCount = {
      elementId: 'chart-' + chartDivIds[2],
      data: employmentTable.filter(d => {
        if (d[dimensions[2]] === categoriesStat[1]) d.value = d.value * 1000
        return d[dimensions[2]] === categoriesStat[1]
      }),
      tracenames: traceNames,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: '',
      tY: getShortLabel(categoriesStat[1]),
      formaty: 'hundredThousandsShort'
    }

    const unemployedCountChart = new BCDMultiLineChart(unemployedCount)

    const unemployedRate = {
      elementId: 'chart-' + chartDivIds[4],
      data: employmentTable.filter(d => {
        return d[dimensions[2]] === categoriesStat[3]
      }),
      tracenames: traceNames,
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: '',
      tY: getShortLabel(categoriesStat[3])
    }

    const unemployedRateChart = new BCDMultiLineChart(unemployedRate)

    d3.select('#chart-' + chartDivIds[2]).style('display', 'block')
    d3.select('#chart-' + chartDivIds[4]).style('display', 'none')
    activeBtn('btn-' + chartDivIds[2], ['btn-' + chartDivIds[4]])

    const redraw = () => {
      if (document.querySelector('#chart-' + chartDivIds[0]).style.display !== 'none') {
        employedCountChart.drawChart()
        employedCountChart.addTooltip('Employed persons in  ', '', 'label')
        employedCountChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
        employedCountChart.showSelectedLabelsY([2, 4, 6, 8, 10])
      }
      // if (document.querySelector('#chart-' + chartDivIds[1]).style.display !== 'none') {
      //   labourCountChart.drawChart()
      //   labourCountChart.addTooltip(', ', '', 'label')
      // }
      if (document.querySelector('#chart-' + chartDivIds[2]).style.display !== 'none') {
        unemployedCountChart.drawChart()
        unemployedCountChart.addTooltip('Unemployed persons in ', '', 'label')
        unemployedCountChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
        unemployedCountChart.showSelectedLabelsY([2, 4, 6, 8, 10])
      }
      if (document.querySelector('#chart-' + chartDivIds[3]).style.display !== 'none') {
        participationRateChart.drawChart()
        participationRateChart.addTooltip('ILO participation rate for ', '', 'label')
        participationRateChart.hideRate(true)
        participationRateChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
        participationRateChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12])
      }
      if (document.querySelector('#chart-' + chartDivIds[4]).style.display !== 'none') {
        unemployedRateChart.drawChart()
        unemployedRateChart.addTooltip('Unemployment rate (%) for ', '', 'label')
        unemployedRateChart.hideRate(true)
        unemployedRateChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
        unemployedRateChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12])
      }
    }
    redraw()

    d3.select('#btn-' + chartDivIds[0]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[0]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[0], ['btn-' + chartDivIds[3]])
        d3.select('#chart-' + chartDivIds[0]).style('display', 'block')
        // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[3]).style('display', 'none')
        redraw()
      }
    })

    // d3.select('#btn-' + chartDivIds[1]).on('click', function () {
    //   activeBtn('btn-' + chartDivIds[1], ['btn-' + chartDivIds[2], 'btn-' + chartDivIds[0]])
    //   d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
    //   d3.select('#chart-' + chartDivIds[1]).style('display', 'block')
    //   d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
    //   redraw()
    // })

    d3.select('#btn-' + chartDivIds[3]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[3]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[3], ['btn-' + chartDivIds[0]])
        d3.select('#chart-' + chartDivIds[0]).style('display', 'none')
        // d3.select('#chart-' + chartDivIds[1]).style('display', 'none')
        d3.select('#chart-' + chartDivIds[3]).style('display', 'block')
        redraw()
      }
    })

    d3.select('#btn-' + chartDivIds[2]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[2]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[2], ['btn-' + chartDivIds[4]])
        d3.select('#chart-' + chartDivIds[2]).style('display', 'block')
        d3.select('#chart-' + chartDivIds[4]).style('display', 'none')
        redraw()
      }
    })

    d3.select('#btn-' + chartDivIds[4]).on('click', function () {
      if (document.getElementById('chart-' + chartDivIds[4]).style.display === 'none') {
        activeBtn('btn-' + chartDivIds[4], ['btn-' + chartDivIds[2]])
        d3.select('#chart-' + chartDivIds[4]).style('display', 'block')
        d3.select('#chart-' + chartDivIds[2]).style('display', 'none')
        redraw()
      }
    })

    window.addEventListener('resize', () => {
      redraw()
    })
  } catch (e) {
    console.log('Error creating employment charts')
    console.log(e)

    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = e instanceof TimeoutError ? e : 'An error occured'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    // console.log(errBtnID)
    d3.select(`#${errBtnID}`).on('click', function () {
      //   console.log('retry')
      removeErrorMessageButton('chart-' + chartDivIds[0])
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
