// /***

//   Dublin Bikes card

// ***/
'use strict'

import { fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'

async function main (options) {
  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  //   const refreshInterval = 100
  //   let refreshCountdown = refreshInterval

  const updateCountdown = function () {
    // const cd = refreshCountdown / 1000
    // d3.select('#bikes-bikesCountdown').text('Update in ' + cd)
    // console.log('Countdown: ' + cd)
    // if (refreshCountdown > 0) refreshCountdown -= refreshInterval / 2
  }

  //   let refreshTimer = setInterval(updateCountdown, refreshInterval)
  const RETRY_INTERVAL = 30000 // time to try to fetch again after error
  const REFRESH_INTERVAL = 15000 // time to try to fetch again after previous success
  const REQ_TIMEOUT_INTERVAL = 10000 // time after which TO error generated
  let refreshTimeout
  let prevBikesAgeMins
  let prevBikesAvailable
  let prevStandsAvailable
  const indicatorUpSymbol = "<span class='up-arrow'>&#x25B2;</span>"
  const indicatorDownSymbol = "<span class='down-arrow'>&#x25BC;</span>"
  const indicatorRightSymbol = "<span class='right-arrow'>&#x25BA;</span>"
  let prevBikesAvailableDirection = indicatorRightSymbol // '▶'
  let prevStandsAvailableDirection = indicatorRightSymbol // '▶'
  let prevBikesTrendString = ''// '(no change)'
  let prevStandsTrendString = '' // '(no change)'

  async function fetchData () {
    // console.log('fetch data')
    let data
    clearTimeout(refreshTimeout)
    try {
      console.log('fetching data')
      data = await fetchJsonFromUrlAsyncTimeout(options.displayoptions.data.href, REQ_TIMEOUT_INTERVAL)
      if (data) {
        console.log(data)
        // The derilinx API sometimes returns an empty JSON array- need to check for that
        if (data.length > 0) {
          const cardData = getCardData(data)
          updateBikesDisplay(cardData.availableBikes, cardData.availableStands, cardData.dataAgeMinutes)
        //   clearInterval(bikesTimer)
        } else {
        //   initialiseCardDisplay()
        //   // updateInfo('#bikes-card a', '<b>Dublin Bikes</b> did not respond to our request for data- we will try again soon')
        //   // restart the timer
        //   clearInterval(bikesTimer)
        //   bikesCountdown = bikesInterval
        //   bikesTimer = setInterval(updateBikesCountdown, 1000)
        }
        // const corkData = json.aqihsummary.filter((d) => {
        //   if (d['aqih-region'] === 'Dublin_City') {
        //     return d
        //   }
        // })

        // const lastReadTime = json.generatedAt.split(' ')[1] ? json.generatedAt.split(' ')[1] : ''

        // const cardElement = document.getElementById('air-quality-card')
        // const subtitleElement = cardElement.querySelector('#subtitle')
        // subtitleElement.innerHTML = 'Latest reading ' + lastReadTime

        // const leftElement = cardElement.querySelector('#card-left')
        // leftElement.innerHTML = '<h1>' + corkData[0].aqih.split(',')[1] + '</h1>' +
        //             '<h2>Quality</h2>'

        // const rightElement = cardElement.querySelector('#card-right')
        // rightElement.innerHTML =
        //             '<h1>' + corkData[0].aqih.split(',')[0] + '</h1>' +
        //             '<h2>Index</h2>'

        // const infoElement = cardElement.querySelector('.card__info-text')
        // infoElement.innerHTML = 'The latest air quality reading in Dublin city was taken at <b>' + lastReadTime + '</b>  and indicated a <b>QUALITY INDEX of ' + corkData[0].aqih.split(',')[0] + '</b> in the <b>' + corkData[0].aqih.split(',')[1].toUpperCase() + '</b> quality band'

        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      } else data = null // nullify for GC (necessary?)
    } catch (e) {
      data = null // nullify for GC (necessary?)
      console.log('data fetch error' + e)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)

      //   console.error('Data fetch error: ' + JSON.stringify(error))
      //     // // initialiseDisplay()
      //     // // updateInfo('#bikes-card a', 'Source did not respond with data- we will try again soon')
      // // restart the timer
      //   clearInterval(refreshTimer)
      //   refreshCountdown = refreshInterval
      //   refreshTimer = setInterval(updateCountdown, refreshInterval)
    }
    //     //   //       // const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

    //     //   //       // d3.select('#population-card__chart')
    //     //   //       //   .select('#card-info-text')
    //     //   //       //   .html('<p>' + info + '</p>')
    //     //   //     })
    // }
  }
  fetchData()

  function updateBikesDisplay (ab, as, age) {
    // console.log("age: " + age);
    const animateClass = age < prevBikesAgeMins ? 'animate-update' : ''

    const bikesAvailableDirection = ab > prevBikesAvailable ? indicatorUpSymbol : ab < prevBikesAvailable ? indicatorDownSymbol : prevBikesAvailableDirection

    const bikesTrendDelta = Math.abs(prevBikesAvailable - ab)
    const bikesTrendString = ab > prevBikesAvailable ? `(${indicatorUpSymbol} Up ${bikesTrendDelta})` : ab < prevBikesAvailable ? `(${indicatorDownSymbol} Down ${bikesTrendDelta})` : prevBikesTrendString

    const standsAvailableDirection = as > prevStandsAvailable ? indicatorUpSymbol : as < prevStandsAvailable ? indicatorDownSymbol : prevStandsAvailableDirection

    const standsTrendDelta = Math.abs(prevStandsAvailable - as)
    const standsTrendString = as > prevStandsAvailable ? `(${indicatorUpSymbol} Up ${standsTrendDelta})` : as < prevStandsAvailable ? `(${indicatorDownSymbol} Down ${standsTrendDelta})` : prevStandsTrendString

    if (prevBikesAvailable !== ab) {
      prevBikesAvailable = ab
      prevBikesAvailableDirection = bikesAvailableDirection
      prevBikesTrendString = bikesTrendString
    }
    if (prevStandsAvailable !== as) {
      prevStandsAvailable = as
      prevStandsAvailableDirection = standsAvailableDirection
      prevStandsTrendString = standsTrendString
    }
    prevBikesAgeMins = age
    const bikesAgeDisplay = age === 0 ? 'Just now' : age > 1 ? age + ' mins ago' : '1 min ago'
    const cardElement = document.getElementById('dublin-bikes-card')
    const subtitleElement = cardElement.querySelector('#subtitle')
    subtitleElement.innerHTML = '' + bikesAgeDisplay

    // d3.select('#bikes-card').select('#bikes-bikesCountdown').html("<span class='" + animateClass + "'>" + bikesAgeDisplay + '</span>')

    // d3.select('#rt-bikes').select('#card-left')
    //   .html("<div class = '" + animateClass + "'align='center'>" +
    //     '<h1>' + bikesAvailableDirection + ' ' + ab + '</h1>' +
    //     '</div>' +
    //     "<div align='center'>" +
    //     '<p> bikes </p>' +
    //     '</div>')

    // d3.select('#rt-bikes').select('#card-right')
    //   .html("<div class = '" + animateClass + "'align='center'>" +
    //     '<h1>' + standsAvailableDirection + ' ' + as + '</h1>' +
    //     '</div>' +
    //     "<div align='center'>" +
    //     '<p> stands </p>' +
    //     '</div>')

    // d3.select('#bikes-card').select('#card-info-text').html(`<p>Dublin Bikes currently has ${ab} bikes ${bikesTrendString} and ${as} stands  ${standsTrendString} available across the city</p>`)
  }
}

function getCardData (data_) {
  let availableBikes = 0
  let availableStands = 0
  let latestUpdate = 0
  // console.log("Bike data \n");
  data_.forEach(d => {
    if (d.available_bikes) {
      availableBikes += d.available_bikes
    }
    if (d.available_bike_stands) {
      availableStands += d.available_bike_stands
    }
    // TODO: old school, use d3.max instead?
    if (d.last_update) {
      const lup = moment(d.last_update)
      if (lup > latestUpdate) {
        latestUpdate = lup
      }
    }
  })
  const now = moment(new Date())
  const bikesAgeMins = Math.floor(((now - latestUpdate) / 1000) / 60)
  // console.log("bikes age: " + bikesAgeMins)

  const cardData = { availableBikes: availableBikes, availableStands: availableStands, dataAgeMinutes: bikesAgeMins }
  console.log(cardData)
  return cardData
}

function initialiseCardDisplay () {
  // let bikeTimeShort = d3.timeFormat("%a, %H:%M");

  d3.select('#bikes-card').select('.card__header').select('.card__sub-title').html("<div id ='bikes-bikesCountdown' > </div>")

  d3.select('#rt-bikes').select('#card-center').html("<img src = '/images/transport/bicycle-w-15.svg'>")

  d3.select('#rt-bikes').select('#card-left')
    .html('<h3>--</h3>' +
        '<p>bikes</p>')

  d3.select('#rt-bikes').select('#card-right')
    .html(
      '<h3>--</h3>' +
        '<p> stands </p>')
}
export { main }
