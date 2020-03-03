const getData = async url => {
  const fetch = require('node-fetch')
  try {
    const response = await fetch(url)
    const xml = await response.text()
    // console.log("\n******\nCar Parks (controller) data: " + xml + "\n******\n");
    return xml
  } catch (error) {
    return console.log(error)
  }
}

exports.getWeather = async (req, res, next) => {
  console.log('\n\n**********Get Weather Data******************\n')
  // let url = 'https://dublindashboard.ie/met_eireann_forecast.xml'
  const url = 'http://metwdb-openaccess.ichec.ie/metno-wdb2ts/locationforecast?lat=54.7210798611;long=-8.7237392806'
  const response = await getData(url)
  res.send(response)
}
