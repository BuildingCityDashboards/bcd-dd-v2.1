//require('events').EventEmitter.prototype._maxListeners = 200;
//const createError = require('http-errors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require("./utils/logger");
const util = require("util");
require('dotenv').config();
const cron = require("node-cron");
const morgan = require('morgan');
// const sm = require('sitemap');
const moment = require('moment');
const express = require('express');
const app = express();

//const emitter = new EventEmitter()
//emitter.setMaxListeners(200)

// or 0 to turn off the limit
//emitter.setMaxListeners(0)

app.use(express.json());
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


console.log('hj 0022');

//Water Levels Every 15 minutes 
cron.schedule("* */1 * * *", function() {
  //console.log('startin ..');
  var http = require('http');
  var fs = require('fs');
  var file = fs.createWriteStream("./public/data/Environment/waterlevel.json");
  http.get("http://waterlevel.ie/geojson/latest/", function(response) {
    response.pipe(file);
  });
});



cron.schedule("* */2 * * *", function() {

console.log('hrer2');


const FILE_NAME = './public/data/Environment/w_l.json';

//const readFileAsync = () => {
fs.readFile(FILE_NAME, (error, data) => {
    console.log('Async Read: starting...');
    if (error) {
      console.log('Async Read: NOT successful!');
      console.log(error);
    } else {
      try {
        const dataJson = JSON.parse(data);
        console.log('Async Read: successful!');
        //console.log(dataJson);
        //processWaterLevels(dataJson.features);
        console.log('here3');
        let data_=dataJson.features;
        let regionData = data_.filter(function(d) {
    return d.properties["station.region_id"] === null || d.properties["station.region_id"] === 10;
  });

regionData.forEach(function(d,i) {
   let station_ref = d.properties['station.ref'].substring(5, 10);
   let sensor_ref = d.properties['sensor.ref'];
   let fname= station_ref.concat('_',sensor_ref);
   console.log(i + '---'+ fname);
   var fs = require('fs');
   var file = fs.createWriteStream("./public/data/Environment/" + fname + ".csv");
  /*var http = require('http');
   //http://waterlevel.ie/data/month/25017_0001.csv
   http.get("http://waterlevel.ie/data/month/"+fname+ ".csv",
     function(response) {
     response.pipe(file);
})*/

       

  });


        //console.log(dataJson.features);

      } 
      catch (error) {
        console.log(error);
      }
    }
  })

});



//};

//readFileAsync();






//fs.('./public/data/Environment/waterlevel.json')
 // .then(function(data) {
 //   processWaterLevels(data.features);
 // });


function processWaterLevels(data_) {
  //will filter out all data bar Greater Dublin
  let regionData = data_.filter(function(d) {
    return d.properties["station.region_id"] === null   ||
      d.properties["station.region_id"] === 10;
  });


  regionData.forEach(function(d,i) {
    d.lat = d.properties.csv_file;
    console.log( i + '----' + d.lat);


    //d.lng = +d.geometry.coordinates[0];
    //d.type = "OPW GPRS Station Water Level Monitor";

  });
 // waterMapLayerSizes[0] = regionData.length;
  // console.log(regionData);
  //initMapWaterLevels(regionData);
};  




//Weather (from old Dublin Dashboard)










  /*let http = require('http');;;
//  let Dest_f = ['06062_OD','13070_0002','14122_0001','32060_0002','06021_0001','06060_1300',
 // '32060_0003','15004_OD','09001_0001'];
  

  for (let i = 0; i < Dest_f.length; i += 1) {
    let n = i + 1;
    let F_name=Dest_f[i];
    Dest_f[i] = fs.createWriteStream("./public/data/Environment/water_levels/"+ F_name+".csv");
    http.get("http://waterlevel.ie/data/month/" + F_name+ ".csv",
      function(response) {
        response.pipe(Dest_f[i]);
      });
  }
});*/

module.exports = app;