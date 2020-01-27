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


let layerGroup = new L.geoJSON(null, {
  "style": {
    "color": "",
    "weight": 5,
    "opacity": 0.65
  }});



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
        

        
      })
      .catch(function(err) {
        console.error("Error fetching Travel time data: " + JSON.stringify(err));
        updateAPIStatus('#motorway-activity-icon', '#motorway-age', false);
      })

  },
  10000
);

function bestCopyEver(src) {
  return Object.assign({}, src);
}

function processTravelTimesroads2(data_)
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
        result[i].geometry.coordinates[l]=F_Array;

        
      }

    
  }
 

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
    
  
}}); //.addTo(gettingAroundMap);
MWayLayerGroup.addLayer(layerGroup);
  }
MWayLayerGroup.addTo(gettingAroundMap);


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
markerDelAgain(markers);

var result = data_.features;
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
              
        var nmarker= L.marker([nlat,nlon]).addTo(gettingAroundMap);
        markers.push(nmarker);
       
      }

      
    }
  
  }
   
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
      
        group.getLayer(k).setStyle({color:  colors[getRandomInt(0,6)]}); 
        d3.select("#M50N-from").text(motorwayDelay);
        group.getLayer(k).setStyle({color: colors[getRandomInt(3,6)]}); 
        d3.select("#M50S-from").text(motorwayDelay);
        group.getLayer('n4_S').setStyle({color:  colors[getRandomInt(2,5)]}); 
        group.getLayer('m50_S').setStyle({color: colors[getRandomInt(1,4)]});
     
        

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