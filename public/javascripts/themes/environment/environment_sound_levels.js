let popupTime = d3.timeFormat('%a %B %d, %H:%M')

proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
+x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
var firstProjection = 'EPSG:29902'
var secondProjection = 'EPSG:4326'

function processSoundsites (data_) {
  // console.log("sound data \n"+ JSON.stringify(data_));
  data_.forEach(function (d) {
    d.type = 'Noise Level Monitor'
    // console.log("d:" + JSON.stringify(d["lat"]));
  })
  initMapSoundsites(data_)
};

let noiseCluster = L.markerClusterGroup()

function initMapSoundsites (data__) {
  data__.forEach(data__, function (d, i) {
    let m = L.marker(new L.LatLng(+d['lon'], +d['lat']), {
      icon: noiseMapIcon
    })
    m.bindPopup(getSoundsiteContent(d))
    m.on('click', function (e) {
      var p = e.target.getPopup()
      getSoundReading(p, d)
    })
    noiseCluster.addLayer(m)
  })
  noiseMap.addLayer(noiseCluster)
  noiseMap.fitBounds(noiseCluster.getBounds())
}

function getSoundsiteContent (d_) {
  let str = ''
  if (d_['name']) {
    str += '<b>' + d_['name'] + '</b><br>'
  }
  if (d_.type) {
    str += d_.type + '<br>'
  }
  return str
}

function getSoundReading (p_, d_) {
  d3.json('../data/Environment/sound_levels/sound_reading_' + d_.site_id + '.json')
    .then(function (reading) {
      if (reading.aleq) {
        let lastRead = reading.aleq[reading.aleq.length - 1]
        let lastTime = reading.times[reading.times.length - 1]
        let lastDate = reading.dates[reading.dates.length - 1]
        p_.setContent(getSoundsiteContent(d_, ) +
          '<h2>' + lastRead + ' dB</h2>' +
          'Updated at ' +
          lastTime +
          ' on ' + lastDate
        )
        p_.update()
      } else {
        p_.setContent(p_.getContent() +
          '<br> Data currently unavailable')
        p_.update()
      }
    })
}

// Get the readings so far today
function getSoundReadings (p_, d_) {
  d3.json('../data/Environment/sound_levels/sound_reading_' + d_.site_id + '.json')
    .then(function (reading) {
      if (reading.aleq) {
        let lastRead = reading.aleq[reading.aleq.length - 1]
        let lastTime = reading.times[reading.times.length - 1]
        let lastDate = reading.dates[reading.dates.length - 1]
        p_.setContent(getSoundsiteContent(d_, ) +
          '<h2>' + lastRead + ' dB</h2>' +
          'Updated at ' +
          lastTime +
          ' on ' + lastDate
        )
        p_.update()
      } else {
        p_.setContent(p_.getContent() +
          '<br> Data currently unavailable')
        p_.update()
      }
    })
}

function getSoundsitePopup () {
  let sid_ = this.options.id

  d3.json('/api/noise/soundsites/' + sid_ + '/today').then(function (stationData) {
    let soundsiteSpark = dc.lineChart('#noise-spark-' + sid_)
    if (stationData.length == 0) {
      let str = '<div class="popup-error">' +
        '<div class="row ">' +
        "We can't get the noise monitoring data right now, please try again later" +
        '</div>' +
        '</div>'
      return d3.select('#bike-spark-' + sid_)
        .html(str)
    }
    let standsCount = stationData[0].bike_stands
    let ndx = crossfilter(stationData)
    let timeDim = ndx.dimension(function (d) {
      return d['last_update']
    })
    let latest = timeDim.top(1)[0].last_update

    let availableBikesGroup = timeDim.group().reduceSum(function (d) {
      return d['available_bikes']
    })

    let start = moment.utc().startOf('day').add(3, 'hours')
    let end = moment.utc().endOf('day').add(2, 'hours')

    soundsiteSpark.width(250).height(100)
    soundsiteSpark.dimension(timeDim)
    soundsiteSpark.group(availableBikesGroup)

    soundsiteSpark.x(d3.scaleTime().domain([start, end]))
    soundsiteSpark.y(d3.scaleLinear().domain([0, standsCount]))
    soundsiteSpark.margins({
      left: 20,
      top: 15,
      right: 20,
      bottom: 20
    })
    soundsiteSpark.xAxis().ticks(3)
    soundsiteSpark.renderArea(true)
    soundsiteSpark.renderDataPoints(false)
    //        soundsiteSpark.renderDataPoints({radius: 10});//, fillOpacity: 0.8, strokeOpacity: 0.0});
    soundsiteSpark.renderLabel(false) //, fillOpacity: 0.8, strokeOpacity: 0.0}); //labels on points -> how to apply to last point only?
    soundsiteSpark.label(function (d) {
      if (d.x === latest) {
        console.log(JSON.stringify(d))
        let hour = new Date(d.x).getHours()
        let mins = new Date(d.x).getMinutes().toString().padStart(2, '0')
        let end = ((d.y == 1) ? ' bike' : ' bikes')
        //                let str = hour + ':' + mins +
        let str = JSON.stringify(d.y) + end
        //                console.log(str);
        return str
      }
      return ''
    })

    soundsiteSpark.renderVerticalGridLines(true)
    soundsiteSpark.useRightYAxis(true)
    soundsiteSpark.xyTipsOn(false)
    soundsiteSpark.brushOn(false)
    soundsiteSpark.clipPadding(15)
    soundsiteSpark.render()
  })
}

