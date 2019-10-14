/************************************
 * Bus Stops
 ************************************/
let busCluster = L.markerClusterGroup({
  //   showCoverageOnHover: false,
  //   zoomToBoundsOnClick: false
  disableClusteringAtZoom: maxZoom,
  spiderfyOnMaxZoom: false
  //   // singleMarkerMode: true
  //   // maxClusterRadius: 100,
  //   // iconCreateFunction: function(cluster) {
  //   //   return L.divIcon({
  //   //     html: '<b>' + cluster.getChildCount() + '</b>'
  //   //   });
  //   // }
});
let dublinBusMapIcon = L.icon({
  iconUrl: '/images/transport/bus-w-cbs-blue-4-15.svg',
  iconSize: [30, 30], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
});

d3.json("/data/Transport/busstopinformation_bac.json").then(function(data) {
    //    console.log("data.results[0]" + JSON.stringify(data.results[0]));
    processBusStops(data.results); //TODO: bottleneck?
  })
  .catch(function(err) {
    console.error("Error fetching Bus stop information data");
  });


function processBusStops(res_) {
  //    console.log("Bus data \n");
  res_.forEach(function(d) {
    d.lat = +d.latitude;
    d.lng = +d.longitude;
    //add a property to act as key for filtering
    d.type = "Dublin Bus Stop";

  });
  //    console.log("Bus Stop: \n" + JSON.stringify(res_[0]));
  //    console.log("# of bus stops is " + res_.length + "\n"); // +
  updateMapBuses(res_);
};

function updateMapBuses(data__) {
  busCluster.clearLayers();
  gettingAroundMap.removeLayer(busCluster);
  _.each(data__, function(d, i) {
    let marker = L.marker(new L.LatLng(d.lat, d.lng), {
      icon: dublinBusMapIcon
    });
    marker.bindPopup(getBusContent(d));
    busCluster.addLayer(marker);
    //        console.log("getMarkerID: "+marker.optiid);
  });

  // gettingAroundMap.addLayer(busCluster);
}

function getBusContent(d_) {
  let str = '';
  if (d_.fullname) {
    str += d_.fullname + '<br>';
  }
  if (d_.stopid) {
    str += 'Stop ' + d_.stopid + '<br>';
  }
  if (d_.operators[0].routes) {
    str += 'Routes: ';
    _.each(d_.operators[0].routes, function(i) {
      str += i;
      str += ' ';
    });
    str += '<br>';
  }
  if (d_.address && d_.address !== d_.name) {
    str += d_.address + '<br>';
  }
  if (d_.stopid) {
    //add a button and attached the busstop id to it as data, clicking the button will query using 'stopid'
    str += '<br/><button type="button" class="btn btn-primary busRTPIbutton" data="' +
      d_.stopid + '">Real Time Information</button>';
  };

  return str;
}

//Handle button in gettingAroundMap popup and get RTPI data
let busAPIBase = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=";
//let busAPIBase = "https://www.dublinbus.ie/RTPI/?searchtype=stop&searchquery=";

function displayRTPI(sid_) {
  let rtpiBase, rtpi;
  d3.json(busAPIBase + sid_)
    .catch(function(err) {
      console.error("Error fetching Bus stop realtime data" + err);
      rtpiBase = "<br><br><strong>We're sorry... </strong> <br>" +
        "The real-time provider did not answer our request for data at this time.";
      rtpi = rtpiBase;
      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(rtpiBase)[0] + rtpi);

    })
    .then(function(data) {
      //                console.log("Button press " + sid_ + "\n");
      rtpiBase = "<br><br><strong> Next Buses: </strong> <br>";
      rtpi = rtpiBase;
      if (data.results.length > 0) {
        //                    console.log("RTPI " + JSON.stringify(data.results[0]));
        _.each(data.results, function(d, i) {
          //console.log(d.route + " Due: " + d.duetime + "");
          //only return n results
          if (i <= 7) {
            rtpi += "<br><b>" + d.route + "</b> " + d.direction + " to " + d.destination;
            if (d.duetime === "Due") {
              rtpi += "  <b>" + d.duetime + "</b>";
            } else {
              rtpi += "  <b>" + d.duetime + " mins</b>";
            }
          }

        });
      } else {
        //console.log("No RTPI data available");
        rtpi += "No Real Time Information Available<br>";
      }
      //                console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0]);
      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(rtpiBase)[0] + rtpi);
    });

}
let displayRTPIBounced = _.debounce(displayRTPI, 100); //debounce using underscore

//TODO: replace jQ w/ d3 version
$("div").on('click', '.busRTPIbutton', function() {
  displayRTPIBounced($(this).attr("data"));
});