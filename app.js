const createError = require('http-errors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require("./utils/logger");
const util = require("util");
require('dotenv').config();
const cors = require('cors')
const cron = require("node-cron");
const morgan = require('morgan');
// const sm = require('sitemap');
const moment = require('moment');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors()); // Use this after the variable declaration
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// console.log(__dirname);
// logger.debug("Overriding 'Express' logger");
app.use(morgan('combined', {
  "stream": logger.stream
}));

// get routes files
const index = require('./routes/index');
const themes = require('./routes/themes');
const stories = require('./routes/stories');
const tools = require('./routes/tools');
const queries = require('./routes/queries');
const portal = require('./routes/portal');
const api = require('./routes/api');

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
//https: //github.com/LiamOSullivan/bcd-dd-v2.git// app.use('/javascripts/vendor/popper.js', express.static(
//   path.join(__dirname, 'node_modules', 'popper.js', 'dist')));

app.use('/', index);
app.use('/themes', themes);
app.use('/stories', stories);
app.use('/tools', tools);
app.use('/queries', queries);
app.use('/portal', portal);
app.use('/api', api);

////additional functionality from node modules

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next((404));
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


let hour = new Date().getHours();
let min = new Date().getMinutes().toString().padStart(2, '0');
util.log("\n\nDublin Dashboard Beta App started at " + hour + ":" + min + "\n\n");

if (app.get('env') === 'development') {
  util.log("\n\n***Dashboard is in dev***\n\n");
}

/************
 Fetching dublin bikes data via Derilinx API for various time resolutions and spans
 ************/
let bikesQuery = require("./services/derilinx-api-query.js");

//Every night at 3.45 am
cron.schedule('45 3 * * *', () => {
  util.log(`\n\nRunning bikes cron\n\n`);

  //Generating date queries to GET each night in cron
  const yesterdayStart = moment.utc().subtract(1, 'days').startOf('day');
  const yesterdayEnd = moment.utc().subtract(1, 'days').endOf('day');
  const weekStart = moment.utc().subtract(1, 'weeks').startOf('day');
  const monthStart = moment.utc().subtract(1, 'months').startOf('day');
// call a function getAllStationsDataHourly from bikesQuaery 
  bikesQuery.getAllStationsDataHourly(yesterdayStart, yesterdayEnd)
    .then((data) => {
      if (data.length >= 1) {
        const e = new moment(yesterdayEnd);
        const s = new moment(yesterdayStart);
        const durMs = moment.duration(e.diff(s));
        const durHrs = Math.ceil(durMs / 1000 / 60 / 60);
        // util.log("\nQuery duration (hours): " + durHrs);
        const filePath = path.normalize("./public/data/Transport/dublinbikes/");
        const fileName = `day.json`;
        const fullPath = path.join(filePath, fileName);
        fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
          if (!err) {
            util.log(`\nFS File Write finished ${fullPath}\n`);
          }
        });
      } else {
        // res.send("Error fetching data");
        util.log("\nWrite to file error: " + err);
      }

    })
    .catch((err) => {
      util.log("\n\n Handling errror " + err);
    });

  bikesQuery.getAllStationsDataHourly(weekStart, yesterdayEnd)
    .then((data) => {
      if (data.length >= 1) {
        const e = new moment(weekStart);
        const s = new moment(yesterdayEnd);
        const durMs = moment.duration(e.diff(s));
        const durHrs = Math.ceil(durMs / 1000 / 60 / 60);
        // util.log("\nQuery duration (hours): " + durHrs);
        const filePath = path.normalize("./public/data/Transport/dublinbikes/");
        const fileName = `week.json`;
        const fullPath = path.join(filePath, fileName);
        fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
          if (!err) {
            util.log(`\nFS File Write finished ${fullPath}\n`);
          }
        });
      } else {
        // res.send("Error fetching data");
        util.log("\nWrite to file error: " + err);
      }

    })
    .catch((err) => {
      util.log("\n\n Handling errror " + err);
    });

  bikesQuery.getAllStationsDataHourly(monthStart, yesterdayEnd)
    .then((data) => {
      if (data.length >= 1) {
        const e = new moment(monthStart);
        const s = new moment(yesterdayEnd);
        const durMs = moment.duration(e.diff(s));
        const durHrs = Math.ceil(durMs / 1000 / 60 / 60);
        // util.log("\nQuery duration (hours): " + durHrs);
        const filePath = path.normalize("./public/data/Transport/dublinbikes/");
        const fileName = `month.json`;
        const fullPath = path.join(filePath, fileName);
        fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
          if (!err) {
            util.log(`\nFS File Write finished ${fullPath}\n`);
          }
        });
      } else {
        // res.send("Error fetching data");
        util.log("\nWrite to file error: " + err);
      }

    })
    .catch((err) => {
      util.log("\n\n Handling errror " + err);
    });
});

/*TODO: refactor to await/async to remove dupliation*/
cron.schedule("*/1 * * * *", function() {
  let http = require('https');
  const fetch = require("node-fetch");
  let travelTimesFile = fs.createWriteStream("./public/data/Transport/traveltimes.json");
  http.get("https://dataproxy.mtcc.ie/v1.5/api/traveltimes", function(response, error) {
    let d = new Date();
    if (error) {
      return util.log(">>>Error on traveltimes GET @ " + d + "\n");
    }
    // console.log(">>>Successful traveltimes GET @ " + d + "\n");
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
      return util.log(">>>Error on traveltimesroads GET\n");
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
  let file = fs.createWriteStream("./public/data/Environment/met_eireann_forecast.xml");
  http.get("https://dublindashboard.ie/met_eireann_forecast.xml", function(response) {
    response.pipe(file);
  });
});

//Sound level readings
cron.schedule("*/15 * * * *", function() {
  let http = require('https');;;
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
//get train data from the API evey minute 
cron.schedule("*/1 * * * *", function() {
  var http = require('http');
  var fs = require('fs');
  var file = fs.createWriteStream("./public/data/Transport/Train_data.xml");
  http.get("http://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=A", function(response) {
    response.pipe(file);
  });
});

const readFileAsync = () => {
const FILE_NAME = './public/data/Environment/waterlevel.json';
fs.readFile(FILE_NAME, (error, data) => {
    //console.log('Async Read: starting...');
    if (error) {
     // console.log('Async Read: NOT successful!');
      console.log(error);
    } else {
      try {
        const dataJson = JSON.parse(data);
        //console.log('Async Read: successful!');
        //console.log(dataJson);
        //processWaterLevels(dataJson.features);
        //console.log('here3');
        let data_=dataJson.features;
        let regionData = data_.filter(function(d) {
    return d.properties["station.region_id"] === null || d.properties["station.region_id"] === 10;
  });

regionData.forEach(function(d,i) {
   let station_ref = d.properties['station.ref'].substring(5, 10);
   let sensor_ref = d.properties['sensor.ref'];
   let fname= station_ref.concat('_',sensor_ref);
   //console.log(i + '---'+ fname);
   var fs = require('fs');
   var file = fs.createWriteStream("./public/data/Environment/water_levels/" + fname + ".csv");
   var http = require('http');
   //http://waterlevel.ie/data/month/25017_0001.csv
   http.get("http://waterlevel.ie/data/month/"+fname+ ".csv",
     function(response) {
     response.pipe(file);
})
 
  });

      } 
      catch (error) {
        console.log(error);
      }
    }
  });
};
readFileAsync();

module.exports = app;