const getPlotObjectFig2 = async function () {
//  Chart of house completions over time, by type of house, for each region in Dublin+
//  This chart will have multiple plots for each year loaded by buttons.
//  6 sub-plots each containing a row chart.
//  Each sub-plot will show a different house type and value per LA

// TODO: pass these in as config and/or create accessor functions
  const srcPathFig2 = '../data/Stories/Housing/part_1/'
  const srcFileFig2 = 'housetype.csv'

    // Options for chart
  const titleFig2 = 'Number of Households by Type, by Region 2002-2016'
    //  titleFig2 = popTitle  // set default on load
  const e = 'housing-types-chart'
    // This array controls the order in which subplotsare drawn
  const regionsFig2 = ['Dublin City', 'Dún Laoghaire-Rathdown', 'Fingal', 'South Dublin', 'Kildare', 'Meath', 'Wicklow']

    // object used to look up shorter names to use as labels in plots
  const shortNames = {
    'Flat or apartment in a converted house or commercial building and bedsits': 'Flat, apartment (converted) or bedsit',
    'Flat or apartment in a purpose- built block': 'Flat or apartment (purpose-built)'
  } //  (converted house/commercial building) or bedsit'

  let data = await d3.csv(srcPathFig2 + srcFileFig2)
  const completionsByYearByRegion = d3.nest()
    .key(function (d) {
      return d.date
    })
    .key(function (d) {
      return d.region
    })
    .object(data)

    // Create a subplot for each region
  const years = Object.keys(completionsByYearByRegion)
    // console.log(years)
  const noOfSubplots = regionsFig2.length // assumes same no of regions per year
    // console.log(noOfSubplots)

  const fig2Plots = [] // the array of plots to be used as an arg to Plotly instantiation
    //
    // Nested for each loops are undesriable here
  years.forEach((year) => {
    regionsFig2.forEach((region) => {
      fig2Plots.push(getSubplot(completionsByYearByRegion[year][region], 'value', ['type', 'percent']))
    })
  })
    // TODO remove this additional loop
  fig2Plots.forEach((plot, i) => {
    plot.xaxis = 'x' + ((i % noOfSubplots) + 1) // % no of subplots
    plot.yaxis = 'y' + ((i % noOfSubplots) + 1)
  })

    //  // Set default visible traces (i.e. traces on each chart)
  fig2Plots.map((t, i) => {
    if (i < 7) return t.visible = true
    else return t.visible = false
  })

  function getSubplot (data, xVar, yVar) {
    const trace = {
      x: data.map((v) => {
        return v.value = +v.value
      }),
      y: data.map((v) => {
        return shortNames[v.type] || v.type
      }),
      xaxis: null,
      yaxis: null,
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }],
      name: data[0].region,
      orientation: 'h',
      type: 'bar',
      mode: 'bars',
      marker: {
        color: CHART_COLORS_BY_REGION[data[0].region] || 'grey'
      },
      hoverinfo: 'x',
      hoverlabel: {
        namelength: '-1'
      }
        //  text: ['test']
    }
    return trace
  }

    // Configure the layout object common to all plots
  const fig2Layout = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS)
  fig2Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.title)
    // fig2Layout.title.text = titleFig2
  fig2Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.margin)
  // fig2Layout.margin.t = 100 //buttons are placed below this
  fig2Layout.margin.r = 5 // space at RHS (under mode bar)

  const xaxisRange = [0, 75000] // TODO: get the max value from the data
    // configure the axes for each subplot
  regionsFig2.forEach((region, i) => {
    let xAxisName
    i == 0 ? xAxisName = 'xaxis' : xAxisName = 'xaxis' + (i + 1)
    fig2Layout[xAxisName] = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis)
    fig2Layout[xAxisName].title = region
    fig2Layout[xAxisName].visible = false
    fig2Layout[xAxisName].titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont)
    fig2Layout[xAxisName].titlefont.color = CHART_COLORS_BY_REGION[region] || null
    fig2Layout[xAxisName].range = xaxisRange
    fig2Layout[xAxisName].anchor = 'y' + (i + 1)

    let yAxisName
    i == 0 ? yAxisName = 'yaxis' : yAxisName = 'yaxis' + (i + 1)
    fig2Layout[yAxisName] = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis)
    fig2Layout[yAxisName].anchor = 'x' + (i + 1)
    fig2Layout[yAxisName].titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont)
    if (region === 'Kildare' || region === 'Meath' || region === 'Wicklow') {
      fig2Layout[yAxisName].visible = false
    }
  })
  fig2Layout.xaxis.visible = false
  fig2Layout.xaxis.domain = [0, 0.45]
  fig2Layout.xaxis2.domain = [0.55, 1.0]
  fig2Layout.xaxis3.domain = [0.0, 0.45]
  fig2Layout.xaxis4.domain = [0.55, 1.0]
  fig2Layout.xaxis5.domain = [0, 0.3]
  fig2Layout.xaxis6.domain = [0.35, 0.65]
  fig2Layout.xaxis7.domain = [0.7, 1.0]

  fig2Layout.yaxis.domain = [0.60, 1.0]
  fig2Layout.yaxis2.domain = [0.60, 1.0]
  fig2Layout.yaxis3.domain = [0.20, 0.55]
  fig2Layout.yaxis4.domain = [0.20, 0.55]
  fig2Layout.yaxis5.domain = [0.0, 0.15]
  fig2Layout.yaxis6.domain = [0.0, 0.15]
  fig2Layout.yaxis7.domain = [0.0, 0.15]

  const annotations = []
  fig2Plots.forEach((plot, i) => {
    if (i < 7) {
      annotations.push(getAnnotationForPlot(plot, i))
    }
  })
    //  annotations.push(getAnnotationForPlot(fig2Plots[0]))

// Annotations are the plot subplot titles i.e. the regions
  function getAnnotationForPlot (plot, i) {
      //  console.log('trace: ' + JSON.stringify(trace))
    const annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.xref = 'x' + (i + 1) // Is order guaranteed?
    annotation.yref = 'y' + (i + 1)
    annotation.xanchor = 'right'
    annotation.align = 'right'
    annotation.x = xaxisRange[1]
    annotation.y = 'Not stated' // the y axis label to align with
    annotation.yshift = -16
    annotation.text = plot.name
    annotation.opacity = 0.9
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[plot.name] || 'grey'
    annotation.font.size = 16
    return annotation
  }

  fig2Layout.annotations = annotations

    // Set button menu
  const updateMenus = []
  updateMenus[0] = JSON.parse(JSON.stringify(UPDATEMENUS_BUTTONS_BASE))
  updateMenus[0].buttons = [{
    args: [{
      visible: [true, true, true, true, true, true, true,
        false, false, false, false, false, false, false,
        false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ]
    },
      {
          //  'title': '2002',
        annotations: annotations
      }
    ],
    label: '2002',
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
          //  'title': '2006',
          annotations: annotations
        }
      ],
      label: '2006',
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
        //  'title': '2011',
          annotations: annotations
        }
      ],
      label: '2011',
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
          //  'title': '2016',
          annotations: annotations
        }
      ],
      label: '2016',
      method: 'update',
      execute: true
    }
  ]

  fig2Layout.updatemenus = updateMenus

    //  fig2Layout.grid = {
    //    rows: 3,
    //    //  columns: 2,
    //    pattern: 'independent'
    //  }

  let plotOptions = {
    modeBarButtons: ROW_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
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
    traces: fig2Plots,
    layout: fig2Layout,
    options: plotOptions
  }

  return plotObject
}

    // workaround to place y axis labels on bars
const afterplotFixesFig2 = function (e) {
  // console.log('apply afterplot')

  document.getElementById(e).on('plotly_afterplot', function () {
    const y1AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .ytick text, [class*="yaxislayer"] .ytick text'))
    for (let i = 0; i < y1AxisLabels.length; i++) {
        //  yAxisLabels[i].setAttribute(visible, true)
      y1AxisLabels[i].setAttribute('text-anchor', 'start')
      let y1x = parseInt(y1AxisLabels[i].getAttribute('x'))
      y1x += 5
      y1AxisLabels[i].setAttribute('x', y1x) // add left spacing
    }

    const y2AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .y2tick text, [class*="yaxislayer"] .y2tick text'))
    for (let i = 0; i < y2AxisLabels.length; i++) {
        //  yAxisLabels[i].setAttribute(visible, true)
      y2AxisLabels[i].setAttribute('text-anchor', 'start')
      let y2x = parseInt(y2AxisLabels[i].getAttribute('x'))
      y2x += 5
      y2AxisLabels[i].setAttribute('x', y2x) // add left spacing
    }

    const y3AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .y3tick text, [class*="yaxislayer"] .y3tick text'))
    for (let i = 0; i < y3AxisLabels.length; i++) {
        //  yAxisLabels[i].setAttribute(visible, true)
      y3AxisLabels[i].setAttribute('text-anchor', 'start')
      let y3x = parseInt(y3AxisLabels[i].getAttribute('x'))
      y3x += 5
      y3AxisLabels[i].setAttribute('x', y3x) // add left spacing
    }

    const y4AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .y4tick text, [class*="yaxislayer"] .y4tick text'))
    for (let i = 0; i < y4AxisLabels.length; i++) {
        //  yAxisLabels[i].setAttribute(visible, true)
      y4AxisLabels[i].setAttribute('text-anchor', 'start')
      let y4x = parseInt(y4AxisLabels[i].getAttribute('x'))
      y4x += 5
      y4AxisLabels[i].setAttribute('x', y4x) // add left spacing
    }
  })
}
