let render = function (template, node) {
  if (!node) return
  node.innerHTML = (typeof template === 'function' ? template() : template)
  var event = new CustomEvent('elementRenders', {
    bubbles: true
  })
  node.dispatchEvent(event)
  return node
}

var tickClock = function () {
  let dNew = new Date()

  // console.log("New date: " + dNew);

  let d = dNew.toLocaleTimeString('en-GB', timeOptions).replace(/I/, 'G').split('G')[0]

  d = d.replace(/,/g, '')
  // console.log(`d: ${d}`)
  let day = d.split(' ')[0]
  let date = d.split(' ')[1]
  let month = d.split(' ')[2]
  let time = d.split(' ')[3]
  // let meridian = d.split(',')[2].split(' ')[1];

  // console.log('Local time: ' + d)
  render(`${time}<br>`, document.getElementById('hero-time__clock'))
  render(`${day} ${date} ${month}`, document.getElementById('hero-time__date'))
}

let timeOptions = {
  timeZone: 'Europe/Dublin',
  timeZoneName: 'short',
  hour12: false,
  weekday: 'short',
  month: 'short',
  day: 'numeric'

}

tickClock()
window.setInterval(tickClock, 1000)
