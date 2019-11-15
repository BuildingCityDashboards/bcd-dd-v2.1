/************************************
 * Fingal Disabled Parking Map
 ************************************/

let osmFingalCarpark = new L.TileLayer(stamenTonerUrl_Lite, {
  minZoom: min_zoom,
  maxZoom: max_zoom,
  attribution: stamenTonerAttrib
});
let disabledParkingMap = new L.Map('chart-transport-parking');
disabledParkingMap.setView(new L.LatLng(dubLat, dubLng), zoom);
disabledParkingMap.addLayer(osmFingalCarpark);
let markerRefDisabledPark; //TODO: fix horrible hack!!!
disabledParkingMap.on('popupopen', function(e) {
  markerRefDisabledPark = e.popup._source;

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
d3.csv("/data/Transport/fccdisabledparking-bayp20111013-2046.csv").then(function(data) {
  //    console.log("DP data length "+data.length);
  processDisabledParking(data); //TODO: bottleneck?
});

function processDisabledParking(data_) {
  //    console.log("- \n");
  data_.forEach(function(d) {
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
  disabledParkingMap.removeLayer(disabledParkingCluster);
  _.each(data__, function(d, k) {
    //        console.log("d: " + d.type + "\n");
    let marker = L.marker(new L.LatLng(d.lat, d.lng), {
      icon: disabledParkingkMapIcon
    });
    marker.bindPopup(getDisbaledParkingContent(d));
    disabledParkingCluster.addLayer(marker);
  });
  disabledParkingMap.addLayer(disabledParkingCluster);
  disabledParkingMap.fitBounds(disabledParkingCluster.getBounds());
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
  };
  return str;
}

/************************************
 * Button listeners
 ************************************/
d3.select(".public_transport_bikes").on("click", function() {
  //    console.log("bikes");
  bikesMap.removeLayer(busCluster);
  bikesMap.removeLayer(luasCluster);
  if (!bikesMap.hasLayer(bikeCluster)) {
    bikesMap.addLayer(bikeCluster);
  }
  bikesMap.fitBounds(bikeCluster.getBounds());
});
d3.select(".public_transport_buses").on("click", function() {
  //    console.log("buses");
  publicMap.removeLayer(bikeCluster);
  publicMap.removeLayer(luasCluster);
  if (!publicMap.hasLayer(busCluster)) {
    publicMap.addLayer(busCluster);
  }
  publicMap.fitBounds(busCluster.getBounds());
});
d3.select(".public_transport_luas").on("click", function() {
  //    console.log("luas");
  publicMap.removeLayer(bikeCluster);
  publicMap.removeLayer(busCluster);
  if (!publicMap.hasLayer(luasCluster)) {
    publicMap.addLayer(luasCluster);
  }
  publicMap.fitBounds(luasCluster.getBounds());
});
d3.select(".public_transport_all").on("click", function() {
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
d3.select(".parking_multi").on("click", function() {
  //    console.log("bikes");
  //    disabledParkingMap.removeLayer(busCluster);
  //    disabledParkingMap.removeLayer(luasCluster);
  if (!disabledParkingMap.hasLayer(carparkCluster)) {
    disabledParkingMap.addLayer(carparkCluster);
  }
  disabledParkingMap.fitBounds(carparkCluster.getBounds());
});