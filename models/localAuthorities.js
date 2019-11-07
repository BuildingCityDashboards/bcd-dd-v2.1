const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const geometrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[[Number]]]], // Array of arrays of arrays of numbers or should it be double??
    required: true
  }
});

const propertiesSchema = new Schema({
  OBJECTID:{type: Number, required: true},
  COUNTY:{type: String, required: true},
  ENGLISH:{type: String, required: true},
  CONTAE:{type: String, required: true},
  GAEILGE:{type: String},
  PROVINCE:{type: String, required: true},
  ID:{type: String, required: true},
  Region_Name:{type: String},
  CENTROID_X:{type: Number, required: true},
  CENTROID_Y:{type: Number, required: true},
  GlobalID:{type: String, required: true},
  GUID:{type: String, required: true},
  CTY_ID:{type: String, required: true},
  Shape__Area:{type: Number, required: true},
  Shape__Length:{type: Number, required: true}
});

const AuthoritiesSchema = new Schema({
    properties: propertiesSchema,
    geometry: geometrySchema
}, { collection : 'localAuthorities' });

//Export model
module.exports = mongoose.model('Authorities', AuthoritiesSchema);
