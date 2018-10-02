let osmPrivate = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});

let privateMap = new L.Map('chart-private-transport');
privateMap.setView(new L.LatLng(dubLat, dubLng), zoom);
privateMap.addLayer(osmPrivate);

let markerRefPrivate; //TODO: fix horrible hack!!!
privateMap.on('popupopen', function (e) {
    markerRefPrivate = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});

let carparkCluster = L.markerClusterGroup();
let disabledParkingCluster = L.markerClusterGroup();
/************************************
 * Carparks
 ************************************/
let carparkMapIcon = L.icon({
    iconUrl: '/images/transport/parking-garage-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

//create points on privateMap for carparks even if RTI not available
d3.json("/data/Transport/cpCaps.json").then(function (data) {
//    console.log("data.carparks :" + JSON.stringify(data.carparks));
    updateMapCarparks(data.carparks);
});

function updateMapCarparks(data__) {
    carparkCluster.clearLayers();
    privateMap.removeLayer(carparkCluster);
    let keys = d3.keys(data__);
//    console.log("keys: " + keys);
    _.each(data__, function (d, k) {
//        console.log("d: " + JSON.stringify(d) + "key: " + k);
        let marker = L.marker(new L.LatLng(d[0].lat, d[0].lon), {icon: carparkMapIcon});
        marker.bindPopup(getCarparkContent(d[0], k));
        carparkCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    privateMap.addLayer(carparkCluster);
//    privateMap.fitBounds(carparkCluster.getBounds());
}

function getCarparkContent(d_, k_) {
    let str = '';
    if (d_.name) {
        str += d_.name + '<br>';
    }
//    if (d_.Totalspaces) {
//        str += 'Capacity is ' + d_.Totalspaces + '<br>';
//    }
    if (d_.name) {
        //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
        str += '<br/><button type="button" class="btn btn-primary carparkbutton" data="'
                + k_ + '">Check Available Spaces</button>';
    }
    ;
    return str;
}

//Handle button in privateMap popup and get carpark data
function displayCarpark(k_) {
//    d3.xml("https://cors-anywhere.herokuapp.com/https://www.dublincity.ie/dublintraffic/cpdata.xml").then(function (xmlDoc) {
    d3.xml("/data/Transport/cpdata.xml").then(function (xmlDoc) {

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
//                        +markerRefPrivate.getPopup().getContent());
                if (spaces !== ' ') {
                    return markerRefPrivate.getPopup().setContent(markerRefPrivate.getPopup().getContent()
                            + '<br><br> Free spaces: '
                            + spaces
                            + '<br> Last updated: '
                            + timestamp
                            );
                } else {
                    return markerRefPrivate.getPopup().setContent(markerRefPrivate.getPopup().getContent()
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
 * Disabled Parking
 ************************************/
let disabledParkingkMapIcon = L.icon({
    iconUrl: '/images/transport/parking-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});

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
    updateMapDisabledParking(data_);
}

function updateMapDisabledParking(data__) {
    disabledParkingCluster.clearLayers();
    privateMap.removeLayer(disabledParkingCluster);
    _.each(data__, function (d, k) {
//        console.log("d: " + d.type + "\n");
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: disabledParkingkMapIcon});
        marker.bindPopup(getDisbaledParkingContent(d));
        disabledParkingCluster.addLayer(marker);
    });
    privateMap.addLayer(disabledParkingCluster);
    privateMap.fitBounds(disabledParkingCluster.getBounds());
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
    if (d_["DIPPED_FOOTPATH"]==="TRUE") {
        str += '<i>This parking bay HAS a dipped footpath</i> <br>';
    }
    else{
        str += '<i>This parking bay DOES NOT HAVE a dipped footpath</i> <br>';
    }
    if (d_.Name) {
        str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
                + d_.StopID + '">Real Time Information</button>';
    }
    ;

    return str;
}



////Button listeners
d3.select(".parking_multi").on("click", function () {
//    console.log("bikes");
//    privateMap.removeLayer(busCluster);
//    privateMap.removeLayer(luasCluster);
    if (!privateMap.hasLayer(carparkCluster)) {
        privateMap.addLayer(carparkCluster);
    }
    privateMap.fitBounds(carparkCluster.getBounds());
});
//
//d3.select(".public_transport_buses").on("click", function () {
////    console.log("buses");
//    privateMap.removeLayer(bikeCluster);
//    privateMap.removeLayer(luasCluster);
//    if (!privateMap.hasLayer(busCluster)) {
//        privateMap.addLayer(busCluster);
//    }
//    privateMap.fitBounds(busCluster.getBounds());
//});
//
//d3.select(".public_transport_luas").on("click", function () {
////    console.log("luas");
//    privateMap.removeLayer(bikeCluster);
//    privateMap.removeLayer(busCluster);
//    if (!privateMap.hasLayer(luasCluster)) {
//        privateMap.addLayer(luasCluster);
//    }
//    privateMap.fitBounds(luasCluster.getBounds());
//});
//d3.select(".public_transport_all").on("click", function () {
////    console.log("all");
//    if (!privateMap.hasLayer(busCluster)) {
//        privateMap.addLayer(busCluster);
//    }
//    if (!privateMap.hasLayer(luasCluster)) {
//        privateMap.addLayer(luasCluster);
//    }
//    if (!privateMap.hasLayer(bikeCluster)) {
//        privateMap.addLayer(bikeCluster);
//    }
//    privateMap.fitBounds(busCluster.getBounds());
//
//});


