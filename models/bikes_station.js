let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let BikesStationSchema = new Schema(
{
    "name": {type: String, required: true, max: 32},
 
});

module.exports = mongoose.model('bikes_station', BikesStationSchema );
