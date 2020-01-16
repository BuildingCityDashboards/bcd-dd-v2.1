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

const parseTime = d3.timeParse('%d/%m/%Y')
const parseYear = d3.timeParse('%Y')
const formatYear = d3.timeFormat('%Y')
const parseMonth = d3.timeParse('%Y-%b')
const formatMonth = d3.timeFormat('%b-%y')
const breakPoint = 768

let locale = d3.formatLocale({
  'decimal': '.',
  'thousands': ',',
  'grouping': [3],
  'currency': ['€', ''],
  'dateTime': '%a %b %e %X %Y',
  'date': '%m/%d/%Y',
  'time': '%H:%M:%S',
  'periods': ['AM', 'PM'],
  'days': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  'shortDays': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  'shortMonths': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})

//   d3.formatLocale(locale);

function coerceData (data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      d[columns[i]] = +d[columns[i]]
    }
    return d
  })
  return coercedData
}

Promise.all([
  d3.csv('/data/Demographics/population.csv'),
  d3.csv('/data/Economy/processed/unemployment_quarterly_dublin.csv'),
  d3.csv('data/Housing/HPM06.csv'), // property price
  d3.csv('/data/Housing/processed/NDQ05.csv') // quarterly housing completions

]).then(dataFiles => {
  /***

  Population card

  ***/
  const populationData = dataFiles[0]
  const populationColumnNames = populationData.columns.slice(2)
  const populationColumnName = populationColumnNames[0]
  // console.log(populationColumnName)
  const populationDataSet = coerceData(populationData, populationColumnNames)

  const populationConfig = {
    d: populationDataSet,
    e: '#pr-glance',
    yV: populationColumnName,
    xV: 'date',
    // sN: 'region',
    fV: d3.format('.2s'),
    dL: 'date'
  }

  const popCardChart = new CardLineChart(populationConfig)

  /***

    Unemployment card

  ***/
  const unemploymentData = dataFiles[1]
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
  const propertyPriceData = dataFiles[2]
  const propertyPriceColumnNames = propertyPriceData.columns.slice(2)
  const propertyPriceColumnName = propertyPriceData.columns[0]
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
    yV: 'all',
    xV: 'date',
    // sN: 'region',
    dL: 'label'
  }
  const propertyPriceCard = new CardLineChart(propertyPriceCardConfig)

  // const propertyPriceDataQuartley = new CardBarChart(date4Filtered, propertyPriceColumnNames, propertyPriceColumnName, "#ap-glance", "€", "title2");

  const completionsData = dataFiles[3]
  const completionsColumnNames = completionsData.columns.slice(5)
  const housingCompletionsX = completionsData.columns[0] // quarters
  const completionsColumnName = completionsColumnNames[0]
  const completionsDataSet = coerceData(completionsData, completionsColumnNames)
  // console.log(completionsDataSet)

  completionsDataSet.forEach(d => {
    d.quarter = convertQuarter(d.quarter)
    d.label = formatQuarter(d.quarter)
  })

  const completionsConfig = {
    d: completionsDataSet,
    e: '#hc-glance',
    yV: 'Dublin',
    xV: 'quarter',
    // sN: 'region',
    dL: 'label'
  }
  const completionsConfigCard = new CardLineChart(completionsConfig)

  // const dateFiltered = dataSet.filter(d => {
  //   return d.quarter >= new Date('Tue Jan 01 2013 00:00:00') && d.quarter <= new Date('Tue Feb 01 2017 00:00:00')
  // })

  // console.log(dublinData)

  // const houseCompMonthly = new CardBarChart(completionsDataSet, completionsColumnNames, housingCompletionsX, '#hc-glance', 'Units', 'title2')

  initInfoText()
  updateInfoText('#apd-chart a', 'The <b>Total Population</b> of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

  updateInfoText('#emp-chart a', '<b>Total Unemployment</b> in Dublin for ', ' on previous quarter', unemploymentDataSet, unemploymentColumnName, 'label', d3.format('.2s'), true)

  updateInfoText('#app-chart a', 'The <b>Property Price Index</b> for Dublin on ', ' on previous quarter', propertyPriceDataSet, propertyPriceColumnName, 'label', locale.format(''))

  updateInfoText('#huc-chart a', '<b>Monthly House Unit Completions</b> in Dublin ', ' on previous month', completionsDataSet, completionsColumnName, 'date', d3.format(''))

  d3.select(window).on('resize', function () {
    houseCompMonthly.init()
    unemployCard.init()
    popCardChart.init()
    propertyPriceCard.init()

    let screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
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

function convertQuarter (q) {
  let splitted = q.split('Q')
  let year = splitted[0]
  let quarterEndMonth = splitted[1] * 3 - 2
  let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)

  return date
}

function formatQuarter (date) {
  let newDate = new Date()
  newDate.setMonth(date.getMonth() + 1)
  let year = (date.getFullYear())
  let q = Math.ceil((newDate.getMonth()) / 3)
  return year + ' Q' + q
}

function updateInfoText (selector, startText, endText, data, valueName, labelName, format, changeArrrow) {
  let lastData = data[data.length - 1],
    previousData = data[data.length - 2],
    currentValue = lastData[valueName],
    prevValue = previousData[valueName],
    difference = ((currentValue - prevValue) / currentValue),
    lastElementDate = lastData[labelName]

  let green = '#20c997',
    red = '#da1e4d',
    text = d3.select('#data-text p'),
    defaultString
  // defaultString = text.text(),
  if (IS_TOUCH_DEVICE) {
    defaultString = '<b>Slide for more, touch to go to the full chart page </b>'
  } else {
    defaultString = '<b>Hover over these charts for more information, click to go to the data page </b>'
  }

  cArrow = changeArrrow,
    indicatorSymbol = difference > 0 ? '▲ ' : difference < 0 ? '▼ ' : ' ',
    indicator = difference > 0 ? 'Up' : difference < 0 ? 'Down' : ' a change of ',
    indicatorColour = cArrow ? difference > 0 ? red : green : difference > 0 ? green : red,
    startString = startText,
    endString = endText

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

      text.append('text').text(' ' + endString)
    })
    .on('mouseout', (d) => {
      text.html(defaultString)
    })

  // d3.select(selector).on("blur", (d) => {
  //   text.html(defaultString);
  // });

  // d3.select(selector).on("click", (d) => {
  //   text.html(defaultString);
  // });

  // d3.select(selector).on("focus", (d) => {
  //
  //   console.log("Focus");
  //   text.text(startString);
  //   text.append("span").text(lastElementDate).attr("class", "bold-text");
  //
  //   text.append("text").text(" was ");
  //
  //   text.append("span").text(format(currentValue))
  //     .attr("class", "bold-text");
  //
  //   text.append("text").text(". That's ");
  //
  //   text.append("span").text(indicator + " " + d3.format(".2%")(difference)).attr("class", "bold-text").style("color", indicatorColour);
  //
  //   text.append("text").text(" " + endString);
  // });
}

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
