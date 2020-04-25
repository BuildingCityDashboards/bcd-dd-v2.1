// TODO: import leaflet class for LatLng etc

const DUBLIN_BOUNDS = await d3.json('/data/common/dublin-bounds.json') //Is this tree-shaken?

export function getDublinBoundsLatLng () {
  // const DUBLIN_BOUNDS = await d3.json('/data/common/dublin-bounds.json')
  // return  L.latLngBounds(L.latLng(DUBLIN_BOUNDS.southwest.lat,DUBLIN_BOUNDS.southwest.long), L.latLng(DUBLIN_BOUNDS.northeast.lat, DUBLIN_BOUNDS.northeast.long))//greater Dublin & surrounds

  let southWest = L.latLng(52.9754658325, -6.8639598864)
  let northEast = L.latLng(53.7009607624, -5.9835178395)
  return = L.latLngBounds(southWest, northEast) 

}

export function isWithinDublin (lat, lng) {
  return (DUBLIN_BOUNDS.southwest.lat < lat && lat < DUBLIN_BOUNDS.northeast.lat && DUBLIN_BOUNDS.southwest.lng < lng && lng < DUBLIN_BOUNDS.northeast.lng)
}
