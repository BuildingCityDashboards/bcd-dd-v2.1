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

let carparkPopupOptions = {
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
  .then((data) => {
    //    console.log("data.carparks :" + JSON.stringify(data.carparks));
    initCarparksMarkers(data);
  })
  .catch((err) => {
    console.error("Error fetching car parks static data");

  });

// Timed refresh of map station markers symbology using data snapshot
const carparksTimer = setIntervalAsync(
  () => {
    return d3.xml('/api/carparks/snapshot') //get latest snapshot of all stations
      .then((xml) => {
        updateAPIStatus('#parking-activity-icon', '#parking-age', true);
        updateCarparkMarkers(xml);
      })
      .catch(function(err) {
        console.error("Getting Around - Error fetching Car Park data");
        updateAPIStatus('#parking-activity-icon', '#parking-age', false);
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
      }),
      opacity: 0.9, //(Math.random() * (1.0 - 0.5) + 0.5),
      title: 'Car Park:' + '\t' + d.name,
      alt: 'Car Park icon',
    });
    m.bindPopup(carparkPopupInit(d), carparkPopupOptions);
    carparkCluster.addLayer(m);
    //        console.log("getMarkerID: "+marker.optiid);
  });
  gettingAroundMap.addLayer(carparkCluster);
}

function updateCarparkMarkers(xml_) {
  gettingAroundMap.removeLayer(carparkCluster);
  carparkCluster.clearLayers();
  for (let i = 0; i < xml_.getElementsByTagName("carpark").length; i += 1) {
    let name = xml_.getElementsByTagName("carpark")[i].getAttribute("name");
    // if (name === k_) {
    let spaces = xml_.getElementsByTagName("carpark")[i].getAttribute("spaces");
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
    carparkCluster.addLayer(m);
  }


  // + "marker" +
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
  // }
  //
  // data_.forEach((d, k) => {
  //   let m = new customCarparkMarker(new L.LatLng(d.lat, d.lon), {
  //     icon: new carparkMapIcon({
  //       iconUrl: '/images/transport/parking-garage-w-cd-green-1-15.svg' //loads a default grey icon
  //     }),
  //     opacity: 0.9, //(Math.random() * (1.0 - 0.5) + 0.5),
  //     title: 'Car Park:' + '\t' + d.name,
  //     alt: 'Car Park icon',
  //   });
  //   m.bindPopup(carparkPopupInit(d), carparkPopupOptions);
  //   carparkCluster.addLayer(m);
  // }
  gettingAroundMap.addLayer(carparkCluster);

}



function carparkPopupInit(d_) {
  // console.log("\n\nPopup Initi data: \n" + JSON.stringify(d_)  + "\n\n\n");
  //if no station id none of the mappings witll work so escape
  if (!d_.name) {
    let str = "<div class=\"popup-error\">" +
      "<div class=\"row \">" +
      "We can't get the Car Park data right now, please try again later" +
      "</div>" +
      "</div>";
    return str;
  }

  let str = "<div class=\"bike-popup-container\">";
  if (d_.name) {
    str += "<div class=\"row \">";
    str += "<span id=\"carpark-name-" + d_.id + "\" class=\"col-12\">"; //id for name div
    str += "<strong>" + d_.name + "</strong>";
    str += "</span>" //close bike name div
    str += '</div>'; //close row
  }
  str += "<div class=\"row \">";
  str += "<span id=\"carpark-spacescount-" + d_.id + "\" class=\"col-9\" >" +
    d_.Totalspaces +
    " total spaces</span>";
  str += "</div>"; //close row

  //set up a div to display availability
  str += "<div class=\"row \">";
  str += "<span id=\"carpark-available-" + d_.id + "\" class=\"col-9\" ></span>";
  str += "</div>"; //close row

  //initialise div to hold chart with id linked to station id
  if (d_.id) {
    str += '<div class=\"row \">';
    str += '<span id="carpark-spark-' + d_.id + '"></span>';
    str += '</div>';
  }
  str += '</div>' //closes container
  return str;

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