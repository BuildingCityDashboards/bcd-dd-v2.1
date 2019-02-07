let planningClusterToggle = true,
        supplyClusterToggle = true,
        completionsClusterToggle = true,
        priceAverageClusterToggle = true,
        rentAverageClusterToggle = true,
        priceIndexClusterToggle = true,
        connectionsClusterToggle = true;

zoom = 10; //zoom on page load
maxZoom = 15;
let housingOSM = new L.TileLayer(cartoDb_Lite, {
    minZoom: 10,
    maxZoom: maxZoom, //seems to fix 503 tileserver errors
    attribution: stamenTonerAttrib
});

let housingMap = new L.Map('homes-housing-map');
housingMap.setView(new L.LatLng(dubLat+0.05, dubLng), zoom);
housingMap.addLayer(housingOSM);

// add location control to global name space for testing only
// on a production site, omit the "lc = "!
L.control.locate({
    strings: {
        title: "Zoom to near your location"
    }
}).addTo(housingMap);

var osmGeocoder = new L.Control.OSMGeocoder({
    placeholder: 'Enter street/area name etc.',
    bounds: dublinBounds
});
housingMap.addControl(osmGeocoder);

//Load boundaries
let counties =
        '/data/tools/census2016/Administrative_Counties_Generalised_20m__OSi_National_Administrative_Boundaries_.geojson';
//promises

d3.json(counties).then(function (data) {
    console.log(data.features[0].properties);
    updateMap(data.features);
});

function updateMap(data_) {
    let boundaries = L.geoJSON(data_, {
        filter: function (f, l) {
            return f.properties.COUNTY == "DUBLIN";
        },
        style: style,
        onEachFeature: onEachFeature
    });
    boundaries.addTo(housingMap);
//        
    function onEachFeature(f, l) {
        l.bindPopup(
                '<p><b>' + f.properties.ENGLISH + '</b></p>'
                );
    }
    
    function style(f) {
        return {
            //fillColor: getCountyColor(f.properties.COUNTYNAME),
            weight: 1,
            opacity: 2,
            //color: getCountyColor(f.properties.COUNTYNAME),
            dashArray: '2',
            fillOpacity: 0.1
        };
    }
    //bind click
//                layer.on({
//                click: function () {
//                //idDim.filter(feature.properties.EDNAME);
//                //let res = idDim.top(Infinity)[0].T1_1AGE1;
//                //                console.log(idDim.top(Infinity));
//
//                d3.select("#data-title")
//                        .html(feature.properties.EDNAME);
//                        d3.select("#data-subtitle")
//                        .html(feature.properties.COUNTYNAME + ", Small Area " + feature.properties.SMALL_AREA);
//                        // d3.select("#data-display")
//                        //   .html(JSON.stringify(feature.properties));
//
//                        // TODO: check for names of modified boundaries e.g. SA2017_017012002/017012003 or SA2017_017012004/01
//
//                        d3.json('/api/v1/census2016/smallarea/SA2017_' + feature.properties.SMALL_AREA).then(function (data) {
//                d3.select("#data-textgen")
//                        .html('<p>' + formatData(data) + '</p>');
//                        updateChart(data);
//                        d3.select("#data-chart-title")
//                        .html('Age distribution of males');
//                });
//                }
//                });
}



/************************************
 * Rent Average
 ************************************/
//let rentCluster = new L.MarkerClusterGroup(null, {
//disableClusteringAtZoom: 10,
//        spiderfyOnMaxZoom: false,
//        singleMarkerMode: true
//        // maxClusterRadius: 100,
//        // iconCreateFunction: function(cluster) {
//        //   return L.divIcon({
//        //     html: '<b>' + cluster.getChildCount() + '</b>'
//        //   });
//        // }
//});
//        let rentMapIcon = L.icon({
//        iconUrl: '/images/transport/bicycle-15.svg',
//                iconSize: [30, 30], //orig size
//                iconAnchor: [iconAX, iconAY] //,
//                //popupAnchor: [-3, -76]
//        });
//        d3.json("/data/Transport/bikesData.json").then(function (data) {
////console.log(data[0]);
////processRent(data);
//});
//        /* TODO: performance- move to _each in updateMap */
//                function processRent(data_) {
//
//                //console.log("Bike data \n");
//                data_.forEach(function (d) {
//                d.lat = + d.position.lat;
//                        d.lng = + d.position.lng;
//                        //add a property to act as key for filtering
//                        d.type = "Dublin Bike Station";
//                });
//                        //    console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
//                        //    console.log("# of bike stations is " + data_.length + "\n"); // +
//                        updateMapRent(data_);
//                }
//        ;
//                function updateMapRent(data__) {
//                //rentCluster.clearLayers();
//                housingMap.removeLayer(rentCluster);
//                        let ageMax = 0; //used to find oldest data in set and check if API has recently returned valid data
//                        /*TODO: note impact on page load performance*/
//                        _.each(data__, function (d, i) {
//                        if (ageMax < Date.now() - d.last_update) {
//                        ageMax = Date.now() - d.last_update;
//                        }
//                        rentCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {
//                        icon: rentMapIcon
//                        })
//                                .bindPopup(getRentContent(d)));
//                        });
//                        //console.log("Age Max: " + ageMax);
//                        if (ageMax < (1000 * 60 * 15)) {
//                d3.select('#bike-age')
//                        .text(Math.floor(ageMax / 60000) + " mins ago");
//                }
//                housingMap.addLayer(rentCluster);
//                }
//
////let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
//
//        function getRentContent(d_) {
//        let str = '';
//                if (d_.name) {
//        str += d_.name + '<br>';
//        }
//        if (d_.type) {
//        str += d_.type + '<br>';
//        }
//        //    if (d_.address && d_.address !== d_.name) {
//        //        str += d_.address + '<br>';
//        //    }
//        if (d_.available_bikes) {
//        str += '<br><b>' + d_.available_bikes + '</b>' + ' bikes are available<br>';
//        }
//        if (d_.available_bike_stands) {
//        str += '<b>' + d_.available_bike_stands + '</b>' + ' stands are available<br>';
//        }
//        if (d_.last_update) {
//        let updateTime = bikeTime(new Date(d_.last_update));
//                str += '<br>Last updated ' + updateTime + '<br>';
//        }
//        return str;
//        }
//
//        /************************************
//         * House Price Average
//         ************************************/
//        let priceAverageCluster = L.markerClusterGroup();
//                let priceAverageIcon = L.icon({
//                iconUrl: '/images/transport/bus-15.svg',
//                        iconSize: [30, 30], //orig size
//                        iconAnchor: [iconAX, iconAY] //,
//                        //popupAnchor: [-3, -76]
//                });
//
////d3.json("/data/Transport/busstopinformation_bac.json").then(function(data) {
////  //    console.log("data.results[0]" + JSON.stringify(data.results[0]));
////  //processBusStops(data.results); //TODO: bottleneck?
////});
////
////
////function processBusStops(res_) {
////  //    console.log("Bus data \n");
////  res_.forEach(function(d) {
////    d.lat = +d.latitude;
////    d.lng = +d.longitude;
////    //add a property to act as key for filtering
////    d.type = "Dublin Bus Stop";
////
////  });
////  //    console.log("Bus Stop: \n" + JSON.stringify(res_[0]));
////  //    console.log("# of bus stops is " + res_.length + "\n"); // +
////  updateMapBuses(res_);
////};
////
////function updateMapBuses(data__) {
////  busCluster.clearLayers();
////  housingMap.removeLayer(busCluster);
////  _.each(data__, function(d, i) {
////    let marker = L.marker(new L.LatLng(d.lat, d.lng), {
////      icon: dublinBusMapIcon
////    });
////    marker.bindPopup(getBusContent(d));
////    busCluster.addLayer(marker);
////    //        console.log("getMarkerID: "+marker.optiid);
////  });
////
////  housingMap.addLayer(busCluster);
////}
////
////function getBusContent(d_) {
////  let str = '';
////  if (d_.fullname) {
////    str += d_.fullname + '<br>';
////  }
////  if (d_.stopid) {
////    str += 'Stop ' + d_.stopid + '<br>';
////  }
////  if (d_.operators[0].routes) {
////    str += 'Routes: ';
////    _.each(d_.operators[0].routes, function(i) {
////      str += i;
////      str += ' ';
////    });
////    str += '<br>';
////  }
////  if (d_.address && d_.address !== d_.name) {
////    str += d_.address + '<br>';
////  }
////  if (d_.stopid) {
////    //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
////    str += '<br/><button type="button" class="btn btn-primary busRTPIbutton" data="' +
////      d_.stopid + '">Real Time Information</button>';
////  };
////
////  return str;
////}
//
////Handle button in housingMap popup and get RTPI data
////  let busAPIBase = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=";
////let busAPIBase = "https://www.dublinbus.ie/RTPI/?searchtype=stop&searchquery=";
//
////function displayRTPI(sid_) {
////  let rtpiBase, rtpi;
////  d3.json(busAPIBase + sid_)
////    .catch(function(err) {
////      console.log("Error: " + err);
////      rtpiBase = "<br><br><strong>We're sorry... </strong> <br>" +
////        "The real-time provider did not answer our request for data at this time.";
////      rtpi = rtpiBase;
////      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(rtpiBase)[0] + rtpi);
////
////    })
////    .then(function(data) {
////      //                console.log("Button press " + sid_ + "\n");
////      rtpiBase = "<br><br><strong> Next Buses: </strong> <br>";
////      rtpi = rtpiBase;
////      if (data.results.length > 0) {
////        //                    console.log("RTPI " + JSON.stringify(data.results[0]));
////        _.each(data.results, function(d, i) {
////          //console.log(d.route + " Due: " + d.duetime + "");
////          //only return n results
////          if (i <= 7) {
////            rtpi += "<br><b>" + d.route + "</b> " + d.direction + " to " + d.destination;
////            if (d.duetime === "Due") {
////              rtpi += "  <b>" + d.duetime + "</b>";
////            } else {
////              rtpi += "  <b>" + d.duetime + " mins</b>";
////            }
////          }
////
////        });
////      } else {
////        //console.log("No RTPI data available");
////        rtpi += "No Real Time Information Available<br>";
////      }
////      //                console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
////      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(rtpiBase)[0] + rtpi);
////    });
////
////}
////let displayRTPIBounced = _.debounce(displayRTPI, 100); //debounce using underscore
//
////TODO: replace jQ w/ d3 version
////$("div").on('click', '.busRTPIbutton', function() {
////  displayRTPIBounced($(this).attr("data"));
////});
//
//        /************************************
//         * Completions
//         ************************************/
//
//        /************************************
//         * Connections
//         ************************************/
//
//        /************************************
//         * Planning Applications
//         ************************************/
//
////let carparkCluster = L.markerClusterGroup();
////let carparkMapIcon = L.icon({
////  iconUrl: '/images/transport/parking-garage-15.svg',
////  iconSize: [30, 30], //orig size
////  iconAnchor: [iconAX, iconAY] //,
////  //popupAnchor: [-3, -76]
////});
////
//////create points on privateMap for carparks even if RTI not available
////d3.json("/data/Transport/cpCaps.json").then(function(data) {
////  //    console.log("data.carparks :" + JSON.stringify(data.carparks));
////  updateMapCarparks(data.carparks);
////});
////
////function updateMapCarparks(data__) {
////  carparkCluster.clearLayers();
////  housingMap.removeLayer(carparkCluster);
////  _.each(data__, function(d, k) {
////    let marker = L.marker(new L.LatLng(d[0].lat, d[0].lon), {
////      icon: carparkMapIcon
////    });
////    marker.bindPopup(getCarparkContent(d[0], k));
////    carparkCluster.addLayer(marker);
////    //        console.log("getMarkerID: "+marker.optiid);
////  });
////  housingMap.addLayer(carparkCluster);
////}
////
//////static car park data (location etc)
////function getCarparkContent(d_, k_) {
////  let str = '';
////  if (d_.name) {
////    str += d_.name + '<br>';
////  }
////  //    if (d_.Totalspaces) {
////  //        str += 'Capacity is ' + d_.Totalspaces + '<br>';
////  //    }
////  //
////  //
////  ;
////  return str;
////}
////
////function displayCarpark(k_) {
////  //dynamic data (available spaces)
////  d3.xml("/data/Transport/cpdata.xml").then(function(xmlDoc) {
////    //        if (error) {
////    //            console.log("error retrieving data");
////    //            return;
////    //        }
////    //TODO: convert to arrow function + d3
////    let timestamp = xmlDoc.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue;
////    //console.log("timestamp :" + timestamp);
////    for (let i = 0; i < xmlDoc.getElementsByTagName("carpark").length; i += 1) {
////      let name = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("name");
////      if (name === k_) {
////        let spaces = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("spaces");
////        //                console.log("found:"+name+" spaces: "+spaces+"marker"
////        //                        +markerRefPrivate.getPopup().getContent());
////        if (spaces !== ' ') {
////          return markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent() +
////            '<br><br> Free spaces: ' +
////            spaces +
////            '<br> Last updated: ' +
////            timestamp
////          );
////        } else {
////          return markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent() +
////            '<br><br> No information on free spaces available' +
////            '<br> Last updated: ' +
////            timestamp
////          );
////        }
////      }
////    }
////  });
////}
////let displayCarparkBounced = _.debounce(displayCarpark, 100); //debounce using underscore
////
////////TODO: replace jQ w/ d3 version
//////$("div").on('click', '.carparkbutton', function () {
//////    displayCarparkBounced($(this).attr("data"));
//////});
//
//
//        /************************************
//         * Supply
//         ************************************/
////let supplyCluster = L.markerClusterGroup();
////let luasLayer = L.layerGroup();
////let luasLines = new L.geoJSON(null, {
////  "style": {
////    "color": "#086fb8",
////    "weight": 5,
////    "opacity": 0.65
////
////  }
////});
////let luasIcons; //layer holds markers positioned at ends of luas lines
//////let luasLineColor =
////
////let luasMapIconLine = L.icon({
////  iconUrl: '/images/transport/rail-light-15-b.svg',
////  iconSize: [30, 30], //orig size
////  iconAnchor: [25, -5] //,
////  //popupAnchor: [-3, -76]
////});
////
////let luasMapIconLarge = L.icon({
////  // iconUrl: '/images/transport/rail-light-15-b.svg',
////  iconUrl: '/images/transport/rail-light-w-c-15.svg',
////  iconSize: [30, 30], //orig size
////  iconAnchor: [iconAX, iconAY] //,
////  //popupAnchor: [-3, -76]
////});
////
////let luasMapIconSmall = L.icon({
////  //iconUrl: '/images/transport/rail-light-15.svg',
////  iconUrl: '/images/transport/circle-stroked-15-b.svg',
////  iconSize: [15, 15], //orig size
////  iconAnchor: [iconAX / 2, iconAY / 2] //,
////  //popupAnchor: [-3, -76]
////});
////
//////create points on housingMap for Luas stops even if RTI not available
////d3.tsv("/data/Transport/luas-stops.txt").then(function(data) {
////  processLuas(data);
////});
////
////d3.json("/data/Transport/LUAS_Green_Line.geojson").then(function(data) {
////  updateMapLuasLines(data);
////});
////
////d3.json("/data/Transport/LUAS_Red_Line.geojson").then(function(data) {
////  updateMapLuasLines(data);
////});
////
////function processLuas(data_) {
////  //    console.log("Luas- \n");
////  data_.forEach(function(d) {
////    d.lat = +d.Latitude;
////    d.lng = +d.Longitude;
////    d.StopID = +d.StopID;
////    //add a property to act as key for filtering
////    d.type = "Luas tram stop";
////    //console.log("luas stop RT : " + d.Name);
////  });
////  updateMapLuas(data_);
////}
//////extend the marker class to hold data used when calling RT data
////let customMarker = L.Marker.extend({
////  options: {
////    id: 0
////  }
////});
////
////function updateMapLuas(data__) {
////  if (completionsClusterToggle) {
////    supplyCluster.clearLayers();
////    housingMap.removeLayer(supplyCluster);
////  }
////
////  //hard-coded icons for ends of lines
////  let saggart = L.latLng(53.28467885, -6.43776255);
////  //let point = L.latLng( 53.34835, -6.22925833333333 );
////  let bridesGlen = L.latLng(53.242075, -6.14288611111111);
////  let m1 = L.marker(saggart, {
////    icon: luasMapIconLine
////  });
////  let m2 = L.marker(bridesGlen, {
////    icon: luasMapIconLine
////  });
////
////  luasIcons = L.layerGroup([m1, m2]);
////  _.each(data__, function(d, k) {
////    //        console.log("d: " + d.type + "\n");
////    let marker = new customMarker(
////      new L.LatLng(d.lat, d.lng), {
////        icon: luasMapIconSmall,
////        id: d.StopID
////      }
////    );
////    marker.bindPopup(getLuasContent(d));
////    marker.on('click', markerOnClickLuas);
////    if (completionsClusterToggle) {
////      supplyCluster.addLayer(marker);
////    } else {
////      luasLayer.addLayer(marker);
////    }
////    //console.log("marker ID: "+marker.options.id);
////  });
////  if (completionsClusterToggle) {
////    housingMap.addLayer(supplyCluster);
////  } else {
////    housingMap.addLayer(luasLayer);
////
////  }
////  chooseLookByZoom();
////
////}
////
////function updateMapLuasLines(data__) {
////  luasLines.addData(data__);
////  housingMap.addLayer(luasLines);
////  chooseLookByZoom();
////
////}
////
////function getLuasContent(d_) {
////  let str = '';
////  if (d_.Name) {
////    str += '<b>' + d_.Name + '</b><br>';
////  }
////  if (d_.IrishName) {
////    str += '<i>' + d_.IrishName + '</i><br>';
////  }
////  if (d_.LineID) {
////    str += getLuasLine(d_.LineID) + ' Line <br>';
////  }
////  // if (d_.StopID) {
////  //     // str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
////  //     //         + d_.StopID + '">Real Time Information</button>';
////  //
////  //     str+= displayLuasRT(d_.StopID);
////  //     console.log("Get luas rt for "+d_.StopID);
////  //
////  //     //console.log(displayLuasRT(d_.StopID));
////  // }
////  // ;
////
////  return str;
////}
////
////function getLuasLine(id_) {
////  return (id_ === "1" ? "Red" : "Green");
////}
////
////let luasAPIBase = "https://luasforecasts.rpa.ie/analysis/view.aspx?id=";
////
////
////function markerOnClickLuas(e) {
////  let sid_ = this.options.id;
////  console.log("marker " + sid_ + "\n");
////  //Luas API returns html, so we need to parse this into a suitable JSON structure
////  d3.html(luasAPIBase + sid_)
////    .then(function(htmlDoc) {
////      //                console.log(htmlDoc.body);
////      let infoString = htmlDoc.getElementById("cplBody_lblMessage")
////        .childNodes[0].nodeValue;
////      //console.log("info: " + infoString + "\n");
////      let headings = htmlDoc.getElementsByTagName("th");
////      //console.log("#cols = " + headings.length + "\n");
////      let rows = htmlDoc.getElementsByTagName("tr");
////      //console.log("#rows = " + rows.length + "\n");
////      let tableData = [];
////      for (let i = 1; i < rows.length; i += 1) {
////        let obj = {};
////        for (let j = 0; j < headings.length; j += 1) {
////          let heading = headings[j]
////            .childNodes[0]
////            .nodeValue;
////          let value = rows[i].getElementsByTagName("td")[j].innerHTML;
////          //console.log("\nvalue: "+ value);
////          obj[heading] = value;
////        }
////        //console.log("\n");
////        tableData.push(obj);
////      }
////      //console.log("tabledata: " + JSON.stringify(tableData));
////      let luasRTBase = "<br><br> Next trams after ";
////      let luasRT = luasRTBase + infoString.split("at ")[1] + "<br>";
////      if (tableData.length > 0) {
////        //                    console.log("RTPI " + JSON.stringify(data.results[0]));
////        _.each(tableData, function(d, i) {
////          //console.log(d.route + " Due: " + d.duetime + "");
////          //only return n results
////          if (i <= 7) {
////            luasRT += "<br><b>" + d["Direction"] +
////              "</b> to <b>" + d["Destination"] + "</b>";
////            if (d["Time"]) {
////              let min = d["Time"].split(":")[1];
////              if (min === "00") {
////                luasRT += " is <b>Due now</b>";
////
////              } else {
////                luasRT += " is due in <b>" + min + "</b> mins";
////              }
////            } else {
////              "n/a";
////            }
////          }
////
////        });
////      } else {
////        //console.log("No RTPI data available");
////        luasRT += "No Real Time Information Available<br>";
////      }
////      //console.log("luas rt marker ref" + luasRT);
////
////      //console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
////      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(luasRTBase)[0] + luasRT);
////    });
////}
////
//////Adapt map features for various zoom levels
////housingMap.on('zoomend', function(ev) {
////  chooseLookByZoom();
////
////});
//
////function chooseLookByZoom() {
////  console.log("Zoom: " + housingMap.getZoom());
////  let cb = d3.select("#luas-checkbox");
////  if (!cb.classed('disabled')) {
////    if (cb.classed('active')) {
////      if (housingMap.getZoom() < 12) {
////        if (!housingMap.addLayer(luasIcons)) {
////          housingMap.addLayer(luasIcons);
////        }
////        housingMap.removeLayer(luasLayer);
////
////      } else if (housingMap.getZoom() < 13) {
////        if (!housingMap.addLayer(luasIcons)) {
////          housingMap.addLayer(luasIcons);
////        }
////        if (!housingMap.addLayer(luasLayer)) {
////          housingMap.addLayer(luasLayer);
////        }
////        luasLayer.eachLayer(function(layer) {
////          layer.setIcon(luasMapIconSmall);
////        });
////      } else {
////        housingMap.removeLayer(luasIcons);
////        if (!housingMap.addLayer(luasLayer)) {
////          housingMap.addLayer(luasLayer);
////        }
////        luasLayer.eachLayer(function(layer) {
////          layer.setIcon(luasMapIconLarge);
////        });
////      }
////    }
////  }
////}
//
//// let displayLuasRTBounced = _.debounce(displayLuasRT, 100); //debounce using underscore
//
//        /************************************
//         * Motorway Junctions
//         ************************************/
//
////d3.json("/data/Transport/traveltimes.json").then(function(data) {
////  //processTravelTimes(data);
////});
////
////d3.json("/data/Transport/traveltimesroad.json").then(function(data) {
////  processRoads(data);
////});
////
////function processTravelTimes(data_) {
////  //console.log("travel times data : " + JSON.stringify(data_));
////  //console.log("\n " + JSON.stringify(d3.keys(data_)));
////  d3.keys(data_).forEach(
////    //for each key
////    function(d) {
////      console.debug(JSON.stringify(d));
////      //for each data array
////      data_[d].data.forEach(function(d_) {
////        console.debug("From " + d_["from_name"] + " to " + d_["to_name"] +
////          " (" + d_["distance"] / 1000 + " km)" +
////          "\nFree flow " + d_["free_flow_travel_time"] + " seconds" +
////          "\nCurrent time " + d_["current_travel_time"] + " seconds"
////        );
////      });
////    }
////  );
////
////};
////
////function processRoads(data_) {
////  // console.debug("roads : " + JSON.stringify(data_.features));
////
////  //data_.features.forEach(function (d_) {
////  //        console.debug("f : " + JSON.stringify(f.properties));
////  //        console.debug("" + JSON.stringify(f.geometry.coordinates));
////  // console.debug("From " + d_.properties["from_name"] + " to " + d_.properties["to_name"]
////  //             + " (" + d_.properties["distance"] / 1000 + " km)"
////  //             + "\nFree flow " + d_.properties["free_flow_travel_time"] + " seconds"
////  //             + "\nCurrent time " + d_.properties["current_travel_time"] + " seconds"
////  //             );
////  // });
////}
//
//
//        /************************************
//         * Button Listeners
//         ************************************/
//// d3.selectAll("button[type=checkbox]").on("click", function() {
////   //console.log("checkbox");
////   let cb = d3.select(this);
////   if (cb.classed('active')) {
////     cb.classed('active', false);
////     housingMap.removeLayer(cb.property("value"));
////     // authorityNamesChecked = authorityNamesChecked.filter(function(val) {
////     //   return val !== cb.property("value");
////     // });
////     // console.log("ACTIVE");
////   } else {
////     cb.classed('active', true);
////     housingMap.addLayer(cb.property("value"));
////     // if (authorityNames.includes(cb.property("value"))) {
////     //   authorityNamesChecked.push(cb.property("value"));
////     // } //console.log("INACTIVE");
////   }
////   //console.log("value: " + cb.property("value"));
////   // console.log("active; " + cb.classed('active'));
////   //  console.log("LAs checked array:" + authorityNamesChecked);
////   // authorityDim.filterFunction(function(d) {
////   //   return authorityNamesChecked.includes(d);
////   // });
////   // updateMapData();
////   // updateCharts();
//// });
//
//// TODO: generalise
////
////
////d3.select("#rent-checkbox").on("click", function () {
////    let cb = d3.select(this);
////    if (!cb.classed('disabled')) {
////        if (cb.classed('active')) {
////            cb.classed('active', false);
//////      if (housingMap.hasLayer(rentCluster)) {
//////        housingMap.removeLayer(rentCluster);
//////
//////        //housingMap.fitBounds(supplyCluster.getBounds());
//////      }
////
////        } else {
////            cb.classed('active', true);
//////      if (!housingMap.hasLayer(busCluster)) {
//////        housingMap.addLayer(busCluster);
//////
//////      }
////        }
////    }
////});
////
//d3.select("#price-average-checkbox").on("click", function () {
//    let cb = d3.select(this);
//    if (!cb.classed('disabled')) {
//        if (cb.classed('active')) {
//            cb.classed('active', false);
////      if (housingMap.hasLayer(busCluster)) {
////        housingMap.removeLayer(busCluster);
////
////        //housingMap.fitBounds(supplyCluster.getBounds());
////      }
//
//        } else {
//            cb.classed('active', true);
////      if (!housingMap.hasLayer(busCluster)) {
////        housingMap.addLayer(busCluster);
////
////      }
//        }
//    }
//});
//
//d3.select("#price-index-checkbox").on("click", function () {
//    let cb = d3.select(this);
//    if (!cb.classed('disabled')) {
//        if (cb.classed('active')) {
//            cb.classed('active', false);
////      if (housingMap.hasLayer(busCluster)) {
////        housingMap.removeLayer(busCluster);
////
////        //housingMap.fitBounds(supplyCluster.getBounds());
////      }
//
//        } else {
//            cb.classed('active', true);
////      if (!housingMap.hasLayer(busCluster)) {
////        housingMap.addLayer(busCluster);
////
////      }
//        }
//    }
//});
//
//d3.select("#supply-checkbox").on("click", function () {
//    let cb = d3.select(this);
//    if (!cb.classed('disabled')) {
//        if (cb.classed('active')) {
//            cb.classed('active', false);
////      if (housingMap.hasLayer(busCluster)) {
////        housingMap.removeLayer(busCluster);
////
////        //housingMap.fitBounds(supplyCluster.getBounds());
////      }
//
//        } else {
//            cb.classed('active', true);
////      if (!housingMap.hasLayer(busCluster)) {
////        housingMap.addLayer(busCluster);
////
////      }
//        }
//    }
//});
//
//d3.select("#planning-checkbox").on("click", function () {
//    let cb = d3.select(this);
//    if (!cb.classed('disabled')) {
//        if (cb.classed('active')) {
//            cb.classed('active', false);
////      if (housingMap.hasLayer(rentCluster)) {
////        housingMap.removeLayer(rentCluster);
////
////        //housingMap.fitBounds(supplyCluster.getBounds());
////      }
//
//        } else {
//            cb.classed('active', true);
////      if (!housingMap.hasLayer(rentCluster)) {
////        housingMap.addLayer(rentCluster);
////
////      }
//        }
//    }
//});
//
//d3.select("#connections-checkbox").on("click", function () {
//    let cb = d3.select(this);
//    if (!cb.classed('disabled')) {
//        if (cb.classed('active')) {
//            cb.classed('active', false);
////      if (housingMap.hasLayer(carparkCluster)) {
////        housingMap.removeLayer(carparkCluster);
////
////        //housingMap.fitBounds(supplyCluster.getBounds());
////      }
//        } else {
//            cb.classed('active', true);
////      if (!housingMap.hasLayer(carparkCluster)) {
////        housingMap.addLayer(carparkCluster);
////
////      }
//        }
//    }
//});

//TODO: catch cluster or layer
//d3.select("#completions-checkbox").on("click", function () {
//    let cb = d3.select(this);
//    if (!cb.classed('disabled')) {
//        if (cb.classed('active')) {
//            cb.classed('active', false);
////      if (housingMap.hasLayer(luasLines)) {
////        housingMap.removeLayer(luasLines);
////        housingMap.removeLayer(luasIcons);
////        housingMap.removeLayer(luasLayer);
////
////      }
//
//        } else {
//            cb.classed('active', true);
////      if (!housingMap.hasLayer(luasLines)) {
////        housingMap.addLayer(luasLines);
////        chooseLookByZoom();
////      }
//        }
//    }
//});
//D3 DOM manipulation

//set API activity icons
//d3.select('#motorway-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
//    d3.select('#motorway-age')
//      .text('Unavailable');  