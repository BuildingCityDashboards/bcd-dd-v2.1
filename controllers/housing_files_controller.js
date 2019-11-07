let async = require('async');
var fs = require('fs');
//let SmallArea = require('../models/small_area');
// const recordLimit = 10000;
exports.list_files = function(req, res, next) {
  // console.log("housing controller test:"+req);
  // if (process.argv.length <= 2) {
  //   console.log("Usage: " + __filename + " path/to/directory");
  //   process.exit(-1);
  // }
  //
  // var path = process.argv[2];
  const {
    method,
    url
  } = req;


  fs.readdir('./data/Housing', function(err, items) {
    console.log("***************" + url);
    console.log("****************" + items);
    // res.send("***************Housing file list: " + url + '\n' + items);

    // for (var i = 0; i < items.length; i++) {
    //   console.log(items[i]);
    // }
    res.send("Housing file list: ");
  });



  // res.send("Housing file list: " + url);

}