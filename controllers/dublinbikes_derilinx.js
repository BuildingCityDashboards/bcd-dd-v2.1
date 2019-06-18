const moment = require('moment');

const getDublinBikesData_derilinx = async url => {
  const fetch = require("node-fetch");
  try {
    const response = await fetch(url);
    const json = await response.json();
    // console.log("\n******\nExample Dublin Bikes data from Derilinx: " + JSON.stringify(json[0]) + "\n******\n");
    return json;

  } catch (error) {
    return console.log(error);
  }
};

/* Station list data format*/
// {
// "st_ADDRESS": "Clarendon Row",
// "st_CONTRACTNAME": "Dublin",
// "st_ID": 1,
// "st_LATITUDE": 53.340927,
// "st_LONGITUDE": -6.262501,
// "st_NAME": "CLARENDON ROW"
//}

exports.getStationsList = async (req, res, next) => {
  // console.log("\n\n**********Get Stations List******************\n");
  let url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/stations/";
  const response = await getDublinBikesData_derilinx(url);
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
exports.getStationsSnapshot = async (req, res) => {
  // console.log("\n\n**********Get Stations Snapshot******************\n");
  let url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/lastsnapshot/";
  const response = await getDublinBikesData_derilinx(url);
  res.send(response);
};

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
exports.getStationDataToday = async (req, res) => {
  console.log("\n\n**********Get Station Trend " + req.params.number + "******************\n");
  /*Fetch trend data for the day and display in popup*/
  let startQuery = moment.utc().startOf('day').format('YYYYMMDDHHmm');
  let endQuery = moment.utc().endOf('day').format('YYYYMMDDHHmm');
  // console.log("\nStart Query: " + startQuery + "\nEnd Query: " + endQuery);
  const url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
    "dfrom=" +
    startQuery +
    "&dto=" +
    endQuery +
    "&station=" +
    req.params.number;
  const response = await getDublinBikesData_derilinx(url);
  res.send(response);
};

exports.getAllStationsDataToday = async (req, res) => {
  // console.log("\n\n**********Get Station Trend " + req.params.number + "******************\n");
  /*Fetch trend data for the day and display in popup*/
  let startQuery = moment.utc().startOf('day').format('YYYYMMDDHHmm');
  // let endQuery = moment.utc().endOf('day').format('YYYYMMDDHHmm');
  let endQuery = moment.utc().format('YYYYMMDDHH');
  // console.log("\nStart Query: " + startQuery + "\nEnd Query: " + endQuery);
  const url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
    "dfrom=" +
    startQuery +
    "&dto=" +
    endQuery + '00';

  // console.log("\n\n\nURL - - " + url + "\n\n\n ")
  const response = await getDublinBikesData_derilinx(url);
  res.send(response);
};

/********
Fetch yesterday's bikes data at hourly intervals (called from app at 1.30 am every day)
********/
exports.getAllStationsDataYesterdayHourly = async (req, res) => {
  let hStart = 3,
    hEnd = 26; //hours to gather data for- no. of hours past start of day
  let responses = [];
  let summary = [];
  let hourlyValues = [];
  let totalBikesDay = 0; //the total bikes avaiilable taken as the # available before opening hour
  for (let h = hStart; h <= hEnd; h += 1) {
    let startQuery = moment.utc().subtract(1, 'days').startOf('day').add(h, 'h').format('YYYYMMDDHHmm');
    let endQuery = moment.utc().subtract(1, 'days').startOf('day').add(h, 'h').add(2, 'm').format('YYYYMMDDHHmm');
    // console.log("\nStart Query: " + startQuery + "\nEnd Query: " + endQuery);
    const url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
      "dfrom=" +
      startQuery +
      "&dto=" +
      endQuery;
    // console.log("URL - - " + url + "\n")
    try {
      const response = await getDublinBikesData_derilinx(url);

      // console.log("\n\nResponse hour  " + h + "\n" + JSON.stringify(response) + "\n");
      // responses.push(response);
      let availableBikesSum = 0,
        availableStandsSum = 0,
        bikesInMotionSum = 0; //sum of values at a particluar hour

      // console.log("\n\n\n bikes total: " + totalBikes + "\n\n\n");
      response.forEach(r => {
        availableBikesSum += r.historic[0].available_bikes;
        availableStandsSum += r.historic[0].available_bike_stands;
      });
      if (h == hStart) {
        totalBikesDay = availableBikesSum;
      }
      const date = new Date(response[0].historic[0].time);
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      const hour12 = (date.getHours() % 12) == 0 ? '12' : date.getHours() % 12;
      let label = hour12 + " " + ampm;
      hourlyValues.push({
        "key": "available_bikes",
        "date": date,
        "value": availableBikesSum,
        "label": label
      });
      hourlyValues.push({
        "key": "total_available_bikes",
        "date": date,
        "value": totalBikesDay,
        "label": label
      });
      hourlyValues.push({
        "key": "bikes_in_motion",
        "date": date,
        "value": totalBikesDay - availableBikesSum,
        "label": label
      });
    } catch (e) {
      console.error("Error in getAllStationsDataYesterdayHourly" + e);
    }

  }

  // console.log("Summary hourly " + JSON.stringify(hourlyValues));
  // console.log("\n\nresponses arr \t" + responses.length);
  if (hourlyValues.length >= 1) {
    res.send(hourlyValues);
  } else {
    res.send("Error fetching data");
  }
};