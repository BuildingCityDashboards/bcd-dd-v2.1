var express = require('express')
var router = express.Router()

/* GET themes page. */
router.get('/', function (req, res, next) {
  res.render('stories', {
    title: 'Stories Page',
    active: 'stories'
  })
})

router.get('/housing-crisis-phase-1', function (req, res, next) {
  res.render('stories/housing_crisis_1', {
    title: 'Housing Crisis Phase 1: 1993-2006 (the Celtic Tiger years)',
    page: 'page'
  })
})

router.get('/housing-crisis-phase-2', function (req, res, next) {
  res.render('stories/housing_crisis_2', {
    title: 'Housing Crisis Phase 2: 2007-2012 (the crash)',
    page: 'page'
  })
})

router.get('/housing-crisis-phase-3', function (req, res, next) {
  res.render('stories/housing_crisis_3', {
    title: 'Housing Crisis Phase 3: 2013 onwards (post-crash)',
    page: 'page'
  })
})

module.exports = router
