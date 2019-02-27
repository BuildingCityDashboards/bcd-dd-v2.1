const mongoose = require('mongoose');
const moment = require('moment');
let BikesStationSchema = require('../models/dublinbikes');
let connections = require('../database/connections');
let dbsConnection = connections.dublinBikesConnection;
let Station = dbsConnection.model('Station', BikesStationSchema);

exports.listAllStations = function(req, res, next) {
  Station.find({}, '-_id', function(err, stations) {
    if (err) {
      return console.error(err);
    }
    //console.log("Stations: " + stations);
    res.send(stations);
  })
};

exports.getStationExample = function(req, res, next) {

  let start = moment().startOf('day');
  let end = moment.utc().endOf('day');
  console.log("\nStart: " + start + "\nEnd: " + end);

  Station.findOne({}, '-_id', function(err, station) {
    if (err) {
      return console.error(err);
    }
    //console.log("Stations: " + stations);
    console.log("Record update: " + JSON.stringify(station["last_update"]));
    res.send(station);
  });
};

exports.getStationData = function(req, res, next) {
  //console.log("req: " + JSON.stringify(req.params));

  const query = Station.find({}, '-_id name number available_bike_stands available_bikes last_update');
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);

  query.where('number').equals(req.params.number)
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

exports.getStationDataToday = function(req, res, next) {
  let start = moment.utc().startOf('day');
  let end = moment.utc().endOf('day');
  console.log("\nStart: " + start + "\nEnd: " + end);

  const query = Station.find({
    last_update: {
      $gte: start,
      $lt: end
    }
  }, '-_id name number available_bike_stands available_bikes last_update');
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);

  query.where('number').equals(req.params.number)
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