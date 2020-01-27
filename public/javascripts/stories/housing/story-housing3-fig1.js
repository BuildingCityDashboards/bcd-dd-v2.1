//Options for chart
const srcPathFig1 = "../data/Stories/Housing/part_3/processed/ave_monthly_rent.csv";
let titleFig1 = "Average Price of Rent in Euros by Quarter-Year (2007-2018)";
const divIDFig1 = "rent-prices-chart";

d3.csv(srcPathFig1)
  .then((data) => {

    // console.log(data);

    let tracesFig1 = [];
    tracesFig1.push(getTrace(data, "date", "Dublin"));
    tracesFig1.push(getTrace(data, "date", "State excl. Dublin"));

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = yVar;
      trace.visible = true;
      trace.hoverinfo = 'y';
      trace.x = data.map((x) => {
        return x[xVar];
      });
      trace.y = data.map((y) => {
        // console.log(y[yVar]);
        return y[yVar];
      });
      // trace.connectgaps = true;
      trace.mode = 'lines';
      // trace.name === 'state' ? trace.visible = true : trace.visible = true;
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      REGIONS_ORDERED_DUBLIN.includes(trace.name) ? trace.opacity = 1.0 : trace.opacity = 0.5;
      trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey';
      return trace;
    }

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title);
    layout.title.text = titleFig1;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.nticks = 7;
    layout.xaxis.title = '';
    // layout.xaxis.range = ['Jun-14', 'Nov-18'];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.range = [1, 2000];
    // layout.yaxis.visible = false;
    layout.yaxis.title = '€';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 10,
      r: 100,
      t: 50 //button row
    };

    let annotations = [];
    tracesFig1.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //Is this order smae as fetching from object in trace?
      annotation.text = trace.name;
      annotations.push(annotation);

    })
    // annotations[1].y = annotations[0].y + annotations[1].y

    layout.annotations = annotations;

    Plotly.newPlot(divIDFig1, tracesFig1, layout, {
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