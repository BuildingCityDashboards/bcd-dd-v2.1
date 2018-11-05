var express = require('express');
var router = express.Router();

/* GET themes page. */
router.get('/', function(req, res, next) {
  res.render('stories', { title: 'Stories Page' });
});

router.get('/housing-dublin', function(req, res, next) {
  res.render('stories/stories_housing', { title: 'Housing in the Dublin Region, 1991 to present', page:'page light'  });
});

module.exports = router;