let dubLat = 53.3498;
let dubLng = -6.2603;
let min_zoom = 8,
  max_zoom = 18;
let zoom = 10;
// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetprivateMap.org/{z}/{x}/{y}.png';
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-privateMapnik/{z}/{x}/{y}.png';
let osmUrl_Hot = 'https://{s}.tile.openstreetprivateMap.fr/hot/{z}/{x}/{y}.png';
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
let stamenTerrainUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png';
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
let osmAttrib = 'Map data © <a href="http://openstreetprivateMap.org">OpenStreetMap</a> contributors';
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetprivateMap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>';
let iconAX = 15; //icon Anchor X
let iconAY = 15; //icon Anchor Y

L.NumberedDivIcon = L.Icon.extend({
  options: {
    // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
    iconUrl: '/images/map_icons/two-houses.svg',
    number: '',
    shadowUrl: null,
    iconSize: [15, 15],
    iconAnchor: new L.Point(13, 41),
    popupAnchor: new L.Point(0, -33),
    /*
    iconAnchor: (Point)
    popupAnchor: (Point)
    */
    className: 'leaflet-div-icon'
  },

  createIcon: function() {
    var div = document.createElement('div');
    var img = this._createImg(this.options['iconUrl']);
    var numdiv = document.createElement('div');
    numdiv.setAttribute("class", "number");
    numdiv.innerHTML = this.options['number'] || '';
    div.appendChild(img);
    div.appendChild(numdiv);
    this._setIconStyles(div, 'icon');
    return div;
  },

  //you could change this to add a shadow like in the normal marker if you really wanted
  createShadow: function() {
    return null;
  }
});