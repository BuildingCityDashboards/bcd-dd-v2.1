var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dublinbikesStationSchema = new Schema({
  number: Number,
  name: String,
});

var BikesModel = mongoose.model('BikesModel', dublinbikesStationSchema);
module.exports = BikesModel;

// {
//     "_id": {
//         "$oid": "5c61a6ce5a6f96e567f9c674"
//     },
//     "number": 25,
//     "contract_name": "Dublin",
//     "name": "MERRION SQUARE EAST",
//     "address": "Merrion Square East",
//     "position": {
//         "lat": 53.339434,
//         "lng": -6.246548
//     },
//     "banking": false,
//     "bonus": false,
//     "bike_stands": 30,
//     "available_bike_stands": 20,
//     "available_bikes": 10,
//     "status": "OPEN",
//     "last_update": 1549843788000
// }