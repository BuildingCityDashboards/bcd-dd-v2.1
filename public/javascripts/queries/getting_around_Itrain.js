/* eslint-disable new-cap */
/* eslint-disable spaced-comment */
// import { defaultFormat } from "moment"

/* eslint-disable no-undef */
const trainLayerGroup = new L.LayerGroup()
const trainLine = new L.geoJSON(null, {
  style: {
    color: '#4baf56',
    weight: 5,
    opacity: 0.65
  }
})

const tarinCustomMarker = L.Marker.extend({
  options: {
    id: 0,
    stopdesc: ''
  }
})

const trainMapIcon = L.icon({
  iconUrl: '/images/transport/train.svg',
  iconSize: [15, 15],
  iconAnchor: [iconAX, iconAY]
})

const trainCircleIcon = L.icon({
  iconUrl: '/images/transport/circle.svg',
  iconSize: [8, 8],
  iconAnchor: [iconAX, iconAY]

})
// To fetch data using anywhere. proxy but with 600 per request per hour
// const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
// const trainstationsAPIBase = 'http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc='
// / trainstations/stations/list
d3.xml('api/trainstations/stations/list')
  .then(function (data) {
    processTrains(data)
  })
  .catch(function (err) {
    console.error('Error fetching Train stop data: ')
    console.error(err)
  })
// http: // api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=
function processTrains (data_) {
  const xmlDoc = data_
  const objStationArray = xmlDoc.getElementsByTagName('objStation')
  const x = xmlDoc.getElementsByTagName('StationLatitude')
  const y = xmlDoc.getElementsByTagName('StationLongitude')
  const StopDesc = xmlDoc.getElementsByTagName('StationDesc')
  const StopId = xmlDoc.getElementsByTagName('StationId')

  for (let i = 0; i < objStationArray.length; i++) {
    const lat = x[i].firstChild.nodeValue
    const lon = y[i].firstChild.nodeValue
    const stopds = StopDesc[i].firstChild.nodeValue
    const stopId = StopId[i].firstChild.nodeValue
    if (lat < 54 && lon > -7) {
      const marker = new tarinCustomMarker(
        new L.LatLng(lat, lon), {
          icon: trainCircleIcon,
          id: stopId,
          stopdesc: stopds
        }
      )
      marker.bindPopup(getTSContent(stopds, stopId))
      marker.on('click', markerOnClicktrainstation)
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
  const sdc_ = this.options.stopdesc

  let trainRT = ''
  trainRT += this.options.stopdesc + '<br>' + this.options.id + '<br>'
  trainRT += '<br>'
  trainRT += 'To' + ':' + '&nbsp;&nbsp;&nbsp;' + 'Expected Dept.' + '<br>'

  d3.xml('api/trainstations/stations/' + sdc_)
    .then(function (Doc) {
      const objStationArray = Doc.getElementsByTagName('objStationData')
      // const Org = Doc.getElementsByTagName('Origin')
      const Des = Doc.getElementsByTagName('Destination')
      // const Exav = Doc.getElementsByTagName('Exparrival')
      // const Scav = Doc.getElementsByTagName('Scharrival')
      const ExDe = Doc.getElementsByTagName('Schdepart')

      for (let i = 0; i < objStationArray.length; i++) {
        // let Orgv = Org[i].childNodes[0].nodeValue
        const Desv = Des[i].childNodes[0].nodeValue
        // const Exar = Exav[i].childNodes[0].nodeValue
        // const Scar = Scav[i].childNodes[0].nodeValue
        const Exdep = ExDe[i].childNodes[0].nodeValue
        if (Exdep !== '00:00') {
          // Orgv = sdc_
          trainRT += Desv + ':' + '&nbsp;&nbsp;&nbsp;' + Exdep + '<br>'
          markerRefPublic.getPopup().setContent(trainRT)
        }
      }
      // Original
      /*for (let i = 0; i < l.length; i++) {
      let Orgv = Org[i].childNodes[0].nodeValue
      let Desv = Des[i].childNodes[0].nodeValue
      let Exar = Exav[i].childNodes[0].nodeValue
      if (Exar =='00:00') {Exar ="no Info"}
      let Scar = Scav[i].childNodes[0].nodeValue
      if (Scar =='00:00') {Scar ="no Info"}
      luasRT += Orgv + "---" + Desv + "---" + Scar + "---" + Exar + "<br>"
      markerRefPublic.getPopup().setContent(luasRT)

      // console.log(Orgv + '---' + Desv)
      }*/

    // popup.setContent('<br>' + 'fssdsd')
    })
}

/*const trainsTimer = setIntervalAsync(
  () => {

    console.log('Fetched Dublin Trains data ')
    updateAPIStatus('#train-activity-icon', '#train-age', true)
  },
  10000
)*/

const trainsTimer = setIntervalAsync(
  () => {

    return d3.xml('api/trainstations/stations/list')
      .then(function (data) {
        updateAPIStatus('#train-activity-icon', '#train-age', true)
      // console.log("Luas API active")
      })
      .catch(function (err) {
        console.error('Error fetching Train data: ' + JSON.stringify(err))
        updateAPIStatus('#train-activity-icon', '#train-age', false)
      })
  },
  15000
)
