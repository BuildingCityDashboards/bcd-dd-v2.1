const bikesInterval = 20000
let bikesCountdown = bikesInterval
let prevBikesAgeMins, prevBikesAvailable, prevStandsAvailable
const indicatorUpSymbol = "<span class='up-arrow'>&#x25B2;</span>"
const indicatorDownSymbol = "<span class='down-arrow'>&#x25BC;</span>"
const indicatorRightSymbol = "<span class='right-arrow'>&#x25BA;</span>"
let prevBikesAvailableDirection = indicatorRightSymbol // '▶'
let prevStandsAvailableDirection = indicatorRightSymbol // '▶'
let prevBikesTrendString = '(no change)'
let prevStandsTrendString = '(no change)'

// indicatorUpSymbol.style.color = 'green';

const updateBikesCountdown = function () {
  const cd = bikesCountdown / 1000
  d3.select('#bikes-bikesCountdown').text('Update in ' + cd)
  if (bikesCountdown > 0) bikesCountdown -= 1000
}

let bikesTimer = setInterval(updateBikesCountdown, 1000)

const fetchBikesData = function () {
  d3.json('/api/dublinbikes/stations/all/snapshot') // get latest snapshot of all stations
    .then((data) => {
      // console.log('Fetched Dublin Bikes card data ')
      // console.log(data)
      // The derilinx API sometimes returns an empty JSON array- need to check for that
      if (data.length > 0) {
        const cardData = getCardData(data)
        updateBikesDisplay(cardData.availableBikes, cardData.availableStands, cardData.dataAgeMinutes)
        clearInterval(bikesTimer)
      } else {
        initialiseCardDisplay()
        // updateInfo('#bikes-card a', '<b>Dublin Bikes</b> did not respond to our request for data- we will try again soon')
        // restart the timer
        clearInterval(bikesTimer)
        bikesCountdown = bikesInterval
        bikesTimer = setInterval(updateBikesCountdown, 1000)
      }
    })
    .catch((err) => {
      console.error('Dublin Bikes data error: ' + JSON.stringify(err))
      initialiseCardDisplay()
      updateInfo('#bikes-card a', '<b>Dublin Bikes</b> did not respond with data- we will try again soon')
      // restart the timer
      clearInterval(bikesTimer)
      bikesCountdown = bikesInterval
      bikesTimer = setInterval(updateBikesCountdown, 1000)
    })
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

  return { availableBikes: availableBikes, availableStands: availableStands, dataAgeMinutes: bikesAgeMins }
}

function initialiseCardDisplay () {
  // let bikeTimeShort = d3.timeFormat("%a, %H:%M");

  d3.select('#bikes-card').select('.card__header').select('.card__sub-title').html("<div id ='bikes-bikesCountdown' ></div>")
  d3.select('#rt-bikes').select('#card-center').html("<img src = '/images/transport/bicycle-w-15.svg' width='24'>")

  d3.select('#rt-bikes').select('#card-left')
    .html('<h3>--</h3>' +
      '<p>bikes</p>')

  d3.select('#rt-bikes').select('#card-right')
    .html(
      '<h3>--</h3>' +
      '<p> stands </p>')

  d3.select('#rt-bikes').select('#card-info')
        .html(
          '<p> test </p>')
}

function updateBikesDisplay (ab, as, age) {
  // console.log("age: " + age);
  const animateClass = age < prevBikesAgeMins ? 'animate-update' : ''

  const bikesAvailableDirection = ab > prevBikesAvailable ? indicatorUpSymbol : ab < prevBikesAvailable ? indicatorDownSymbol : prevBikesAvailableDirection

  const bikesTrendDelta = Math.abs(prevBikesAvailable - ab)
  const bikesTrendString = ab > prevBikesAvailable ? `(${indicatorUpSymbol} Up ${bikesTrendDelta})` : ab < prevBikesAvailable ? `(${indicatorDownSymbol} Down ${bikesTrendDelta})` : prevBikesTrendString

  const standsAvailableDirection = as > prevStandsAvailable ? indicatorUpSymbol : as < prevStandsAvailable ? indicatorDownSymbol : prevStandsAvailableDirection

  const standsTrendDelta = Math.abs(prevStandsAvailable - as)
  const standsTrendString = as > prevStandsAvailable ? `(${indicatorUpSymbol} Up ${standsTrendDelta})` : as < prevStandsAvailable ? `(${indicatorDownSymbol} Down ${standsTrendDelta})` : prevStandsTrendString

  prevBikesAgeMins = age
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

  const bikesAgeDisplay = age > 0 ? age + 'm ago' : 'Just now'
  d3.select('#bikes-card').select('#bikes-bikesCountdown').html("<span class='" + animateClass + "'>" + bikesAgeDisplay + '</span>')

  d3.select('#rt-bikes').select('#card-left')
    .html("<div class = '" + animateClass + "'align='center'>" +
      '<h1>' + bikesAvailableDirection + ' ' + ab + '</h1>' +
      '</div>' +
      "<div align='center'>" +
      '<p> bikes </p>' +
      '</div>')

  d3.select('#rt-bikes').select('#card-right')
    .html("<div class = '" + animateClass + "'align='center'>" +
      '<h1>' + standsAvailableDirection + ' ' + as + '</h1>' +
      '</div>' +
      "<div align='center'>" +
      '<p> stands </p>' +
      '</div>')

  // d3.select('#rt-bikes').select('#card-info p').html('test')

    // .text(`<p>Dublin Bikes currently have <b> ${ab} bikes ${bikesTrendString}</b> and <b> ${as} stands  ${standsTrendString}</b> available across the city</p>`)
}

function updateInfo (selector, infoText) {
  const text = d3.select('#data-text p')
  const textString = '<b>Hover over these charts for more information, click to go to the data page </b>'

  d3.select(selector)
    .on('mouseover', (d) => {
      text.html(infoText)
    })
    .on('mouseout', (d) => {
      text.html(textString)
    })
}

const bikesCardTimer = setIntervalAsync(
  () => {
    return fetchBikesData()
  },
  bikesInterval
)

initialiseCardDisplay()
fetchBikesData() // initial load
