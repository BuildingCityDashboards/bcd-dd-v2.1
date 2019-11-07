var express = require('express');
var router = express.Router();

/* GET queries page. */
router.get('/', function(req, res, next) {
  res.render('queries', {
    title: 'Queries Page',
    active: 'queries'
  });
});

module.exports = router;