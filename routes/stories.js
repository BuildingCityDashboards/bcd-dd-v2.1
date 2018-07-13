var express = require('express');
var router = express.Router();

/* GET themes page. */
router.get('/', function(req, res, next) {
  res.render('stories', { title: 'Stories Page' });
});

module.exports = router;