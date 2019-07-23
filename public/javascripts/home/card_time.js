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
  let dNew = new Date();

  // console.log("New date: " + dNew);
  let options = {
    timeZone: 'Europe/Dublin',
    timeZoneName: 'short',
    hour12: true,
    weekday: 'short',
    month: 'short',
    day: 'numeric'

  };
  let d = dNew.toLocaleTimeString('en-GB', options).split('G')[0];
  // console.log("Local time: " + d);
  render(`${d}`, document.getElementById('clock'));

};

tickClock();
window.setInterval(tickClock, 1000);