const fetch = require('node-fetch')
const BASE_URL_TRAFFIC = 'https://data.tii.ie/Datasets/TrafficCountData/'

const getData = async url => {
  try {
    const response = await fetch(url)
    const csv = await response.text()
    // console.log("\n******\nExample Dublin Bikes data from Derilinx: " + JSON.stringify(json[0]) + "\n******\n");
    return csv
  } catch (error) {
    return console.log(error)
  }
}

exports.getTrafficPerSiteByQuery = async (req, res, next) => {
  console.log('\n\ngetTrafficPerSiteByQuery\n\n')
  console.log(req.query.q)
  try {
    const data = await getData(BASE_URL_TRAFFIC + req.query.q)
    res.send(data)
  } catch (e) {
    console.error('Error in getAllStationsDataHourly' + e)
    res.send([]) // todo: return null object
  }
}

// This should happen in controller, with logic in service
exports.getTrafficPerSiteYesterday = async (req, res, next) => {
  // const e = new moment(date)
  const dateObj = new Date()
  dateObj.setDate(dateObj.getDate() - 1) // yesterday
  const y = dateObj.getFullYear()
  let m = dateObj.getMonth()
  m += 1 // correct for 1-indexed months
  m = m.toString().padStart(2, '0')
  let day = dateObj.getDate()
  day = day.toString().padStart(2, '0')

  const SAMPLE_DATE = '2020/04/24/per-site-class-aggr-2020-04-24.csv'
  const yesterdayQuery = `${y}/${m}/${day}/per-site-class-aggr-${y}-${m}-${day}.csv`
  console.log('\n*\n*\n' + yesterdayQuery + '\n*\n*\n')
  try {
    const data = await getData(BASE_URL_TRAFFIC + yesterdayQuery)
    res.send(data)
  } catch (e) {
    console.error('Error in getAllStationsDataHourly' + e)
    res.send([]) // todo: return null object
  }
}
