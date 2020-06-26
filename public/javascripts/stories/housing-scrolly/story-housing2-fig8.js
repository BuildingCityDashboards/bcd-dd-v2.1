const getPlotObjectFig8 = async function () {
// Options for chart
  const srcPathFig8a = '../data/Stories/Housing/part_2/processed/traveller_accomodation_accomodated.csv'
  const srcPathFig8b = '../data/Stories/Housing/part_2/processed/traveller_accomodation_unauthorised.csv'
  let titleFig8 = 'Traveller Accommodation 2002-2013'
  const divIDFig8 = 'traveller-accomodation-chart'

  const d1 = await d3.csv(srcPathFig8a)
  const d2 = await d3.csv(srcPathFig8b)
  let data = []
  data.push(d1)
  data.push(d2)

  const regionsFig8 = [...REGIONS_ORDERED_DUBLIN].concat([...REGIONS_ORDERED_NEIGHBOURS])
  regionsFig8.push('state')
  const marginRUnauth = 240
  const marginRAccom = 240
  const marginRBoth = 75

  let tracesUnauthorisedFig8 = []
  let tracesAccomodatedFig8 = []

  regionsFig8.forEach((region) => {
    tracesUnauthorisedFig8.push(getTrace(data[1], 'date', region))
    tracesAccomodatedFig8.push(getTrace(data[0], 'date', region))
  })
    // change stat from defaults
    // tracesUnauthorisedFig8[7].stackgroup = 'two';
  tracesUnauthorisedFig8[7].name = 'Total for State'
    // tracesAccomodatedFig8[7].stackgroup = 'two';
  tracesAccomodatedFig8[7].name = 'Total for State'
    // set default visibility on load
  tracesUnauthorisedFig8.forEach((trace) => {
    return trace.visible = true
  })
  let traces = tracesUnauthorisedFig8.concat(tracesAccomodatedFig8)

  function getTrace (data, xVar, yVar) {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = yVar
      // trace.stackgroup = 'one';
    trace.visible = false
    trace.x = data.map((x) => {
      return x[xVar]
    })
    trace.y = data.map((y) => {
      return y[yVar]
    })
    trace.connectgaps = true
    trace.mode = 'lines+markers'
      // trace.name === 'state' ? trace.visible = true : trace.visible = true;
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.opacity = 1.0 // how to adjust fill opacity?
    trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'
    return trace
  }

    // Set layout options
  let layout = Object.assign({}, STACKED_AREA_CHART_LAYOUT)
    // layout.title.text = titleFig8;
    // layout.height = 500;
  layout.showlegend = false
  layout.xaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.xaxis)
  layout.xaxis.title = 'Year'
  layout.xaxis.nticks = 6
  layout.xaxis.range = [2001.9, 2013.1]
  layout.yaxis.title = 'Sites'
  layout.yaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.yaxis)
  layout.yaxis.fixedrange = false
  layout.yaxis.range = [1, 1000]
    // layout.yaxis.visible = false;
  layout.margin = Object.assign({}, STACKED_AREA_CHART_LAYOUT.margin)
  layout.margin = {
    l: 65,
    r: marginRUnauth,
    t: 0, // button row
    b: 40
  }
    // // layout.hidesources = false;

    // Set annotations per chart with config per trace
  let unauthorisedAnnotations = []
  let accomodatedAnnotations = []
    // let bothAnnotations = [];

  tracesUnauthorisedFig8.forEach((trace) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = +trace.x[trace.x.length - 1]
    annotation.y = +trace.y[trace.y.length - 1]
    annotation.text = trace.name
    annotation.showarrow = true
    annotation.ax = +10
      // annotation.arrowcolor = CHART_COLORS_BY_REGION[trace.name] || 'grey';;
    annotation.arrowcolor = 'transparent'
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey' // magic number!!!

    unauthorisedAnnotations.push(annotation)
      // bothAnnotations.push(Object.assign({}, annotation));
  })
    // need to adjust y to take account of stacking
  unauthorisedAnnotations[1].y = unauthorisedAnnotations[1].y + unauthorisedAnnotations[0].y
  unauthorisedAnnotations[2].y = unauthorisedAnnotations[2].y + unauthorisedAnnotations[1].y
  unauthorisedAnnotations[3].y = unauthorisedAnnotations[3].y + unauthorisedAnnotations[2].y
  unauthorisedAnnotations[0].ay = 12
  unauthorisedAnnotations[1].ay = -2
  unauthorisedAnnotations[2].ay = -10
  unauthorisedAnnotations[3].ay = -25
  unauthorisedAnnotations[4].visible = false
  unauthorisedAnnotations[5].visible = false
  unauthorisedAnnotations[6].visible = false

  let hoverAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT)
  hoverAnnotation.x = 2008
  hoverAnnotation.y = 700
  hoverAnnotation.opacity = 0.75
  hoverAnnotation.text = 'Hover for more regions'
  hoverAnnotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
  hoverAnnotation.font.color = 'grey'
    // unauthorisedAnnotations.push(hoverAnnotation);
  let dragAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT)
  dragAnnotation.x = 2006
  dragAnnotation.y = 800
  dragAnnotation.opacity = 0.75
  dragAnnotation.text = 'Drag vertically on plot to zoom, on yaxis to scroll'
  dragAnnotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
  dragAnnotation.font.color = 'grey'
    // unauthorisedAnnotations.push(dragAnnotation);

  tracesAccomodatedFig8.forEach((trace) => {
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = +trace.x[trace.x.length - 1]
    annotation.y = +trace.y[trace.y.length - 1]
    annotation.text = trace.name
    annotation.showarrow = true
    annotation.ax = +10
      // annotation.arrowcolor = CHART_COLORS_BY_REGION[trace.name] || 'grey';;
    annotation.arrowcolor = 'transparent'
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey' // magic number!!!
    accomodatedAnnotations.push(annotation)

      // bothAnnotations.push(Object.assign({}, annotation));
  })

  accomodatedAnnotations[1].y = accomodatedAnnotations[1].y + accomodatedAnnotations[0].y
  accomodatedAnnotations[2].y = accomodatedAnnotations[2].y + accomodatedAnnotations[1].y
  accomodatedAnnotations[3].y = accomodatedAnnotations[3].y + accomodatedAnnotations[2].y
  accomodatedAnnotations[0].ay = 15
  accomodatedAnnotations[1].ay = 0
  accomodatedAnnotations[2].ay = -10
  accomodatedAnnotations[3].ay = -15
  accomodatedAnnotations[4].visible = false
  accomodatedAnnotations[5].visible = false
  accomodatedAnnotations[6].visible = false

    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [true, true, true, true, true, true, true, true,
          false, false, false, false, false, false, false, false
        ]
      },
        {
              // 'title': titleFig8,
          'annotations': unauthorisedAnnotations,
          'margin.r': marginRUnauth,
          'yaxis.range': [1, 1000]
        }
      ],
      label: 'Unauthorised Sites',
      method: 'update'
          // execute: true
    },
      {
        args: [{
          'visible': [false, false, false, false, false, false, false, false,
            true, true, true, true, true, true, true, true
          ]
        },
          {
              // 'title': titleFig8,
            'annotations': accomodatedAnnotations,
            'margin.r': marginRAccom,
            'yaxis.range': [1, 6000]
          }
        ],
        label: 'Accomodated by Local Authorities',
        method: 'update'
          // execute: true
      }
        // {
        //   args: [{
        //       'visible': [false, false, false, false,
        //         false, false, false, false,
        //       ]
        //     },
        //     {
        //       'title': titleFig8,
        //       'annotations': bothAnnotations,
        //       'margin.r': marginRAccom
        //
        //     }
        //   ],
        //   label: 'Both',
        //   method: 'update',
        //   // execute: true
        // }
    ]
  })

  layout.updatemenus = updateMenus
  layout.annotations = unauthorisedAnnotations

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
      filename: 'Dublin Dashboard - ' + titleFig8,
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

  return plotObject
}
