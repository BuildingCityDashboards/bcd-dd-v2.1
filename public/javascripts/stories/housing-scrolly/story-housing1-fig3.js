const getPlotObjectFig3 = async function () {
// Options for chart
// TODO: pass these in as config and/or create accessor functions
  const srcPathFig3 = '../data/Stories/Housing/part_1/',
    srcFileFig3 = 'housecomp.csv'
  const typesFig3 = ['Dublin City', 'Dún Laoghaire-Rathdown', 'Fingal', 'South Dublin', 'Kildare', 'Meath', 'Wicklow', 'Rest of Ireland']
  const titleFig3 = 'Housing Completions By Region 1994-2016'
  const divIDFig3 = 'housing-completions-chart'

// @TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
// Want a better mechanism for page load that doesn't have to wait for all the data

  let data = await d3.csv(srcPathFig3 + srcFileFig3)

    // Data per type- use the array of type variable values
  let dataByType = []
  typesFig3.forEach((typeName) => {
    dataByType.push(data.filter((v) => {
      return v.region === typeName
    }))
  })

    // Traces
  let chartTraces = []
  dataByType.forEach((typeData, i) => {
    let trace = Object.assign({}, TRACES_DEFAULT)
    trace.name = typeData[0].region;
      // trace.stackgroup = 'one';
      // reassign colour to -defocus some traces
    (i < 4) ? trace.opacity = 1.0 : trace.opacity = 0.75 // magic number!!!
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    (i < 4) ? trace.marker.color = null : trace.marker.color = 'grey' // magic number!!!
      // (i < 4) ? trace.marker.opacity = 1.0: trace.marker.opacity = 0.1; //magic number!!!
    trace.marker.opacity = 1 // magic number!!!

    trace.x = typeData.map((v) => {
      return v.date
    })

    trace.y = typeData.map((v) => {
      return v.value
    })

    chartTraces.push(trace)
  })

    // Set layout options
  let layout = Object.assign({}, STACKED_AREA_CHART_LAYOUT)
  layout.height = 500
    // layout.title.text = titleFig3;
  layout.marker = Object.assign({}, STACKED_AREA_CHART_LAYOUT.marker)
  layout.marker.opacity = 0
  layout.showlegend = false
  layout.xaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.xaxis)
    // hack to make sure the trace marker symbology isn't cut off by the axis ending at 2016
  layout.xaxis.range = [1993.85, 2016.15]
  layout.xaxis.title = 'Year'
  layout.yaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.yaxis)
  layout.yaxis.fixedrange = false
  layout.yaxis.range = [1, 70000]
  layout.yaxis.title = 'Units'
  layout.margin = Object.assign({}, STACKED_AREA_CHART_LAYOUT.margin)
  layout.margin = {
    l: 65,
    r: 215, // annotations space
    b: 40, // x axis tooltip
    t: 0 // button row
  }
  layout.yaxis.title.standoff = 100
  layout.yaxis.hoverformat = ',d'
    // layout.hidesources = false;

  let chartAnnotations = []
  chartTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
    let annotation = Object.assign({}, ANNOTATIONS_DEFAULT)
    annotation.x = trace.x[trace.x.length - 1]
    annotation.y = trace.y[trace.y.length - 1];
    (i < 4 || i == 7) ? annotation.text = trace.name : null;

      // de-focus some annotations
      // TODO: function for this
    (i < 4) ? annotation.opacity = 1.0 : annotation.opacity = 0
    annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    (i < 4) ? annotation.font.color = CHART_COLORWAY[i] : annotation.font.color = 'grey'; // magic number!!!
    (i < 4) ? annotation.showarrow = true : annotation.showarrow = false;
    (i < 4) ? annotation.arrowcolor = CHART_COLORWAY[i] : annotation.arrowcolor = 'grey' // magic number!!!
      // console.log(annotation.font.color);
    chartAnnotations.push(annotation)
  })
    // add a one-off annotation
    /* let hoverAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    hoverAnnotation.x = 2010;
    hoverAnnotation.y = 40000;
    hoverAnnotation.opacity = 0.75;
    hoverAnnotation.text = 'Hover for more regions';
    hoverAnnotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    hoverAnnotation.font.color = 'grey';
    chartAnnotations.push(hoverAnnotation);

    let dragAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    dragAnnotation.x = 2010;
    dragAnnotation.y = 35000;
    dragAnnotation.text = 'Drag on plot to zoom';
    dragAnnotation.opacity = 0.75;
    //-dragAnnotation.text = 'Drag vertically on plot to zoom, on yaxis to scroll';
    dragAnnotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    dragAnnotation.font.color = 'grey';
    chartAnnotations.push(dragAnnotation);
    */

  chartAnnotations[0].ax = 10 // DC
  chartAnnotations[1].ax = 10 // DLR
  chartAnnotations[2].ax = 10 // Fingal
  chartAnnotations[3].ax = 10 // SD
  chartAnnotations[7].ax = 10 // RoI

  chartAnnotations[0].ay = -12 // DC
  chartAnnotations[1].ay = -30 // DLR
  chartAnnotations[2].ay = -45 // Fingal
  chartAnnotations[3].ay = 0 // SD
  chartAnnotations[7].ay = 0 // RoI
    // chartAnnotations[5].ay = 0; // M

    // Set default view annotations
  layout.annotations = chartAnnotations // set default
  let plotOptions = {
    modeBarButtons: STACKED_AREA_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
    displayModeBar: true,
    displaylogo: false,
    showSendToCloud: false,
    responsive: true,
    toImageButtonOptions: {
      filename: 'Dublin Dashboard - ' + titleFig3,
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
  return plotObject
}
