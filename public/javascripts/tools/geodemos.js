/**  TODOs
Load group data
  key-value SA vs group no
Load SAs
  Lookup group number for each SA object
  Add object to layer group based on group number
Filter layers based on cluster/group number
Add zscores data
Display zscores widget and filter based on group selection
Use zscores widget to filter map

Issue here is having the SAs load by LA and then update map->
if we add SA to group as it comes up we're rewriting gorup layers repeatedly
Solve with async await

**/

let dub_lng = -6.2603
let dub_lat = 53.42
let dublinX, dublinY
let min_zoom = 10,
  max_zoom = 16
let zoom = min_zoom
// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetmapGeodemos.org/{z}/{x}/{y}.png'
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
let osmUrl_Hot = 'https://{s}.tile.openstreetmapGeodemos.fr/hot/{z}/{x}/{y}.png'
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
let wiki = 'https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png'
let osmAttrib = 'Map data © <a href="http://openstreetmapGeodemos.org">OpenStreetMap</a> contributors'
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetmapGeodemos.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmapGeodemos.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmapGeodemos.org/copyright">OpenStreetMap</a>'
let mapGeodemos = new L.Map('map-geodemos')
let osm = new L.TileLayer(stamenTonerUrl_Lite, {
  minZoom: min_zoom,
  maxZoom: max_zoom,
  attribution: osmAttrib
})
mapGeodemos.setView(new L.LatLng(dub_lat, dub_lng), zoom)
mapGeodemos.addLayer(osm)

let naStyle = {
  fillColor: 'grey',
  weight: 1,
  opacity: 2,
  color: 'grey',
  dashArray: '1',
  fillOpacity: 0.5
}

let mapLayers = getEmptyLayersArray(7)
let naLayer = L.geoJSON(null, {
  style: naStyle,
  //onEachFeature: onEachFeature
}) //layer for 'NA' data
// mapGeodemos.addLayer(mapLayers[0])

d3.csv('/data/tools/geodemographics/dublin_zscores.csv')
.then((zScores)=>{

  console.log(zScores);
  let columnNames = Object.keys(zScores[0])

  // let traceGroup1 = columnNames.forEach( name => {
  //   zScores[0][name]
  // })

  console.log(columnNames);
  
  let traces = []
  zScores.forEach((row) => {
    let trace = {}
    trace.type = 'bar';
    trace.orientation = 'h';
    trace.x = columnNames.map( name => {
      return row[name]
    })
    trace.y = columnNames
    traces.push(trace)
});
  

//Set layout options
let layout = {} //Object.assign({}, ROW_CHART_LAYOUT);
layout.mode = 'bars'
layout.height = 600
// layout.barmode = 'group';
layout.bargroupgap = 0;
layout.colorway = CHART_COLORWAY_VARIABLES;
layout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
layout.title.text = 'zscores';
layout.showlegend = true;
layout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
layout.legend.xanchor = 'right';
// layout.legend.y = 0.1;
// layout.legend.traceorder = 'reversed';
layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
layout.xaxis.title = "";
layout.xaxis.range = [-2, 2]
layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
layout.yaxis.tickfont ={
  family: 'PT Sans',
  size: 10,
  color: '#313131'
}
layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
layout.yaxis.titlefont.size = 16; //bug? need to call this
layout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);

layout.yaxis.title = '';
layout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)
layout.margin = {
  l: 40,
  r: 40, //annotations space
  t: 40
};


Plotly.newPlot('chart-geodemos', traces, layout, {
  modeBar: {
    orientation: 'v',
    bgcolor: 'black',
    color: null,
    activecolor: null
  },
  modeBarButtons: MULTILINE_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
  displayModeBar: true,
  displaylogo: false,
  showSendToCloud: false,
  responsive: true,
  // toImageButtonOptions: {
  //   filename: 'Dublin Dashboard - ' + titleFig9,
  //   width: null,
  //   height: null,
  //   format: 'png'
  // }
})

Plotly.deleteTraces('chart-geodemos', [1,2,3,4,5,6])

}) //end then



loadData()
function loadData (file) {
  d3.csv('/data/tools/geodemographics/dublin_clusters_sa_cluster.csv')
    .then((data) => {
      let idClusterLookup = {}
      data.forEach(function (d) {
        idClusterLookup[d['SMALL_AREA']] = d['Cluster']
      })
      loadSmallAreas(idClusterLookup)
    })
}

async function loadSmallAreas (lookup) {
  let features = []
// Incrementally load boundaries for each LA to maps
// signify when finished all
  let dataBase = '/data/tools/census2016/'
  let dcc0 = 'DCC_SA_0.geojson'
  let dcc1 = 'DCC_SA_1.geojson'
  let dcc2 = 'DCC_SA_2.geojson'
// promises
  let pDCC0 = d3.json(dataBase + dcc0)
  let pDCC1 = d3.json(dataBase + dcc1)
  let pDCC2 = d3.json(dataBase + dcc2)
// DCC
  let dccSAs = await Promise.all([pDCC0, pDCC1, pDCC2]) // yields an array of 3 feature collections
  // need to extract each feature and lookup its group, adding to appropriate layer
  dccSAs.forEach(sas => {
    // updateMap(sas)
    sas.features.forEach(sa => {
      try{
        let groupNo = lookup[sa.properties.SMALL_AREA]
        sa.properties.groupnumber= groupNo
        addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index

      }
      catch{
        console.warn(`Error on lookup for sa. Adding to NA layer \n ${JSON.stringify(sa)} `)
        sa.properties.groupnumber= 'NA'
        addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
      }
      // console.log(layerNo)
    })
  })

// Fingal, DL/R, SDCC
  let fcc = 'FCC_SA_0.geojson'
  let dlr = 'DLR_SA_0.geojson'
  let sdcc = 'SDCC_SA_0.geojson'
  let pfcc = d3.json(dataBase + fcc)
  let pdlr = d3.json(dataBase + dlr)
  let psdcc = d3.json(dataBase + sdcc)

  let otherSAs = await Promise.all([pfcc, pdlr, psdcc])
  otherSAs.forEach(sas => {
    // updateMap(sas)
    sas.features.forEach(sa => {
      try{
        let groupNo = lookup[sa.properties.SMALL_AREA]
        sa.properties.groupnumber= groupNo
        addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index

      }
      catch{
        console.warn(`Error on lookup for sa. Adding to NA layer \n ${JSON.stringify(sa)} `)
        sa.properties.groupnumber= 'NA'
        addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
      }
      // console.log(layerNo)
    })
  })
  //Set initial layer view
  mapGeodemos.addLayer(mapLayers[0])
}

function getEmptyLayersArray (total) {
  let layersArr = []
  for (let i = 0; i < total; i += 1) {
    layersArr.push(L.geoJSON(null, {
      style: getLayerStyle(i),
      onEachFeature: onEachFeature
      // filter: filterInitialView
    })
    )
  }
  return layersArr
}

function addFeatureToLayer (feature, layerNo) {
  if (layerNo ==='NA'){
    naLayer.addData(feature)
    mapGeodemos.addLayer(naLayer)
  }
  else{
  mapLayers[layerNo].addData(feature)

  }
}

function getLayerStyle (index) {
  // console.log("style feature "+f.properties.COUNTYNAME)
  return {
    fillColor: getLayerColor(index),
    weight: 1,
    opacity: 2,
    color: getLayerColor(index),
    dashArray: '1',
    fillOpacity: 0.5
  }
}

function getLayerColor (index) {
  let CHART_COLORWAY = ['#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
  return CHART_COLORWAY[index]
}

function onEachFeature (feature, layer) {
  layer.bindPopup(
                '<p><b>' + feature.properties.EDNAME + '</b></p>' +
                '<p>' + feature.properties.COUNTYNAME + '</p>' +
                '<p>SA ' + feature.properties.SMALL_AREA + '</p>'+
                '<p>Group ' + feature.properties.groupnumber + '</p>'
                )
        // bind click
  layer.on({
    click: function () {
    }
  })
}

// crossfilter variables
// let idDim;

// let idDim // data dimension accessible by GEOGID

// function loadClusters (file) {
//   //    data_.forEach(function (d) {
//   //        d.id = +d.GEOGID.split('_')[1]; //extract the numerical part
//   //        //corresponding to the boundary geojson
//   //    });
//   // console.log('Variables length = ' + data_.length)
//   // let censusDataXF = crossfilter(data_)
//   // idDim = censusDataXF.dimension(function (d) {
//   //   return +d.GEOGID.split('_')[1]
//   // })
// }

  // function formatData (data_) {
  //   // let res = JSON.stringify(data_, null, '\n');
  //
  //   let keys = d3.keys(data_[0])
  //   // Mens ages from index 4 to 37 inclusive
  //   // 18+ from index 22
  //   let over18Males = 0
  //   for (let i = 22; i < 38; i += 1) {
  //     over18Males += data_[0][keys[i]]
  //     // console.log(keys[i]+" : "+data_[0][keys[i]]);
  //   }
  //   let over18Females = 0
  //   // Female ages from index 39 to 72 inclusive
  //   // 18+ from index 57
  //   for (let i = 57; i < 73; i += 1) {
  //     over18Females += data_[0][keys[i]]
  //     // console.log(keys[i]+" : "+data_[0][keys[i]]);
  //   }
  //   let totalMale = data_[0]['T1_1AGETM']
  //   let totalFemale = data_[0]['T1_1AGETF']
  //   let textOutput1 = 'The population of this small area is <b>' +
  //     totalMale + ' males</b> and <b>' +
  //     totalFemale + ' females</b>, giving <b>' +
  //     (totalMale + totalFemale) + '</b> persons in total. '
  //   let textOutput2 = 'Of those, <b>' +
  //     over18Males + ' men</b> and <b>' +
  //     over18Females + ' women</b> are over 18 years of age. <br>'
  //   return textOutput1 + textOutput2
  // }
  //
  // let chartMargins = [10, 0, 30, 20]
  // // (map size - margins)/2 map size is specified in the css for leaflet charts
  // let chartHeight = 250 // (200 - chartMargins[0] - chartMargins[2]) / 2;
  // let chartWidth = 500
  // var chart = dc.barChart('#data-chart')
  //
  // function updateChart (data_) {
  //   let keys = d3.keys(data_[0])
  //   let objects = []
  //   console.debug('keys: ' + keys)
  //   keys.forEach(function (e, i) {
  //     if (i >= 4) {
  //       if (i <= 37) {
  //         console.debug('key: ' + e + ' val: ' + data_[0][keys[i]])
  //         let obj = {
  //           ageBand: e,
  //           cnt: data_[0][keys[i]]
  //         }
  //         objects.push(obj)
  //       }
  //     }
  //   })
  //
  //   console.log('object zero: ' + JSON.stringify(objects[0]))
  //   let ndx = crossfilter(objects)
  //   console.log('xf: ' + ndx.size())
  //   let ageDimension = ndx.dimension(function (d) {
  //       // console.log("key: " + d.ageBand);
  //       return d.ageBand
  //     }),
  //     ageGroup = ageDimension.group()
  //     .reduceSum(function (d) {
  //       return d.cnt
  //     })
  //   chart
  //     .width(chartWidth)
  //     .height(chartHeight)
  //     .x(d3.scaleBand())
  //     .xUnits(dc.units.ordinal)
  //     .brushOn(false)
  //     .xAxisLabel('Age Group')
  //     .yAxisLabel('# Persons')
  //     .dimension(ageDimension)``
  //     .barPadding(0.1)
  //     .outerPadding(0.05)
  //     .group(ageGroup)
  //     .xAxis().tickValues([keys[4], keys[37]])
  //   chart.render()
  // }
  //
//   boundaries.addTo(mapGeodemos)
// };




d3
.select('#group-buttons')
.selectAll('button[type=checkbox]')
.on('click', function() {

  let cb = d3.select(this)
  let layerNo = cb.property('value') === 'all' ? 'all' : parseInt(cb.property('value')) - 1

  console.log(layerNo);

  if (cb.property('value') !== 'all' && cb.classed('active')) {
    cb.classed('active', false)
    d3.select('#group-buttons').select('#group-all').classed('active', false)
    if(mapGeodemos.hasLayer(mapLayers[layerNo])){
      mapGeodemos.removeLayer(mapLayers[layerNo])
    }
  } else if (cb.property('value') !== 'all'){
    d3.select('#group-buttons').selectAll('button[type=checkbox]').classed('active', false)
    cb.classed('active', true)
    mapLayers.forEach( l =>{
      if(mapGeodemos.hasLayer(l)){
        mapGeodemos.removeLayer(l)
      }
    })
    if(!mapGeodemos.hasLayer(mapLayers[layerNo])){
      mapGeodemos.addLayer(mapLayers[layerNo])
    }

  } else if (cb.classed('active')){
    d3.select('#group-buttons').selectAll('button[type=checkbox]').classed('active', false)
    mapLayers.forEach( l =>{
      if(mapGeodemos.hasLayer(l)){
        mapGeodemos.removeLayer(l)
      }
    })

  } else {
    d3.select('#group-buttons').selectAll('button[type=checkbox]').classed('active', true)
    mapLayers.forEach( l =>{
      if(!mapGeodemos.hasLayer(l)){
        mapGeodemos.addLayer(l)
      }
    })
  }
})
