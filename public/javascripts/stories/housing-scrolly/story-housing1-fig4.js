const getPlotObjectFig4 = async function () {
// Options for chart
// TODO: pass these in as config and/or create accessor functions
  const srcPathFig4 = '../data/Stories/Housing/part_1/',
    srcFileFig4 = 'propertyprices.csv'
  const typesFig4 = ['National New', 'National Second Hand', 'Dublin New', 'Dublin Second Hand']
  const titleFig4 = 'Property Prices By Type 1975-2016'
  const divIDFig4 = 'property-price-growth-chart'

// @TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
// Want a better mechanism for page load that doesn't have to wait for all the data

  let data = await d3.csv(srcPathFig4 + srcFileFig4)
    // Data per type- use the array of type variable values
  let dataByType = []
  typesFig4.forEach((typeName) => {
    dataByType.push(data.filter((v) => {
      return v.type === typeName
    }))
  })

    // Traces
    // traces for chart a
  let chartTraces = []
  dataByType.forEach((typeData, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = typeData[0].type;
      // reassign colour to -defocus some traces
    (i > 1) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    (i > 1) ? trace.marker.color = null : trace.marker.color = 'grey' // magic number!!!
    trace.marker.opacity = 1
    trace.x = typeData.map((v) => {
      return v.date
    })

    trace.y = typeData.map((v) => {
      return v.value
    })
    chartTraces.push(trace)
  })

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig4;
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.range = [1974.8, 2016.2]
  layout.xaxis.title = 'Year'
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title)
  layout.yaxis.title.text = '€'
  layout.yaxis.title.standoff = 16
  layout.yaxis.fixedrange = false
  layout.yaxis.range = [1, 520000]
  layout.yaxis.hoverformat = ',d'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  // layout.margin = {
  //   l: 20,
  //   r: 180, // annotations space
  //   b: 40, // x axis tooltip
  //   t: 0 // button row
  // }

    // layout.hidesources = false;

  let chartAnnotations = []
  chartTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name;
      // de-focus some annotations
      // TODO: function for this
    (i > 1) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    (i > 1) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey' // magic number!!!

      // console.log(annotation.font.color);
    chartAnnotations.push(annotation)
  })

    // Set default view annotations
  layout.annotations = chartAnnotations // set default

  let plotOptions = {
    modeBar: {
      orientation: 'v',
      bgcolor: 'black',
      color: null,
      activecolor: null
    },
    modeBarButtons: MULTILINE_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
    displayModeBar: true,
    displaylogo: false,
    showSendToCloud: false,
    responsive: true,
    toImageButtonOptions: {
      filename: 'Dublin Dashboard - ' + titleFig4,
      width: null,
      height: null,
      format: 'png'
    }
  }

  const plotObject = {
    traces: chartTraces,
    layout: layout,
    options: plotOptions
  }

  return plotObject
}

export { getPlotObjectFig4 }
