const mongoose = require('mongoose');

let SmallAreaSchema = new mongoose.Schema({
  "GEOGID": {
    type: String,
    required: true,
    max: 32
  }
});
// let SmallArea = mongooseDublinBikes.model('Station', SmallAreaSchema);
module.exports = SmallAreaSchema;