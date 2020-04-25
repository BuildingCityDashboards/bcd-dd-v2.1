const fetch = require('node-fetch')

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
// This should happen in controller, with logic in service
exports.getTrafficPerSiteDay = async (req, res, next) => {
  console.log(`\n\n\nCall getTrafficPerSiteDay`)

  // const e = new moment(date)
  const BASE_URL_TRAFFIC = 'https://data.tii.ie/Datasets/TrafficCountData/'
  const SAMPLE_DATE = '2020/04/24/per-site-class-aggr-2020-04-24.csv'
  try {
    const data = await getData(BASE_URL_TRAFFIC + SAMPLE_DATE)

    res.send(data)
    // console.log('\n***\nTraffic res 1 ' + res[2] + '\n***\n')
    // responses.push(response);
    // let availableBikesSum = 0,
    //   availableStandsSum = 0,
    //   bikesInMotionSum = 0 // sum of values at a particluar hour
    //
    //   // console.log("\n\n\n bikes total: " + totalBikes + "\n\n\n");
    // response.forEach(r => {
    //   availableBikesSum += r.historic[0].available_bikes
    //   availableStandsSum += r.historic[0].available_bike_stands
    // })
    // if (h == hStart) {
    //   totalBikesDay = availableBikesSum
    // }
    // const date = moment(response[0].historic[0].time)
    // const dateLabel = moment(response[0].historic[0].time).format('ha, dddd MMMM Do')
    //   // console.log("\n\nmoment: " + dateLabel + "\n\n\n");
    // let label = dateLabel

    /* Data formatted for Multiline Chart */
    // hourlyValues.push({
    //   "key": "available_bikes",
    //   "date": date,
    //   "value": availableBikesSum,
    //   "label": label
    // });
    // hourlyValues.push({
    //   "key": "total_available_bikes",
    //   "date": date,
    //   "value": availableBikesSum > totalBikesDay ? availableBikesSum : totalBikesDay,
    //   "label": label
    // });
    // hourlyValues.push({
    //   "key": "bikes_in_motion",
    //   "date": date,
    //   "value": totalBikesDay - availableBikesSum,
    //   "label": label
    // });

    /* Data formatted for StackedAreaChart, (actually not stacking the data) */
    // hourlyValues.push({
    //   'date': date,
    //   'Bikes in use': (totalBikesDay - availableBikesSum) > 0 ? (totalBikesDay - availableBikesSum) : 0, // // TODO: Fix hack!
    //   'Bikes available': availableBikesSum,
    //   'label': label,
    //   'year': '2019' // if this is a number it gets added to the yAxis domain calc !!!
    // })
  } catch (e) {
    console.error('Error in getAllStationsDataHourly' + e)
    return [] // todo: return null object
  }
}
