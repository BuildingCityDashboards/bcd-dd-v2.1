let async = require('async');
let BikesStation = require('../models/bikes_station');
// const recordLimit = 10000;
//exports.list_all = function(req, res, next) {
//  console.log("\n\nGenerating query for Dublin Bikes database\n\n");
//  const query = BikesStation.find({}, 'name -_id').limit(5);
//  query.setOptions({
//    lean: true
//  });
//  //query.collection(SmallArea.collection);
//  query.exec(function(err, doc) {
//    if (err) {
//      res.render('api_error', {
//        title: 'API Error'
//      });
//      return next(err);
//    }
//    res.send(doc);
//    console.log("\nStations returned "+doc.length+"\n");
//    
//  });
//}
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