var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var logger = require("./utils/logger");
require('dotenv').config();

var cron = require("node-cron");

// get routes files
var index = require('./routes/index');
var themes = require('./routes/themes');
var stories = require('./routes/stories');
var tools = require('./routes/tools');
var queries = require('./routes/queries');
var api = require('./routes/api');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoCensusDB = process.env.CENSUS_DB_URL;
// var mongoDB = process.env.CUSTOMCONNSTR_MONGODB_URI;

// mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.connect(mongoCensusDB, {
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('connected', function() {
  console.log("Connected to Census MongoDB");
});
db.on('error', console.error.bind(console, 'Census MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

logger.debug("Overriding 'Express' logger");
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

// point to the bootstrap and jquery files
app.use('/javascripts/vendor/bootstrap/js', express.static(
  path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/stylesheets/bootstrap/css', express.static(
  path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/javascripts/vendor/jquery', express.static(
  path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/javascripts/vendor/popper.js', express.static(
  path.join(__dirname, 'node_modules', 'popper.js', 'dist')));

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

/***TODO: Archive to db***/

//Car parks, traveltimes and bikes

/*TODO: refactor to await/async to remove dupliation*/
cron.schedule("*/1 * * * *", function() {
  let http = require('https');
  let fs = require('fs');

  let apiStatusFile = './public/data/api-status.json';
  let apiStatus = require(apiStatusFile);
  //reset file when cron job is run
  apiStatus.carparks.status = null;
  apiStatus.dublinbus.status = null;
  apiStatus.dublinbikes.status = null;
  apiStatus.luas.status = null;
  apiStatus.traveltimes.status = null;
  apiStatus.traveltimesroads.status = null;
  fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
    if (err)
      return console.log(">>>Error writing to api-status.json\n" + err);

  });

  let carparkFile = fs.createWriteStream("./public/data/Transport/cpdata.xml");
  http.get("https://www.dublincity.ie/dublintraffic/cpdata.xml", function(response, error) {
    if (error) {
      return console.log(">>>Error on carparks GET\n");
    }
    response.pipe(carparkFile);
    const {
      statusCode
    } = response;
    response.on('end', function() {
      apiStatus.carparks.status = statusCode;
      console.log(JSON.stringify(apiStatus));

      fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
        if (err)
          return console.log(">>>Error writing carparks to api-status.json\n" + err);

      });
    });
  });

  let bikeFile = fs.createWriteStream("./public/data/Transport/bikesData.json");
  http.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=" + process.env.BIKES_API_KEY, function(response, error) {
    if (error) {
      return console.log(">>>Error on dublinbikes GET\n");
    }
    response.pipe(bikeFile);

    const {
      statusCode
    } = response;
    response.on('end', function() {
      apiStatus.dublinbikes.status = statusCode;
      console.log(JSON.stringify(apiStatus));

      fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
        if (err)
          return console.log(">>>Error writing dublinbikes to api-status.json\n" + err);
      });

    });

  });

  //    let busFile = fs.createWriteStream("./public/data/Transport/bikesData.json");
  //just use an example query here, don't parse
  http.get("https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=184&format=json", function(response, error) {
    if (error) {
      return console.log(">>>Error on dublinbus GET\n");
    }
    const {
      statusCode
    } = response;
    apiStatus.dublinbus.status = statusCode;
    fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
      if (err)
        return console.log(">>>Error writing dublinbus to api-status.json\n" + err);
    });


  });

  //example query used for Luas returns xml, which is not parsed here
  http.get("https://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop=ran&encrypt=false", function(response, error) {
    if (error) {
      return console.log(">>>Error on luas GET\n");
    }
    const {
      statusCode
    } = response;
    apiStatus.luas.status = statusCode;
    fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
      if (err)
        return console.log(">>>Error writing luas to api-status.json\n" + err);
    });

  });

  let travelTimesFile = fs.createWriteStream("./public/data/Transport/traveltimes.json");
  http.get("https://dataproxy.mtcc.ie/v1.5/api/traveltimes", function(response, error) {
    if (error) {
      return console.log(">>>Error on traveltimes GET\n");
    }

    response.pipe(travelTimesFile);

    const {
      statusCode
    } = response;
    response.on('end', function() {
      apiStatus.traveltimes.status = statusCode;
      console.log(JSON.stringify(apiStatus));

      fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
        if (err)
          return console.log(">>>Error writing traveltimes to api-status.json\n" + err);
      });
    });

  });
  let travelTimesRoadsFile = fs.createWriteStream("./public/data/Transport/traveltimesroad.json");
  http.get("https://dataproxy.mtcc.ie/v1.5/api/fs/traveltimesroad", function(response, error) {
    if (error) {
      return console.log(">>>Error on traveltimesroads GET\n");
    }

    response.pipe(travelTimesRoadsFile);

    const {
      statusCode
    } = response;
    response.on('end', function() {
      apiStatus.traveltimesroads.status = statusCode;
      console.log(JSON.stringify(apiStatus));

      fs.writeFile(apiStatusFile, JSON.stringify(apiStatus, null, 2), function(err) {
        if (err)
          return console.log(">>>Error writing traveltimesroads to api-status.json\n" + err);
      });
    });
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
  let http = require('http');
  let fs = require('fs');
  let file = fs.createWriteStream("./public/data/Environment/met_eireann_forecast.xml");
  http.get("http://dublindashboard.ie/met_eireann_forecast.xml", function(response) {
    response.pipe(file);
  });
});


//Sound level readings
cron.schedule("*/15 * * * *", function() {
  let http = require('http');;
  let fs = require('fs');;
  let files = [];
  for (let i = 0; i < 15; i += 1) {
    let n = i + 1;
    files[i] = fs.createWriteStream("./public/data/Environment/sound_levels/sound_reading_" + n + ".json");
    http.get("http://dublincitynoise.sonitussystems.com/applications/api/dublinnoisedata.php?location=" + n,
      function(response) {
        response.pipe(files[i]);
      });
  }
});

module.exports = app;