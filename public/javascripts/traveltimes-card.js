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

const fetchTTData = function() {
  d3.json("/data/Transport/traveltimes.json")
    .then((data) => {
      console.log("Fetched Travel Times card data ");
      processTravelTimes(data);
      clearInterval(ttTimer);
      timeSinceUpdate = moment(new Date());
    })
    .catch(function(err) {
      console.error("Error fetching Travel Times  card data: " + JSON.stringify(err));
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
  let maxDelayed = null;
  let maxDelay = 0;
  d3.keys(data_).forEach(
    //for each key
    function(d) {
      //                        console.log("d = "+JSON.stringify(d));
      //for each data array element

      data_[d].data.forEach(function(d_) {
        if (d_["current_travel_time"] > (d_["free_flow_travel_time"] * 1.25)) {
          let delay = +(d_["current_travel_time"] - d_["free_flow_travel_time"]);
          if (delay > maxDelay) {
            d_.name = d;
            d_.delay = delay;
            maxDelayed = d_;
          }
        }
      });
    }
  );
  updateTTDisplay(maxDelayed);
  //            console.log("ind " + JSON.stringify(indicatorUpSymbol.style));
};
let indicatorUpSymbol = "▲",
  indicatorUpColor = "#da1e4d"; /*TODO: color symbol with style*/

function initialiseTTDisplay() {

  d3.select("#traveltimes-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-7' align='left'>" +
      "<b>Motorway Travel Times</b>" +
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
      '</div>');

  d3.select("#rt-travelTimes").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/transport/car-w-15.svg" width="60">' +
      '</div>');


  d3.select("#rt-travelTimes").select("#card-right")
    .html("<div align='center'>" +
      '<h3>--</h3>' +
      '<p> </p>' +
      '</div>');

}


function updateTTDisplay(d__) {
  if (d__) {
    let ttAgeMins = Math.floor(((moment(new Date()) - timeSinceUpdate) / 1000) / 60);
    let ttAgeDisplay = ttAgeMins > 0 ? ttAgeMins + ' m ago' : 'just now';
    console.log("ages: " + ttAgeMins + '\t' + ttAgeDisplay);
    let name = d__.name.split('_')[0];
    let direction = d__.name.split('_')[1].split('B')[0];
    let info = "Longest current delay- travelling on the " +
      "<b>" + name + "</b> " + direction +
      " from <b>" + d__["from_name"] + "</b> to <b>" + d__["to_name"] + "</b>" +
      " is taking <b>" + d__.delay + " seconds</b> longer than with free-flowing traffic";
    updateInfo("#traveltimes-chart a", info);

    d3.select("#traveltimes-chart").select('.card__header')
      .html(
        "<div class = 'row'>" +
        "<div class = 'col-7' align='left'>" +
        "<b>Motorway Travel Times</b>" +
        "</div>" +
        "<div class = 'col-5' align='right'>" +
        'Latest: ' + ttAgeDisplay + "&nbsp;&nbsp;" +
        "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
        "</div>" +
        "</div>"
      );

    d3.select("#rt-travelTimes").select("#card-left")
      .html("<div align='center'>" +
        '<h3>' + name + '</h3>' +
        '<p>' + direction + '</p>' +
        '</div>');

    d3.select("#rt-travelTimes").select("#card-center")
      .html("<div align='center'>" +
        '<img src = "/images/transport/car-w-15.svg" width="60">' +
        '</div>');


    d3.select("#rt-travelTimes").select("#card-right")
      .html("<div align='center'>" +
        '<h3> ' + indicatorUpSymbol + ' ' +
        d__.delay + '</h3>' +
        '<p>seconds</p>' +
        '</div>');


  } else {
    updateInfo("#traveltimes-chart a", "Current travel times are close to free-flow times on all motorways");
  }
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

initialiseTTDisplay();
fetchTTData();