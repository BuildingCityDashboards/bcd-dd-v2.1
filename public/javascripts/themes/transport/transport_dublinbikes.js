/************************************
 * Bikes
 ************************************/
d3.json("/data/Transport/dublinbikes/day/day.json")
  .then(data => {
    const dayFormat = d3.timeFormat("%a, %I:%M");

    console.log("\n\nBikes theme data: " + JSON.stringify(data[0]));

    // let dublinBikesData = d3.nest()
    //   .key(function(d) {
    //     return d.key;
    //   })
    //   .entries(data);

    let keys = ["Bikes in use", "Bikes available"]; //this controls stacking order
    /*For stacked area chart*/
    data.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      //d["TBikes in use"] = +d["Bikes in use"];
      d["date"] = new Date(d["date"]);

    })

    /* For multiline chart */
    // dublinBikesData.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });

    console.log("Bikes Keys: " + JSON.stringify(keys));

    const dublinBikesContent = {
      e: "#chart-dublinbikes",
      d: data,
      //k: dublinBikesData, //?
      ks: keys, //For StackedAreaChart-formatted data need to provide keys
      xV: "date", //expects a date object
      yV: "value",
      tX: "Time", //string axis title
      tY: "No of bikes"
    };

    const dublinBikesChart = new StackedAreaChart(dublinBikesContent);
    dublinBikesChart.drawChart();
    // addTooltip(title, format, dateField, prefix, postfix)
    //format just formats comms for thousands etc
    dublinBikesChart.addTooltip("Number available at ", "thousands", "label", "", "");


    d3.select("#dublinbikes_day").on("click", function() {
      activeBtn(this);
      // hCBTChart.yV = hCBTType[0];
      // hCBTChart.updateChart();
      // hCBTChart.addTooltip("Total Houses - ", "thousands", "label");
      // hCBTChart.hideRate(false);
    });

    d3.select("#dublinbikes_week").on("click", function() {
      activeBtn(this);

      // hCBTChart.yV = hCBTType[1];
      // hCBTChart.updateChart();
      // hCBTChart.addTooltip("Private Houses - ", "thousands", "label");
      // hCBTChart.hideRate(false);
    });

    d3.select("#dublinbikes_month").on("click", function() {
      activeBtn(this);
      // hCBTChart.yV = hCBTType[2];
      // hCBTChart.updateChart();
      // hCBTChart.addTooltip("Social Houses - ", "thousands", "label");
      // hCBTChart.hideRate(true);
    });

    d3.select("#dublinbikes_year").on("click", function() {
      activeBtn(this);
      // hCBTChart.yV = hCBTType[2];
      // hCBTChart.updateChart();
      // hCBTChart.addTooltip("Social Houses - ", "thousands", "label");
      // hCBTChart.hideRate(true);
    });


    // add buttons to switch between total, housing and apartments

    d3.select(window).on("resize", function() {
      // supplyChart.drawChart();
      // contributionChart.drawChart();
      // housePricesChart.drawChart();
      // dublinBikesChart.drawChart();
    });

  }).catch(function(error) {
    console.log(error);
  });

//End of bikes data load

function convertQuarter(q) {
  let splitted = q.split('Q');
  let year = splitted[0];
  let quarterEndMonth = splitted[1] * 3 - 2;
  let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year);
  return date;
}

function qToQuarter(q) {
  let splitted = q.split('Q');
  let year = splitted[0];
  let quarter = splitted[1];
  let quarterString = ("Quarter " + quarter + ' ' + year);
  return quarterString;
}

function dataSets(data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      // d[columns[i]] !== "null" ? d[columns[i]] = +d[columns[i]] : d[columns[i]] = "unavailable";
      d[columns[i]] = +d[columns[i]];
    }
    return d;
  });
  return coercedData;
}

function formatQuarter(date) {
  let newDate = new Date();
  newDate.setMonth(date.getMonth() + 1);
  let year = (date.getFullYear());
  let q = Math.ceil((newDate.getMonth()) / 3);
  return "Quarter " + q + ' ' + year;
}

function filterbyDate(data, dateField, date) {
  return data.filter(d => {
    return d[dateField] >= new Date(date);
  });
}

function filterByDateRange(data, dateField, dateOne, dateTwo) {
  return data.filter(d => {
    return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo);
  });
}

function nestData(data, label, name, value) {
  let nested_data = d3.nest()
    .key(function(d) {
      return d[label];
    })
    .entries(data); // its the string not the date obj

  let mqpdata = nested_data.map(function(d) {
    let obj = {
      label: d.key
    }
    d.values.forEach(function(v) {
      obj[v[name]] = v[value];
      obj.date = v.date;
    })
    return obj;
  })
  return mqpdata;
}

function chartContent(data, key, value, date, selector) {

  data.forEach(function(d) { //could pass types array and coerce each matching key using dataSets()
    d.label = d[date];
    d.date = parseYearMonth(d[date]);
    d[value] = +d[value];
  });

  // nest the processed data by regions
  const nest = d3.nest().key(d => {
    return d[key];
  }).entries(data);

  // get array of keys from nest
  const keys = [];
  nest.forEach(d => {
    keys.push(d.key);
  });

  return {
    e: selector,
    d: nest,
    xV: date,
    yV: value
  }

}

function activeBtn(e) {
  let btn = e;
  $(btn).siblings().removeClass('active');
  $(btn).addClass('active');

}

// /* TODO: performance- move to _each in updateMap */
function processLatestBikes(data_) {
  let bikeStands = 0;
  //console.log("Bike data \n");
  data_.forEach(function(d) {
    d.lat = +d.position.lat;
    d.lng = +d.position.lng;
    //add a property to act as key for filtering
    d.type = "Dublin Bikes Station";
    if (d.bike_stands) {
      bikeStands += d.bike_stands;
    }
  });
  d3.select('#stations-count').html(data_.length);
  d3.select('#stands-count').html(bikeStands);
  //console.log("# of available bike is " + available + "\n");
  //    console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
  //    console.log("# of bike stations is " + data_.length + "\n"); // +
  updateMapBikes(data_);
};
// //let markerRefBike; //TODO: fix horrible hack!!!
// let customBikesStationMarker = L.Marker.extend({
//   options: {
//     id: 0
//   }
// });
// let bikesStationPopupOptons = {
//   // 'maxWidth': '500',
//   'className': 'bikesStationPopup'
// };
//
// function updateMapBikes(data__) {
//   bikeCluster.clearLayers();
//   bikesMap.removeLayer(bikeCluster); //required
//   _.each(data__, function(d, i) {
//     let m = new customBikesStationMarker(
//       new L.LatLng(d.lat, d.lng), {
//         id: d["number"],
//         icon: getBikesIcon(d),
//         opacity: 0.95,
//         title: d.type + ' - ' + d.name,
//         alt: d.type + ' icon',
//         //            riseOnHover: true,
//         //            riseOffset: 250
//
//       });
//     m.bindPopup(bikesStationPopupInit(d), bikesStationPopupOptons);
//     m.on('popupopen', getBikesStationPopup);
//     bikeCluster.addLayer(m);
//   });
//   bikesMap.addLayer(bikeCluster);
//   bikesMap.fitBounds(bikeCluster.getBounds());
// }
//
//
// function bikesStationPopupInit(d_) {
//   let str = "<div class=\"container \">" +
//     "<div class=\"row \">" +
//     "<div class=\"col-sm-9 \">";
//   if (d_.name) {
//     str += "<h6>" + d_.name + '</h6>';
//   }
//   str += "</div>" +
//     "<div class=\"col-sm-3 \">";
//   if (d_.banking) {
//     str += "<img alt=\"Banking icon \" src=\"images/bank-card-w.svg\" height= \"25px\" title=\"Banking available\" />";
//   }
//   str += '</div></div>'; //closes col then row
//
//   // if (d_.type) {
//   //   str += d_.type;
//   // }
//   if (d_.bike_stands) {
//     str += '<div class=\"row \">';
//     str += '<div class=\"col-sm-12 \">';
//     str += '<b>' + d_.bike_stands + '</b> stands';
//     str += '</div></div>';
//     str += '<div class=\"row \">';
//     str += '<span id="bike-spark-' + d_.number + '"> </span>';
//     str += '</div>';
//   }
//   str += '</div>' //closes container
//   return str;
// }
// //Sparkline for popup
// function getBikesStationPopup() {
//   ////d3.select("#bike-spark-67").text('Selected from D3');
//   let sid_ = this.options.id;
//
//   //    let timeParse = d3.timeParse("%d/%m/%Y");
//   d3.json("/api/dublinbikes/stations/" + sid_ + "/today").then(function(stationData) {
//     // stationData.forEach(function (d) {
//     //     d.hour = new Date(d["last_update"]).getHours();
//     // });
//     let bikeSpark = dc.lineChart("#bike-spark-" + sid_);
//     if (stationData.length == 0) {
//       let str = "<div class=\"popup-error\">" +
//         "<div class=\"row \">" +
//         "We can't reach Dublin Bikes right now, please try again later" +
//         "</div>" +
//         "</div>"
//       return d3.select("#bike-spark-" + sid_)
//         .html(str);
//     }
//     let standsCount = stationData[0].bike_stands;
//     let ndx = crossfilter(stationData);
//     let timeDim = ndx.dimension(function(d) {
//       return d["last_update"];
//     });
//     let latest = timeDim.top(1)[0].last_update;
//     //        console.log ("latest: "+JSON.stringify(timeDim.top(1)[0].last_update));
//     let availableBikesGroup = timeDim.group().reduceSum(function(d) {
//       return d["available_bikes"];
//     });
//     //moment().format('MMMM Do YYYY, h:mm:ss a');
//     let start = moment.utc().startOf('day').add(3, 'hours');
//     let end = moment.utc().endOf('day').add(2, 'hours');
//     //        console.log("bikes: " + JSON.stringify(timeDim.top(Infinity)));
//     bikeSpark.width(250).height(100);
//     bikeSpark.dimension(timeDim);
//     bikeSpark.group(availableBikesGroup);
//     //        console.log("day range: " + start + " - " + end);
//     bikeSpark.x(d3.scaleTime().domain([start, end]));
//     bikeSpark.y(d3.scaleLinear().domain([0, standsCount]));
//     bikeSpark.margins({
//       left: 20,
//       top: 15,
//       right: 20,
//       bottom: 20
//     });
//     bikeSpark.xAxis().ticks(3);
//     bikeSpark.renderArea(true);
//     bikeSpark.renderDataPoints(false);
//     //        bikeSpark.renderDataPoints({radius: 10});//, fillOpacity: 0.8, strokeOpacity: 0.0});
//     bikeSpark.renderLabel(false); //, fillOpacity: 0.8, strokeOpacity: 0.0}); //labels on points -> how to apply to last point only?
//     bikeSpark.label(function(d) {
//       if (d.x === latest) {
//         console.log(JSON.stringify(d));
//         let hour = new Date(d.x).getHours();
//         let mins = new Date(d.x).getMinutes().toString().padStart(2, '0');
//         let end = ((d.y == 1) ? ' bike' : ' bikes');
//         //                let str = hour + ':' + mins +
//         let str = JSON.stringify(d.y) + end;
//         //                console.log(str);
//         return str;;
//       }
//       return '';
//     });
//     //        bikeSpark.title(function (d, i) {
//     //            let hour = new Date(d.key).getHours();
//     //            let mins = new Date(d.key).getMinutes().toString().padStart(2, '0');
//     //            let val = ((d.value == 1) ? ' bike available' : ' bikes available');
//     //            let str = hour + ':' + mins + ' - ' + JSON.stringify(d.value) + val;
//     ////              console.log(str);
//     //            return str;
//     //        });
//     bikeSpark.renderVerticalGridLines(true);
//     bikeSpark.useRightYAxis(true);
//     bikeSpark.xyTipsOn(false);
//     bikeSpark.brushOn(false);
//     bikeSpark.clipPadding(15);
//     bikeSpark.render();
//   });
// }
//
// function getBikesIcon(d_) {
//   var percentageFree = (d_.available_bikes / d_.bike_stands) * 100;
//   //    console.log("% " + percentageFree);
//
//   var one = new bikesIcon({
//       iconUrl: 'images/transport/bikes_icon_blue_1.png'
//     }),
//     two = new bikesIcon({
//       iconUrl: 'images/transport/bikes_icon_blue_2.png'
//     }),
//     three = new bikesIcon({
//       iconUrl: 'images/transport/bikes_icon_blue_3.png'
//     }),
//     four = new bikesIcon({
//       iconUrl: 'images/transport/bikes_icon_blue_4.png'
//     }),
//     five = new bikesIcon({
//       iconUrl: 'images/transport/bikes_icon_blue_5.png'
//     });
//   //            six = new bikeIcon({iconUrl: 'images/transport/bike120.png'});
//
//   return percentageFree < 20 ? one :
//     percentageFree < 40 ? two :
//     percentageFree < 60 ? three :
//     percentageFree < 80 ? four : five;
//   //            percentageFree < 101 ? five
//   //            // percentageFree < 120   ? six :
//   //            'six';
//
// }
//
// function setBikeStationColour(bikes, totalStands) {
//   let percentageFree = (bikes / totalStands) * 100;
//   return percentageFree < 20 ? '#eff3ff' :
//     percentageFree < 40 ? '#c6dbef' :
//     percentageFree < 60 ? '#9ecae1' :
//     percentageFree < 80 ? '#6baed6' :
//     percentageFree < 101 ? '#3182bd' :
//     percentageFree < 120 ? '#08519c' :
//     '#000000';
//
// }
//
//
// let legend = L.control({
//   position: 'bottomright'
// });
//
// legend.onAdd = function(map) {
//   let div = L.DomUtil.create('div', 'info legend'),
//     bikeGrades = [0, 20, 40, 60, 80],
//     labels = [],
//     from, to;
//   //    labels.push('Bike Stations');
//   labels.push('Dublin Bikes Availability');
//   for (let i = bikeGrades.length - 1; i >= 0; i--) {
//     from = bikeGrades[i];
//     to = bikeGrades[i + 1];
//     labels.push('<i style="background: ' + setBikeStationColour(from, 100) + '"></i>' +
//       +from + (to ? '%&ndash;' + to + '%' : '%' + '+'));
//   }
//   div.innerHTML = labels.join('<br>');
//   return div;
// };
//
// legend.addTo(bikesMap);

/************************************
 * Bus Stops
 ************************************/

// let osmBus = new L.TileLayer(stamenTonerUrl_Lite, {
//   minZoom: min_zoom,
//   maxZoom: max_zoom,
//   attribution: stamenTonerAttrib
// });
// let busMap = new L.Map('chart-transport-bus');
// busMap.setView(new L.LatLng(dubLat, dubLng), zoom);
// busMap.addLayer(osmBus);
// let markerRefBus;
// busMap.on('popupopen', function(e) {
//   markerRefBus = e.popup._source;
//   //console.log("ref: "+JSON.stringify(e));
// });
// let busCluster = L.markerClusterGroup();
// let dublinBusMapIcon = L.icon({
//   iconUrl: '/images/transport/bus-15.svg',
//   iconSize: [30, 30], //orig size
//   iconAnchor: [iconAX, iconAY] //,
//   //popupAnchor: [-3, -76]
// });
// d3.json("/data/Transport/busstopinformation_bac.json").then(function(data) {
//   //    console.log("data.results[0]" + JSON.stringify(data.results[0]));
//   processBusStops(data.results); //TODO: bottleneck?
// });
//
// function processBusStops(res_) {
//   //    console.log("Bus data \n");
//   res_.forEach(function(d) {
//     d.lat = +d.latitude;
//     d.lng = +d.longitude;
//     //add a property to act as key for filtering
//     d.type = "Dublin Bus Stop";
//   });
//   //    console.log("Bus Stop: \n" + JSON.stringify(res_[0]));
//   //    console.log("# of bus stops is " + res_.length + "\n"); // +
//   updateMapBuses(res_);
// };
//
// function updateMapBuses(data__) {
//   busCluster.clearLayers();
//   busMap.removeLayer(busCluster);
//   _.each(data__, function(d, i) {
//     let marker = L.marker(new L.LatLng(d.lat, d.lng), {
//       icon: dublinBusMapIcon
//     });
//     marker.bindPopup(getBusContent(d));
//     busCluster.addLayer(marker);
//     //        console.log("getMarkerID: "+marker.optiid);
//   });
//   busMap.addLayer(busCluster);
//   busMap.fitBounds(busCluster.getBounds());
// }
//
//
// function getBusContent(d_) {
//   let str = '';
//   if (d_.fullname) {
//     str += '<b>' + d_.fullname + '</b><br>';
//   }
//   if (d_.stopid) {
//     str += 'Stop ' + d_.stopid + '<br>';
//   }
//   if (d_.operators[0].routes) {
//     str += 'Routes: ';
//     _.each(d_.operators[0].routes, function(i) {
//       str += i;
//       str += ' ';
//     });
//     str += '<br>';
//   }
//   if (d_.address && d_.address !== d_.name) {
//     str += d_.address + '<br>';
//   }
//   //    if (d_.stopid) {
//   //        //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
//   //        str += '<br/><button type="button" class="btn btn-primary busRTPIbutton" data="'
//   //                + d_.stopid + '">Real Time Information</button>';
//   //    }
//   ;
//   return str;
// }

////Handle button in publicMap popup and get RTPI data
//let busAPIBase = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=";
//
//function displayRTPI(sid_) {
//    d3.json(busAPIBase + sid_)
//            .then(function (data) {
////                console.log("Button press " + sid_ + "\n");
//                let rtpiBase = "<br><br><strong> Next Buses: </strong> <br>";
//                let rtpi = rtpiBase;
//                if (data.results.length > 0) {
////                    console.log("RTPI " + JSON.stringify(data.results[0]));
//                    _.each(data.results, function (d, i) {
//                        //console.log(d.route + " Due: " + d.duetime + "");
//                        //only return n results
//                        if (i <= 7) {
//                            rtpi += "<br><b>" + d.route + "</b> " + d.direction + " to " + d.destination;
//                            if (d.duetime === "Due") {
//                                rtpi += "  <b>" + d.duetime + "</b>";
//                            } else {
//                                rtpi += "  <b>" + d.duetime + " mins</b>";
//                            }
//                        }
//
//                    });
//                } else {
//                    //console.log("No RTPI data available");
//                    rtpi += "No Real Time Information Available<br>";
//                }
////                console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
//                markerRefBus.getPopup().setContent(markerRefBus.getPopup().getContent().split(rtpiBase)[0] + rtpi);
//            });
//
//}
//let displayRTPIBounced = _.debounce(displayRTPI, 100); //debounce using underscore
//
////TODO: replace jQ w/ d3 version
//$("div").on('click', '.busRTPIbutton', function () {
//    displayRTPIBounced($(this).attr("data"));
//});
//

/************************************
 * Luas
 ************************************/
// let osmLuas = new L.TileLayer(stamenTonerUrl_Lite, {
//   minZoom: min_zoom,
//   maxZoom: max_zoom,
//   attribution: stamenTonerAttrib
// });
// let luasZoom = 11;
// let luasMap = new L.Map('chart-transport-luas');
// luasMap.setView(new L.LatLng(dubLat - 0.0485, dubLng), luasZoom);
// luasMap.addLayer(osmLuas);
//
// let luasLayer = L.layerGroup();
// let luasLineGreen = new L.geoJSON(null, {
//   "style": {
//     "color": "#4baf56",
//     "weight": 5,
//     "opacity": 0.65
//   }
// });
//
// let luasLineRed = new L.geoJSON(null, {
//   "style": {
//     "color": "#ff4a54",
//     "weight": 5,
//     "opacity": 0.65
//   }
// });
// let luasIcons; //layer holds markers positioned at ends of luas lines
//
// let luasMapIconLineGreenEnd = L.icon({
//   iconUrl: '/images/transport/rail-light-15-g.svg',
//   iconSize: [30, 30], //orig size
//   iconAnchor: [25, -5] //,
//   //popupAnchor: [-3, -76]
// });
//
//
// let luasMapIconLineRedEnd = L.icon({
//   iconUrl: '/images/transport/rail-light-15-r.svg',
//   iconSize: [30, 30], //orig size
//   iconAnchor: [25, -5] //,
//   //popupAnchor: [-3, -76]
// });
//
// let luasMapIconLargeGreen = L.icon({
//   // iconUrl: '/images/transport/rail-light-15-b.svg',
//   iconUrl: '/images/transport/rail-light-g-c-15.svg',
//   iconSize: [30, 30], //orig size
//   iconAnchor: [iconAX, iconAY] //,
//   //popupAnchor: [-3, -76]
// });
//
// let luasMapIconLargeRed = L.icon({
//   // iconUrl: '/images/transport/rail-light-15-b.svg',
//   iconUrl: '/images/transport/rail-light-r-c-15.svg',
//   iconSize: [30, 30], //orig size
//   iconAnchor: [iconAX, iconAY] //,
//   //popupAnchor: [-3, -76]
// });
//
// let luasMapIconSmallGreen = L.icon({
//   //iconUrl: '/images/transport/rail-light-15.svg',
//   iconUrl: '/images/transport/circle-stroked-15-g.svg',
//   iconSize: [15, 15], //orig size
//   iconAnchor: [iconAX / 2, iconAY / 2] //,
//   //popupAnchor: [-3, -76]
// });
//
// let luasMapIconSmallRed = L.icon({
//   //iconUrl: '/images/transport/rail-light-15.svg',
//   iconUrl: '/images/transport/circle-stroked-15-r.svg',
//   iconSize: [15, 15], //orig size
//   iconAnchor: [iconAX / 2, iconAY / 2] //,
//   //popupAnchor: [-3, -76]
// });
//
// //create points on luasMap for Luas stops even if RTI not available
// d3.tsv("/data/Transport/luas-stops.txt").then(function(data) {
//   processLuas(data);
// });
//
// d3.json("/data/Transport/LUAS_Green_Line.geojson").then(function(data) {
//   updateMapLuasLineGreen(data);
// });
//
// d3.json("/data/Transport/LUAS_Red_Line.geojson").then(function(data) {
//   updateMapLuasLineRed(data);
// });
//
// function processLuas(data_) {
//   //    console.log("Luas- \n");
//   data_.forEach(function(d) {
//     d.lat = +d.Latitude;
//     d.lng = +d.Longitude;
//     d.StopID = +d.StopID;
//     //add a property to act as key for filtering
//     d.type = "Luas tram stop";
//     //console.log("luas stop RT : " + d.Name);
//   });
//   updateMapLuas(data_);
// }
// //extend the marker class to hold data used when calling RT data
// let customMarkerLuas = L.Marker.extend({
//   options: {
//     id: 0
//   }
// });
//
// function updateMapLuas(data__) {
//   //hard-coded icons for ends of lines
//   let saggart = L.latLng(53.28467885, -6.43776255);
//   //let point = L.latLng( 53.34835, -6.22925833333333 );
//   let bridesGlen = L.latLng(53.242075, -6.14288611111111);
//   let m1 = L.marker(saggart, {
//     icon: luasMapIconLineRedEnd
//   });
//   let m2 = L.marker(bridesGlen, {
//     icon: luasMapIconLineGreenEnd
//   });
//
//   luasIcons = L.layerGroup([m1, m2]);
//   _.each(data__, function(d, k) {
//     //console.log("luas id: " + d.LineID + "\n");
//     let marker = new customMarkerLuas(
//       new L.LatLng(d.lat, d.lng), {
//         icon: getLuasMapIconSmall(d.LineID),
//         id: d.StopID,
//         lineId: d.LineID
//       }
//     );
//     marker.bindPopup(getLuasContent(d));
//     marker.on('click', markerOnClickLuas);
//     luasLayer.addLayer(marker);
//     //console.log("marker ID: "+marker.options.id);
//   });
//   luasMap.addLayer(luasLayer);
//   chooseLookByZoom();
//
// }
//
// function updateMapLuasLineGreen(data__) {
//   luasLineGreen.addData(data__);
//   luasMap.addLayer(luasLineGreen);
//   chooseLookByZoom();
//
// }
//
// function updateMapLuasLineRed(data__) {
//   luasLineRed.addData(data__);
//   luasMap.addLayer(luasLineRed);
//   chooseLookByZoom();
//
// }
//
// function getLuasLine(id_) {
//   return (id_ === "1" ? "Red" : "Green");
// }
//
// function getLuasMapIconSmall(id_) {
//   // console.log("icon: " + d.LineID + "\n");
//   return (id_ === "1" ? luasMapIconSmallRed : luasMapIconSmallGreen);
// }
//
// function getLuasMapIconLarge(id_) {
//   // console.log("icon: " + d.LineID + "\n");
//   return (id_ === "1" ? luasMapIconLargeRed : luasMapIconLargeGreen);
// }
//
// function getLuasContent(d_) {
//   let str = '';
//   if (d_.Name) {
//     str += '<b>' + d_.Name + '</b><br>';
//   }
//   if (d_.IrishName) {
//     str += '<i>' + d_.IrishName + '</i><br>';
//   }
//   if (d_.LineID) {
//     str += getLuasLine(d_.LineID) + ' Line <br>';
//   }
//   // if (d_.StopID) {
//   //     // str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
//   //     //         + d_.StopID + '">Real Time Information</button>';
//   //
//   //     str+= displayLuasRT(d_.StopID);
//   //     console.log("Get luas rt for "+d_.StopID);
//   //
//   //     //console.log(displayLuasRT(d_.StopID));
//   // }
//   // ;
//
//   return str;
// }
//
//
//
// let luasAPIBase = "https://luasforecasts.rpa.ie/analysis/view.aspx?id=";
//
//
// function markerOnClickLuas(e) {
//   let sid_ = this.options.id;
//   console.log("marker " + sid_ + "\n");
//   //Luas API returns html, so we need to parse this into a suitable JSON structure
//   d3.html(luasAPIBase + sid_)
//     .then(function(htmlDoc) {
//       //                console.log(htmlDoc.body);
//       let infoString = htmlDoc.getElementById("cplBody_lblMessage")
//         .childNodes[0].nodeValue;
//       //console.log("info: " + infoString + "\n");
//       let headings = htmlDoc.getElementsByTagName("th");
//       //console.log("#cols = " + headings.length + "\n");
//       let rows = htmlDoc.getElementsByTagName("tr");
//       //console.log("#rows = " + rows.length + "\n");
//       let tableData = [];
//       for (let i = 1; i < rows.length; i += 1) {
//         let obj = {};
//         for (let j = 0; j < headings.length; j += 1) {
//           let heading = headings[j]
//             .childNodes[0]
//             .nodeValue;
//           let value = rows[i].getElementsByTagName("td")[j].innerHTML;
//           //console.log("\nvalue: "+ value);
//           obj[heading] = value;
//         }
//         //console.log("\n");
//         tableData.push(obj);
//       }
//       //console.log("tabledata: " + JSON.stringify(tableData));
//       let luasRTBase = "<br><br> Next trams after ";
//       let luasRT = luasRTBase + infoString.split("at ")[1] + "<br>";
//       if (tableData.length > 0) {
//         //                    console.log("RTPI " + JSON.stringify(data.results[0]));
//         _.each(tableData, function(d, i) {
//           //console.log(d.route + " Due: " + d.duetime + "");
//           //only return n results
//           if (i <= 7) {
//             luasRT += "<br><b>" + d["Direction"] +
//               "</b> to <b>" + d["Destination"] + "</b>";
//             if (d["Time"]) {
//               let min = d["Time"].split(":")[1];
//               if (min === "00") {
//                 luasRT += " is <b>Due now</b>";
//
//               } else {
//                 luasRT += " is due in <b>" + min + "</b> mins";
//               }
//             } else {
//               "n/a";
//             }
//           }
//
//         });
//       } else {
//         //console.log("No RTPI data available");
//         luasRT += "No Real Time Information Available<br>";
//       }
//     });
// }
//
// //Adapt map features for various zoom levels
// luasMap.on('zoomend', function(ev) {
//   chooseLookByZoom();
//
// });
//
// function chooseLookByZoom() {
//   console.log("Zoom: " + luasMap.getZoom());
//
//   if (luasMap.getZoom() < 12) {
//     if (!luasMap.addLayer(luasIcons)) {
//       luasMap.addLayer(luasIcons);
//     }
//     luasMap.removeLayer(luasLayer);
//
//   } else if (luasMap.getZoom() < 13) {
//     if (!luasMap.addLayer(luasIcons)) {
//       luasMap.addLayer(luasIcons);
//     }
//     if (!luasMap.addLayer(luasLayer)) {
//       luasMap.addLayer(luasLayer);
//     }
//     //each layer is actually a marker
//     luasLayer.eachLayer(function(marker) {
//       //get the line id set in the custom marker to choose red or grreen icon
//       let lId = luasLayer.getLayer(luasLayer.getLayerId(marker)).options.lineId;
//       marker.setIcon(getLuasMapIconSmall(lId));
//     });
//   } else {
//     luasMap.removeLayer(luasIcons);
//     if (!luasMap.addLayer(luasLayer)) {
//       luasMap.addLayer(luasLayer);
//     }
//     luasLayer.eachLayer(function(marker) {
//       //get the line id set in the custom marker to choose red or grreen icon
//       let lId = luasLayer.getLayer(luasLayer.getLayerId(marker)).options.lineId;
//       marker.setIcon(getLuasMapIconLarge(lId));
//     });
//   }
// }

/************************************
 * Fingal Disabled Parking Map
 ************************************/

/************************************
 * Button listeners
//  ************************************/
// d3.select(".public_transport_bikes").on("click", function() {
//   //    console.log("bikes");
//   bikesMap.removeLayer(busCluster);
//   bikesMap.removeLayer(luasCluster);
//   if (!bikesMap.hasLayer(bikeCluster)) {
//     bikesMap.addLayer(bikeCluster);
//   }
//   bikesMap.fitBounds(bikeCluster.getBounds());
// });
// d3.select(".public_transport_buses").on("click", function() {
//   //    console.log("buses");
//   publicMap.removeLayer(bikeCluster);
//   publicMap.removeLayer(luasCluster);
//   if (!publicMap.hasLayer(busCluster)) {
//     publicMap.addLayer(busCluster);
//   }
//   publicMap.fitBounds(busCluster.getBounds());
// });
// d3.select(".public_transport_luas").on("click", function() {
//   //    console.log("luas");
//   publicMap.removeLayer(bikeCluster);
//   publicMap.removeLayer(busCluster);
//   if (!publicMap.hasLayer(luasCluster)) {
//     publicMap.addLayer(luasCluster);
//   }
//   publicMap.fitBounds(luasCluster.getBounds());
// });
// d3.select(".public_transport_all").on("click", function() {
//   //    console.log("all");
//   if (!publicMap.hasLayer(busCluster)) {
//     publicMap.addLayer(busCluster);
//   }
//   if (!publicMap.hasLayer(luasCluster)) {
//     publicMap.addLayer(luasCluster);
//   }
//   if (!publicMap.hasLayer(bikeCluster)) {
//     publicMap.addLayer(bikeCluster);
//   }
//   publicMap.fitBounds(busCluster.getBounds());
// });
// d3.select(".parking_multi").on("click", function() {
//   //    console.log("bikes");
//   //    parkingMap.removeLayer(busCluster);
//   //    parkingMap.removeLayer(luasCluster);
//   if (!parkingMap.hasLayer(carparkCluster)) {
//     parkingMap.addLayer(carparkCluster);
//   }
//   parkingMap.fitBounds(carparkCluster.getBounds());
// });