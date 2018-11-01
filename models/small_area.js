var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SmallAreaSchema = new Schema(
{
  "GEOGID": {type: String, required: true, max: 32},
});

module.exports = mongoose.model('small_area', SmallAreaSchema );
