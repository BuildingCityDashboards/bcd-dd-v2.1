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

var tickClock = function() {
  render("<div class = 'row'>" +
    "<div class = 'col-12' align='center'>" +
    '<h2>' + new Date().toLocaleTimeString() + '</h2>' +
    '<p>' + dateShort(new Date()) + '</p>' +
    "</div>" +
    "</div>", document.querySelector('#time-chart').querySelector('#card-center'));
};

tickClock();
window.setInterval(tickClock, 1000);