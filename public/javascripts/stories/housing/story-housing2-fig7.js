//Options for chart
const srcPathFig7 = "../data/Stories/Housing/part_2/processed/social_housing_wait_list.csv";
let titleFig7 = "Social Housing Waiting List, by Region (2005-2018)";
const divIDFig7 = "social-housing-wait-chart";

d3.csv(srcPathFig7)
  .then((data) => {

    const regionsFig7 = REGIONS_ORDERED_DUBLIN;
    regionsFig7.push("National");

    let tracesFig7 = [];

    regionsFig7.forEach((region) => {
      tracesFig7.push(getTrace(data, "date", region));
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

      return trace;
    }

    //Set layout options
    let layoutFig7 = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layoutFig7.title.text = titleFig7;
    // layoutFig7.height = 500;
    layoutFig7.showlegend = false;
    layoutFig7.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layoutFig7.xaxis.title = '';
    layoutFig7.xaxis.nticks = 6;
    // layoutFig7.xaxis.range = [1991, 2016];
    layoutFig7.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    // layoutFig7.yaxis.range = [0.1, 150];
    // layoutFig7.yaxis.visible = false;
    layoutFig7.yaxis.title = '';
    layoutFig7.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layoutFig7.margin = {
      l: 0,
      r: 0,
      t: 100 //button row
    };
    // // layoutFig7.hidesources = false;

    // Set annotations per chart with config per trace
    // let houseAnnotations = [];
    // houseTracesFig7.forEach((trace, i) => {
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //   houseAnnotations.push(annotation);
    // })
    //
    // let apartAnnotations = [];
    // apartTracesFig7.forEach((trace, i) => {
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //   apartAnnotations.push(annotation);
    // })
    //
    // let allAnnotations = [];
    // allTracesFig7.forEach((trace, i) => {
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //   allAnnotations.push(annotation);
    // })
    //
    // // //set individual annotation stylings
    // apartAnnotations[0].ay = -7; //Dublin
    // apartAnnotations[1].ay = 5; //Rest
    // apartAnnotations[2].ay = 7; //Nat
    //
    // houseAnnotations[0].ay = 5; //Dublin
    // houseAnnotations[1].ay = 10; //Rest
    // houseAnnotations[2].ay = -10; //Nat
    //
    // allAnnotations[0].ay = -2; //Dublin
    // allAnnotations[1].ay = 10; //Rest
    // allAnnotations[2].ay = -15; //Nat

    //Set button menu
    // let updateMenus = [];
    // updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    // updateMenus[0] = Object.assign(updateMenus[0], {
    //   buttons: [{
    //       args: [{
    //           'visible': [true, true, true,
    //             false, false, false,
    //             false, false, false
    //           ]
    //         },
    //         {
    //           'title': titleFig7,
    //           'annotations': houseAnnotations
    //
    //         }
    //       ],
    //       label: 'House',
    //       method: 'update',
    //       execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [false, false, false,
    //             true, true, true,
    //             false, false, false
    //           ]
    //         },
    //         {
    //           'title': titleFig7,
    //           'annotations': apartAnnotations
    //         }
    //       ],
    //       label: 'Apartment',
    //       method: 'update',
    //       execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [false, false, false,
    //             false, false, false,
    //             true, true, true
    //           ]
    //         },
    //         {
    //           'title': titleFig7,
    //           'annotations': allAnnotations
    //
    //         }
    //       ],
    //       label: 'Both',
    //       method: 'update',
    //       execute: true
    //     }
    //   ],
    // });
    //
    // layoutFig7.updatemenus = updateMenus;

    //Set default visible traces (i.e. traces on each chart)
    // tracesFig7.map((t, i) => {
    //   if (i < 3) return t.visible = true;
    //   else return t.visible = false;
    // });
    // layoutFig7.annotations = allAnnotations;

    Plotly.newPlot(divIDFig7, tracesFig7, layoutFig7, {
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
        filename: 'Dublin Dashboard - ' + titleFig7,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });