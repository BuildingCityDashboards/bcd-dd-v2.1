//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig5 = "../data/Stories/Housing/",
  srcFileFig5 = "mortgage_debt.csv";
const typesFig5 = ["Value of debt"];
const titleFig5 = "Residential Mortgage Debt in Billions of Euros (2002-2007)";
const divIDFig5 = "mortgage-debt-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig5 + srcFileFig5)
  .then((data) => {
    //Traces
    let mortgageDebtTraces = [];
    let trace = Object.assign({}, TRACES_DEFAULT);
    trace.name = data[0].type;
    trace.marker = Object.assign({}, TRACES_DEFAULT.marker);

    trace.x = data.map((v) => {
      return v.date;
    });

    trace.y = data.map((v) => {
      return v.value / 1000000000;
    });

    mortgageDebtTraces.push(trace);

    //Set layout options
    let chartLayout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    chartLayout.title.text = titleFig5;
    chartLayout.showlegend = false;
    // chartLayout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    chartLayout.xaxis.range = [2002, 2007];
    chartLayout.yaxis.title = '€Bn';
    chartLayout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    chartLayout.margin = {
      l: 70,
      r: 175, //annotations space
      b: 60, //x axis tooltip
      t: 40
    };

    // chartLayout.hidesources = false;

    //Set annotations per chart with config per trace
    let ANNOTATIONS_DEFAULT = {
      xref: 'x',
      yref: 'y',
      width: null, //text box
      height: null,
      align: 'right', //within textbox
      opacity: 1.0, //default
      font: {
        family: null,
        size: 16,
        color: null //default
      },
      showarrow: true, //need this to use ay offset
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: 0,
      borderpad: 5
    }
    let mortgageDebtAnnotations = [];
    mortgageDebtTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      annotation.font.color = CHART_COLORWAY[i];
      mortgageDebtAnnotations.push(annotation);
    })

    //Set default view annotations
    chartLayout.annotations = mortgageDebtAnnotations; //set default

    Plotly.newPlot(divIDFig5, mortgageDebtTraces, chartLayout, {
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
        filename: 'Dublin Dashboard - ' + titleFig5,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });