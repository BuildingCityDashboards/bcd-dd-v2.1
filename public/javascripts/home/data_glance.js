function checkTouchDevice () {
  return 'ontouchstart' in document.documentElement
}
const IS_TOUCH_DEVICE = checkTouchDevice()

// console.log("Touch = " + IS_TOUCH_DEVICE);

// Manage periodic async data fetching (for realtime data cards)
let setIntervalAsync = SetIntervalAsync.dynamic.setIntervalAsync
// // // let setIntervalAsync = SetIntervalAsync.fixed.setIntervalAsync
// // // let setIntervalAsync = SetIntervalAsync.legacy.setIntervalAsync
let clearIntervalAsync = SetIntervalAsync.clearIntervalAsync

//   d3.formatLocale(locale);

//
Promise.all([
  d3.csv('/data/Economy/processed/unemployment_quarterly_dublin.csv'),
  d3.csv('/data/Housing/HPM06.csv'), // property price
  d3.csv('/data/Housing/processed/NDQ05.csv') // quarterly housing completions

]).then(dataFiles => {
  /***

    Unemployment card

  ***/
  const unemploymentData = dataFiles[2]
  const unemploymentColumnNames = unemploymentData.columns.slice(2)
  const unemploymentColumnName = unemploymentColumnNames[0]
  const unemploymentDataSet = coerceData(unemploymentData, unemploymentColumnNames)
  // console.log(unemploymentDataSet)
  // const dublinData = unemploymentDataSet.filter(d => {
  //   return !isNaN(d[unemploymentColumnName])
  // })
  unemploymentDataSet.forEach(d => {
    d.quarter = convertQuarter(d.quarter)
    d.label = formatQuarter(d.quarter)
    d[unemploymentColumnName] = parseFloat(d[unemploymentColumnName]) * 1000
  })
  // configuration object
  const unemploymentConfig = {
    d: unemploymentDataSet,
    e: '#test-glance',
    yV: unemploymentColumnName,
    xV: 'quarter',
    // sN: 'region',
    // fV: d3.format('.2s'),
    dL: 'label'
  }
  const unemployCard = new CardLineChart(unemploymentConfig)
  /***

    Property Price card

  ***/
  const propertyPriceData = dataFiles[1]
  const propertyPriceColumnNames = propertyPriceData.columns.slice(2)
  const propertyPriceColumnName = propertyPriceData.columns[2]
  let propertyPriceDataSet = coerceData(propertyPriceData, propertyPriceColumnNames)
  propertyPriceDataSet.forEach(d => {
    d.date = parseMonth(d.date)
    d.label = formatMonth(d.date)
  })
  propertyPriceDataSet = propertyPriceDataSet.filter(d => {
    // return d.region === "Dublin";
    return d.region === 'Dublin' && !isNaN(d.all)
  })

  const propertyPriceCardConfig = {
    d: propertyPriceDataSet,
    e: '#ap-glance',
    yV: propertyPriceColumnName,
    xV: 'date',
    // sN: 'region',
    dL: 'label'
  }
  const propertyPriceCard = new CardLineChart(propertyPriceCardConfig)

  const completionsData = dataFiles[2]
  const completionsColumnNames = completionsData.columns.slice(5)
  const completionsColumnName = completionsColumnNames[0]
  const completionsDataSet = coerceData(completionsData, completionsColumnNames)
  // console.log(completionsDataSet)

  // completionsDataSet.forEach(d => {
  //   d.quarter = convertQuarter(d.quarter)
  //   d.label = formatQuarter(d.quarter)
  // })
  //
  // const completionsConfig = {
  //   d: completionsDataSet,
  //   e: '#hc-glance',
  //   yV: 'Dublin',
  //   xV: 'quarter',
  //   // sN: 'region',
  //   dL: 'label'
  // }
  // const completionsCard = new CardLineChart(completionsConfig)

  // initInfoText()
  // updateInfoText('#apd-chart a', 'The <b>Population</b> of Dublin in ', ' on <b>2011</b>', populationDataSet, populationColumnName, 'date', d3.format('.2s'))
  //
  // updateInfoText('#emp-chart a', '<b>Unemployment</b> in Dublin for ', ' on the previous quarter', unemploymentDataSet, unemploymentColumnName, 'label', d3.format(''), true)
  //
  // updateInfoText('#app-chart a', 'The <b>Property Price Index</b> for Dublin in ', ' on the previous month', propertyPriceDataSet, propertyPriceColumnName, 'label', d3.format(''))
  //
  // updateInfoText('#huc-chart a', '<b>House Unit Completions</b> in Dublin for  ', ' on the previous quarter', completionsDataSet, completionsColumnName, 'label', d3.format(''))

  d3.select(window).on('resize', function () {
    // completionsCard.init()
    unemployCard.init()
    populationCard.init()
    propertyPriceCard.init()

    const screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (screenSize >= 768) {
      renderMap(dublincoco)
    } else {
      renderTabs(dublincoco)
    }
    laElement.dispatchEvent(clickEvent)
  })
}).catch(function (error) {
  console.log(error)
})

function initInfoText () {
  // d3.select('#data-text').attr("hidden", true); //to hide
  let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (IS_TOUCH_DEVICE && screenWidth < 1200) {
    //   console.log("Hide data text on mobile");
    d3.select('#data-text').html('<p><b>Swipe for more, touch to go to the full chart page </b></p>')
    d3.selectAll('.tab-charts__row').style('overflow-x', 'scroll')
    d3.selectAll('.tab-charts__row').style('-webkit-overflow-scrolling', 'touch')
  } else if (IS_TOUCH_DEVICE && screenWidth >= 1200) {
    //   console.log("Hide data text on mobile");
    d3.select('#data-text').html('<p><b>Click a mini-chart to go to an associated full chart </b></p>')
    d3.select('.tab-charts__row').style('overflow-x', 'hidden')
  } else {
    d3.select('#data-text').html('<p><b>Hover over these charts for more information, click to go to the full chart </b></p>')
    // d3.selectAll('.tab-charts__row').style("-webkit-overflow-scrolling", "touch");
    d3.select('.tab-charts__row').style('overflow-x', 'hidden')
  }
}

function updateInfoText (selector, startText, endText, data, valueName, labelName, format, changeArrrow) {
  const lastData = data[data.length - 1]
  const previousData = data[data.length - 2]
  const currentValue = lastData[valueName]
  const prevValue = previousData[valueName]
  const difference = ((currentValue - prevValue) / currentValue)
  const lastElementDate = lastData[labelName]

  // console.log('lastData: ')
  // console.log(lastData)

  const green = '#20c997'
  const red = '#da1e4d'
  const text = d3.select('#data-text p')
  let defaultString
  // defaultString = text.text(),
  if (IS_TOUCH_DEVICE) {
    defaultString = '<b>Slide for more, touch to go to the full chart page </b>'
  } else {
    defaultString = '<b>Hover over these charts for more information, click to go to the data page </b>'
  }

  cArrow = changeArrrow,
    indicatorSymbol = difference > 0 ? '▲ ' : difference < 0 ? '▼ ' : ' ',
    indicator = difference > 0 ? 'Up' : difference < 0 ? 'Down' : ' a change of ',
    indicatorColour = cArrow ? difference > 0 ? red : green : difference > 0 ? green : red
  // const startString = startText
  // const endString = endText

  d3.select(selector)
    .on('mouseover', (d) => {
      text.html(startText).attr('class', 'bold-text')
      text.append('span').text(lastElementDate).attr('class', 'bold-text')

      text.append('text').text(' was ')

      text.append('span').text(format(currentValue))
        .attr('class', 'bold-text')

      text.append('text').text(". That's ")

      text.append('span').text(indicatorSymbol).attr('class', 'bold-text').style('color', indicatorColour)
      text.append('span').text(indicator + ' ' + d3.format('.2%')(difference)).attr('class', 'bold-text')

      text.append('text').html(' ' + endText)
    })
    .on('mouseout', (d) => {
      text.html(defaultString)
    })
}
