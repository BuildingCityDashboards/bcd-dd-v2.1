let QNQ22 = require('../models/QNQ22'); //

exports.QNQ22_list = function(req, res, next) {
  QNQ22.find()
    .exec(function (err, list) {
      if (err) { return next(err); }
      //Successful, so render
      res.json(list);
    });
    
};

exports.QNQ22_unemployment = function(req, res, next) {
  QNQ22.find({},{ "Persons aged 15 years and over in Employment (Thousand)": 0, "Employment Quarter-On-Quarter % Change": 0, "Employment Year-On-Year % Change": 0 })
  .exec(function (err, list_unemployment) {
    if (err) { return next(err); }
    //Successful, so render
    res.json(list_unemployment);
  });
};

exports.QNQ22_employment = function(req, res, next) {
  QNQ22.find({},{ "date":1, "quarter":1, "region":1,"Persons aged 15 years and over in Employment (Thousand)": 1, "Employment Quarter-On-Quarter % Change": 1, "Employment Year-On-Year % Change": 1 })
  .exec(function (err, list_employment) {
    if (err) { return next(err); }
    //Successful, so render
    res.json(list_employment);
  });
};

exports.economy = function(req, res, next) {
  QNQ22.find({},{"date":1, "quarter":1, "year": 1, "region":1,"Persons aged 15 years and over in Employment (Thousand)": 1, "Employment Quarter-On-Quarter % Change": 1, "Employment Year-On-Year % Change": 1 })
  .exec(function (err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('themes_economy', { title: 'Economy', data: results });
  });
  
};