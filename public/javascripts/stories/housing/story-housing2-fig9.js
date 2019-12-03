//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig9 = "../data/Stories/Housing/part_2/processed/",
  srcFileFig9 = "ppp_estates.csv";
const titleFig9 = "Public-Private Partnership (PPP) Households";
const divIDFig9 = "ppp-schemes-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig9 + srcFileFig9)
  .then((data) => {
    //Traces
    let traces = [];
    let traceOriginal = Object.assign({}, TRACES_DEFAULT);
    traceOriginal.name = "Original Units";
    traceOriginal.marker = Object.assign({}, TRACES_DEFAULT.marker);

    traceOriginal.x = data.map((v) => {
      return v["Original Units"];
    });

    traceOriginal.y = data.map((v) => {
      return v["Estate"];
    });
    traceOriginal.type = 'bar';
    traceOriginal.orientation = 'h';


    let trace2008 = Object.assign({}, TRACES_DEFAULT);
    // trace2008.name = "Occupied July 2008";
    trace2008.marker = Object.assign({}, TRACES_DEFAULT.marker);

    trace2008.x = data.map((v) => {
      return v["Units Occupied July 2008 "];
    });

    trace2008.y = data.map((v) => {
      return v["Estate"];
    });
    trace2008.type = 'bar';
    trace2008.orientation = 'h';


    let trace2013 = Object.assign({}, TRACES_DEFAULT);
    // trace2013.name = "Occupied March 2013";
    trace2013.marker = Object.assign({}, TRACES_DEFAULT.marker);

    trace2013.x = data.map((v) => {
      return v["Units Occupied March 2013"];
    });

    trace2013.y = data.map((v) => {
      return v["Estate"];
    });
    trace2013.type = 'bar';
    trace2013.orientation = 'h';

    traces.push(trace2013);
    traces.push(trace2008);
    traces.push(traceOriginal);

    //Set layout options
    let layout = Object.assign({}, ROW_CHART_LAYOUT);
    // layout.mode = 'bars';
    layout.height = 600;
    layout.title.text = titleFig9;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = "Number of Housing Units";
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.titlefont = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.titlefont);
    layout.yaxis.titlefont.size = 16; //bug? need to call this
    // layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title);
    layout.yaxis.title = '';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 60,
      r: 175, //annotations space
      t: 40
    };

    // layout.hidesources = false;

    let annotations = [];
    traces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      annotation.font.color = CHART_COLORWAY[i];
      annotations.push(annotation);
    })

    //Set default view annotations
    layout.annotations = annotations; //set default

    Plotly.newPlot(divIDFig9, traces, layout, {
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
        filename: 'Dublin Dashboard - ' + titleFig9,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });