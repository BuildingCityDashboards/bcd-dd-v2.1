var express = require('express');
var router = express.Router();

/* GET themes page. */
router.get('/', function(req, res, next) {
  res.redirect('/themes/health');
});

// for testing
router.get('/economy', function(req, res, next) {
  res.render('themes_economy', { title: 'Themes Page' });
});

router.get('/health', function(req, res, next) {
  res.render('themes_health', { title: 'Themes: Health' });
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
