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


// d3.csv('/data/tools/geodemographics/dublin_zscores_t.csv')
// .then((zScores)=>{

// zScores.forEach((row, i) => {
  
// let columnNames = Object.keys(row).sort(function(a,b){return row[a]-row[b]})
   
//    let trace = Object.assign({}, TRACES_DEFAULT);
//     //trace.type = 'bar'
//     //trace.orientation = 'h'
//     //trace.mode = ''
//     //trace.hovertemplate= 'z-score: %{x:.2f}<extra></extra>'
//     trace.mode= 'markers+text'
//     trace.type= 'scatter'
    
//     //trace.orientation = 'h'
//     trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
//     trace.marker = {
//     color: getLayerColor(i), // lines + markers, defaults to colorway
//     }
   
    
//     trace.x = columnNames.map( name => {
     
//       return row[name]
      
//     })
    
//     trace.y = columnNames
    
//     traces.push(trace)
//     trace.hovertemplate= `%{x:.2f}<extra>Group No: ${i+1}</extra>`
   
// })



// layout = Object.assign({}, ROW_CHART_LAYOUT);
// //layout.mode = 'bars'
// layout.height = 500

// layout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
// layout.title.text = 'Variables Value Distribution (z-scores)';
// layout.title.x=0.51
// layout.title.y=0.99
// layout.title.xanchor='center'
// layout.title.yanchor='top'
// layout.title.font= { color: '#6fd1f6',
// family: 'Roboto',
// size: 17

// },
// layout.showlegend = false;
// layout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
// layout.legend.xanchor = 'right';

// layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
// layout.xaxis.title = "value";
// layout.xaxis.range = [-2, 2.9]
// layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
// layout.yaxis.tickfont ={
//   family: 'PT Sans',
//   size: 9,
//   color: '#6fd1f6'
// }
// layout.xaxis.tickfont ={
//   family: 'PT Sans',
//   size: 10,
//   color: '#6fd1f6'
// }

// layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
// layout.yaxis.titlefont.size = 16; //bug? need to call this
// layout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);

// layout.plot_bgcolor="#293135",
// layout.paper_bgcolor="#293135"


// layout.yaxis.title = '';
// layout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

// layout.margin = {
//   l: 40,
//   r: 40, //annotations space
//   t: 40,
//   b: 0
  
// };
loadChart()
// updateGroupTxt('all')

// }) //end then
let chartLayout={}

function loadChart (){
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



chartLayout = Object.assign({}, ROW_CHART_LAYOUT);
chartLayout.mode = 'scatter'
chartLayout.height = 500
//chartLayout.width = 300
chartLayout.plot_bgcolor="#293135",
chartLayout.paper_bgcolor="#293135"

chartLayout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
chartLayout.title.text = 'Variables Value Distribution (z-scores)';
chartLayout.title.x=0.51
chartLayout.title.y=0.99
chartLayout.title.xanchor='center'
chartLayout.title.yanchor='top'
chartLayout.title.font= { color: '#6fd1f6',
family: 'Roboto',
size: 17

},

chartLayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
chartLayout.legend.xanchor = 'right';
chartLayout.legend.y = 0.1;
chartLayout.legend.traceorder = 'reversed';
chartLayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
chartLayout.xaxis.title = "";
chartLayout.xaxis.range = [-2, 2.9]
chartLayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
chartLayout.yaxis.tickfont ={
  family: 'PT Sans',
  size: 9,
  color: '#6fd1f6'
}
chartLayout.xaxis.tickfont ={
  family: 'PT Sans',
  size: 10,
  color: '#6fd1f6'
}

chartLayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
chartLayout.yaxis.titlefont.size = 16; //bug? need to call this
chartLayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);

chartLayout.plot_bgcolor="#293135",
chartLayout.paper_bgcolor="#293135"


chartLayout.yaxis.title = '';
chartLayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

chartLayout.margin = {
  l: 20,
  r: 60, //annotations space
  t: 40,
  b: 0
  
};



Plotly.newPlot('chart-geodemos', [ntraces[0],ntraces[1],ntraces[2],ntraces[3],ntraces[4],ntraces[5],ntraces[6]], chartLayout, {
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
  
loadChart()
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

