var express = require('express');
var router = express.Router();

var authorities_controller = require('../controllers/authoritiesController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dublin Dashboard', page:'index' });
});

// GET request for list of all Local Authorities Documents.
router.get('/authorities', authorities_controller.authorities_list);

// GET request for list of all County Specific Documents.
router.get('/authorities/:id', authorities_controller.authorities_county);

module.exports = router;
