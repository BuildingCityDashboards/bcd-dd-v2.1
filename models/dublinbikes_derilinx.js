const mongoose = require('mongoose');

let BikesStationSchemaDerilinx = new mongoose.Schema({
"address": String,
"historic": [
{
"available_bike_stands": Number,
"available_bikes": Number,
"bike_stands": Number,
"time": String
},
{
"available_bike_stands": Number,
"available_bikes": Number,
"bike_stands": Number,
"time": String
}
],
"id": Number,
"latitude": Number,
"longitude": Number,
"name": String

});
module.exports = BikesStationSchemaDerilinx;