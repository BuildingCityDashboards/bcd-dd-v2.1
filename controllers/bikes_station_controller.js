let async = require('async');
let BikesStationModel = require('../models/bikes_station');
exports.test = function(req, res, next) {
  console.log("\n\nTest Dublin Bikes database: ");
  // + JSON.stringify(req.node) + "\n\n");
  db.stats();
  res.send("Results");
}
// const recordLimit = 10000;
exports.list_all_stations = function(req, res, next) {
  console.log("\n\nGenerating query for Dublin Bikes database\n\n");
  const bikesQuery = BikesStationModel.find().limit(20);
  // bikesQuery.setOptions({
  //   lean: true
  // });
  bikesQuery.collection('stations');
  bikesQuery.exec(function(err, doc) {
    if (err) {
      console.log("Error on query to Dublin Bikes DB");
      res.render('api_error', {
        title: 'API Error'
      });
      return next(err);
    }
    res.send(doc);
    console.log("\nStations returned " + doc.length + "\n");

  });
}
//
//exports.bikes_station_data = function(req, res, next) {
//  const query = BikesStation.find();
//  query.setOptions({
//    lean: true
//  });
//  //query.collection(SmallArea.collection);
//  query.where('name').equals(req.params.name)
//    .exec(function(err, doc) {
//        console.log("\n\nGenerating query for Dublin Bikes station "+req.params.name+"\n\n");
//      if (err) {
//        res.render('api_error', {
//          title: 'API Error'
//        });
//        return next(err);
//
//      }
//      // if(doc.length>0){
//      // res.render('small_area_data', {
//      //   title: 'Small Area Data',
//      //   sa: req.params.id,
//      //   data: doc[0]
//      //});
//      res.send(doc);
//      // }
//      // else{
//      //     // res.render('small_area_data', {
//      //     //   title: 'Small Area Data',
//      //     //   sa: req.params.id,
//      //     //   data: 'No data found for a Small Area with this GEOGID' });
//      //     res.send({});
//      //
//      // }
//    });
//}