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
import { getDublinBoundsLatLng } from '../modules/bcd-maps.js'

let dub_lng = -6.2603
let dub_lat = 53.42
let dublinX, dublinY
let min_zoom = 10,
  max_zoom = 16
let zoom = min_zoom
// tile layer with correct attribution
let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
let osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
let osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
let stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
let stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
let wiki = 'https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png'
let osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
let osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmapGeodemos.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
let stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmapGeodemos.org/copyright">OpenStreetMap</a>'
let cartoDb = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
let cartoDb_Dark = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
let cartoDb_Lite = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';
let CARTODB_POSITRON = 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png';
let CARTODB_ATTRIBUTION = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://carto.com/">CartoDB </a> contributors'

let mapGeodemos = new L.Map('map-geodemos')
let osm = new L.TileLayer(CARTODB_POSITRON, {
  minZoom: min_zoom,
  maxZoom: max_zoom,
  attribution: CARTODB_ATTRIBUTION
})
mapGeodemos.setView(new L.LatLng(dub_lat, dub_lng), zoom)
mapGeodemos.addLayer(osm)

L.control.locate({
  strings: {
    title: 'Zoom to your location'
  }
}).addTo(mapGeodemos)



mapGeodemos.addControl(new L.Control.OSMGeocoder({
  placeholder: 'Enter street name, area etc.',
  bounds: getDublinBoundsLatLng()
}))

const GEODEMOS_COLORWAY_CATEGORICAL= ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f']
const GEODEMOS_COLORWAY_CBSAFE = ['#d73027','#f46d43','#fdae61','#fee090','#abd9e9','#74add1','#4575b4']
const GEODEMOS_COLORWAY = GEODEMOS_COLORWAY_CATEGORICAL

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

let traces = []
let layout = {}

d3.csv('/data/tools/geodemographics/dublin_zscores.csv')
.then((zScores)=>{

  let columnNames = Object.keys(zScores[0])
  columnNames = columnNames.filter(e=>e!=='cluster')
  zScores.forEach((row, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT);
    trace.type = 'bar'
    trace.orientation = 'h'
    trace.marker = {
      color: getLayerColor(i), // lines + markers, defaults to colorway
    }

    trace.x = columnNames.map( name => {
      return row[name]
    })
    trace.y = columnNames
    traces.push(trace)
})

//Set layout options
layout = Object.assign({}, ROW_CHART_LAYOUT);
layout.mode = 'bars'
layout.height = 500
// layout.barmode = 'group';
layout.colorway = GEODEMOS_COLORWAY
layout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
layout.title.text = 'zscores';
layout.showlegend = false;
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
  t: 40,
  b: 0
  
};

Plotly.newPlot('chart-geodemos', [traces[0]], layout, {
  modeBar: {
    orientation: 'v',
    bgcolor: 'black',
    color: null,
    activecolor: null
  },
  modeBarButtons: [['toImage']],
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
  return GEODEMOS_COLORWAY[index]
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

d3
.select('#group-buttons')
.selectAll('button[type=checkbox]')
.on('click', function() {

  let cb = d3.select(this)
  let layerNo = cb.property('value') === 'all' ? 'all' : parseInt(cb.property('value')) - 1

  // console.log(layerNo);

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
    Plotly.react('chart-geodemos', [traces[layerNo]], layout)

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


d3.select('#group-buttons').selectAll('button[type=checkbox]').each(function(d, i){
  if(i<7){
    d3.select(this).style("background-color", GEODEMOS_COLORWAY[i])
  }

})
