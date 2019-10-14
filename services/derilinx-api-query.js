const util = require("util");
const moment = require('moment');
const getDublinBikesData_derilinx = async url => {
  const fetch = require("node-fetch");
  try {
    const response = await fetch(url);
    const json = await response.json();
    // console.log("\n******\nExample Dublin Bikes data from Derilinx: " + JSON.stringify(json[0]) + "\n******\n");
    return json;

  } catch (error) {
    return util.log(error);
  }
};

exports.getAllStationsDataHourly = async (start, end) => {
  util.log(`\n\n\nCall getAllStationsDataHourly from ${start} to ${end}`);
  const e = new moment(end);
  const s = new moment(start);
  const durMs = moment.duration(e.diff(s));
  const durHrs = Math.ceil(durMs / 1000 / 60 / 60);
  util.log("\nQuery duration (hours): " + durHrs);
  let hStart = 3,
    hEnd = durHrs + 2; //hours to gather data for
  let responses = [];
  let summary = [];
  let hourlyValues = [];
  let totalBikesDay = 0; //the total bikes avaiilable taken as the # available before opening hour
  for (let h = hStart; h <= hEnd; h += 1) {
    let startQuery = moment(start).add(h, 'h').format('YYYYMMDDHHmm');
    let endQuery = moment(start).add(h, 'h').add(2, 'm').format('YYYYMMDDHHmm');
    // console.log("\nStart Query: " + startQuery + "\nEnd Query: " + endQuery);
    const url = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
      "dfrom=" +
      startQuery +
      "&dto=" +
      endQuery;
    // console.log("URL - - " + url + "\n")
    try {
      const response = await getDublinBikesData_derilinx(url);
      // console.log("\n\nResponse hour  " + h + "\n" + JSON.stringify(response[0].historic[0]) + "\n");
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
      const date = moment(response[0].historic[0].time);
      const dateLabel = moment(response[0].historic[0].time).format('ha, dddd MMMM Do');
      // console.log("\n\nmoment: " + dateLabel + "\n\n\n");
      let label = dateLabel;

      /* Data formatted for Multiline Chart */
      // hourlyValues.push({
      //   "key": "available_bikes",
      //   "date": date,
      //   "value": availableBikesSum,
      //   "label": label
      // });
      // hourlyValues.push({
      //   "key": "total_available_bikes",
      //   "date": date,
      //   "value": availableBikesSum > totalBikesDay ? availableBikesSum : totalBikesDay,
      //   "label": label
      // });
      // hourlyValues.push({
      //   "key": "bikes_in_motion",
      //   "date": date,
      //   "value": totalBikesDay - availableBikesSum,
      //   "label": label
      // });

      /* Data formatted for StackedAreaChart, (actually not stacking the data) */
      hourlyValues.push({
        "date": date,
        "Bikes in use": (totalBikesDay - availableBikesSum) > 0 ? (totalBikesDay - availableBikesSum) : 0, //// TODO: Fix hack!
        "Bikes available": availableBikesSum,
        "label": label,
        "year": "2019" //if this is a number it gets added to the yAxis domain calc !!!
      });


    } catch (e) {
      util.error("Error in getAllStationsDataHourly" + e);
    }
  }
  return hourlyValues;
};