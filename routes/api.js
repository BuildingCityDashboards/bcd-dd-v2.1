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
router.get('/dublinbikes/stations/list', dublinBikesController.listAllStations);
router.get('/dublinbikes/stations/example', dublinBikesController.getStationExample);
router.get('/dublinbikes/stations/:number', dublinBikesController.getStationData);
router.get('/dublinbikes/stations/:number/today', dublinBikesController.getStationDataToday);

module.exports = router;