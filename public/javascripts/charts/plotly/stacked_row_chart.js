//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig9 = "../data/Stories/Housing/part_2/processed/",
  srcFileFig9 = "ppp_estates.csv";
const titleFig9 = "Public-Private Partnership (PPP) Housing Units";
const divIDFig9 = "ppp-schemes-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig9 + srcFileFig9)
  .then((data) => {
    //Traces
    let traces = [];

    let trace2008 = Object.assign({}, TRACES_DEFAULT);
    trace2008.name = "July 2008";
    trace2008.type = 'bar';
    trace2008.orientation = 'h';
    trace2008.stackgroup = 'one';
    trace2008.text = trace2008.name;
    trace2008.hoverinfo = "x+name";
    trace2008.marker = Object.assign({}, TRACES_DEFAULT.marker);
    trace2008.x = data.map((x) => {
      return x["Units Occupied July 2008 "];
    });

    trace2008.y = data.map((y) => {
      return y["Estate"];
    });

    let trace2013 = Object.assign({}, TRACES_DEFAULT);
    trace2013.name = "March 2013";
    trace2013.type = 'bar';
    trace2013.orientation = 'h';
    trace2013.stackgroup = 'one';

    // trace2013.text = trace2013.name;
    // trace2013.hoverinfo = 'text';
    trace2013.hoverinfo = "x+name";
    trace2013.marker = Object.assign({}, TRACES_DEFAULT.marker);

    trace2013.x = data.map((v) => {
      return v["Units Occupied March 2013"];
    });

    trace2013.y = data.map((v) => {
      return v["Estate"];
    });

    let traceOriginal = Object.assign({}, TRACES_DEFAULT);
    traceOriginal.name = "Original Units";
    traceOriginal.type = 'bar';
    traceOriginal.orientation = 'h';
    traceOriginal.stackgroup = 'one';
    // traceOriginal.text = traceOriginal.name;
    // traceOriginal.hovertext = traceOriginal.name;
    traceOriginal.hoverinfo = "x+name";
    traceOriginal.marker = Object.assign({}, TRACES_DEFAULT.marker);

    traceOriginal.x = data.map((v) => {
      return v["Original Units"];
    });

    traceOriginal.y = data.map((v) => {
      return v["Estate"];
    });
    traceOriginal.transforms = [{
      type: 'sort',
      target: 'x',
      order: 'ascending'
    }];


    traces.push(traceOriginal);
    traces.push(trace2008);
    traces.push(trace2013);

    //Set layout options
    let layout = Object.assign({}, ROW_CHART_LAYOUT);
    // layout.mode = 'bars';
    layout.height = 550;
    layout.barmode = 'stack';
    layout.colorway = CHART_COLORWAY_VARIABLES;
    layout.title.text = titleFig9;
    // layout.showlegend = true;
    layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
    layout.xaxis.title = "Number of Housing Units";
    layout.xaxis.range = [0, 750];
    layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis);
    layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont);
    layout.yaxis.titlefont.size = 16; //bug? need to call this
    // layout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title);

    layout.yaxis.title = '';
    layout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin);
    layout.margin = {
      l: 0,
      r: 0, //annotations space
      t: 40
    };


    let annotations = [];
    traces.forEach((trace, i) => {
      // console.log("trace: " + i + " " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      // annotation.x = trace.x[trace.x.length - 1];
      annotation.y = "St Theresa’s gardens"; //trace.y[trace.y.length - 1];
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = "white" //CHART_COLORWAY_VARIABLES[i];
      annotation.font.size = 14 //CHART_COLORWAY_VARIABLES[i];
      annotation.showarrow = true;
      annotation.arrowcolor = CHART_COLORWAY_VARIABLES[i];
      annotation.xanchor = 'left';
      annotations.push(annotation);
    })

    annotations[0].text = traces[0].name;
    annotations[1].text = "Occupied " + traces[1].name;
    annotations[2].text = traces[2].name;

    annotations[0].x = 5; // traces[0].x[traces[0].x.length - 1]; //TODO: remove hardcode
    annotations[1].x = annotations[0].x + 346;
    annotations[2].x = annotations[1].x + 300;
    // console.log(traces[0].x[traces[0].x.length - 1]);
    // annotations[1].x = traces[0].x[traces[0].x.length - 1] + traces[1].x[traces[1].x.length - 1]; //orig
    // annotations[2].yshift = 20; //Orig
    //
    // annotations[0].xshift = 50;
    // annotations[1].xshift = 350;
    // annotations[2].xshift = 550;


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