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
  const RETRY_INTERVAL = 5000 // time to try to fetch again after error
  const REFRESH_INTERVAL = 5000 // time to try to fetch again after previous success
  const REQ_TIMEOUT_INTERVAL = 10000 // time after which TO error generated
  let refreshTimeout
  let prevBikesAgeMins
  let prevBikesAvailable
  let prevStandsAvailable
  const indicatorUpSymbol = "<span class='up-arrow'>&#x25B2;</span>"
  const indicatorDownSymbol = "<span class='down-arrow'>&#x25BC;</span>"
  const indicatorNoChangeSymbol = '<span></span>'
  let prevBikesAvailableDirection = indicatorNoChangeSymbol // '▶'
  let prevStandsAvailableDirection = indicatorNoChangeSymbol // '▶'
  let prevBikesTrendString = ''// '(no change)'
  let prevStandsTrendString = '' // '(no change)'

  async function fetchData () {
    console.log('fetch data')
    clearTimeout(refreshTimeout)
    let data
    try {
      data = await fetchJsonFromUrlAsyncTimeout(options.displayoptions.data.href, REQ_TIMEOUT_INTERVAL)
      if (data) {
        // The derilinx API sometimes returns an empty JSON array- need to check for that
        if (data.length > 0) {
          const cardData = getCardData(data)
          updateBikesDisplay(cardData.availableBikes, cardData.availableStands, cardData.dataAgeMinutes)
          clearTimeout(refreshTimeout)
          refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
        //   clearInterval(bikesTimer)
        } else {
          initialiseCardDisplay()
          clearTimeout(refreshTimeout)
          refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
        }
      } else data = null // nullify for GC (necessary?)
    } catch (e) {
      data = null // nullify for GC (necessary?)
      console.log('data fetch error' + e)
      initialiseCardDisplay()
      clearTimeout(refreshTimeout)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
    }
  }
  fetchData() // trigger initial fetch

  function updateBikesDisplay (currBikesAvailable, currStandsAvailable, dataAge) {
    const bikesAvailableDirection = currBikesAvailable > prevBikesAvailable ? indicatorUpSymbol : currBikesAvailable < prevBikesAvailable ? indicatorDownSymbol : prevBikesAvailableDirection

    const bikesTrendDelta = Math.abs(prevBikesAvailable - currBikesAvailable)
    const bikesTrendString = currBikesAvailable > prevBikesAvailable ? `(${indicatorUpSymbol} Up ${bikesTrendDelta})` : currBikesAvailable < prevBikesAvailable ? `(${indicatorDownSymbol} Down ${bikesTrendDelta})` : prevBikesTrendString

    const standsAvailableDirection = currStandsAvailable > prevStandsAvailable ? indicatorUpSymbol : currStandsAvailable < prevStandsAvailable ? indicatorDownSymbol : prevStandsAvailableDirection

    const standsTrendDelta = Math.abs(prevStandsAvailable - currStandsAvailable)
    const standsTrendString = currStandsAvailable > prevStandsAvailable ? `(${indicatorUpSymbol} Up ${standsTrendDelta})` : currStandsAvailable < prevStandsAvailable ? `(${indicatorDownSymbol} Down ${standsTrendDelta})` : prevStandsTrendString

    if (prevBikesAvailable !== currBikesAvailable) {
      prevBikesAvailable = currBikesAvailable
      prevBikesAvailableDirection = bikesAvailableDirection
      prevBikesTrendString = bikesTrendString
    }
    if (prevStandsAvailable !== currStandsAvailable) {
      prevStandsAvailable = currStandsAvailable
      prevStandsAvailableDirection = standsAvailableDirection
      prevStandsTrendString = standsTrendString
    }

    const animateClass = dataAge < prevBikesAgeMins ? 'animate-update' : 'no-animate'
    prevBikesAgeMins = dataAge
    const bikesAgeDisplay = dataAge === 0 ? 'Just now' : dataAge > 1 ? dataAge + ' mins ago' : '1 min ago'

    const cardElement = document.getElementById('dublin-bikes-card')
    const subtitleElement = cardElement.querySelector('#subtitle')
    subtitleElement.classList.remove('animate-update')
    subtitleElement.classList.remove('no-animate')
    subtitleElement.classList.add(animateClass)
    subtitleElement.innerHTML = '' + bikesAgeDisplay

    const leftElement = cardElement.querySelector('#card-left')
    leftElement.classList.remove('animate-update')
    leftElement.classList.remove('no-animate')
    leftElement.classList.add(animateClass)
    leftElement.innerHTML = '<h1>' + bikesAvailableDirection + ' ' + currBikesAvailable + '</h1>' +
          '<h2>Bikes Available</h2>'

    const rightElement = cardElement.querySelector('#card-right')
    rightElement.classList.remove('animate-update')
    rightElement.classList.remove('no-animate')
    rightElement.classList.add(animateClass)
    rightElement.innerHTML =
          '<h1>' + standsAvailableDirection + ' ' + currStandsAvailable + '</h1>' +
          '<h2>Stands Available</h2>'

    const infoElement = cardElement.querySelector('.card__info-text')
    infoElement.innerHTML = `Dublin Bikes currently has ${currBikesAvailable} bikes ${bikesTrendString} and ${currStandsAvailable} stands  ${standsTrendString} available across the city`
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
  // console.log("bikes dataAge: " + bikesAgeMins)

  const cardData = { availableBikes: availableBikes, availableStands: availableStands, dataAgeMinutes: bikesAgeMins }
  console.log(cardData)
  return cardData
}

function initialiseCardDisplay () {
  // let bikeTimeShort = d3.timeFormat("%a, %H:%M");

  // d3.select('#bikes-card').select('.card__header').select('.card__sub-title').html("<div id ='bikes-bikesCountdown' > </div>")

  const cardElement = document.getElementById('dublin-bikes-card')
  const subtitleElement = cardElement.querySelector('#subtitle')
  subtitleElement.classList.remove('animate-update')
  subtitleElement.classList.remove('no-animate')
  subtitleElement.innerHTML = 'Fetching Data...'

  const leftElement = cardElement.querySelector('#card-left')
  leftElement.classList.remove('animate-update')
  leftElement.classList.remove('no-animate')
  leftElement.innerHTML = '<h1></h1>' +
          '<h2>Bikes Available</h2>'

  const rightElement = cardElement.querySelector('#card-right')
  rightElement.classList.remove('animate-update')
  rightElement.classList.remove('no-animate')
  rightElement.innerHTML =
          '<h1></h1>' +
          '<h2>Stands Available</h2>'

  const infoElement = cardElement.querySelector('.card__info-text')
  infoElement.innerHTML = 'Information will appear here when available'
}
export { main }
