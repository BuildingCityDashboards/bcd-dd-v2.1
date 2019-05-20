const express = require('express');
const router = express.Router({
  mergeParams: true
});

router.get('/', function(req, res, next) {
  res.render('api');
});

//var census2016Controller = require('../controllers/census2016');
//// router.get('/census2016/smallareas/count', census2016Controller.countAllSAs);
//router.get('/census2016/smallareas/list', census2016Controller.listAllSAGGEOGIDs);
//router.get('/census2016/smallareas/example', census2016Controller.getSAExample);
//router.get('/census2016/smallareas/:GEOGID', census2016Controller.getSAData);

var dublinBikesController = require('../controllers/dublinbikes_derilinx');


router.get('/dublinbikes/stations/list', dublinBikesController.getStationsList);
router.get('/dublinbikes/stations/snapshot', dublinBikesController.getStationsSnapshot);
// router.get('/dublinbikes/stations/example', dublinBikesController.getStationExample);
// router.get('/dublinbikes/stations/:number', dublinBikesController.getStationData);
// router.get('/dublinbikes/stations/:number/today', dublinBikesController.getStationDataToday);

module.exports = router;
//
// 2019 - 05 - 20 T08: 57: 24.916189372 Z {
//   "error": {},
//   "level": "error",
//   "message": "uncaughtException: Route.get() requires a callback function but got a [object Undefined]\nError: Route.get() requires a callback function but got a [object Undefined]\n    at Route.(anonymous function) [as get] (/node_modules/express/lib/router/route.js:202:15)\n    at Function.proto.(anonymous function) [as get] (/node_modules/express/lib/router/index.js:510:19)\n    at Object. (/home/site/wwwroot/routes/api.js:17:8)\n    at Module._compile (internal/modules/cjs/loader.js:689:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\n    at Module.load (internal/modules/cjs/loader.js:599:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)\n    at Module.require (internal/modules/cjs/loader.js:637:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at Object. (/home/site/wwwroot/app.js:16:11)\n    at Module._compile (internal/modules/cjs/loader.js:689:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\n    at Module.load (internal/modules/cjs/loader.js:599:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)",
//   "stack": "Error: Route.get() requires a callback function but got a [object Undefined]\n    at Route.(anonymous function) [as get] (/node_modules/express/lib/router/route.js:202:15)\n    at Function.proto.(anonymous function) [as get] (/node_modules/express/lib/router/index.js:510:19)\n    at Object. (/home/site/wwwroot/routes/api.js:17:8)\n    at Module._compile (internal/modules/cjs/loader.js:689:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\n    at Module.load (internal/modules/cjs/loader.js:599:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)\n    at Module.require (internal/modules/cjs/loader.js:637:17)\n    at require (internal/modules/cjs/helpers.js:20:18)\n    at Object. (/home/site/wwwroot/app.js:16:11)\n    at Module._compile (internal/modules/cjs/loader.js:689:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\n    at Module.load (internal/modules/cjs/loader.js:599:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)",
//   "exception": true,
//   "date": "Mon May 20 2019 08:57:24 GMT+0000 (Coordinated Universal Time)",
//   "process": {
//     "pid": 51,
//     "uid": 0,
//     "gid": 0,
//     "cwd": "/home/site/wwwroot",
//     "execPath": "/usr/local/bin/node",
//     "version": "v10.10.0",
//     "argv": ["/usr/local/bin/node", "/home/site/wwwroot/bin/www"],
//     "memoryUsage": {
//       "rss": 59330560,
//       "heapTotal": 34324480,
//       "heapUsed": 19609456,
//       "external": 19601515
//     }
//   },
//   "os": {
//     "loadavg": [1.91162109375, 1.26904296875, 0.76025390625],
//     "uptime": 52438
//   },
//   "trace": [{
//     "column": 15,
//     "file": "/node_modules/express/lib/router/route.js",
//     "function": "Route.(anonymous function) [as get]",
//     "line": 202,
//     "method": "(anonymous function) [as get]",
//     "native": false
//   }, {
//     "column": 19,
//     "file": "/node_modules/express/lib/router/index.js",
//     "function": "Function.proto.(anonymous function) [as get]",
//     "line": 510,
//     "method": "(anonymous function) [as get]",
//     "native": false
//   }, {
//     "column": 8,
//     "file": "/home/site/wwwroot/routes/api.js",
//     "function": null,
//     "line": 17,
//     "method": null,
//     "native": false
//   }, {
//     "column": 30,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module._compile",
//     "line": 689,
//     "method": "_compile",
//     "native": false
//   }, {
//     "column": 10,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module._extensions..js",
//     "line": 700,
//     "method": ".js",
//     "native": false
//   }, {
//     "column": 32,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module.load",
//     "line": 599,
//     "method": "load",
//     "native": false
//   }, {
//     "column": 12,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "tryModuleLoad",
//     "line": 538,
//     "method": null,
//     "native": false
//   }, {
//     "column": 3,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module._load",
//     "line": 530,
//     "method": "_load",
//     "native": false
//   }, {
//     "column": 17,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module.require",
//     "line": 637,
//     "method": "require",
//     "native": false
//   }, {
//     "column": 18,
//     "file": "internal/modules/cjs/helpers.js",
//     "function": "require",
//     "line": 20,
//     "method": null,
//     "native": false
//   }, {
//     "column": 11,
//     "file": "/home/site/wwwroot/app.js",
//     "function": null,
//     "line": 16,
//     "method": null,
//     "native": false
//   }, {
//     "column": 30,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module._compile",
//     "line": 689,
//     "method": "_compile",
//     "native": false
//   }, {
//     "column": 10,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module._extensions..js",
//     "line": 700,
//     "method": ".js",
//     "native": false
//   }, {
//     "column": 32,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module.load",
//     "line": 599,
//     "method": "load",
//     "native": false
//   }, {
//     "column": 12,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "tryModuleLoad",
//     "line": 538,
//     "method": null,
//     "native": false
//   }, {
//     "column": 3,
//     "file": "internal/modules/cjs/loader.js",
//     "function": "Module._load",
//     "line": 530,
//     "method": "_load",
//     "native": false
//   }]
// }