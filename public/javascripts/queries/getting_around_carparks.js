/************************************
 * Carparks
 ************************************/
let carparkMapIcon = L.Icon.extend({
  options: {
    iconSize: [30, 30], //orig size
    iconAnchor: [iconAX, iconAY] //,
    //popupAnchor: [-3, -76]
  }
});

//Add an id field to the markers to match with bike station id
let customCarparkMarker = L.Marker.extend({
  options: {
    id: 0
  }
});

let customCarparkLayer = L.Layer.extend({

});

let carparkPopupOptons = {
  // 'maxWidth': '500',
  'className': 'carparkPopup'
};

let carparkCluster = L.markerClusterGroup({
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

//create points on privateMap for carparks even if RTI not available
d3.json("/data/Transport/carparks_static.json")
  .catch((err) => {
    console.error("Error fetching car parks static data");

  })
  .then((data) => {
    //    console.log("data.carparks :" + JSON.stringify(data.carparks));
    initCarparksMarkers(data);
  });

// Timed refresh of map station markers symbology using data snapshot
const carparksTimer = setIntervalAsync(
  () => {
    return d3.xml('/api/carparks/snapshot') //get latest snapshot of all stations
      .catch(function(err) {
        console.error("Getting Around - Error fetching Car Park data");
        updateAPIStatus('#parking-activity-icon', '#parking-age', false);
      })
      .then((xml) => {

        updateAPIStatus('#parking-activity-icon', '#parking-age', true);
        let e = xml.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue;
        console.log('\n\n\n >Fetched Car Parks snapshot<\n');
        console.log('\nxml: ' + e + ' \n');
        // console.log('Data: ' + JSON.stringify(data[0]));
        // updateMapBikes(data);
        // console.log('Snapshot size ' + JSON.stringify(data.length)); //??snapshot size varies??
        // updateBikeStationsMarkers(data);
      })
  },
  10000
);

//New way
function initCarparksMarkers(data_) {
  console.log('Car parks init: \n' + JSON.stringify(data_));
  data_.forEach((d, k) => {
    let m = new customCarparkMarker(new L.LatLng(d.lat, d.lon), {
      icon: new carparkMapIcon({
        iconUrl: '/images/transport/parking-garage-w-default-15.svg' //loads a default grey icon
      })
    });
    // marker.bindPopup(getCarparkContent(d, k));
    carparkCluster.addLayer(m);
    //        console.log("getMarkerID: "+marker.optiid);
  });
  gettingAroundMap.addLayer(carparkCluster);
  // bikesCluster.clearLayers();
  // gettingAroundMap.removeLayer(bikesCluster); //required
  // data_.forEach((d, i) => {
  //   d.type = "Car Park"; //used in alt text (tooltip)
  //   let m = new customCarparkMarker(
  //     new L.LatLng(+d.st_LATITUDE, +d.st_LONGITUDE), {
  //       id: d.st_ID,
  //       icon: new bikesIcon({
  //         iconUrl: 'images/transport/bikes_icon_default.png' //loads a default grey icon
  //       }),
  //       opacity: 0.9, //(Math.random() * (1.0 - 0.5) + 0.5),
  //       title: d.type + '\t' + d.st_NAME,
  //       alt: d.type + ' icon',
  //       //            riseOnHover: true,
  //       //            riseOffset: 250
  //
  //     });
  // m.bindPopup(bikesStationPopupInit(d), bikesStationPopupOptons);
  // m.on('popupopen', getBikesStationPopup); //refeshes data on every popup open
  // bikesCluster.addLayer(m);
  // bikesLayerGroup.addLayer(m);
  // gettingAroundMap.addLayer(bikesLayerGroup);
  // });
  // gettingAroundMap.addLayer(bikesCluster);
  // gettingAroundMap.fitBounds(bikesCluster.getBounds());
}


function updateMapCarparks(data__) {
  carparkCluster.clearLayers();
  gettingAroundMap.removeLayer(carparkCluster);
  _.each(data__, function(d, k) {
    let marker = L.marker(new L.LatLng(d[0].lat, d[0].lon), {
      icon: carparkMapIcon
    });
    marker.bindPopup(getCarparkContent(d[0], k));
    carparkCluster.addLayer(marker);
    //        console.log("getMarkerID: "+marker.optiid);
  });
  gettingAroundMap.addLayer(carparkCluster);
}

//static car park data (location etc)
function getCarparkContent(d_, k_) {
  let str = '';
  if (d_.name) {
    str += d_.name + '<br>';
  }
  //    if (d_.Totalspaces) {
  //        str += 'Capacity is ' + d_.Totalspaces + '<br>';
  //    }
  //
  //
  ;
  return str;
}

function displayCarpark(k_) {
  //dynamic data (available spaces)
  // console.log("retrieving live carpark data");
  // d3.xml("/data/Transport/cpdata.xml")
  //   .then(function(xmlDoc) {
  //     //        if (error) {
  //     //            console.log("error retrieving data");
  //     //            return;
  //     //        }
  //     //TODO: convert to arrow function + d3
  //     let timestamp = xmlDoc.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue;
  //     // console.log("timestamp :" + timestamp);
  //     for (let i = 0; i < xmlDoc.getElementsByTagName("carpark").length; i += 1) {
  //       let name = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("name");
  //       if (name === k_) {
  //         let spaces = xmlDoc.getElementsByTagName("carpark")[i].getAttribute("spaces");
  //         // console.log("found:" + name + " spaces: " + spaces + "marker" +
  //         // markerRefPrivate.getPopup().getContent());
  //         if (spaces !== ' ') {
  //           return markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent() +
  //             '<br><br> Free spaces: ' +
  //             spaces +
  //             '<br> Last updated: ' +
  //             timestamp
  //           );
  //         } else {
  //           return markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent() +
  //             '<br><br> No information on free spaces available' +
  //             '<br> Last updated: ' +
  //             timestamp
  //           );
  //         }
  //       }
  //     }
  //   })
  //   .catch(function(err) {
  //     console.error("Error fetching car parks realtime data");
  //   });
}
let displayCarparkBounced = _.debounce(displayCarpark, 100); //debounce using underscore

////TODO: replace jQ w/ d3 version
//$("div").on('click', '.carparkbutton', function () {
//    displayCarparkBounced($(this).attr("data"));
//});