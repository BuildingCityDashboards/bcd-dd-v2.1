/************************************
 * Bikes
 ************************************/

let bikesIcon = L.Icon.extend({
  options: {
    iconSize: [36, 45],
    iconAnchor: [18, 45],
    popupAnchor: [-3, -46]
  }
});
//Add an id field to the markers to match with bike station id
let customBikesStationMarker = L.Marker.extend({
  options: {
    id: 0
  }
});

let customBikesLayer = L.Layer.extend({

});

let bikesStationPopupOptons = {
  // 'maxWidth': '500',
  'className': 'bikesStationPopup'
};
let bikesCluster = L.markerClusterGroup();
// let bikesLayerGroup = L.layerGroup();
let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
let bikeHour = d3.timeFormat("%H");

/** @todo Should load stations from an archived file if this fails**/
d3.json('/api/dublinbikes/stations/list')
  .then((data) => initBikeStationsMarkers(data))
  .catch((err) => {
    console.error("Error fetching Dublin Bikes data" + JSON.stringify(err));
  });


// Timed refresh of map station markers symbology using data snapshot
const bikesTimer = setIntervalAsync(
  () => {
    return d3.json('/api/dublinbikes/stations/snapshot') //get latest snapshot of all stations
      .then((data) => {
        console.log("Fetched Dublin Bikes data ");
        updateAPIStatus('#bike-activity-icon', '#bike-age', true);
        updateBikeStationsMarkers(data);
      })
      .catch(function(err) {
        console.error("Error fetching Dublin Bikes data: " + JSON.stringify(err));
        updateAPIStatus('#bike-activity-icon', '#bike-age', false);
      })

  },
  10000
);

function initBikeStationsMarkers(data_) {
  // console.log('update map\n' + JSON.stringify(data__[0]));
  // bikesCluster.clearLayers();
  // gettingAroundMap.removeLayer(bikesCluster); //required
  data_.forEach((d, i) => {
    d.type = "Dublin Bikes Station"; //used in alt text (tooltip)
    let m = new customBikesStationMarker(
      new L.LatLng(+d.st_LATITUDE, +d.st_LONGITUDE), {
        id: d.st_ID,
        icon: new bikesIcon({
          iconUrl: 'images/transport/bikes_icon_default.png' //loads a default grey icon
        }),
        opacity: 0.9, //(Math.random() * (1.0 - 0.5) + 0.5),
        title: d.type + '\t' + d.st_NAME,
        alt: d.type + ' icon',
        //            riseOnHover: true,
        //            riseOffset: 250

      });
    m.bindPopup(bikesStationPopupInit(d), bikesStationPopupOptons);
    m.on('popupopen', getBikesStationPopup); //refeshes data on every popup open
    bikesCluster.addLayer(m);
    // bikesLayerGroup.addLayer(m);
    // gettingAroundMap.addLayer(bikesLayerGroup);
  });
  gettingAroundMap.addLayer(bikesCluster);
  // gettingAroundMap.fitBounds(bikesCluster.getBounds());
}




//Doing the following to update the marker icons without instantiating them on each data load
/***@todo: check if this is actually more performant than bikesCluster.clearLayers + re-instantiation***/

function updateBikeStationsMarkers(data_) {
  gettingAroundMap.removeLayer(bikesCluster);
  bikesCluster.eachLayer(function(layer) {
    data_.forEach((d, i) => {
      if (d.id === layer.options.id) {
        layer.options.icon.options.iconUrl = getBikesIcon(d);
      };
    });
    // console.log("Icons loaded");

    // console.log("layer id: " + layer.options.id);
    // console.log("\nlayer options: " + JSON.stringify(layer.options));
    // console.log("\nlayer icon: " + JSON.stringify(layer.options.icon));
    // layer.options.icon.options.iconUrl = 'images/transport/bikes_icon_blue_1.png';
    // console.log("\nlayer icon changed: " + JSON.stringify(layer.options.icon));
    //indicate if asscoiated popup open or closed
    // const msg = layer.isPopupOpen() ? "Popup is open" : "Popup is closed";
    // console.log("layer popup: " + msg);
    // console.log("lid: " + bikesLayerGroup.getLayerId(layer));
    // layer.bindPopup('Hello');
    // layer.setIcon(getBikesIcon(d));
    /***@todo try this***/
    // create custom icon
    // IconStyleOne = L.icon({
    //   iconUrl: 'img/image1.png'
    // });
    // IconStyleTwo = L.icon({
    //   iconUrl: 'img/image2.png'
    // });
    //
    // // ...
    //
    // //Create empty geojson with mouseover and mouseout events
    // geojson_feature = L.geoJson(false, {
    //   pointToLayer: function(feature, latlng) {
    //     return L.marker(latlng, {
    //       icon: IconStyleOne
    //     });
    //   },
    //   onEachFeature: function(feature, layer) {
    //     layer.on("mouseover", function(e) {
    //       layer.setIcon(IconStyleOne)
    //     });
    //     layer.on("mouseout", function(e) {
    //       layer.setIcon(IconStyleTwo)
    //     });
    //   }
    // }).addTo(this.map); **
    // * /
  });
  gettingAroundMap.addLayer(bikesCluster);
}

//Choose a symbol for the map marker icon based on the current availability
//the data element for the station is passed in and parsed

function getBikesIcon(d_) {
  const percentageFree = Math.round((d_.available_bikes / d_.bike_stands) * 100);
  const one = 'images/transport/bikes_icon_blue_1.png',
    two = 'images/transport/bikes_icon_blue_2.png',
    three = 'images/transport/bikes_icon_blue_3.png',
    four = 'images/transport/bikes_icon_blue_4.png',
    five = 'images/transport/bikes_icon_blue_5.png';

  return percentageFree < 20 ? one :
    percentageFree < 40 ? two :
    percentageFree < 60 ? three :
    percentageFree < 80 ? four : five;
}

function bikesStationPopupInit(d_) {
  // console.log("\n\nPopup Initi data: \n" + JSON.stringify(d_)  + "\n\n\n");
  //if no station id none of the mappings witll work so escape
  if (!d_.st_ID) {
    let str = "<div class=\"popup-error\">" +
      "<div class=\"row \">" +
      "We can't get the Dublin Bikes data right now, please try again later" +
      "</div>" +
      "</div>";
    return str;
  }

  let str = "<div class=\"bike-popup-container\">";
  if (d_.st_NAME) {
    str += "<div class=\"row \">";
    str += "<span id=\"bike-name-" + d_.st_ID + "\" class=\"col-9\">"; //id for name div
    str += "<strong>" + d_.st_NAME + "</strong>";
    str += "</span>" //close bike name div
    //div for banking icon
    str += "<span id=\"bike-banking-" + d_.st_ID + "\" class= \"col-3\"></span>";
    str += '</div>'; //close row
  }
  str += "<div class=\"row \">";
  str += "<span id=\"bike-standcount-" + d_.st_ID + "\" class=\"col-9\" ></span>";
  str += "</div>"; //close row

  //initialise div to hold chart with id linked to station id
  if (d_.st_ID) {
    str += '<div class=\"row \">';
    str += '<span id="bike-spark-' + d_.st_ID + '"></span>';
    str += '</div>';
  }
  str += '</div>' //closes container
  return str;
}


function setBikesStationPopupError(id, err) {
  let str = "<div class=\"popup-error\">" +
    "<div class=\"row \">" +
    "We can't get the Dublin Bikes data for this station right now, please try again later" +
    "</div>" +
    "</div>";
  console.error("\n\n Dublin Bikes Station data was not returned: " + JSON.stringify(err));
  d3.select("#bike-spark-" + id)
    .html(str);
}

//Sparkline for popup geterated from station query
function getBikesStationPopup() {
  ////d3.select("#bike-spark-67").text('Selected from D3');
  let sid_ = this.options.id;
  // /api/dublinbikes / stations / snapshot
  d3.json('/api/dublinbikes/stations/' + sid_ + '/today')
    .then(function(stationData) {
      // d3.json("/api/dublinbikes/stations/" + sid_ + "/today").then(function(stationData, err) {
      // console.log("\n******\nExample Dublin Bikes data from Derilinx to client \n" + JSON.stringify(stationData) + "\n******\n");
      if (stationData.length === 0) {
        let obj = {
          "length": 0
        };
        return setBikesStationPopupError(sid_, obj);
      }
      if (stationData[0].banking) {
        console.log("Banking at #" + sid_ + " is " + stationData[0].banking);
        let bankStr = "<img alt=\"Banking icon \" src = \"images/bank-card-w.svg\" height= \"20px\" title=\"Banking available\" />";
        d3.select("#bike-banking-" + sid_)
          .html(bankStr);

      }
      //assuming static data doesn't change throughout day...
      let standsCount = stationData[0].historic[0].bike_stands;
      if (standsCount) {
        // console.log("Banking at #" + sid_ + " is " + stationData[0].banking);
        let stdStr = '<strong>' + standsCount + ' total stands </strong>';
        d3.select("#bike-standcount-" + sid_)
          .html(stdStr);
      }
      let processedData = stationData[0].historic.map((d) => {
        d.ms = moment(d.time).valueOf(); //add a property for the day formatted as Epoch time
        return d;
      });

      let ndx = crossfilter(processedData);
      let timeDim = ndx.dimension(function(d) {
        // return d["last_update"];
        return d.ms;
      });
      let earliest = timeDim.bottom(1)[0];
      // let earliestMS = moment(earliest).valueOf();
      let latest = timeDim.top(1)[0];
      // let latestMS = moment(latest).valueOf();
      // moment(timeDim.top(1)[0].time).format();
      // console.log("\n\n***********\nEarliest returned: " + JSON.stringify(earliest.ms) + "\n***********\n\n");
      // console.log("\n\n***********\nLatest returned: " + JSON.stringify(latest.ms) + "\n***********\n\n");
      let availableBikesGroup = timeDim.group().reduceSum(function(d) {
        return d["available_bikes"];
      });
      // console.log("available bikes: " + JSON.stringify(availableBikesGroup.top(Infinity)));

      let startChart = moment.utc().startOf('day').add(3, 'hours');
      let endChart = moment.utc().endOf('day').add(2, 'hours');
      // console.log("chart time range: " + startChart + " - " + endChart);
      let bikeSpark = dc.lineChart("#bike-spark-" + sid_);
      // console.log("Select bike spark #" + sid_);
      bikeSpark.width(250).height(100);
      bikeSpark.dimension(timeDim);
      bikeSpark.group(availableBikesGroup);
      bikeSpark.x(d3.scaleTime().domain([startChart, endChart]));
      bikeSpark.y(d3.scaleLinear().domain([0, standsCount]));
      bikeSpark.margins({
        left: 20,
        top: 15,
        right: 20,
        bottom: 20
      });
      bikeSpark.xAxis().ticks(3);
      bikeSpark.renderArea(true);
      bikeSpark.renderDataPoints(true);
      //        bikeSpark.renderDataPoints({radius: 10});//, fillOpacity: 0.8, strokeOpacity: 0.0});
      bikeSpark.renderLabel(false); //, fillOpacity: 0.8, strokeOpacity: 0.0}); //labels on points -> how to apply to last point only?
      bikeSpark.label(function(d) {
        if (d.x === latest) {
          // console.log(JSON.stringify(d));
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
      //        bikeSpark.title(function (d, i) {
      //            let hour = new Date(d.key).getHours();
      //            let mins = new Date(d.key).getMinutes().toString().padStart(2, '0');
      //            let val = ((d.value == 1) ? ' bike available' : ' bikes available');
      //            let str = hour + ':' + mins + ' - ' + JSON.stringify(d.value) + val;
      ////              console.log(str);
      //            return str;
      //        });
      bikeSpark.renderVerticalGridLines(true);
      bikeSpark.useRightYAxis(true);
      bikeSpark.xyTipsOn(false);
      bikeSpark.brushOn(false);
      bikeSpark.clipPadding(15);
      bikeSpark.render();
    })
    .catch(function(err) {
      return setBikesStationPopupError(sid_, err);

    })
}

function setBikeStationColour(bikes, totalStands) {
  let percentageFree = (bikes / totalStands) * 100;
  return percentageFree < 20 ? '#eff3ff' :
    percentageFree < 40 ? '#c6dbef' :
    percentageFree < 60 ? '#9ecae1' :
    percentageFree < 80 ? '#6baed6' : '#3182bd';
}

let bikesLegend = L.control({
  position: 'bottomright'
});

bikesLegend.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'info legend'),
    bikeGrades = [0, 20, 40, 60, 80],
    labels = [],
    from, to;
  //    labels.push('Bike Stations');
  labels.push('Dublin Bikes Availability');
  for (let i = bikeGrades.length - 1; i >= 0; i--) {
    from = bikeGrades[i];
    to = bikeGrades[i + 1];
    labels.push('<i style="background: ' + setBikeStationColour(from, 100) + '"></i>' +
      +from + (to ? '%&ndash;' + to + '%' : '%' + '+'));
  }
  labels.push('<i style="background: #454545"></i>' + 'No data');
  div.innerHTML = labels.join('<br>');
  return div;
};

bikesLegend.addTo(gettingAroundMap);