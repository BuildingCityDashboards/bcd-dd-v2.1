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

// d3.select(window).on('resize', function () {
//   const screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
//   if (screenSize >= 768) {
//     renderMap(dublincoco)
//   } else {
//     renderTabs(dublincoco)
//   }
//   laElement.dispatchEvent(clickEvent)
// })

// function initInfoText () {
//   // d3.select('#data-text').attr("hidden", true); //to hide
//   let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
//   if (IS_TOUCH_DEVICE && screenWidth < 1200) {
//     //   console.log("Hide data text on mobile");
//     d3.select('#data-text').html('<p><b>Swipe for more, touch to go to the full chart page </b></p>')
//     d3.selectAll('.tab-charts__row').style('overflow-x', 'scroll')
//     d3.selectAll('.tab-charts__row').style('-webkit-overflow-scrolling', 'touch')
//   } else if (IS_TOUCH_DEVICE && screenWidth >= 1200) {
//     //   console.log("Hide data text on mobile");
//     d3.select('#data-text').html('<p><b>Click a mini-chart to go to an associated full chart </b></p>')
//     d3.select('.tab-charts__row').style('overflow-x', 'hidden')
//   } else {
//     d3.select('#data-text').html('<p><b>Hover over these charts for more information, click to go to the full chart </b></p>')
//     // d3.selectAll('.tab-charts__row').style("-webkit-overflow-scrolling", "touch");
//     d3.select('.tab-charts__row').style('overflow-x', 'hidden')
//   }
// }

function getInfoText (selector, startText, endText, data, valueName, labelName, format, changeArrrow) {
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
  // if (IS_TOUCH_DEVICE) {
  //   defaultString = '<b>Slide for more, touch to go to the full chart page </b>'
  // } else {
  //   defaultString = '<b>Hover over these charts for more information, click to go to the data page </b>'
  // }

  cArrow = changeArrrow,
    indicatorSymbol = difference > 0 ? '▲ ' : difference < 0 ? '▼ ' : ' ',
    indicator = difference > 0 ? 'Up' : difference < 0 ? 'Down' : ' a change of ',
    indicatorColour = cArrow ? difference > 0 ? red : green : difference > 0 ? green : red
  // const startString = startText
  // const endString = endText

  // d3.select(selector)
  //   .on('mouseover', (d) => {
  //     text.html(startText).attr('class', 'bold-text')
  //     text.append('span').text(lastElementDate).attr('class', 'bold-text')
  //
  //     text.append('text').text(' was ')
  //
  //     text.append('span').text(format(currentValue))
  //       .attr('class', 'bold-text')
  //
  //     text.append('text').text(". That's ")
  //
  //     text.append('span').text(indicatorSymbol).attr('class', 'bold-text').style('color', indicatorColour)
  //     text.append('span').text(indicator + ' ' + d3.format('.2%')(difference)).attr('class', 'bold-text')
  //
  //     text.append('text').html(' ' + endText)
  //   })
  //   .on('mouseout', (d) => {
  //     text.html(defaultString)
  //   })
  let string = startText + lastElementDate + ' was ' + format(currentValue) + ". That's " + indicatorSymbol + indicator + ' ' + d3.format('.2%')(difference) + endText

  return string
}
