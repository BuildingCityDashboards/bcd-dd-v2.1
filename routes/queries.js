var express = require('express');
var router = express.Router();

/* GET queries page. */
router.get('/', function(req, res, next) {
  res.render('queries', {
    title: 'Queries Page',
    active: 'queries'
  });
});

router.get('/q1', function(req, res, next) {
  //alert('you clicked q1')
  res.render('queries/qt1', {
    title: 'test',
    page: ''
  });
});

router.get('/q2', function(req, res, next) {
  //alert('you clicked q2')
  res.render('queries/qt2', {
    title: '',
    page: ''
  });
});


router.get('/q3', function(req, res, next) {
  //alert('you clicked q3')
  res.render('queries/qt3', {
    title: '',
    page: ''
  });
});

module.exports = router;