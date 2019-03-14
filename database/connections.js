require('dotenv').config();
const mongoose = require('mongoose');

let bikesURL = process.env.BIKES_DB_URL;

let dublinBikesConnection = mongoose.createConnection(bikesURL, {
  useNewUrlParser: true
});

exports.dublinBikesConnection = dublinBikesConnection;

//let census2016URL = process.env.CENSUS_DB_URL;
//// let noiseURL = 'mongodb://dublinbikes_user:bikeywikes666@ds016128.mlab.com:16128/dublinbikes';
//
//let census2016Connection = mongoose.createConnection(census2016URL, {
//  useNewUrlParser: true
//});
//
//exports.census2016Connection = census2016Connection;



// let noiseConnection = mongoose.createConnection(noiseURL, {
//   useNewUrlParser: true
// });
//
// exports.noiseConnection = noiseConnection;