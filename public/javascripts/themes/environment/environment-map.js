let popupTime = d3.timeFormat("%a %B %d, %H:%M");
//  1. declare map variables and initialise base map
let map = new L.Map('chart-environment-map');
let dubLat = 53.3498;
let dubLng = -6.5;
let min_zoom = 8, max_zoom = 18;
let zoom = 10;

// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
let osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
let stamenTerrainUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png';
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
let osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
let osm = new L.TileLayer(stamenTerrainUrl, {
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
let iconAX = 15; //icon Anchor X
let iconAY = 15; //icon Anchor Y
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

let corsAnywhere = "https://cors-anywhere.herokuapp.com/";
d3.json(corsAnywhere + "https://waterlevel.ie/geojson/latest/")
//d3.json('/data/Environment/waterlevel.json')
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
//        console.log("d: " + d["EASTING"]+" | "+d["NORTHING"]);
//        console.log("dlat " + d.lat+" | dlng "+d.lng);
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
        let marker = L.marker(new L.LatLng(d.lat, d.lng), {icon: waterLevelMapIcon});
        marker.bindPopup(getHydronetContent(d, k));
        hydronetCluster.addLayer(marker);
//        console.log("getMarkerID: "+marker.optiid);
    });
    map.addLayer(hydronetCluster);
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

//Handle button in map popup and get carpark data
function displayHydronet(k_) {
    return markerRef.getPopup().setContent(markerRef.getPopup().getContent()
            + '<br><br> Data not currently available<br><br>'
            );
}

let displayHydronetBounced = _.debounce(displayHydronet, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.hydronet-popup-btn', function () {
    displayHydronetBounced($(this).attr("data"));
});

