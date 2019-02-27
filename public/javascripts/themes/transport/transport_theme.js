/************************************
 * Bikes
 ************************************/
let dublinBikeMapIcon = L.icon({
    iconUrl: '/images/transport/bicycle-w-blue-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY] //,
            //popupAnchor: [-3, -76]
});

let osmBike = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

let bikeMap = new L.Map('chart-transport-bikes');
bikeMap.setView(new L.LatLng(dubLat, dubLng), zoom);
bikeMap.addLayer(osmBike);


// var features = {
//   "type": "featureCollection",
//   features: [{
//     "type": "Feature",
//     "properties": {
//       data: [10, 12, 16, 20, 25, 30, 30, 29, 13, 10, 7, 6],
//       title: "Injuries Due to Swan Bite by Month"
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [-6.2603, 53.3498]
//     }
//   }]
// };
//
// d3.json('/data/Transport/bikesData.json ')
//   .addTo(bikeMap);
// // .bindPopup(popupChart);


let bikeCluster = L.markerClusterGroup();

let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
let bikeHour = d3.timeFormat("%H");
//Get latest bikes data from file, display in map iconography
d3.json("/data/Transport/bikesData.json").then(function (data) {
    //console.log(data[0]);
    processLatestBikes(data);
});

/*Gather historical bike data for the day 4am to 1am*/
//TODO: check files exist
//for (let i = 0; i < 22; i += 1) {
//
//  let hour = (i + 4) % 24;
//
//  d3.json("/data/Transport/bikesData/bikesData-" + hour + ".json").then(function(data) {
//    //console.log("i: " + i + " hour: " + hour);
//
//    //data.forEach(function(d) {
//    if (data[0].last_update) {
//      //console.log("stamp: " + data[0].last_update);
//      let updateTime = bikeHour(new Date(data[0].last_update));
//      //console.log("update hour: " + updateTime);
//    }
//    //});
//  });
//}


/* TODO: performance- move to _each in updateMap */
function processLatestBikes(data_) {
    let bikeStands = 0;
    //console.log("Bike data \n");
    data_.forEach(function (d) {
        d.lat = +d.position.lat;
        d.lng = +d.position.lng;
        //add a property to act as key for filtering
        d.type = "Dublin Bike Station";
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
}
;

//let markerRefBike; //TODO: fix horrible hack!!!
let customBikesStationMarker = L.Marker.extend({
    options: {
        id: 0
    }
});

function updateMapBikes(data__) {
    bikeCluster.clearLayers();
    bikeMap.removeLayer(bikeCluster); //required
    _.each(data__, function (d, i) {
        let m = new customBikesStationMarker(
                new L.LatLng(d.lat, d.lng), {
            id: d["number"],
            icon: dublinBikeMapIcon
        });
        m.bindPopup(bikesStationPopupInit(d));
        m.on('click', makeSpark);
        bikeCluster.addLayer(m);
    });

    bikeMap.addLayer(bikeCluster);
    bikeMap.fitBounds(bikeCluster.getBounds());
}

function getBikesStationChart() {
    let sid_ = this.options.id;
    console.log("marker click for station " + sid_ + "\n");
    d3.json("/api/dublinbikes/stations/" + sid_ + "/today").then(
            makeSpark()
//            function (stationData) {
//                getBikesStationPopupChart();
//                console.log("stationData length" + stationData.length + "\n" + JSON.stringify(stationData[0]));
//            }

//        let clean = d3.nest()
//                .key(function (d) {
//                    return d["last_update"];
//                })
//                .rollup(function (d) {
//                    return d;
//                })
//                .entries(stationData);
////        console.log("clean "+clean.length +"\n" + JSON.stringify(clean) + "\n");


            // }
            );
}

function bikesStationPopupInit(d_) {
    let str = '';
    if (d_.name) {
        str += d_.name + '<br>';
    }
    if (d_.type) {
        str += d_.type + '<br>';
    }
    if (d_.bike_stands) {
        str += '<br><b>' + d_.bike_stands + '</b>' + ' stands<br>';
        str += '<div id="bike-spark-' + d_.number + '"> chart ' + d_.number + '</div>';
    }
    return str;
}


//Sparkline for poppup
function makeSpark() {
    //d3.select("#bike-spark-67").text('Selected from D3');
    let sid_ = this.options.id;
    let bikeSpark = dc.barChart("#bike-spark-" + sid_);
    d3.json("/api/dublinbikes/stations/" + sid_ + "/today").then(function (stationData) {

        let ndx = crossfilter(stationData);
        let dateDim = ndx.dimension(function (d) {
            return d["last_update"];
        });
        let dateGroup = dateDim.group();

        bikeSpark.width(300).height(100);
        bikeSpark.dimension(dateDim);
        bikeSpark.group(dateGroup);
        bikeSpark.margins({
            left: 50,
            top: 0,
            right: 10,
            bottom: 20
        });
        let start = moment.utc().startOf('day');
        let end = moment.utc().endOf('day');

        bikeSpark.x(d3.scaleLinear().domain([start, end]));
        bikeSpark.brushOn(false);

        bikeSpark.render();
    });
//    d3.csv("data/morley.csv").then(function (experiments) {
//        experiments.forEach(function (x) {
//            x.Speed = +x.Speed;
//        });
//        let ndx = crossfilter(experiments);
//        let runDimension = ndx.dimension(function (d) {
//            return +d.Run;
//        });
//        let speedSumGroup = runDimension.group().reduceSum(function (d) {
//            return d.Speed * d.Run / 1000;
//        });
//
//        bikeSpark.width(300).height(50);
//        bikeSpark.dimension(runDimension);
//        bikeSpark.group(speedSumGroup);
//        bikeSpark.margins({
//            left: 0,
//            top: 0,
//            right: 0,
//            bottom: 0
//        })
//        bikeSpark.x(d3.scaleLinear().domain([6, 20]));
//        // .brushOn(true)
//
//        bikeSpark.render();
//    });
}



function getBikesStationPopupChart(d_) {
    // var feature = d_.feature;
    //var data = feature.properties.data;
    //console.log("popup #"+d_.number);

    d3.select("#bike-spark-67").text('Selected from D3');

    var width = 300;
    var height = 80;
    var margin = {
        left: 20,
        right: 15,
        top: 40,
        bottom: 40
    };

    var parse = d3.timeParse("%m");
    var format = d3.timeFormat("%b");

    var div = d3.create("div").html("test string");
    var svg = div.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    var g = svg.append("g")
            .attr("transform", "translate(" + [margin.left, margin.top] + ")");

//    let y = d3.scaleLinear()
//            .domain([0, d3.max(d_, function (d) {
//                    return d;
//                })])
//            .range([height, 0]);
//    //
//    var yAxis = d3.axisLeft()
//            .ticks(4)
//            .scale(y);
//    g.append("g").call(yAxis);
//    //
//    var x = d3.scaleBand()
//            .domain(d3.range(12))
//            .range([0, width]);
//    //
//    var xAxis = d3.axisBottom()
//            .scale(x)
//            .tickFormat(function (d) {
//                return format(parse(d + 1));
//            });
//    //
//    g.append("g")
//            .attr("transform", "translate(0," + height + ")")
//            .call(xAxis)
//            .selectAll("text")
//            .attr("text-anchor", "end")
//            .attr("transform", "rotate(-90)translate(-12,-15)");
//    //
//    var rects = g.selectAll("rect")
//            .data(d_)
//            .enter()
//            .append("rect")
//            .attr("y", height)
//            .attr("height", 50)
//            .attr("width", 50)
//            .attr("x", function (d_, i) {
//                return 100;
//            })
//            //.attr("width", x.bandwidth() - 2)
////     .attr("x", function(d, i) {
////       return x(i);
////     })
//            .attr("fill", "steelblue")
//            //.transition()
////     .attr("height", function(d) {
////       return height - y(d);
////     })
////     .attr("y", function(d) {
////       return y(d);
////     })
//            //.duration(1000)
//            ;
//    //
//    var title = svg.append("text")
//            .style("font-size", "20px")
//            .text("test")
//            .attr("x", width / 2 + margin.left)
//            .attr("y", 30)
//            .attr("text-anchor", "middle");

    return div.node();

}



/************************************
 * Bus Stops
 ************************************/

let osmBus = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

let busMap = new L.Map('chart-transport-bus');
busMap.setView(new L.LatLng(dubLat, dubLng), zoom);
busMap.addLayer(osmBus);
let markerRefBus;
busMap.on('popupopen', function (e) {
    markerRefBus = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});

let busCluster = L.markerClusterGroup();

let dublinBusMapIcon = L.icon({
    iconUrl: '/images/transport/bus-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY] //,
            //popupAnchor: [-3, -76]
});

d3.json("/data/Transport/busstopinformation_bac.json").then(function (data) {
    //    console.log("data.results[0]" + JSON.stringify(data.results[0]));
    processBusStops(data.results); //TODO: bottleneck?
});


function processBusStops(res_) {
    //    console.log("Bus data \n");
    res_.forEach(function (d) {
        d.lat = +d.latitude;
        d.lng = +d.longitude;
        //add a property to act as key for filtering
        d.type = "Dublin Bus Stop";

    });
    //    console.log("Bus Stop: \n" + JSON.stringify(res_[0]));
    //    console.log("# of bus stops is " + res_.length + "\n"); // +
    updateMapBuses(res_);
}
;

function updateMapBuses(data__) {
    busCluster.clearLayers();
    busMap.removeLayer(busCluster);
    _.each(data__, function (d, i) {
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {
            icon: dublinBusMapIcon
        });
        marker.bindPopup(getBusContent(d));
        busCluster.addLayer(marker);
        //        console.log("getMarkerID: "+marker.optiid);
    });
    busMap.addLayer(busCluster);
    busMap.fitBounds(busCluster.getBounds());
}


function getBusContent(d_) {
    let str = '';
    if (d_.fullname) {
        str += '<b>' + d_.fullname + '</b><br>';
    }
    if (d_.stopid) {
        str += 'Stop ' + d_.stopid + '<br>';
    }
    if (d_.operators[0].routes) {
        str += 'Routes: ';
        _.each(d_.operators[0].routes, function (i) {
            str += i;
            str += ' ';
        });
        str += '<br>';
    }
    if (d_.address && d_.address !== d_.name) {
        str += d_.address + '<br>';
    }
    //    if (d_.stopid) {
    //        //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
    //        str += '<br/><button type="button" class="btn btn-primary busRTPIbutton" data="'
    //                + d_.stopid + '">Real Time Information</button>';
    //    }
    ;

    return str;
}

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
let osmLuas = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

let luasMap = new L.Map('chart-transport-luas');
luasMap.setView(new L.LatLng(dubLat, dubLng), zoom);
luasMap.addLayer(osmLuas);
let markerRefLuas;
luasMap.on('popupopen', function (e) {
    markerRefLuas = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});

let luasCluster = L.markerClusterGroup();

let luasMapIcon = L.icon({
    iconUrl: '/images/transport/rail-light-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY] //,
            //popupAnchor: [-3, -76]
});

//create points on publicMap for Luas stops even if RTI not available
d3.tsv("/data/Transport/luas-stops.txt").then(function (data) {
    processLuas(data);
});

function processLuas(data_) {
    //    console.log("Luas- \n");
    data_.forEach(function (d) {
        d.lat = +d.Latitude;
        d.lng = +d.Longitude;
        d.StopID = +d.StopID;
        //add a property to act as key for filtering
        d.type = "Luas stop";
        //        console.log("luas stop : " + d.Name);
    });
    updateMapLuas(data_);
}

function updateMapLuas(data__) {
    luasCluster.clearLayers();
    luasMap.removeLayer(luasCluster);
    _.each(data__, function (d, k) {
        //        console.log("k: " + k + "\n");
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {
            icon: luasMapIcon
        });
        marker.bindPopup(getLuasContent(d));
        luasCluster.addLayer(marker);
    });
    luasMap.addLayer(luasCluster);
    luasMap.fitBounds(luasCluster.getBounds());
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
    //    if (d_.Name) {
    //        str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
    //                + d_.StopID + '">Real Time Information</button>';
    //    }
    ;

    return str;
}

function getLuasLine(id_) {
    return (id_ === "1" ? "Red" : "Green");
}

//let luasAPIBase = "https://luasforecasts.rpa.ie/analysis/view.aspx?id=";
//
//
//function displayLuasRT(sid_) {
//    console.log("Button press " + luasAPIBase + sid_ + "\n");
//    //Luas API returns html, so we need to parse this into a suitable JSON structure
//    d3.html(luasAPIBase + sid_)
//            .then(function (htmlDoc) {
////                console.log(htmlDoc.body);
//                let infoString = htmlDoc.getElementById("cplBody_lblMessage")
//                        .childNodes[0].nodeValue;
//                //console.log("info: " + infoString + "\n");
//                let headings = htmlDoc.getElementsByTagName("th");
//                //console.log("#cols = " + headings.length + "\n");
//                let rows = htmlDoc.getElementsByTagName("tr");
//                //console.log("#rows = " + rows.length + "\n");
//                let tableData = [];
//                for (let i = 1; i < rows.length; i += 1) {
//                    let obj = {};
//                    for (let j = 0; j < headings.length; j += 1) {
//                        let heading = headings[j]
//                                .childNodes[0]
//                                .nodeValue;
//                        let value = rows[i].getElementsByTagName("td")[j].innerHTML;
//                        //console.log("\nvalue: "+ value);
//                        obj[heading] = value;
//                    }
//                    //console.log("\n");
//                    tableData.push(obj);
//                }
//                //console.log("tabledata: " + JSON.stringify(tableData));
//                let luasRTBase = "<br><br> Next trams after ";
//                let luasRT = luasRTBase + infoString.split("at ")[1] + "<br>";
//                if (tableData.length > 0) {
////                    console.log("RTPI " + JSON.stringify(data.results[0]));
//                    _.each(tableData, function (d, i) {
//                        //console.log(d.route + " Due: " + d.duetime + "");
//                        //only return n results
//                        if (i <= 7) {
//                            luasRT += "<br><b>" + d["Direction"]
//                                    + "</b> to <b>" + d["Destination"] + "</b>";
//                            if (d["Time"]) {
//                                let min = d["Time"].split(":")[1];
//                                if (min === "00") {
//                                    luasRT += " is <b>Due now</b>";
//
//                                } else {
//                                    luasRT += " is due in <b>" + min + "</b> mins";
//                                }
//                            } else {
//                                "n/a";
//                            }
//                        }
//
//                    });
//                } else {
//                    //console.log("No RTPI data available");
//                    luasRT += "No Real Time Information Available<br>";
//                }
////                console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
//                markerRefLuas.getPopup().setContent(markerRefLuas.getPopup().getContent().split(luasRTBase)[0] + luasRT);
//            });
//}
//let displayLuasRTBounced = _.debounce(displayLuasRT, 100); //debounce using underscore
//
////TODO: replace jQ w/ d3 version
//$("div").on('click', '.luasRTbutton', function () {
//    displayLuasRTBounced($(this).attr("data"));
//});

/************************************
 * Parking Map
 ************************************/

let osmCarpark = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

let parkingMap = new L.Map('chart-transport-parking');
parkingMap.setView(new L.LatLng(dubLat, dubLng), zoom);
parkingMap.addLayer(osmCarpark);

let markerRefCarpark; //TODO: fix horrible hack!!!
parkingMap.on('popupopen', function (e) {
    markerRefCarpark = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});

/************************************
 * Disabled Parking
 ************************************/
let disabledParkingkMapIcon = L.icon({
    iconUrl: '/images/transport/parking-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY] //,
            //popupAnchor: [-3, -76]
});

let disabledParkingCluster = L.markerClusterGroup();

d3.csv("/data/Transport/fccdisabledparking-bayp20111013-2046.csv").then(function (data) {
    //    console.log("DP data length "+data.length);
    processDisabledParking(data); //TODO: bottleneck?
});

function processDisabledParking(data_) {
    //    console.log("- \n");
    data_.forEach(function (d) {
        d.lat = +d["LAT"];
        d.lng = +d["LONG"];
        //        d.StopID = +d.StopID;
        //add a property to act as key for filtering
        d.type = "Fingal County Council Disabled Parking Bay";
        //        console.log("DP bay : " + d.lat);
    });
    d3.select('#fingal-disabled_parking-count').html(data_.length);
    updateMapDisabledParking(data_);
}

function updateMapDisabledParking(data__) {
    disabledParkingCluster.clearLayers();
    parkingMap.removeLayer(disabledParkingCluster);
    _.each(data__, function (d, k) {
        //        console.log("d: " + d.type + "\n");
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {
            icon: disabledParkingkMapIcon
        });
        marker.bindPopup(getDisbaledParkingContent(d));
        disabledParkingCluster.addLayer(marker);
    });
    parkingMap.addLayer(disabledParkingCluster);
    parkingMap.fitBounds(disabledParkingCluster.getBounds());
}

function getDisbaledParkingContent(d_) {
    let str = '';
    if (d_["AREA_DESC"]) {
        str += '<b>' + d_["AREA_DESC"] + '</b><br>';
    }
    if (d_.type) {
        str += '<b>' + d_.type + '</b><br><br>';
    }
    if (d_["TOTAL_SPACES"]) {
        str += 'Total Spaces: ' + d_["TOTAL_SPACES"] + '<br><br>';
    }
    if (d_["DIPPED_FOOTPATH"] === "TRUE") {
        str += '<i>This parking bay HAS a dipped footpath</i> <br>';
    } else {
        str += '<i>This parking bay DOES NOT HAVE a dipped footpath</i> <br>';
    }
    if (d_.Name) {
        str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="' +
                d_.StopID + '">Real Time Information</button>';
    }
    ;

    return str;
}

/************************************
 * Button listeners
 ************************************/
d3.select(".public_transport_bikes").on("click", function () {
    //    console.log("bikes");
    bikeMap.removeLayer(busCluster);
    bikeMap.removeLayer(luasCluster);
    if (!bikeMap.hasLayer(bikeCluster)) {
        bikeMap.addLayer(bikeCluster);
    }
    bikeMap.fitBounds(bikeCluster.getBounds());
});

d3.select(".public_transport_buses").on("click", function () {
    //    console.log("buses");
    publicMap.removeLayer(bikeCluster);
    publicMap.removeLayer(luasCluster);
    if (!publicMap.hasLayer(busCluster)) {
        publicMap.addLayer(busCluster);
    }
    publicMap.fitBounds(busCluster.getBounds());
});

d3.select(".public_transport_luas").on("click", function () {
    //    console.log("luas");
    publicMap.removeLayer(bikeCluster);
    publicMap.removeLayer(busCluster);
    if (!publicMap.hasLayer(luasCluster)) {
        publicMap.addLayer(luasCluster);
    }
    publicMap.fitBounds(luasCluster.getBounds());
});
d3.select(".public_transport_all").on("click", function () {
    //    console.log("all");
    if (!publicMap.hasLayer(busCluster)) {
        publicMap.addLayer(busCluster);
    }
    if (!publicMap.hasLayer(luasCluster)) {
        publicMap.addLayer(luasCluster);
    }
    if (!publicMap.hasLayer(bikeCluster)) {
        publicMap.addLayer(bikeCluster);
    }
    publicMap.fitBounds(busCluster.getBounds());

});

d3.select(".parking_multi").on("click", function () {
    //    console.log("bikes");
    //    parkingMap.removeLayer(busCluster);
    //    parkingMap.removeLayer(luasCluster);
    if (!parkingMap.hasLayer(carparkCluster)) {
        parkingMap.addLayer(carparkCluster);
    }
    parkingMap.fitBounds(carparkCluster.getBounds());
});