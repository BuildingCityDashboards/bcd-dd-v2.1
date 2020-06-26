const getMapFig3 = async function () {
  let southWest = L.latLng(52.9754658325, -6.8639598864)
  northEast = L.latLng(53.7009607624, -5.9835178395),
    dublinBounds = L.latLngBounds(southWest, northEast) // greater Dublin & surrounds
  zoom = 10
// tile layer with correct attribution
  let iconConfig = {
    title: '',
    number: '666',
    iconUrl: '/images/map_icons/two-houses.svg',
    iconSize: [30, 30],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0]
  }

  proj4.defs('EPSG:2157', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')

  var firstProjection = 'EPSG:2157' // ITM
  var secondProjection = 'EPSG:4326' // WGS84

  let data = await d3.csv('/data/Stories/Housing/part_3/processed/Airbnb_listings_Mar2020.csv')

  // let legend = L.control({
  //   position: 'bottomright'
  // })

  // legend.onAdd = function (map) {
  //   let div = L.DomUtil.create('div', 'info-legend')
  //     // div.innerHTML = '<div class="map-key">' +
  //     //  '<img src="/images/map_icons/8-houses-example.png" alt="house icon" style="width:35px;height:42px;">' +
  //     //  '\t\t  is an estate with 8 houses' +
  //     //  '</div>';
  //   return div
  // }

  // legend.addTo(airbnbMap)

  let cluster = L.markerClusterGroup()

    // const MAX_TOTAL_HOUSES = 2314; //used to normalise the sizing of icons based on total houses variable

  data.forEach((d) => {
      // let result = proj4(firstProjection, secondProjection,
      //  [+d["x"], +d["y"]]);
      // d.lat = result[1];
      // d.lng = result[0];
    let marker = L.marker(new L.LatLng(d['latitude'], d['longitude']), {
        // icon: getIcon(d["TOTAL"])
      icon: new L.UnNumberedDivIcon()
    })
      // marker.bindPopup(getPopupContent(d));
    marker.bindTooltip(getPopupContent(d))
    cluster.addLayer(marker)
  })

  return cluster
}
  // airbnbMap.addLayer(cluster)

function getIcon (totalHouses) {
      // console.log(totalHouses);
      // let fraction = +totalHouses / 2314;
      // iconConfig.iconSize = [totalHouses, totalHouses];
      // let icon = L.icon(iconConfig);
      // let icon = new L.NumberedDivIcon({
      //  number: totalHouses
      // });
  let icon = new L.Icon()
  return icon
}

function getTooltipContent (property) {
  return getPopupContent(property) // pass through
}

function getPopupContent (property) {
  let key = 'id'
  let str = ``;
      // Catch null development names or blanks or single space
  (property[key] && property[key] !== '' && property[key] !== ' ') ? str += `<b>${property[key]}</b><br>` : str += '<b>Unknown property</b><br>'
  key = 'id'
      // str += `<i>${property[key]}</i><br><br>` || '';

  let keys = ['room_type', 'availability_365', 'calculated_host_listings_count']
  keys.forEach(key => {
    str += getDataString(property, key) || ''
  })

  return str
}

function getDataString (property, key) {
  if (property[key] && property[key] !== ' ') {
    let str = ''
    if (key == 'room_type') {
      str = `<b>Room type</b>: ${property[key]}<br>`
    }
    if (key == 'availability_365') {
      str = `<b>Days available yearly</b>: ${property[key]}<br>`
    }
    if (key == 'calculated_host_listings_count') {
      str = `<b>Properties owned by this host</b>: ${property[key]}<br>`
    }

    return str
  }
}

  // L.control.locate({
  //   strings: {
  //     title: 'Zoom to your location'
  //   }
  // }).addTo(airbnbMap)

  // let osmGeocoder = new L.Control.OSMGeocoder({
  //   placeholder: 'Enter street name, area etc.',
  //   bounds: dublinBounds
  // })
  // airbnbMap.addControl(osmGeocoder)

