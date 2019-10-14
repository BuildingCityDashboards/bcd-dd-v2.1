let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let SmallAreaSchema = new Schema({
  "GEOGID": {
    type: String,
    required: true,
    max: 32
  },
});

module.exports = mongoose.model('small_area', SmallAreaSchema);