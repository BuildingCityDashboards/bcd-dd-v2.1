let bikeTime = d3.timeFormat("%a %B %d, %H:%M");

//  1. declare map variables and initialise base map
let map = new L.Map('chart-public-transport');
let plotlist;
let plotlayers = [];
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


let bikeCluster = L.markerClusterGroup();
let busCluster = L.markerClusterGroup();
let carparkCluster = L.markerClusterGroup();

let iconAX = 15;  //icon Anchor X
let iconAY = 15; //icon Anchor Y
//            Custom map icons
let dublinBikeMapIcon = L.icon({
    iconUrl: '/images/transport/bicycle-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

/*
 * Carparks
 */
let carparkMapIcon = L.icon({
    iconUrl: '/images/transport/parking-garage-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

//create points on map for carparks even if RTI not available
d3.json("/data/Transport/cpCaps.json").then(function (data) {
//    let keys = d3.keys(data.carparks);
//    console.log("carpark data.carparks :" + JSON.stringify(data.carparks[keys[0]]));
    console.log("data.carparks :" + JSON.stringify(data.carparks));

    updateMapCarparks(data.carparks);
});

//function processCarparks(data_) {
//    let keys = d3.keys(data_);
////    let carparks = [];
////    console.log("Car Park data \n");
////    console.log("keys: "+keys);
//    
//    //TODO convert to arrow function/ d3
////    for (let i = 0; i < keys.length; i += 1) {
////        carparks.push(data_[keys[i]]);
////        console.log("push: " + JSON.stringify(data_[keys[i]]));
////    }
////    ;
//    data_.forEach(function (d, i) {
//        d.id = d.keys[i];        
//    });
//    console.log("Car Parks [key]: " + JSON.stringify(data_["PARNELL"]));
//    updateMapCarparks(data_);
//    
//};


function updateMapCarparks(data__) {
    carparkCluster.clearLayers();
    map.removeLayer(carparkCluster);
    let keys = d3.keys(data__);
    console.log("keys: " + keys);
    _.each(data__, function (d, k) {
        console.log("d: " + JSON.stringify(d) + "key: " + k);
        let marker = L.marker(new L.LatLng(d[0].lat, d[0].lon), {icon: carparkMapIcon});
        marker.bindPopup(getCarparkContent(d[0], k));
        carparkCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    map.addLayer(carparkCluster);
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


/************************************
 * Bikes
 ************************************/

d3.json("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=7189fcb899283cf1b42a97fc627eb7682ae8ff7d").then(function (data) {
    //console.log(data[0]);
    processBikes(data);
});

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
//        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
}
;
function updateMapBikes(data__) {
    bikeCluster.clearLayers();
    map.removeLayer(bikeCluster);
    _.each(data__, function (d, i) {
        bikeCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBikeMapIcon})
                .bindPopup(getBikeContent(d)));
    });
    map.addLayer(bikeCluster);
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

/*
 * Bus Stops
 */

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
    busCluster.clearLayers();
    map.removeLayer(busCluster);
    _.each(data__, function (d, i) {
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: dublinBusMapIcon});
        marker.bindPopup(getBusContent(d));
        busCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    map.addLayer(busCluster);
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


//    /*****************************/
//
////                3. Create subsets of data as necessary using d3
//    //Create a Crossfilter instance
//    let xRecords = crossfilter(allHealthCenters);
//    console.log("crossfilter count: " + xRecords.size());
////               Define Dimensions
//    let typeDim = xRecords.dimension(function (d) {
////                    console.log("hospitals d:" + JSON.stringify(d.type));
//        return d.type;
//    });
//
//    let allDim = xRecords.dimension(function (d) {
//        return d;
//    });
//
//    let typeGroup = typeDim.group(); // an array containing a key ('Hospital', 
//    //'GP' etc. and value (no. of occurances) e.g '8', '638'
//    let allGroup = allDim.groupAll();
//
//    typeCount.dimension(xRecords)
//            .group(allGroup);
//
//    typePie.width(500)
//            .height(300)
//            .slicesCap(5)
//            .innerRadius(25)
//            .dimension(typeDim)
//            .group(typeGroup)
//            .legend(dc.legend())
//            .transitionDuration(750)
//            // workaround for #703: not enough data is accessible through .label() to display percentages
//            .on('pretransition', function (chart) {
//                chart.selectAll('text.pie-slice').text(function (d) {
//                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
//                })
//            });
//
//
////    let dcCharts = [typePie]; //the charts upon which we want to detect application of filters
//
////Update the map if any dc chart gets filtered. Filters apply across the crossfilter (duh)
////    _.each(dcCharts, function (dcChart) {
////        dcChart.on("filtered", function (chart, filter) {
////            updateMap();
////            if(filter!==null){
////            d3.select('#type-filter-text').html("<br>"+filter);
////        }
////        else{
////            d3.select('#type-filter-text').html("");
////        }
////        });
////    });
//    dc.renderAll();
//    updateMap();
//
//
////                4. Load map data

//
//    function getIcon(t) {
//        if (t === "hospitals") {
//            return hospitalIcon;
//        } else if (t === "general practitioners") {
//            return gpIcon;
//        } else if (t === "dentists") {
//            return dentistIcon;
//        } else if (t === "pharmacies") {
//            return pharmacyIcon;
//        } else {
//            return healthCenterIcon;
//        }
//    }
//
//    //Button helper functions
//    d3.select('#hospital_button').on('click', function () {
//        typeDim.filter("hospitals");
//        typePie.filter(null)
//                .filter("hospitals");
//        d3.select('#chosen-type-text').text("Available datasets for hospitals:"); //TODO: hacky- fix using filter and dim
//        dc.redrawAll();
//        updateMap();
//    });
//

//    d3.select('#all_button').on('click', function () {
//        d3.select('#chosen-type-text').text("Choose a health location type to see available datasets.");
//        d3.select('#type-filter-text').text('');
//        dc.filterAll();
//        dc.redrawAll();
//        updateMap();
//    });
//
//
//}//End of processInputs()


