var express = require('express');
var router = express.Router();
var small_area_controller = require('../controllers/small_area_controller');
router.get('/', function(req, res) {
res.render('index', { title: 'Census 2016' });
});
module.exports = router;
