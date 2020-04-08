// let weatherInterval = 1000 * 30
// let weatherCountdown = weatherInterval
const fetchWeatherDataLatest = function () {
  d3.xml('/api/weather/latest')
    .then((data) => {
      console.log('Fetched Weather card data - latest observations')
      // console.log(data)
      processWeather(data)
    })
    .catch(function (err) {
      console.error('Error fetching Weather card data: ' + JSON.stringify(err))
      // initialiseWeatherDisplay()
    })
}

fetchWeatherDataLatest()

// // Timed refresh of map station markers symbology using data snapshot
// const weatherCardTimer = setIntervalAsync(
//   () => {
//     return fetchWeatherData()
//   },
//   weatherInterval
// )

function processWeather (xmlWeather) {
  let observations = xmlWeather.getElementsByTagName('observations')
  let observationsTime = observations[0].getAttribute('time')
  console.log('weather for: ' + JSON.stringify(observationsTime))
  // let arr = observations[0].getElementsByTagName('station').namedItem('Dublin')
  let stations = observations[0].getElementsByTagName('station')
  for (s of stations) {
    if (s.getAttribute('name') === 'Dublin') {
      d3.select('#hero-weather__left-top')
          .html(getStringForAttribute(s, 'temp'))
      // //
      d3.select('#hero-weather__left-bottom')
            .html('Prec ' + getStringForAttribute(s, 'rainfall'))

      d3.select('#hero-weather__right-top')
            .html('<img src = "/images/Met50v2/15d.png">' + '  ' + getStringForAttribute(s, 'wind_direction'))

      d3.select('#hero-weather__right-bottom')
            .html(getStringForAttribute(s, 'wind_speed'))

      getSymbolID(getStringForAttribute(s, 'weather_text'), observationsTime)
      // d3.select('#hero-weather__symbol')
      //       .html('<img src = "/images/Met50v2/' + getSymbolID(weather_text, observationsTime) + '.png">')

      // console.log()
      // console.log(getStringForAttribute(s, 'humidity'))
      // console.log(getStringForAttribute(s, 'pressure'))
    }
  }

  //
  // updateWeatherDisplay(forecasts, forecastTime)
}

function getStringForAttribute (e, n) {
  e = e.getElementsByTagName(n)[0]
  let u = ''
  if (e.hasAttribute('unit')) {
    u = ' ' + e.getAttribute('unit')
  }
  let v = e.innerHTML.trim()
  return v + u
}

async function getSymbolID (text, time) {
  let symbol = await isDayOrNight(time)

 //  if (time.getHours() > 18 || startDate.getHours() < 6) {
 // //     tod = 'n'
 // //   } else {
 // //     tod = 'd'
 // //   }
  return ''
}

async function isDayOrNight (t) {
  let d = new Date(t)
  console.log(d.getHours())
  console.log(d.getMonth())
  let data = await d3.csv('/data/Environment/weather/ireland-sunrise-sunset-by-month.csv')
  console.log(data)
  let sunriseHour = parseInt(data[d.getMonth()]['sunrise'])
  let sunsetHour = parseInt(data[d.getMonth()]['sunset'])
  console.log(sunriseHour)
  if (d.getHours() < sunriseHour) {
    console.log('before sr')
  } else if (d.getHours() >= sunriseHour && d.getHours() <= sunsetHour) {
    console.log('after sr')
  } else {
    console.log('after ss')
  }
}

//   // decide if night or day based on hour
  //   // /*TODO: Crude! Improve!*/
  //   if (startDate.getHours() > 18 || startDate.getHours() < 6) {
  //     tod = 'n'
  //   } else {
  //     tod = 'd'
  //   }
  //   precip = locationOdd.getElementsByTagName('precipitation')[0].getAttribute('value')
  //   // console.log("precip #" + precip);
  //   //
  //   // Only use the next 48 hourly readings
  //   /* TODO: Better algo to decide if readings are to be used/ are valid */

function initialiseWeatherDisplay () {
  d3.select('#hero-weather__left-top')
    .html('-- C')

  d3.select('#hero-weather__left-bottom')
      .html('Prec -- mm')

  d3.select('#hero-weather__right-top')
      .html('~ --')

  d3.select('#hero-weather__right-bottom')
      .html('~ -- kts')

  d3.select('#hero-weather__symbol')
    .html()
}

function updateWeatherDisplay (f, fTime) {
  let fTimeDisplay
  if (fTime.includes('minutes')) {
    fTimeDisplay = fTime.replace(' minutes', 'm')
  } else if (fTime.includes('minute')) {
    fTimeDisplay = fTime.replace(' minute', 'm')
  } else if (fTime.includes('hours')) {
    fTimeDisplay = fTime.replace(' hours', 'h')
  } else if (fTime.includes('hour')) {
    fTimeDisplay = fTime.replace('an hour', '1h')
  } else {
    fTimeDisplay = fTimeDisplay = 'earlier'
  }

  let weatherTime = d3.timeFormat('%_I%p')
  // d3.select('#weather-card').select('.card__header')
  //   .html(
  //     "<div class = 'row'>" +
  //     "<div class = 'col-8 pr-0' align='left'>" +
  //     'Weather Forecast for ' + weatherTime(f[0].date) +
  //     '</div>' +
  //     "<div class = 'col-4 pl-0' align='right'>" +
  //     fTimeDisplay +
  //     // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
  //     '</div>' +
  //     '</div>'
  //   )
  d3.select('#hero-weather__left-top')
      .html(parseInt(f[0].temperature) + ' C')
  // //
  d3.select('#hero-weather__left-bottom')
        .html('Prec ' + f[0].precip + ' mm')

  d3.select('#hero-weather__right-top')
        .html('<img src = "/images/Met50v2/15d.png">' + '  ' + f[0].windDir)

  d3.select('#hero-weather__right-bottom')
        .html(parseInt(f[0].windSpeed) * 3.6 + ' kph')

  d3.select('#hero-weather__symbol')
      .html('<img src = "/images/Met50v2/' + f[0].symbolNo + f[0].tod + '.png">')

  // updateInfo('#weather-card a', '<b>Met Eireann Weather Forecast</b> for <b>' +
  //   weatherTime(f[0].date) +
  //   '</b>; <b>' + parseInt(f[0].temperature) + '&#176C</b>, <b>' +
  //   f[0].symbolId.toString().toLowerCase() + '</b> with <b>' +
  //   f[0].windDir + ' winds</b> of <b>' + parseInt(f[0].windSpeed) * 3.6 + ' kph</b>. ' +
  //   '<b>Humidity ' +
  //   parseInt(f[0].humidity) + '%</b> & <b>precipitation ' +
    // f[0].precip + ' mm</b>')
}

// function updateInfo (selector, infoText) {
//   let text = d3.select('#data-text p')
//   let textString = '<b>Hover over these charts for more information, click to go to the data page </b>'
//
//   d3.select(selector)
//     .on('mouseover', (d) => {
//       // console.log(textString);
//       text.html(infoText)
//     })
//     .on('mouseout', (d) => {
//       text.html(textString)
//     })
// }

// setInterval(function () {
//   weatherCountdown -= 1000
//   let cd = weatherCountdown / 1000
//   d3.select('#weather-countdown').text('Update in ' + cd)
//
//   if (weatherCountdown < 1000) {
//     weatherCountdown = weatherInterval
//   }
// }, 1000)

// initialiseWeatherDisplay()
// fetchWeatherData()
