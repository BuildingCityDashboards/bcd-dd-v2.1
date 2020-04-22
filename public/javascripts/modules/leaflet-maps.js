export function getDublinLatLng () {
  // const DUBLIN_BOUNDS = await d3.json('/data/common/dublin-bounds.json')
  // return  L.latLngBounds(L.latLng(DUBLIN_BOUNDS.southwest.lat,DUBLIN_BOUNDS.southwest.long), L.latLng(DUBLIN_BOUNDS.northeast.lat, DUBLIN_BOUNDS.northeast.long))//greater Dublin & surrounds

  let southWest = L.latLng(52.9754658325, -6.8639598864)
  let northEast = L.latLng(53.7009607624, -5.9835178395)
  let dublinBounds = L.latLngBounds(southWest, northEast) // greater Dublin & surrounds
  // console.log(dublinBounds)

  return dublinBounds
}
