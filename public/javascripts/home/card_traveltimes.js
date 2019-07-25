let ttInterval = 30000;
let ttCountdown = ttInterval;
let timeSinceUpdate = moment(new Date());

const updateTTCountdown = function() {
  let cd = ttCountdown / 1000;
  d3.select('#tt-countdown').text("Update in " + cd);
  if (ttCountdown > 0) {
    ttCountdown -= 1000;
  }
}

let ttTimer = setInterval(updateTTCountdown, 1000);
let prevTTAgeMins, prevLongestDelay;

const fetchTTData = function() {
  d3.json("/data/Transport/traveltimes.json")
    .then((data) => {
      //console.log("Fetched Travel Times card data ");
      processTravelTimes(data);
      clearInterval(ttTimer);
      timeSinceUpdate = moment(new Date());
    })
    .catch(function(err) {
      //console.error("Error fetching Travel Times card data: " + JSON.stringify(err));
      initialiseTTDisplay();
      // restart the timer
      clearInterval(ttTimer);
      ttCountdown = ttInterval;
      ttTimer = setInterval(updateTTCountdown, 1000);
    })
}

const travelTimesCardTimer = setIntervalAsync(
  () => {
    return fetchTTData();
  },
  ttInterval
);

function processTravelTimes(data_) {
  let maxDelayedMotorway = {};
  let maxDelay = 0;
  let longestMotorwayDelay = 0;
  d3.keys(data_).forEach(
    //for each key = motorway+direction
    function(k) {
      let motorwayDelay = 0;
      //for each section on a motorway
      data_[k].data.forEach(function(d_) {
        if (+d_["current_travel_time"] > +d_["free_flow_travel_time"]) {
          let sectionDelay = +d_["current_travel_time"] - (+d_["free_flow_travel_time"]);
          //console.log("Section delay: " + k + "\t" + sectionDelay);
          motorwayDelay += sectionDelay;
          // if (sectionDelay > maxDelay) {
          //   d_.name = d;
          //   d_.delay = delay;
          //   maxDelayed = d_;
          // }
        }

      });
      //console.log("Motorway delay: " + k + "\t" + motorwayDelay);

      if (motorwayDelay > longestMotorwayDelay) {
        maxDelayedMotorway.name = k;
        maxDelayedMotorway.delay = motorwayDelay;
        longestMotorwayDelay = motorwayDelay;
      }
    }
  );
  //console.log("Longest MWay delay : " + JSON.stringify(maxDelayedMotorway) + "\t" + longestMotorwayDelay);
  updateTTDisplay(maxDelayedMotorway);
  //            console.log("ind " + JSON.stringify(indicatorUpSymbol.style));
};

function initialiseTTDisplay() {

  d3.select("#traveltimes-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-7' align='left'>" +
      "Motorway Delays" +
      "</div>" +
      "<div class = 'col-5' align='right'>" +
      "<div id ='tt-countdown' ></div>" +
      // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );

  d3.select("#rt-travelTimes").select("#card-left")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p> </p>' +
      "</div>");

  d3.select("#rt-travelTimes").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/transport/car-w-15.svg" width="60">' +
      "</div>");


  d3.select("#rt-travelTimes").select("#card-right")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p> </p>' +
      "</div>");

}


function updateTTDisplay(d__) {
  if (d__) {
    let ttAgeMins = Math.floor(((moment(new Date()) - timeSinceUpdate) / 1000) / 60);
    let animateClass = '';
    if (ttAgeMins !== prevTTAgeMins) {
      animateClass = "animate-update";
    }
    prevTTAgeMins = ttAgeMins;
    let ttAgeDisplay = ttAgeMins > 0 ? ttAgeMins + 'm ago' : 'Just now';
    // console.log("ages: " + ttAgeMins + '\t' + ttAgeDisplay);
    let name = d__.name.split('_')[0];
    let direction = d__.name.split('_')[1].split('B')[0];
    let delayMins = (+d__.delay / 60).toFixed(0);

    let delayDirection = delayMins > prevLongestDelay ? indicatorUpSymbol :
      delayMins < prevLongestDelay ? indicatorDownSymbol : "";
    prevLongestDelay = delayMins;

    let info = "Longest current <b>Motorway Delay</b>; travelling on the " +
      "<b>" + name + " " + direction +
      // " from <b>" + d__["from_name"] + "</b> to <b>" + d__["to_name"] + "</b>" +
      "</b> is taking <b>" + delayMins + " minutes</b> longer than with free-flowing traffic";
    updateInfo("#traveltimes-chart a", info);

    d3.select("#traveltimes-chart").select('.card__header')
      .html(
        "<div class = 'row'>" +
        "<div class = 'col-7' align='left'>" +
        "Motorway Delays" +
        "</div>" +
        "<div class = 'col-5' align='right'>" +
        "<span class = '" + animateClass + "'>" +
        ttAgeDisplay + "</span>" + "&nbsp;&nbsp;" +
        // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
        "</div>" +
        "</div>"
      );

    d3.select("#rt-travelTimes").select("#card-left")
      .html("<div class = '" + animateClass + "'align='center'>" +
        "<h3>" + name + "</h3>" +
        "<p>" + direction + "</p>" +
        "</div>");

    d3.select("#rt-travelTimes").select("#card-center")
      .html("<div align='center'>" +
        "<img src = '/images/transport/car-w-15.svg' width='60'>" +
        "</div>");


    d3.select("#rt-travelTimes").select("#card-right")
      .html("<div class = '" + animateClass + "'align='center'>" +
        "<h3>" + delayDirection + " " + delayMins + "</h3>" +
        "</div>" +
        "<p>minutes</p>" +
        "</div>");


  } else {
    updateInfo("#traveltimes-chart a", "Current travel times are close to free-flow times on all motorways");
  }
}

function updateInfo(selector, infoText) {

  let text = d3.select("#data-text p");
  let textString = "<b>Hover over these charts for more information, click to go to the data page </b>";

  d3.select(selector)
    .on("mouseover", (d) => {
      text.html(infoText);
    })
    .on("mouseout", (d) => {
      text.html(textString);
    });
}

initialiseTTDisplay();
fetchTTData();