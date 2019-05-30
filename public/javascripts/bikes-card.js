d3.json("/api/dublinbikes/stations/snapshot").then(function(data) {
  //    console.lodata[0]);
  processBikes(data);
});

function processBikes(data_) {
  let availableBikes = 0,
    availableStands = 0,
    latestUpdate = 0;
  //console.log("Bike data \n");
  data_.forEach(function(d) {
    if (d.available_bikes) {
      availableBikes += d.available_bikes;
    }
    if (d.available_bike_stands) {
      availableStands += d.available_bike_stands;
    }
    //TODO: old school, use d3.max instead?
    if (d.last_update) {
      let lup = moment(d.last_update);
      if (lup > latestUpdate) {
        latestUpdate = lup;
      }
    }
  });

  updateBikesDisplay(availableBikes, availableStands, latestUpdate);
}

function updateBikesDisplay(ab, as, l) {
  let bikeTimeShort = d3.timeFormat("%a, %H:%M");

  d3.select("#bikes-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-6' align='left'>" +
      "<b>Dublin Bikes</b>" +
      "</div>" +
      "<div class = 'col-6' align='right'>" +
      bikeTimeShort(l) + " &nbsp;&nbsp;" +
      "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );

  d3.select("#rt-bikes").select("#card-left")
    .html("<div align='center'>" +
      '<h3>' + ab + '</h3>' +
      '<p>bikes</p>' +
      '</div>');

  d3.select("#rt-bikes").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/transport/bicycle-w-15.svg" width="60">' +
      '</div>');


  d3.select("#rt-bikes").select("#card-right")
    .html("<div align='center'>" +
      '<h3>' + as + '</h3>' +
      '<p> stands </p>' +
      '</div>');

  updateInfo("#bikes-chart a", "<b>Dublin Bikes</b> currently have <b>" + ab + " bikes </b> and <b>" + as + " stands </b> available across the city");

}

function updateInfo(selector, infoText) {

  let text = d3.select("#data-text p"),
    textString = text.text();;

  d3.select(selector)
    .on("mouseover", (d) => {
      text.html(infoText);
    })
    .on("mouseout", (d) => {
      text.text(textString);
    });
}
//
//
//;
//let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
//function getBikeContent(d_) {
//    let str = '';
//    if (d_.name) {
//        str += d_.name + '<br>';
//    }
//    if (d_.type) {
//        str += d_.type + '<br>';
//    }
////    if (d_.address && d_.address !== d_.name) {
////        str += d_.address + '<br>';
////    }
//    if (d_.available_bikes) {
//        str += '<br><b>' + d_.available_bikes + '</b>' + ' bikes are available<br>';
//    }
//    if (d_.available_bike_stands) {
//        str += '<b>' + d_.available_bike_stands + '</b>' + ' stands are available<br>';
//    }
//
//    if (d_.last_update) {
//        str += '<br>Last updated ' + bikeTime(new Date(d_.last_update)) + '<br>';
//    }
//    return str;
//}