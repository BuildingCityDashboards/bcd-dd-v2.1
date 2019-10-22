var express = require('express');
var router = express.Router();

var qnq22_controller = require('../controllers/QNQ22Controller');

/* GET themes page. */
//router.get('/', function(req, res, next) {
//  res.redirect('/themes/health');
//});

router.get('/', function(req, res, next) {
  res.render('themes', { title: 'Themes Page', active:'themes'});
});

router.get('/demographics', function(req, res, next) {
  res.render('themes_demographics', { title: 'Demographics' });
});


router.get('/economy', function(req, res, next) {
  res.render('themes_economy', { title: 'Economy' });
});

// router.get('/economy', qnq22_controller.economy);

router.get('/health', function(req, res, next) {
  res.render('themes_health', { title: 'Health' });
});

router.get('/transport', function(req, res, next) {
  res.render('themes_transport', { title: 'Transport' });
});

router.get('/education', function(req, res, next) {
  res.render('themes_education', { title: 'Education' });
});

router.get('/environment', function(req, res, next) {
  res.render('themes_environment', { title: 'Environment' });
});

router.get('/housing', function(req, res, next) {
  res.render('themes_housing', { title: 'Housing' });
});

router.get('/new-layout', function(req, res, next) {
  res.render('themes/themesNew', { title: 'Themes New Layout' });
});

/* API csv routes for themes */
router.get('/api/opw', function(req, res, next) {
  res.download('public/data/opw.csv');
});

router.get('/api/dental', function(req, res, next) {
  res.download('public/data/DublinDentalPracticeList.csv');
});

router.get('/api/gp', function(req, res, next) {
  res.download('public/data/DublinGPList.csv');
});

router.get('/api/health-center', function(req, res, next) {
  res.download('public/data/DublinHealthCenterList.csv');
});

router.get('/api/hospital', function(req, res, next) {
  res.download('public/data/DublinHospitalList.csv');
});

router.get('/api/pharmacy', function(req, res, next) {
  res.download('public/data/DublinPharmacyList.csv');
});

// testing converting to json
// router.get('/api/test', asyncHandler(async (req, res, next) => { 
//   const jsonArray=await csv().fromFile(csvFilePath);
//   res.json(jsonArray);
// }));

module.exports = router;
