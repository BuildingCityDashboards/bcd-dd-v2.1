const getPlotObjectFig5 = async function () {
// Options for chart
// TODO: pass these in as config and/or create accessor functions
  const srcPathFig5 = '../data/Stories/Housing/part_1/',
    srcFileFig5 = 'mortgage_debt.csv'
  const typesFig5 = ['Value of debt']
  const titleFig5 = 'Residential Mortgage Debt in Billions of Euros 2002-20017'
  const divIDFig5 = 'mortgage-debt-chart'

// @TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
// Want a better mechanism for page load that doesn't have to wait for all the data

  let data = await d3.csv(srcPathFig5 + srcFileFig5)
    // Traces
  let mortgageDebtTraces = []
  let trace = Object.assign({}, TRACES_DEFAULT)
  trace.name = data[0].type
  trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
  trace.hoverinfo = 'x+y'

  trace.x = data.map((v) => {
    return v.date
  })

  trace.y = data.map((v) => {
    return v.value / 1000000000
  })

  mortgageDebtTraces.push(trace)

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig5;
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.range = [2001.98, 2007.02]
  layout.xaxis.title = 'Year'
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [0, 175]
  layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title)
  layout.yaxis.titlefont = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.titlefont)
  layout.yaxis.titlefont.size = 16 // bug? need to call this
  layout.yaxis.tickmode = 'array'
  layout.yaxis.tickvals = [50, 100, 150]
    // layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title);
  layout.yaxis.title.text = '€bn'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin.r = 32
  layout.margin.t = 0

    /*
    layout.margin = {
      l: 60,
      r: 185, //annotations space
      t: 40
    };
    */
    // layout.hidesources = false;

  let mortgageDebtAnnotations = []
  mortgageDebtTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[3]
    annotation.y = trace.y[3]
    // annotation.width = 100
    // annotation.align = 'right'
    // annotation.xshift = -200
    annotation.yshift = -48
    annotation.text = trace.name
    annotation.font.color = CHART_COLORWAY[i]
    mortgageDebtAnnotations.push(annotation)
  })

    // Set default view annotations
  layout.annotations = mortgageDebtAnnotations // set default

  let plotOptions = {
    modeBar: {
      orientation: 'v',
      bgcolor: 'black',
      color: null,
      activecolor: null
    },
    modeBarButtons: [
      ['toImage']
    ],
    displayModeBar: true,
    displaylogo: false,
    showSendToCloud: false,
    responsive: true,
    toImageButtonOptions: {
      filename: 'Dublin Dashboard - ' + titleFig5,
      width: null,
      height: null,
      format: 'png'
    }
  }

  const plotObject = {
    traces: mortgageDebtTraces,
    layout: layout,
    options: plotOptions
  }

  return plotObject
}

export { getPlotObjectFig5 }
