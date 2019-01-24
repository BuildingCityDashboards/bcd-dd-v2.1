var express = require('express');
var router = express.Router();
var fs = require('fs');
//var small_area_controller = require('../controllers/small_area_controller');
var data = fs.readdirSync('./data/');
// var videos = fs.readdirSync('./videos/');

router.get('/', function(req, res) {
  res.render('index', {
    data: data, // I want to pass this list of images to jade file
    //videos: videos
  });
});

module.exports = router;