const mongoose = require('mongoose');
const moment = require('moment');
let NoiseMonitorSchema = require('../models/noise');
let connections = require('../database/connections');
let dbsConnection = connections.dublinBikesConnection;
let Monitor = dbsConnection.model('Monitor', NoiseMonitorSchema);

exports.listAllMonitors = function(req, res, next) {
  Monitor.find({}, '-_id', function(err, Monitors) {
    if (err) {
      return console.error(err);
    }
    //console.log("Monitors: " + Monitors);
    res.send(Monitors);
  })
};

exports.getMonitorExample = function(req, res, next) {

  let start = moment().startOf('day');
  let end = moment.utc().endOf('day');
  console.log("\nStart: " + start + "\nEnd: " + end);

  Monitor.findOne({}, '-_id', function(err, Monitor) {
    if (err) {
      return console.error(err);
    }
    //console.log("Monitors: " + Monitors);
    console.log("Record update: " + JSON.stringify(Monitor["last_update"]));
    res.send(Monitor);
  });
};

exports.getMonitorData = function(req, res, next) {
  //console.log("req: " + JSON.stringify(req.params));

  const query = Monitor.find({}, '-_id name number available_bike_stands available_bikes last_update');
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);

  query.where('number').equals(req.params.number)
    .exec(function(err, MonitorData) {
      if (err) {
        // res.render('api_error', {
        //   title: 'API Error'
        // });
        //return next(err);
        return console.log(err);
      }
      res.send(MonitorData);
    });
};

exports.getMonitorDataToday = function(req, res, next) {
  let start = moment.utc().startOf('day');
  let end = moment.utc().endOf('day');
  console.log("\nStart: " + start + "\nEnd: " + end);

  const query = Monitor.find({
    last_update: {
      $gte: start,
      $lt: end
    }
  }, '-_id name number available_bike_stands available_bikes last_update bike_stands');
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);

  query.where('number').equals(req.params.number)
    .exec(function(err, MonitorData) {
      if (err) {
        // res.render('api_error', {
        //   title: 'API Error'
        // });
        //return next(err);
        return console.log(err);
      }
      res.send(MonitorData);
    });
};