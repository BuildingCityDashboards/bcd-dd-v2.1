var express = require('express');
var router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('portal', {
    title: 'Portal Page',
    active: 'portal'
  });
  //res.render('/tools/planning');
});

// router.get('/planning', function(req, res, next) {
//   res.render('tools-planning', {
//     title: 'Tools: Planning'
//   });
// });
//
// router.get('/census2016', function(req, res, next) {
//   res.render('tools-census2016', {
//     title: 'Tools: Census 2016'
//   });
// });

module.exports = router;