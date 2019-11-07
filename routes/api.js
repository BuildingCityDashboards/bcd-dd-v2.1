const express = require('express');
const router = express.Router({
  mergeParams: true
});

router.get('/', function(req, res, next) {
  res.render('api');
});

//var census2016Controller = require('../controllers/census2016');
//// router.get('/census2016/smallareas/count', census2016Controller.countAllSAs);
//router.get('/census2016/smallareas/list', census2016Controller.listAllSAGGEOGIDs);
//router.get('/census2016/smallareas/example', census2016Controller.getSAExample);
//router.get('/census2016/smallareas/:GEOGID', census2016Controller.getSAData);

var dublinBikesController = require('../controllers/dublinbikes_derilinx');

//static station list
router.get('/dublinbikes/stations/list', dublinBikesController.getStationsList);

//all station snapshot
router.get('/dublinbikes/stations/all/snapshot', dublinBikesController.getStationsSnapshot);

// router.get('/dublinbikes/stations/example', dublinBikesController.getStationExample);
// router.get('/dublinbikes/stations/:number', dublinBikesController.getStationData);

//all stations, all readings so far today
router.get('/dublinbikes/stations/all/today', dublinBikesController.getAllStationsDataToday);
router.get('/dublinbikes/stations/all/yesterday', dublinBikesController.getAllStationsDataYesterdayHourly);
// router.get('/dublinbikes/stations/all/thisweek', dublinBikesController.getAllStationsDataWeek);
// router.get('/dublinbikes/stations/all/thismonth', dublinBikesController.getAllStationsDataMonth);

//one station, all readings so far today
router.get('/dublinbikes/stations/:number/today', dublinBikesController.getStationDataToday);

let carparksController = require('../controllers/carparks_controller');
router.get('/carparks/snapshot', carparksController.getCarparksSnapshot);

let weatherController = require('../controllers/weather_controller');
router.get('/weather', weatherController.getWeather);

module.exports = router;