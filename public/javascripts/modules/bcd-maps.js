/**
 * Common functions used on leaflet maps
 */

// TODO: import leaflet class for LatLng etc

const DUBLIN_BOUNDS = { 'southwest': {
  'lat': 52.9754658325,
  'lng': -6.8639598864
},
  'northeast': {
    'lat': 53.7009607624,
    'lng': -5.9835178395
  }
}

export function getDublinBoundsLatLng () {
  // const DUBLIN_BOUNDS = await d3.json('/data/common/dublin-bounds.json')
  // return  L.latLngBounds(L.latLng(DUBLIN_BOUNDS.southwest.lat,DUBLIN_BOUNDS.southwest.long), L.latLng(DUBLIN_BOUNDS.northeast.lat, DUBLIN_BOUNDS.northeast.long))//greater Dublin & surrounds

  let southWest = L.latLng(52.9754658325, -6.8639598864)
  let northEast = L.latLng(53.7009607624, -5.9835178395)
  return L.latLngBounds(southWest, northEast)
}

export function isWithinDublin (lat, lng) {
  return (DUBLIN_BOUNDS.southwest.lat < lat && lat < DUBLIN_BOUNDS.northeast.lat && DUBLIN_BOUNDS.southwest.lng < lng && lng < DUBLIN_BOUNDS.northeast.lng)
}

export function getDublinLatLng () {
  // const DUBLIN_BOUNDS = await d3.json('/data/common/dublin-bounds.json')
  // return  L.latLngBounds(L.latLng(DUBLIN_BOUNDS.southwest.lat,DUBLIN_BOUNDS.southwest.long), L.latLng(DUBLIN_BOUNDS.northeast.lat, DUBLIN_BOUNDS.northeast.long))//greater Dublin & surrounds
  let dubLat = 53.3498
  let dubLng = -6.2603
  return L.latLng(dubLat, dubLng)
}

/**
 * Return a map with default options for Dublin
 *
 * @param {Object} options
 * @return {L.Map}
 *
 *
 */

const getDefaultMap = options => {
  // TODO:

  // let base = new L.TileLayer(stamenTonerUrl_Lite, {
  //   minZoom: min_zoom,
  //   maxZoom: max_zoom,
  //   attribution: stamenTonerAttrib
  // })
  // let trafficCountersMap = new L.Map(e, {
  //   dragging: !L.Browser.mobile,
  //   tap: !L.Browser.mobile
  // })
  // trafficCountersMap.setView(new L.LatLng(dubLat, dubLng), zoom)
  // return map
}
export { getDefaultMap }

const getDefaultMapOptions = function () {
  let min_zoom = 8
  let max_zoom = 18
  // tile layer with correct attribution
  let osmUrl = 'http://{s}.tile.openstreetprivateMap.org/{z}/{x}/{y}.png'
  let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-privateMapnik/{z}/{x}/{y}.png'
  let osmUrl_Hot = 'https://{s}.tile.openstreetprivateMap.fr/hot/{z}/{x}/{y}.png'
  let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
  let stamenTerrainUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
  let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
  let osmAttrib = 'Map data © <a href="http://openstreetprivateMap.org">OpenStreetMap</a> contributors'
  let osmAttrib_Hot = '&copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetprivateMap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
  let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetprivateMap.org/copyright">OpenStreetMap</a>'

  let defaults = {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
  }
  return defaults
}
export { getDefaultMapOptions }
