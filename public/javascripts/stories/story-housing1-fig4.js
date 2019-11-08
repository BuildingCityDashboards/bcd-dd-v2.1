//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig4 = "../data/Stories/Housing/",
  srcFileFig4 = "propertyprices.csv";
const typesFig4 = ["National New", "National Second Hand", "Dublin New", "Dublin Second Hand"];
const titleFig4 = "Property Prices by Type (1975-2016)";
const divIDFig4 = "property-price-growth-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig4 + srcFileFig4)
  .then((data) => {

    //Data per type- use the array of type variable values
    let dataByType = [];
    typesFig4.forEach((typeName) => {
      dataByType.push(data.filter((v) => {
        return v.type === typeName;
      }));
    });

    //Traces
    //traces for chart a
    let ppGrowthTraces = [];
    dataByType.forEach((typeData, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = typeData[0].type;
      //reassign colour to -defocus some traces
      (i > 1) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      (i > 1) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = typeData.map((v) => {
        return v.date;
      });

      trace.y = typeData.map((v) => {
        return v.value;
      });

      ppGrowthTraces.push(trace);
    });


    //Set layout options
    let chartLayout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    chartLayout.title.text = titleFig4;
    chartLayout.showlegend = false;
    chartLayout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    chartLayout.xaxis.range = [1975, 2016];
    chartLayout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    chartLayout.margin = {
      l: 0,
      r: 175, //annotations space
      b: 40, //x axis tooltip
      t: 100 //button row
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
    let ppGrowthAnnotations = [];
    ppGrowthTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i > 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i > 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      ppGrowthAnnotations.push(annotation);
    })

    //Set default view annotations
    chartLayout.annotations = ppGrowthAnnotations; //set default

    Plotly.newPlot(divIDFig4, ppGrowthTraces, chartLayout, {
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
        filename: 'Dublin Dashboard - ' + titleFig4,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });