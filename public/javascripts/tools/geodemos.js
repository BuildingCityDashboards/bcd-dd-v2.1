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


  /*d3.json('/data/home/geodem-text-data.json',
  function(data) {
    alert(data);
  })*/

  /*Promise(
  d3.json('/data/home/dublin-region-data.json')
  .then(files => {
    //let xml = files[0]
    let dJson = files[0]
    alert(dJson)
  }))*/
//alert(GroupJson)

 
  
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
//const gToLa =['Group1','Group2','Group3','Group4','Group5','Group6','Group7'] 
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
let tracesIndx = []
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


//alert(Object.keys(traces[0].x))

//var result = Object.keys(obj).map(function(key) {
  //return ([Number(key), parseInt(obj[key])]
//});
//alert('===='+ getSum(result))
layout = Object.assign({}, ROW_CHART_LAYOUT);
layout.mode = 'bars'
layout.height = 500
//layout.barmode = 'group';
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
  updateGroupTxt(1);
  getzscorstat(0)
    
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

function updateGroupTxt(no)
{

  d3.json("/data/home/geodem-text-data.json").then(function(dublinRegionsJson) {  
      
  d3.select('#group-text').text(dublinRegionsJson[no]).style('font-size','13px');
  
  })
}



function getzscorstat(trno)
{
  let result=[]
  
let obj=traces[trno].x
for (let h=0; h< obj.length; h++)
{
  
  result.push(parseFloat(obj[h]))
}
d3.select('#group-text-mean').text(getAvg(result)).style('font-size','13px');
d3.select('#group-text-median').text(getMed(result)).style('font-size','13px');


}
let ttt=[]
function getzscorstatfAll(traces)
{

for(let i = 0; i < traces.length;i++){
  
let obj=traces[i].x
for (let h=0; h< obj.length; h++)
{
  
  ttt.push(parseFloat(obj[h]))
}
 
  }

  d3.select('#group-text-mean').text(getAvg(ttt)).style('font-size','13px');
  d3.select('#group-text-median').text(getMed(ttt)).style('font-size','13px');

 }

//}
  //alert(traces)
  //traces=rrr
 //for(var i = 0; i < traces.length; i++){
   // for(var j = 0; j < traces[i].length; j++){

     //   alert((traces[i][j]));
    //}
//}
//let Allresult=[]
  

/*for (let h=0; h< traces.length; h++)
{
  
  let obj2=traces[h]

  for (let i=0; i< obj2.length; i++)
{
  
  
  alert(h + '---' + i + parseFloat(obj2[i]))
  //Allresult.push(parseFloat(obj2[i].x))
}
}*
//alert(Allresult.length);
//d3.select('#group-text-mean').text(getAvg(Allresult)).style('font-size','13px');
//d3.select('#group-text-median').text(getMed(Allresult)).style('font-size','13px');


}



  //.catch(e => {
    //console.log('error' + e)
  //})
//}

/*function updatezscor(indxno)
{

/*let sum=0
d3.csv('/data/tools/geodemographics/dublin_zscores.csv')
.then((zScores)=>{

  
  let tracedata = Object.values(zScores[0])
  let arrt=[]
  tracedata.forEach((row, i) => {
    // arrt.push(tracedata[i])
  })
 
d3.select('#group-sum').text(sum).style('font-size','15px');  

})}*/
//let statArray=[]
function getAvg(array)
{
  
  const arr = array;
  const sum = arr.reduce((sum, val) => (sum += val));
  const len = arr.length;
  const avg = sum / len;

  const arrSort = arr.sort();
  const mid = Math.ceil(len / 2);
  
  const median =
  len % 2 == 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid - 1];
  
  return avg;
 
}

function getMed(array)
{
  
  const arr = array;
  
  const len = arr.length;
  

  const arrSort = arr.sort();
  const mid = Math.ceil(len / 2);
  
  const median =
    len % 2 == 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid - 1];
  
  return median;
  
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

/*d3
.select('#group-buttons')
.selectAll('button[type=checkbox]')
.on('click', function() {

  let cb = d3.select(this)
  let layerNo = cb.property('value') === 'all' ? 'all' : parseInt(cb.property('value')) - 1
   
  alert(layerNo);
       //d3.select('#regions-info__card').style('display', 'flex')

        // document.getElementById('regions-info').scrollTop = 0
        // //
        //d3.select('regions-info__cta-a').style('visibility', 'visible')
        //d3.select('#regions-info__ca').style('opacity', 1)
       // document.getElementById('regions-info__cta-a').scrollTop = 0
  
  
  //d3.select('#content-cluster').style('visibility','visible');
  //- keep this last d3.select('#content-cluster').text('Cluster   ' + layerNo + '    Data inhere');

  //d3.select('#content-geodemos').append('div')
    //.html('<svg width="1300" height="170"><rect width="1118" height="160" style="fill:rgb(0,200,255);stroke-width:3;stroke:rgb(0,0,0)"/></svg>')
        d3.select('#regions-info__cta').style('display', 'none')
        d3.select('#regions-info__cta-arrow').style('display', 'none')

// This animated transition doesn't work

        d3.select('#regions-info__card').style('display', 'flex')

        // document.getElementById('regions-info').scrollTop = 0
        // //
        let gn=layerNo+1;
        d3.select('#regions-info__card').style('visibility', 'visible')
        d3.select('#regions-info__card').style('opacity', 1)
        document.getElementById('regions-info__card').scrollTop = 0
        //d3.select('#local__title').text(tr(gn));
        //d3.select('#local__title').text('Group   ' + gn + '    Description inhere');
        tr(gn)
        d3.select('#chart__title').text('Summary or (Analysis) of chart  ' + gn + '   inhere').style('background-color',getLayerColor (layerNo))
  
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
      
      //alert(layerNo);
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
})*/


/*d3.select('#group-buttons').selectAll('button[type=checkbox]').each(function(d, i){
  if(i<7){
    d3.select(this).style("background-color", GEODEMOS_COLORWAY[i])
  }

})*/


//const tr2=[traces[0],traces[1],traces[2],traces[3],traces[4],traces[5],traces[6]]
//const au=[]
d3.select('#group-buttons').selectAll('img').on('click' ,function(){
  
  let cb= $(this);
  let myv= $(this).attr("id");
 
  if (cb.attr("src") ==='/images/icons/Icon_eye_deselected.svg') {
  
  cb.attr("src","/images/icons/Icon_eye_selected.svg")
  
  } 
  else  {
  
    cb.attr("src","/images/icons/Icon_eye_deselected.svg")
  
  }
  
  let layerNo = myv === 'all' ? 'all' : parseInt(myv) -1
  
  if (layerNo !== 'all') {
  
  
    if(mapGeodemos.hasLayer(mapLayers[layerNo])){
      cb.clicked = false
       mapGeodemos.removeLayer(mapLayers[layerNo])
       Plotly.deleteTraces('chart-geodemos', 0,layout);
       //var data_update = {
        //'marker.color': getLayerColor(layerNo+1)
        //}
       //Plotly.update('chart-geodemos', data_update,0)

       //Plotly.react('chart-geodemos', [traces[layerNo]] ,layout)
     }
      else if(!mapGeodemos.hasLayer(mapLayers[layerNo])){
      cb.clicked = true
      let gn=layerNo+1;
      //alert('gn value' + gn)
      updateGroupTxt(gn)
      getzscorstat(layerNo)
      
      
      mapGeodemos.addLayer(mapLayers[layerNo])
      //Plotly.addTraces('chart-geodemos',{y:dd,x:traces[1].x},layout)
      Plotly.addTraces('chart-geodemos',{x: traces[layerNo].x,type:'bar','marker.color':GEODEMOS_COLORWAY_CATEGORICAL[layerNo],evaluate: 'TRUE'},0)
      
    }
  }

  
else if (layerNo === 'all') {// 'all' && cb.attr("src")=='/images/icons/Icon_eye_selected.svg') {
 //alert('all') 
 
 for(let i=1; i<8; i++)
 {
  let myimg=document.getElementById(i)    
  myimg.src="/images/icons/Icon_eye_deselected.svg"
 }



  //let img1 =document.getElementById("1")    
  //img1.src="/images/icons/Icon_eye_deselected.svg"
  //let img2 =document.getElementById("2")    
  //img2.src="/images/icons/Icon_eye_deselected.svg"
  //let img3 =document.getElementById("3")    
  //img3.src="/images/icons/Icon_eye_deselected.svg"
  //let img4 =document.getElementById("4")    
  //img4.src="/images/icons/Icon_eye_deselected.svg"
  //let img5 =document.getElementById("5")    
  //img5.src="/images/icons/Icon_eye_deselected.svg"
  //let img6 =document.getElementById("6")    
  //img6.src="/images/icons/Icon_eye_deselected.svg"
  //let img7 =document.getElementById("7")    
  //img7.src="/images/icons/Icon_eye_deselected.svg" 
 
 
//document.getElementById("containerDiv");
/*var ButtDivs = document.getElementById("#group-buttons");
for(var i=0; i<ButtDivs.length; i++)
{
     alert('-----'+ButtDivs[i].id);
}*/

 
 //let img1= document.getElementById("1")
 //img1.src="/images/icons/Icon_eye_selected.svg"
 //let div = document.getElementById('group-buttons');
 //let divChildren = div.childNodes.length;
 //alert(divChildren)
 //d3.select('#group-buttons').selectAll('img').each(function(i){
  //alert(i);
    //if(i<6){
    // d3.select(this).attr("src","/images/icons/Icon_eye_deselected.svg")
    //}
  //)


let cb= $(this);
var srrc = cb.attr("src");
  //alert('all' + srrc )

//alert(cb.checked===true)
//cb.src="/images/icons/Icon_eye_selected.svg"
    
    if (srrc=="/images/icons/Icon_eye_selected.svg")
    {
    mapLayers.forEach( l =>{
      //if(!mapGeodemos.hasLayer(l)){
        mapGeodemos.addLayer(l)
        //Plotly.react('chart-geodemos', [traces,traces[myv]] ,layout)
      
      
    })

    // alert('here')
    Plotly.react('chart-geodemos', [traces[0],traces[1],traces[2],traces[3],traces[4],traces[5],traces[6]] ,layout)
       getzscorstatfAll(traces);
      // cb.src="/images/icons/Icon_eye_selected.svg"
      let myim =document.getElementById("1")
      
      myim.src="/images/icons/Icon_eye_deselected.svg"
  }
  else if (srrc=="/images/icons/Icon_eye_deselected.svg")
  {
    mapLayers.forEach( l =>{
      if(mapGeodemos.hasLayer(l)){
        mapGeodemos.removeLayer(l)
      }
    })
      mapGeodemos.addLayer(mapLayers[0])
      Plotly.react('chart-geodemos', [traces[0]],layout)
      //d3.select('#group-text').text(dublinRegionsJson[0]).style('font-size','15px');  
      let myim =document.getElementById("1")
      
      myim.src="/images/icons/Icon_eye_selected.svg"
      //cb= $(this);
  }



    //cb.clicked=true
    //alert(cb.clicked==true)

  /*if (layerNo === 'all' && cb.clicked ===true)
  {
    mapLayers.forEach( l =>{
      if(mapGeodemos.hasLayer(l)){
        mapGeodemos.removeLayer(l)
      }})
      mapGeodemos.addLayer(mapLayers[0])
      Plotly.react('chart-geodemos', [traces[0]],layout)
    
      
  }*/


  }


})
  


    //)}
 // }
 /* if (layerNo !== 'all' && cb.clicked == true) {//cb.classed('active')) {
    // cb.classed('active', false)
    //d3.select('#group-buttons').select('#group-all').classed('active', false)
    //cb.clicked == false

    if(mapGeodemos.hasLayer(mapLayers[layerNo])){
     // mapGeodemos.removeLayer(mapLayers[layerNo])
    }
  } else if (myv!== 'all'){
    //d3.select('#group-buttons').selectAll('img')
    (cb.clicked == true)
    mapLayers.forEach( l =>{
      if(mapGeodemos.hasLayer(l)){
        mapGeodemos.removeLayer(l)
        //mapGeodemos.removeLayer(l)
      }
    })
    if(!mapGeodemos.hasLayer(mapLayers[layerNo])){
      mapGeodemos.addLayer(mapLayers[layerNo],mapLayers[myv])
      Plotly.react('chart-geodemos', [traces[layerNo],traces[myv]] ,layout)
    }
    //alert(layerNo)
    //alert(layerNo+2)
    Plotly.react('chart-geodemos', [traces[layerNo]] ,layout)
    //Plotly.react('chart-geodemos', [traces[0],traces[1],traces[2],traces[3],traces[4],traces[5],traces[6]] ,layout)
    
  } else if (cb.clicked == true){
    //d3.select('#group-buttons').selectAll('button[type=checkbox]').classed('active', false)
    mapLayers.forEach( l =>{
      if(mapGeodemos.hasLayer(l)){
        mapGeodemos.removeLayer(l)
      }
    })

  }
  
  else {
    console.log(layerNo +',,'+myv)
    //d3.select('#group-buttons').selectAll('button[type=checkbox]').classed('active', true)
    mapLayers.forEach( l =>{
      if(!mapGeodemos.hasLayer(l)){
        mapGeodemos.addLayer(l)
        //Plotly.react('chart-geodemos', [traces,traces[myv]] ,layout)
       Plotly.react('chart-geodemos', [traces[0],traces[1],traces[2],traces[3],traces[4],traces[5],traces[6]] ,layout)
      }
    })
  }*/
//)
//})