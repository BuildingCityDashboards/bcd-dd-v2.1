const getMapFig8 = async function () {
  const pFormat = d3.format('.2%'),
    pYear = d3.timeParse('%Y'),
    src = '../data/Stories/Housing/part_1/',
    getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p)

  const srcPathFig8 = '../data/Stories/Housing/part_1/'

  let datafiles = await d3.json(srcPathFig8 + 'DublinCityDestPOWCAR11_0.js')

  let map = new L.Map('map-sticky-housing', {
    center: [53.35, -6.8],
    zoom: 9
  }).addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'))

  function onEachFeature (f, layer) {
    let t = +f.properties.WORKFORCE,
      c = +f.properties.DESTDUBLIN,
      p = pFormat(c / t)

    let popupContent =
        '<p style=font-weight:400; font-size:14px;>Of the ' +
        f.properties.WORKFORCE +
        ' workers in this ED (' +

        f.properties.EDNAME +
        ')*, ' +
        f.properties.DESTDUBLIN +
        ' (' + p + ')' +
        ' work in Dublin City**'

    if (f.properties && f.properties.popupContent) {
      popupContent += f.properties.popupContent
    }

    layer.bindPopup(popupContent)
  }

  L.geoJSON(datafiles, {
    style: getAreaColor,
    onEachFeature: onEachFeature
  }).addTo(map)

  let legend = L.control({
    position: 'topright'
  })

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [500, 1500, 2500, 3500, 4500],
      labels = []

      // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getLegendColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
    }

    return div
  }

  legend.addTo(map)

  return map
}

function getAreaColor (f) {
  return {
    fillColor: getCommuterIntensity(f.properties),
    fillOpacity: 0.85,
    weight: 2,
    color: getCommuterIntensity(f.properties)
  }
}

function getCommuterIntensity (d) {
  let total = +d.WORKFORCE,
    commute = +d.DESTDUBLIN,
    percentage = (commute / total)

  switch (true) {
    case percentage > 0.5:
      return '#b30000'
      break

    case percentage > 0.3:
      return '#e34a33'
      break

    case percentage > 0.1:
      return '#fc8d59'
      break

    case percentage > 0.05:
      return '#fdcc8a'
      break

    default:
      return '#fef0d9'
  }
}

function getLegendColor (d) {
  return d > 3500 ? '#b30000' :
    d > 3500 ? '#e34a33' :
    d > 2500 ? '#fc8d59' :
    d > 1500 ? '#fdcc8a' :
    d > 500 ? '#fef0d9' :
    '#FFEDA0'
};
