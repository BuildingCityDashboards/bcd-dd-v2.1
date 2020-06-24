const getPlotObjectFig7 = async function () {
// Chart of house completions over time, by type of house, for each region in Dublin+
// This chart will have multiple plots for each year loaded by buttons.
// 6 sub-plots each containing a row chart.
// Each sub-plot will show a different house type and value per LA

// Options for chart
// TODO: pass these in as config and/or create accessor functions
  const srcPathFig7 = '../data/Stories/Housing/part_1/',
    srcFileFig7 = 'Social_housing_stock.csv'

  const titleFig7 = 'Social Housing Stock by Type, by Region 1991-2016'
// titleFig7 = popTitle; //set default on load
  const e = 'social-housing-units-stock-chart'
// This array controls the order in which subplotsare drawn
  const regionsFig7 = ['Dublin City', 'Dún Laoghaire-Rathdown', 'Fingal', 'South Dublin', 'Kildare', 'Meath', 'Wicklow']

  let data = await d3.csv(srcPathFig7 + srcFileFig7)

  let completionsByYearByRegion = d3.nest()
      .key(function (d) {
        return d['date']
      })
      .key(function (d) {
        return d['region']
      })
      .object(data)

    // Create a subplot for each region
  let years = Object.keys(completionsByYearByRegion)
    // console.log(years);
  let noOfSubplots = regionsFig7.length // assumes same no of regions per year
    // console.log(noOfSubplots);

  let plotsFig7 = [] // the array of plots to be used as an arg to Plotly instantiation
    // Nested for each loops are undesriable here
  years.forEach((year) => {
    regionsFig7.forEach((region) => {
      plotsFig7.push(getSubplot(completionsByYearByRegion[year][region], 'value', ['type', 'percent']))
    })
  })
    // TODO remove this additional loop
  plotsFig7.forEach((plot, i) => {
    plot.xaxis = 'x' + ((i % noOfSubplots) + 1) // % no of subplots
    plot.yaxis = 'y' + ((i % noOfSubplots) + 1)
      // console.log(plot.xaxis);
  })

    // //Set default visible traces (i.e. traces on each chart)
  plotsFig7.map((t, i) => {
    if (i < 7) return t.visible = true
    else return t.visible = false
  })

  function getSubplot (data, xVar, yVar) {
    let trace = {
      x: data.map((v) => {
        return v[xVar]
      }),
      y: data.map((v) => {
        return v.type
      }),
      xaxis: null,
      yaxis: null,
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }],
      name: data[0]['region'],
      orientation: 'h',
      type: 'bar',
      mode: 'bars+text',
      marker: {
        color: CHART_COLORS_BY_REGION[data[0]['region']] || 'grey'
      },
      hoverinfo: 'x',
      hoverlabel: {
        namelength: '-1'
      }
        // text: ['test']
    }
    return trace
  }

    // Configure the layout object common to all plots
  let fig7Layout = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS)
  fig7Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.title)
    // fig7Layout.title.text = titleFig7;
  fig7Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.margin)
    // fig7Layout.margin.t = 100;
  fig7Layout.height = 600

  const xaxisRange = [0, 120000] // TODO: get the max value from the data
    // configure the axes for each subplot
  regionsFig7.forEach((region, i) => {
    let xAxisName
    i == 0 ? xAxisName = 'xaxis' : xAxisName = 'xaxis' + (i + 1)
    fig7Layout[xAxisName] = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis)
    fig7Layout[xAxisName].title = region
    fig7Layout[xAxisName].visible = false
    fig7Layout[xAxisName].titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont)
    fig7Layout[xAxisName].titlefont.color = CHART_COLORS_BY_REGION[region] || null
    fig7Layout[xAxisName].range = xaxisRange
    fig7Layout[xAxisName].anchor = 'y' + (i + 1)

    let yAxisName
    i == 0 ? yAxisName = 'yaxis' : yAxisName = 'yaxis' + (i + 1)
    fig7Layout[yAxisName] = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis)
    fig7Layout[yAxisName].anchor = 'x' + (i + 1)
    fig7Layout[yAxisName].titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont)
    if (region === 'Kildare' || region === 'Meath' || region === 'Wicklow') {
      fig7Layout[yAxisName].visible = false
    }
  })
  fig7Layout.xaxis.visible = false
  fig7Layout.xaxis.domain = [0, 0.45]
  fig7Layout.xaxis2.domain = [0.55, 1.0]
  fig7Layout.xaxis3.domain = [0.0, 0.45]
  fig7Layout.xaxis4.domain = [0.55, 1.0]
  fig7Layout.xaxis5.domain = [0, 0.3]
  fig7Layout.xaxis6.domain = [0.35, 0.65]
  fig7Layout.xaxis7.domain = [0.7, 1.0]

  fig7Layout.yaxis.domain = [0.60, 1.0]
  fig7Layout.yaxis2.domain = [0.60, 1.0]
  fig7Layout.yaxis3.domain = [0.20, 0.55]
  fig7Layout.yaxis4.domain = [0.20, 0.55]
  fig7Layout.yaxis5.domain = [0.0, 0.15]
  fig7Layout.yaxis6.domain = [0.0, 0.15]
  fig7Layout.yaxis7.domain = [0.0, 0.15]

  let annotations = []
  plotsFig7.forEach((plot, i) => {
    if (i < 7) {
      annotations.push(getAnnotationForPlot(plot, i))
    }
  })
  annotations.push(getAnnotationForPlot(plotsFig7[0]))

  function getAnnotationForPlot (plot, i) {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.xref = 'x' + (i + 1) // Is order guaranteed?
    annotation.yref = 'y' + (i + 1)
    annotation.xanchor = 'right'
    annotation.align = 'right'
    annotation.x = xaxisRange[1]
    annotation.y = 'Not Stated' // the y axis label to align with
    annotation.ay = 0

    annotation.text = plot['name']
    annotation.opacity = 1.0
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font)
    annotation.font.color = CHART_COLORS_BY_REGION[plot['name']] || 'grey'
    annotation.font.size = 18
      // de-focus some annotations
      // TODO: function for this
      // (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      // annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      // (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
    return annotation
  };

  fig7Layout.annotations = annotations

    // Set button menu
    // Set button menu
  let updateMenus = []
  updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE)
  updateMenus[0] = Object.assign(updateMenus[0], {
    buttons: [{
      args: [{
        'visible': [true, true, true, true, true, true, true,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false
        ]
      },
        {
              // 'title': '2002',
          'annotations': annotations

        }
      ],
      label: '1991',
      method: 'update',
      execute: true
    }, {
      args: [{
        'visible': [
          false, false, false, false, false, false, false,
          true, true, true, true, true, true, true,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false
        ]
      },
        {
              // 'title': '2002',
          'annotations': annotations

        }
      ],
      label: '2002',
      method: 'update',
      execute: true
    },
      {
        args: [{
          'visible': [
            false, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            true, true, true, true, true, true, true,
            false, false, false, false, false, false, false,
            false, false, false, false, false, false, false
          ]
        },
          {
              // 'title': '2006',
            'annotations': annotations
          }
        ],
        label: '2006',
        method: 'update',
        execute: true
      },
      {
        args: [{
          'visible': [false, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            true, true, true, true, true, true, true,
            false, false, false, false, false, false, false
          ]
        },
          {
              // 'title': '2011',
            'annotations': annotations

          }
        ],
        label: '2011',
        method: 'update',
        execute: true
      },
      {
        args: [{
          'visible': [false, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            true, true, true, true, true, true, true
          ]
        },
          {
              // 'title': '2016',
            'annotations': annotations
          }
        ],
        label: '2016',
        method: 'update',
        execute: true
      }
    ]
  })

  fig7Layout.updatemenus = updateMenus

    // fig7Layout.grid = {
    //   rows: 3,
    //   // columns: 2,
    //   pattern: 'independent'
    // }

  const plotOptions = {
    modeBarButtons: ROW_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
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
    traces: plotsFig7,
    layout: fig7Layout,
    options: plotOptions
  }

  return plotObject
}

const afterplotFixesFig7 = function (e) {
    // workaround to place y axis labels on bars
  document.getElementById(e).on('plotly_afterplot', function () {
    let y1AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .ytick text, [class*=" yaxislayer"] .ytick text'))
    for (let i = 0; i < y1AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
      y1AxisLabels[i].setAttribute('text-anchor', 'start')
      let y1x = parseInt(y1AxisLabels[i].getAttribute('x'))
      y1x += 5
      y1AxisLabels[i].setAttribute('x', y1x) // add left spacing
    }

    let y2AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .y2tick text, [class*=" yaxislayer"] .y2tick text'))
    for (let i = 0; i < y2AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
      y2AxisLabels[i].setAttribute('text-anchor', 'start')
      let y2x = parseInt(y2AxisLabels[i].getAttribute('x'))
      y2x += 5
      y2AxisLabels[i].setAttribute('x', y2x) // add left spacing
    }

    let y3AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .y3tick text, [class*=" yaxislayer"] .y3tick text'))
    for (let i = 0; i < y3AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
      y3AxisLabels[i].setAttribute('text-anchor', 'start')
      let y3x = parseInt(y3AxisLabels[i].getAttribute('x'))
      y3x += 5
      y3AxisLabels[i].setAttribute('x', y3x) // add left spacing
    }

    let y4AxisLabels = [].slice.call(document.getElementById(e).querySelectorAll('[class^="yaxislayer"] .y4tick text, [class*=" yaxislayer"] .y4tick text'))
    for (let i = 0; i < y4AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
      y4AxisLabels[i].setAttribute('text-anchor', 'start')
      let y4x = parseInt(y4AxisLabels[i].getAttribute('x'))
      y4x += 5
      y4AxisLabels[i].setAttribute('x', y4x) // add left spacing
    }
  })
}
