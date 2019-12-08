//Options for chart
const srcPathFig2 = "../data/Stories/Housing/part_3/processed/homeless_figures_parsed.csv";
let titleFig2 = "Number of adults with children in emergency accommodation in Dublin (2014-2018)";
const divIDFig2 = "homelessness-chart";

d3.csv(srcPathFig2)
  .then((data) => {

    let tracesFig2 = [];
    tracesFig2.push(getTrace(data, "date", "Individual adults"));
    tracesFig2.push(getTrace(data, "date", "Dependents"));

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = yVar;
      trace.stackgroup = 'one';
      trace.visible = true;
      trace.x = data.map((x) => {
        return x[xVar];
      });
      trace.y = data.map((y) => {
        return +y[yVar];
      });
      // trace.connectgaps = true;
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
    layoutFig2.height = 500;
    layoutFig2.showlegend = false;
    layoutFig2.xaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.xaxis);
    layoutFig2.xaxis.nticks = 7;
    layoutFig2.xaxis.title = '';
    layoutFig2.xaxis.range = ['Jun-14', 'Nov-18'];
    layoutFig2.yaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.yaxis);
    layoutFig2.yaxis.range = [1, 5000];
    // layoutFig2.yaxis.visible = false;
    layoutFig2.yaxis.title = '';
    layoutFig2.margin = Object.assign({}, STACKED_AREA_CHART_LAYOUT.margin);
    layoutFig2.margin = {
      l: 0,
      r: 100,
      t: 100 //button row
    };
    layoutFig2.colorway = CHART_COLORWAY_VARIABLES;

    let annotations = [];
    tracesFig2.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name.split('Rev')[0];
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORWAY_VARIABLES[i]; //Is this order smae as fetching from object in trace?
      annotation.text = trace.name;
      annotations.push(annotation);

    })
    annotations[1].y = annotations[0].y + annotations[1].y

    layoutFig2.annotations = annotations;

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