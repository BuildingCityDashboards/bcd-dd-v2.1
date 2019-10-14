const mongoose = require('mongoose');

/*
{
    "_id": {
        "$oid": "5c61a6ce5a6f96e567f9c674"
    },
    "number": 25,
    "contract_name": "Dublin",
    "name": "MERRION SQUARE EAST",
    "address": "Merrion Square East",
    "position": {
        "lat": 53.339434,
        "lng": -6.246548
    },
    "banking": false,
    "bonus": false,
    "bike_stands": 30,
    "available_bike_stands": 20,
    "available_bikes": 10,
    "status": "OPEN",
    "last_update": 1549843788000
}
*/

let NoiseMonitorSchema = new mongoose.Schema({
  "name": {
    type: String
  },
  "address": {
    type: String
  },
  "number": {
    type: Number
  },
  "position": {
    "lat": Number,
    "lng": Number
  },
  "last_update": {
    type: Number
  },
  "banking": {
    type: Boolean
  },
  "bonus": {
    type: Boolean
  },
  "bike_stands": {
    type: Number
  },
  "available_bike_stands": {
    type: Number,
  },
  "available_bikes": {
    type: Number,
  },
  "status": {
    type: String,
  }
});
// let BikesStation = mongooseDublinBikes.model('Station', NoiseMonitorSchema);
module.exports = NoiseMonitorSchema;