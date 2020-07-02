const getPlotObjectFig2 = async function () {
// Options for chart
  const srcPathFig2a = '../data/Stories/Housing/part_3/processed/homeless_figures_parsed.csv'
  const srcPathFig2b = '../data/Stories/Housing/part_3/processed/drhe_homelessness.csv'
  let titleFig2 = 'Families in Emergency Accommodation in Dublin 2014-2018'
  const divIDFig2 = 'homelessness-chart'

  let data = []
  let d1 = await d3.csv(srcPathFig2a)
  let d2 = await d3.csv(srcPathFig2b)
  data.push(d1)
  data.push(d2)

  let traces = []
  traces.push(getTrace(data[0], 'date', 'Individual adults'))
  traces.push(getTrace(data[0], 'date', 'Dependents'))

  traces.push(getTrace(data[1], 'date', 'Hotels and B&Bs'))
  traces.push(getTrace(data[1], 'date', 'All Other Accommodation'))

  function getTrace (data, xVar, yVar) {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = yVar
    trace.stackgroup = 'one'
    trace.visible = true
    trace.hoverinfo = 'x+y'
    trace.x = data.map((x) => {
      return x[xVar]
    })
    trace.y = data.map((y) => {
      return +y[yVar]
    })
      // trace.connectgaps = true;
    trace.mode = 'lines+markers'
    return trace
  }
  traces[2].visible = false
  traces[3].visible = false

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig2;
  // // layout.height = 500
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
    // layout.xaxis.nticks = 7;
  layout.xaxis.title = 'Month-Year'
  layout.xaxis.range = [-0.3, 53.2]
  layout.xaxis.tickmode = 'array'
  layout.xaxis.tickvals = [7, 19, 31, 43]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [1, 5000]
    // layout.yaxis.visible = false;
  layout.yaxis.title = 'No. of people homeless'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  // layout.margin = {
  //   l: 80,
  //   r: 220,
  //   t: 0, // button row
  //   b: 40
  // }
  layout.colorway = CHART_COLORWAY_VARIABLES

  let annotationsCount = []
  let annotationsType = []
  traces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name.split('Rev')[0]
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORWAY_VARIABLES[i % 2] // Is this order smae as fetching from object in trace?
    annotation.text = trace.name
    if (i < 2) {
      annotationsCount.push(annotation)
    } else {
      annotationsType.push(annotation)
    }
  })
  annotationsCount[1].y = annotationsCount[0].y + annotationsCount[1].y
  annotationsType[1].y = annotationsType[0].y + annotationsType[1].y

  layout.annotations = annotationsCount

    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [true, true, false, false]
      },
        {
              // 'title': titleFig2,
          'yaxis.title': 'People',
          'annotations': annotationsCount,
              // 'margin.r': marginRUnauth,
          'yaxis.range': [1, 5000],
          'xaxis.range': [-0.3, 53.3]
        }
      ],
      label: 'Individuals and Dependents',
      method: 'update'
          // execute: true
    },
      {
        args: [{
          'visible': [false, false, true, true]
        },
          {
              // 'title': titleFig2,
            'yaxis.title': 'Families',
            'annotations': annotationsType,
              // 'margin.r': marginRAccom,
            'yaxis.range': [1, 1500],
            'xaxis.range': [-0.3, 50.3]
              // 'yaxis.nticks': 3
          }
        ],
        label: 'Families By Accomodation Type',
        method: 'update'
          // execute: true
      }
    ]
  })

  layout.updatemenus = updateMenus

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
      filename: 'Dublin Dashboard - ' + titleFig2,
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

export { getPlotObjectFig2 }
