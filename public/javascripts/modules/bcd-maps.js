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
