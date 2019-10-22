let dubLat = 53.3498;
let dubLng = -6.2603;
let min_zoom = 8, max_zoom = 18;
let zoom = 10;
// tile layer with correct attribution
let osmUrl_A = 'https://a.tile.openstreetmap.org/${z}/${x}/${y}.png';
let osmUrl_B = 'https://b.tile.openstreetmap.org/${z}/${x}/${y}.png';
let osmUrl_C = 'https://c.tile.openstreetmap.org/${z}/${x}/${y}.png';
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-privateMapnik/{z}/{x}/{y}.png';
let osmUrl_Hot = 'https://{s}.tile.openstreetprivateMap.fr/hot/{z}/{x}/{y}.png';
let cartoDb = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
let cartoDb_Dark = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
let cartoDb_Lite = 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';
let wiki = 'https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png';
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
let osmAttrib = 'Map data © <a href="http://openstreetprivateMap.org">OpenStreetMap</a> contributors';
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetprivateMap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>';
let iconAX = 15;  //icon Anchor X
let iconAY = 15; //icon Anchor Y

let southWest = L.latLng(52.9754658325, -6.8639598864),
  northEast = L.latLng(53.7009607624, -5.9835178395),
  dublinBounds = L.latLngBounds(southWest, northEast); //greater Dublin & surrounds

