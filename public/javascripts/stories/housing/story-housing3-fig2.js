//Options for chart
const srcPathFig2 = "../data/Stories/Housing/part_3/processed/homeless_figures_parsed.csv";
let titleFig2 = "Number of adults with children accessing emergency accommodation in Dublin (2014-2018)";
const divIDFig2 = "homelessness-chart";

d3.csv(srcPathFig2)
  .then((data) => {
    const marginRUnauth = 190;
    const marginRAccom = 190;
    const marginRBoth = 75;

    // let keys = Object.keys(data);
    // console.log(keys);

    let tracesFig2 = getTrace(data, "date", "Indvidual adults");
    console.log(tracesFig2);
    // //change stat from defaults
    // tracesUnauthorisedFig2[7].stackgroup = 'two';
    // tracesUnauthorisedFig2[7].name = 'Total for State';
    // tracesAccomodatedFig2[7].stackgroup = 'two';
    // tracesAccomodatedFig2[7].name = 'Total for State';
    // //set default visibility on load
    // tracesUnauthorisedFig2.forEach((trace) => {
    //   return trace.visible = true;
    // })
    // let tracesFig2 = tracesUnauthorisedFig2.concat(tracesAccomodatedFig2);

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = yVar;
      trace.stackgroup = 'one';
      trace.visible = false;
      trace.x = data.map((x) => {
        return x[xVar];
      });
      trace.y = data.map((y) => {
        return +y[yVar];
      });
      trace.connectgaps = true;
      trace.mode = 'lines';
      // trace.name === 'state' ? trace.visible = true : trace.visible = true;
      // trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      // trace.marker.opacity = 1.0; //how to adjust fill opacity?
      // trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey';
      return trace;
    }

    //Set layout options
    let layoutFig2 = Object.assign({}, STACKED_AREA_CHART_LAYOUT);
    layoutFig2.title.text = titleFig2;
    // layoutFig2.height = 500;
    // layoutFig2.showlegend = false;
    // layoutFig2.xaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.xaxis);
    // layoutFig2.xaxis.title = '';
    // layoutFig2.xaxis.range = [2002, 2013];
    // layoutFig2.yaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.yaxis);
    // layoutFig2.yaxis.fixedrange = false;
    // layoutFig2.yaxis.range = [1, 1000];
    // layoutFig2.yaxis.visible = false;
    // layoutFig2.yaxis.title = '';
    // layoutFig2.margin = Object.assign({}, STACKED_AREA_CHART_LAYOUT.margin);
    // layoutFig2.margin = {
    //   l: 0,
    //   r: marginRUnauth,
    //   t: 100 //button row
    // };
    // // layoutFig2.hidesources = false;

    // Set annotations per chart with config per trace
    // let unauthorisedAnnotations = [];
    // let accomodatedAnnotations = [];
    // // let bothAnnotations = [];
    //
    // tracesUnauthorisedFig2.forEach((trace) => {
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = +trace.x[trace.x.length - 1];
    //   annotation.y = +trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   annotation.showarrow = true;
    //   annotation.ax = +10;
    //   annotation.arrowcolor = CHART_COLORS_BY_REGION[trace.name] || 'grey';;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //magic number!!!
    //
    //   unauthorisedAnnotations.push(annotation);
    //   // bothAnnotations.push(Object.assign({}, annotation));
    // })
    // //need to adjust y to take account of stacking
    // unauthorisedAnnotations[1].y = unauthorisedAnnotations[1].y + unauthorisedAnnotations[0].y;
    // unauthorisedAnnotations[2].y = unauthorisedAnnotations[2].y + unauthorisedAnnotations[1].y;
    // unauthorisedAnnotations[3].y = unauthorisedAnnotations[3].y + unauthorisedAnnotations[2].y;
    // unauthorisedAnnotations[0].ay = 12;
    // unauthorisedAnnotations[1].ay = -2;
    // unauthorisedAnnotations[2].ay = -10;
    // unauthorisedAnnotations[3].ay = -25;
    // unauthorisedAnnotations[4].visible = false;
    // unauthorisedAnnotations[5].visible = false;
    // unauthorisedAnnotations[6].visible = false;
    //
    // let hoverAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    // hoverAnnotation.x = 2008;
    // hoverAnnotation.y = 700;
    // hoverAnnotation.opacity = 0.75;
    // hoverAnnotation.text = 'Hover for more regions';
    // hoverAnnotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    // hoverAnnotation.font.color = 'grey';
    // unauthorisedAnnotations.push(hoverAnnotation);
    // let dragAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    // dragAnnotation.x = 2006;
    // dragAnnotation.y = 800;
    // dragAnnotation.opacity = 0.75;
    // dragAnnotation.text = 'Drag vertically on plot to zoom, on yaxis to scroll';
    // dragAnnotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    // dragAnnotation.font.color = 'grey';
    // unauthorisedAnnotations.push(dragAnnotation);
    //
    //
    // tracesAccomodatedFig2.forEach((trace) => {
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = +trace.x[trace.x.length - 1];
    //   annotation.y = +trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   annotation.showarrow = true;
    //   annotation.ax = +10;
    //   annotation.arrowcolor = CHART_COLORS_BY_REGION[trace.name] || 'grey';;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //magic number!!!
    //   accomodatedAnnotations.push(annotation);
    //
    //   // bothAnnotations.push(Object.assign({}, annotation));
    // })
    //
    // accomodatedAnnotations[1].y = accomodatedAnnotations[1].y + accomodatedAnnotations[0].y;
    // accomodatedAnnotations[2].y = accomodatedAnnotations[2].y + accomodatedAnnotations[1].y;
    // accomodatedAnnotations[3].y = accomodatedAnnotations[3].y + accomodatedAnnotations[2].y;
    // accomodatedAnnotations[0].ay = 15;
    // accomodatedAnnotations[1].ay = 0;
    // accomodatedAnnotations[2].ay = -10;
    // accomodatedAnnotations[3].ay = -15;
    // accomodatedAnnotations[4].visible = false;
    // accomodatedAnnotations[5].visible = false;
    // accomodatedAnnotations[6].visible = false;

    //layoutFig2.annotations = unauthorisedAnnotations;

    Plotly.newPlot(divIDFig2, tracesFig2, layoutFig2, {
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
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });