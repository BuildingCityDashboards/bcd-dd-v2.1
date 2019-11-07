let popupTime = d3.timeFormat("%a %B %d, %H:%M");


proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
+x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
var firstProjection = "EPSG:29902";
var secondProjection = "EPSG:4326";

let waterMapLayerSizes = [];

/************************************
 * OPW Water Levels
 ************************************/
//Custom map icons
let waterMapIcon = L.icon({
  iconUrl: '/images/environment/water-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

let osmWater = new L.TileLayer(stamenTerrainUrl, {
  minZoom: min_zoom,
  maxZoom: max_zoom - 1,
  attribution: stamenTonerAttrib
});

let waterMap = new L.Map('chart-water-map');
waterMap.setView(new L.LatLng(dubLat, dubLng), zoom);
waterMap.addLayer(osmWater);
let markerRefWater; //TODO: fix horrible hack!!!
waterMap.on('popupopen', function(e) {
  markerRefWater = e.popup._source;
  //console.log("ref: "+JSON.stringify(e));
});

let waterOPWCluster = L.markerClusterGroup();

d3.json('/data/Environment/waterlevel.json')
  .then(function(data) {
    processWaterLevels(data.features);
  });

function processWaterLevels(data_) {
  //will filter out all data bar Greater Dublin
  let regionData = data_.filter(function(d) {
    return d.properties["station.region_id"] === null //Dublin OPW stations have null id
      ||
      d.properties["station.region_id"] === 10;
  });
  regionData.forEach(function(d) {
    d.lat = +d.geometry.coordinates[1];
    d.lng = +d.geometry.coordinates[0];
    d.type = "OPW GPRS Station Water Level Monitor";

  });
  waterMapLayerSizes[0] = regionData.length;
  initMapWaterLevels(regionData);
};

function initMapWaterLevels(data__) {
  _.each(data__, function(d, i) {
    waterOPWCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng), {
        icon: waterMapIcon
      })
      .bindPopup(getWaterLevelContent(d)));
  });
  waterMap.addLayer(waterOPWCluster);
}

function getWaterLevelContent(d_) {
  let str = '';
  if (d_.properties["station.name"]) {
    str += '<b>' + d_.properties["station.name"] + '</b><br>' +
      'Sensor ' + d_.properties["sensor.ref"] + '<br>' +
      d_.type + '<br>';
  }
  //    if (d_.properties["value"]) {
  //        str += '<br><b>Water level: </b>' + d_.properties["value"] + '<br>';
  //    }
  //    if (d_.properties.datetime) {
  //        str += '<br>Last updated on ' + popupTime(new Date(d_.properties.datetime)) + '<br>';
  //    }
  return str;
}

/************************************
 * Hydronet
 ************************************/
let hydronetCluster = L.markerClusterGroup();

d3.csv("/data/Environment/Register of Hydrometric Stations in Ireland 2017_Dublin.csv").then(function(data) {
  processHydronet(data);
});

function processHydronet(data_) {
  data_.forEach(function(d, i) {
    let result = proj4(firstProjection, secondProjection,
      [+d["EASTING"], +d["NORTHING"]]);
    d.lat = result[1];
    d.lng = result[0];
    d.type = "Hydronet Water Level Monitor";
    //        console.log("d: " + d["EASTING"]+" | "+d["NORTHING"]);
    //        console.log("dlat " + d.lat+" | dlng "+d.lng);
  });
  waterMapLayerSizes.push(data_.length);
  initMapHydronet(data_);
};

function initMapHydronet(data__) {
  _.each(data__, function(d, k) {
    let marker = L.marker(new L.LatLng(d.lat, d.lng), {
      icon: waterMapIcon
    });
    marker.bindPopup(getHydronetContent(d, k));
    hydronetCluster.addLayer(marker);

  });
  waterMapLayerSizes[1] = data__.length;
  waterMap.addLayer(hydronetCluster);
}

function getHydronetContent(d_, k_) {
  let str = '';
  if (d_["Station Name"]) {
    str += '<b>' + d_["Station Name"] + '</b><br>';
  }
  if (d_.type) {
    str += d_.type + '<br>';
  }
  if (d_.Waterbody) {
    str += 'at ' + d_.Waterbody + '<br>';
  }
  if (d_.Owner) {
    str += '<br>' + d_.Owner + '<br>';
  }

  if (d_["Station Status"]) {
    str += 'Status: ' + d_["Station Status"] + '<br>';

  }
  //    if (d_["Hydrometric Data Available"]) {
  //        str += d_["Hydrometric Data Available"] + ' Available<br>';
  //    }
  //    if (d_["Station Status"] === "Inactive") {
  //        str += '<br/><button type="button" class="btn btn-primary hydronet-popup-btn" data="'
  //                + k_ + '">Get Historical Data</button>';
  //    } else {
  //        str += '<br/><button type="button" class="btn btn-primary hydronet-popup-btn" data="'
  //                + k_ + '">Get Latest Data</button>';
  //
  //    }
  return str;
}

function displayHydronet(k_) {
  return markerRefWater.getPopup().setContent(markerRefWater.getPopup().getContent() +
    '<br><br> Data not currently available<br><br>'
  );
}

let displayHydronetBounced = _.debounce(displayHydronet, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
//$("div").on('click', '.hydronet-popup-btn', function () {
//    displayHydronetBounced($(this).attr("data"));
//});


/************************************
 * Sound Map
 ************************************/
/*let noiseMapIcon = L.icon({
  iconUrl: '/images/environment/microphone-black-shape.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

let iconAttrib = "Microphone icon by <a href=\"https://www.flaticon.com/authors/dave-gandy\">Dave Gandy</a>";

let osmSound = new L.TileLayer(stamenTerrainUrl, {
  minZoom: min_zoom,
  maxZoom: max_zoom,
  attribution: iconAttrib + "  " + stamenTonerAttrib
});

let noiseMap = new L.Map('chart-sound-map');
noiseMap.setView(new L.LatLng(dubLat, dubLng), zoom);
noiseMap.addLayer(osmSound);
let markerRefSound; //TODO: fix horrible hack!!!

noiseMap.on('popupopen', function(e) {
  markerRefSound = e.popup._source;
  //    console.log("popup: "+JSON.stringify(e);

});

d3.json('/data/Environment/Soundsites.json')
  .then(function(data) {
    //            console.log(data.features);
    processSoundsites(data.sound_monitoring_sites);
  });*/

function processSoundsites(data_) {
  //console.log("sound data \n"+ JSON.stringify(data_));
  data_.forEach(function(d) {
    d.type = "Noise Level Monitor";
    //console.log("d:" + JSON.stringify(d["lat"]));
  });
  initMapSoundsites(data_);
};

let noiseCluster = L.markerClusterGroup();

function initMapSoundsites(data__) {
  _.each(data__, function(d, i) {
    let m = L.marker(new L.LatLng(+d["lon"], +d["lat"]), {
      icon: noiseMapIcon
    });
    m.bindPopup(getSoundsiteContent(d));
    m.on('click', function(e) {
      var p = e.target.getPopup();
      getSoundReading(p, d);
      //            console.log("p: " + );
    });
    noiseCluster.addLayer(m);
  });
  noiseMap.addLayer(noiseCluster);
  noiseMap.fitBounds(noiseCluster.getBounds());;
}

function getSoundsiteContent(d_) {
  let str = '';
  if (d_["name"]) {
    str += '<b>' + d_["name"] + '</b><br>';
  }
  if (d_.type) {
    str += d_.type + '<br>';
  }
  return str;
}

function getSoundReading(p_, d_) {
  d3.json("../data/Environment/sound_levels/sound_reading_" + d_.site_id + ".json")
    .then(function(reading) {
      if (reading.aleq) {
        let lastRead = reading.aleq[reading.aleq.length - 1];
        let lastTime = reading.times[reading.times.length - 1];
        let lastDate = reading.dates[reading.dates.length - 1];
        p_.setContent(getSoundsiteContent(d_, ) +
          "<h2>" + lastRead + " dB</h2>" +
          "Updated at " +
          lastTime +
          " on " + lastDate
        );
        p_.update();
      } else {
        p_.setContent(p_.getContent() +
          "<br> Data currently unavailable");
        p_.update();
      }
    });
}

//Get the readings so far today
function getSoundReadings(p_, d_) {
  d3.json("../data/Environment/sound_levels/sound_reading_" + d_.site_id + ".json")
    .then(function(reading) {
      if (reading.aleq) {
        let lastRead = reading.aleq[reading.aleq.length - 1];
        let lastTime = reading.times[reading.times.length - 1];
        let lastDate = reading.dates[reading.dates.length - 1];
        p_.setContent(getSoundsiteContent(d_, ) +
          "<h2>" + lastRead + " dB</h2>" +
          "Updated at " +
          lastTime +
          " on " + lastDate
        );
        p_.update();
      } else {
        p_.setContent(p_.getContent() +
          "<br> Data currently unavailable");
        p_.update();
      }
    });
}

function getSoundsitePopup() {
  ////d3.select("#bike-spark-67").text('Selected from D3');
  let sid_ = this.options.id;

  //    let timeParse = d3.timeParse("%d/%m/%Y");
  d3.json("/api/noise/soundsites/" + sid_ + "/today").then(function(stationData) {
    // stationData.forEach(function (d) {
    //     d.hour = new Date(d["last_update"]).getHours();
    // });
    let soundsiteSpark = dc.lineChart("#noise-spark-" + sid_);
    if (stationData.length == 0) {
      let str = "<div class=\"popup-error\">" +
        "<div class=\"row \">" +
        "We can't get the noise monitoring data right now, please try again later" +
        "</div>" +
        "</div>"
      return d3.select("#bike-spark-" + sid_)
        .html(str);
    }
    let standsCount = stationData[0].bike_stands;
    let ndx = crossfilter(stationData);
    let timeDim = ndx.dimension(function(d) {
      return d["last_update"];
    });
    let latest = timeDim.top(1)[0].last_update;
    //        console.log ("latest: "+JSON.stringify(timeDim.top(1)[0].last_update));
    let availableBikesGroup = timeDim.group().reduceSum(function(d) {
      return d["available_bikes"];
    });
    //moment().format('MMMM Do YYYY, h:mm:ss a');
    let start = moment.utc().startOf('day').add(3, 'hours');
    let end = moment.utc().endOf('day').add(2, 'hours');
    //        console.log("bikes: " + JSON.stringify(timeDim.top(Infinity)));
    soundsiteSpark.width(250).height(100);
    soundsiteSpark.dimension(timeDim);
    soundsiteSpark.group(availableBikesGroup);
    //        console.log("day range: " + start + " - " + end);
    soundsiteSpark.x(d3.scaleTime().domain([start, end]));
    soundsiteSpark.y(d3.scaleLinear().domain([0, standsCount]));
    soundsiteSpark.margins({
      left: 20,
      top: 15,
      right: 20,
      bottom: 20
    });
    soundsiteSpark.xAxis().ticks(3);
    soundsiteSpark.renderArea(true);
    soundsiteSpark.renderDataPoints(false);
    //        soundsiteSpark.renderDataPoints({radius: 10});//, fillOpacity: 0.8, strokeOpacity: 0.0});
    soundsiteSpark.renderLabel(false); //, fillOpacity: 0.8, strokeOpacity: 0.0}); //labels on points -> how to apply to last point only?
    soundsiteSpark.label(function(d) {
      if (d.x === latest) {
        console.log(JSON.stringify(d));
        let hour = new Date(d.x).getHours();
        let mins = new Date(d.x).getMinutes().toString().padStart(2, '0');
        let end = ((d.y == 1) ? ' bike' : ' bikes');
        //                let str = hour + ':' + mins +
        let str = JSON.stringify(d.y) + end;
        //                console.log(str);
        return str;;
      }
      return '';
    });
    //        soundsiteSpark.title(function (d, i) {
    //            let hour = new Date(d.key).getHours();
    //            let mins = new Date(d.key).getMinutes().toString().padStart(2, '0');
    //            let val = ((d.value == 1) ? ' bike available' : ' bikes available');
    //            let str = hour + ':' + mins + ' - ' + JSON.stringify(d.value) + val;
    ////              console.log(str);
    //            return str;
    //        });
    soundsiteSpark.renderVerticalGridLines(true);
    soundsiteSpark.useRightYAxis(true);
    soundsiteSpark.xyTipsOn(false);
    soundsiteSpark.brushOn(false);
    soundsiteSpark.clipPadding(15);
    soundsiteSpark.render();
  });
}

/************************************
 * Air Quality Map
 ************************************/
/*let airMapIcon = L.icon({
  iconUrl: '/images/environment/water-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

let osmAir = new L.TileLayer(stamenTerrainUrl, {
  minZoom: min_zoom,
  maxZoom: max_zoom,
  attribution: stamenTonerAttrib
});

let airMap = new L.Map('chart-air-map');
airMap.setView(new L.LatLng(dubLat, dubLng), zoom);
airMap.addLayer(osmAir);
let markerRefAir; //TODO: fix horrible hack!!!
airMap.on('popupopen', function(e) {
  markerRefAir = e.popup._source;
  //console.log("ref: "+JSON.stringify(e));
});*/

/************************************
 * Button listeners
 ************************************/
//Note that one button is classed active by default and this must be dealt with

d3.select("#water-opw-btn").on("click", function() {
  let cb = d3.select("#water-all-btn");
  if (cb.classed('active')) {
    cb.classed('active', false);
  }
  d3.select("#water-site-count").html('<p>The map currently shows:</p><h4>' +
    waterMapLayerSizes[0] + ' OPW sites</h4>');

  waterMap.removeLayer(hydronetCluster);
  if (!waterMap.hasLayer(waterOPWCluster)) {
    waterMap.addLayer(waterOPWCluster);
  }
  waterMap.fitBounds(waterOPWCluster.getBounds());
});

d3.select("#water-hydronet-btn").on("click", function() {
  let cb = d3.select("#water-all-btn");
  if (cb.classed('active')) {
    cb.classed('active', false);
  }
  d3.select("#water-site-count").html('<p>The map currently shows:</p> <h4>' +
    waterMapLayerSizes[1] + ' EPA Hydronet sites</h4>');
  waterMap.removeLayer(waterOPWCluster);
  if (!waterMap.hasLayer(hydronetCluster)) {
    waterMap.addLayer(hydronetCluster);
  }
  waterMap.fitBounds(hydronetCluster.getBounds());
});

d3.select("#water-all-btn").on("click", function() {
  let cb = d3.select(this);
  if (cb.classed('active')) {
    cb.classed('active', false);
  }

  //console.log("Showing all " + (waterMapLayerSizes[0] + waterMapLayerSizes[1]) + " sites");
  d3.select("#water-site-count").html('<p>The map currently shows:</p><h4>All ' +
    (waterMapLayerSizes[0] + waterMapLayerSizes[1]) + ' sites</h4>');

  if (!waterMap.hasLayer(waterOPWCluster)) {
    waterMap.addLayer(waterOPWCluster);
  }
  if (!waterMap.hasLayer(hydronetCluster)) {
    waterMap.addLayer(hydronetCluster);
  }
  waterMap.fitBounds(hydronetCluster.getBounds());
});
