/* eslint-disable spaced-comment */
/************************************
 * Luas
 ************************************/
// let luasCluster = L.markerClusterGroup()
const luasLayer = L.layerGroup()
const luasLineGreen = new L.geoJSON(null, {
  style: {
    color: '#4baf56',
    weight: 5,
    opacity: 0.65
  }
})

const luasLineRed = new L.geoJSON(null, {
  style: {
    color: '#ff4a54',
    weight: 5,
    opacity: 0.65
  }
})
let luasIcons // layer holds markers positioned at ends of luas lines

const luasMapIconLineGreenEnd = L.icon({
  iconUrl: '/images/transport/rail-light-15-g.svg',
  iconSize: [30, 30], // orig size
  iconAnchor: [25, -5] // ,
// popupAnchor: [-3, -76]
})

const luasMapIconLineRedEnd = L.icon({
  iconUrl: '/images/transport/rail-light-15-r.svg',
  iconSize: [30, 30], // orig size
  iconAnchor: [25, -5] // ,
// popupAnchor: [-3, -76]
})

const luasMapIconLargeGreen = L.icon({
  // iconUrl: '/images/transport/rail-light-15-b.svg',
  iconUrl: '/images/transport/rail-light-g-c-15.svg',
  iconSize: [30, 30], // orig size
  iconAnchor: [iconAX, iconAY] // ,
// popupAnchor: [-3, -76]
})

const luasMapIconLargeRed = L.icon({
  // iconUrl: '/images/transport/rail-light-15-b.svg',
  iconUrl: '/images/transport/rail-light-r-c-15.svg',
  iconSize: [30, 30], // orig size
  iconAnchor: [iconAX, iconAY] // ,
// popupAnchor: [-3, -76]
})

const luasMapIconSmallGreen = L.icon({
  // iconUrl: '/images/transport/rail-light-15.svg',
  iconUrl: '/images/transport/circle-stroked-15-g.svg',
  iconSize: [15, 15], // orig size
  iconAnchor: [iconAX / 2, iconAY / 2] // ,
// popupAnchor: [-3, -76]
})

const luasMapIconSmallRed = L.icon({
  // iconUrl: '/images/transport/rail-light-15.svg',
  iconUrl: '/images/transport/circle-stroked-15-r.svg',
  iconSize: [15, 15], // orig size
  iconAnchor: [iconAX / 2, iconAY / 2] // ,
// popupAnchor: [-3, -76]
})

// create points on gettingAroundMap for Luas stops even if RTI not available
d3.tsv('/data/Transport/luas-stops.txt')
  .then(function (data) {
    processLuas(data)
  })
  .catch(function (err) {
    console.error('Error fetching Luas stop data: ' + JSON.stringify(err))
  })

d3.json('/data/Transport/LUAS_Green_Line.geojson')
  .then(function (data) {
    updateMapLuasLineGreen(data)
  }).catch(function (err) {
  console.error('Error fetching Luas Green Line path')
})

d3.json('/data/Transport/LUAS_Red_Line.geojson')
  .then(function (data) {
    updateMapLuasLineRed(data)
  }).catch(function (err) {
  console.error('Error fetching Luas Red Line path')
})

const luasAPIBase = 'https://luasforecasts.rpa.ie/analysis/view.aspx?id='

// Timed refresh of api status
const luasTimer = setIntervalAsync(
  () => {
    return d3.html(luasAPIBase) // get latest snapshot of all stations
      .then((data) => {
        updateAPIStatus('#luas-activity-icon', '#luas-age', true)
        // console.log("Luas API active")

      })
      .catch(function (err) {
        console.error('Error fetching Luas data: ' + JSON.stringify(err))
        updateAPIStatus('#luas-activity-icon', '#luas-age', false)
      })
  },
  15000
)

function processLuas (data_) {
  //    console.log("Luas- \n")
  data_.forEach(function (d) {
    d.lat = +d.Latitude
    d.lng = +d.Longitude
    d.StopID = +d.StopID
    // add a property to act as key for filtering
    d.type = 'Luas tram stop'
  // console.log("luas stop RT : " + d.Name)
  })
  updateMapLuas(data_)
}
// extend the marker class to hold data used when calling RT data
const customMarker = L.Marker.extend({
  options: {
    id: 0
  }
})

function updateMapLuas (data__) {
  // hard-coded icons for ends of lines
  const saggart = L.latLng(53.28467885, -6.43776255)
  // let point = L.latLng( 53.34835, -6.22925833333333 )
  const bridesGlen = L.latLng(53.242075, -6.14288611111111)
  const m1 = L.marker(saggart, {
    icon: luasMapIconLineRedEnd
  })
  const m2 = L.marker(bridesGlen, {
    icon: luasMapIconLineGreenEnd
  })

  luasIcons = L.layerGroup([m1, m2])
  _.each(data__, function (d, k) {
    // console.log("luas id: " + d.LineID + "\n")
    const marker = new customMarker(
      new L.LatLng(d.lat, d.lng), {
        icon: getLuasMapIconSmall(d.LineID),
        id: d.StopID,
        lineId: d.LineID
      }
    )
    marker.bindPopup(getLuasContent(d))
    marker.on('click', markerOnClickLuas)
    luasLayer.addLayer(marker)
  // console.log("marker ID: "+marker.options.id)
  })
  gettingAroundMap.addLayer(luasLayer)
  // gettingAroundMap.fitBounds(luasLayer.getBounds())
  chooseLookByZoom()
}

function updateMapLuasLineGreen (data__) {
  luasLineGreen.addData(data__)
  gettingAroundMap.addLayer(luasLineGreen)
  chooseLookByZoom()
}

function updateMapLuasLineRed (data__) {
  luasLineRed.addData(data__)
  gettingAroundMap.addLayer(luasLineRed)
  chooseLookByZoom()
}

function getLuasLine (id_) {
  return (id_ === '1' ? 'Red' : 'Green')
}

function getLuasMapIconSmall (id_) {
  // console.log("icon: " + d.LineID + "\n")
  return (id_ === '1' ? luasMapIconSmallRed : luasMapIconSmallGreen)
}

function getLuasMapIconLarge (id_) {
  // console.log("icon: " + d.LineID + "\n")
  return (id_ === '1' ? luasMapIconLargeRed : luasMapIconLargeGreen)
}

function getLuasContent (d_) {
  let str = ''
  if (d_.Name) {
    str += '<b>' + d_.Name + '</b><br>'
  }
  if (d_.IrishName) {
    str += '<i>' + d_.IrishName + '</i><br>'
  }
  if (d_.LineID) {
    str += getLuasLine(d_.LineID) + ' Line <br>'
  }
  // if (d_.StopID) {
  //     // str += '<br/><button type="button" class="btn btn-primary luasRTbutton" data="'
  //     //         + d_.StopID + '">Real Time Information</button>'
  //
  //     str+= displayLuasRT(d_.StopID)
  //     console.log("Get luas rt for "+d_.StopID)
  //
  //     //console.log(displayLuasRT(d_.StopID))
  // }
  // 
  return str
}

function markerOnClickLuas (e) {
  const sid_ = this.options.id
  // console.log("marker " + sid_ + "\n")
  // Luas API returns html, so we need to parse this into a suitable JSON structure
  d3.html(luasAPIBase + sid_)
    .then(function (htmlDoc) {
      //                console.log(htmlDoc.body)
      const infoString = htmlDoc.getElementById('cplBody_lblMessage')
        .childNodes[0].nodeValue
      // console.log("info: " + infoString + "\n")
      const headings = htmlDoc.getElementsByTagName('th')
      // console.log("#cols = " + headings.length + "\n")
      const rows = htmlDoc.getElementsByTagName('tr')
      // console.log("#rows = " + rows.length + "\n")
      const tableData = []
      for (let i = 1; i < rows.length; i += 1) {
        const obj = {}
        for (let j = 0; j < headings.length; j += 1) {
          const heading = headings[j]
            .childNodes[0]
            .nodeValue
          const value = rows[i].getElementsByTagName('td')[j].innerHTML
          // console.log("\nvalue: "+ value)
          obj[heading] = value
        }
        // console.log("\n")
        tableData.push(obj)
      }
      // console.log("tabledata: " + JSON.stringify(tableData))
      const luasRTBase = '<br><br> Next trams after '
      let luasRT = luasRTBase + infoString.split('at ')[1] + '<br>'
      if (tableData.length > 0) {
        //                    console.log("RTPI " + JSON.stringify(data.results[0]))
        _.each(tableData, function (d, i) {
          // console.log(d.route + " Due: " + d.duetime + "")
          // only return n results
          if (i <= 7) {
            luasRT += '<br><b>' + d.Direction +
              '</b> to <b>' + d.Destination + '</b>'
            if (d.Time) {
              const min = d.Time.split(':')[1]
              if (min === '00') {
                luasRT += ' is <b>Due now</b>'
              } else {
                luasRT += ' is due in <b>' + min + '</b> mins'
              }
            } else {
              'n/a'
            }
          }
        })
      } else {
        // console.log("No RTPI data available")
        luasRT += 'No Real Time Information Available<br>'
      }
      // console.log("luas rt marker ref" + luasRT)

      // console.log("split " + markerRefPublic.getPopup().getContent().split(rtpi)[0])
      markerRefPublic.getPopup().setContent(markerRefPublic.getPopup().getContent().split(luasRTBase)[0] + luasRT)
    })
    .catch(function (err) {
      console.error('Error fetching Luas realtime data')
    })
}

// Adapt map features for various zoom levels
gettingAroundMap.on('zoomend', function (ev) {
  chooseLookByZoom()
})

function chooseLookByZoom () {
  // console.log("Zoom: " + gettingAroundMap.getZoom())
  const cb = d3.select('#luas-checkbox')
  if (!cb.classed('disabled')) {
    if (cb.classed('active')) {
      if (gettingAroundMap.getZoom() < 12) {
        if (!gettingAroundMap.addLayer(luasIcons)) {
          gettingAroundMap.addLayer(luasIcons)
        }
        gettingAroundMap.removeLayer(luasLayer)
      } else if (gettingAroundMap.getZoom() < 13) {
        if (!gettingAroundMap.addLayer(luasIcons)) {
          gettingAroundMap.addLayer(luasIcons)
        }
        if (!gettingAroundMap.addLayer(luasLayer)) {
          gettingAroundMap.addLayer(luasLayer)
        }
        // each layer is actually a marker
        luasLayer.eachLayer(function (marker) {
          // get the line id set in the custom marker to choose red or grreen icon
          const lId = luasLayer.getLayer(luasLayer.getLayerId(marker)).options.lineId
          marker.setIcon(getLuasMapIconSmall(lId))
        })
      } else {
        gettingAroundMap.removeLayer(luasIcons)
        if (!gettingAroundMap.addLayer(luasLayer)) {
          gettingAroundMap.addLayer(luasLayer)
        }
        luasLayer.eachLayer(function (marker) {
          // get the line id set in the custom marker to choose red or grreen icon
          const lId = luasLayer.getLayer(luasLayer.getLayerId(marker)).options.lineId
          marker.setIcon(getLuasMapIconLarge(lId))
        })
      }
    }
  }
}

// let displayLuasRTBounced = _.debounce(displayLuasRT, 100) //debounce using underscore
