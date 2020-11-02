var express = require('express')
var router = express.Router()

/* GET queries page. */
router.get('/', function (req, res, next) {
  res.render('queries', {
    title: 'Queries Page',
    active: 'queries'
  })
})

router.get('/geodemos', function (req, res, next) {
  res.render('queries/geodemos', {
    title: 'Query: Geodemographics',
    page: ''
  })
})

router.get('/geodemosHM', function (req, res, next) {
  res.render('queries/geodemosHM', {
    title: 'Query: Geodemographics',
    page: ''
  })
})

router.get('/residentialpropertyprice', function (req, res, next) {
  res.render('queries/residential_property_price', {
    title: 'Query: Residential Property Price',
    page: ''
  })
})

module.exports = router
