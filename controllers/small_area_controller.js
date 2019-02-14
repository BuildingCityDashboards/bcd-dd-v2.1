let async = require('async');
let SmallArea = require('../models/small_area');
// const recordLimit = 10000;
exports.list_all = function(req, res, next) {
  
  console.log("\n\nGenerating query for CENSUS database\n\n");
  const query = SmallArea.find({}, 'GEOGID -_id').limit(20);
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);
  query.exec(function(err, doc) {
    if (err) {
        console.debug("API error executing mongoose query");
      res.render('api_error', {
        title: 'API Error'
      });
      return next(err);
    }
    res.send(doc);
  });
}

exports.small_area_data = function(req, res, next) {
  const query = SmallArea.find();
  query.setOptions({
    lean: true
  });
  //query.collection(SmallArea.collection);
  query.where('GEOGID').equals(req.params.id)
    .exec(function(err, doc) {
      if (err) {
        res.render('api_error', {
          title: 'API Error'
        });
        return next(err);

      }
      // if(doc.length>0){
      // res.render('small_area_data', {
      //   title: 'Small Area Data',
      //   sa: req.params.id,
      //   data: doc[0]
      //});
      res.send(doc);
      // }
      // else{
      //     // res.render('small_area_data', {
      //     //   title: 'Small Area Data',
      //     //   sa: req.params.id,
      //     //   data: 'No data found for a Small Area with this GEOGID' });
      //     res.send({});
      //
      // }
    });
}