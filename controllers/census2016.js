const mongoose = require('mongoose');
let SmallAreaSchema = require('../models/census2016');
let connections = require('../database/connections');
let census2016Connection = connections.census2016Connection;
let SmallArea = census2016Connection.model('Small_Area', SmallAreaSchema);

//lists GEOGIDs for all SAs in database (not limit = slow)
exports.listAllSAGGEOGIDs = function(req, res, next) {
  SmallArea.find({}, 'GEOGID -_id', function(err, sas) {
    if (err) {
      return console.error("\n\nCensus2016 controller: "+err+"\n\n");
    }
    res.send(sas);
  });
};

//returns the first SA document found in database
//useful for seeing available fields in data
exports.getSAExample = function(req, res, next) {
  SmallArea.findOne({}, '-_id', function(err, sas) {
    if (err) {
      return console.error(err);
    }
    res.send(sas);
  });
};


exports.getSAData = function(req, res, next) {
  // console.log("req: " + JSON.stringify(req.params));

  const query = SmallArea.find({}, '-_id');
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);

  query.where('GEOGID').equals(req.params.GEOGID)
    .exec(function(err, stationData) {
      if (err) {
        // res.render('api_error', {
        //   title: 'API Error'
        // });
        //return next(err);
        return console.log(err);
      }
      res.send(stationData);
    });
};
