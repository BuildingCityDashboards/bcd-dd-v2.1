const getPlotObjectFig2 = async function () {
// Options for chart
  const srcPathFig2 = '../data/Stories/Housing/part_2/processed/E1071.csv'
  const titleFig2 = 'Housing Stock and Vacncy Rates 1991-2016'
  const divIDFig2 = 'vacant-housing-chart'

  let data = await d3.csv(srcPathFig2)

  const dataByRegion = d3.nest()
      .key((d) => {
        return d.region
      })
      .object(data)
  const regions = Object.keys(dataByRegion)
    //  console.log(regions)

    // traces for state count chart
  const stateTraces = []

  const stateVacantTrace = getTrace(dataByRegion, 'State', 'date', 'Vacant (Number)')
    // stateVacantTrace.text = stateVacantTrace.y.map(String)
  stateVacantTrace.name = 'State' + ' vacant houses'
  stateVacantTrace.type = 'line'
  stateVacantTrace.mode = 'lines+markers'
    // stateVacantTrace.fill = 'tozeroy'
  stateVacantTrace.marker = Object.assign({}, TRACES_DEFAULT.marker)
  stateVacantTrace.marker.color = CHART_COLORS_BY_REGION['State'] || 'grey'
  stateTraces.push(stateVacantTrace)

  const stateStockTrace = getTrace(dataByRegion, 'State', 'date', 'Total housing stock (Number)')
    // stateStockTrace.text = stateStockTrace.y.map(String)
  stateStockTrace.name = 'State' + ' total houses'
    // stateStockTrace.name = 'T'
  stateStockTrace.type = 'line'
  stateStockTrace.mode = 'lines+markers'
    // stateStockTrace.fill = 'tozeroy'
  stateStockTrace.marker = Object.assign({}, TRACES_DEFAULT.marker)
  stateStockTrace.marker.color = CHART_COLORS_BY_REGION['State'] || 'grey'
  stateTraces.push(stateStockTrace)

  function getTrace (data, key, xVar, yVar) {
    const trace = Object.assign({}, TRACES_DEFAULT)
    trace.x = dataByRegion[key].map((x) => {
      return x[xVar]
    })
    trace.y = dataByRegion[key].map((y) => {
      return y[yVar]
    })
      // -trace.hoverinfo = 'y'
    return trace
  }

    //  fillcolor Sets the fill color. Defaults to a half-transparent variant of the line color, marker color, or marker line color, whichever is available.
    //  stateStockTrace.fillcolor = CHART_COLORS_BY_REGION[regionName] || 'grey'

  const vacantRateTraces = []
  regions.forEach((regionName, i) => {
    const trace = Object.assign({}, TRACES_DEFAULT)
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v['Vacancy rate (%)']
    })

    trace.name = regionName // + ' vacant houses'
    trace.type = 'line'
    trace.mode = 'lines+markers'
      //  trace.stackgroup = 'one'

    CHART_COLORS_BY_REGION[trace.name] ? trace.opacity = 1.0 : trace.opacity = 0.5
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    vacantRateTraces.push(trace)
  })
    // This seems bad as it is order dependant
  const traces = stateTraces
      //  .concat(stockTraces)
      .concat(vacantRateTraces)
    //  console.log(traces)

    // Set default visible traces (i.e. traces on each chart)
  traces.map((t) => {
    if (t.name === 'State total houses' || t.name === 'State vacant houses') return t.visible = true
    else return t.visible = false
  })

    // Set layout options
  const layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig2
  layout.height = 500
  layout.showlegend = false
    // layout.barmode = 'relative'
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis.title)
  layout.xaxis.title.text = 'Census Years'
  layout.xaxis.range = [1990.85, 2016.15]
  layout.xaxis.tickmode = 'array'
  layout.xaxis.tickvals = [1991, 1996, 2002, 2006, 2011, 2016]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [0.1, 2100000]
    //  layout.yaxis.visible = false
  layout.yaxis.title = 'Units'
  layout.yaxis.tickmode = 'array'
  layout.yaxis.tickvals = [500000, 1000000, 1500000, 2000000]
  layout.yaxis.hoverformat = '.2s'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  // layout.margin = {
  //   l: 70,
  //   r: 210,
  //   t: 0, // button row
  //   b: 40
  // }
  // layout.yaxis.title.standoff = 10
    //  layout.hidesources = false

  const marginCount = 166
  const marginRate = 200
  layout.margin.r = marginCount

  const stateAnnotations = []
  const rateAnnotations = []

  stateTraces.forEach((trace, i) => {
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // TODO: function for this
      //  (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'
    stateAnnotations.push(annotation)
  })

  vacantRateTraces.forEach((trace) => {
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
    CHART_COLORS_BY_REGION[trace.name] ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'
    annotation.arrowcolor = 'transparent'
    rateAnnotations.push(annotation)
  })

    // set individual annotation stylings
  rateAnnotations[1].ay = -10 // DC
  rateAnnotations[2].ay = 5 // DLR
  rateAnnotations[3].ay = 10 // F
  rateAnnotations[5].ay = -5 // F
  rateAnnotations[7].ay = 10 // F

    //  rateAnnotations[2].ay = 0 // Nat

    // Set button menu
  const updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        visible: [true, true, false, false, false, false, false, false, false, false]
      },
        {
          // title: titleFig2,
          annotations: stateAnnotations,
          'yaxis.range': [0.1, 2100000],
          'yaxis.title': 'Units',
          'yaxis.tickmode': 'array',
          'yaxis.tickvals': [500000, 1000000, 1500000, 2000000],
          'yaxis.hoverformat': '.2s',
          'margin.r': marginCount
        }
      ],
      label: 'State Count',
      method: 'update'
        //  execute: true
    },
      {
        args: [{
          visible: [false, false, true, true, true, true, true, true, true, true]
        },
          {
          // title: titleFig2,
            annotations: rateAnnotations,
            'yaxis.range': [0.1, 16],
            'yaxis.tickmode': 'array',
            'yaxis.tickvals': [2.5, 5, 7.5, 10, 12.5, 15],
            'yaxis.title': '%',
            'yaxis.hoverformat': '.3r',
            'margin.r': marginRate
          }
        ],
        label: 'Vacancy % Rate',
        method: 'update',
        execute: true
      }
    ]
  })

  layout.updatemenus = updateMenus
  layout.annotations = stateAnnotations

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
      filename: 'Dublin Dashboard - ' + titleFig2,
      width: null,
      height: null,
      format: 'png'
    }
  }
  const plotObject = {
    traces: traces,
    layout: layout,
    options: plotOptions
  }
    // console.log(plotObject)
  return plotObject
}

export { getPlotObjectFig2 }
