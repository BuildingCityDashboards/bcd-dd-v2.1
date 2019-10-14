var express = require('express');
var router = express.Router();

var authorities_controller = require('../controllers/authoritiesController');
var qnq22_controller = require('../controllers/QNQ22Controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dublin Dashboard', page:'page dark', active:'home' });
});

// GET request for list of all Local Authorities Documents.
router.get('/authorities', authorities_controller.authorities_list);

// GET request for list of all County Specific Documents.
router.get('/authorities/:id', authorities_controller.authorities_county);

// GET request for list of all QNQ22 Documents.
router.get('/qnq22', qnq22_controller.QNQ22_list);

// GET request for list of all QNQ22 Documents by Region.
router.get('/qnq22/unemployment', qnq22_controller.QNQ22_unemployment);

// GET request for list of all QNQ22 Documents by Region.
router.get('/qnq22/employment', qnq22_controller.QNQ22_employment);

module.exports = router;
