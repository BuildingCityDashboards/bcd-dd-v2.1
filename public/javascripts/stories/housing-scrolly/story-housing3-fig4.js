const getPlotObjectFig4 = async function () {
// Options for chart
  const srcPathFig4 = '../data/Stories/Housing/part_3/processed/airbnb_counts.csv'
  let titleFig4 = ''
  const divIDFig4 = 'airbnb_counts_chart'

  let data = await d3.csv(srcPathFig4)

  let dataByRegion = d3.nest()
      .key((d) => {
        return d['region']
      })
      .object(data)
  const regions = Object.keys(dataByRegion)
    // console.log(regions)

    // //traces for chart
  let propertiesTracesFig4 = []
  regions.forEach((regionName, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionName
    trace.mode = 'lines+markers'
      // reassign colour to -defocus some traces
      ;(i < 4) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    trace.connectgaps = true
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v.properties
    })

    trace.x.splice(1, 0, '2016-Feb', '2016-Mar', '2016-Apr', '2016-May', '2016-Jun', '2016-Jul')
    trace.y.splice(1, 0, null, null, null, null, null, null)
    trace.x.splice(8, 0, '2016-Sep', '2016-Oct', '2016-Nov', '2016-Dec', '2017-Jan')
    trace.y.splice(8, 0, null, null, null, null, null)
    trace.x.splice(14, 0, '2017-Mar', '2017-Apr', '2017-May', '2017-Jun', '2017-Jul', '2017-Aug', '2017-Sep', '2017-Oct', '2017-Nov', '2017-Dec', '2018-Jan', '2018-Feb', '2018-Mar')
    trace.y.splice(14, 0, null, null, null, null, null, null, null, null, null, null, null, null, null)
    trace.x.splice(29, 0, '2018-Jun')
    trace.y.splice(29, 0, null)
    propertiesTracesFig4.push(trace)
  })

  let availabilityTracesFig4 = []
  regions.forEach((regionName, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionName
    trace.mode = 'lines+markers'
      // reassign colour to -defocus some traces
      ;(i < 4) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    trace.connectgaps = true
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v['available days per year']
    })

    trace.x.splice(1, 0, '2016-Feb', '2016-Mar', '2016-Apr', '2016-May', '2016-Jun', '2016-Jul')
    trace.y.splice(1, 0, null, null, null, null, null, null)
    trace.x.splice(8, 0, '2016-Sep', '2016-Oct', '2016-Nov', '2016-Dec', '2017-Jan')
    trace.y.splice(8, 0, null, null, null, null, null)
    trace.x.splice(14, 0, '2017-Mar', '2017-Apr', '2017-May', '2017-Jun', '2017-Jul', '2017-Aug', '2017-Sep', '2017-Oct', '2017-Nov', '2017-Dec', '2018-Jan', '2018-Feb', '2018-Mar')
    trace.y.splice(14, 0, null, null, null, null, null, null, null, null, null, null, null, null, null)
    trace.x.splice(29, 0, '2018-Jun')
    trace.y.splice(29, 0, null)
    availabilityTracesFig4.push(trace)
  })

  let perHostTracesFig4 = []
  regions.forEach((regionName, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionName
    trace.mode = 'lines+markers'
      // reassign colour to -defocus some traces
      ;(i < 4) ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
    trace.connectgaps = true
    trace.x = dataByRegion[regionName].map((v) => {
      return v.date
    })

    trace.y = dataByRegion[regionName].map((v) => {
      return v['properties per host']
    })

    trace.x.splice(1, 0, '2016-Feb', '2016-Mar', '2016-Apr', '2016-May', '2016-Jun', '2016-Jul')
    trace.y.splice(1, 0, null, null, null, null, null, null)
    trace.x.splice(8, 0, '2016-Sep', '2016-Oct', '2016-Nov', '2016-Dec', '2017-Jan')
    trace.y.splice(8, 0, null, null, null, null, null)
    trace.x.splice(14, 0, '2017-Mar', '2017-Apr', '2017-May', '2017-Jun', '2017-Jul', '2017-Aug', '2017-Sep', '2017-Oct', '2017-Nov', '2017-Dec', '2018-Jan', '2018-Feb', '2018-Mar')
    trace.y.splice(14, 0, null, null, null, null, null, null, null, null, null, null, null, null, null)
    trace.x.splice(29, 0, '2018-Jun')
    trace.y.splice(29, 0, null)
    perHostTracesFig4.push(trace)
  })

  let traces = propertiesTracesFig4
      .concat(availabilityTracesFig4)
      .concat(perHostTracesFig4)

    // Set layout options
  let layout = Object.assign({}, MULTILINE_CHART_LAYOUT)
  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig4
  layout.height = 500
  layout.showlegend = false
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.title = 'Year-Month'
    // layout.xaxis.nticks = 7
  layout.xaxis.range = [-0.3, 50.3]
  layout.xaxis.tickmode = 'array'
    // this changes the range manually in a categorical xaxis type - the values are indices in the trace x values
  layout.xaxis.tickvals = [0, 12, 24, 36, 48]
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.range = [0, 8001]
  layout.yaxis.tickmode = 'array'
  layout.yaxis.tickvals = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]
    // layout.yaxis.visible = false
  layout.yaxis.title = 'Properties'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin = {
    l: 90,
    r: 210,
    b: 40,
    t: 0
  }
    // layout.hidesources = false

    // Set annotations per chart with config per trace
  let propertyAnnotations = []

  propertiesTracesFig4.forEach((trace, i) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
      ;(i < 4) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
      ;(i < 4) ? annotation.font.color = CHART_COLORS_BY_REGION[trace.name] : annotation.font.color = 'grey' // magic number!!!
    annotation.arrowcolor = 'transparent'
    propertyAnnotations.push(annotation)
  })

  let availabilityAnnotations = []
  availabilityTracesFig4.forEach((trace, i) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
      ;(i < 4) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
      ;(i < 4) ? annotation.font.color = CHART_COLORS_BY_REGION[trace.name] : annotation.font.color = 'grey' // magic number!!!
    annotation.arrowcolor = 'transparent'
    availabilityAnnotations.push(annotation)
  })

  let perHostAnnotations = []
  perHostTracesFig4.forEach((trace, i) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
      ;(i < 4) ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
      ;(i < 4) ? annotation.font.color = CHART_COLORS_BY_REGION[trace.name] : annotation.font.color = 'grey' // magic number!!!
    annotation.arrowcolor = 'transparent'
    perHostAnnotations.push(annotation)
  })

  propertyAnnotations[0].ay = -10 // DLR
  propertyAnnotations[1].ay = 0 // Dublin City
  propertyAnnotations[2].ay = -0 // Fingal
  propertyAnnotations[2].ay = -0 // S Dublin

    // //set individual annotation stylings
  availabilityAnnotations[0].ay = -2 // DLR
  availabilityAnnotations[1].ay = -0 // Dub City
  availabilityAnnotations[2].ay = -10 // Fingal
  availabilityAnnotations[3].ay = 0 // S Dublin
    // availabilityAnnotations[1].ay = 5 // Rest
    // availabilityAnnotations[2].ay = 7 // Nat

    // perHostAnnotations[0].ay = -2 // Dublin
    // perHostAnnotations[1].ay = 10 // Rest
    // perHostAnnotations[2].ay = -15 // Nat

    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [true, true, true, true,
          false, false, false, false,
          false, false, false, false
        ]
      },
        {
            // 'title': titleFig4,
          'annotations': propertyAnnotations,
          'yaxis.range': [0, 8001],
          'yaxis.tickvals': [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]
        }
      ],
      label: 'Properties',
      method: 'update',
      execute: true
    },
      {
        args: [{
          'visible': [false, false, false, false,
            true, true, true, true,
            false, false, false, false
          ]
        },
          {
              // 'title': titleFig4,
            'annotations': availabilityAnnotations,
            'yaxis.range': [0, 300],
            'yaxis.tickvals': [50, 100, 150, 200, 250, 300]
          }
        ],
        label: 'Days Available Yearly',
        method: 'update',
        execute: true
      },
      {
        args: [{
          'visible': [false, false, false, false,
            false, false, false, false,
            true, true, true, true
          ]
        },
          {
              // 'title': titleFig4,
            'annotations': perHostAnnotations,
            'yaxis.range': [0, 5],
            'yaxis.tickvals': [1, 2, 3, 4, 5]

          }
        ],
        label: 'Properties Per Host',
        method: 'update',
        execute: true
      }
    ]
  })

  layout.updatemenus = updateMenus

    // Set default visible traces (i.e. traces on each chart)
  traces.map((t, i) => {
    if (i < 4) return t.visible = true
    else return t.visible = false
  })
  layout.annotations = propertyAnnotations

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
      filename: 'Dublin Dashboard - ' + titleFig4,
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
