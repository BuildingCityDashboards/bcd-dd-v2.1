let popupTime = d3.timeFormat("%a %B %d, %H:%M");
let osmEnv = new L.TileLayer(stamenTerrainUrl, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
});
let waterMap = new L.Map('chart-environment-map');
waterMap.setView(new L.LatLng(dubLat, dubLng), zoom);
waterMap.addLayer(osmEnv);
let markerRefEnv; //TODO: fix horrible hack!!!
waterMap.on('popupopen', function (e) {
    markerRefEnv = e.popup._source;
    //console.log("ref: "+JSON.stringify(e));
});
let waterLevelCluster = L.markerClusterGroup();
let hydronetCluster = L.markerClusterGroup();

//            Custom map icons
let waterLevelMapIcon = L.icon({
    iconUrl: '/images/environment/water-15.svg',
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY]//,
            //popupAnchor: [-3, -76]
});
//
proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
+x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
var firstProjection = "EPSG:29902";
var secondProjection = "EPSG:4326";

/************************************
 * OPW Water Levels
 ************************************/


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
        d.type = "OPW GPRS Station Water Level Monitor";
    });
//   console.log("Monitor:" + JSON.stringify(data_[0]));
    updateMapWaterLevels(data_);
}
;
function updateMapWaterLevels(data__) {
    waterLevelCluster.clearLayers();
    waterMap.removeLayer(waterLevelCluster);
    _.each(data__, function (d, i) {
        waterLevelCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {icon: waterLevelMapIcon})
                .bindPopup(getWaterLevelContent(d)));
    });
    waterMap.addLayer(waterLevelCluster);
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
d3.csv("/data/Environment/Register of Hydrometric Stations in Ireland 2017_Dublin.csv").then(function (data) {
//    let keys = d3.keys(data.carparks);
//    console.log("carpark data.carparks :" + JSON.stringify(data.carparks[keys[0]]));
    console.log("EPA :" + JSON.stringify(data[0]));
    processHydronet(data);
});
function processHydronet(data_) {

    data_.forEach(function (d, i) {

        let result = proj4(firstProjection, secondProjection,
                [+d["EASTING"], +d["NORTHING"]]);
        d.lat = result[1];
        d.lng = result[0];
        d.type = "Hydronet Water Level Monitor";
//        console.log("d: " + d["EASTING"]+" | "+d["NORTHING"]);
//        console.log("dlat " + d.lat+" | dlng "+d.lng);
    });
    updateMapHydronet(data_);
}
;
function updateMapHydronet(data__) {
    hydronetCluster.clearLayers();
    waterMap.removeLayer(hydronetCluster);
//    let keys = d3.keys(data__);
//    console.log("keys: " + keys);
    _.each(data__, function (d, k) {
//        console.log("d: " + JSON.stringify(d) + "key: " + k);
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: waterLevelMapIcon});
        marker.bindPopup(getHydronetContent(d, k));
        hydronetCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    waterMap.addLayer(hydronetCluster);
}

function getHydronetContent(d_, k_) {
    let str = '';
    if (d_["Station Name"]) {
        str += '<b>' + d_["Station Name"] + '</b><br>';
    }
    if (d_.Waterbody) {
        str += 'at ' + d_.Waterbody + '<br>';
    }
    if (d_.Owner) {
        str += '<br>' + d_.Owner + '<br>';
    }

    if (d_["Station Status"]) {
        str += 'Status: ' + d_["Station Status"] + '<br>';

    }
    if (d_["Hydrometric Data Available"]) {
        str += d_["Hydrometric Data Available"] + ' Available<br>';
    }
    if (d_["Station Status"] === "Inactive") {
        str += '<br/><button type="button" class="btn btn-primary hydronet-popup-btn" data="'
                + k_ + '">Get Historical Data</button>';
    } else {
        str += '<br/><button type="button" class="btn btn-primary hydronet-popup-btn" data="'
                + k_ + '">Get Latest Data</button>';

    }
    return str;
}


function displayHydronet(k_) {
    return markerRefEnv.getPopup().setContent(markerRefEnv.getPopup().getContent()
            + '<br><br> Data not currently available<br><br>'
            );
}

let displayHydronetBounced = _.debounce(displayHydronet, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.hydronet-popup-btn', function () {
    displayHydronetBounced($(this).attr("data"));
});

