/*TODO:
 *
 * Check if passing a subset of data increases memory usage e.g. data.properties sent to updateMap
 * Only use a processing fucntion with a text data file (not json)
 *
 * Test support for DOM node methods on Firefox
 */


/************************************
 * Settings/ Options
 ************************************/
let bikeClusterToggle = true,
  busClusterToggle = true,
  luasClusterToggle = false,
  carparkClusterToggle = true;

zoom = 11; //zoom on page load
maxZoom = 15;
let gettingAroundOSM = new L.TileLayer(stamenTonerUrl_Lite, {
  minZoom: 10,
  maxZoom: maxZoom, //seems to fix 503 tileserver errors
  attribution: stamenTonerAttrib
});

let gettingAroundMap = new L.Map('getting-around-map');
gettingAroundMap.setView(new L.LatLng(dubLat, dubLng), zoom);
gettingAroundMap.addLayer(gettingAroundOSM);
let markerRefPublic; //TODO: fix horrible hack!!!
gettingAroundMap.on('popupopen', function(e) {
  markerRefPublic = e.popup._source;
  //console.log("ref: "+JSON.stringify(e));
});

// add location control to global name space for testing only
// on a production site, omit the "lc = "!
L.control.locate({
  strings: {
    title: "Zoom to near your location"
  }
}).addTo(gettingAroundMap);

let southWest = L.latLng(52.9754658325, -6.8639598864),
  northEast = L.latLng(53.7009607624, -5.9835178395),
  dublinBounds = L.latLngBounds(southWest, northEast); //greater Dublin & surrounds

var osmGeocoder = new L.Control.OSMGeocoder({
  placeholder: 'Enter street/area name etc.',
  bounds: dublinBounds
});
gettingAroundMap.addControl(osmGeocoder);

/************************************
 * Bikes
 ************************************/
let bikeCluster = L.markerClusterGroup({
  //   spiderfyOnMaxZoom: false,
  //   showCoverageOnHover: false,
  //   zoomToBoundsOnClick: false
  //   // maxZoom: 14,
  //   // zoomOnClick: false
  disableClusteringAtZoom: 15,
  spiderfyOnMaxZoom: false
  //   // singleMarkerMode: true
  //   // maxClusterRadius: 100,
  //   // iconCreateFunction: function(cluster) {
  //   //   return L.divIcon({
  //   //     html: '<b>' + cluster.getChildCount() + '</b>'
  //   //   });
  //   // }
});

var testMarkers = L.markerClusterGroup({
  spiderfyOnMaxZoom: false,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: false
});

let dublinBikeMapIcon = L.icon({
  iconUrl: '/images/transport/bicycle-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

d3.json("/data/Transport/bikesData.json").then(function(data) {
  //console.log(data[0]);
  processBikes(data);
});
/* TODO: performance- move to _each in updateMap */
function processBikes(data_) {

  //console.log("Bike data \n");
  data_.forEach(function(d) {
    d.lat = +d.position.lat;
    d.lng = +d.position.lng;
    //add a property to act as key for filtering
    d.type = "Dublin Bike Station";
  });
  //    console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
  //    console.log("# of bike stations is " + data_.length + "\n"); // +
  updateMapBikes(data_);
};

function updateMapBikes(data__) {
  //bikeCluster.clearLayers();
  gettingAroundMap.removeLayer(bikeCluster);
  let ageMax = 0; //used to find oldest data in set and check if API has recently returned valid data
  /*TODO: note impact on page load performance*/
  _.each(data__, function(d, i) {
    if (ageMax < Date.now() - d.last_update) {
      ageMax = Date.now() - d.last_update;
    }
    bikeCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {
        icon: dublinBikeMapIcon
      })
      .bindPopup(getBikeContent(d)));
  });
  //console.log("Age Max: " + ageMax);
  if (ageMax < (1000 * 60 * 15)) {
    d3.select('#bike-age')
      .text(Math.floor(ageMax / 60000) + " mins ago");
  }
  gettingAroundMap.addLayer(bikeCluster);
}

let bikeTime = d3.timeFormat("%a %B %d, %H:%M");

function getBikeContent(d_) {
  let str = '';
  if (d_.name) {
    str += d_.name + '<br>';
  }
  if (d_.type) {
    str += d_.type + '<br>';
  }
  //    if (d_.address && d_.address !== d_.name) {
  //        str += d_.address + '<br>';
  //    }
  if (d_.available_bikes) {
    str += '<br><b>' + d_.available_bikes + '</b>' + ' bikes are available<br>';
  }
  if (d_.available_bike_stands) {
    str += '<b>' + d_.available_bike_stands + '</b>' + ' stands are available<br>';
  }
  if (d_.last_update) {
    let updateTime = bikeTime(new Date(d_.last_update));
    str += '<br>Last updated ' + updateTime + '<br>';

  }
  return str;
}

/************************************
 * Bus Stops
 ************************************/
let busCluster = L.markerClusterGroup();
let dublinBusMapIcon = L.icon({
  iconUrl: '/images/transport/bus-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

d3.json("/data/Transport/busstopinformation_bac.json").then(function(data) {
  //    console.log("data.results[0]" + JSON.stringify(data.results[0]));
  processBusStops(data.results); //TODO: bottleneck?
});


function processBusStops(res_) {
  //    console.log("Bus data \n");
  res_.forEach(function(d) {
    d.lat = +d.latitude;
    d.lng = +d.longitude;
    //add a property to act as key for filtering
    d.type = "Dublin Bus Stop";

  });
  //    console.log("Bus Stop: \n" + JSON.stringify(res_[0]));
  //    console.log("# of bus stops is " + res_.length + "\n"); // +
  updateMapBuses(res_);
};

function updateMapBuses(data__) {
  busCluster.clearLayers();
  gettingAroundMap.removeLayer(busCluster);
  _.each(data__, function(d, i) {
    let marker = L.marker(new L.LatLng(d.lat, d.lng), {
      icon: dublinBusMapIcon
    });
    marker.bindPopup(getBusContent(d));
    busCluster.addLayer(marker);
    //        console.log("getMarkerID: "+marker.optiid);
  });

  gettingAroundMap.addLayer(busCluster);
}

function getBusContent(d_) {
  let str = '';
  if (d_.fullname) {
    str += d_.fullname + '<br>';
  }
  if (d_.stopid) {
    str += 'Stop ' + d_.stopid + '<br>';
  }
  if (d_.operators[0].routes) {
    str += 'Routes: ';
    _.each(d_.operators[0].routes, function(i) {
      str += i;
      str += ' ';
    });
    str += '<br>';
  }
  if (d_.address && d_.address !== d_.name) {
    str += d_.address + '<br>';
  }
  if (d_.stopid) {
    //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
    str += '<br/><button type="button" class="btn btn-primary busRTPIbutton" data="' +
      d_.stopid + '">Real Time Information</button>';
  };

  return str;
}

//Handle button in gettingAroundMap popup and get RTPI data
let busAPIBase = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=";
//let busAPIBase = "https://www.dublinbus.ie/RTPI/?searchtype=stop&searchquery=";

function displayRTPI(sid_) {
  let rtpiBase, rtpi;
  d3.json(busAPIBase + sid_)
    .catch(function(err) {
      console.log("Error: " + err);
      rtpiBase = "<br><br><strong>We're sorry... </strong> <br>" +
        "The real-time provider did not answer our request for data at this time.";
      rtpi = rtpiBase;
      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(rtpiBase)[0] + rtpi);

    })
    .then(function(data) {
      //                console.log("Button press " + sid_ + "\n");
      rtpiBase = "<br><br><strong> Next Buses: </strong> <br>";
      rtpi = rtpiBase;
      if (data.results.length > 0) {
        //                    console.log("RTPI " + JSON.stringify(data.results[0]));
        _.each(data.results, function(d, i) {
          //console.log(d.route + " Due: " + d.duetime + "");
          //only return n results
          if (i <= 7) {
            rtpi += "<br><b>" + d.route + "</b> " + d.direction + " to " + d.destination;
            if (d.duetime === "Due") {
              rtpi += "  <b>" + d.duetime + "</b>";
            } else {
              rtpi += "  <b>" + d.duetime + " mins</b>";
            }
          }

        });
      } else {
        //console.log("No RTPI data available");
        rtpi += "No Real Time Information Available<br>";
      }
      //                console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(rtpiBase)[0] + rtpi);
    });

}
let displayRTPIBounced = _.debounce(displayRTPI, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.busRTPIbutton', function() {
  displayRTPIBounced($(this).attr("data"));
});

/************************************
 * Carparks
 ************************************/
let carparkCluster = L.markerClusterGroup();
let carparkMapIcon = L.icon({
  iconUrl: '/images/transport/parking-garage-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

//create points on privateMap for carparks even if RTI not available
d3.json("/data/Transport/cpCaps.json").then(function(data) {
  //    console.log("data.carparks :" + JSON.stringify(data.carparks));
  updateMapCarparks(data.carparks);
});

function updateMapCarparks(data__) {
  carparkCluster.clearLayers();
  gettingAroundMap.removeLayer(carparkCluster);
  _.each(data__, function(d, k) {
    let marker = L.marker(new L.LatLng(d[0].lat, d[0].lon), {
      icon: carparkMapIcon
    });
    marker.bindPopup(getCarparkContent(d[0], k));
    carparkCluster.addLayer(marker);
    //        console.log("getMarkerID: "+marker.optiid);
  });
  gettingAroundMap.addLayer(carparkCluster);
}

//static car park data (location etc)
function getCarparkContent(d_, k_) {
  let str = '';
  if (d_.name) {
    str += d_.name + '<br>';
  }
  //    if (d_.Totalspaces) {
  //        str += 'Capacity is ' + d_.Totalspaces + '<br>';
  //    }
  //
  //
  ;
  return str;
}

function displayCarpark(k_) {
  //dynamic data (available spaces)
  d3.xml("/data/Transport/cpdata.xml").then(function(xmlDoc) {
    //        if (error) {
    //            console.log("error retrieving data");
    //            return;
    //        }
    //TODO: convert to arrow function + d3
    let timestamp = xmlDoc.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue;
    //console.log("timestamp :" + timestamp);
    for (let i = 0; i < xmlDoc.getElementsByTagName("carpark").length; i += 1) {
      let name = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("name");
      if (name === k_) {
        let spaces = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("spaces");
        //                console.log("found:"+name+" spaces: "+spaces+"marker"
        //                        +markerRefPrivate.getPopup().getContent());
        if (spaces !== ' ') {
          return markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent() +
            '<br><br> Free spaces: ' +
            spaces +
            '<br> Last updated: ' +
            timestamp
          );
        } else {
          return markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent() +
            '<br><br> No information on free spaces available' +
            '<br> Last updated: ' +
            timestamp
          );
        }
      }
    }
  });
}
let displayCarparkBounced = _.debounce(displayCarpark, 100); //debounce using underscore

////TODO: replace jQ w/ d3 version
//$("div").on('click', '.carparkbutton', function () {
//    displayCarparkBounced($(this).attr("data"));
//});


/************************************
 * Luas
 ************************************/
// let luasCluster = L.markerClusterGroup();
let luasLayer = L.layerGroup();
let luasLineGreen = new L.geoJSON(null, {
  "style": {
    "color": "#4baf56",
    "weight": 5,
    "opacity": 0.65
  }
});

let luasLineRed = new L.geoJSON(null, {
  "style": {
    "color": "#ff4a54",
    "weight": 5,
    "opacity": 0.65
  }
});
let luasIcons; //layer holds markers positioned at ends of luas lines

let luasMapIconLineGreenEnd = L.icon({
  iconUrl: '/images/transport/rail-light-15-g.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [25, -5] //,
  //popupAnchor: [-3, -76]
});


let luasMapIconLineRedEnd = L.icon({
  iconUrl: '/images/transport/rail-light-15-r.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [25, -5] //,
  //popupAnchor: [-3, -76]
});

let luasMapIconLargeGreen = L.icon({
  // iconUrl: '/images/transport/rail-light-15-b.svg',
  iconUrl: '/images/transport/rail-light-g-c-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

let luasMapIconLargeRed = L.icon({
  // iconUrl: '/images/transport/rail-light-15-b.svg',
  iconUrl: '/images/transport/rail-light-r-c-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

let luasMapIconSmallGreen = L.icon({
  //iconUrl: '/images/transport/rail-light-15.svg',
  iconUrl: '/images/transport/circle-stroked-15-g.svg',
  iconSize: [15, 15], //orig size
  iconAnchor: [iconAX / 2, iconAY / 2] //,
  //popupAnchor: [-3, -76]
});

let luasMapIconSmallRed = L.icon({
  //iconUrl: '/images/transport/rail-light-15.svg',
  iconUrl: '/images/transport/circle-stroked-15-r.svg',
  iconSize: [15, 15], //orig size
  iconAnchor: [iconAX / 2, iconAY / 2] //,
  //popupAnchor: [-3, -76]
});

//create points on gettingAroundMap for Luas stops even if RTI not available
d3.tsv("/data/Transport/luas-stops.txt").then(function(data) {
  processLuas(data);
});

d3.json("/data/Transport/LUAS_Green_Line.geojson").then(function(data) {
  updateMapLuasLineGreen(data);
});

d3.json("/data/Transport/LUAS_Red_Line.geojson").then(function(data) {
  updateMapLuasLineRed(data);
});

function processLuas(data_) {
  //    console.log("Luas- \n");
  data_.forEach(function(d) {
    d.lat = +d.Latitude;
    d.lng = +d.Longitude;
    d.StopID = +d.StopID;
    //add a property to act as key for filtering
    d.type = "Luas tram stop";
    //console.log("luas stop RT : " + d.Name);
  });
  updateMapLuas(data_);
}
//extend the marker class to hold data used when calling RT data
let customMarker = L.Marker.extend({
  options: {
    id: 0
  }
});

function updateMapLuas(data__) {
  //hard-coded icons for ends of lines
  let saggart = L.latLng(53.28467885, -6.43776255);
  //let point = L.latLng( 53.34835, -6.22925833333333 );
  let bridesGlen = L.latLng(53.242075, -6.14288611111111);
  let m1 = L.marker(saggart, {
    icon: luasMapIconLineRedEnd
  });
  let m2 = L.marker(bridesGlen, {
    icon: luasMapIconLineGreenEnd
  });

  luasIcons = L.layerGroup([m1, m2]);
  _.each(data__, function(d, k) {
    //console.log("luas id: " + d.LineID + "\n");
    let marker = new customMarker(
      new L.LatLng(d.lat, d.lng), {
        icon: getLuasMapIconSmall(d.LineID),
        id: d.StopID,
        lineId: d.LineID
      }
    );
    marker.bindPopup(getLuasContent(d));
    marker.on('click', markerOnClickLuas);
    luasLayer.addLayer(marker);
    //console.log("marker ID: "+marker.options.id);
  });
  gettingAroundMap.addLayer(luasLayer);
  chooseLookByZoom();

}

function updateMapLuasLineGreen(data__) {
  luasLineGreen.addData(data__);
  gettingAroundMap.addLayer(luasLineGreen);
  chooseLookByZoom();

}

function updateMapLuasLineRed(data__) {
  luasLineRed.addData(data__);
  gettingAroundMap.addLayer(luasLineRed);
  chooseLookByZoom();

}

function getLuasLine(id_) {
  return (id_ === "1" ? "Red" : "Green");
}

function getLuasMapIconSmall(id_) {
  // console.log("icon: " + d.LineID + "\n");
  return (id_ === "1" ? luasMapIconSmallRed : luasMapIconSmallGreen);
}

function getLuasMapIconLarge(id_) {
  // console.log("icon: " + d.LineID + "\n");
  return (id_ === "1" ? luasMapIconLargeRed : luasMapIconLargeGreen);
}

function getLuasContent(d_) {
  let str = '';
  if (d_.Name) {
    str += '<b>' + d_.Name + '</b><br>';
  }
  if (d_.IrishName) {
    str += '<i>' + d_.IrishName + '</i><br>';
  }
  if (d_.LineID) {
    str += getLuasLine(d_.LineID) + ' Line <br>';
  }
  // if (d_.StopID) {
  //     // str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
  //     //         + d_.StopID + '">Real Time Information</button>';
  //
  //     str+= displayLuasRT(d_.StopID);
  //     console.log("Get luas rt for "+d_.StopID);
  //
  //     //console.log(displayLuasRT(d_.StopID));
  // }
  // ;

  return str;
}



let luasAPIBase = "https://luasforecasts.rpa.ie/analysis/view.aspx?id=";


function markerOnClickLuas(e) {
  let sid_ = this.options.id;
  console.log("marker " + sid_ + "\n");
  //Luas API returns html, so we need to parse this into a suitable JSON structure
  d3.html(luasAPIBase + sid_)
    .then(function(htmlDoc) {
      //                console.log(htmlDoc.body);
      let infoString = htmlDoc.getElementById("cplBody_lblMessage")
        .childNodes[0].nodeValue;
      //console.log("info: " + infoString + "\n");
      let headings = htmlDoc.getElementsByTagName("th");
      //console.log("#cols = " + headings.length + "\n");
      let rows = htmlDoc.getElementsByTagName("tr");
      //console.log("#rows = " + rows.length + "\n");
      let tableData = [];
      for (let i = 1; i < rows.length; i += 1) {
        let obj = {};
        for (let j = 0; j < headings.length; j += 1) {
          let heading = headings[j]
            .childNodes[0]
            .nodeValue;
          let value = rows[i].getElementsByTagName("td")[j].innerHTML;
          //console.log("\nvalue: "+ value);
          obj[heading] = value;
        }
        //console.log("\n");
        tableData.push(obj);
      }
      //console.log("tabledata: " + JSON.stringify(tableData));
      let luasRTBase = "<br><br> Next trams after ";
      let luasRT = luasRTBase + infoString.split("at ")[1] + "<br>";
      if (tableData.length > 0) {
        //                    console.log("RTPI " + JSON.stringify(data.results[0]));
        _.each(tableData, function(d, i) {
          //console.log(d.route + " Due: " + d.duetime + "");
          //only return n results
          if (i <= 7) {
            luasRT += "<br><b>" + d["Direction"] +
              "</b> to <b>" + d["Destination"] + "</b>";
            if (d["Time"]) {
              let min = d["Time"].split(":")[1];
              if (min === "00") {
                luasRT += " is <b>Due now</b>";

              } else {
                luasRT += " is due in <b>" + min + "</b> mins";
              }
            } else {
              "n/a";
            }
          }

        });
      } else {
        //console.log("No RTPI data available");
        luasRT += "No Real Time Information Available<br>";
      }
      //console.log("luas rt marker ref" + luasRT);

      //console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(luasRTBase)[0] + luasRT);
    });
}

//Adapt map features for various zoom levels
gettingAroundMap.on('zoomend', function(ev) {
  chooseLookByZoom();

});

function chooseLookByZoom() {
  console.log("Zoom: " + gettingAroundMap.getZoom());
  let cb = d3.select("#luas-checkbox");
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      if (gettingAroundMap.getZoom() < 12) {
        if (!gettingAroundMap.addLayer(luasIcons)) {
          gettingAroundMap.addLayer(luasIcons);
        }
        gettingAroundMap.removeLayer(luasLayer);

      } else if (gettingAroundMap.getZoom() < 13) {
        if (!gettingAroundMap.addLayer(luasIcons)) {
          gettingAroundMap.addLayer(luasIcons);
        }
        if (!gettingAroundMap.addLayer(luasLayer)) {
          gettingAroundMap.addLayer(luasLayer);
        }
        //each layer is actually a marker
        luasLayer.eachLayer(function(marker) {
          //get the line id set in the custom marker to choose red or grreen icon
          let lId = luasLayer.getLayer(luasLayer.getLayerId(marker)).options.lineId;
          marker.setIcon(getLuasMapIconSmall(lId));
        });
      } else {
        gettingAroundMap.removeLayer(luasIcons);
        if (!gettingAroundMap.addLayer(luasLayer)) {
          gettingAroundMap.addLayer(luasLayer);
        }
        luasLayer.eachLayer(function(marker) {
          //get the line id set in the custom marker to choose red or grreen icon
          let lId = luasLayer.getLayer(luasLayer.getLayerId(marker)).options.lineId;
          marker.setIcon(getLuasMapIconLarge(lId));
        });
      }
    }
  }
}

// let displayLuasRTBounced = _.debounce(displayLuasRT, 100); //debounce using underscore

/************************************
 * Motorway Junctions
 ************************************/

d3.json("/data/Transport/traveltimes.json").then(function(data) {
  //processTravelTimes(data);
});

d3.json("/data/Transport/traveltimesroad.json").then(function(data) {
  processRoads(data);
});

function processTravelTimes(data_) {
  //console.log("travel times data : " + JSON.stringify(data_));
  //console.log("\n " + JSON.stringify(d3.keys(data_)));
  d3.keys(data_).forEach(
    //for each key
    function(d) {
      console.debug(JSON.stringify(d));
      //for each data array
      data_[d].data.forEach(function(d_) {
        console.debug("From " + d_["from_name"] + " to " + d_["to_name"] +
          " (" + d_["distance"] / 1000 + " km)" +
          "\nFree flow " + d_["free_flow_travel_time"] + " seconds" +
          "\nCurrent time " + d_["current_travel_time"] + " seconds"
        );
      });
    }
  );

};

function processRoads(data_) {
  // console.debug("roads : " + JSON.stringify(data_.features));

  //data_.features.forEach(function (d_) {
  //        console.debug("f : " + JSON.stringify(f.properties));
  //        console.debug("" + JSON.stringify(f.geometry.coordinates));
  // console.debug("From " + d_.properties["from_name"] + " to " + d_.properties["to_name"]
  //             + " (" + d_.properties["distance"] / 1000 + " km)"
  //             + "\nFree flow " + d_.properties["free_flow_travel_time"] + " seconds"
  //             + "\nCurrent time " + d_.properties["current_travel_time"] + " seconds"
  //             );
  // });
}


/************************************
 * Button Listeners
 ************************************/
// d3.selectAll("button[type=checkbox]").on("click", function() {
//   //console.log("checkbox");
//   let cb = d3.select(this);
//   if (cb.classed('active')) {
//     cb.classed('active', false);
//     gettingAroundMap.removeLayer(cb.property("value"));
//     // authorityNamesChecked = authorityNamesChecked.filter(function(val) {
//     //   return val !== cb.property("value");
//     // });
//     // console.log("ACTIVE");
//   } else {
//     cb.classed('active', true);
//     gettingAroundMap.addLayer(cb.property("value"));
//     // if (authorityNames.includes(cb.property("value"))) {
//     //   authorityNamesChecked.push(cb.property("value"));
//     // } //console.log("INACTIVE");
//   }
//   //console.log("value: " + cb.property("value"));
//   // console.log("active; " + cb.classed('active'));
//   //  console.log("LAs checked array:" + authorityNamesChecked);
//   // authorityDim.filterFunction(function(d) {
//   //   return authorityNamesChecked.includes(d);
//   // });
//   // updateMapData();
//   // updateCharts();
// });

// TODO: generalise
//

d3.select("#bus-checkbox").on("click", function() {
  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(busCluster)) {
        gettingAroundMap.removeLayer(busCluster);

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(busCluster)) {
        gettingAroundMap.addLayer(busCluster);

      }
    }
  }
});

d3.select("#bikes-checkbox").on("click", function() {
  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(bikeCluster)) {
        gettingAroundMap.removeLayer(bikeCluster);

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(bikeCluster)) {
        gettingAroundMap.addLayer(bikeCluster);

      }
    }
  }
});

d3.select("#carparks-checkbox").on("click", function() {
  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(carparkCluster)) {
        gettingAroundMap.removeLayer(carparkCluster);

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
      }
    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(carparkCluster)) {
        gettingAroundMap.addLayer(carparkCluster);

      }
    }
  }
});

//TODO: catch cluster or layer
d3.select("#luas-checkbox").on("click", function() {
  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(luasLines)) {
        gettingAroundMap.removeLayer(luasLines);
        gettingAroundMap.removeLayer(luasIcons);
        gettingAroundMap.removeLayer(luasLayer);


      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(luasLines)) {
        gettingAroundMap.addLayer(luasLines);
        chooseLookByZoom();
      }
    }
  }
});

//D3 DOM manipulation

//set API activity icons
d3.json('/data/api-status.json').then(function(data) {
  //console.log("api status "+JSON.stringify(data));

  if (data["dublinbikes"].status === 200) {
    d3.select('#bike-activity-icon').attr('src', '/images/icons/activity.svg');
    d3.select('#bike-age')
      .text(''); //TODO: call to getAge function from here

  } else {
    d3.select('#bike-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
    d3.select('#bike-age')
      .text('Unavailable');
  }

  if (data["dublinbus"].status === 200) {
    d3.select('#bus-activity-icon').attr('src', '/images/icons/activity.svg');
    d3.select('#bus-age')
      .text(''); //TODO: call to getAge function from here
  } else {
    d3.select('#bus-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
    d3.select('#bus-age')
      .text('Unavailable');
  }

  if (data["carparks"].status === 200) {
    d3.select('#parking-activity-icon').attr('src', '/images/icons/activity.svg');
    d3.select('#parking-age')
      .text(''); //TODO: call to getAge function from here

  } else {
    d3.select('#parking-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
    d3.select('#parking-age')
      .text('Unavailable');
  }

  if (data["luas"].status === 200) {
    d3.select('#luas-activity-icon').attr('src', '/images/icons/activity.svg');
    d3.select('#luas-age')
      .text('');
  } else {
    d3.select('#luas-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
    d3.select('#luas-age')
      .text('Unavailable');
  }

  if (data["train"].status === 200) {
    d3.select('#train-activity-icon').attr('src', '/images/icons/activity.svg');
    d3.select('#train-age')
      .text('');
  } else {
    d3.select('#train-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
    d3.select('#train-age')
      .text('Unavailable');
  }

  if (data["traveltimes"].status === 200) {
    d3.select('#motorway-activity-icon').attr('src', '/images/icons/activity.svg');
    d3.select('#motorway-age')
      .text('');
  } else {
    d3.select('#motorway-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
    d3.select('#motorway-age')
      .text('Unavailable');
  }

});