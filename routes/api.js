const express = require('express')
const fs = require('fs')
const router = express.Router({
  mergeParams: true
})

router.get('/', function (req, res, next) {
  res.render('api')
})

router.get('/data', (req, res, next) => {
  console.log('***\nrequest\n***')
  fs.readFile('data/search-index.json', (err, json) => {
    if (err) console.log(err)
    const obj = JSON.parse(json)
    res.send(obj)
  })
})

const trainStationController = require('../controllers/irish_trains')

// static trains list
router.get('/trainstations/stations/list', trainStationController.getTrainStationsList)
router.get('/trainstations/stations/:ts', trainStationController.getTrainStationsData)

const waterLevelController = require('../controllers/water_levels')
router.get('/wlstations/stations/list', waterLevelController.getStationsList)
router.get('/wlstations/stations/:ts', waterLevelController.getStationsData)

const dublinBikesController = require('../controllers/dublinbikes_derilinx')
// static station list
router.get('/dublinbikes/stations/list', dublinBikesController.getStationsList)
// all station snapshot
router.get('/dublinbikes/stations/all/snapshot', dublinBikesController.getStationsSnapshot)
// router.get('/dublinbikes/stations/example', dublinBikesController.getStationExample);
// router.get('/dublinbikes/stations/:number', dublinBikesController.getStationData);

// all stations, all readings so far today
router.get('/dublinbikes/stations/all/today', dublinBikesController.getAllStationsDataToday)
router.get('/dublinbikes/stations/all/yesterday', dublinBikesController.getAllStationsDataYesterdayHourly)
// router.get('/dublinbikes/stations/all/thisweek', dublinBikesController.getAllStationsDataWeek);
// router.get('/dublinbikes/stations/all/thismonth', dublinBikesController.getAllStationsDataMonth);

// one station, all readings so far today
router.get('/dublinbikes/stations/:number/today', dublinBikesController.getStationDataToday)

const carparksController = require('../controllers/carparks_controller')
router.get('/carparks/snapshot', carparksController.getCarparksSnapshot)

const weatherController = require('../controllers/weather_controller')
// router.get('/weather', weatherController.getWeather)

router.get('/weather/latest', weatherController.getWeather)

module.exports = router
