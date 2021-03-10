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


const GEODEMOS_COLORWAY_CATEGORICAL=['#7fc97f'
  ,'#beaed4'
  ,'#fdc086'
  ,'#ffff99'
  ,'#386cb0'
  ,'#f0027f'
  ,'#bf5b17']       
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


let traces = []
let ntraces = []
let layout = {}
let tracesIndx = []
let hmlayout = {}
let columnNames={}
let columnNames2={}
let tarry=[]


d3.csv('/data/tools/geodemographics/dublin_zscores_t.csv')
.then((zScores)=>{

zScores.forEach((row, i) => {
  
let columnNames = Object.keys(row).sort(function(a,b){return row[a]-row[b]})
   
   let trace = Object.assign({}, TRACES_DEFAULT);
    //trace.type = 'bar'
    //trace.orientation = 'h'
    //trace.mode = ''
    //trace.hovertemplate= 'z-score: %{x:.2f}<extra></extra>'
    trace.mode= 'markers+text'
    trace.type= 'scatter'
    
    //trace.orientation = 'h'
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker = {
    color: getLayerColor(i), // lines + markers, defaults to colorway
    }
   
    
    trace.x = columnNames.map( name => {
     
      return row[name]
      
    })
    
    trace.y = columnNames
    
    traces.push(trace)
    trace.hovertemplate= `%{x:.2f}<extra>Group No: ${i+1}</extra>`
   
})



layout = Object.assign({}, ROW_CHART_LAYOUT);
//layout.mode = 'bars'
layout.height = 500

layout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
layout.title.text = 'Variables Value Distribution (z-scores)';
layout.title.x=0.51
layout.title.y=0.99
layout.title.xanchor='center'
layout.title.yanchor='top'
layout.title.font= { color: '#6fd1f6',
family: 'Roboto',
size: 17

},
layout.showlegend = false;
layout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
layout.legend.xanchor = 'right';

layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
layout.xaxis.title = "value";
layout.xaxis.range = [-2, 2.9]
layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
layout.yaxis.tickfont ={
  family: 'PT Sans',
  size: 9,
  color: '#6fd1f6'
}
layout.xaxis.tickfont ={
  family: 'PT Sans',
  size: 10,
  color: '#6fd1f6'
}

layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
layout.yaxis.titlefont.size = 16; //bug? need to call this
layout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);

layout.plot_bgcolor="#293135",
layout.paper_bgcolor="#293135"


layout.yaxis.title = '';
layout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

layout.margin = {
  l: 40,
  r: 40, //annotations space
  t: 40,
  b: 0
  
};
scatterHM()
updateGroupTxt('all')

}) //end then
let lyt={}

function scatterHM ()
{
  d3.csv('/data/tools/geodemographics/dublin_zscores.csv')
.then((zScores)=>{
  columnNames2 = Object.keys(zScores[0]);
  columnNames2=columnNames2.reverse();
  columnNames2 = columnNames2.filter(e=>e!=='cluster')
  
  zScores.forEach((row, i) => {
  
    let ntrace = Object.assign({}, TRACES_DEFAULT);
    ntrace.type = 'scatter'
    ntrace.mode = 'markers+text'
    
    ntrace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    ntrace.marker = {
    color: getLayerColor(i), 
    size: 11,
    
    }
   
    ntrace.x = columnNames2.map( name2 => {
     
      return row[name2]
      
    })
    
    ntrace.y = columnNames2
    
    ntraces.push(ntrace)
    ntrace.hovertemplate= `%{x:.2f}<extra>Group No: ${i+1}</extra>`
  
})



lyt = Object.assign({}, ROW_CHART_LAYOUT);
lyt.mode = 'scatter'
lyt.height = 500
//lyt.width = 300
lyt.plot_bgcolor="#293135",
lyt.paper_bgcolor="#293135"

lyt.title = Object.assign({}, ROW_CHART_LAYOUT.title);
lyt.title.text = 'Variables Value Distribution (z-scores)';
lyt.title.x=0.51
lyt.title.y=0.99
lyt.title.xanchor='center'
lyt.title.yanchor='top'
lyt.title.font= { color: '#6fd1f6',
family: 'Roboto',
size: 17

},

lyt.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
lyt.legend.xanchor = 'right';
lyt.legend.y = 0.1;
lyt.legend.traceorder = 'reversed';
lyt.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
lyt.xaxis.title = "";
lyt.xaxis.range = [-2, 2.9]
lyt.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
lyt.yaxis.tickfont ={
  family: 'PT Sans',
  size: 9,
  color: '#6fd1f6'
}
lyt.xaxis.tickfont ={
  family: 'PT Sans',
  size: 10,
  color: '#6fd1f6'
}

lyt.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
lyt.yaxis.titlefont.size = 16; //bug? need to call this
lyt.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);

lyt.plot_bgcolor="#293135",
lyt.paper_bgcolor="#293135"


lyt.yaxis.title = '';
lyt.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

lyt.margin = {
  l: 20,
  r: 60, //annotations space
  t: 40,
  b: 0
  
};



Plotly.newPlot('chart-geodemos', [ntraces[0],ntraces[1],ntraces[2],ntraces[3],ntraces[4],ntraces[5],ntraces[6]], lyt, {
   modeBar: {
     orientation: 'v',
     bgcolor: 'black',
     color: null,
     activecolor: null
   },
  
  })
  
}) //end then
}
//let soc_eco_val=0;
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
               
        
        addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index
        
       
      }
      catch{
        
        sa.properties.groupnumber= 'NA'
        addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
      }
      // console.log(layerNo)
      
    
    })
    //alert(JSON.stringify(sas.features))
  })
 
// Fingal, DL/R, SDCC
  let fcc = 'FCC_SA_0.geojson'
  let dlr = 'DLR_SA_0.geojson'
  let sdcc = 'SDCC_SA_0.geojson'
  let testd = 'Small_Areas__Generalised_20m__OSi_National_Boundaries.geojson'
  let pfcc = d3.json(dataBase + fcc)
  let pdlr = d3.json(dataBase + dlr)
  let psdcc = d3.json(dataBase + sdcc)
  let ts = d3.json(dataBase + testd)

  let otherSAs = await Promise.all([pfcc, pdlr, psdcc,ts])
  otherSAs.forEach(sas => {
    // updateMap(sas)
    sas.features.forEach(sa => {
      try{
        let groupNo = lookup[sa.properties.SMALL_AREA]
        sa.properties.groupnumber= groupNo
        
        
        addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index
       
      }
      catch{
        //console.warn(`Error on lookup for sa. Adding to NA layer \n ${JSON.stringify(sa)} `)
        sa.properties.groupnumber= 'NA'
        addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
      }
     
})
})
  AddLayersToMap()
}

function getEmptyLayersArray (total) {
  let layersArr = []
  for (let i = 0; i < total; i += 1) {
    layersArr.push(L.geoJSON(null, {

      style: getLayerStyle(i),
      onEachFeature: onEachFeature
      
    })
    )
  }
  return layersArr
}
function addFeatureToLayer (feature, layerNo) {
  
  if (layerNo ==='NA'){
    
  }
  else{
  mapLayers[layerNo].addData(feature)
 
  }
 
}

function getLayerStyle (index) {
 
  return {
    fillColor: getLayerColor(index),
    weight: 0.3,
    opacity: 0.9,
    color: getLayerColor(index),
    //dashArray: '1',
    fillOpacity: 0.9
  }
}
function getLayerColor (index) {
  return GEODEMOS_COLORWAY[index]
}

function updateGroupTxt(no)
{
 
  if (document.contains(document.getElementById("myhref"))) {
    document.getElementById("href").remove();
}
  
  let dd = document.getElementById("desc")
  if (no ==='all') {
   no='all1'
   
  

}


  d3.json("/data/home/geodem-text-data.json").then(function(dublinRegionsJson) {  
  d3.select('#group-title').text(dublinRegionsJson[1][no]).style('font-size','27px').style('font-weight','bold');
  //
  d3.select('#group-title').text(dublinRegionsJson[1][no]);//.style("color",getLayerColor(no-1));
  d3.select('#group-text').text(dublinRegionsJson[0][no]).style('font-size','15px');
  
  })

}
function getFColor(d) {
 
  return  d > 2.0 ? '#FFFFFF' :
          d > 1.5 ? '#BFB6B3' :
          d > 1.0 ? '#d99a1c' :       
          d > 1 ? '#989290':
          d == 1 ? '#746F6D' :
          
                   '#000000';
}
let ttt=[]

let value=0
let text=''

function onEachFeature (feature, layer) {
  let customOptions =
    {
    'maxWidth': '400',
    'width': '250',
    'className' : 'popupCustom'
    }
 let popTextContent=
           '<p><b>Group ' + feature.properties.groupnumber + '</b></p>' + 
           '<p><b>' + feature.properties.EDNAME + '</b></p>' +  
           '<p><b>' + feature.properties.COUNTYNAME + '</b></p>' +
           '<p><b>SA ' + feature.properties.SMALL_AREA + '</b></p>'
           
 layer.bindPopup(popTextContent,customOptions)
    
  layer.on({
    click: function () {
    }
  })
}

d3.select('#group-buttons').selectAll('img').on('click' ,function(){

  let cb= $(this);
  let myv= $(this).attr("id");
  ResetImages(myv)
  let layerNo = myv === 'all' ? 'all' : parseInt(myv) -1
  
  if (layerNo !== 'all') {
  
      mapLayers.forEach( l =>{
       
          mapGeodemos.removeLayer(l)
         
               
      })



 let gn=layerNo+1;
      
      
      updateGroupTxt(gn)
      mapGeodemos.addLayer(mapLayers[layerNo])
      
      Plotly.react('chart-geodemos', [traces[layerNo]], layout)
      
    }
  //}


  layerNo=myv;

if (layerNo === 'all') {// 'all' && cb.attr("src")=='/images/icons/Icon_eye_selected.svg') {
  
scatterHM()
updateGroupTxt('all')
AddLayersToMap()

  }
})


function AddLayersToMap ()

{

  mapLayers.forEach((l,k) =>{
    //alert( soc_eco_val+ '---'+ traces[k].x[soc_eco_val])
    if(!mapGeodemos.hasLayer(l)){
    let mlay=mapLayers[k]
    //let cov=traces[k-1].x[soc_eco_val];
    
   
    mapGeodemos.addLayer(mlay)
   
     mlay.setStyle({
     fillColor: getLayerColor(k)//getFColor(cov)
        
    }
     
    
    );
    
  }
  })


}


  
function ResetImages(imgid) 
{
  

  let imgsrcarr=['/images/icons/Icon_eye_selected-all.svg',
  '/images/icons/Icon_eye_selected-1.svg',
  '/images/icons/Icon_eye_selected-2.svg',
  '/images/icons/Icon_eye_selected-3.svg',
  '/images/icons/Icon_eye_selected-4.svg',
  '/images/icons/Icon_eye_selected-5.svg',
  '/images/icons/Icon_eye_selected-6.svg',
  '/images/icons/Icon_eye_selected-7.svg']


  let Oimgsrcarr=['/images/icons/sdAg.svg',
  '/images/icons/sd10.svg',
  '/images/icons/sd2.svg',
  '/images/icons/sd3.svg',
  '/images/icons/sd4.svg',
  '/images/icons/sd5.svg',
  '/images/icons/sd6.svg',
  '/images/icons/sd7.svg']


let myimg3=document.getElementById('all') 
myimg3.src="/images/icons/sdAg.svg"
  
for(let i=1; i<8; i++)
 {
  let myimg2=document.getElementById(i) 
     
      myimg2.src=Oimgsrcarr[i]//"/images/icons/sd.svg"
     
 }

 //if (imgid ==='all')
//alert('----'+imgid)
let selectedImg=document.getElementById(imgid)
    if(imgid ==='all') {imgid=0} 
    selectedImg.src=imgsrcarr[imgid] 
}




function addHorizrntalBars (value,text)
{
  //alert(value + text)
  let GroupsArray=['Group1', 'Group2', 'Group3', 'Group4', 'Group5','Group6','Group7']
  hmlayout = Object.assign({}, ROW_CHART_LAYOUT);
  
  
  hmlayout.height = 500
  hmlayout.width = 360
  //layout.barmode = 'group';
  hmlayout.colorway = GEODEMOS_COLORWAY
  hmlayout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
  hmlayout.title.text = text +' ' +'Value Distribution (z-scores)';
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
zArray.push((columnData[value][r]))
} 

 let farr=[]
 //let tc ={}
for (let f=0; f< zArray.length; f++)
{
    let tc = Object.assign({}, TRACES_DEFAULT);
    tc.type = 'bar'
    tc.orientation = 'h'
    tc.x=parseFloat(zArray[f])
    tc.y=GroupsArray[f]
    //alert(JSON.stringify(tc))
    farr.push(tc)
}

   let data = [
     {
         x: zArray, //columnData,
         //color: getLayerColor(GroupsArray.indexOf("Banana");), 
         y: GroupsArray, // ['', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
         hovertemplate: `${text}: %{x:.2f}<extra></extra>`,
         type: 'bar',
         orientation: 'h',
         indxArr: [0,1,2,3,4,5,6],

marker:{
color: ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666']   
},
  } 
                 ];
      //Plotly.purge('chart-geodemos'); 
     Plotly.newPlot('chart-geodemos', data, hmlayout)
       
          
      })
    }
