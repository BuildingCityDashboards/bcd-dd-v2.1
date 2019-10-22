const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QNQ22Schema = new Schema({
  OBJECTID:{type: Number, required: true},
  date:{type: String, required: true},
  quarter:{type: String, required: true},
  year:{type: String, required: true},
  region:{type: String, required: true},
  "Persons aged 15 years and over in Employment (Thousand)":{type: String, required: true},
  "Employment Quarter-On-Quarter % Change":{type: String, required: true},
  "Employment Year-On-Year % Change":{type: String, required: true},
  "Unemployed Persons aged 15 years and over (Thousand)":{type: String, required: true},
  "Unemployment Quarter-On-Quarter % Change":{type: String, required: true},
  "Unemployment Year-On-Year % Change":{type: String, required: true},
  "Persons aged 15 years and over in Labour Force (Thousand)":{type: String, required: true},
  "ILO Unemployment Rate (15 - 74 years) (%)":{type: String, required: true},
  "ILO Participation Rate (15 years and over) (%)":{type: String, required: true}
}, { collection : 'qnq22' });

//Export model
module.exports = mongoose.model('qnq22', QNQ22Schema);
