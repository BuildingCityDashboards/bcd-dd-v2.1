const moment = require('moment');

const getData = async url => {
  const fetch = require("node-fetch");
  try {
    const response = await fetch(url);
    const json = await response.text();
       
    //console.log("\n******\nExample : " + JSON.stringify(json) + "\n******\n");
    //console.log(json);
    return json;

  } catch (error) {
    return console.log(error);
  }
};

/* Station list data format*/
// {
// "st_ADDRESS": "Clarendon Row",
// "st_CONTRACTNAME": "Dublin",
// "st_ID": 1,
// "st_LATITUDE": 53.340927,
// "st_LONGITUDE": -6.262501,
// "st_NAME": "CLARENDON ROW"
//}
// exports.getStationsList
exports.getStationsList = async (req, res, next) => {
  // console.log("\n\n**********Get Stations List******************\n");
  let url = "http://waterlevel.ie/geojson/latest/";
  const response = await getData(url);
  res.send(response);
};


exports.getStationsData = async (req, res, next) => {
    // console.log("\n\n**********Get Stations List******************\n");
    let ts = req.params.ts;
    let url= "http://waterlevel.ie/data/month/"+ts;
    //let url = "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML";
    const response = await getData(url);
    res.send(response);
  };

