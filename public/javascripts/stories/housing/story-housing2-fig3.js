let southWest = L.latLng(52.9754658325, -6.8639598864),
  northEast = L.latLng(53.7009607624, -5.9835178395),
  dublinBounds = L.latLngBounds(southWest, northEast); //greater Dublin & surrounds
zoom = 10;
// tile layer with correct attribution
let iconConfig = {
  title: '',
  number: '666',
  iconUrl: '/images/map_icons/two-houses.svg',
  iconSize: [30, 30],
  iconAnchor: [0, 0],
  popupAnchor: [0, 0]
};

proj4.defs("EPSG:2157", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

var firstProjection = "EPSG:2157"; //ITM
var secondProjection = "EPSG:4326"; //WGS84

d3.csv("/data/Stories/Housing/part_2/processed/unifinished_estates_2010_bnsd_dublin_area.csv")
  .then((data) => {
    let osm = new L.TileLayer(stamenTonerUrl_Lite, {
      minZoom: min_zoom,
      maxZoom: max_zoom,
      attribution: stamenTonerAttrib
    });
    let unfinishedEstatesMap = new L.Map('unfinished-estates-map');
    unfinishedEstatesMap.setView(new L.LatLng(dubLat, dubLng), zoom);
    unfinishedEstatesMap.addLayer(osm);
    let cluster = L.markerClusterGroup();

    const MAX_TOTAL_HOUSES = 2314; //used to normalise the sizing of icons based on total houses variable

    data.forEach((d) => {
      let result = proj4(firstProjection, secondProjection,
        [+d["x"], +d["y"]]);
      d.lat = result[1];
      d.lng = result[0];
      let marker = L.marker(new L.LatLng(d.lat, d.lng), {
        icon: getIcon(d["TOTAL"])
      });
      // marker.bindPopup(getPopupContent(d));
      marker.bindTooltip(getPopupContent(d));
      cluster.addLayer(marker);

    });

    unfinishedEstatesMap.addLayer(cluster);

    function getIcon(totalHouses) {
      // console.log(totalHouses);
      // let fraction = +totalHouses / 2314;
      // iconConfig.iconSize = [totalHouses, totalHouses];
      // let icon = L.icon(iconConfig);
      let icon = new L.NumberedDivIcon({
        number: totalHouses
      });
      return icon;
    }

    function getTooltipContent(estate) {
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

      return str;
    }

    L.control.locate({
      strings: {
        title: "Zoom to your location"
      }
    }).addTo(unfinishedEstatesMap);

    let osmGeocoder = new L.Control.OSMGeocoder({
      placeholder: 'Enter street name, area etc.',
      bounds: dublinBounds
    });
    unfinishedEstatesMap.addControl(osmGeocoder);

    var legend = L.control({
      position: 'bottomright'
    });

    legend.onAdd = function(map) {

      let div = L.DomUtil.create('div', 'info-legend');
      div.innerHTML = '<div class="map-key">' +
        '<img src="/images/map_icons/8-houses-example.png" alt="house icon" style="width:35px;height:42px;">' +
        '\t\t  is an estate with 8 houses' +
        '</div>';
      //   grades = [0, 10, 20, 50, 100, 200, 500, 1000],
      //   labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      // for (var i = 0; i < grades.length; i++) {
      //   div.innerHTML +=
      //     '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      //     grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      // }

      return div;
    };

    legend.addTo(unfinishedEstatesMap);

  });