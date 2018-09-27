/*TODO:
 * 
 * Check if passing a subset of data increases memory usage e.g. data.properties sent to updateMap
 * Only use a processing fucntion with a text data file (not json)
 * 
 * Test support for DOM node methods on Firefox
 */


//  1. declare publicMap variables and initialise base publicMap
let osmPublic = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

let publicMap = new L.Map('chart-public-transport');
publicMap.setView(new L.LatLng(dubLat, dubLng), zoom);
publicMap.addLayer(osmPublic);
let markerRefPublic; //TODO: fix horrible hack!!!
publicMap.on('popupopen', function (e) {
    markerRefPublic = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});

let bikeCluster = L.markerClusterGroup();
let busCluster = L.markerClusterGroup();
let luasCluster = L.markerClusterGroup();

//            Custom publicMap icons
let dublinBikeMapIcon = L.icon({
    iconUrl: '/images/transport/bicycle-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

/************************************
 * Luas
 ************************************/
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
    publicMap.removeLayer(luasCluster);
    _.each(data__, function (d, k) {
//        console.log("d: " + d.type + "\n");
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: luasMapIcon});
        marker.bindPopup(getLuasContent(d));
        luasCluster.addLayer(marker);
    });
    publicMap.addLayer(luasCluster);
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
    if (d_.Name) {
        str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
                + d_.StopID + '">Real Time Information</button>';
    }
    ;

    return str;
}

function getLuasLine(id_) {
    return (id_ === "1" ? "Red" : "Green");
}

let luasAPIBase = "http://luasforecasts.rpa.ie/analysis/view.aspx?id=";


function displayLuasRT(sid_) {
    console.log("Button press " + luasAPIBase + sid_ + "\n");
    //Luas API returns html, so we need to parse this into a suitable JSON structure
    d3.html(luasAPIBase + sid_)
            .then(function (htmlDoc) {
                console.log(htmlDoc.body);
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
                    _.each(tableData, function (d, i) {
                        //console.log(d.route + " Due: " + d.duetime + "");
                        //only return n results
                        if (i <= 7) {
                            luasRT += "<br><b>" + d["Direction"]
                                    + "</b> to <b>" + d["Destination"] + "</b>";
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
//                console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
                markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(luasRTBase)[0] + luasRT);
            });

}
let displayLuasRTBounced = _.debounce(displayLuasRT, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.luasRTbutton', function () {
    displayLuasRTBounced($(this).attr("data"));
});

/************************************
 * Bikes
 ************************************/
let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
d3.json("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=7189fcb899283cf1b42a97fc627eb7682ae8ff7d").then(function (data) {
    //console.log(data[0]);
    processBikes(data);
});
/* TODO: performance- move to _each in updateMap */
function processBikes(data_) {

    //console.log("Bike data \n");
    data_.forEach(function (d) {
        d.lat = +d.position.lat;
        d.lng = +d.position.lng;
        //add a property to act as key for filtering
        d.type = "Dublin Bike Station";

    });
//    console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
//    console.log("# of bike stations is " + data_.length + "\n"); // +
    updateMapBikes(data_);
}
;
function updateMapBikes(data__) {
    bikeCluster.clearLayers();
    publicMap.removeLayer(bikeCluster);
    _.each(data__, function (d, i) {
        bikeCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBikeMapIcon})
                .bindPopup(getBikeContent(d)));
    });
    publicMap.addLayer(bikeCluster);
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
    if (d_.available_bikes) {
        str += '<br><b>' + d_.available_bikes + '</b>' + ' bikes are available<br>';
    }
    if (d_.available_bike_stands) {
        str += '<b>' + d_.available_bike_stands + '</b>' + ' stands are available<br>';
    }

    if (d_.last_update) {
        str += '<br>Last updated ' + bikeTime(new Date(d_.last_update)) + '<br>';
    }
    return str;
}

/************************************
 * Bus Stops
 ************************************/

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
    publicMap.removeLayer(busCluster);
    _.each(data__, function (d, i) {
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBusMapIcon});
        marker.bindPopup(getBusContent(d));
        busCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    publicMap.addLayer(busCluster);
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
        _.each(d_.operators[0].routes, function (i) {
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
        str += '<br/><button type="button" class="btn btn-primary busRTPIbutton" data="'
                + d_.stopid + '">Real Time Information</button>';
    }
    ;

    return str;
}

//Handle button in publicMap popup and get RTPI data
let busAPIBase = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=";

function displayRTPI(sid_) {
    d3.json(busAPIBase + sid_)
            .then(function (data) {
//                console.log("Button press " + sid_ + "\n");
                let rtpiBase = "<br><br><strong> Next Buses: </strong> <br>";
                let rtpi = rtpiBase;
                if (data.results.length > 0) {
//                    console.log("RTPI " + JSON.stringify(data.results[0]));
                    _.each(data.results, function (d, i) {
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
$("div").on('click', '.busRTPIbutton', function () {
    displayRTPIBounced($(this).attr("data"));
});

//Button listeners
d3.select(".public_transport_bikes").on("click", function () {
//    console.log("bikes");
    publicMap.removeLayer(busCluster);
    publicMap.removeLayer(luasCluster);
    if (!publicMap.hasLayer(bikeCluster)) {
        publicMap.addLayer(bikeCluster);
    }
    publicMap.fitBounds(bikeCluster.getBounds());
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


