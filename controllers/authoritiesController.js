var Authorities = require('../models/localAuthorities'); //

exports.authorities_list = function(req, res, next) {
  Authorities.find()
    .exec(function (err, list_locals) {
      if (err) { return next(err); }
      //Successful, so render
      res.json(list_locals);
    });
    
};

exports.authorities_county = function(req, res, next) {
  Authorities.find({'properties.COUNTY': req.params.id})
    .exec(function (err, list_dublin) {
      if (err) { return next(err); }
      //Successful, so render
      res.json(list_dublin);
    });
    
};