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


let disabledParkingCluster = L.markerClusterGroup();
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


