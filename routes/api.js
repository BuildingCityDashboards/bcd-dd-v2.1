var express = require('express');
var router = express.Router();
var small_area_controller = require('../controllers/small_area_controller');
var housing_files_controller = require('../controllers/housing_files_controller');

router.get('/', function(req, res, next) {
  res.render('api', {
    title: 'API Test Page'
  });
});

router.get('/v1', function(req, res, next) {
  res.render('v1', {
    title: 'API Version 1'
  });
});

/****
Census
****/
router.get('/v1/census2016', function(req, res) {
  res.render('census2016', {
    title: 'Census 2016 API Test Page'
  });
});

//Return GEOGIDs for all SAs
router.get('/v1/census2016/smallareas', small_area_controller.list_all);
//Return data for an SA
router.get('/v1/census2016/smallarea/:id', small_area_controller.small_area_data);

/****
Housing
****/

router.get('/v1/housing', function(req, res) {
  res.render('housing', {
    title: 'Housing API Test Page'
  });
});


//Return GEOGIDs for all SAs
router.get('/v1/housing/list', housing_files_controller.list_files);
//Return data for an SA
//router.get('/v1/census2016/smallarea/:id', small_area_controller.small_area_data);

module.exports = router;