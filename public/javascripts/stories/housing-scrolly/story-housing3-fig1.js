import { getColourForLA } from '../../modules/bcd-style.js'

const getPlotObjectFig1 = async function () {
// Options for chart
  const srcPathFig1 = '../data/Stories/Housing/part_3/processed/ave_monthly_rent.csv'
  let titleFig1 = 'Average Price of Rent in Euros by Quarter-Year 2007-2018'
  const divIDFig1 = 'rent-prices-chart'

  let data = await d3.csv(srcPathFig1)

    // console.log(data);

  let traces = []
  traces.push(getTrace(data, 'date', 'Dublin'))
  traces.push(getTrace(data, 'date', 'State excl. Dublin'))

  function getTrace (data, xVar, yVar) {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = yVar
    trace.visible = true
      // trace.hoverinfo = 'y';
    trace.x = data.map((x) => {
      return x[xVar]
    })
    trace.y = data.map((y) => {
        // console.log(y[yVar]);
      return y[yVar]
    })
      // trace.connectgaps = true;
    trace.mode = 'lines+markers'
      // trace.name === 'state' ? trace.visible = true : trace.visible = true;
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.name === 'Dublin' ? trace.opacity = 1.0 : trace.opacity = 0.5
    trace.marker.color = getColourForLA(trace.name)
    return trace
  }

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig1;
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.nticks = 7
  layout.xaxis.title = 'Quarter-Year'
  layout.xaxis.range = [-0.2, 42.2]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [1, 2000]
    // layout.yaxis.visible = false;
  layout.yaxis.title = '€'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin = {
    l: 10,
    r: 150,
    t: 0, // button row
    b: 40
  }

  let annotations = []
  traces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = getColourForLA(trace.name)
    annotation.text = trace.name
    annotations.push(annotation)
  })
    // annotations[1].y = annotations[0].y + annotations[1].y

  layout.annotations = annotations

  let options = {
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
      filename: 'Dublin Dashboard - ' + titleFig1,
      width: null,
      height: null,
      format: 'png'
    }
  }

  const plotObject = {
    traces: traces,
    layout: layout,
    options: options
  }
  // console.log(plotObject)
  return plotObject
}

export { getPlotObjectFig1 }
