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
  //moment representing 3 am (when bikes in use should be 0)
  const threeAM = moment(new moment(e).startOf('day')).add(3, 'h');
  const durMs = moment.duration(e.diff(s));
  const threeAMDiffMs = moment.duration(e.diff(threeAM));
  if (threeAMDiffMs < 0) {
    threeAMDiffMs = 0;
  }
  const durHrs = Math.ceil(durMs / 1000 / 60 / 60);
  const threeAmDiffHrs = Math.ceil(threeAMDiffMs / 1000 / 60 / 60);

  //util.log("\nQuery duration (hours): " + durHrs);
  // no offset to hstart necessary
  let hStart = 0,
    hEnd = durHrs + 2; //hours to gather data for
  let responses = [];
  let summary = [];
  let hourlyValues = [];
  //the total bikes avaiilable taken as the # available before opening hour
  //pre-call the dublinbikes api at 3 am on the day of the end query to get total bikes
  let totalBikesDay = 0;
  let preStartQuery = moment(end).subtract(threeAmDiffHrs, 'h').format('YYYYMMDDHHmm');
  let preEndQuery = moment(end).subtract(threeAmDiffHrs, 'h').add(2, 'm').format('YYYYMMDDHHmm');
  const preUrl = "https://dublinbikes.staging.derilinx.com/api/v1/resources/historical/?" +
      "dfrom=" +
      preStartQuery +
      "&dto=" +
      preEndQuery;
  try {
    const response = await getDublinBikesData_derilinx(preUrl);
    response.forEach(prer => {
      totalBikesDay += prer.historic[0].available_bikes;
    });
  } catch (e) {
    util.error("Error in getAllStationsDataHourly preQuery" + e);
  } 
  for (let h = hStart; h <= hEnd; h += 1) {
    let startQuery = moment(start).add(h, 'h').format('YYYYMMDDHHmm');
    let endQuery = moment(start).add(h, 'h').add(2, 'm').format('YYYYMMDDHHmm');
    //console.log("\nStart Query: " + startQuery + "\nEnd Query: " + endQuery);
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
      //this only works if chron is scheduled in the middle of the night when no bikes should be in use
      //if (h == hStart) {
      //  totalBikesDay = availableBikesSum;
      //}

      //this converts to user's local time - no good if not in Dublin
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