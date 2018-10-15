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

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoCensusDB = process.env.CUSTOMCONNSTR_CENSUS_DATABASE_URL;
var mongoDB = process.env.CUSTOMCONNSTR_MONGODB_URI;

mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.connect(mongoCensusDB,{ useNewUrlParser: true });

mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('connected', function(){console.log("Connected to Census Mongoose DB");});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

logger.debug("Overriding 'Express' logger");
app.use(morgan('combined', {"stream": logger.stream}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
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
app.use('/api/themes', themes);

////additional fnctionality from node modules
//var noUiSlider = require('nouislider');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
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
//Car parks and bikes
cron.schedule("*/2 * * * *", function () {
    let http = require('https');
    let fs = require('fs');
    let carparkFile = fs.createWriteStream("./public/data/Transport/cpdata.xml");
    http.get("https://www.dublincity.ie/dublintraffic/cpdata.xml", function (response) {
        response.pipe(carparkFile);
    });
    let bikeFile = fs.createWriteStream("./public/data/Transport/bikesData.json");
    http.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey="+process.env.BIKES_API_KEY, function (response) {
        response.pipe(bikeFile);
    });
});

cron.schedule("*/15 * * * *", function () {
    var http = require('http');
    var fs = require('fs');
    var file = fs.createWriteStream("./public/data/Environment/waterlevel.json");
    var request = http.get("http://waterlevel.ie/geojson/latest/", function (response) {
        response.pipe(file);
    });
});

//Weather (from old Dublin Dashboard)
cron.schedule("*/5 * * * *", function () {
    let http = require('http');
    let fs = require('fs');
    let file = fs.createWriteStream("./public/data/Environment/met_eireann_forecast.xml");
    let request = http.get("http://dublindashboard.ie/met_eireann_forecast.xml", function (response) {
        response.pipe(file);
    });
});


//Sound level readings
cron.schedule("*/15 * * * *", function () {
    let http = require('http');
    ;
    let fs = require('fs');
    ;
    let files = [];
    for (let i = 0; i < 15; i += 1) {
        let n = i + 1;
        files[i] = fs.createWriteStream("./public/data/Environment/sound_levels/sound_reading_" + n + ".json");
        http.get("http://dublincitynoise.sonitussystems.com/applications/api/dublinnoisedata.php?location=" + n,
                function (response) {
                    response.pipe(files[i]);
                });
    }
});


module.exports = app;
