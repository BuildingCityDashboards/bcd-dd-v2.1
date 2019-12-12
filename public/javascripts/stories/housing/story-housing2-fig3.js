let dubLat = 53.3498;
let dubLng = -6.2603;
let min_zoom = 0,
  max_zoom = 18;
let zoom = 10;
// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetprivateMap.org/{z}/{x}/{y}.png';
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-privateMapnik/{z}/{x}/{y}.png';
let osmUrl_Hot = 'https://{s}.tile.openstreetprivateMap.fr/hot/{z}/{x}/{y}.png'
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
let osmAttrib = 'Map data © <a href="http://openstreetprivateMap.org">OpenStreetMap</a> contributors';
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetprivateMap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>';
let iconAX = 15; //icon Anchor X
let iconAY = 15; //icon Anchor Y

//Proj4js.defs["EPSG:29902"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
//Proj4js.defs["EPSG:29903"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29903", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
proj4.defs("EPSG:2157", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

var firstProjection = "EPSG:2157"; //ITM
var secondProjection = "EPSG:4326"; //WGS84

d3.csv("/data/Stories/Housing/part_2/processed/unifinished_estates_2010_bnsd_dublin_area.csv")
  .then(function(data) {
    console.log("data length " + data.length);
    data.forEach(function(d) {
      let result = proj4(firstProjection, secondProjection,
        [+d["x"], +d["y"]]);
      d.lat = result[1];
      d.lng = result[0];
      //add a property to act as key for filtering
      // d.type = "Fingal County Council Disabled Parking Bay";
      console.log("lat " + d.lat);
      console.log("lng " + d.lng);

    });
    let osm = new L.TileLayer(stamenTonerUrl_Lite, {
      minZoom: min_zoom,
      maxZoom: max_zoom,
      attribution: stamenTonerAttrib
    });
    let map = new L.Map('unfinished-estates-map');
    map.setView(new L.LatLng(dubLat, dubLng), zoom);
    map.addLayer(osm);
    let cluster = L.markerClusterGroup();
    updateMap(data);

    function updateMap(data_) {
      cluster.clearLayers();
      map.removeLayer(cluster);
      data_.forEach((d, i) => {
        //        console.log("d: " + d.type + "\n");
        let marker = L.marker(new L.LatLng(d.lat, d.lng));
        // marker.bindPopup(getDisbaledParkingContent(d));
        cluster.addLayer(marker);
      });
      map.addLayer(cluster);
      // map.fitBounds(cluster.getBounds());
    }

  });