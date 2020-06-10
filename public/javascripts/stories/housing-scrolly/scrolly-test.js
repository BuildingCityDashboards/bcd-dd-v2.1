(async () => {
  const drawPlot = async (event) => {
    console.log('Waypoint ' + event.index + ' triggered')
    let plotObject = await getPlotObject()
    console.log(plotObject)
    Plotly.newPlot('chart-sticky-housing-1', plotObject.traces, plotObject.layout, plotObject.options)
  // var newData = getData(event.index)
  // desktopChart.series[0].setData(newData)
  }

  var ts = new TwoStep({
    elements: document.querySelectorAll('.narrative-item'),
    onChange: drawPlot,
    stick: document.querySelector('.rightcol')
  })

// TODO: remove jQ
  function checkSize () {
    // if desktop...
    if ($(window).width() > 700) {
      ts.enable()
    // if mobile...
    } else {
      ts.disable()
    }
  }

// Check current screen size
// and set up event listener for future changes
  checkSize()
  $(window).resize(checkSize)
})()

