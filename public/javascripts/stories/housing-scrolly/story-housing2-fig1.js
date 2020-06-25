const getPlotObjectFig1 = async function () {
// Options for chart
  const srcPathFig1 = '../data/Housing/HPM06.csv'
  let titleFig1 = 'Monthly Property Price Index by Type 2005-2018'
  const divIDFig1 = 'ppi-monthly-chart'

  let data = await d3.csv(srcPathFig1)

  let dataByRegion = d3.nest()
      .key((d) => {
        return d['region']
      })
      .object(data)
  const regions = Object.keys(dataByRegion)
    // console.log(regions)

    // //traces for chart
  let houseTracesFig1 = []
  regions.forEach((regionName, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionName
    trace.mode = 'lines'
      // reassign colour to -defocus some traces
      ;(i < 1) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v.house
    })

    houseTracesFig1.push(trace)
  })

  let apartTracesFig1 = []
  regions.forEach((regionName, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionName
    trace.mode = 'lines'
      // reassign colour to -defocus some traces
      ;(i < 1) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v.apartments
    })

    apartTracesFig1.push(trace)
  })

  let allTracesFig1 = []
  regions.forEach((regionName, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionName
    trace.mode = 'lines'
      // reassign colour to -defocus some traces
      ;(i < 1) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v.all
    })

    allTracesFig1.push(trace)
  })

  let tracesFig1 = houseTracesFig1
      .concat(apartTracesFig1)
      .concat(allTracesFig1)

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig1
  layout.height = 500
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.title = 'Year-Month'
    // layout.xaxis.nticks = 7
  layout.xaxis.range = [0, 175]
  layout.xaxis.tickmode = 'array'
    // this changes the range manually in a categorical xaxis type - the values are indices in the trace x values
  layout.xaxis.tickvals = [0, 28, 56, 84, 112, 140, 168]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [0.1, 150]
  layout.yaxis.tickmode = 'array'
  layout.yaxis.tickvals = [25, 50, 75, 100, 125, 150]
    // layout.yaxis.visible = false
  layout.yaxis.title = 'PPI'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin = {
    l: 60,
    r: 140,
    b: 40,
    t: 0
  }
    // layout.hidesources = false

    // Set annotations per chart with config per trace
  let houseAnnotations = []

  houseTracesFig1.forEach((trace, i) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
      ;(i < 1) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
      ;(i < 1) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey' // magic number!!!
    annotation.arrowcolor = 'transparent'
    houseAnnotations.push(annotation)
  })

  let apartAnnotations = []
  apartTracesFig1.forEach((trace, i) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
      ;(i < 1) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
      ;(i < 1) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey' // magic number!!!
    annotation.arrowcolor = 'transparent'
    apartAnnotations.push(annotation)
  })

  let allAnnotations = []
  allTracesFig1.forEach((trace, i) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
      ;(i < 1) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
      ;(i < 1) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey' // magic number!!!
    annotation.arrowcolor = 'transparent'
    allAnnotations.push(annotation)
  })

    // //set individual annotation stylings
  apartAnnotations[0].ay = -7 // Dublin
  apartAnnotations[1].ay = 5 // Rest
  apartAnnotations[2].ay = 7 // Nat

  houseAnnotations[0].ay = 5 // Dublin
  houseAnnotations[1].ay = 10 // Rest
  houseAnnotations[2].ay = -10 // Nat

  allAnnotations[0].ay = -2 // Dublin
  allAnnotations[1].ay = 10 // Rest
  allAnnotations[2].ay = -15 // Nat

    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [true, true, true,
          false, false, false,
          false, false, false
        ]
      },
        {
            // 'title': titleFig1,
          'annotations': houseAnnotations

        }
      ],
      label: 'House',
      method: 'update',
      execute: true
    },
      {
        args: [{
          'visible': [false, false, false,
            true, true, true,
            false, false, false
          ]
        },
          {
              // 'title': titleFig1,
            'annotations': apartAnnotations
          }
        ],
        label: 'Apartment',
        method: 'update',
        execute: true
      },
      {
        args: [{
          'visible': [false, false, false,
            false, false, false,
            true, true, true
          ]
        },
          {
              // 'title': titleFig1,
            'annotations': allAnnotations

          }
        ],
        label: 'Both',
        method: 'update',
        execute: true
      }
    ]
  })

  layout.updatemenus = updateMenus

    // Set default visible traces (i.e. traces on each chart)
  tracesFig1.map((t, i) => {
    if (i < 3) return t.visible = true
    else return t.visible = false
  })
  layout.annotations = allAnnotations

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
      filename: 'Dublin Dashboard - ' + titleFig1,
      width: null,
      height: null,
      format: 'png'
    }
  }

  const plotObject = {
    traces: tracesFig1,
    layout: layout,
    options: plotOptions
  }
    // console.log(plotObject)
  return plotObject
}
