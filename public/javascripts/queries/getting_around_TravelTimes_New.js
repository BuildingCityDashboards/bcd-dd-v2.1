/************************************
 * Travel Times
 ************************************/

/*let ttInterval = 30000;
let ttCountdown = ttInterval;
let timeSinceUpdate = moment(new Date());

const updateTTCountdown = function() {
  let cd = ttCountdown / 1000;
  //d3.select('#tt-countdown').text("Update in " + cd);
  if (ttCountdown > 0) {
    ttCountdown -= 1000;
  }
}

let ttTimer = setInterval(updateTTCountdown, 1000);
let prevTTAgeMins, prevLongestDelay;

const fetchTTData = function() {


  d3.json("/data/Transport/traveltimes.json")
    .then((data) => {
      //console.log("Fetched Travel Times card data ");
      processTravelTimes(data);
      //updateAPIStatus('#motorway-activity-icon', '#motorway-age', true);
      clearInterval(ttTimer);
      timeSinceUpdate = moment(new Date());
    })
    .catch(function(err) {
      //console.error("Error fetching Travel Times card data: " + JSON.stringify(err));
     // updateAPIStatus('#motorway-activity-icon', '#motorway-age', true);
      initialiseTTDisplay();
      // restart the timer
      clearInterval(ttTimer);
      ttCountdown = ttInterval;
      ttTimer = setInterval(updateTTCountdown, 1000);
    })
}*/

let markers = new Array();
let lat_coordinates=[],lon_coordinates=[];
let myarray= new Array();
var coffeeShopPoints = null;

let layerGroup = new L.geoJSON(null, {
  "style": {
    "color": "",
    "weight": 5,
    "opacity": 0.65
  }});


let colors=['Green','Blue','Red','Black','Yellow','White'];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*const TravelTimes = setIntervalAsync(
  () => {
    return d3.json('/data/Transport/traveltimes.json') //get latest snapshot of all stations
      .then((data) => {
        console.log("Fetched Travel time data ");
        updateAPIStatus('#motorway-activity-icon', '#motorway-age', true);
        processTravelTimes(data);
        //updateBikeStationsMarkers(data);
      })
      .catch(function(err) {
        console.error("Error fetching Travel time data: " + JSON.stringify(err));
        updateAPIStatus('#motorway-activity-icon', '#motorway-age', false);
      })

  },
  10000
);*/


const TravelTimes = setIntervalAsync(
  () => {
    return d3.json('/data/Transport/traveltimesroad.json') //get latest snapshot of all stations
      .then((data) => {

      //  coffeeShopPoints = data;
        
        
        console.log("Fetched Travel time data ");
        updateAPIStatus('#motorway-activity-icon', '#motorway-age', true);
        processTravelTimesroads2(data);
        //console.log(data);

         //data.features.forEach(function(feature,i) {
                //console.log(feature);
                //var symbol = feature.properties['icon'];
                //console.log(symbol);
          //console.log(feature[i].geometry.coordinates); //;[0];//[i];
          //var lon=feature.geometry.coordinates[i][1];//[i];
              
          //console.log('*********'+ lat +'--'+ lon);

      
        //let lat=+coordntes_2[0];
        //let lon=+coordntes_2[1];

           // });

        
      })
      .catch(function(err) {
        console.error("Error fetching Travel time data: " + JSON.stringify(err));
        updateAPIStatus('#motorway-activity-icon', '#motorway-age', false);
      })

  },
  10000
);

//console.log(coffeeShopPoints);

// TravelTimes();



/*const travelTimesCardTimer = setIntervalAsync(
  () => {
    //return fetchTTData();
     return TravelTimes();

  },

  //10000
  //ttInterval
);*/



function bestCopyEver(src) {
  return Object.assign({}, src);
}


/*var noelev={
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
      "type": "LineString",
      "coordinates": [],
              
      }
    }
  ]
};


var coffeeShops = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Dunkin Donuts",
                "address": "1 Broadway #1, Cambridge, MA 02142",
                                "latitude": 42.362504,
                "longitude": -71.083372
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-71.083372, 42.362504]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Starbucks",
                "address": "6 Cambridge Center, Cambridge, MA 02142",
                                "latitude": 42.363884,
                "longitude": -71.087749
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-71.087749, 42.363884]
            }
        }
    ]
};*/




function processTravelTimesroads2(data_)
{


let nJsonF = bestCopyEver(data_);  // clone the json data; 

var F_Array = [];


proj4.defs("EPSG:2157","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var firstProjection ='EPSG:2157';
var secondProjection ='EPSG:4326';
// console.log(proj4(firstProjection,secondProjection,[718537, 743664]));
//console.log('here');

//markerDelAgain(markers);

var result = nJsonF.features;
      for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
        let coordntes_2=result[i].geometry.coordinates[l];//[i];
        let lat=+coordntes_2[0];
        let lon=+coordntes_2[1];

        //console.log('coordntes' + lat +'--'+ lon);
        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
        let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
        let nlat= +[conv_res[1]];
        let nlon= +[conv_res[0]];
        
        F_Array =[nlon,nlat];
        result[i].geometry.coordinates[l]=F_Array;

        //To Draw a Marker 
        //var nmarker= L.marker([nlat,nlon]).addTo(gettingAroundMap);
        //markers.push(nmarker);
        //let tarray =[];
        //myarray=[[nlat+ ',' + nlon]];
        //let coordntes_2=[nlat,nlon];
      }

      //var firstpolyline = new L.Polyline(myarray, {
        //color: 'Green',
        //weight: 13,
        //opacity: 0.5,
         //smoothFactor: 1
       //});
        //firstpolyline.addTo(gettingAroundMap);
  }

  //console.log(JSON.stringify(nJsonF));






 layerGroup = L.geoJSON(nJsonF, {

onEachFeature: function (feature, layer) {
//var Travel_Time= feature.properties.current_travel_time; 
var popup = L.popup();
var TravelTime=feature.properties.current_travel_time; 
if (TravelTime === null) {TravelTime='Not Avaliable';}
else
{
  TravelTime=fancyTimeFormat(TravelTime);
  TravelTime+='  ' + 'Min(s)'
}
 popup.setContent('Name:' + feature.properties.name + '<br>' + 'From:' + feature.properties.from_name + '<br>' + 'To:' +feature.properties.to_name + '<br>' + 'pk:' + feature.properties.pk + '<br>' + 'Travel Time:' + TravelTime );
 
 layer.bindPopup(popup);

//layer.bindPopup('<h5>' + 'name:' + feature.properties.name + '<br>' + '<h5>'+ 'from:' + feature.properties.from_name + '<br>' + '<h5>' + 'To:' +feature.properties.to_name + '<br>' + '<h5>' + 'pk:' + feature.properties.pk + '<br>' + '<h5>'+ 'Travel Time' + feature.properties.current_travel_time);

 layer.on('mouseover', function (e) {
    var popup = e.target.getPopup();
    popup.setLatLng(e.latlng).openOn(gettingAroundMap);
  });

  layer.on('mouseout', function(e) {
     e.target.closePopup();
  });

  // update popup location
  layer.on('mousemove', function (e) {
    popup.setLatLng(e.latlng).openOn(gettingAroundMap);
  })},
 
  style: function(feature){
    
    var travel_time =feature.properties.current_travel_time; 
    if (feature.properties.current_travel_time !== null)
     {
       if (feature.properties.current_travel_time >= 300)
       {
        return { color: '#FF0000' };
       }

       if (feature.properties.current_travel_time < 300)
       {
        return { color: '#40FF00' };
       }
      }
      if (feature.properties.current_travel_time == null)
     {
      {
        return { color: '#848484' };
       }
      }
    //switch(feature.properties.name){
    //case "M1N J1 (M50) to J9 Drogheda": return { color: 'red' };  
    //case "M1S J10 Drogheda North to J1 (M50)": return { color: 'black' };  
    //case "denmark": return denmark_style; break;
    //case "great_britain": return britain_style; break;
    //case "greece": return greece_style; break;
    //case "italy": return italy_style; break;
    //case "serbia": return serbia_style; break;
    ///case "spain": return spain_style; break;
    //}
  
}}).addTo(gettingAroundMap);




 /* var geojsonLayer = new L.geoJSON(nJsonF).addTo(gettingAroundMap);
  //gettingAroundMap.fitBounds(geojsonLayer.getBounds())
  geojsonLayer.eachLayer(function (layer) {
  var popup = L.popup();
  popup.setContent('Text');

  layer.bindPopup(popup);

  layer.on('mouseover', function (e) {
    var popup = e.target.getPopup();
    popup.setLatLng(e.latlng).openOn(gettingAroundMap);
  });

  layer.on('mouseout', function(e) {
     e.target.closePopup();
  });

  // update popup location
  layer.on('mousemove', function (e) {
    popup.setLatLng(e.latlng).openOn(gettingAroundMap);
  });
});*/


  }













//console.log(nJsonF);
//console.log('End Here');
//var ncorrdinates= new Array();
//ncorrdinates.push(0);
//ncorrdinates.push(1);

//var originalMsg = JSON.stringify(nJsonF);
//console.log(originalMsg);
//var updatedMsg = originalMsg.replace(geometry.coordinates,"ncoordinates");
//console.log(updatedMsg)
//console.log(originalMsg);


/*var myarr= new Array();
var placez = JSON.parse(data_);


//let ar1=new Array();  
//let ar2=new Array();  
var bounds = {},coords, point, lat, lon;


proj4.defs("EPSG:2157","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var firstProjection ='EPSG:2157';
var secondProjection ='EPSG:4326';



  // We want to use the “features” key of the FeatureCollection (see above)
  //var data = data_.features;


//var result = data_.features;
      
      /*for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
       //coords= result[i].geometry.coordinates[l];//[i];
          
         // for (var j = 0; j < coords.length; j++) {

      let coordntes_2=result[i].geometry.coordinates[l];//[i];

      
        //let lat=+coordntes_2[0];
        //let lon=+coordntes_2[1];
        
        
        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
       let conv_res = proj4(firstProjection,secondProjection,[+coordntes_2[0],+coordntes_2[1]]);
        lat= +[conv_res[1]];
        lon= +[conv_res[0]];
        myarr.push(lon);
        myarr.push(lat);

    //console.log('coordntes' + lon +'--'+ lat);


  // Returns an object that contains the bounds of this GeoJSON
  // data. The keys of this object describe a box formed by the
  // northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
  //return bounds;
}
ggla.geometry.coordinates=myarr;
}*/
//console.log('------'+ placez);
//}








/*var result = data_.features;
      for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
        let coordntes_2=result[i].geometry.coordinates[l];//[i];

      
        let lat=+coordntes_2[0];
        let lon=+coordntes_2[1];
        //console.log('coordntes' + lat +'--'+ lon);
        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
        let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
        let nlat= +[conv_res[1]];
        let nlon= +[conv_res[0]];*/







    /*var result = data_.features;
     alert("this is editableLayers");
     var i = 0;
    //var geojsonlayer = L.geoJson(data_,function (result) {
    
           
           //onEachFeature: function (feature, layer) {
           //  console.log(feature.geometry.coordinates);
           //var myLayer = layer;
           //drawnItems.addLayer(myLayer);
           //}

      for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
        let coordntes_2=result[i].geometry.coordinates[l];//[i];
     
        let lat=+coordntes_2[0];
        let lon=+coordntes_2[1];
        console.log(lat+'---'+ lon);
    }
  }
//}
//)
    
    //map.addLayer(drawnItems);
    //}

    //);



}*/

// console.log(proj4(firstProjection,secondProjection,[718537, 743664]));

/*var result = data_.features;
      /*for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
        let coordntes_2=result[i].geometry.coordinates[l];//[i];

      
        let lat=+coordntes_2[0];
        let lon=+coordntes_2[1];
        //console.log('coordntes' + lat +'--'+ lon);
        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
        let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
        lat= +[conv_res[1]];
        lon= +[conv_res[0]];
        noelev.coordinates[l].push(conv_res);


        //To Draw a Marker 
        //var nmarker= L.marker([nlat,nlon]).addTo(gettingAroundMap);
        //markers.push(nmarker);
        //let tarray =[];
        //myarray=[[nlat+ ',' + nlon]];
        //let coordntes_2=[nlat,nlon];
      }

      //var firstpolyline = new L.Polyline(myarray, {
        //color: 'Green',
        //weight: 13,
        //opacity: 0.5,
         //smoothFactor: 1
       //});
        //firstpolyline.addTo(gettingAroundMap);
    }*/

/*L.geoJson(coffeeShops, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.name);
    }
}).addTo(gettingAroundMap);


var shape= {
    "type": "FeatureCollection",
    "name": "shape",
    "crs": {
      "type": "name",
      "properties": {
        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    },
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
            [
              [
                [-122.609028095726003, 47.338238713328302],
                [-122.609025973776994, 47.3377970233905],
                [-122.609021550275003, 47.337205925864403],
                [-122.610343369934995, 47.337171414964402],
                [-122.610345939832001, 47.338338659425197],
                [-122.609220494053005, 47.338361467095197],
                [-122.609089253435997, 47.338364053954997],
                [-122.609029056291007, 47.338365253124003],
                [-122.609028095726003, 47.338238713328302]
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
            [
              [
                [-122.615707340569003, 47.340769368725901],
                [-122.615066667625001, 47.340770615121698],
                [-122.615085309576997, 47.338979615811397],
                [-122.615720865713996, 47.338980247640798],
                [-122.616370283872996, 47.338985380060002],
                [-122.616364130753993, 47.340774017453199],
                [-122.615707340569003, 47.340769368725901]
              ]
            ]
          ]
        }
      }  
    ]
  }

  collectiveString = "";
  for (j = 0; j < shape.features.length; j++){
    var coordinates = shape.features[j].geometry.coordinates;
    var stringCoordinates = JSON.stringify(coordinates);

    var sliceCoordinates1 = stringCoordinates.slice(3);
    var sliceCoordinates2 = sliceCoordinates1.slice(0, -3);
    var array = JSON.parse("[" + sliceCoordinates2 + "]");
   // console.log(array);


    var a = array

    var b = []
    for (var i = 0; i < a.length; i++) {
      b.push([a[i][1], a[i][0]]);
    }

    //console.log(b);

    var stringArray = JSON.stringify(b);

    //document.getElementById("demo1").innerHTML = sliceCoordinates2;
    //document.getElementById("demo2").innerHTML = stringArray;

    collectiveString = collectiveString + stringArray + "<br>" + "<br>";
    }


    console.log('---'+ collectiveString);

    //document.getElementById("demo3").innerHTML = collectiveString;





}

        










/*let nCorrdinates= new Array();  

proj4.defs("EPSG:2157","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var firstProjection ='EPSG:2157';
var secondProjection ='EPSG:4326';
// console.log(proj4(firstProjection,secondProjection,[718537, 743664]));
console.log('here');

markerDelAgain(markers);





var result = data_.features;
      for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
        let coordntes_2=result[i].geometry.coordinates[l];//[i];

         
        let lat=+coordntes_2[0];
        let lon=+coordntes_2[1];
        //console.log('coordntes' + lat +'--'+ lon);
        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
        let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
        
        let nlat= +[conv_res[1]];
        let nlon= +[conv_res[0]];
        coordntes_2=[nlat,nlon];

         noelev.geometry.coordinates = coordntes_2;
        //myObject.prop2 = 'data here';
        
        
        //To Draw a Marker 
        //var nmarker= L.marker([nlat,nlon]).addTo(gettingAroundMap);
        //markers.push(nmarker);
        //let tarray =[];
        //myarray=[[nlat+ ',' + nlon]];
        //let coordntes_2=[nlat,nlon];
        //coordntes_1=conv_res;
         //geojson.geometry.coordinates = new Array(conv_res);
        // return geojson;


      }

      //var firstpolyline = new L.Polyline(myarray, {
        //color: 'Green',
        //weight: 13,
        //opacity: 0.5,
         //smoothFactor: 1
       //});
        //firstpolyline.addTo(gettingAroundMap);
       

    }

        //var noel = noelev;
      

L.geoJSON(noelev, {color:"black" }).addTo(gettingAroundMap);
console.log('done');

  }*/


function fancyTimeFormat(time)
{   
    // Hours, minutes and seconds
    var hrs = Math.floor(time / 3600);
    var mins = Math.floor((time % 3600) / 60);
    var secs = Math.floor(time % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}




function processTravelTimesroads(data_)
{

proj4.defs("EPSG:2157","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var firstProjection ='EPSG:2157';
var secondProjection ='EPSG:4326';
// console.log(proj4(firstProjection,secondProjection,[718537, 743664]));
//console.log('here');

markerDelAgain(markers);

var result = data_.features;
      for (var i = 0; i < result.length; i++) {
     
      let coordntes_1=result[i].geometry.coordinates; //[i];

     for  (var l = 0; l < coordntes_1.length; l++)
      {
      
        let coordntes_2=result[i].geometry.coordinates[l];//[i];

      
        let lat=+coordntes_2[0];
        let lon=+coordntes_2[1];
        //console.log('coordntes' + lat +'--'+ lon);
        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
        let conv_res = proj4(firstProjection,secondProjection,[lat,lon]);
        let nlat= +[conv_res[1]];
        let nlon= +[conv_res[0]];
        
        //To Draw a Marker 
        var nmarker= L.marker([nlat,nlon]).addTo(gettingAroundMap);
        markers.push(nmarker);
        //let tarray =[];
        //myarray=[[nlat+ ',' + nlon]];
        //let coordntes_2=[nlat,nlon];
      }

      //var firstpolyline = new L.Polyline(myarray, {
        //color: 'Green',
        //weight: 13,
        //opacity: 0.5,
         //smoothFactor: 1
       //});
        //firstpolyline.addTo(gettingAroundMap);
    }

  

  }


        //var pointA = new L.LatLng(nlat,nlon);
         //var pointB = new L.LatLng(,);
        //markers[l] = pointA;
      //}
    //}





 

        //markers=[nlat,nlon];
      
  /*var firstpolyline = new L.Polyline(markers, {
        color: 'Green',
        weight: 13,
        opacity: 0.5,
         smoothFactor: 1
       });
        firstpolyline.addTo(gettingAroundMap);*/

// Creating poly line options
         //var multiPolyLineOptions = {color:'red'};
         
         // Creating multi poly-lines
         //var multipolyline = L.multiPolyline(markers , multiPolyLineOptions);
         
         // Adding multi poly-line to map
         //multipolyline.addTo(gettingAroundMap);


       // markerDelAgain(markers);

//}
        //To Draw a Marker 
        //--var nmarker= L.marker([nlat,nlon]).addTo(gettingAroundMap);
        //--markers.push(nmarker);
           
         //}
          //
         //}

           //To draw a LineString
   
        //gettingAroundMap.addLayer(markers[l]);

        //console.log(proj4(firstProjection,secondProjection,[lat,lon]));
       // console.log(nlat + '---' + nlon);


       
     

    
       // let nlat= conv_res[1];
        
       // let nlon= conv_res[0];
        
        //lat_coordinates [i] = +[nlat]; 
        //lon_coordinates [i] = +[nlon]; 
        //coordinates.Push(nlon); 
      //}

  //}



//updatemap(lat_coordinates,lon_coordinates);
//markerDelAgain(markers);
 
//}

//updatemap(); //(lat_coordinates,lon_coordinates);

/*function updatemap(lat_coordinates,lon_coordinates)
{

 for (var j = 0; j < lat_coordinates.length; j++) {
        
      //console.log(lon_coordinates[j] +'***'+ lat_coordinates[j]);
      //console.log(j);
     var marker = new L.marker(lat_coordinates[0],lon_coordinates[0]).addTo(gettingAroundMap);
    }        
  }*/  



 //data_.forEach(function (d,i) 
 //{

 //}
 //);
  
 //let lng = +d.features[i].geometry.coordinates[0];
 //let lat = +d.features[i].geometry.coordinates[1];

 //let lng = +d.geometry.coordinates[i];
 //let lat = +d.geometry.coordinates[i];
  /*let result = proj4(firstProjection, secondProjection,
                [[lng],[lat]]);
       
        let nlon = result[0];
        let nlat = result[1];

  //console.log('----'+'----');
});*/



    
   //console.log('There');
//}


function markerDelAgain(markers)
{
  for(i=0;i<markers.length;i++) {
    gettingAroundMap.removeLayer(markers[i]);
    }  
}



function processTravelTimes(data_) {
  let maxDelayedMotorway = {};
  let maxDelay = 0;
  let longestMotorwayDelay = 0;
  d3.keys(data_).forEach(
    //for each key = motorway+direction
    function(k) {
      let motorwayDelay = 0;
      //for each section on a motorway
      data_[k].data.forEach(function(d_) {
        if (+d_["current_travel_time"] > +d_["free_flow_travel_time"]) {
          let sectionDelay = +d_["current_travel_time"] - (+d_["free_flow_travel_time"]);
          //console.log("Section delay: " + k + "\t" + sectionDelay);
          motorwayDelay += sectionDelay;
          // if (sectionDelay > maxDelay) {
          //   d_.name = d;
          //   d_.delay = delay;
          //   maxDelayed = d_;
          // }
        }

      });

      console.log("Motorway delay: " + k + "\t" + motorwayDelay);
      //if (k ==='M50_northBound' )
      
      //{
        group.getLayer(k).setStyle({color:  colors[getRandomInt(0,6)]}); 
        d3.select("#M50N-from").text(motorwayDelay);
      //}

      //if (k ==='M50_southBound')
      
      //{
        group.getLayer(k).setStyle({color: colors[getRandomInt(3,6)]}); 
        d3.select("#M50S-from").text(motorwayDelay);
      //}

      
     
      group.getLayer('n4_S').setStyle({color:  colors[getRandomInt(2,5)]}); 
      group.getLayer('m50_S').setStyle({color: colors[getRandomInt(1,4)]});
            
      
     //}

      if (motorwayDelay > longestMotorwayDelay) {
        maxDelayedMotorway.name = k;
        maxDelayedMotorway.delay = motorwayDelay;
        longestMotorwayDelay = motorwayDelay;
      }
    }


  );
  //console.log("Longest MWay delay : " + JSON.stringify(maxDelayedMotorway) + "\t" + longestMotorwayDelay);
  //updateTTDisplay(maxDelayedMotorway);
  console.log("ind " + JSON.stringify(indicatorUpSymbol.style));
};

/*function initialiseTTDisplay() {

  /*d3.select("#traveltimes-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-7' align='left'>" +
      "Motorway Delays" +
      "</div>" +
      "<div class = 'col-5' align='right'>" +
      "<div id ='tt-countdown' ></div>" +
      // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );*/

  /*d3.select("#rt-travelTimes").select("#card-left")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p> </p>' +
      "</div>");*/

  /*d3.select("#rt-travelTimes").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/transport/car-w-15.svg" width="60">' +
      "</div>");*/


  /*d3.select("#rt-travelTimes").select("#card-right")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p> </p>' +
      "</div>");

}


function updateTTDisplay(d__) {
  if (d__) {
    let ttAgeMins = Math.floor(((moment(new Date()) - timeSinceUpdate) / 1000) / 60);
    let animateClass = '';
    if (ttAgeMins !== prevTTAgeMins) {
      animateClass = "animate-update";
    }
    prevTTAgeMins = ttAgeMins;
    let ttAgeDisplay = ttAgeMins > 0 ? ttAgeMins + 'm ago' : 'Just now';
    // console.log("ages: " + ttAgeMins + '\t' + ttAgeDisplay);
    let name = d__.name.split('_')[0];
    let direction = d__.name.split('_')[1].split('B')[0];
    let delayMins = (+d__.delay / 60).toFixed(0);

    let delayDirection = delayMins > prevLongestDelay ? indicatorUpSymbol :
      delayMins < prevLongestDelay ? indicatorDownSymbol : "";
    prevLongestDelay = delayMins;

    let info = "Longest current <b>Motorway Delay</b>; travelling on the " +
      "<b>" + name + " " + direction +
      // " from <b>" + d__["from_name"] + "</b> to <b>" + d__["to_name"] + "</b>" +
      "</b> is taking <b>" + delayMins + " minutes</b> longer than with free-flowing traffic";
    updateInfo("#traveltimes-chart", info);

    /*d3.select("#traveltimes-chart").select('.card__header')
      .html(
        "<div class = 'row'>" +
        "<div class = 'col-7' align='left'>" +
        "Motorway Delays" +
        "</div>" +
        "<div class = 'col-5' align='right'>" +
        "<span class = '" + animateClass + "'>" +
        ttAgeDisplay + "</span>" + "&nbsp;&nbsp;" +
        // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
        "</div>" +
        "</div>"
      );

    d3.select("#rt-travelTimes").select("#card-left")
      .html("<div class = '" + animateClass + "'align='center'>" +
        "<h3>" + name + "</h3>" +
        "<p>" + direction + "</p>" +
        "</div>");

   

    d3.select("#rt-travelTimes").select("#card-center")
      .html("<div align='center'>" +
        "<img src = '/images/transport/car-w-15.svg' width='60'>" +
        "</div>");


    d3.select("#rt-travelTimes").select("#card-right")
      .html("<div class = '" + animateClass + "'align='center'>" +
        "<h3>" + delayDirection + " " + delayMins + "</h3>" +
        "</div>" +
        "<p>minutes</p>" +
        "</div>");
//updateAPIStatus('#motorway-activity-icon', '#motorway-age', true);

  // alert(name + '---'+ direction + '++++' + delayDirection + "****" + delayMins );

  } else {
   // updateInfo("#traveltimes-chart", "Current travel times are close to free-flow times on all motorways");
  }
}

function updateInfo(selector, infoText) {

  let text = d3.select("#data-text p");
  let textString = "<b>Hover over these charts for more information, click to go to the data page </b>";

  d3.select(selector)
    .on("mouseover", (d) => {
      text.html(infoText);
    })
    .on("mouseout", (d) => {
      text.html(textString);
    });
}*/

//initialiseTTDisplay();
//fetchTTData();