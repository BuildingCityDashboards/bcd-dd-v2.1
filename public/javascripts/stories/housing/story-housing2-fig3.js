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

proj4.defs("EPSG:2157", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

var firstProjection = "EPSG:2157"; //ITM
var secondProjection = "EPSG:4326"; //WGS84

d3.csv("/data/Stories/Housing/part_2/processed/unifinished_estates_2010_bnsd_dublin_area.csv")
  .then(function(data) {
    data.forEach(function(d) {
      let result = proj4(firstProjection, secondProjection,
        [+d["x"], +d["y"]]);
      d.lat = result[1];
      d.lng = result[0];
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
        marker.bindPopup(getPopupContent(d));
        cluster.addLayer(marker);
      });
      map.addLayer(cluster);
      // map.fitBounds(cluster.getBounds());
    }

    function getPopupContent(estate) {
      let key = "Name of Development";
      let str = ``;
      // Catch null development names or blanks or single space
      (estate[key] && estate[key] !== '' && estate[key] !== ' ') ? str += `<b>${estate[key]}</b><br>`: str += '<b>Unnamed Development</b><br>';
      key = "Town, Village, Suburb "
      str += `<i>${estate[key]}</i><br><br>` || '';
      key = "TOTAL"
      str += `<b>Total houses</b>: ${estate[key]}<br>` || '';
      key = "Complete & occupied"
      str += `<b>${key}</b>: ${estate[key]}<br>` || '';
      key = "Complete & vacant"
      str += `<b>${key}</b>: ${estate[key]}<br>` || '';

      // if (d_["TOTAL_SPACES"]) {
      //   str += 'Total Spaces: ' + d_["TOTAL_SPACES"] + '<br><br>';
      // }
      // if (d_["DIPPED_FOOTPATH"] === "TRUE") {
      //   str += '<i>This parking bay HAS a dipped footpath</i> <br>';
      // } else {
      //   str += '<i>This parking bay DOES NOT HAVE a dipped footpath</i> <br>';
      // }
      // if (d_.Name) {
      //   str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="' +
      //     d_.StopID + '">Real Time Information</button>';
      // };
      return str;
    }

  });