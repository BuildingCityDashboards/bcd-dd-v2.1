// /***

//   House price card

// ***/
import { hasCleanValue, getPercentageChange } from '../modules/bcd-data.js'
import { getMonthNameShort } from '../modules/bcd-date.js'
import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main (options) {
  // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  const json = await fetchJsonFromUrlAsync(options.plotoptions.data.href)

  // if (json) {
  // removeSpinner('chart-' + chartDivIds[0])
  // }

  const dataset = JSONstat(json).Dataset(0)
  // console.log(dataset)

  const dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })
  const categoriesType = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  const categoriesStatus = dataset.Dimension(dimensions[1]).Category().map(c => {
    return c.label
  })

  const categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
    return c.label
  })

  const categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
    return c.label
  })

  const parseYearMonth = d3.timeParse('%YM%m')

  const housePricesTable = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d[dimensions[0]] === categoriesType[0] &&
        d[dimensions[1]] === categoriesStatus[0] &&
        d[dimensions[2]] === categoriesStamp[0] &&
        d[dimensions[3]] === 'Dublin' &&
        d[dimensions[5]] === categoriesStat[2] &&
        hasCleanValue(d)) {
        d.date = parseYearMonth(d.Month)
        d.label = getMonthNameShort(d.date.getMonth()) + ' ' + d.date.getFullYear()
        return d
      }
    })

  // console.log(housePricesTable)

  const housePricesNested = d3.nest()
    .key(function (d) { return d.Month })
    .entries(housePricesTable)

  const housePricesAverage = housePricesNested.map(function (d) {
    const obj = {
      date: d.values[0].date,
      label: d.values[0].label // d.values[0].label.split('M')[0]

    }
    let sum = 0
    d.values.forEach(function (v) {
      sum += +v.value
    })
    obj.value = sum / 2

    return obj
  })

  const housePricesConfig = {
    elementid: '#' + options.plotoptions.chartid,
    data: housePricesAverage,
    yvaluename: 'value',
    xvaluename: 'date',
    fV: d3.format('.3s'), // format y value
    dL: 'label'
    // ,
    // tX: 'Year',
    // tY: categoriesStat[0]
  }
  //   console.log(housePricesConfig)
  const housePricesCardChart = new CardChartLine(housePricesConfig)

  // get latest trend info text
  const prevIndex = housePricesAverage.length - 6 // can use this to set the desired trend interval
  const currIndex = housePricesAverage.length - 1

  if ((prevIndex in housePricesAverage) &&
    (currIndex in housePricesAverage)) {
    const prevVal = housePricesAverage[prevIndex].value
    const currVal = housePricesAverage[currIndex].value
    const prevLabel = housePricesAverage[prevIndex].label
    const currLabel = housePricesAverage[currIndex].label
    const delta = (currVal - prevVal).toPrecision(2)
    const percentChange = getPercentageChange(prevVal, currVal)

    const trendText = percentChange < 0 ? 'This was <b>DOWN</b> <arrowdown>▼</arrowdown><b>' + percentChange + '%</b>' : percentChange > 0 ? 'This was <b>UP</b>  <arrowup>▲</arrowup><b>' + percentChange + '%</b>' : 'This was <b>NO CHANGE</b>'

    const info = `In ${currLabel}, the average <b>HOUSE PRICE</b> in Dublin was <b>€${Math.floor(currVal)}</b>. ${trendText} on ${prevLabel}`

    document.getElementById(options.id + '__info-text').innerHTML = info
  }

  window.addEventListener('resize', () => {
    housePricesCardChart.drawChart()
  })
}

export { main }
