//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig9 = "../data/Stories/Housing/",
  srcFileFig9 = "Property_tax.csv";
const typesFig9 = ["Property Related Tax Revenue", "Other Tax Revenue"];
const titleFig9 = "Tax Revenue from Property and Other Sources (1997-2009)";
const divIDFig9 = "property-tax-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig9 + srcFileFig9)
  .then((data) => {

    //Data per type- use the array of type variable values
    let dataByType = [];
    typesFig9.forEach((typeName) => {
      dataByType.push(data.filter((v) => {
        return v.type === typeName;
      }));
    });

    //Traces
    let taxTraces = [];
    dataByType.forEach((typeData, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = typeData[0].type;
      trace.stackgroup = 'one'; //converts to grouped area
      //reassign colour to -defocus some traces
      (i == 0) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      (i == 0) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = typeData.map((v) => {
        return v.date;
      });

      trace.y = typeData.map((v) => {
        return v.value;
      });

      taxTraces.push(trace);
    });


    //Set layout options
    let chartLayout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    chartLayout.title.text = titleFig9;
    chartLayout.showlegend = false;
    chartLayout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    chartLayout.xaxis.range = [1997, 2009];
    chartLayout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    chartLayout.margin = {
      l: 0,
      r: 125, //annotations space
      b: 40, //x axis tooltip
      t: 100 //button row
    };

    //Set annotations per chart with config per trace
    let taxAnnotations = [];
    taxTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name.split('T')[0];
      //de-focus some annotations
      //TODO: function for this
      (i == 0) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i == 0) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      taxAnnotations.push(annotation);
    })

    //Set default view annotations
    chartLayout.annotations = taxAnnotations; //set default

    Plotly.newPlot(divIDFig9, taxTraces, chartLayout, {
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