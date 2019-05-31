let render = function(template, node) {
  if (!node) return;
  node.innerHTML = (typeof template === 'function' ? template() : template);
  var event = new CustomEvent('elementRenders', {
    bubbles: true
  });
  node.dispatchEvent(event);
  return node;
};

let dateShort = d3.timeFormat("%a, %B %d");

var tick = function() {
  render("<div class = 'row'>" +
    "<div class = 'col-12' align='center'>" +
    '<h2>' + new Date().toLocaleTimeString() + '</h2>' +
    '<p>' + dateShort(new Date()) + '</p>' +
    "</div>" +
    "</div>", document.querySelector('#time-chart').querySelector('#card-center'));
};

tick();
window.setInterval(tick, 1000);

// Timed refresh of map station markers symbology using data snapshot
// const timeCardTimer = setIntervalAsync(
//   () => {
//     return fetchData();
//   },
//   30000
// );

// function processtime(data_) {
//   let availabletime = 0,
//     availableStands = 0,
//     latestUpdate = 0;
//   //console.log("Bike data \n");
//   data_.forEach(function(d) {
//     if (d.available_time) {
//       availabletime += d.available_time;
//     }
//     if (d.available_bike_stands) {
//       availableStands += d.available_bike_stands;
//     }
//     //TODO: old school, use d3.max instead?
//     if (d.last_update) {
//       let lup = moment(d.last_update);
//       if (lup > latestUpdate) {
//         latestUpdate = lup;
//       }
//     }
//   });
//
//   updatetimeDisplay(availabletime, availableStands, latestUpdate);
// }
//
// function initialisetimeDisplay() {
//   let bikeTimeShort = d3.timeFormat("%a, %H:%M");
//
//   d3.select("#time-chart").select('.card__header')
//     .html(
//       "<div class = 'row'>" +
//       "<div class = 'col-6' align='left'>" +
//       "<b>Dublin time</b>" +
//       "</div>" +
//       "<div class = 'col-6' align='right'>" +
//       "Awaiting Data... &nbsp;&nbsp;" +
//       "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
//       "</div>" +
//       "</div>"
//     );
//
//   d3.select("#rt-time").select("#card-left")
//     .html("<div align='center'>" +
//       '<h3> ? </h3>' +
//       '<p>time</p>' +
//       '</div>');
//
//   d3.select("#rt-time").select("#card-center")
//     .html("<div align='center'>" +
//       '<img src = "/images/transport/bicycle-w-15.svg" width="60">' +
//       '</div>');
//
//
//   d3.select("#rt-time").select("#card-right")
//     .html("<div align='center'>" +
//       '<h3> ? </h3>' +
//       '<p> stands </p>' +
//       '</div>');
//
// }
//
// function updatetimeDisplay(ab, as, l) {
//   let bikeTimeShort = d3.timeFormat("%a, %H:%M");
//
//   d3.select("#time-chart").select('.card__header')
//     .html(
//       "<div class = 'row'>" +
//       "<div class = 'col-6' align='left'>" +
//       "<b>Dublin time</b>" +
//       "</div>" +
//       "<div class = 'col-6' align='right'>" +
//       bikeTimeShort(l) + " &nbsp;&nbsp;" +
//       "<img height='15px' width='15px' src='/images/clock-circular-outline-w.svg'>" +
//       "</div>" +
//       "</div>"
//     );
//
//   d3.select("#rt-time").select("#card-left")
//     .html("<div align='center'>" +
//       '<h3>' + ab + '</h3>' +
//       '<p>time</p>' +
//       '</div>');
//
//   d3.select("#rt-time").select("#card-center")
//     .html("<div align='center'>" +
//       '<img src = "/images/transport/bicycle-w-15.svg" width="60">' +
//       '</div>');
//
//
//   d3.select("#rt-time").select("#card-right")
//     .html("<div align='center'>" +
//       '<h3>' + as + '</h3>' +
//       '<p> stands </p>' +
//       '</div>');
//
//   // updateInfo("#time-chart a", "<b>Dublin time</b> is currently ");
//
// }

// function updateInfo(selector, infoText) {
//
//   let text = d3.select("#data-text p"),
//     textString = text.text();;
//
//   d3.select(selector)
//     .on("mouseover", (d) => {
//       text.html(infoText);
//     })
//     .on("mouseout", (d) => {
//       text.text(textString);
//     });
// }

// initialisetimeDisplay();
// fetchData(); //initial load