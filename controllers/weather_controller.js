const moment = require('moment');
// const fetch = require("node-fetch");

const getData = async url => {
  const fetch = require("node-fetch");
  try {
    const response = await fetch(url);
    const xml = await response.text();
    // console.log("\n******\nCar Parks (controller) data: " + xml + "\n******\n");
    return xml;

  } catch (error) {
    return console.log(error);
  }
};

/* data format*/
// <carparkData>
// <Northwest>
// <carpark name="PARNELL" spaces="111"> </carpark>
// <carpark name="ILAC" spaces="792"> </carpark>
// <carpark name="JERVIS" spaces="517"> </carpark>
// <carpark name="ARNOTTS" spaces="236"> </carpark>
// </Northwest>
// <Northeast>
// <carpark name="MARLBORO" spaces="34"> </carpark>
// <carpark name="ABBEY" spaces=" "> </carpark>
// </Northeast>
// <Southwest>
// <carpark name="THOMASST" spaces="188"> </carpark>
// <carpark name="C/CHURCH" spaces="FULL"> </carpark>
// </Southwest>
// <Southeast>
// <carpark name="SETANTA" spaces="14"> </carpark>
// <carpark name="DAWSON" spaces="106"> </carpark>
// <carpark name="TRINITY" spaces="178"> </carpark>
// <carpark name="GREENRCS" spaces="588"> </carpark>
// <carpark name="DRURY" spaces="145"> </carpark>
// <carpark name="B/THOMAS" spaces="304"> </carpark>
// </Southeast>
// <Timestamp>10:26:50 on Thursday 23/05/2019</Timestamp>
// </carparkData>

exports.getWeather = async (req, res, next) => {
  console.log("\n\n**********Get Weather Data******************\n");
  let url = "https://dublindashboard.ie/met_eireann_forecast.xml";
  const response = await getData(url);
  res.send(response);
};

/* Station snapshot data format*/
// {
// "address": "Blessington Street",
// "available_bike_stands": 20,
// "available_bikes": 0,
// "banking": "True",
// "bike_stands": 20,
// "id": 2,
// "last_update": "2019-05-21T09:29:15Z",
// "latitude": 53.35677,
// "longitude": -6.26814,
// "name": "BLESSINGTON STREET",
// "status": "open",
// "time": "2019-05-21T09:40:02Z"
// }
// exports.getStationsSnapshot = async (req, res) => {
//   console.log("\n\n**********Get Stations Snapshot******************\n");
//   let url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/lastsnapshot/";
//   const response = await getDublinBikesData_derilinx(url);
//   res.send(response);
// };

//Station query format
// [{
//   "address": "Heuston Bridge (South)",
//   "banking": "False",
//   "historic": [{
//       "available_bike_stands": 0,
//       "available_bikes": 25,
//       "bike_stands": 25,
//       "status": "open",
//       "time": "2019-03-08T20:00:05Z"
//     },
//     {
//       "available_bike_stands": 0,
//       "available_bikes": 25,
//       "bike_stands": 25,
//       "status": "open",
//       "time": "2019-03-08T20:05:04Z"
//     }
//   ],
//   "id": 100,
//   "latitude": 53.347107,
//   "longitude": -6.292041,
//   "name": "HEUSTON BRIDGE (SOUTH)"
// }]
// exports.getStationDataToday = async (req, res) => {
//   console.log("\n\n**********Get Station Trend " + req.params.number + "******************\n");
//
//   /*Fetch trend data for the day and display in popup*/
//   let startQuery = moment.utc().startOf('day').format('YYYYMMDDHHmm');
//   let endQuery = moment.utc().endOf('day').format('YYYYMMDDHHmm');
//   // console.log("\nStart Query: " + startQuery + "\nEnd Query: " + endQuery);
//   const url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
//     "dfrom=" +
//     startQuery +
//     "&dto=" +
//     endQuery +
//     "&station=" +
//     req.params.number;
//   const response = await getDublinBikesData_derilinx(url);
//   res.send(response);
// };

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