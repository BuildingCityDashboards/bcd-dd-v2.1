// /***

//   Air quality card

// ***/
'use strict'

import { fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'

async function main (options) {
  const RETRY_INTERVAL = 30000
  const REFRESH_INTERVAL = 60000 * 10
  const REQ_TIMEOUT_INTERVAL = 5000 // time after which TO error generated from request
  //   const refreshInterval = 100
  //   let refreshCountdown = refreshInterval

  // const updateCountdown = function () {
  //   // const cd = refreshCountdown / 1000
  //   // d3.select('#bikes-bikesCountdown').text('Update in ' + cd)
  //   // console.log('Countdown: ' + cd)
  //   // if (refreshCountdown > 0) refreshCountdown -= refreshInterval / 2
  // }
  //   let refreshTimer = setInterval(updateCountdown, refreshInterval)
  let refreshTimeout

  async function fetchData () {
    // console.log('fetch data')
    let json
    clearTimeout(refreshTimeout)
    try {
      // console.log('fetching data')
      json = await fetchJsonFromUrlAsyncTimeout(options.displayoptions.data.href, REQ_TIMEOUT_INTERVAL)
      if (json) {
        const lastReadTime = json.generatedAt.split(' ')[1] ? json.generatedAt.split(' ')[1] : ''
        const dublinData = json.aqihsummary.filter((d) => {
          if (d['aqih-region'] === 'Dublin_City') {
            return d
          }
        })
        const qualityValue = dublinData[0].aqih.split(',')[1]
        const indexValue = dublinData[0].aqih.split(',')[0]

        updateDisplay({
          subtitle: 'Latest read: ' + lastReadTime,
          displays: { left: qualityValue, right: indexValue },
          info: 'The latest air quality reading in Dublin city was taken at <b>' + lastReadTime + '</b>  and indicated a <b>QUALITY INDEX of ' + indexValue + '</b>, in the <b>' + qualityValue.toUpperCase() + '</b> quality band'
        })
        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      } else json = null // nullify for GC (necessary?)
    } catch (e) {
      json = null // nullify for GC (necessary?)

      updateDisplay({
        subtitle: 'Fetching data...',
        displays: { left: '- -', right: '- -' },
        info: 'Information will appear here when available'

      })
      console.log('data fetch error' + e)
      clearTimeout(refreshTimeout)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
    }
  }
  fetchData()

  function updateDisplay (content) {
    const cardElement = document.getElementById('air-quality-card')
    const subtitleElement = cardElement.querySelector('#subtitle')
    subtitleElement.innerHTML = content.subtitle

    const leftElement = cardElement.querySelector('#card-left')
    leftElement.innerHTML = '<h1>' + content.displays.left + '</h1>' +
    '<h2>Quality</h2>'

    const rightElement = cardElement.querySelector('#card-right')
    rightElement.innerHTML =
    '<h1>' + content.displays.right + '</h1>' +
    '<h2>Index</h2>'

    const infoElement = cardElement.querySelector('.card__info-text')
    infoElement.innerHTML = content.info
  }
}

export { main }
