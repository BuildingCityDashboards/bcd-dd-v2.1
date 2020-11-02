'use strict'
/***
TODO:
#759
- refactor to use urls from lookup data/realtime-data-sources.json
- convert to thin controller, with application logic in service layer
***/

const getData = async url => {
  const fetch = require('node-fetch')
  try {
    const response = await fetch(url)
    const data = await response.text()
    return data
  } catch (error) {
    return console.log(error)
  }
}

exports.getTestData = async (req, res, next) => {
  const uri =
    // 'https://erc.epa.ie/real-time-air/www/aqindex/aqih_json.php'
    // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/PEB06'
    'https://www.propertypriceregister.ie/website/npsra/pprweb.nsf/PPRDownloads?OpenForm&File=PPR-2020-09-Dublin.csv'
  const response = await getData(uri)
  console.log(response)
  res.send(response)
}
