var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require("./utils/logger");
require('dotenv').config();
var cron = require("node-cron");

var express = require('express');
var app = express();
var morgan = require('morgan');
// logger.debug("Overriding 'Express' logger");
app.use(morgan('combined', {
  "stream": logger.stream
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);

// get routes files
var index = require('./routes/index');
var themes = require('./routes/themes');
var stories = require('./routes/stories');
var tools = require('./routes/tools');
var queries = require('./routes/queries');
var api = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// point to the bootstrap and jquery files
// app.use('/javascripts/vendor/bootstrap/js', express.static(
//   path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
// app.use('/stylesheets/bootstrap/css', express.static(
//   path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
// app.use('/javascripts/vendor/jquery', express.static(
//   path.join(__dirname, 'node_modules', 'jquery', 'dist')));
// app.use('/javascripts/vendor/popper.js', express.static(
//   path.join(__dirname, 'node_modules', 'popper.js', 'dist')));

app.use('/', index);
app.use('/themes', themes);
app.use('/stories', stories);
app.use('/tools', tools);
app.use('/queries', queries);
app.use('/api', api);

////additional fnctionality from node modules
//var noUiSlider = require('nouislider');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // adding winston logging for this error handler
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/************
 Fetching bikes data via API for various time resolutions and spans
 ************/

let bikesSnapshotURL = "http://" + process.env.HOSTNAME + ":" + process.env.PORT + "/api/dublinbikes/stations/snapshot";

let bikesYesterdayURL = "http://" + process.env.HOSTNAME + ":" + process.env.PORT + "/api/dublinbikes/stations/all/yesterday";
let bikesLastDayURL = "http://" + process.env.HOSTNAME + ":" + process.env.PORT + "/api/dublinbikes/stations/all/lastday";
let bikesLastWeekURL = "http://" + process.env.HOSTNAME + ":" + process.env.PORT + "/api/dublinbikes/stations/all/lastweek";
let bikesLastMonthURL = "http://" + process.env.HOSTNAME + ":" + process.env.PORT + "/api/dublinbikes/stations/all/lastmonth";
let bikesLastYearURL = "http://" + process.env.HOSTNAME + ":" + process.env.PORT + "/api/dublinbikes/stations/all/lastyear";

const getDublinBikesData_API = async url => {
  const fetch = require("node-fetch");
  try {
    const response = await fetch(url);
    const json = await response.json();
    // console.log("\n******\nApp - Example Dublin Bikes data from API: [0] " + JSON.stringify(json[0]) + "\n******\n");
    const d = new Date();
    console.log("\n******\nApp - Dublin Bikes fetch success @" + d + "\n******\n");
    return (json);
    // bikesTodayStream.write(JSON.stringify(json, null, 2));
    // bikesTodayStream.end();
  } catch (error) {
    const d = new Date();
    console.log("\n******\nApp - Dublin Bikes fetch fail @" + d + ": " + error + "\n******\n");
  }
};

// let bikesLatest;
// //Fetch snapshot of data and save to file every n minutes
// cron.schedule("*/1 * * * *", async () => {
//   let fs = require('fs');
//   let fileName = "bikesData.json";
//   bikesLatest = fs.createWriteStream("./public/data/Transport/" + fileName);
//   const data = await getDublinBikesData_API(bikesSnapshotURL);
//   bikesLatest.write(JSON.stringify(data, null, 2));
// });

//Fetch snapshot of data and save to file at n minutes past the hour, every hour
let bikesHourly;
cron.schedule("15 */1 * * *", async () => {
  let fs = require('fs');
  let fileName = "bikesData-" + new Date().getHours() + ".json";
  bikesHourly = fs.createWriteStream("./public/data/Transport/bikes_today_hourly/" + fileName);
  const data = await getDublinBikesData_API(bikesSnapshotURL);
  bikesHourly.write(JSON.stringify(data, null, 2));
  bikesHourly.end();
});

//Fetch yesterday's data at granularity of 1 hour at 1.30am every day, and write to file
let bikesYesterday;
cron.schedule("30 2 * * *", function() {
  getBikesYesterdayHourly().catch(() => {
    console.log("Catch!");
  });
});
//This is the working pattern
async function getBikesYesterdayHourly() {
  // console.log("\n\ngetBikesYesterday\n\n\");
  let fs = require('fs');
  let fileName = "dublinbikes-yesterday-hourly.json";
  const data = await getDublinBikesData_API(bikesYesterdayURL);
  bikesYesterday = fs.createWriteStream("./public/data/Transport/bikes_yesterday_hourly/" + fileName);
  bikesYesterday.write(JSON.stringify(data, null, 2));
  bikesYesterday.end();
}

async function getBikesLastDayHourly() {
  // console.log("\n\ngetBikesYesterday\n\n\");
  // let fs = require('fs');
  // let fileName = "dublinbikes-yesterday-hourly.json";
  // const data = await getDublinBikesData_API(bikesYesterdayURL);
  // bikesYesterday = fs.createWriteStream("./public/data/Transport/bikes_yesterday_hourly/" + fileName);
  // bikesYesterday.write(JSON.stringify(data, null, 2));
}

async function getBikesLastWeekHourly() {
  // console.log("\n\ngetBikesYesterday\n\n\");
  // let fs = require('fs');
  // let fileName = "dublinbikes-yesterday-hourly.json";
  // const data = await getDublinBikesData_API(bikesYesterdayURL);
  // bikesYesterday = fs.createWriteStream("./public/data/Transport/bikes_yesterday_hourly/" + fileName);
  // bikesYesterday.write(JSON.stringify(data, null, 2));
}

async function getBikesLastMonthDaily() {
  // console.log("\n\ngetBikesYesterday\n\n\");
  // let fs = require('fs');
  // let fileName = "dublinbikes-yesterday-hourly.json";
  // const data = await getDublinBikesData_API(bikesYesterdayURL);
  // bikesYesterday = fs.createWriteStream("./public/data/Transport/bikes_yesterday_hourly/" + fileName);
  // bikesYesterday.write(JSON.stringify(data, null, 2));
}

getBikesYesterdayHourly().catch(() => {
  console.log("Catch!");
});

/*****************/

if (process.env.PRODUCTION == 1) {
  console.log("\n\n***Dashboard is in production***\n\n");
}

/*TODO: refactor to await/async to remove dupliation*/
cron.schedule("*/1 * * * *", function() {
  let http = require('https');
  let fs = require('fs');
  const fetch = require("node-fetch");
  // let apiStatusDefault = './public/data/api-status-default.json';
  // let apiStatusUpdate = './public/data/api-status.json';
  // let apiStatus = require(apiStatusDefault);
  // //reset file when cron job is run
  // apiStatus.carparks.status = null;
  // apiStatus.dublinbus.status = null;
  // apiStatus.dublinbikes.status = null;
  // apiStatus.luas.status = null;
  // apiStatus.traveltimes.status = null;
  // apiStatus.traveltimesroads.status = null;


  // fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
  //   if (err)
  //     return console.log(">>>Error writing to api-status.json\n" + err);
  // });

  /*** still used for bikes card- @todo use new API for this ****/
  // let bikeFile = fs.createWriteStream("./public/data/Transport/bikesData.json");
  // http.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=" + process.env.BIKES_API_KEY, function(response, error) {
  //   let d = new Date();
  //   if (error) {
  //     return console.log(">>>Error on dublinbikes GET @ " + d + "\n");
  //   }
  //   console.log(">>>Successful dublinbikes GET @ " + d + "\n");
  //   response.pipe(bikeFile);
  //   // const {
  //   //   statusCode
  //   // } = response;
  //   // response.on('end', function() {
  //   //   apiStatus.dublinbikes.status = statusCode;
  //   //   //console.log(JSON.stringify(apiStatus));
  //   //   // fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
  //   //   //   if (err)
  //   //   //     return console.log(">>>Error writing dublinbikes to api-status.json\n" + err);
  //   //   // });
  // });
  // });

  // let carparkFile = fs.createWriteStream("./public/data/Transport/cpdata.xml");
  // http.get("https://www.dublincity.ie/dublintraffic/cpdata.xml", function(response, error) {
  //   if (error) {
  //     return console.log(">>>Error on carparks GET\n");
  //   }
  //   response.pipe(carparkFile);
  //   const {
  //     statusCode
  //   } = response;
  //   response.on('end', function() {
  //     apiStatus.carparks.status = statusCode;
  //     //            console.log(JSON.stringify(apiStatus));
  //
  //     fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
  //       if (err)
  //         return console.error(">>>Error writing carparks to api-status.json\n" + err);
  //     });
  //   });
  // });



  //    let busFile = fs.createWriteStream("./public/data/Transport/bikesData.json");
  //just use an example query here, don't parse
  // http.get("https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=184&format=json", function(response, error) {
  //   if (error) {
  //     return console.log(">>>Error on dublinbus GET\n");
  //   }
  //   const {
  //     statusCode
  //   } = response;
  //   apiStatus.dublinbus.status = statusCode;
  //   fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
  //     if (err)
  //       return console.log(">>>Error writing dublinbus to api-status.json\n" + err);
  //   });
  // });

  //example query used for Luas returns xml, which is not parsed here
  // http.get("https://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop=ran&encrypt=false", function(response, error) {
  //   if (error) {
  //     return console.log(">>>Error on luas GET\n");
  //   }
  //   const {
  //     statusCode
  //   } = response;
  //   apiStatus.luas.status = statusCode;
  //   fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
  //     if (err)
  //       return console.log(">>>Error writing luas to api-status.json\n" + err);
  //   });
  // });
  //
  let travelTimesFile = fs.createWriteStream("./public/data/Transport/traveltimes.json");
  http.get("https://dataproxy.mtcc.ie/v1.5/api/traveltimes", function(response, error) {
    let d = new Date();
    if (error) {
      return console.log(">>>Error on traveltimes GET @ " + d + "\n");
    }
    console.log(">>>Successful traveltimes GET @ " + d + "\n");
    response.pipe(travelTimesFile);
    //   // const {
    //   //   statusCode
    //   // } = response;
    //   // response.on('end', function() {
    //   //   apiStatus.traveltimes.status = statusCode;
    //   //   //            console.log(JSON.stringify(apiStatus));
    //   //   fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
    //   //     if (err)
    //   //       return console.log(">>>Error writing traveltimes to api-status.json\n" + err);
    //   //   });
    //   // });
  });


  let travelTimesRoadsFile = fs.createWriteStream("./public/data/Transport/traveltimesroad.json");
  http.get("https://dataproxy.mtcc.ie/v1.5/api/fs/traveltimesroad", function(response, error) {
    if (error) {
      return console.log(">>>Error on traveltimesroads GET\n");
    }
    response.pipe(travelTimesRoadsFile);
    //     const {
    //       statusCode
    //     } = response;
    //     response.on('end', function() {
    //       apiStatus.traveltimesroads.status = statusCode;
    //       //            console.log(JSON.stringify(apiStatus));
    //       fs.writeFile(apiStatusUpdate, JSON.stringify(apiStatus, null, 2), function(err) {
    //         if (err)
    //           return console.log(">>>Error writing traveltimesroads to api-status.json\n" + err);
    //       });
    //     });
  });
});

//Water Levels
cron.schedule("*/15 * * * *", function() {
  var http = require('http');
  var fs = require('fs');
  var file = fs.createWriteStream("./public/data/Environment/waterlevel.json");
  http.get("http://waterlevel.ie/geojson/latest/", function(response) {
    response.pipe(file);
  });
});

//Weather (from old Dublin Dashboard)
cron.schedule("*/5 * * * *", function() {
  let http = require('https');
  let fs = require('fs');
  let file = fs.createWriteStream("./public/data/Environment/met_eireann_forecast.xml");
  http.get("https://dublindashboard.ie/met_eireann_forecast.xml", function(response) {
    response.pipe(file);
  });
});


//Sound level readings
cron.schedule("*/15 * * * *", function() {
  let http = require('https');;
  let fs = require('fs');;
  let files = [];
  for (let i = 0; i < 15; i += 1) {
    let n = i + 1;
    files[i] = fs.createWriteStream("./public/data/Environment/sound_levels/sound_reading_" + n + ".json");
    http.get("https://dublincitynoise.sonitussystems.com/applications/api/dublinnoisedata.php?location=" + n,
      function(response) {
        response.pipe(files[i]);
      });
  }
});

let hour = new Date().getHours();
let min = new Date().getMinutes().toString().padStart(2, '0');
console.log("\n\nDublin Dashboard Beta App started at " + hour + ":" + min + "\n\n");

module.exports = app;