var express = require('express');
var router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('tools', { title: 'Tools Page' });
//res.render('/tools/planning');
});

router.get('/planning', function(req, res, next) {
  res.render('tools-planning', { title: 'Tools: Planning' });
});

module.exports = router;