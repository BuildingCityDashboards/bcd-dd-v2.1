/* eslint-disable spaced-comment */
//import { defaultFormat } from "moment";

/* eslint-disable no-undef */
const trainLayerGroup = new L.LayerGroup()
const trainLine = new L.geoJSON(null, {
  style: {
    color: '#4baf56',
    weight: 5,
    opacity: 0.65
  }
})

const CustomMarkern = L.Marker.extend({
  options: {
    id: 0,
    stopdesc: ''
  }
})

const trainMapIcon = L.icon({
  // iconUrl: '/images/transport/rail-light-15-b.svg',
  iconUrl: '/images/transport/train.svg',
  iconSize: [15, 15], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
})

const trainCircleIcon = L.icon({
  // iconUrl: '/images/transport/rail-light-15-b.svg',
  iconUrl: '/images/transport/circle.svg',
  iconSize: [8, 8], //orig size
  iconAnchor: [iconAX, iconAY] //,
  //popupAnchor: [-3, -76]
})



// const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
// const trainstationsAPIBase = 'http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc='
/// trainstations/stations/list
d3.xml('api/trainstations/stations/list')
  .then(function (data) {
    processtrains(data)
  })
  .catch(function (err) {
    console.error('Error fetching Train stop data: ' + JSON.stringify(err))
  })

function processtrains (data_) {
  const xmlDoc = data_
  const l = xmlDoc.getElementsByTagName('ArrayOfObjStation')[0].childNodes
  const x = xmlDoc.getElementsByTagName('StationLatitude')
  const y = xmlDoc.getElementsByTagName('StationLongitude')
  const StopDesc = xmlDoc.getElementsByTagName('StationDesc')
  const StopId = xmlDoc.getElementsByTagName('StationId')

  for (let i = 0; i < l.length; i++) {
    const lat = x[i].firstChild.nodeValue
    const lon = y[i].firstChild.nodeValue
    const stopds = StopDesc[i].firstChild.nodeValue
    const stopId = StopId[i].firstChild.nodeValue
    // console.log(lat+ '--'+ lon+ '--'+ stopds+ '--'+ stopId);

    if (lat < 54 && lon > -7) {
      const marker = new CustomMarkern(
        new L.LatLng(lat, lon), {
          icon: trainCircleIcon, //getLuasMapIconSmall(d.LineID),
          id: stopId,
          stopdesc: stopds
        }
      )
      marker.bindPopup(getTSContent(stopds, stopId))
      // marker.bindPopup(stopId);
      marker.on('click', markerOnClicktrainstation)
      /* marker.on('mouseover', function() {
         this.bindPopup(stopId+ '--'+ stopds).openPopup();
      }); */
      // bindPopup(id +'--'+stopdsc);

      trainLayerGroup.addLayer(marker)
    }
    trainLayerGroup.addTo(gettingAroundMap)
  }
}

function getTSContent (stopds, stopId) {
  let str = ''
  const StopDesc = stopds
  const StopId = stopId

  if (StopDesc) {
    str += '<b>' + StopDesc + '</b><br>'
  }
  if (StopId) {
    str += '<i>' + StopId + '</i><br>'
  }

  return str
}

function markerOnClicktrainstation (e) {
  // let trainstationsAPIBase='lllll';
  const sdc_ = this.options.stopdesc
  //let popup = e.target.getPopup();
  let luasRT = ''
  luasRT += this.options.stopdesc + '<br>' + this.options.id + '<br>'
  luasRT += '<br>'
  luasRT += 'From' + '---' + 'To' + '---' + 'Exdep' + '<br>'
  // luasRT +="Origion" + "---" + "Destination" + "---" + "Scharrival" + "---" + "Exparrival" + "<br>";

  // popup.setContent('iiii');
  //let pop = L.popup().setLatLng(this._latlng).setContent('Loading...').openOn(gettingAroundMap);
  // 'api/trainstations/stations/list
  d3.xml('api/trainstations/stations/' + sdc_)
  // d3.xml(proxyUrl + trainstationsAPIBase + sdc_)
  // d3.xml("api/trainstations/stations/sdc_")
    .then(function (Doc) {
      const l = Doc.getElementsByTagName('ArrayOfObjStationData')[0].childNodes
      const Org = Doc.getElementsByTagName('Origin')
      const Des = Doc.getElementsByTagName('Destination')
      const Exav = Doc.getElementsByTagName('Exparrival')
      const Scav = Doc.getElementsByTagName('Scharrival')
      const ExDe = Doc.getElementsByTagName('Schdepart')

      for (let i = 0; i < l.length; i++) {
        let Orgv = Org[i].childNodes[0].nodeValue
        const Desv = Des[i].childNodes[0].nodeValue
        const Exar = Exav[i].childNodes[0].nodeValue
        //if (Exar =='00:00') {Exar ="no Info"}
        const Scar = Scav[i].childNodes[0].nodeValue
        const Exdep = ExDe[i].childNodes[0].nodeValue
        //if (Exdep !=='00:00') {Scar ="no Info"}
        if (Exdep !== '00:00') {
          Orgv = sdc_
          luasRT += Orgv + '---' + Desv + '---' + Exdep + '<br>'
          markerRefPublic.getPopup().setContent(luasRT)
        }

      // console.log(Orgv + '---' + Desv);
      }
      // Original
      /*for (let i = 0; i < l.length; i++) {
      let Orgv = Org[i].childNodes[0].nodeValue;
      let Desv = Des[i].childNodes[0].nodeValue;
      let Exar = Exav[i].childNodes[0].nodeValue;
      if (Exar =='00:00') {Exar ="no Info"}
      let Scar = Scav[i].childNodes[0].nodeValue;
      if (Scar =='00:00') {Scar ="no Info"}
      luasRT += Orgv + "---" + Desv + "---" + Scar + "---" + Exar + "<br>";
      markerRefPublic.getPopup().setContent(luasRT);

      // console.log(Orgv + '---' + Desv);
      }*/

      // popup.setContent('<br>' + 'fssdsd');
    })
};

function Abc (a, b) {
  let str = ''
  const StopDesc = a
  const StopId = b

  if (StopDesc) {
    str += '<b>' + StopDesc + '</b><br>'
  }
  if (StopId) {
    str += '<i>' + StopId + '</i><br>'
  }

  return str
}

function getdata (Doc, sdc_) {
  console.log(sdc_ + '<br>' + Doc)
}

/* function updateMapLuas(data__) {
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

  } */
