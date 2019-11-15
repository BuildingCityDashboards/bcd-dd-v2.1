var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("./public/data/Transport/cpdata.xml");
var request = https.get("https://www.dublincity.ie/dublintraffic/cpdata.xml", function(response) {
  response.pipe(file);
});

// should add some error handling and turn this into a function