var express = require('express')
var router = express.Router()

/* GET page. */
router.get('/', function (req, res, next) {
  res.render('tools', { title: 'Tools Page', active: 'tools' })
// res.render('/tools/planning');
})

router.get('/planning', function (req, res, next) {
  res.render('tools/tools-planning', { title: 'Tools: Planning' })
})

router.get('/geodemographics', function (req, res, next) {
  res.render('tools/tools-geodemos', { title: 'Tools: Geodemographics' })
})

router.get('/census2016', function (req, res, next) {
  res.render('tools-census2016', { title: 'Tools: Census 2016' })
})

module.exports = router
