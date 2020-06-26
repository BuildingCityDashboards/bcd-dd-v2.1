const getPlotObjectFig4 = async function () {
// Options for chart
// TODO: pass these in as config and/or create accessor functions
  const srcPathFig4a = '../data/Stories/Housing/part_2/processed/serviced_land_hectares.csv'
  const srcPathFig4b = '../data/Stories/Housing/part_2/processed/serviced_land_expected_units.csv'
  const regionsFig4 = ['Dublin City', 'Dún Laoghaire-Rathdown', 'Fingal', 'South Dublin', 'Kildare', 'Meath', 'Wicklow']
  const titleFig4 = 'Serviced Land in Dublin and Surrounding Areas 1991-2016'

  let data = []
  let d1 = await d3.csv(srcPathFig4a)
  let d2 = await d3.csv(srcPathFig4b)
  data.push(d1)
  data.push(d2)

  let tracesHectares = []
  let tracesExpectedUnits = []
    // regionsFig4.push("state");
  regionsFig4.forEach((region) => {
    tracesHectares.push(getTrace(data[0], 'date', region))
    tracesExpectedUnits.push(getTrace(data[1], 'date', region))
  })

  function getTrace (data, xVar, yVar) {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = yVar
    trace.visible = true
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
    REGIONS_ORDERED_DUBLIN.includes(trace.name) ? trace.opacity = 1.0 : trace.opacity = 0.5
    trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'
    return trace
  }
    //
    //
    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig4;
  layout.height = 500
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.title = 'Year'
  layout.xaxis.range = [1999.9, 2012.1]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [1, 1520]
  layout.yaxis.title = 'Hectares'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin = {
    l: 75,
    r: 210,
    t: 0, // button row
    b: 40
  }
  let annotationsHectares = []
  tracesHectares.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name;
      // de-focus some annotations
      // TODO: function for this
    (i < 4) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    (i < 4) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey' // magic number!!!

      // console.log(annotation.font.color);
    annotationsHectares.push(annotation)
  })

    // set individual annotation stylings
  annotationsHectares[0].yshift = 8 // DC
  annotationsHectares[1].yshift = 0 // DLR
  annotationsHectares[2].yshift = -10 // Fingal
  annotationsHectares[3].yshift = -4 // SD
  annotationsHectares[4].yshift = 6 // K
  annotationsHectares[5].yshift = -12 // M
  annotationsHectares[6].yshift = -5 // W

  let annotationsExpectedUnits = []
  tracesExpectedUnits.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name;
      // de-focus some annotations
      // TODO: function for this
    (i < 4) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    (i < 4) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey' // magic number!!!

      // console.log(annotation.font.color);
    annotationsExpectedUnits.push(annotation)
  })

  layout.annotations = annotationsHectares
    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [true, true, true, true, true, true, true,
          false, false, false, false, false, false, false
        ]
      },
        {
          'annotations': annotationsHectares,
              // 'title': titleFig4,
          'yaxis.range': [1, 1520],
          'yaxis.title': 'Hectares'
        }
      ],
      label: 'Land Area',
      method: 'update',
      execute: true
    },
      {
        args: [{
          'visible': [false, false, false, false, false, false, false,
            true, true, true, true, true, true, true
          ]
        },
          {
            'annotations': annotationsExpectedUnits,

              // 'title': titleFig4,
            'yaxis.range': [10, 70000],
            'yaxis.title': 'Units',
            'yaxis.hoverformat': ',d'
          }
        ],
        label: 'Expected Units',
        method: 'update',
        execute: true
      }
    ]
  })

  layout.updatemenus = updateMenus

  let traces = tracesHectares
      .concat(tracesExpectedUnits)

    // Set default visible traces (i.e. traces on each chart)
  traces.map((t, i) => {
    if (i < 7) return t.visible = true
    else return t.visible = false
  })

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
    traces: traces,
    layout: layout,
    options: plotOptions
  }

  return plotObject
}
