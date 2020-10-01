// /***

//   Air quality card

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
  const RETRY_INTERVAL = 30000
  const REFRESH_INTERVAL = 60000 * 10
  let refreshTimeout

  async function fetchData () {
    // console.log('fetch data')
    let json
    clearTimeout(refreshTimeout)
    try {
      // console.log('fetching data')
      json = await fetchJsonFromUrlAsyncTimeout(options.displayoptions.data.href, 500)
      if (json) {
        const corkData = json.aqihsummary.filter((d) => {
          if (d['aqih-region'] === 'Dublin_City') {
            return d
          }
        })

        const lastReadTime = json.generatedAt.split(' ')[1] ? json.generatedAt.split(' ')[1] : ''

        const cardElement = document.getElementById('air-quality-card')
        const subtitleElement = cardElement.querySelector('#subtitle')
        subtitleElement.innerHTML = 'Latest reading ' + lastReadTime

        const leftElement = cardElement.querySelector('#card-left')
        leftElement.innerHTML = '<h1>' + corkData[0].aqih.split(',')[1] + '</h1>' +
          '<h2>Quality</h2>'

        const rightElement = cardElement.querySelector('#card-right')
        rightElement.innerHTML =
          '<h1>' + corkData[0].aqih.split(',')[0] + '</h1>' +
          '<h2>Index</h2>'

        const infoElement = cardElement.querySelector('.card__info-text')
        infoElement.innerHTML = 'The latest air quality reading in Dublin city was taken at <b>' + lastReadTime + '</b>  and indicated a <b>QUALITY INDEX of ' + corkData[0].aqih.split(',')[0] + '</b> in the <b>' + corkData[0].aqih.split(',')[1].toUpperCase() + '</b> quality band'

        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)
      } else json = null // nullify for GC (necessary?)
    } catch (e) {
      json = null // nullify for GC (necessary?)
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
}

export { main }
