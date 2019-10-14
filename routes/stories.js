var express = require('express');
var router = express.Router();

/* GET themes page. */
router.get('/', function(req, res, next) {
  res.render('stories', { title: 'Stories Page', active:'stories'  });
});

router.get('/housing-dublin', function(req, res, next) {
  res.render('stories/stories_housing', { title: 'Housing crisis phase 1: 1993-2006 (the Celtic Tiger years)', page:'page light'  });
});

router.get('/housing-dublin-phase-2', function(req, res, next) {
  res.render('stories/stories_housing_2', { title: 'Housing crisis phase 2: 2007-2012 (the crash)', page:'page light'  });
});

router.get('/housing-dublin-phase-3', function(req, res, next) {
  res.render('stories/stories_housing_3', { title: 'Housing Crisis phase 3: 2013- (post-crash)', page:'page light'  });
});

module.exports = router;