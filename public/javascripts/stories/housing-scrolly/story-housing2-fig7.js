const getPlotObjectFig7 = async function () {
// Options for chart
  const srcPathFig7 = '../data/Stories/Housing/part_2/processed/social_housing_wait_list.csv'
  let titleFig7 = 'Social Housing Waiting List by Region 2005-2018'
  const divIDFig7 = 'social-housing-wait-chart'

  let data = await d3.csv(srcPathFig7)

  const regionsFig7 = [...REGIONS_ORDERED_DUBLIN]
  regionsFig7.push('National')
  const marginRNat = 75
  const marginRDub = 230
  const marginRBoth = 230

  let traces = []

  regionsFig7.forEach((region) => {
    traces.push(getTrace(data, 'date', region))
  })

  function getTrace (data, xVar, yVar) {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = yVar
    trace.x = data.map((x) => {
      return x[xVar]
    })
    trace.y = data.map((y) => {
      return y[yVar]
    })
    trace.connectgaps = true
    trace.mode = 'lines+markers'
    trace.name === 'National' ? trace.visible = true : trace.visible = false
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'
    return trace
  }

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig7;
  // layout.height = 500
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.title = 'Year'
  layout.xaxis.nticks = 6
  layout.xaxis.range = [1990.85, 2018.15]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [1, 100000]
    // layout.yaxis.visible = false;
  layout.yaxis.title = 'People'
  layout.yaxis.hoverformat = ',d'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin.r = marginRNat
  // {
  //   l: 75,
  //   r: marginRNat,
  //   t: 0, // button row
  //   b: 40
  // }
  //   // // layout.hidesources = false;

    // Set annotations per chart with config per trace
  let nationalAnnotations = []
  let dublinAnnotations = []
  let bothAnnotations = []

  traces.forEach((trace) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey' // magic number!!!

    trace.name === 'National' ? annotation.opacity = 0.75 : annotation.opacity = 1.0
    trace.name === 'National' ? nationalAnnotations.push(annotation) : dublinAnnotations.push(annotation)
    bothAnnotations.push(Object.assign({}, annotation))
  })

  bothAnnotations[0].yshift = 0 // Dublin C
  bothAnnotations[1].yshift = -7 // DLR
  bothAnnotations[2].yshift = 10 // F
  bothAnnotations[3].yshift = 0 // SDCC

    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [false, false, false, false, true]
      },
        {
              // 'title': titleFig7,
          'annotations': nationalAnnotations,
          'margin.r': marginRNat,
          'yaxis.range': [1, 100000],
          'xaxis.range': [1990.85, 2018.15]
        }
      ],
      label: 'National',
      method: 'update'
          // execute: true
    },
      {
        args: [{
          'visible': [true, true, true, true, false]
        },
          {
              // 'title': titleFig7,
            'annotations': dublinAnnotations,
            'margin.r': marginRDub,
            'yaxis.range': [1, 21000],
            'xaxis.range': [1992.85, 2018.15]
          }
        ],
        label: 'Dublin',
        method: 'update'
          // execute: true
      },
      {
        args: [{
          'visible': [true, true, true, true, true]
        },
          {
              // 'title': titleFig7,
            'annotations': bothAnnotations,
            'margin.r': marginRDub,
            'yaxis.range': [1, 100000],
            'xaxis.range': [1990.85, 2018.15]
          }
        ],
        label: 'Both',
        method: 'update'
          // execute: true
      }
    ]
  })

  layout.updatemenus = updateMenus
  layout.annotations = nationalAnnotations

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
      filename: 'Dublin Dashboard - ' + titleFig7,
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

export { getPlotObjectFig7 }
