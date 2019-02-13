let mongooseB = require('mongoose');
let Schema = mongooseB.Schema;
let BikeStationSchema = new Schema(
{
  "number": {type: String, required: true, max: 32},
  "name": {type: String, required: true, max: 32},
  
});

module.exports = mongooseB.model('bikes_station', BikeStationSchema );
