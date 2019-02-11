var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BikeStationSchema = new Schema(
{
  "NUMBER": {type: String, required: true, max: 32},
});

module.exports = mongoose.model('bikes_station', BikeStationSchema );
