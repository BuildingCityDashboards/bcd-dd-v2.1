let bikesURL = 'mongodb://dublinbikes_user:bikeywikes666@ds016128.mlab.com:16128/dublinbikes';
let census2016URL = 'mongodb://census_user:census2016@ds052978.mlab.com:52978/census2016';
let noiseURL = 'mongodb://dublinbikes_user:bikeywikes666@ds016128.mlab.com:16128/dublinbikes';
const mongoose = require('mongoose');

let census2016Connection = mongoose.createConnection(census2016URL, {
  useNewUrlParser: true
});

exports.census2016Connection = census2016Connection;

let dublinBikesConnection = mongoose.createConnection(bikesURL, {
  useNewUrlParser: true
});

exports.dublinBikesConnection = dublinBikesConnection;

let noiseConnection = mongoose.createConnection(noiseURL, {
  useNewUrlParser: true
});

exports.noiseConnection = noiseConnection;