// /***

//   Population card

// ***/

import { hasCleanValue, getPercentageChange } from '../modules/bcd-data.js'
import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main (options) {
  // CNA13: Annual Rate of Population Increase by Sex, Province or County, CensusYear and Statistic

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  const json = await fetchJsonFromUrlAsync(options.plotoptions.data.href)
  // console.log('json')
  // console.log(json)

  // if (json) {
  // removeSpinner('chart-' + chartDivIds[0])
  // }

  const dataset = JSONstat(json).Dataset(0)
  // console.log(dataset)

  const dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })
  const categoriesSex = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  const categoriesStat = dataset.Dimension(dimensions[3]).Category().map(c => {
    return c.label
  })

  const populationFiltered = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if (d[dimensions[1]] === 'Dublin' &&
        d.Statistic === categoriesStat[0] &&
        d.Sex === categoriesSex[0] &&
        hasCleanValue(d)) {
        d.date = +d['Census Year']
        d.value = +d.value
        return d
      }
    })

  const populationConfig = {
    data: populationFiltered,
    elementid: '#' + options.plotoptions.chartid,
    yvaluename: 'value',
    xvaluename: 'date',
    // sN: dimensions[1],
    fV: d3.format('.2s'), // format y value
    dL: 'date'
  }

  const populationCard = new CardChartLine(populationConfig)

  // get latest trend info text
  const prevIndex = populationFiltered.length - 2 // can use this to set the desired trend interval
  const currIndex = populationFiltered.length - 1

  if ((prevIndex in populationFiltered) &&
    (currIndex in populationFiltered)) {
    const prevVal = populationFiltered[prevIndex].value
    const currVal = populationFiltered[currIndex].value
    const prevLabel = populationFiltered[prevIndex].date
    const currLabel = populationFiltered[currIndex].date
    const percentChange = getPercentageChange(currVal, prevVal)

    const trendText = percentChange < 0 ? 'This was <b>DOWN</b> <arrowdown>▼</arrowdown><b>' + Math.abs(percentChange) + '%</b>' : percentChange > 0 ? 'This was <b>UP</b>  <arrowup>▲</arrowup><b>' + percentChange + '%</b>' : 'This was <b>NO CHANGE</b>'

    const info = `In ${currLabel}, the <b>POPULATION</b> of Dublin was <b>${currVal}</b>. ${trendText} on ${prevLabel}`

    document.getElementById(options.id + '__info-text').innerHTML = info
  }

  window.addEventListener('resize', () => {
    populationCard.drawChart()
  })
}

export { main }
