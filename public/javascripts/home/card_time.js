let render = function(template, node) {
  if (!node) return;
  node.innerHTML = (typeof template === 'function' ? template() : template);
  var event = new CustomEvent('elementRenders', {
    bubbles: true
  });
  node.dispatchEvent(event);
  return node;
};

let dateShort = d3.timeFormat("%A, %B %d");

var tickClock = function() {
  let d = new Date();
  let ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  let hour12 = (d.getHours() % 12) == 0 ? '12' : d.getHours() % 12;
  render("<div class = 'row'>" +
    "<div class = 'col-1 card-div'>" +
    "</div>" +
    "<div class = 'col-2 card-div' style='text-align:right' >" +
    '<h2>' + hour12 + '</h2>' +
    "</div>" +
    "<div class = 'col-1 card-div'><h2>:</h2>" +
    "</div>" +
    "<div class = 'col-2 card-div'>" +
    '<h2>' + d.getMinutes().toString().padStart(2, '0') + '</h2>' +
    "</div>" +
    "<div class = 'col-1 card-div'><h2>:</h2>" +
    "</div>" +
    "<div class = 'col-2 card-div'>" +
    '<h2>' + d.getSeconds().toString().padStart(2, '0') + '</h2>' +
    "</div>" +
    "<div class = 'col-2 card-div'>" +
    "<h3>" + ampm + "</h3>" +
    "</div>" +
    "<div class = 'col-1 card-div'>" +
    "</div>" +
    "<div class = 'col-12 card-div'>" +
    '<p>' + dateShort(new Date()) + '</p>' +
    "</div>" +
    "</div>", document.querySelector('#time-chart').querySelector('#card-center'));
};

tickClock();
window.setInterval(tickClock, 1000);