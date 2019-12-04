//Options for chart
const srcPathFig10a = "../data/Stories/Housing/part_2/processed/traveller_accomodation_accomodated.csv";
const srcPathFig10b = "../data/Stories/Housing/part_2/processed/traveller_accomodation_unauthorised.csv";
let titleFig10 = "Traveller Accomodation (2002-2013)";
const divIDFig10 = "traveller-accomodation-chart";

d3.csv(srcPathFig10a)
  .then((data) => {

    const regionsFig10 = REGIONS_ORDERED_DUBLIN;
    regionsFig10.push("state");
    const marginRNat = 75;
    const marginRDub = 185;
    const marginRBoth = 75;

    let tracesFig10 = [];

    regionsFig10.forEach((region) => {
      tracesFig10.push(getTrace(data, "date", region));
    })

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = yVar;
      trace.x = data.map((x) => {
        return x[xVar];
      });
      trace.y = data.map((y) => {
        return y[yVar];
      });
      trace.connectgaps = true;
      trace.mode = 'lines';
      trace.name === 'state' ? trace.visible = true : trace.visible = true;
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey';
      return trace;
    }

    //Set layout options
    let layoutFig10 = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layoutFig10.title.text = titleFig10;
    // layoutFig10.height = 500;
    layoutFig10.showlegend = false;
    layoutFig10.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layoutFig10.xaxis.title = '';
    layoutFig10.xaxis.nticks = 6;
    layoutFig10.xaxis.range = [2002, 2013];
    layoutFig10.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    // layoutFig10.yaxis.range = [0.1, 150];
    // layoutFig10.yaxis.visible = false;
    layoutFig10.yaxis.title = '';
    layoutFig10.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layoutFig10.margin = {
      l: 0,
      r: marginRNat,
      t: 100 //button row
    };
    // // layoutFig10.hidesources = false;

    // Set annotations per chart with config per trace
    let stateAnnotations = [];
    let dublinAnnotations = [];
    let bothAnnotations = [];

    tracesFig10.forEach((trace) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //magic number!!!

      trace.name === 'state' ? annotation.opacity = 0.75 : annotation.opacity = 1.0;
      trace.name === 'state' ? stateAnnotations.push(annotation) : dublinAnnotations.push(annotation);
      bothAnnotations.push(Object.assign({}, annotation));
    })

    bothAnnotations[0].yshift = 20; //Dublin C
    bothAnnotations[1].yshift = 5; //DLR
    bothAnnotations[2].yshift = 25; //F
    bothAnnotations[3].yshift = 15; //SDCC

    //Set button menu
    let updateMenus = [];
    // updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    // updateMenus[0] = Object.assign(updateMenus[0], {
    //   buttons: [{
    //       args: [{
    //           'visible': [false, false, false, false, true]
    //         },
    //         {
    //           'title': titleFig10,
    //           'annotations': stateAnnotations,
    //           'margin.r': marginRNat
    //         }
    //       ],
    //       label: 'state',
    //       method: 'update',
    //       // execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [true, true, true, true, false]
    //         },
    //         {
    //           'title': titleFig10,
    //           'annotations': dublinAnnotations,
    //           'margin.r': marginRDub
    //         }
    //       ],
    //       label: 'Dublin',
    //       method: 'update',
    //       // execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [true, true, true, true, true]
    //         },
    //         {
    //           'title': titleFig10,
    //           'annotations': bothAnnotations,
    //           'margin.r': marginRDub
    //
    //         }
    //       ],
    //       label: 'Both',
    //       method: 'update',
    //       // execute: true
    //     }
    //   ],
    // });

    layoutFig10.updatemenus = updateMenus;
    layoutFig10.annotations = stateAnnotations;

    Plotly.newPlot(divIDFig10, tracesFig10, layoutFig10, {
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
        filename: 'Dublin Dashboard - ' + titleFig10,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });