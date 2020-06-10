/**
 *
 *
 * @param {}
 * @return {}
 *
 *
 */

// TODO:
// load page metadata for n narrative objects and n charts
// load n chart plot objects into array
// draw chart based on TwoStep interaction

(async () => {
// init a blank plot
// TODO: replace with spinner/ loading progress
  Plotly.newPlot('chart-sticky-housing-1', {}, {}, {})
  let plotObjects = []
  let plotObject = await getPlotObjectFig1()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig2()
  plotObjects.push(plotObject)

  const drawPlot = async (event) => {
    console.log('Waypoint ' + JSON.stringify(event) + ' triggered')
    if (event.index >= 0 && event.index < plotObjects.length) {
      Plotly.newPlot('chart-sticky-housing-1', plotObjects[event.index].traces, plotObjects[event.index].layout, plotObjects[event.index].options)
    }
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

