// /***
//   Population card
// ***/

import { hasCleanValue, getPercentageChange } from '../modules/bcd-data.js'
import { convertQuarterToDate } from '../modules/bcd-date.js'
import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main (options) {
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
  // const categoriesRegion = dataset.Dimension(dimensions[0]).Category().map(c => {
  //   return c.label
  // })

  const categoriesStat = dataset.Dimension(dimensions[2]).Category().map(c => {
    return c.label
  })

  const employmentTable = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d[dimensions[0]] === 'Dublin' &&
      d[dimensions[2]] === categoriesStat[3] &&
                hasCleanValue(d)) {
        d.date = convertQuarterToDate(d.Quarter)
        d.value = +d.value
        d.label = d.Quarter.replace('Q', ' Q')
        return d
      }
    })

  // console.log(employmentTable)

  const employedCountConfig = {
    data: employmentTable,
    elementid: '#' + options.plotoptions.chartid,
    yvaluename: 'value',
    xvaluename: 'date',
    // sN: dimensions[1],
    fV: d3.format('.3s'), // format y value
    dL: 'label'
  }

  const employmentnCard = new CardChartLine(employedCountConfig)

  // get latest trend info text
  const prevIndex = employmentTable.length - 2
  const currIndex = employmentTable.length - 1

  if ((prevIndex in employmentTable) &&
    (currIndex in employmentTable)) {
    const prevVal = employmentTable[prevIndex].value
    const currVal = employmentTable[currIndex].value
    const prevLabel = employmentTable[prevIndex].label
    const currLabel = employmentTable[currIndex].label
    const delta = (currVal - prevVal).toPrecision(2)
    const trendText = delta < 0 ? 'This was <b>DOWN</b> <arrowdown>▼</arrowdown><b>' + Math.abs(delta) + '%</b>' : delta > 0 ? 'This was <b>UP</b>  <arrowup>▲</arrowup><b>' + delta + '%</b>' : 'This was <b>NO CHANGE</b>'

    const info = `In ${currLabel.replace('Q', 'quarter ')}, the <b>UNEMPLOYMENT RATE</b> in Dublin was <b>${currVal}%</b>. ${trendText} on ${prevLabel.replace('Q', 'quarter ')}`

    document.getElementById(options.id + '__info-text').innerHTML = info
  }

  window.addEventListener('resize', () => {
    employmentnCard.drawChart()
  })
}

export { main }
