let weatherInterval = 1000 * 30;
let weatherCountdown = weatherInterval;
const fetchWeatherData = function() {
  d3.xml("/api/weather")
    .then((data) => {
      //console.log("Fetched Weather card data ");
      processWeather(data);
    })
    .catch(function(err) {
      //console.error("Error fetching Weather card data: " + JSON.stringify(err));
      initialiseWeatherDisplay();
    })
}

// Timed refresh of map station markers symbology using data snapshot
const weatherCardTimer = setIntervalAsync(
  () => {
    return fetchWeatherData();
  },
  weatherInterval
);

function processWeather(xmlWeather) {
  let modelXML = xmlWeather.getElementsByTagName("model");
  let forecastTime = moment(modelXML[0].getAttribute("runended")).fromNow();
  //console.log("forecastTime: " + JSON.stringify(forecastTime));

  let timesXML = xmlWeather.getElementsByTagName("time");
  // console.log("#timesXML: " + timesXML.length);
  //use index in loop to track odd/even entry
  let forecasts = []; //array of objects
  let id = 0;
  /*TODO: fix hack*/
  for (let i = 0; i < 4; i += 2) {
    let from, startDate, locationEven, lat, lng, temp, humidity, windDir, windSpeed,
      locationOdd, symbolId, symbolNo, precip;
    //console.log("TIME #" + i);
    from = timesXML[i].getAttribute("from");
    startDate = new Date(from);
    //console.log("from: " + from);
    locationEven = timesXML[i].getElementsByTagName("location")[0];
    lat = locationEven.getAttribute("latitude");
    //console.log("lat: " + lat);
    lng = locationEven.getAttribute("longitude");
    //console.log("lng: " + lng);
    temp = locationEven.getElementsByTagName("temperature")[0].getAttribute("value");
    //console.log("temp : " + temp);
    humidity = locationEven.getElementsByTagName("humidity")[0].getAttribute("value");
    //console.log("humidity : " + humidity);
    windDir = locationEven.getElementsByTagName("windDirection")[0].getAttribute("name");
    //console.log("windDir : " + windDir);
    windSpeed = locationEven.getElementsByTagName("windSpeed")[0].getAttribute("beaufort");
    //console.log("i : " + i);
    //console.log("windspeed : " + windSpeed);
    //Odd entries
    locationOdd = timesXML[i + 1].getElementsByTagName("location")[0];
    //console.log("location odd: " + JSON.stringify(locationOdd.getElementsByTagName("symbol")[0]));
    symbolId = locationOdd.getElementsByTagName("symbol")[0].getAttribute("id");
    //console.log("symbol ID: " + symbolId);
    symbolNo = locationOdd.getElementsByTagName("symbol")[0].getAttribute("number");
    //console.log("symbol #" + symbolNo);
    symbolNo = +symbolNo;
    if (symbolNo < 10) {
      symbolNo = "0" + symbolNo; //pad with a zero
    }
    //console.log("date: "+startDate+" start hour: "+startDate.getHours());
    //decide if night or day based on hour
    ///*TODO: Crude! Improve!*/
    if (startDate.getHours() > 18 || startDate.getHours() < 6) {
      tod = 'n';
    } else {
      tod = 'd';
    }
    precip = locationOdd.getElementsByTagName("precipitation")[0].getAttribute("value");
    //console.log("precip #" + precip);
    //
    //Only use the next 48 hourly readings
    /*TODO: Better algo to decide if readings are to be used/ are valid*/
    if (id < 48) {
      forecasts.push({
        "id": id,
        "date": startDate,
        "temperature": temp,
        "humidity": humidity,
        "windDir": windDir,
        "windSpeed": windSpeed,
        "symbolNo": symbolNo,
        "symbolId": symbolId,
        "precip": precip,
        "tod": tod

      });
    }
    id += 1;
  }
  updateWeatherDisplay(forecasts, forecastTime);
};

function initialiseWeatherDisplay() {

  d3.select("#weather-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-7' align='left'>" +
      "Weather Forecast" +
      "</div>" +
      "<div class = 'col-5' align='right'>" +
      "<div id ='weather-countdown' ></div>" +
      // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );

  d3.select("#rt-weather").select("#card-left")
    .html("<div align='center'>" +
      '<h3>-- C</h3>' +
      '<p>Prec -- mm</p>' +
      '</div>');

  d3.select("#rt-weather").select("#card-center")
    .html("<div align='center'>" +
      '<h2>--</h2>' +
      '</div>');


  d3.select("#rt-weather").select("#card-right")
    .html("<div align='center'>" +
      '<h3>-- </h3>' +
      '<p>-- mps</p>' +
      '</div>');
}

function updateWeatherDisplay(f, fTime) {

  let fTimeDisplay;
  if (fTime.includes("minutes")) {
    fTimeDisplay = fTime.replace(" minutes", "m");
  } else if (fTime.includes("minute")) {
    fTimeDisplay = fTime.replace(" minute", "m");
  } else if (fTime.includes("hours")) {
    fTimeDisplay = fTime.replace(" hours", "h");
  } else if (fTime.includes("hour")) {
    fTimeDisplay = fTime.replace("an hour", "1h");
  } else {
    fTimeDisplay = fTimeDisplay = "earlier";
  }


  let weatherTime = d3.timeFormat("%a %_I%p");
  d3.select("#weather-chart").select('.card__header')
    .html(
      "<div class = 'row'>" +
      "<div class = 'col-7' align='left'>" +
      "Weather " + weatherTime(f[0].date) +
      "</div>" +
      "<div class = 'col-5' align='right'>" +
      fTimeDisplay +
      // "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
      "</div>" +
      "</div>"
    );

  d3.select("#rt-weather").select("#card-left")
    .html("<div align='center'>" +
      '<h3>' + parseInt(f[0].temperature) + ' C</h3>' +
      '<p>Prec ' + f[0].precip + ' mm</p>' +
      '</div>');

  d3.select("#rt-weather").select("#card-center")
    .html("<div align='center'>" +
      '<img src = "/images/Met50v2/' + f[0].symbolNo + f[0].tod + '.png" width="60">' +
      '</div>');


  d3.select("#rt-weather").select("#card-right")
    .html("<div align='center'>" +
      '<h3>' +
      '<img src = "/images/Met50v2/15d.png" width="20">' +
      ' ' + f[0].windDir + '</h3>' +
      '<p>' + parseInt(f[0].windSpeed) + ' mps</p>' +
      '</div>');

  updateInfo("#weather-chart a", "<b>Met Eireann</b> weather forecast for <b>" +
    weatherTime(f[0].date) +
    " </b> is for a temperature of " + parseInt(f[0].temperature) + "C with " +
    f[0].windDir + " winds of " + parseInt(f[0].windSpeed) + ' mps, ' +
    f[0].symbolId + " with " +
    parseInt(f[0].humidity) + "% humidity. Predicted precipitation is " +
    parseInt(f[0].precip) + " mm.");

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

setInterval(function() {
  weatherCountdown -= 1000;
  let cd = weatherCountdown / 1000;
  d3.select('#weather-countdown').text("Update in " + cd);

  if (weatherCountdown < 1000) {
    weatherCountdown = weatherInterval;
  }
}, 1000);

fetchWeatherData();
initialiseWeatherDisplay();