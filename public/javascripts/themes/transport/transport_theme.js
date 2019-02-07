/************************************
 * Bikes
 ************************************/
let dublinBikeMapIcon = L.icon({
    iconUrl: '/images/transport/bicycle-w-blue-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
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
let markerRefBike; //TODO: fix horrible hack!!!
bikeMap.on('popupopen', function (e) {
    markerRefBike = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});

let bikeCluster = L.markerClusterGroup();

let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
d3.json("/data/Transport/bikesData.json").then(function (data) {
    //console.log(data[0]);
    processBikes(data);
});
/* TODO: performance- move to _each in updateMap */
function processBikes(data_) {
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
function updateMapBikes(data__) {
    bikeCluster.clearLayers();
    bikeMap.removeLayer(bikeCluster); //required
    _.each(data__, function (d, i) {
        bikeCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBikeMapIcon})
                .bindPopup(getBikeContent(d)));
    });
    bikeMap.addLayer(bikeCluster);
    bikeMap.fitBounds(bikeCluster.getBounds());
}

//arg is object
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
    if (d_.bike_stands) {
        str += '<br><b>' + d_.bike_stands + '</b>' + ' stands<br>';
    }

    return str;
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
    iconAnchor: [iconAX, iconAY]//,
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
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBusMapIcon});
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
        str += '<b>'+d_.fullname + '</b><br>';
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
    iconAnchor: [iconAX, iconAY]//,
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
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: luasMapIcon});
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
    iconAnchor: [iconAX, iconAY]//,
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
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: disabledParkingkMapIcon});
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
        str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
                + d_.StopID + '">Real Time Information</button>';
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


