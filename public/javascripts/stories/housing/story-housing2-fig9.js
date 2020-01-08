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

    let traceOriginal = Object.assign({}, TRACES_DEFAULT);
    traceOriginal.name = "Original Units Built";
    traceOriginal.type = 'bar';
    traceOriginal.orientation = 'h';
    // traceOriginal.stackgroup = 'three';
    // traceOriginal.text = traceOriginal.name;
    // traceOriginal.hovertext = traceOriginal.name;
    traceOriginal.hoverinfo = "x";
    traceOriginal.marker = Object.assign({}, TRACES_DEFAULT.marker);

    traceOriginal.x = data.map((v) => {
      return v["Original Units"] || 0;
    });

    traceOriginal.y = data.map((v) => {
      return v["Estate"] + ' ';
    });



    let trace2008 = Object.assign({}, TRACES_DEFAULT);
    trace2008.name = "Units Occupied July 2008";
    trace2008.type = 'bar';
    trace2008.orientation = 'h';
    // trace2008.stackgroup = 'two';
    trace2008.text = trace2008.name;
    trace2008.hoverinfo = "x";
    trace2008.marker = Object.assign({}, TRACES_DEFAULT.marker);
    trace2008.x = data.map((x) => {
      return x["Units Occupied July 2008 "] || 0;
    });

    trace2008.y = data.map((y) => {
      return y["Estate"] + ' ';
    });

    let trace2013 = Object.assign({}, TRACES_DEFAULT);
    trace2013.name = "Units Occupied March 2013";
    trace2013.type = 'bar';
    trace2013.orientation = 'h';
    // trace2013.stackgroup = 'one';

    // trace2013.text = trace2013.name;
    // trace2013.hoverinfo = 'text';
    trace2013.hoverinfo = "x";
    trace2013.marker = Object.assign({}, TRACES_DEFAULT.marker);

    trace2013.x = data.map((v) => {
      return v["Units Occupied March 2013"] || 0;
    });

    trace2013.y = data.map((v) => {
      return v["Estate"] + ' ';
    });

    let traces = [trace2013, trace2008, traceOriginal];

    //Set layout options
    let layout = Object.assign({}, ROW_CHART_LAYOUT);
    layout.mode = 'bars';
    layout.height = 600;
    layout.barmode = 'group';
    layout.bargroupgap = 0;
    layout.colorway = CHART_COLORWAY_VARIABLES;
    layout.title = Object.assign({}, ROW_CHART_LAYOUT.title);
    layout.title.text = titleFig9;
    layout.showlegend = true;
    layout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend);
    layout.legend.xanchor = 'right';
    layout.legend.y = 0.1;
    layout.legend.traceorder = 'reversed';
    layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis);
    layout.xaxis.title = "Number of Housing Units";
    layout.xaxis.range = [0, 430];
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


    // let annotations = [];
    // traces.forEach((trace, i) => {
    //   // console.log("trace: " + i + " " + JSON.stringify(trace));
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.text = traces[i].name;
    //   annotation.y = "St Theresa's Gardens "; //trace.y[trace.y.length - 1];
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   annotation.font.color = "white"; //CHART_COLORWAY_VARIABLES[i];
    //   annotation.font.size = 14; //CHART_COLORWAY_VARIABLES[i];
    //   annotation.showarrow = false;
    //   annotation.xanchor = 'left';
    //   annotation.x = 5;
    //   annotations.push(annotation);
    // })
    //
    //
    // annotations[0].text = "Occupied " + traces[0].name;
    // annotations[1].text = "Occupied " + traces[1].name;
    //
    // annotations[0].yshift = -16;
    // annotations[1].yshift = 0;
    // annotations[2].yshift = 16;
    //Set default view annotations
    // layout.annotations = annotations; //set default

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