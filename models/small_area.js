let mongooseS = require('mongoose');
let Schema = mongooseS.Schema;
let SmallAreaSchema = new Schema(
{
  "GEOGID": {type: String, required: true, max: 32},
});

module.exports = mongooseS.model('small_area', SmallAreaSchema );
