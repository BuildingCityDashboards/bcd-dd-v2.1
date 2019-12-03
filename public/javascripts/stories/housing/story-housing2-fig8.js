//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig8 = "../data/Stories/Housing/part_2/processed/",
  srcFileFig8 = "rent_supplement.csv";
const titleFig8 = "Rent Supplement Recipients (2008-2018)";
const divIDFig8 = "rent-suppliment-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig8 + srcFileFig8)
  .then((data) => {
    //Traces
    let traces = [];
    let trace = Object.assign({}, TRACES_DEFAULT);
    trace.name = "No. of Recipients";
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker);

    trace.x = data.map((v) => {
      return v["date"];
    });

    trace.y = data.map((v) => {
      return v["value"];
    });

    traces.push(trace);

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig8;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = '';
    layout.xaxis.range = [2008, 2018];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.titlefont = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.titlefont);
    layout.yaxis.titlefont.size = 16; //bug? need to call this
    // layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title);
    layout.yaxis.title = '';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 60,
      r: 120, //annotations space
      t: 40
    };
    layout.colorway = CHART_COLORWAY_VARIABLES;

    let annotations = [];
    traces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      annotation.font.color = CHART_COLORWAY_VARIABLES[i];
      annotations.push(annotation);
    })

    //Set default view annotations
    layout.annotations = annotations; //set default

    Plotly.newPlot(divIDFig8, traces, layout, {
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
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });