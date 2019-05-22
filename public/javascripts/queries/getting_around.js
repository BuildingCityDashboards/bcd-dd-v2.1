/*TODO:
The following TODO list addresses issues #27 #22 #21 #16 #15 #14 #13
* Working bike symbology
* Working bike traces
  - Add day/ week/ month selection
* Update !bikes data periodically
* Add different icons for different transport modes
* Add car park data
  - Add day popup trace as per bikes
* Add bike station comparisons to popups
* Check API status periodically and update symbol
  - Enable/disable buttons accordingly
  - Add tooltip to say data unavailable over button
  - Animate activity symbol (when refreshing data?)
* Add current time indicator
* Add last/ next refresh time indicator
* Remove button in Bus popup
* Unify popup designs
* Redesign legend
* Convert icons to vector graphics
* Keep popups open when map data refreshes
* Place popups over controls or make them sit away from controls.
* Place icons in filter buttons
 * Test support for DOM node methods on Firefox
 */

/************************************
 * Dublin Bikes
 ************************************/
/************************************
 * Page load
 *** Get station list
 *** Draw markers with default icons
 *** Set timeout
 ***** Get latest snapshot (exAPI)
 ******* Draw/redraw markers with symbology on Map
 *** Marker click
 ***** Get station trend data (exAPI)
 ******* Draw marker popup
 ************************************/

let bikesClusterToggle = true,
  busClusterToggle = true,
  luasClusterToggle = false,
  carparkClusterToggle = true;

zoom = 11; //zoom on page load
maxZoom = 16;
let gettingAroundOSM = new L.TileLayer(cartoDb, {
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
    title: "Zoom to your location"
  }
}).addTo(gettingAroundMap);

var osmGeocoder = new L.Control.OSMGeocoder({
  placeholder: 'Enter street name, area etc.',
  bounds: dublinBounds
});
gettingAroundMap.addControl(osmGeocoder);

/************************************
 * Bikes
 ************************************/

let bikesIcon = L.Icon.extend({
  options: {
    iconSize: [36, 45],
    iconAnchor: [18, 45],
    popupAnchor: [-3, -46]
  }
});
//Add an id field to the markers to match with bike station id
let customBikesStationMarker = L.Marker.extend({
  options: {
    id: 0
  }
});

let customBikesLayer = L.Layer.extend({

});

let bikesStationPopupOptons = {
  // 'maxWidth': '500',
  'className': 'bikesStationPopup'
};
let bikesCluster = L.markerClusterGroup();
// let bikesLayerGroup = L.layerGroup();
let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
let bikeHour = d3.timeFormat("%H");

d3.json('/api/dublinbikes/stations/list')
  .catch((err) => {
    console.error("Error fetching Dublin Bikes data" + JSON.stringify(err));
    /** @todo Should load stations from an archived file if this fails**/
  })
  .then((data) => initBikeStationsMarkers(data));


let setIntervalAsync = SetIntervalAsync.dynamic.setIntervalAsync;
// // // let setIntervalAsync = SetIntervalAsync.fixed.setIntervalAsync
// // // let setIntervalAsync = SetIntervalAsync.legacy.setIntervalAsync
let clearIntervalAsync = SetIntervalAsync.clearIntervalAsync

// Timed refresh of map station markers symbology using data snapshot
const stationTimer = setIntervalAsync(
  () => {
    return d3.json('/api/dublinbikes/stations/snapshot') //get latest snapshot of all stations
      .catch(function(err) {
        console.error("Error fetching Dublin Bikes data: " + JSON.stringify(err));
      })
      .then((data) => {
        console.log('/n/n/n >Fetched Dublin Bikes snapshot</n/n/n');
        // console.log('Data: ' + JSON.stringify(data[0]));
        // updateMapBikes(data);
        // console.log('Snapshot size ' + JSON.stringify(data.length)); //??snapshot size varies??
        updateBikeStationsMarkers(data);
      })
  },
  10000
);

function initBikeStationsMarkers(data_) {
  // console.log('update map\n' + JSON.stringify(data__[0]));
  // bikesCluster.clearLayers();
  // gettingAroundMap.removeLayer(bikesCluster); //required
  data_.forEach((d, i) => {
    d.type = "Dublin Bikes Station"; //used in alt text (tooltip)
    let m = new customBikesStationMarker(
      new L.LatLng(+d.st_LATITUDE, +d.st_LONGITUDE), {
        id: d.st_ID,
        icon: new bikesIcon({
          iconUrl: 'images/transport/bikes_icon_default.png' //loads a default grey icon
        }),
        opacity: 0.9, //(Math.random() * (1.0 - 0.5) + 0.5),
        title: d.type + '\t' + d.st_NAME,
        alt: d.type + ' icon',
        //            riseOnHover: true,
        //            riseOffset: 250

      });
    m.bindPopup(bikesStationPopupInit(d), bikesStationPopupOptons);
    m.on('popupopen', getBikesStationPopup); //refeshes data on every popup open
    bikesCluster.addLayer(m);
    // bikesLayerGroup.addLayer(m);
    // gettingAroundMap.addLayer(bikesLayerGroup);
  });
  gettingAroundMap.addLayer(bikesCluster);
  // gettingAroundMap.fitBounds(bikesCluster.getBounds());
}

//Doing the following to update the marker icons without instantiating them on each data load
/***@todo: check if this is actually more performant than bikesCluster.clearLayers + re-instantiation***/

function updateBikeStationsMarkers(data_) {
  gettingAroundMap.removeLayer(bikesCluster);
  bikesCluster.eachLayer(function(layer) {
    data_.forEach((d, i) => {
      if (d.id === layer.options.id) {
        layer.options.icon.options.iconUrl = getBikesIcon(d);
      };
    });
    console.log("Icons loaded");

    // console.log("layer id: " + layer.options.id);
    // console.log("\nlayer options: " + JSON.stringify(layer.options));
    // console.log("\nlayer icon: " + JSON.stringify(layer.options.icon));
    // layer.options.icon.options.iconUrl = 'images/transport/bikes_icon_blue_1.png';
    // console.log("\nlayer icon changed: " + JSON.stringify(layer.options.icon));
    //indicate if asscoiated popup open or closed
    // const msg = layer.isPopupOpen() ? "Popup is open" : "Popup is closed";
    // console.log("layer popup: " + msg);
    // console.log("lid: " + bikesLayerGroup.getLayerId(layer));
    // layer.bindPopup('Hello');
    // layer.setIcon(getBikesIcon(d));
    /***@todo try this***/
    // create custom icon
    // IconStyleOne = L.icon({
    //   iconUrl: 'img/image1.png'
    // });
    // IconStyleTwo = L.icon({
    //   iconUrl: 'img/image2.png'
    // });
    //
    // // ...
    //
    // //Create empty geojson with mouseover and mouseout events
    // geojson_feature = L.geoJson(false, {
    //   pointToLayer: function(feature, latlng) {
    //     return L.marker(latlng, {
    //       icon: IconStyleOne
    //     });
    //   },
    //   onEachFeature: function(feature, layer) {
    //     layer.on("mouseover", function(e) {
    //       layer.setIcon(IconStyleOne)
    //     });
    //     layer.on("mouseout", function(e) {
    //       layer.setIcon(IconStyleTwo)
    //     });
    //   }
    // }).addTo(this.map); **
    // * /
  });
  gettingAroundMap.addLayer(bikesCluster);
}

//Choose a symbol for the map marker icon based on the current availability
//the data element for the station is passed in and parsed

function getBikesIcon(d_) {
  const percentageFree = Math.round((d_.available_bikes / d_.bike_stands) * 100);
  const one = 'images/transport/bikes_icon_blue_1.png',
    two = 'images/transport/bikes_icon_blue_2.png',
    three = 'images/transport/bikes_icon_blue_3.png',
    four = 'images/transport/bikes_icon_blue_4.png',
    five = 'images/transport/bikes_icon_blue_5.png';

  return percentageFree < 20 ? one :
    percentageFree < 40 ? two :
    percentageFree < 60 ? three :
    percentageFree < 80 ? four : five;
}

function bikesStationPopupInit(d_) {
  // console.log("\n\nPopup Initi data: \n" + JSON.stringify(d_)  + "\n\n\n");
  //if no station id none of the mappings witll work so escape
  if (!d_.st_ID) {
    let str = "<div class=\"popup-error\">" +
      "<div class=\"row \">" +
      "We can't get the Dublin Bikes data right now, please try again later" +
      "</div>" +
      "</div>";
    return str;
  }

  let str = "<div class=\"bike-popup-container\">";
  if (d_.st_NAME) {
    str += "<div class=\"row \">";
    str += "<span id=\"bike-name-" + d_.st_ID + "\" class=\"col-9\">"; //id for name div
    str += "<strong>" + d_.st_NAME + "</strong>";
    str += "</span>" //close bike name div
    //div for banking icon
    str += "<span id=\"bike-banking-" + d_.st_ID + "\" class= \"col-3\"></span>";
    str += '</div>'; //close row
  }
  str += "<div class=\"row \">";
  str += "<span id=\"bike-standcount-" + d_.st_ID + "\" class=\"col-9\" ></span>";
  str += "</div>"; //close row

  //initialise div to hold chart with id linked to station id
  if (d_.st_ID) {
    str += '<div class=\"row \">';
    str += '<span id="bike-spark-' + d_.st_ID + '"></span>';
    str += '</div>';
  }
  str += '</div>' //closes container
  return str;
}


//Sparkline for popup geterated from station query
function getBikesStationPopup() {
  ////d3.select("#bike-spark-67").text('Selected from D3');
  let sid_ = this.options.id;
  // /api/dublinbikes / stations / snapshot
  d3.json('/api/dublinbikes/stations/' + sid_ + '/today')
    .catch(function(err) {
      let str = "<div class=\"popup-error\">" +
        "<div class=\"row \">" +
        "We can't get the Dublin Bikes data right now, please try again later" +
        "</div>" +
        "</div>";
      console.error("\n\n Error fetching Dublin Bikes Station Data: " + JSON.stringify(err));
      return d3.select("#bike-spark-" + sid_)
        .html(str);

    })
    .then(function(stationData) {
      // d3.json("/api/dublinbikes/stations/" + sid_ + "/today").then(function(stationData, err) {
      // console.log("\n******\nExample Dublin Bikes data from Derilinx to client \n" + JSON.stringify(stationData) + "\n******\n");

      if (stationData[0].banking) {
        console.log("Banking at #" + sid_ + " is " + stationData[0].banking);
        let bankStr = "<img alt=\"Banking icon \" src = \"images/bank-card-w.svg\" height= \"20px\" title=\"Banking available\" />";
        d3.select("#bike-banking-" + sid_)
          .html(bankStr);
      }
      //assuming static data doesn't change throughout day...
      let standsCount = stationData[0].historic[0].bike_stands;
      if (standsCount) {
        // console.log("Banking at #" + sid_ + " is " + stationData[0].banking);
        let stdStr = '<strong>' + standsCount + ' total stands </strong>';
        d3.select("#bike-standcount-" + sid_)
          .html(stdStr);
      }
      let processedData = stationData[0].historic.map((d) => {
        d.ms = moment(d.time).valueOf(); //add a property for the day formatted as Epoch time
        return d;
      });

      let ndx = crossfilter(processedData);
      let timeDim = ndx.dimension(function(d) {
        // return d["last_update"];
        return d.ms;
      });
      let earliest = timeDim.bottom(1)[0];
      // let earliestMS = moment(earliest).valueOf();
      let latest = timeDim.top(1)[0];
      // let latestMS = moment(latest).valueOf();
      // moment(timeDim.top(1)[0].time).format();
      // console.log("\n\n***********\nEarliest returned: " + JSON.stringify(earliest.ms) + "\n***********\n\n");
      // console.log("\n\n***********\nLatest returned: " + JSON.stringify(latest.ms) + "\n***********\n\n");
      let availableBikesGroup = timeDim.group().reduceSum(function(d) {
        return d["available_bikes"];
      });
      // console.log("available bikes: " + JSON.stringify(availableBikesGroup.top(Infinity)));

      let startChart = moment.utc().startOf('day').add(3, 'hours');
      let endChart = moment.utc().endOf('day').add(2, 'hours');
      // console.log("chart time range: " + startChart + " - " + endChart);
      let bikeSpark = dc.lineChart("#bike-spark-" + sid_);
      // console.log("Select bike spark #" + sid_);
      bikeSpark.width(250).height(100);
      bikeSpark.dimension(timeDim);
      bikeSpark.group(availableBikesGroup);
      bikeSpark.x(d3.scaleTime().domain([startChart, endChart]));
      bikeSpark.y(d3.scaleLinear().domain([0, standsCount]));
      bikeSpark.margins({
        left: 20,
        top: 15,
        right: 20,
        bottom: 20
      });
      bikeSpark.xAxis().ticks(3);
      bikeSpark.renderArea(true);
      bikeSpark.renderDataPoints(true);
      //        bikeSpark.renderDataPoints({radius: 10});//, fillOpacity: 0.8, strokeOpacity: 0.0});
      bikeSpark.renderLabel(false); //, fillOpacity: 0.8, strokeOpacity: 0.0}); //labels on points -> how to apply to last point only?
      bikeSpark.label(function(d) {
        if (d.x === latest) {
          // console.log(JSON.stringify(d));
          let hour = new Date(d.x).getHours();
          let mins = new Date(d.x).getMinutes().toString().padStart(2, '0');
          let end = ((d.y == 1) ? ' bike' : ' bikes');
          //                let str = hour + ':' + mins +
          let str = JSON.stringify(d.y) + end;
          //                console.log(str);
          return str;;
        }
        return '';
      });
      //        bikeSpark.title(function (d, i) {
      //            let hour = new Date(d.key).getHours();
      //            let mins = new Date(d.key).getMinutes().toString().padStart(2, '0');
      //            let val = ((d.value == 1) ? ' bike available' : ' bikes available');
      //            let str = hour + ':' + mins + ' - ' + JSON.stringify(d.value) + val;
      ////              console.log(str);
      //            return str;
      //        });
      bikeSpark.renderVerticalGridLines(true);
      bikeSpark.useRightYAxis(true);
      bikeSpark.xyTipsOn(false);
      bikeSpark.brushOn(false);
      bikeSpark.clipPadding(15);
      bikeSpark.render();
    })
}

function setBikeStationColour(bikes, totalStands) {
  let percentageFree = (bikes / totalStands) * 100;
  return percentageFree < 20 ? '#eff3ff' :
    percentageFree < 40 ? '#c6dbef' :
    percentageFree < 60 ? '#9ecae1' :
    percentageFree < 80 ? '#6baed6' : '#3182bd';
}

let bikesLegend = L.control({
  position: 'bottomright'
});

bikesLegend.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'info legend'),
    bikeGrades = [0, 20, 40, 60, 80],
    labels = [],
    from, to;
  //    labels.push('Bike Stations');
  labels.push('Dublin Bikes Availability');
  for (let i = bikeGrades.length - 1; i >= 0; i--) {
    from = bikeGrades[i];
    to = bikeGrades[i + 1];
    labels.push('<i style="background: ' + setBikeStationColour(from, 100) + '"></i>' +
      +from + (to ? '%&ndash;' + to + '%' : '%' + '+'));
  }
  div.innerHTML = labels.join('<br>');
  return div;
};

bikesLegend.addTo(gettingAroundMap);


/************************************
 * Bus Stops
 ************************************/
let busCluster = L.markerClusterGroup({
  //   showCoverageOnHover: false,
  //   zoomToBoundsOnClick: false
  disableClusteringAtZoom: maxZoom,
  spiderfyOnMaxZoom: false
  //   // singleMarkerMode: true
  //   // maxClusterRadius: 100,
  //   // iconCreateFunction: function(cluster) {
  //   //   return L.divIcon({
  //   //     html: '<b>' + cluster.getChildCount() + '</b>'
  //   //   });
  //   // }
});
let dublinBusMapIcon = L.icon({
  iconUrl: '/images/transport/bus-w-cbs-blue-4-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

d3.json("/data/Transport/busstopinformation_bac.json").then(function(data) {
    //    console.log("data.results[0]" + JSON.stringify(data.results[0]));
    processBusStops(data.results); //TODO: bottleneck?
  })
  .catch(function(err) {
    console.error("Error fetching Bus stop information data");
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

  // gettingAroundMap.addLayer(busCluster);
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
      console.error("Error fetching Bus stop realtime data" + err);
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
let carparkCluster = L.markerClusterGroup({
  //   showCoverageOnHover: false,
  //   zoomToBoundsOnClick: false
  disableClusteringAtZoom: maxZoom,
  spiderfyOnMaxZoom: false
  //   // singleMarkerMode: true
  //   // maxClusterRadius: 100,
  //   // iconCreateFunction: function(cluster) {
  //   //   return L.divIcon({
  //   //     html: '<b>' + cluster.getChildCount() + '</b>'
  //   //   });
  //   // }
});

let carparkMapIcon = L.icon({
  iconUrl: '/images/transport/parking-garage-w-cbs-blue-6-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

//create points on privateMap for carparks even if RTI not available
d3.json("/data/Transport/cpCaps.json")
  .then(function(data) {
    //    console.log("data.carparks :" + JSON.stringify(data.carparks));
    updateMapCarparks(data.carparks);
  })
  .catch(function(err) {
    console.error("Error fetching car parks static data");

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
  // console.log("retrieving live carpark data");
  d3.xml("/data/Transport/cpdata.xml")
    .then(function(xmlDoc) {
      //        if (error) {
      //            console.log("error retrieving data");
      //            return;
      //        }
      //TODO: convert to arrow function + d3
      let timestamp = xmlDoc.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue;
      // console.log("timestamp :" + timestamp);
      for (let i = 0; i < xmlDoc.getElementsByTagName("carpark").length; i += 1) {
        let name = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("name");
        if (name === k_) {
          let spaces = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("spaces");
          // console.log("found:" + name + " spaces: " + spaces + "marker" +
          // markerRefPrivate.getPopup().getContent());
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
    })
    .catch(function(err) {
      console.error("Error fetching car parks realtime data");
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
d3.tsv("/data/Transport/luas-stops.txt")
  .then(function(data) {
    processLuas(data);
  })
  .catch(function(err) {
    console.error("Error fetching Luas stop data");
  });

d3.json("/data/Transport/LUAS_Green_Line.geojson")
  .then(function(data) {
    updateMapLuasLineGreen(data);
  }).catch(function(err) {
    console.error("Error fetching Luas Green Line path");
  });

d3.json("/data/Transport/LUAS_Red_Line.geojson").then(function(data) {
  updateMapLuasLineRed(data);
}).catch(function(err) {
  console.error("Error fetching Luas Red Line path");
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
  // console.log("marker " + sid_ + "\n");
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
    })
    .catch(function(err) {
      console.error("Error fetching Luas realtime data");
    });
}

//Adapt map features for various zoom levels
gettingAroundMap.on('zoomend', function(ev) {
  chooseLookByZoom();

});

function chooseLookByZoom() {
  // console.log("Zoom: " + gettingAroundMap.getZoom());
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

// d3.json("/data/Transport/traveltimes.json").then(function(data) {
//   //processTravelTimes(data);
// });
//
// d3.json("/data/Transport/traveltimesroad.json").then(function(data) {
//   //processRoads(data);
// });

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
      if (gettingAroundMap.hasLayer(bikesCluster)) {
        gettingAroundMap.removeLayer(bikesCluster);

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(bikesCluster)) {
        gettingAroundMap.addLayer(bikesCluster);

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
      if (gettingAroundMap.hasLayer(luasLineRed)) {
        gettingAroundMap.removeLayer(luasLineRed);
        gettingAroundMap.removeLayer(luasLineGreen);
        gettingAroundMap.removeLayer(luasIcons);
        gettingAroundMap.removeLayer(luasLayer);
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(luasLineRed)) {
        gettingAroundMap.addLayer(luasLineRed);
        gettingAroundMap.addLayer(luasLineGreen);
        chooseLookByZoom();
      }
    }
  }
});

//D3 DOM manipulation

//set API activity icons
d3.json('/data/api-status.json')
  .then(function(data) {
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

  })
  .catch(function(err) {
    console.error("Error fetching API status file data");
  });