let trainLayerGroup = new L.LayerGroup();
let trainLine = new L.geoJSON(null, {
    "style": {
      "color": "#4baf56",
      "weight": 5,
      "opacity": 0.65
    }
  });

  let customMarkern = L.Marker.extend({
    options: {
      id: 0,
      stopdesc:''
    }
  });
  
  let trainstationsAPIBase ="http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=";

  d3.xml("/data/Transport/AllStationsXML.XML")
  .then(function(data) {
   processtrains(data);
  })
  .catch(function(err) {
    console.error("Error fetching Train stop data: " + JSON.stringify(err));
  });  

  function processtrains(data_) {
    //    console.log("Luas- \n");
    /*data_.forEach(function(d) {
      d.lat = +d.stop_lat;
      d.lng = +d.stop_lon;
      d.StopID = +d.stop_id;
      console.log(d.lat+ '---'+ d.log);
      //add a property to act as key for filtering
      //d.type = "train stop";
      //console.log("luas stop RT : " + d.Name);
    });
    //updateMapLuas(data_);
  }*/
  //extend the marker class to hold data used when calling RT data
  /*let customMarker = L.Marker.extend({
    options: {
      id: 0,
      stopdsc:''
    }
  });*/


  let xmlDoc=data_;
  let l = xmlDoc.getElementsByTagName("ArrayOfObjStation")[0].childNodes;
  let x = xmlDoc.getElementsByTagName("StationLatitude");
  let y = xmlDoc.getElementsByTagName("StationLongitude");
  let StopDesc=xmlDoc.getElementsByTagName("StationDesc");  
  let StopId=xmlDoc.getElementsByTagName("StationId");  
    
  for (i = 0; i < l.length; i++) {
  
    let lat=x[i].firstChild.nodeValue;
    let lon= y[i].firstChild.nodeValue;
    let stopds=StopDesc[i].firstChild.nodeValue;
    let stopId=StopId[i].firstChild.nodeValue;
    // console.log(lat+ '--'+ lon+ '--'+ stopds+ '--'+ stopId);
    
    if (lat < 54 && lon > -7) 
    {
   //var Smarker= L.marker([lat,lon],{Icon: ''});
    //.on('mouseover', function() {
      //  this.bindPopup(PubMsg + '<br>' + Direction).openPopup();
    //});

    let marker = new customMarkern(
        new L.LatLng(lat, lon), {
          //icon: getLuasMapIconSmall(d.LineID),
          id: stopId,
          stopdesc: stopds 
        }
      );
      //marker.bindPopup(stopId);
      marker.on('click', markerOnClicktrainstation);
     /*marker.on('mouseover', function() {
         this.bindPopup(stopId+ '--'+ stopds).openPopup();
      });*/
     
     
     //bindPopup(id +'--'+stopdsc);

    trainLayerGroup.addLayer(marker);
    }

    trainLayerGroup.addTo(gettingAroundMap);
    }
    }



    function markerOnClicktrainstation(e) {
        // let trainstationsAPIBase='lllll';
        let sdc_ = this.options.stopdesc;
        //console.log(sdc_);
        d3.html(trainstationsAPIBase+sdc_ ,{mode: 'no-cors'})
    .then(function(htmlDoc) {
       console.log(htmlDoc);
    });
    
    }





  
  /*function updateMapLuas(data__) {
    //hard-coded icons for ends of lines
    let saggart = L.latLng(53.28467885, -6.43776255);
    //let point = L.latLng( 53.34835, -6.22925833333333 );
    let bridesGlen = L.latLng(53.242075, -6.14288611111111);
    let m1 = L.marker(saggart, {
      //icon: luasMapIconLineRedEnd
    });
    let m2 = L.marker(bridesGlen, {
      //icon: luasMapIconLineGreenEnd
    });
  
    //luasIcons = L.layerGroup([m1, m2]);
    _.each(data__, function(d, k) {
      //console.log("luas id: " + d.LineID + "\n");
      let marker = new customMarker(
        new L.LatLng(d.lat, d.lng), {     
        }
      );

      /*let marker = new customMarker(
        new L.LatLng(d.lat, d.lng), {
          icon: getLuasMapIconSmall(d.LineID),
          id: d.StopID,
          lineId: d.LineID
        }
      );

      //marker.bindPopup(getLuasContent(d));
      //marker.on('click', markerOnClickLuas);
      trainLayerGroup.addLayer(marker);
      //console.log("marker ID: "+marker.options.id);
    });
    //gettingAroundMap.addLayer(trainLayerGroup);
    // gettingAroundMap.fitBounds(luasLayer.getBounds());
    //chooseLookByZoom();
  
  }*/