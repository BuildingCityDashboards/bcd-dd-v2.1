import { getColourForLA } from '../../modules/bcd-style.js'

const getPlotObjectFig1 = async function () {
//  Options for chart
//  TODO: pass these in as config and/or create accessor functions
  const srcPathFig1 = '../data/Stories/Housing/part_1/'
  const srcFileFig11 = 'pop_house.csv'
  const regionsFig1 = ['Dublin City', 'Dún Laoghaire-Rathdown', 'Fingal', 'South Dublin', 'Kildare', 'Meath', 'Wicklow']
  let titleFig1 = 'Growth in population and households 1991-2016'
// const popTitle = 'Population of Dublin and Surrounding Areas (1991-2016)'
// const houseTitle = 'Number of Households in Dublin and Surrounding Areas (1991-2016)'
// const popRateTitle = 'Population % Change in Dublin and Surrounding Areas (1991-2016)'
// const houseRateTitle = 'Households % Change in Dublin and Surrounding Areas (1991-2016)'
// let titleFig1 = ''
  const popTitle = ''
  const houseTitle = ''
  const popRateTitle = ''
  const houseRateTitle = ''

// titleFig1 = popTitle //  set default on load
  // const divIDFig1 = 'population-households-chart1'

  let data = await d3.csv(srcPathFig1 + srcFileFig11)

    //  Data per region- use the array of region variable values
  const dataByRegion = []
  const dataRateByRegion = []
  regionsFig1.forEach((regionName) => {
    dataByRegion.push(data.filter((v) => {
      return v.region === regionName
    }))
    dataRateByRegion.push(data.filter((v) => {
      return v.region === regionName
    }))
  })

    //  Traces
    //  traces for chart a
  const popTraces = []
  dataByRegion.forEach((regionData, i) => {
    const trace = Object.assign({}, TRACES_DEFAULT_MULTILINE)
    trace.name = regionData[0].region
      //  reassign colour to -defocus some traces
    i < 4 ? trace.opacity = 1.0 : trace.opacity = 0.5 //  magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = getColourForLA(trace.name)
    trace.hoverinfo = 'x+y'

    trace.x = regionData.map((v) => {
      return v.date
    })

      // chart a- population
    trace.y = regionData.map((v) => {
      return v.population
    })

    popTraces.push(trace)
  })
    // traces for chart b
  const houseTraces = []
  dataByRegion.forEach((regionData, i) => {
    const trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionData[0].region
      // reassign colour to -defocus some traces
    i < 4 ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = getColourForLA(trace.name)
    trace.hoverinfo = 'x+y'

    trace.x = regionData.map((v) => {
      return v.date
    })

      // chart b- households
    trace.y = regionData.map((v) => {
      return v.households
    })

    houseTraces.push(trace)
      //  console.log('trace house ' + JSON.stringify(trace))
  })
    // traces for chart c
  const popRateTraces = []
  dataRateByRegion.forEach((regionData, i) => {
    const trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionData[0].region
      // reassign colour to -defocus some traces
    i < 4 ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = getColourForLA(trace.name)
    trace.hoverinfo = 'x+y'

    trace.x = regionData.map((v) => {
      return v.date
    })

    trace.y = regionData.map((v) => {
      return v['population rate']
    })

    popRateTraces.push(trace)
  })
    // traces for chart d
  const houseRateTraces = []
  dataRateByRegion.forEach((regionData, i) => {
    const trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = regionData[1].region
      // reassign colour to -defocus some traces
    i < 4 ? trace.opacity = 1.0 : trace.opacity = 0.5 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
    trace.marker.color = getColourForLA(trace.name)
    trace.hoverinfo = 'x+y'

    trace.x = regionData.map((v) => {
      return v.date
    })

    trace.y = regionData.map((v) => {
      return v['households rate']
    })
    houseRateTraces.push(trace)
  })

    // Set layout options
  const layout = Object.assign({}, MULTILINE_CHART_LAYOUT)

  layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title)
    // layout.title.text = titleFig1
  layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis)
  layout.xaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis.title)
  layout.xaxis.title.text = 'Census Years'
    // hack to make sure the trace marker symbology isn't cut off by the axis ending at 2016
  layout.xaxis.range = [1990.85, 2016.15]
  layout.xaxis.tickmode = 'array'
  layout.xaxis.tickvals = [1991, 1996, 2002, 2006, 2011, 2016]
    // layout.xaxis.showgrid = false
  layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis)
  layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title)
  layout.yaxis.title.text = 'Population'
  layout.yaxis.title.standoff = 16
  layout.yaxis.range = [0, 600000]
  layout.yaxis.tickmode = 'array'
  layout.yaxis.tickvals = [100000, 200000, 300000, 400000, 500000, 600000]
  layout.yaxis.hoverformat = ',d'
  layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin)
  layout.margin.r = 210 // Dun Laoghaire!!!
  layout.margin.l = 96

  // layout.legend = Object.assign({}, MULTILINE_CHART_LAYOUT.legend)

    // Set annotations per chart with config per trace
  const popAnnotations = []
  popTraces.forEach((trace, i) => {
      //  console.log('trace: ' + JSON.stringify(trace))
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
    i < 4 ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = getColourForLA(trace.name)

    popAnnotations.push(annotation)
  })

  const houseAnnotations = []
  houseTraces.forEach((trace, i) => {
      //  console.log('trace: ' + JSON.stringify(trace))
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
    i < 4 ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = getColourForLA(trace.name)

      //  console.log(annotation.font.color)
    houseAnnotations.push(annotation)
  })

  const popRateAnnotations = []
  popRateTraces.forEach((trace, i) => {
      //  console.log('trace: ' + JSON.stringify(trace))
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
    i < 4 ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = getColourForLA(trace.name)

      //  console.log(annotation.font.color)
    popRateAnnotations.push(annotation)
  })

  const houseRateAnnotations = []
  houseRateTraces.forEach((trace, i) => {
      //  console.log('trace: ' + JSON.stringify(trace))
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1]
    annotation.text = trace.name
      // de-focus some annotations
      // TODO: function for this
    i < 4 ? annotation.opacity = 1.0 : annotation.opacity = 0.5
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = getColourForLA(trace.name)

      //  console.log(annotation.font.color)
    houseRateAnnotations.push(annotation)
  })

    // set individual annotation stylings
    // TODO: be better! Don't use array index for access
  popAnnotations[1].yshift = -6 // move DLR down
  popAnnotations[2].yshift = 4 // move Fingal up
  popAnnotations[3].yshift = -4 // move SD down
  popAnnotations[4].yshift = 12 // move K up
  popAnnotations[5].yshift = -8 // move M down
  popAnnotations[6].yshift = -8 // move W down

  houseAnnotations[1].yshift = 3 // move DLR up
  houseAnnotations[2].yshift = 4 // move Fingal up
  houseAnnotations[3].yshift = -4 // move SD down
  houseAnnotations[4].yshift = -4 // move K down
  houseAnnotations[5].yshift = -8 // move M down

  popRateAnnotations[0].yshift = -6 //  DC
  popRateAnnotations[1].yshift = 6 //  DLR
  popRateAnnotations[2].yshift = 4 //  Fingal
  popRateAnnotations[3].yshift = -4 //  SD
  popRateAnnotations[4].yshift = -5 //  K
  popRateAnnotations[5].yshift = 3 //  M

  houseRateAnnotations[1].yshift = 5 //  DLR
  houseRateAnnotations[2].yshift = 4 //  Fingal
  houseRateAnnotations[3].yshift = -4 //  SD
  houseRateAnnotations[4].yshift = 7 //  K
  houseRateAnnotations[5].yshift = -7 //  M

    // Set default view annotations
  layout.annotations = popAnnotations // set default

    // Set button menu
  const updateMenus = []
  updateMenus[0] = JSON.parse(JSON.stringify(UPDATEMENUS_BUTTONS_BASE))
  updateMenus[0].x = -0.1
  updateMenus[0].buttons = [{
    args: [{
      visible: [true, true, true, true, true, true, true,
        false, false, false, false, false, false, false,
        false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ]
    },
      {
        title: popTitle,
        annotations: popAnnotations,
        'yaxis.title.text': 'Population',
          //  'yaxis.title.standoff': 0,
        'yaxis.range': [0, 600000],
        'yaxis.tickvals': [100000, 200000, 300000, 400000, 500000, 600000],
        'yaxis.hoverformat': ',d'
      }],
    label: 'Population',
    method: 'update',
    execute: true
  },
    {
      args: [{
        visible: [false, false, false, false, false, false, false,
          true, true, true, true, true, true, true,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false
        ]
      },
        {
          title: houseTitle,
          annotations: houseAnnotations,
          'yaxis.title.text': 'No. of Households',
          // 'yaxis.title.standoff': 10,
          'yaxis.range': [-2, 250000],
          'yaxis.tickvals': [0, 50000, 100000, 150000, 200000, 150000],
          'yaxis.hoverformat': ',d'
        }
      ],
      label: 'Households',
      method: 'update',
      execute: true
    },
    {
      args: [{
        visible: [false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
          true, true, true, true, true, true, true,
          false, false, false, false, false, false, false
        ]
      },
        {
          title: popRateTitle,
          annotations: popRateAnnotations,
          'yaxis.title.text': '% Population Change',
          //  'yaxis.title.standoff': 20,
          'yaxis.range': [-2, 125],
          'yaxis.tickvals': [0, 50, 100],
          'yaxis.hoverformat': '.3r'

        }
      ],
      label: 'Population % change',
      method: 'update',
      execute: true
    },
    {
      args: [{
        visible: [false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
          true, true, true, true, true, true, true
        ]
      },
        {
          title: houseRateTitle,
          annotations: houseRateAnnotations,
          'yaxis.title.text': '% Households Change',
          //  'yaxis.title.standoff': 20,
          //  'updatemenus.pad.l': -60,
          'yaxis.range': [-2, 151],
          'yaxis.tickvals': [0, 50, 100, 150],
          'yaxis.hoverformat': '.3r'
        }
      ],
      label: 'Household % change',
      method: 'update',
      execute: true
    }
  ]

  layout.updatemenus = updateMenus
  // layout.modebar = {
  //   'bgcolor': 'rgba(0, 0, 0, 0)'
  // }

  const chartTraces = popTraces
      .concat(houseTraces)
      .concat(popRateTraces)
      .concat(houseRateTraces)

    //  // Set default visible traces (i.e. traces on each chart)
  chartTraces.map((t, i) => {
    if (i < 7) return t.visible = true
    else return t.visible = false
  })

  let plotOptions = {
    modeBar: {
      orientation: 'h',
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
    traces: chartTraces,
    layout: layout,
    options: plotOptions
  }
  // console.log(plotObject)
  return plotObject
}

export { getPlotObjectFig1 }
