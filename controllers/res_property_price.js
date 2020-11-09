'use strict'
/***
***/

const fetch = require('node-fetch')
const https = require('https')

const getData = async (url) => {
  const options = {
    method: 'GET',
    headers: {
      // Authorization: `Your Token If Any`,
      'Content-Type': 'application/json'
    },
    // Add The Below
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  }
  return await fetch(url, options)
    .then((response) => {
      return response.text()
    })
    .then((response) => {
      // console.log('response is', response)
      return response
    })
    .catch((err) => {
      console.log('Error fetching property price register data', err)
    })
}

exports.getTestData = async (req, res, next) => {
  const uri =
    // 'https://erc.epa.ie/real-time-air/www/aqindex/aqih_json.php'
    // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/PEB06'
    // 'https://www.propertypriceregister.ie/website/npsra/pprweb.nsf/PPRDownloads?OpenForm&File=PPR-2020-09-Dublin.csv&County=Dublin&Year=2020&Month=09'
    'https://www.propertypriceregister.ie/website/npsra/ppr/npsra-ppr.nsf/Downloads/PPR-2020-09-Dublin.csv/$FILE/PPR-2020-09-Dublin.csv'
  const response = await getData(uri)
  // console.log(response)
  res.send(response)
}
