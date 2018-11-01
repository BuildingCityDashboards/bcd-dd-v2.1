var express = require('express');
var router = express.Router();
var small_area_controller = require('../controllers/small_area_controller');

router.get('/', function(req, res, next) {
  res.render('api', { title: 'API Test Page' });
});

router.get('/v1', function(req, res, next) {
  res.render('api', { title: 'API Version 1 Test Page' });
});

router.get('/v1/census2016', function(req, res) {
res.render('census2016', { title: 'Census 2016 API Test Page' });
});

//Return GEOGIDs for all SAs
router.get('/v1/census2016/smallareas', small_area_controller.small_areas_list);
//Return data for an SA
router.get('/v1/census2016/smallarea/:id', small_area_controller.small_area_data);
module.exports = router;
