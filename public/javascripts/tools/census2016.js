let dub_lng = -6.2603;
let dub_lat = 53.42;
let dublinX, dublinY;
let min_zoom = 10,
  max_zoom = 16;
let zoom = min_zoom;
// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetmapCensus.org/{z}/{x}/{y}.png';
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
let osmUrl_Hot = 'https://{s}.tile.openstreetmapCensus.fr/hot/{z}/{x}/{y}.png'
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
let osmAttrib = 'Map data © <a href="http://openstreetmapCensus.org">OpenStreetMap</a> contributors';
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetmapCensus.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmapCensus.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmapCensus.org/copyright">OpenStreetMap</a>';

let mapCensus = new L.Map('map-census2016');
let osm = new L.TileLayer(stamenTonerUrl_Lite, {
  minZoom: min_zoom,
  maxZoom: max_zoom,
  attribution: stamenTonerAttrib
});
mapCensus.setView(new L.LatLng(dub_lat, dub_lng), zoom);
mapCensus.addLayer(osm);

//crossfilter variables
//let idDim;
//d3.csv("/data/tools/census2016/SAPS2016_SA2017.csv").then(function (data) {
////    processVariables(data);
//});
let idDim; //data dimension accessible by GEOGID
function processVariables(data_) {
  //    data_.forEach(function (d) {
  //        d.id = +d.GEOGID.split('_')[1]; //extract the numerical part
  //        //corresponding to the boundary geojson
  //    });
  console.log('Variables length = ' + data_.length);
  let censusDataXF = crossfilter(data_);
  idDim = censusDataXF.dimension(function(d) {
    return +d.GEOGID.split('_')[1];
  });
}

//Incrementally load boundaries for each LA
let dataBase = '/data/tools/census2016/';
let dcc0 = 'DCC_SA_0.geojson';
let dcc1 = 'DCC_SA_1.geojson';
let dcc2 = 'DCC_SA_2.geojson';
//promises
let pDCC0 = d3.json(dataBase + dcc0);
let pDCC1 = d3.json(dataBase + dcc1);
let pDCC2 = d3.json(dataBase + dcc2);
Promise.all([pDCC0, pDCC1, pDCC2])
  .then(function(dArr) {
    updateMap(join(dArr));
  });

//Fingal
let fcc0 = 'FCC_SA_0.geojson';
let pFCC0 = d3.json(dataBase + fcc0);
Promise.all([pFCC0])
  .then(function(dArr) {
    updateMap(join(dArr));
  });
//DL/R
let dlr0 = 'DLR_SA_0.geojson';
let pDLR0 = d3.json(dataBase + dlr0);
Promise.all([pDLR0])
  .then(function(dArr) {
    updateMap(join(dArr));
  });
//SDCC
let sdcc0 = 'SDCC_SA_0.geojson';
let pSDCC0 = d3.json(dataBase + sdcc0);
Promise.all([pSDCC0])
  .then(function(dArr) {
    updateMap(join(dArr));
  });


function join(dArr_) {
  //    console.log('Boundaries length = ' + dArr_.length);
  let features = [];
  //for 3 feature array element
  dArr_.forEach(function(d, i) {
    //for each element in features array
    d.features.forEach(function(f, j) {
      features.push(f);
    });
  });
  //    console.log("features length = " + features.length);
  return features;
}

//let boundaries, boundariesFCC;
function updateMap(data__) {
  let boundaries = L.geoJSON(data__, {
    //                filter: function (f, l) {
    //                    return f.properties.COUNTYNAME.includes("Dublin")
    //                            || f.properties.COUNTYNAME.includes("Fingal")
    //                            || f.properties.COUNTYNAME.includes("Rathdown")
    //                            ;
    //                },
    style: style,
    onEachFeature: onEachFeature
  });

  function onEachFeature(feature, layer) {
    layer.bindPopup(
      '<p><b>' + feature.properties.EDNAME + '</b></p>' +
      '<p>' + feature.properties.COUNTYNAME + '</p>' +
      '<p>SA ' + feature.properties.SMALL_AREA + '</p>'
    );
    //bind click
    layer.on({
      click: function() {
        //idDim.filter(feature.properties.EDNAME);
        //let res = idDim.top(Infinity)[0].T1_1AGE1;
        //                console.log(idDim.top(Infinity));


        d3.select("#data-title")
          .html(feature.properties.EDNAME);
        // d3.select("#data-display")
        //   .html(JSON.stringify(feature.properties));

      // TODO: check for names of modified boundaries e.g. SA2017_017012002/017012003 or SA2017_017012004/01

        d3.json('/api/v1/census2016/smallarea/SA2017_' + feature.properties.SMALL_AREA).then(function(data) {
          d3.select("#data-display")
            .html('<p>' + formatData(data) + '</p>');
        });
      }
    });
  }

  function formatData(data_) {
    // let res = JSON.stringify(data_, null, '\n');

    let keys = d3.keys(data_[0]);
    //Mens ages from index 4 to 37 inclusive
    //18+ from index 22
    let over18Males =0;
    for (let i = 22; i < 38; i += 1) {
      over18Males+=data_[0][keys[i]]
      // console.log(keys[i]+" : "+data_[0][keys[i]]);
    }
    let over18Females =0;
    //Female ages from index 39 to 72 inclusive
    //18+ from index 57
    for (let i = 57; i < 73; i += 1) {
      over18Females+=data_[0][keys[i]]
      // console.log(keys[i]+" : "+data_[0][keys[i]]);
    }
    let totalMale = data_[0]["T1_1AGETM"];
    let totalFemale = data_[0]["T1_1AGETF"];

    let textOutput1 = "The population of this small area is <b>" +
      totalMale + " males</b> and <b>" +
      totalFemale + " females</b>, giving <b>" +
      (totalMale + totalFemale) + "</b> persons in total. ";

    let textOutput2 = "Of those, <b>" +
      over18Males + " men</b> and <b>" +
      over18Females + " women</b>, are over 18 years of age. <br>";

    return textOutput1+ textOutput2;

  }


  function style(f) {
    //console.log("style feature "+f.properties.COUNTYNAME)
    return {
      fillColor: getCountyColor(f.properties.COUNTYNAME),
      weight: 1,
      opacity: 2,
      color: getCountyColor(f.properties.COUNTYNAME),
      dashArray: '1',
      fillOpacity: 0.5
    };
  };
  boundaries.addTo(mapCensus);
};

//['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']
function getCountyColor(d) {
  return d === 'Dublin City' ? '#08519c' :
    d === 'Fingal' ? '#bdd7e7' :
    d === 'South Dublin' ? '#6baed6' :
    //            d ==='Dun Council' ? '#BD0026' :
    '#3182bd';
}

function getDataColor(d) {
  return d > 1000 ? '#800026' :
    d > 500 ? '#BD0026' :
    d > 200 ? '#E31A1C' :
    d > 100 ? '#FC4E2A' :
    d > 50 ? '#FD8D3C' :
    d > 20 ? '#FEB24C' :
    d > 10 ? '#FED976' :
    '#FFEDA0';
};

//$(document).ready(function () {
//    console.log("ready");
//
//});
