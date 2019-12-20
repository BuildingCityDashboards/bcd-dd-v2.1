/*TODO:
The following TODO list addresses issues #27 #22 #21 #16 #15 #14 #13
* Working bike symbology
* Working bike traces
  - Add day/ week/ month selection
* Update !bikes data periodically
* Add different icons for different transport modes
* Add car park data
  - Add day popup trace as per bikes
* Add bike station comparisons to popups
* Check API status periodically and update symbol
  - Enable/disable buttons accordingly
  - Add tooltip to say data unavailable over button
  - Animate activity symbol (when refreshing data?)
* Add current time indicator
* Add last/ next refresh time indicator
* Remove button in Bus popup
* Unify popup designs
* Redesign legend
* Convert icons to vector graphics
* Keep popups open when map data refreshes
* Place popups over controls or make them sit away from controls.
* Place icons in filter buttons
 * Test support for DOM node methods on Firefox
 */

//***@todo: refactor to use ES6 imports ***/

/*
API activity checks that the buttons are not disabled

*/


/************************************
 * Design Pattern
 ************************************/
/************************************
 * Page load
 *** Get station list
 *** Draw markers with default icons
 *** Set timeout
 ***** Get latest snapshot (exAPI)
 ******* Draw/redraw markers with symbology on Map
 *** Marker click
 ***** Get station trend data (exAPI)
 ******* Draw marker popup
 ************************************/
//Manage periodic async data fetching
let setIntervalAsync = SetIntervalAsync.dynamic.setIntervalAsync;
// // // let setIntervalAsync = SetIntervalAsync.fixed.setIntervalAsync
// // // let setIntervalAsync = SetIntervalAsync.legacy.setIntervalAsync
let clearIntervalAsync = SetIntervalAsync.clearIntervalAsync

//let LayGroup = new L.LayerGroup();
let group = new L.LayerGroup();
let TrainLayerGroup = new L.LayerGroup();
let MWayLayerGroup = new L.LayerGroup();
let Dublin_BusLayerGroup = new L.LayerGroup();
/*let Trainstops_Layer = new L.geoJSON(null, {
  "style": {
    "color": "#000000",
    "weight": 5,
    "opacity": 0.65
  }});

  let Trains_layer = new L.geoJSON(null, {
    "style": {
      "color": "#000000",
      "weight": 5,
      "opacity": 0.65
    }});*/

let Road_Layer = new L.geoJSON(null, {
  "style": {
    "color": "#000000",
    "weight": 5,
    "opacity": 0.65
  }});
  let TrainSatation_Layer = new L.geoJSON(null, {
    "style": {
      
    }});

    let BusStop_Layer = new L.geoJSON(null, {
      "style": {
        
      }});
 

    var TraunStationIcon = L.icon({
      iconUrl: '/images/icons/train_station_T.png',
      shadowUrl: '',
      iconSize: [10, 10], // size of the icon
      shadowSize:   [11, 11], // size of the shadow
      //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  let myIcon = L.icon({
    iconUrl:  'images/pin24.png',
    iconRetinaUrl:  'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
  });

/*let m50_N = new L.geoJSON(null, {
  "style": {
    "color": "#000000",
    "weight": 5,
    "opacity": 0.65
  },

 
  }

);

let m50_S = new L.geoJSON(null, {
  "style": {
    "color": "#ff0CCC",
    "weight": 5,
    "opacity": 0.65
  },
   
});


let n4_N = new L.geoJSON(null, {
  "style": {
    "color": "#000000",
    "weight": 5,
    "opacity": 0.65
  },
  

});

let n4_S = new L.geoJSON(null, {
  "style": {
    "color": "#bbc980",
    "weight": 5,
    "opacity": 0.65
  },
  
  
});*/



//Update the API activity icon and time
//called from the individual getting-around modules
function updateAPIStatus(activity, age, isLive) {
  let d = new Date();
  let tf = moment(d).format('hh:mm a');
  if (isLive) {

    d3.select(activity).attr('src', '/images/icons/activity.svg');
    d3.select(age)
      .text('Live @  ' + tf);

  } else {
    d3.select(activity).attr('src', '/images/icons/alert-triangle.svg');
    d3.select(age)
      .text('No data @ ' + tf);
  }

}

let bikesClusterToggle = true,
  busClusterToggle = true,
  luasClusterToggle = false,
  carparkClusterToggle = true;

zoom = 11; //zoom on page load
maxZoom = 26;
// the default tile layer
let gettingAroundOSM = new L.TileLayer(cartoDb, {
  minZoom: 2,
  maxZoom: maxZoom, //seems to fix 503 tileserver errors
  attribution: stamenTonerAttrib
});

var thunderAttr = {attribution: '© OpenStreetMap contributors. Tiles courtesy of Andy Allan'}
        var transport = L.tileLayer(
            '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
            thunderAttr
        );


/*let gettingAroundtransport = L.tileLayer(
            '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
            thunderAttr
        );*/
/*L.tileLayer(
    'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; '+mapLink+' Contributors & '+translink,
        maxZoom: 18,
    }).addTo(map);*/
let tl=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
});

let gettingAroundMap = new L.Map('getting-around-map');
gettingAroundMap.setView(new L.LatLng(dubLat, dubLng), zoom);
//gettingAroundMap.addLayer(gettingAroundOSM);
gettingAroundMap.addLayer(tl);
let markerRefPublic; //TODO: fix horrible hack!!!
gettingAroundMap.on('popupopen', function(e) {
  markerRefPublic = e.popup._source;
  //console.log("ref: "+JSON.stringify(e));
});


/*gettingAroundMap.on('click', function(e) {
    alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
});*/
// add location control to global name space for testing only
// on a production site, omit the "lc = "!
L.control.locate({
  strings: {
    title: "Zoom to your location"
  }
}).addTo(gettingAroundMap);

var osmGeocoder = new L.Control.OSMGeocoder({
  placeholder: 'Enter street name, area etc.',
  bounds: dublinBounds
});
gettingAroundMap.addControl(osmGeocoder);


var info = L.control();
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'LTR'); // create a div with a class "info"
  this._div.innerHTML = '<h8> Live Traffic Info</h8>' + '<br>' +
  '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#40FF00";/> </svg>' + '<h8> Fast </h8>'+ '</svg>' + '<br>' + 
  '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#FF5733";/> </svg>' +' <h8> Slow </h8>' + '</svg>' +'<br>' + 
  '<svg  height="10" width="10"> <rect id="box" width="10" height="10" fill= "#FF0000";/> </svg>' + '<h8> Slower </h8>' + '</svg>' + '<br>' + 
  '<svg height="10" width="10"> <rect  width="10"  height="10" fill= "#848484"; /> </svg>' + '<h8> No Data </h8>' + '</svg>';
  return this._div;
};

/*info.update = function (props) {
  this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
      '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
      : 'Hover over a state');
};*/

info.addTo(gettingAroundMap);

//Dublin Bikes script

//Dublin Bus script

//Car Parks script

//Luas script
/************************************
 * Motorway Junctions
 ************************************/

// d3.json("/data/Transport/traveltimes.json").then(function(data) {
//   //processTravelTimes(data);
// });
//
// d3.json("/data/Transport/traveltimesroad.json").then(function(data) {
//   //processRoads(data);
// });

function processTravelTimes(data_) {
  //console.log("travel times data : " + JSON.stringify(data_));
  //console.log("\n " + JSON.stringify(d3.keys(data_)));
  d3.keys(data_).forEach(
    //for each key
    function(d) {
      console.debug(JSON.stringify(d)); // to show meassge to web console at the "debug" log level
      //for each data array
      data_[d].data.forEach(function(d_) {
        console.debug("From " + d_["from_name"] + " to " + d_["to_name"] +
          " (" + d_["distance"] / 1000 + " km)" +
          "\nFree flow " + d_["free_flow_travel_time"] + " seconds" +
          "\nCurrent time " + d_["current_travel_time"] + " seconds"
        );
      });
    }
  );

};

/*function processRoads(data_) {
  // console.debug("roads : " + JSON.stringify(data_.features));

  //data_.features.forEach(function (d_) {
  //        console.debug("f : " + JSON.stringify(f.properties));
  //        console.debug("" + JSON.stringify(f.geometry.coordinates));
  // console.debug("From " + d_.properties["from_name"] + " to " + d_.properties["to_name"]
  //             + " (" + d_.properties["distance"] / 1000 + " km)"
  //             + "\nFree flow " + d_.properties["free_flow_travel_time"] + " seconds"
  //             + "\nCurrent time " + d_.properties["current_travel_time"] + " seconds"
  //             );
  // });
}*/
/************************************
 * Button Listeners
 ************************************/

//if buttons are disabled in view, do not update activiy from api-status.json
     



/*d3.json('/data/Transport/TrainStations.json') //get latest snapshot of all stations
      .then((data_) => {
      
        //console.log("Fetched Travel time data ");
        //updateAPIStatus('#train-activity-icon', '#train-age', true);
        AddTrainStations_Layer(data_);
        //updateAPIStatus('#train-checkbox-icon', '#train-age', true);
        // console.log("Luas API active");
        // updateBikeStationsMarkers(data);
      })
      .catch(function(err) {
        console.error("Error fetching Train stations data: " + JSON.stringify(err));
        //updateAPIStatus('#train-checkbox-icon', '#train-age', false);
      });*/


      const fetchTrainData2 = function() {
        //console.log('yes yes ');
        d3.xml("/data/Transport/Train_data_suburban.XML")
        .then((data) => {
         
         //updateAPIStatus('#train-activity-icon', '#train-age', true);
          
          //processWeather(data);
         //console.log(data);
         //loadData(data);
         updateCarparkMarkers(data);
         //processTrainData222(data);
          //console.log(data);
          //console.log('here 11');
        })
        .catch(function(err) {
          //console.error("Error fetching Weather card data: " + JSON.stringify(err));
          //initialiseWeatherDisplay();
          updateAPIStatus('#train-activity-icon', '#train-age', false);
          console.log('no no no_test')
        })
    }


    
    function updateCarparkMarkers(xml_) {
     // gettingAroundMap.removeLayer(carparkCluster);
     // carparkCluster.clearLayers();
      for (let i = 0; i < xml_.getElementsByTagName("objStation").length; i += 1) {
        let name = xml_.getElementsByTagName("objStation")[i].getAttribute("StationDesc");
        console.log(name);
        // if (name === k_) {
        /*let spaces = xml_.getElementsByTagName("carpark")[i].getAttribute("spaces");
        console.log("found:" + name + " spaces: " + spaces);
        let m = new customCarparkMarker(new L.LatLng(d.lat, d.lon), {
          icon: new carparkMapIcon({
            iconUrl: '/images/transport/parking-garage-w-cd-green-1-15.svg' //loads a default grey icon
          }),
          opacity: 0.9, //(Math.random() * (1.0 - 0.5) + 0.5),
          title: 'Car Park:' + '\t' + d.name,
          alt: 'Car Park icon',
        });
        m.bindPopup(carparkPopupInit(d), carparkPopupOptions);
        carparkCluster.addLayer(m);*/
      }
    }





    /*function processTrainData222(data)
    {
    
     //console.log('here001');

        xmlDoc = data;

        x=data.getElementsByTagName('objStation');
        for (i=0;i<x.length;i++)
        {
        console.log(x[i].nodeName + x[i].childNodes[0].textContent);
        //document.write(": ");
        //document.write(x[i].childNodes[0].nodeValue);
        //document.write("<br />");
        }




       // var items = data.getElementsByTagName('ArrayOfObjStation');
      
        //var item, title, desc, thumb, swf, i, l;
    
        //for(i = 0, i < items.length; i++;) {
    
          //  item  = items[i];
            //title = item.getElementsByTagName("StationDesc").textContent; // W3C
            //desc  = item.getElementsByTagName("desc")[0].firstChild.data; // W3C + IE
             //thumb = item.children[2].textContent; // W3C
             //console.log('----' + title);
    
            // …
    
            //$('#portfolioContent').append('<p>' + title + '</p>' + '<p>' + desc + '<img src="images/'+ thumb + '"/>' + '<p>' + swf + '</p>');
    
        //}  


      //}

        //var parent = document.getElementById('ArrayOfObjStationn');
        //var child_nodes = parent.childNodes;
    
        /*var z = xmlDoc.getElementsByTagName("objStation");
        //for (var k = 0; k < z.length; k++) {
          //  var x = z[k].childNodes;
          for (i=0;i<z.length;i++)
{
     for (var j = 0; j < z.length; j++) {
        var x = z[j].childNodes;
            console.log(x.nodeName); 
           /* for (var i = 0; i < x.length; i++) {
                var y = x[i];
                console.log(y.nodeName);*/

                //for (var i=0; i<x.attributes.length; i++)
                //{
                  //  var attrib = x.attributes[i];
                    //console.log(attrib);
          //      }

            //}
          //}*/
        
                //if (y.nodeType == 1) {
                    //var c1=y.nodeName[];
                    //console.log(c1);
        
                    /*if (y.nodeName ==='StationLatitude' )
                    {
                        var v1 =y.firstChild.nodeValue;
                    }
        
                    if (y.nodeName ==='StationLongitude')
                    {
                        var v2=y.firstChild.nodeValue;
                    }
    
                   // if (y.nodeName =='PublicMessage')
                   // {
                        var PubMsg='y.firstChild.nodeValue';
                   // }
    
                    //if (y.nodeName =='Direction')
                   // {
                        var Direction='y.firstChild.nodeValue';
                   // }
                    
              //  }
                
            }
    
            if (v1 < 54 && v2 > -7) 
            {
            var Smarker= L.marker([v1,v2],)
            .on('mouseover', function() {
                this.bindPopup(PubMsg + '<br>' + Direction).openPopup();
            });
            TrainLayerGroup.addLayer(Smarker);
            }
                        //markers.push(Smarker);
        }
    
        TrainLayerGroup.addTo(gettingAroundMap);
      }*/

      


function AddTrainStations_Layer(Tdata)
{

  //console.log(Tdata);
  let NewGoeJ = bestCopyEver(Tdata);  // clone the json data; 
  var E_Array = [];
       
  //proj4.defs("EPSG:2157","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
  //var firstProjection ='EPSG:2157';
  //var secondProjection ='EPSG:4326';
       
  var N_result = NewGoeJ.features;
        for (var o = 0; o < N_result.length; o++) {
       
        let coordntes_1=N_result[o].properties; //geometry.coordinates; //[i];
        let Marker_Popup = L.popup();
       //for  (var l = 0; l < coordntes_1.length; l++)
        //{
         
          //let coordntes_2=N_result[o].geometry.properties[l];//[i];
          let lat=+coordntes_1.stop_lon;
          let lon=+coordntes_1.stop_lat;
          Marker_Popup.setContent('Stop_Id:' + N_result[o].properties.stop_id + '<br>' + 'Stop_Name:' + N_result[o].properties.stop_name);    
          var nmarker= L.marker([lon,lat],{icon: TraunStationIcon}).bindPopup(Marker_Popup); 
          TrainLayerGroup.addLayer(nmarker);
          //nmarker.bindPopup(Marker_Popup);
           //console.log(lon+'-----'+ lat);
  
          //let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
          //let nlat= +[conv_res[1]];
          //let nlon= +[conv_res[0]];
          
          //E_Array =[lon,lat];
          //N_result[o].geometry.coordinates[l]=E_Array;
  
        //}
  
  
    }
    TrainLayerGroup.addTo(gettingAroundMap);
    //TrainSatation_Layer.addData(NewGoeJ);
     //Road_Layer._leaflet_id='Text';
     //var mypopup = L.popup().setContent("Road Travel Times Details" + Road_Layer._leaflet_id);
     //Road_Layer.bindPopup(mypopup);
    // TrainSatation_Layer.addTo(group);
     //group.addTo(gettingAroundMap);
}



d3.json('/data/Transport/traveltimesroad.json') //get latest snapshot of all stations
      .then((data) => {
      
        //console.log("Fetched Travel time data ");
        // updateAPIStatus('#motorway-activity-icon', '#motorway-age', true);
        AddDublinRoads_Layer(data);
       });

       function AddDublinRoads_Layer(data_)
       {
       
       
       let nJsonF = bestCopyEver(data_);  // clone the json data; 
       
       var F_Array = [];
            
       proj4.defs("EPSG:2157","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
       var firstProjection ='EPSG:2157';
       var secondProjection ='EPSG:4326';
            
       var result = nJsonF.features;
             for (var i = 0; i < result.length; i++) {
            
             let coordntes_1=result[i].geometry.coordinates; //[i];
       
            for  (var l = 0; l < coordntes_1.length; l++)
             {
             
               let coordntes_2=result[i].geometry.coordinates[l];//[i];
               let lat=+coordntes_2[0];
               let lon=+coordntes_2[1];
       
       
               let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
               let nlat= +[conv_res[1]];
               let nlon= +[conv_res[0]];
               
              

               F_Array =[nlon,nlat];
               // console.log(nlon+'****'+nlat); 
               result[i].geometry.coordinates[l]=F_Array;
       
             }
       
       
         }
           
           Road_Layer.addData(nJsonF);
          //Road_Layer._leaflet_id='Text';
          //var mypopup = L.popup().setContent("Road Travel Times Details" + Road_Layer._leaflet_id);
          //Road_Layer.bindPopup(mypopup);
          //Road_Layer.addTo(MWayLayerGroup);
          
              
        }
       // MWayLayerGroup.addTo(gettingAroundMap);

       
        //function updateRoad_Layer(data__) {
          
          //gettingAroundMap.addLayer(n4_N);
          //chooseLookByZoom();
        //}

        //group.addTo(gettingAroundMap)



/*d3.json('/data/Transport/N04D1ML.json').then(function(d1) {
   updateN4_N(d1);
  }).catch(function(err) {
    console.error("Error fetching N4 North bound Path");
  });

d3.json('/data/Transport/N04D2ML.json').then(function(d2) {
     updateN4_S(d2);
  }).catch(function(err) {
    console.error("Error fetching N4 Southbound Path");
    
    });


d3.json('/data/Transport/N50D1ML.json').then(function(d3) {

    updateM50_N(d3);
  }).catch(function(err) {
    console.error("Error fetching M50 North bound Path");
  });

d3.json('/data/Transport/N50D2ML.json').then(function(d4) {
     updateM50_S(d4);
  }).catch(function(err) {
    console.error("Error fetching M50 Southbound Path");
       });  


  function updateN4_N(data__) {
  n4_N.addData(data__);
  n4_N._leaflet_id='n4_N';
  var mypopup = L.popup().setContent("Road Travel Times Details" + n4_N._leaflet_id);
  n4_N.bindPopup(mypopup);
  //console.log('++++++' + n4_N._leaflet_id); 
  //n4_N.id ='n4_N';
  n4_N.addTo(group);
  //gettingAroundMap.addLayer(n4_N);
  chooseLookByZoom();
}

function updateN4_S(data__) {
  n4_S.addData(data__);
  n4_S._leaflet_id='n4_S';
  var mypopup = L.popup().setContent("Road Travel Times Details" + n4_S._leaflet_id);
  n4_S.bindPopup(mypopup);
  
  n4_S.addTo(group);
  //gettingAroundMap.addLayer(n4_S);
  
  chooseLookByZoom();

}

 function updateM50_N(data__) {
  m50_S.addData(data__);
  m50_S._leaflet_id='M50_southBound';
  var mypopup = L.popup().setContent("Road Travel Times Details" + m50_S._leaflet_id);
  m50_S.bindPopup(mypopup);
  m50_S.addTo(group);
  //gettingAroundMap.addLayer(m50_N);
  
  chooseLookByZoom();

}

function updateM50_S(data__) {
  m50_N.addData(data__);
  m50_N._leaflet_id='M50_northBound';
  var mypopup = L.popup().setContent("Road Travel Times Details" + m50_N._leaflet_id);
  m50_N.bindPopup(mypopup);
  
  m50_N.addTo(group);
  //gettingAroundMap.addLayer(m50_S);
  
  chooseLookByZoom();

}

//group=([n4_N,n4_S,m50_N,m50_S]);
//group.addTo(gettingAroundMap);*/
    



  
/*d3.json('/data/Transport/N04D1ML.json').then(function(d1) {
    //console.log('hi');
    //var hydro = new L.LayerGroup();
    L.geoJson(d1, { "color": "#DF0101",
    "weight": 5,
    "opacity": 0.65}).addTo(LayGroup).addTo(gettingAroundMap);
    });

d3.json('/data/Transport/N04D2ML.json').then(function(d2) {
    L.geoJson(d2, { "color": "#000000",
    "weight": 5,
    "opacity": 0.65}).addTo(LayGroup).addTo(gettingAroundMap);
    });


d3.json('/data/Transport/N50D1ML.json').then(function(d3) {
    L.geoJson(d3, {"color": "#DF01D7",
    "weight": 5,
    "opacity": 0.65}).addTo(LayGroup).addTo(gettingAroundMap);
    });


d3.json('/data/Transport/N50D2ML.json').then(function(d4) {
    L.geoJson(d4, {"color": "#9AFE2E",
    "weight": 5,
    "opacity": 0.65}).addTo(LayGroup).addTo(gettingAroundMap);
    });*/


    d3.json('/data/Transport/busstopinformation_v1.json') //get latest snapshot of all stations
    .then((BusStopData) => {
      //console.log('new data *****');
      //console.log(BusStopData)
      //console.log("Fetched Travel time data ");
      //updateAPIStatus('#train-activity-icon', '#train-age', true);
      AddStops_Layer(BusStopData);
      //updateAPIStatus('#train-checkbox-icon', '#train-age', true);
      // console.log("Luas API active");
      // updateBikeStationsMarkers(data);
    })
    .catch(function(err) {
      console.error("Error fetching dublin Stops data: " + JSON.stringify(err));
      //updateAPIStatus('#train-checkbox-icon', '#train-age', false);
    });  
    
    

    function AddStops_Layer(BusStopData)
       {
       
        var markerClusters = L.markerClusterGroup();
        var markers = BusStopData.results;
             /*for (var i = 0; i < result.length; i++) {
            
             
               //let coordntes_2=result[i].geometry.coordinates[l];//[i];
               let lat=+result[i].latitude; // coordntes_2[0];
               let lon=+result[i].longitude; 
               let stopid = +result[i].stopid; //coordntes_2[1];
               if (stopid < 200)
               {
               var busstopmarker= L.marker([lat,lon]); //.bindPopup(Marker_Popup); 
               BusStop_Layer.addLayer(busstopmarker);
               }
                      
             }*/

             for ( var i = 0; i < markers.length; ++i )
             {
               var popup = markers[i].stopid +
                           '<br/>' + markers[i].shortname +
                           '<br/><b>shortnamelocalized:</b> ' + markers[i].shortnamelocalized +
                           '<br/><b>fullname:</b> ' + markers[i].fullname +
                           '<br/><b>Altitude:</b> ' + Math.round( markers[i].alt * 0.3048 ) + ' m' +
                           '<br/><b>lastupdated:</b> ' + markers[i].lastupdated;

              let lat= markers[i].latitude, lon=markers[i].longitude;
              if ((lat >= 53) && (lat < 53.5))
              {
                if (lon > -6.5)
                {           
                             { var m = L.marker( [markers[i].latitude, markers[i].longitude])
                               .bindPopup( popup );
                             markerClusters.addLayer( m );
               }
             }
              }
            }
             markerClusters.addTo(Dublin_BusLayerGroup);
                        
        }
                   
      

      //  Dublin_BusLayerGroup.addTo(gettingAroundMap);
d3.select("#bikes-checkbox").on("click", function() {

  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(bikesCluster)) {
         gettingAroundMap.removeLayer(bikesCluster);

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(bikesCluster)) {
         gettingAroundMap.addLayer(bikesCluster);

      }
    }
  }
});

d3.select("#bus-checkbox").on("click", function() {

    let cb = d3.select(this);
    if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(busCluster)) {
        gettingAroundMap.removeLayer(busCluster);

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(busCluster)) {
        gettingAroundMap.addLayer(busCluster);

      }
    }
  }
});

d3.select("#carparks-checkbox").on("click", function() {
  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(carparkCluster)) {
        gettingAroundMap.removeLayer(carparkCluster);
        gettingAroundMap.fitBounds(luasCluster.getBounds());
      }
    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(carparkCluster)) {
        gettingAroundMap.addLayer(carparkCluster);

      }
    }
  }
});

//TODO: catch cluster or layer
d3.select("#luas-checkbox").on("click", function() {

  let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(luasLineRed)) {
        gettingAroundMap.removeLayer(luasLineRed);
        gettingAroundMap.removeLayer(luasLineGreen);
        gettingAroundMap.removeLayer(luasIcons);
        gettingAroundMap.removeLayer(luasLayer);
      }

    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(luasLineRed)) {
        gettingAroundMap.addLayer(luasLineRed);
        gettingAroundMap.addLayer(luasLineGreen);
        chooseLookByZoom();
      }
    }
  }
});


d3.select("#motorways-checkbox").on("click", function() {
  //console.log('mway');
 let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(MWayLayerGroup)) {
        //if (gettingAroundMap.hasLayer(Road_Layer)) {
         gettingAroundMap.removeLayer(MWayLayerGroup);
         //gettingAroundMap.removeLayer(layerGroup);
         //gettingAroundMap.removeLayer(m50_N);
         //gettingAroundMap.removeLayer(m50_S);
         //chooseLookByZoom();
            }

            /*if (gettingAroundMap.hasLayer(layerGroup)) {
              //if (gettingAroundMap.hasLayer(Road_Layer)) {
               gettingAroundMap.removeLayer(Road_Layer);
               gettingAroundMap.removeLayer(layerGroup);
               //gettingAroundMap.removeLayer(layerGroup);
               //gettingAroundMap.removeLayer(m50_N);
               //gettingAroundMap.removeLayer(m50_S);
               //chooseLookByZoom();
                  }*/    
     
    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(MWayLayerGroup)) {
      //if (!gettingAroundMap.hasLayer(Road_Layer)) {
          gettingAroundMap.addLayer(MWayLayerGroup);
          //gettingAroundMap.addLayer(layerGroup);
         //gettingAroundMap.addLayer(m50_N);
         //gettingAroundMap.addLayer(m50_S);
          //chooseLookByZoom();
      }

      /*if (!gettingAroundMap.hasLayer(layerGroup)) {
        //if (!gettingAroundMap.hasLayer(Road_Layer)) {
            gettingAroundMap.addLayer(layerGroup);
            gettingAroundMap.addLayer(Road_Layer);
           //gettingAroundMap.addLayer(m50_N);
           //gettingAroundMap.addLayer(m50_S);
           // chooseLookByZoom();
        }*/
    }
  }
  
});


d3.select("#trains-checkbox").on("click", function() {
 let cb = d3.select(this);
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      cb.classed('active', false);
      if (gettingAroundMap.hasLayer(TrainLayerGroup)) {
          //console.log('Remove train Layrers');
         gettingAroundMap.removeLayer(TrainLayerGroup);
         //gettingAroundMap.removeLayer(layerGroup);

            }


    } else {
      cb.classed('active', true);
      if (!gettingAroundMap.hasLayer(TrainLayerGroup)) {
        //console.log('Add train Layrers');
          gettingAroundMap.addLayer(TrainLayerGroup);
          //gettingAroundMap.addLayer(layerGroup);
      }
        
    }
  }
  
});


d3.select("#bus-checkbox").on("click", function() {
  let cb = d3.select(this);
   if (!cb.classed('disabled')) {
     if (cb.classed('active')) {
       cb.classed('active', false);
       if (gettingAroundMap.hasLayer(Dublin_BusLayerGroup)) {
           //console.log('Remove train Layrers');
          gettingAroundMap.removeLayer(Dublin_BusLayerGroup);
          //gettingAroundMap.removeLayer(layerGroup);
 
             }
 
 
     } else {
       cb.classed('active', true);
       if (!gettingAroundMap.hasLayer(Dublin_BusLayerGroup)) {
         //console.log('Add train Layrers');
           gettingAroundMap.addLayer(Dublin_BusLayerGroup);
           //gettingAroundMap.addLayer(layerGroup);
       }
         
     }
   }
   
 });


function getColor(d) {
  return d > 3000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

//initalise API activity icons
d3.json('/data/api-status.json')
  .then(function(data) {
    //console.log("api status "+JSON.stringify(data));
    if (data["dublinbikes"].status === 200 && !(d3.select('#bikes-checkbox').classed('disabled'))) {
      d3.select('#bike-activity-icon').attr('src', '/images/icons/activity.svg');
      d3.select('#bike-age')
        .text('Awaitng data...'); //TODO: call to getAge function from here

    } else {
      d3.select('#bike-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
      d3.select('#bike-age')
        .text('Unavailable');
    }

    if (data["dublinbus"].status === 200 && !(d3.select('#bus-checkbox').classed('disabled'))) {
      d3.select('#bus-activity-icon').attr('src', '/images/icons/activity.svg');
      d3.select('#bus-age')
        .text('Awaitng data...'); //TODO: call to getAge function from here
    } else {
      d3.select('#bus-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
      d3.select('#bus-age')
        .text('Unavailable');
    }

    if (data["carparks"].status === 200 && !(d3.select('#carparks-checkbox').classed('disabled'))) {
      d3.select('#parking-activity-icon').attr('src', '/images/icons/activity.svg');
      d3.select('#parking-age')
        .text('Awaitng data...'); //TODO: call to getAge function from here

    } else {
      d3.select('#parking-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
      d3.select('#parking-age')
        .text('Unavailable');
    }

    if (data["luas"].status === 200 && !(d3.select('#luas-checkbox').classed('disabled'))) {
      d3.select('#luas-activity-icon').attr('src', '/images/icons/activity.svg');
      d3.select('#luas-age')
        .text('Awaitng data...');
    } else {
      d3.select('#luas-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
      d3.select('#luas-age')
        .text('Unavailable');
    }

    if (data["train"].status === 200 && !(d3.select('#trains-checkbox').classed('disabled'))) {
      d3.select('#train-activity-icon').attr('src', '/images/icons/activity.svg');
      d3.select('#train-age')
        .text('Awaitng data...');
    } else {
      d3.select('#train-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
      d3.select('#train-age')
        .text('Unavailable');
    }

    if (data["traveltimes"].status === 200 && !(d3.select('#motorways-checkbox').classed('disabled'))) {
      d3.select('#motorway-activity-icon').attr('src', '/images/icons/activity.svg');
      d3.select('#motorway-age')
        .text('Awaitng data...');
    } else {
      d3.select('#motorway-activity-icon').attr('src', '/images/icons/alert-triangle.svg');
      d3.select('#motorway-age')
        .text('Unavailable');
    }

  })
  .catch(function(err) {
    console.error("Error fetching API status file data");
  });

  fetchTrainData2();
  





  