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
maxZoom = 16;
let gettingAroundOSM = new L.TileLayer(cartoDb, {
  minZoom: 10,
  maxZoom: maxZoom, //seems to fix 503 tileserver errors
  attribution: stamenTonerAttrib
});

let gettingAroundMap = new L.Map('getting-around-map');
gettingAroundMap.setView(new L.LatLng(dubLat, dubLng), zoom);
gettingAroundMap.addLayer(gettingAroundOSM);
let markerRefPublic; //TODO: fix horrible hack!!!
gettingAroundMap.on('popupopen', function(e) {
  markerRefPublic = e.popup._source;
  //console.log("ref: "+JSON.stringify(e));
});

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
      console.debug(JSON.stringify(d));
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

function processRoads(data_) {
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
}
/************************************
 * Button Listeners
 ************************************/

//if buttons are disabled in view, do not update activiy from api-status.json

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

        //gettingAroundMap.fitBounds(luasCluster.getBounds());
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

//D3 DOM manipulation

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