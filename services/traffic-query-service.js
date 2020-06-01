const fetch = require('node-fetch')
const BASE_URL_TRAFFIC = 'https://data.tii.ie/Datasets/TrafficCountData/'

const getData = async url => {
  try {
    const response = await fetch(url)
    const csv = await response.text()
    return csv
  } catch (error) {
    return console.log(error)
  }
}
// This should happen in controller, with logic in service
exports.getTrafficPerSiteByQuery = async (req, res, next) => {
  // console.log('\n\ngetTrafficPerSiteByQuery\n\n')
  // console.log(req.query.q)
  try {
    // console.log('query')
    // console.log(BASE_URL_TRAFFIC + req.query.q)
    const data = await getData(BASE_URL_TRAFFIC + req.query.q)
    res.send(data)
  } catch (e) {
    res.send([]) // todo: return null object
  }
}
