import { convertQuarterToDate } from '../modules/bcd-date.js'
import { hasCleanValue, getPercentageChange } from '../modules/bcd-data.js'
import { CardChartLine } from '../modules/CardChartLine.js'
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js'
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'

async function main (options) {
  const json = await fetchJsonFromUrlAsync(options.plotoptions.data.href)

  //   const parseYear = d3.timeParse('%Y')
  //   const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const dataset = JSONstat(json).Dataset(0)
  console.log(dataset)

  const dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })
  // console.log(dimensions)

  const categoriesLA = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })
  console.log(categoriesLA)

  const categoriesType = dataset.Dimension(dimensions[1]).Category().map(c => {
    return c.label
  })
  console.log(categoriesType)

  const categoriesStat = dataset.Dimension(dimensions[3]).Category().map(c => {
    return c.label
  })
  console.log(categoriesStat)

  //
  const completionsTable = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      if ((d[dimensions[0]] === categoriesLA[6] ||
            d[dimensions[0]] === categoriesLA[25] ||
            d[dimensions[0]] === categoriesLA[26] ||
            d[dimensions[0]] === categoriesLA[28]) &&
                      hasCleanValue(d)) {
        d[dimensions[0]] = getTraceNameLA(d[dimensions[0]])
        d.date = convertQuarterToDate(d.Quarter)
        d.label = d.Quarter
        d.value = +d.value
        return d
      }
    })
  //
  console.log(completionsTable)

  const completionsNested = d3.nest()
    .key(function (d) { return d.date })
    .entries(completionsTable)

  // console.log('completionsNested')
  console.log(completionsNested)

  const completionsWide = completionsNested.map(function (d) {
    const obj = {
      label: d.values[0].label.replace('Q', ' Q'),
      value: 0
    }
    d.values.forEach(function (v) {
      obj.date = v.date
      obj.value = obj.value + v.value
    })
    return obj
  })

  console.log('completionsWide')
  console.log(completionsWide)

  const completionsConfig = {
    data: completionsWide,
    elementid: '#' + options.plotoptions.chartid,
    yvaluename: 'value',
    xvaluename: 'date',
    // sN: dimensions[1],
    fV: d3.format('.2s'), // format y value
    dL: 'label'
  }

  const completionsCardChart = new CardChartLine(completionsConfig)

  // get latest trend info text
  const prevIndex = completionsWide.length - 3 // can use this to set the desired trend interval
  const currIndex = completionsWide.length - 1

  if ((prevIndex in completionsWide) &&
    (currIndex in completionsWide)) {
    const prevVal = completionsWide[prevIndex].value
    const currVal = completionsWide[currIndex].value
    const prevLabel = completionsWide[prevIndex].label
    const currLabel = completionsWide[currIndex].label
    const percentChange = getPercentageChange(currVal, prevVal)

    const trendText = percentChange < 0 ? '<b>DOWN</b> <arrowdown>▼</arrowdown><b>' + Math.abs(percentChange) + '%</b>' : percentChange > 0 ? '<b>UP</b>  <arrowup>▲</arrowup><b>' + percentChange + '%</b>' : '<b>NO CHANGE</b>'

    const info = `In ${currLabel.replace('Q', 'quarter ')}, the number of total <b>HOUSE COMPLETIONS</b> in Dublin was <b>${currVal}</b> units. This was ${trendText} on ${prevLabel.replace('Q', 'quarter ')}`

    document.getElementById(options.id + '__info-text').innerHTML = info
  }

  window.addEventListener('resize', () => {
    completionsCardChart.drawChart()
  })
}

export { main }

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
