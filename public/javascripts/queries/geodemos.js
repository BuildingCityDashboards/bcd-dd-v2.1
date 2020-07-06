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
//alert('GroupJson8888')
  
import { getDublinBoundsLatLng } from '../modules/bcd-maps.js'
//alert('sssssssss')
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
let columnData ={}
let punti_mappa = []
let myTestArray=[]
let cov=0;
//let soc_eco_val=0
//let mapGeodemos = new L.Map('map-geodemos')



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
  onEachFeature: onEachFeature
}) //layer for 'NA' data
// mapGeodemos.addLayer(mapLayers[0])

let traces = []
let layout = {}
let tracesIndx = []
let hmlayout = {}
let columnNames={}
let tarry=[]

d3.csv('/data/tools/geodemographics/dublin_zscores.csv')
.then((zScores)=>{


  //columnNames = Object.keys(zScores[0]).reverse();
  columnNames = Object.keys(zScores[0]);
  //const zScores2=zScores.reverse();
  columnNames = columnNames.filter(e=>e!=='cluster')
// alert(zScores)
  zScores.forEach((row, i) => {
  
    let trace = Object.assign({}, TRACES_DEFAULT);
    trace.type = 'bar'
    trace.orientation = 'h'
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker = {
    color: getLayerColor(i), // lines + markers, defaults to colorway
    }
   
    trace.x = columnNames.map( name => {
     
      return row[name]
      
    })
    
    trace.y = columnNames
    
    traces.push(trace)
})



layout = Object.assign({}, ROW_CHART_LAYOUT);
layout.mode = 'bars'
layout.height = 500
//layout.barmode = 'group';
// layout.colorway = GEODEMOS_COLORWAY
layout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
layout.title.text = 'Variables Value Distribution (z-scores)';
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
  //TrackingArray.push(1)
  //updateGroupTxt(1);
  //getzscorstat(0)
    
}) //end then

  
let soc_eco_val=0;
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
  // alert(JSON.stringify(lookup))
  let features = []

  let dataBase = '/data/tools/census2016/'
  let dcc0 = 'DCC_SA_0.geojson'
  let dcc1 = 'DCC_SA_1.geojson'
  let dcc2 = 'DCC_SA_2.geojson'
// promises
  let pDCC0 = d3.json(dataBase + dcc0)
  let pDCC1 = d3.json(dataBase + dcc1)
  let pDCC2 = d3.json(dataBase + dcc2)


  let dccSAs = await Promise.all([pDCC0, pDCC1, pDCC2]) // yields an array of 3 feature collections
  
  
  dccSAs.forEach(sas => {
    // updateMap(sas)
    
    sas.features.forEach(sa => {
      try{
        let groupNo = lookup[sa.properties.SMALL_AREA]
        sa.properties.groupnumber= groupNo
        
       
        
        //alert(JSON.stringify(sa.geometry.coordinates[0][1]),sa.properties.groupColor)
        addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index
        //var punti_mappa = geoJson2heat(sa,Varval)
        //myTestArray.push(sa.geometry.coordinates)
      }
      catch{
        console.warn(`Error on lookup for sa. Adding to NA layer \n ${JSON.stringify(sa)} `)
        sa.properties.groupnumber= 'NA'
        addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
      }
      // console.log(layerNo)
      
    
    })
    //alert(JSON.stringify(sas.features))
  })
 // for (let u=0; u < myTestArray.length; u++)
 // {
    //alert(parseFloat(myTestArray[1]))
  //}
  
//alert(JSON.stringify(dccSAs))
  
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
        
        //let Varval = traces[groupNo-1].x[soc_eco_val];
        // alert(groupNo)
        //alert(groupNo + '----' + traces[groupNo].x[0])
        //sa.properties.groupColor= Varval
        addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index
       
      }
      catch{
        console.warn(`Error on lookup for sa. Adding to NA layer \n ${JSON.stringify(sa)} `)
        sa.properties.groupnumber= 'NA'
        addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
      }
     
})
})
//var punti_mappa =  geoJson2heat(sa,Varval)
  mapGeodemos.addLayer(mapLayers[0])
  updateGroupTxt(1);
}

function getEmptyLayersArray (total) {
  let layersArr = []
  for (let i = 0; i < total; i += 1) {
    layersArr.push(L.geoJSON(null, {
//      style: subteStyle,
      //style: getLayerStyle(i),
      onEachFeature: onEachFeature
      // filter: filterInitialView
    })
    )
  }
  return layersArr
}






function subteStyle(feature) {
  return {
    color: getFColor(feature.properties.groupColor),
    weight: 0.2,
    opacity: .5,
    fillColor: getFColor(feature.properties.groupColor),
    dashArray: '3',
		fillOpacity: .6,
  };
}    


function addFeatureToLayer (feature, layerNo) {
  //alert(JSON.stringify(feature))
  //alert(geoJson2heat(feature,feature.properties.groupColor))
 
 
  if (layerNo ==='NA'){
    naLayer.addData(feature)
    mapGeodemos.addLayer(naLayer)
  }
  else{
  mapLayers[layerNo].addData(feature)
 //punti_mappa =  geoJson2heat(mapLayers[layerNo],0.8)
 // alert(punti_mappa)
 //alert(geoJson2heat(mapLayers[layerNo],feature.properties.groupColor))
  }
 // alert(geoJson2heat(mapLayers[layerNo],feature.properties.groupColor))
}

//alert(geoJson2heat(mapLayers[0],feature.properties.groupColor))
//alert(punti_mappa)
function getLayerStyle (index) {
  // console.log("style feature "+f.properties.COUNTYNAME)
  return {
    //fillColor: getLayerColor(index),
    //weight: 0.3,
    //opacity: 0.3,
    //color: getLayerColor(index),
    //dashArray: '1',
    //fillOpacity: 0.9
  }
}

function getLayerStyle2 (index) {
  // console.log("style feature "+f.properties.COUNTYNAME)
  return {
    fillColor: getFColor(index),
    weight: 0.3,
    opacity: 0.3,
    color: getFColor(index),
    dashArray: '1',
    fillOpacity: 0.9
  }
}


function getLayerColor (index) {
  return GEODEMOS_COLORWAY[index]
}

function updateGroupTxt(no)
{
// getLayerColor(index)
  d3.json("/data/home/geodem-text-data.json").then(function(dublinRegionsJson) {  
  d3.select('#group-title').text(dublinRegionsJson[1][no]).style('font-size','26px').style('font-weight','bold');
  //
  d3.select('#group-title').text(dublinRegionsJson[1][no]); //.style("color",getLayerColor(no-1));
  d3.select('#group-text').text(dublinRegionsJson[0][no]).style('font-size','15px');
  
  })
}





function getFColor(d) {
  return  d > 2.0 ? '#c02626' :
          d > 1.5 ? '#d9c01c' :
          d > 1.0 ? '#d99a1c' :       
          d > 0.5 ? '#d9871c':
          d == 0 ? '#d9771c' :
          d < 0 ? '#d95b1c' :
          d > -0.5  ? '#d93f1c' :
          d > -1.0  ? '#d9221c' :
                   '#b9d91c';
}




function getzscorstat(trno)
{
  let result=[]
  
let obj=traces[trno].x
for (let h=0; h< obj.length; h++)
{
  
  result.push(parseFloat(obj[h]))
}



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



 }


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





//traces[feature.properties.groupnumber].x[strUser]

let value=0
let text=''
//let cov=0;
d3.select('#seco').on('change' , function()
{
 
  //soc_eco_val
  var e = document.getElementById("seco");
  var value = e.options[e.selectedIndex].value;
  var text = e.options[e.selectedIndex].text;
  
  mapLayers.forEach((l,k) =>{
    mapGeodemos.removeLayer(l)
    //if(!mapGeodemos.hasLayer(l)){
    let mlay=mapLayers[k]
     cov=traces[k].x[value];
    //let feature.properties.groupColor=cov
    mapGeodemos.addLayer(l)
    mlay.setStyle({color: '#da0101',//getFColor(cov),
    fillColor: getFColor(cov),
    weight: 1, //parseFloat(cov),
    opacity: parseFloat(cov),
      
      dashArray: '1',
      fillOpacity: 0.5 //parseFloat(cov)
      
    
      //fillColor: 'grey',
      // weight: 1,
      // opacity: 2,
      // color: 'grey',
      // dashArray: '1',
      // fillOpacity: 0.5

    });
   
//  }
})
//addheatmap() 
//alert('yes1' + value)
addheatmap_Sv(value,text)
updateGroupTxt('all')
}
)
function onEachFeature (feature, layer) {
  //let e = document.getElementById("seco");
  
  //let strUser = e.options[e.selectedIndex].value;

  //var e = document.getElementById("seco");
  //var value = e.options[e.selectedIndex].value;
  //var text = e.options[e.selectedIndex].text;
  //alert(typeof parseInt(feature.properties.groupnumber))
  //let idx=feature.properties.groupnumber
  //if (idx !='NA')
  //{
  //  idx=parseInt(feature.properties.groupnumber)
    //alert(idx + '---' + typeof(idx))
    //let mlay=mapLayers[ln]
   //let cov2=traces[idx].x[value];
  //}
  //let mlay=mapLayers[idx]
    layer.bindPopup(
                '<p><b>' + feature.properties.EDNAME + '</b></p>' +
                '<p><b>' + cov + '<p><b>' +
              //  '<p><b>' + cov2 + '</b></p>' +
                '<p>' + feature.properties.COUNTYNAME + '</p>' +
                '<p>SA ' + feature.properties.SMALL_AREA + '</p>'+
                '<p>Group ' + feature.properties.groupnumber + '</p>'
                
                )
    //     }     // bind click
  layer.on({
    click: function () {
    }
  })
}
//}




//)






d3.select('#group-buttons').selectAll('img').on('click' ,function(){
  
  let cb= $(this);
  let myv= $(this).attr("id");
  
  //if (cb.attr("src") ==='/images/icons/Icon_eye_deselected.svg') {
  
  //cb.attr("src","/images/icons/Icon_eye_selected.svg")
  
  //} 
  //else  {
  
    //cb.attr("src","/images/icons/Icon_eye_deselected.svg")
  
  //}
  
  let layerNo = myv === 'all' ? 'all' : parseInt(myv) -1
  
  if (layerNo !== 'all') {
  /*alert(layerNo)
        
    if(mapGeodemos.hasLayer(mapLayers[layerNo])){
      //alert('yes')
      cb.clicked = false
      
  
      //mapGeodemos.removeLayer(mapLayers[layerNo])
       //Plotly.deleteTraces('chart-geodemos', 0,layout);
       //TrackingArray.pop()
       //alert(TrackingArray)
       //let litemindex=TrackingArray.slice(-1)[0];
       
       //updateGroupTxt(litemindex)
       //var data_update = {
        //'marker.color': getLayerColor(layerNo+1)
        //}
       //Plotly.update('chart-geodemos', data_update,0)

       //Plotly.react('chart-geodemos', [traces[layerNo]] ,layout)
     }
      else if(!mapGeodemos.hasLayer(mapLayers[layerNo])){
      //cb.clicked = true*/


      
      //getzscorstat(layerNo)
      //if (TrackingArray[gn] !==''){
      //let n = TrackingArray.includes(gn);
      
  
  
      mapLayers.forEach( l =>{
        //if(!mapGeodemos.hasLayer(l)){
          mapGeodemos.removeLayer(l)
          //Plotly.react('chart-geodemos', [traces,traces[myv]] ,layout)
        
        
      })
      for(let i=1; i <8 ; i++)
 {
   let myimg=document.getElementById(i)    
  myimg.src="/images/icons/Icon_eye_deselected.svg"
 }
 let ssimg=document.getElementById('all')    
 ssimg.src="/images/icons/Icon_eye_deselected.svg"


 let gn=layerNo+1;
      //mapGeodemos.removeLayer(mapLayers[layerNo-1])
      updateGroupTxt(gn)
    mapGeodemos.addLayer(mapLayers[layerNo])
      //Plotly.addTraces('chart-geodemos',{y:dd,x:traces[1].x},layout)
      //Plotly.addTraces('chart-geodemos',{x: traces[layerNo].x,type:'bar','marker.color':GEODEMOS_COLORWAY_CATEGORICAL[layerNo],evaluate: 'TRUE'},0)
      Plotly.react('chart-geodemos', [traces[layerNo]], layout)
      let myimg1=document.getElementById(gn)    
      myimg1.src="/images/icons/Icon_eye_selected.svg"
      //TrackingArray.push(gn) 
      
    }
  //}




   if (layerNo === 'all') {// 'all' && cb.attr("src")=='/images/icons/Icon_eye_selected.svg') {
 //alert('all') 
//alert(parseInt(soc_eco_val)) 
 for(let i=1; i<8; i++)
 {
  let myimg2=document.getElementById(i)    
  myimg2.src="/images/icons/Icon_eye_deselected.svg"
 }
 let simg=document.getElementById('all')    
 simg.src="/images/icons/Icon_eye_selected.svg"

 //alert('all two')

let cb= $(this);
let srrc = cb.attr("src");
//alert(srrc)
//srrc="/images/icons/Icon_eye_selected.svg" 
    
    //if (srrc=="/images/icons/Icon_eye_selected.svg")
    //{
    mapLayers.forEach((l,k) =>{
    //alert( soc_eco_val+ '---'+ traces[k].x[soc_eco_val])
    if(!mapGeodemos.hasLayer(l)){
    let mlay=mapLayers[k]
    let cov=traces[k].x[soc_eco_val];
    
    //alert(selText)
    
    //l.popup.setContent('<br> <p> <b>'+ cov);
    //mlay.getPopup().update(+ 'sssd' );
    // mlay.bindPopup(
    //   + '<p><b> val2' + cov + '</b></p>' 
      
    //   )
    mapGeodemos.addLayer(mlay)


    //mlay.setStyle(getLayerStyle2(cov))
     mlay.setStyle({color: getFColor(cov),
      fillColor: getFColor(cov),
    weight: 0.3,
    opacity: 0.3,
    color: getFColor(cov),
    dashArray: '1',
    fillOpacity: 0.9
    
    
    }
     
    
    );
    //Plotly.react('chart-geodemos', [traces,traces[myv]] ,layout)
    //alert(traces[k].x[soc_eco_val]);
    //alert(layerNo + '---' + soc_eco_val)
  }})
// let tto=7
//   function getl(tto) {
//     //let layersArr = []
//     for (let i = 0; i < tto; i += 1) {
//       //layersArr.push(L.geoJSON(null, {
//         //style: subteStyle,
//         //style: getLayerStyle(i),
//         //onEachFeature: onEachFeature
//     alert(traces[i].x + '---' + soc_eco_val)
//         // filter: filterInitialView
//       }
      
//     }
    //return layersArr
  //}



  //getl()    
  //addheatmap()    
  //updateGroupTxt('all')

  //let seim =document.getElementById("1")
      
      
      
  //let myim =document.getElementById("1")
  //myim.src="/images/icons/Icon_eye_deselected.svg"
 // }
  //else if (srrc=="/images/icons/Icon_eye_deselected.svg")
  //{
    //mapLayers.forEach( l =>{
    //if(mapGeodemos.hasLayer(l)){
    //mapGeodemos.removeLayer(l)
    //}
   // })
      /*mapGeodemos.addLayer(mapLayers[0])
      Plotly.newPlot('chart-geodemos', [traces[0]],layout)
      updateGroupTxt(1)
      //d3.select('#group-text').text(dublinRegionsJson[0]).style('font-size','15px');  
      let myim =document.getElementById("1")
      
      myim.src="/images/icons/Icon_eye_selected.svg"
      
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





function addheatmap ()
{
  let GroupsArray=['Group1', 'Group2', 'Group3', 'Group4', 'Group5','Group6','Group7']
  hmlayout = Object.assign({}, ROW_CHART_LAYOUT);
  //layout.mode = 'bars'
  hmlayout.height = 500
  hmlayout.width = 360
  //layout.barmode = 'group';
  hmlayout.colorway = GEODEMOS_COLORWAY
  hmlayout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
  hmlayout.title.text = 'Variables Value Distribution (z-scores)';
  hmlayout.showlegend = false;
  hmlayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
  hmlayout.legend.xanchor = 'right';
  hmlayout.legend.y = 0.1;
  hmlayout.legend.traceorder = 'reversed';
  hmlayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
  hmlayout.xaxis.title = "";
  //hmlayout.xaxis.range = [-2, 2]
  hmlayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
  hmlayout.yaxis.tickfont ={
    family: 'PT Sans',
    size: 10,
    color: '#313131'
  }
  hmlayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
  hmlayout.yaxis.titlefont.size = 16; //bug? need to call this
  hmlayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);
  //-hmlayout.hovermode ='closest';
  //-hmlayout.hoverinfo = "z";
  //-hmlayout.domain =[0.85,0.9];
  hmlayout.yaxis.title = '';
  hmlayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)
  hmlayout.margin = {
    l: 20,
    r: 20, //annotations space
    t: 20,
    b: 0
    
  };
  


  d3.text('/data/tools/geodemographics/dublin_zscores.csv')
  .then((zScores)=>{
    let newCsv = zScores.split('\n').map(function(line) {
      let columns = line.split(','); // get the columns
      columns.splice(0, 1); // remove total column
      return columns;
  }).join('\n');

  const rows = newCsv.split('\n');
  //alert(rows)
  // get the first row as header
  const header = rows.shift();
  //alert(header)
  //const header = columnNames;
  const numberOfColumns = header.split(',').length
  
  // initialize 2D-array with a fixed size
  const columnData = [...Array(numberOfColumns)].map(item => new Array());
  
  for(let i=0; i<rows.length; i++) {
    let row = rows[i];
    let rowData = row.split(',');
  
    // assuming that there's always the same
    // number of columns in data rows as in header row
    for(let j=0; j<numberOfColumns; j++) {
      columnData[j].push((rowData[j]));
    
    
  }
}
//alert(columnData[1][0])
  
  let data = [
      {
          z: columnData,
          x: GroupsArray,
          y: header.split(','),
          type: 'heatmap',
         
          //colorscale: [[0, '#800026'], [0.25, 'rgb(31,120,180)'], [0.45, 'rgb(178,223,138)'], [0.65, 'rgb(51,160,44)'], [0.85, 'rgb(251,154,153)'], [1, 'rgb(227,26,28)']]
         
          
          colorscale: [

            // Let first 10% (0.1) of the values have color rgb(0, 0, 0)
            

           
          
            
            // Let values between 10-20% of the min and max of z
            // have color rgb(20, 20, 20)
            
                    [0.1, '#FFEDA0'],
                    [0.7, '#FFEDA0'],
            
            // Values between 20-30% of the min and max of z
            //have color rgb(40, 40, 40)
            
                    [0.7, '#BD0026'],
                    [1.0, '#BD0026'],
            
                    
                    
                ]


         
      }  
          
      ];
      //Plotly.purge('chart-geodemos'); 
      Plotly.newPlot('chart-geodemos', data, hmlayout);

})

}



function addheatmap_Sv (value,text)
{
  //alert('yes2' + value)
  let GroupsArray=['Group1', 'Group2', 'Group3', 'Group4', 'Group5','Group6','Group7']
  hmlayout = Object.assign({}, ROW_CHART_LAYOUT);
  //layout.mode = 'bars'
  hmlayout.height = 300
  hmlayout.width = 360
  //layout.barmode = 'group';
  hmlayout.colorway = GEODEMOS_COLORWAY
  hmlayout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
  hmlayout.title.text = 'Variables Value Distribution (z-scores)';
  hmlayout.showlegend = false;
  hmlayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
  hmlayout.legend.xanchor = 'right';
  hmlayout.legend.y = 0.1;
  hmlayout.legend.traceorder = 'reversed';
  hmlayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
  hmlayout.xaxis.title = "";
  //hmlayout.xaxis.range = [-2, 2]
  hmlayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
  hmlayout.yaxis.tickfont ={
    family: 'PT Sans',
    size: 10,
    color: '#313131'
  }
  hmlayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
  hmlayout.yaxis.titlefont.size = 16; //bug? need to call this
  hmlayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);
  //-hmlayout.hovermode ='closest';
  //-hmlayout.hoverinfo = "z";
  //-hmlayout.domain =[0.85,0.9];
  hmlayout.yaxis.title = '';
  hmlayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)
  hmlayout.margin = {
    l: 20,
    r: 20, //annotations space
    t: 20,
    b: 0
    
  };
  


  d3.text('/data/tools/geodemographics/dublin_zscores.csv')
  .then((zScores)=>{
    let newCsv = zScores.split('\n').map(function(line) {
      let columns = line.split(','); // get the columns
      columns.splice(0, 1); // remove total column
      return columns;
  }).join('\n');

  const rows = newCsv.split('\n');
  //alert(rows)
  // get the first row as header
  const header = rows.shift(); //.revers();
  //alert(header)
  //const header = columnNames;
  const numberOfColumns = header.split(',').length
  
  // initialize 2D-array with a fixed size
  const columnData = [...Array(numberOfColumns)].map(item => new Array());
  
  for(let i=0; i<rows.length; i++) {
    let row = rows[i];
    let rowData = row.split(',');
  
   
    for(let j=0; j<numberOfColumns; j++) {
      columnData[j].push((rowData[j]));
    
    
  }
}
let zArray=[]
for (let r=0;r<7;r++)
{
//alert(columnData[value][r])
zArray.push(columnData[value][r])
} 
  let data = [
      {
          z: [zArray], //columnData,
          //x: GroupsArray,
          //y: header.split(','),
          //z: [[2.053633391,0.261867764,-0.412739154,-0.588462387,-0.466565008,-0.694338304,0.894616436]],
          x: GroupsArray, // ['', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          y: [text],
          type: 'heatmap',
          hoverongaps: false,
          
         
          //colorscale: [[0, '#800026'], [0.25, 'rgb(31,120,180)'], [0.45, 'rgb(178,223,138)'], [0.65, 'rgb(51,160,44)'], [0.85, 'rgb(251,154,153)'], [1, 'rgb(227,26,28)']]
          // return  d == 0 ? 'rgb(165,0,38)' :
          // d < 0 ? 'rgb(215,48,39)' :
          // d > 0  ? 'rgb(10,10,10)' :
          //          'rgb(240,25,76)';
          
          colorscale: [

            [0.1, 'rgb(165,0,38)'],
            [0.9, 'rgb(165,0,38)'],
            
            [0.9, 'rgb(220,0,138)'],
            [2.0, 'rgb(220,0,138)']
            
            [-0.5, 'rgb(10,10,10)'],
            [0.5, 'rgb(10,10,10)'],

          ]


         
      }  
          
      ];
      //Plotly.purge('chart-geodemos'); 
      Plotly.newPlot('chart-geodemos', data, hmlayout);

})


}