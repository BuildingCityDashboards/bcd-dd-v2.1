let bikesInterval = 20000;
let bikesCountdown = bikesInterval;

const updateBikesCountdown = function() {
  let cd = bikesCountdown / 1000;
  d3.select('#bikes-bikesCountdown').text("Update in " + cd);
  if (bikesCountdown > 0) bikesCountdown -= 1000;
}

let bikesTimer = setInterval(updateBikesCountdown, 1000);
let prevBikesAgeMins, prevBikesAvailable, prevStandsAvailable;
let indicatorUpSymbol = "▲",
  indicatorDownSymbol = "▼";

const fetchBikesData = function() {
  d3.json('/api/dublinbikes/stations/snapshot') //get latest snapshot of all stations
    .then((data) => {
      console.log("Fetched Dublin Bikes card data ");
      processBikes(data);
      clearInterval(bikesTimer);
    })
    .catch(function(err) {
      console.error("Error fetching Dublin Bikes card data: " + JSON.stringify(err));
      initialiseBikesDisplay();
      // restart the timer
      clearInterval(bikesTimer);
      bikesCountdown = bikesInterval;
      bikesTimer = setInterval(updateBikesCountdown, 1000);
    })
}

const bikesCardTimer = setIntervalAsync(
  () => {
    return fetchBikesData();
  },
  bikesInterval
);

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
  let now = moment(new Date());
  let bikesAgeMins = Math.floor(((now - latestUpdate) / 1000) / 60);
  // console.log("bikes age: " + bikesAgeMins)
  updateBikesDisplay(availableBikes, availableStands, bikesAgeMins);
}

function initialiseBikesDisplay() {
  // let bikeTimeShort = d3.timeFormat("%a, %H:%M");

  d3.select("#bikes-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-8' align='left'>" +
      "<b>Dublin Bikes Availability</b>" +
      "</div>" +
      "<div class = 'col-4' align='right'>" +
      "<div id ='bikes-bikesCountdown' ></div>" +
      // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );

  d3.select("#rt-bikes").select("#card-left")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p>bikes</p>' +
      '</div>');

  d3.select("#rt-bikes").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/transport/bicycle-w-15.svg" width="60">' +
      '</div>');


  d3.select("#rt-bikes").select("#card-right")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p> stands </p>' +
      '</div>');

}

function updateBikesDisplay(ab, as, age) {
  let animateClass = age < prevBikesAgeMins ? "animate-update" : "";
  let bikesAvailableDirection = ab > prevBikesAvailable ? indicatorUpSymbol :
    ab < prevBikesAvailable ? indicatorDownSymbol : "";

  let standsAvailableDirection = as > prevStandsAvailable ? indicatorUpSymbol :
    as < prevStandsAvailable ? indicatorDownSymbol : "";

  prevBikesAgeMins = age;
  prevBikesAvailable = ab;
  prevStandsAvailable = as;

  let bikesAgeDisplay = age > 0 ? age + 'm ago' : 'Just now';

  d3.select("#bikes-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-8' align='left'>" +
      "<b>Dublin Bikes Availability</b>" +
      "</div>" +
      "<div class = 'col-4' align='right'>" +
      "<span class = '" + animateClass + "'>" +
      bikesAgeDisplay + "</span>" + "&nbsp;&nbsp;" +
      "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );

  d3.select("#rt-bikes").select("#card-left")
    .html("<div class = '" + animateClass + "'align='center'>" +
      "<h3>" + bikesAvailableDirection + " " + ab + "</h3>" +
      "</div>" +
      "<div align='center'>" +
      "<p> bikes </p>" +
      "</div>");

  d3.select("#rt-bikes").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/transport/bicycle-w-15.svg" width="60">' +
      '</div>');


  d3.select("#rt-bikes").select("#card-right")
    .html("<div class = '" + animateClass + "'align='center'>" +
      "<h3>" + standsAvailableDirection + " " + as + "</h3>" +
      "</div>" +
      "<div align='center'>" +
      "<p> stands </p>" +
      "</div>");

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

initialiseBikesDisplay();
fetchBikesData(); //initial load