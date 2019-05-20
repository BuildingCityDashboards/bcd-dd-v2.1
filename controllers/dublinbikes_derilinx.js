const moment = require('moment');
// const fetch = require("node-fetch");

const getDublinBikesData_derilinx = async url => {
  const fetch = require("node-fetch");
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log("\n******\nExample Dublin Bikes data from Derilinx: " + JSON.stringify(json[0]) + "\n******\n");
    return json;

  } catch (error) {
    return console.log(error);
  }
};

exports.getStationsList = async (req, res, next) => {
  console.log("\n\n**********Get Stations List******************\n");
  let url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/stations/";
  const response = await getDublinBikesData_derilinx(url);
  res.send(response);
};

exports.getStationsSnapshot = async (req, res, next) => {
  console.log("\n\n**********Get Stations Snapshot******************\n");
  let url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/lastsnapshot/";
  const response = await getDublinBikesData_derilinx(url);
  res.send(response);
};

exports.getStationDataToday = async (req, res, next) => {
  console.log("\n\n**********Get Station #" + req.params.id + " Data (Today)******************\n");

  let url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
    "dfrom=" +
    start +
    "&dto=" +
    end +
    "&station=" +
    req.params.id;

  const response = await getDublinBikesData_derilinx(url);
  res.send(response);
};

// exports.getStationData = function(req, res, next) {
//   //console.log("req: " + JSON.stringify(req.params));
//
//   // const query = Station.find({}, '-_id name number available_bike_stands available_bikes last_update');
//   // query.setOptions({
//   //   lean: true
//   // });
//   // //query.collection(SmallArea.collection);
//   //
//   // query.where('number').equals(req.params.number)
//   //   .exec(function(err, stationData) {
//   //     if (err) {
//   //       // res.render('api_error', {
//   //       //   title: 'API Error'
//   //       // });
//   //       //return next(err);
//   //       return console.log(err);
//   //     }
//   //     res.send(stationData);
//   //   });
// };
//
// // exports.getStationDataToday = function(req, res, next) {
// //   let start = moment.utc().startOf('day').format('YYYYMMDDHHmm');
// //   let end = moment.utc().endOf('day').format('YYYYMMDDHHmm');
// //
// //   console.log("\nStart: " + start + "\nEnd: " + end);
// //   const bikes_url_derilinx = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
// //     "dfrom=" +
// //     start +
// //     "&dto=" +
// //     end +
// //     "&station=" +
// //     req.params.number;
// //
// //   const getDublinBikesData_derilinx = async url => {
// //     const fetch = require("node-fetch");
// //     try {
// //       const response = await fetch(url);
// //       const json = await response.json();
// //       console.log("\n******\nExample Dublin Bikes data from Derilinx for station " +
// //         req.params.number + "\n" + JSON.stringify(json[0]) + "\n******\n");
// //
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };
//
// // getDublinBikesData_derilinx(bikes_url_derilinx);
//
// // const query = Station.find({
// //   last_update: {
// //     $gte: start,
// //     $lt: end
// //   }
// // }, '-_id name number available_bike_stands available_bikes last_update bike_stands');
// // query.setOptions({
// //   lean: true
// // });
// // //query.collection(SmallArea.collection);
// //
// // query.where('number').equals(req.params.number)
// //   .exec(function(err, stationData) {
// //     if (err) {
// //       // res.render('api_error', {
// //       //   title: 'API Error'
// //       // });
// //       //return next(err);
// //       return console.log(err);
// //     }
// //     res.send(stationData);
// //   });
// // };