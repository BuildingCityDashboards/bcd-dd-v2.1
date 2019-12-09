//Options for chart
const srcPathFig1 = "../data/Stories/Housing/part_3/processed/rent_processed.json";
let titleFig1 = "Average Price of Rent in Dublin (2007-2018)";
const divIDFig1 = "rent-prices-chart";

d3.json(srcPathFig1)
  .then((data) => {

    console.log(data);

    let tracesFig1 = [];
    tracesFig1.push(getTrace(data, "date", "value"));

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = yVar;
      trace.visible = true;
      trace.x = data.map((x) => {

        return x[xVar];
      });
      trace.y = data.map((y) => {
        console.log(y[yVar]);
        return y[yVar];
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
    let layoutFig1 = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layoutFig1.title.text = titleFig1;
    // layoutFig1.height = 500;
    layoutFig1.showlegend = false;
    layoutFig1.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layoutFig1.xaxis.nticks = 7;
    layoutFig1.xaxis.title = '';
    // layoutFig1.xaxis.range = ['Jun-14', 'Nov-18'];
    layoutFig1.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layoutFig1.yaxis.range = [1, 1500];
    // layoutFig1.yaxis.visible = false;
    layoutFig1.yaxis.title = '';
    layoutFig1.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layoutFig1.margin = {
      l: 0,
      r: 100,
      t: 50 //button row
    };

    let annotations = [];
    // tracesFig1.forEach((trace, i) => {
    //   // console.log("trace: " + JSON.stringify(trace));
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name.split('Rev')[0];
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   annotation.font.color = CHART_COLORWAY_VARIABLES[i]; //Is this order smae as fetching from object in trace?
    //   annotation.text = trace.name;
    //   annotations.push(annotation);

    // })
    // annotations[1].y = annotations[0].y + annotations[1].y

    layoutFig1.annotations = annotations;

    Plotly.newPlot(divIDFig1, tracesFig1, layoutFig1, {
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
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });