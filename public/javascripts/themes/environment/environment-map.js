let popupTime = d3.timeFormat("%a %B %d, %H:%M");

//  1. declare map variables and initialise base map
let map = new L.Map('chart-environment-map');
let dubLat = 53.3498;
let dubLng = -6.2603;
let min_zoom = 8, max_zoom = 18;
let zoom = 10;
// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
let osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
let osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
let osm = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

map.setView(new L.LatLng(dubLat, dubLng), zoom);
map.addLayer(osm);
let markerRef; //TODO: fix horrible hack!!!
map.on('popupopen', function (e) {
    markerRef = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});
let waterLevelCluster = L.markerClusterGroup();
let hydronetCluster = L.markerClusterGroup();
let iconAX = 15;  //icon Anchor X
let iconAY = 15; //icon Anchor Y
//            Custom map icons
let waterLevelMapIcon = L.icon({
    iconUrl: '/images/environment/water-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
//Proj4js.defs["EPSG:29903"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29903", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

const firstProjection = "EPSG:3857";
const secondProjection = "EPSG:4326";


/************************************
 * OPW Water Levels
 ************************************/

//let corsAnywhere = "https://cors-anywhere.herokuapp.com/";
//d3.json(corsAnywhere+"https://waterlevel.ie/geojson/latest/")
d3.json('/data/Environment/waterlevel.json')
        .then(function (data) {
//            console.log(data.features);
            processWaterLevels(data.features);
        });

function processWaterLevels(data_) {
//    console.log("WL data \n");
    data_.forEach(function (d) {
        d.lat = +d.geometry.coordinates[1];
        d.lng = +d.geometry.coordinates[0];
        d.type = "OPW GPRS Station- Water Level Monitor";
    });
//   console.log("Monitor:" + JSON.stringify(data_[0]));
    updateMapWaterLevels(data_);
}
;
function updateMapWaterLevels(data__) {
    waterLevelCluster.clearLayers();
    map.removeLayer(waterLevelCluster);
    _.each(data__, function (d, i) {
        waterLevelCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {icon: waterLevelMapIcon})
                .bindPopup(getWaterLevelContent(d)));
    });
    map.addLayer(waterLevelCluster);
}

//arg is object
function getWaterLevelContent(d_) {
    let str = '';
    if (d_.properties["station.name"]) {
        str += '<b>' + d_.properties["station.name"] + '</b><br>'
                + 'Sensor ' + d_.properties["sensor.ref"] + '<br>'
                + d_.type + '<br>';
    }
    if (d_.properties["value"]) {
        str += '<br><b>Water level: </b>' + d_.properties["value"] + '<br>';
    }
    if (d_.properties.datetime) {
        str += '<br>Last updated on ' + popupTime(new Date(d_.properties.datetime)) + '<br>';
    }
    return str;
}

/*
 * Hydronet 
 */
let carparkMapIcon = L.icon({
    iconUrl: '/images/transport/parking-garage-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

d3.csv("/data/Environment/Register of Hydrometric Stations in Ireland 2017_Dublin.csv").then(function (data) {
//    let keys = d3.keys(data.carparks);
//    console.log("carpark data.carparks :" + JSON.stringify(data.carparks[keys[0]]));
    console.log("EPA :" + JSON.stringify(data[0]));
    processHydronet(data);
});

function processHydronet(data_) {

//    let carparks = [];
//    console.log("Car Park data \n");
//    console.log("keys: "+keys);

    //TODO convert to arrow function/ d3
//    for (let i = 0; i < keys.length; i += 1) {
//        carparks.push(data_[keys[i]]);
//        console.log("push: " + JSON.stringify(data_[keys[i]]));
//    }
//    ;
    data_.forEach(function (d, i) {
        
        var result = proj4(firstProjection, secondProjection,
                [+d["EASTING"], +d["NORTHING"]]);
        d.lat = result[0];
        d.lng = result[1];
        
        console.log("d.x: " + d.lat);
    });

    updateMapHydronet(data_);

}
;


function updateMapHydronet(data__) {
    hydronetCluster.clearLayers();
    map.removeLayer(hydronetCluster);
//    let keys = d3.keys(data__);
//    console.log("keys: " + keys);
    _.each(data__, function (d, k) {
//        console.log("d: " + JSON.stringify(d) + "key: " + k);
        let marker = L.marker(new L.LatLng(d[0].lat, d[0].lon), {icon: waterLevelIcon});
        marker.bindPopup(getCarparkContent(d[0], k));
        hydronetCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    map.addLayer(hydronetCluster);
}

function getCarparkContent(d_, k_) {
    let str = '';
    if (d_.name) {
        str += d_.name + '<br>';
    }
    if (d_.Totalspaces) {
        str += 'Capacity is ' + d_.Totalspaces + '<br>';
    }
    if (d_.name) {
        //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
        str += '<br/><button type="button" class="btn btn-primary carparkbutton" data="'
                + k_ + '">Check Available Spaces</button>';
    }
    ;
    return str;
}

//Handle button in map popup and get carpark data
function displayCarpark(k_) {
    //CORS error on dev- use URL in production
    fetch("https://www.dublincity.ie/dublintraffic/cpdata.xml",
            {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "no-cors", // no-cors, cors, *same-origin
                headers: {
                    Accept: 'text/xml',
                },
            })
            .then(response => response.text())
            .then(data => {
                // Here's a list of repos!
                console.log("fetch success: " + data);
            })
            .catch(function (error) {

                console.log("fetch error: " + error);
                // If there is any error you will catch them here
            });


    d3.xml("https://cors-anywhere.herokuapp.com/https://www.dublincity.ie/dublintraffic/cpdata.xml").then(function (xmlDoc) {
//    d3.xml("/data/Transport/cpdata.xml").then(function (xmlDoc) {

//        if (error) {
//            console.log("error retrieving data");
//            return;
//        }
        //TODO: convert to arrow function + d3
        let timestamp = xmlDoc.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue;
        console.log("timestamp :" + timestamp);
        for (let i = 0; i < xmlDoc.getElementsByTagName("carpark").length; i += 1) {
            let name = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("name");
            if (name === k_) {
                let spaces = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("spaces");
//                console.log("found:"+name+" spaces: "+spaces+"marker"
//                        +markerRef.getPopup().getContent());
                if (spaces !== ' ') {
                    return markerRef.getPopup().setContent(markerRef.getPopup().getContent()
                            + '<br><br> Free spaces: '
                            + spaces
                            + '<br> Last updated: '
                            + timestamp
                            );
                } else {
                    return markerRef.getPopup().setContent(markerRef.getPopup().getContent()
                            + '<br><br> No information on free spaces available'
                            + '<br> Last updated: '
                            + timestamp
                            );
                }
            }
        }
    });
}
let displayCarparkBounced = _.debounce(displayCarpark, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.carparkbutton', function () {
    displayCarparkBounced($(this).attr("data"));
});



/*
 * Bus Stops
 */

let dublinBusMapIcon = L.icon({
    iconUrl: '/images/transport/bus-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

//d3.json("/data/Transport/busstopinformation_bac.json").then(function (data) {
////    console.log("data.results[0]" + JSON.stringify(data.results[0]));
//    processBusStops(data.results); //TODO: bottleneck?
//});


function processBusStops(res_) {
    console.log("Bus data \n");
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
    hydronetCluster.clearLayers();
    map.removeLayer(hydronetCluster);
    _.each(data__, function (d, i) {
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBusMapIcon});
        marker.bindPopup(getBusContent(d));
        hydronetCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    map.addLayer(hydronetCluster);
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

//Handle button in map popup and get RTPI data
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
                console.log("split " + markerRef.getPopup().getContent().split(rtpi)[0]);
                markerRef.getPopup().setContent(markerRef.getPopup().getContent().split(rtpiBase)[0] + rtpi);
            });

}
let displayRTPIBounced = _.debounce(displayRTPI, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.busRTPIbutton', function () {
    displayRTPIBounced($(this).attr("data"));
});

