//Options for chart
const srcPathFig1 = "../data/Housing/HPM06.csv";
let titleFig1 = "Monthly Property Price Index, by Type (2005-2018)";
const divIDFig1 = "ppi-monthly-chart";

d3.csv(srcPathFig1)
  .then((data) => {
    let dataByRegion = d3.nest()
      .key((d) => {
        return d["region"];
      })
      .object(data);
    const regions = Object.keys(dataByRegion);
    // console.log(regions);

    // //traces for chart
    let allTracesFig1 = [];
    regions.forEach((regionName, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionName;
      trace.mode = 'lines';
      //reassign colour to -defocus some traces
      (i < 1) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
      trace.x = dataByRegion[regionName].map((v) => {
        return v.date;
      });

      trace.y = dataByRegion[regionName].map((v) => {
        return v.all;
      });

      allTracesFig1.push(trace);
    });

    //Set layout options
    let layoutFig1 = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layoutFig1.title.text = titleFig1;
    layoutFig1.height = 500;
    layoutFig1.showlegend = false;
    layoutFig1.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layoutFig1.xaxis.nticks = 5;
    // layoutFig1.xaxis.range = [1991, 2016];
    layoutFig1.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layoutFig1.yaxis.title = '';
    layoutFig1.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layoutFig1.margin = {
      l: 0,
      r: 100, //Dun Laoghaire!!!
      t: 100 //button row
    };

    // layoutFig1.hidesources = false;

    // //Set annotations per chart with config per trace
    //
    let allAnnotations = [];
    allTracesFig1.forEach((trace, i) => {
      console.log("trace: " + JSON.stringify(trace.name));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      allAnnotations.push(annotation);
    })
    //
    // //set individual annotation stylings
    // //TODO: be better! Don't use array index for access
    // allAnnotations[1].ay = 6; //move DLR down
    // allAnnotations[2].ay = -4; //move Fingal up
    // allAnnotations[3].ay = 4; //move SD down
    // allAnnotations[4].ay = -6; //move K up
    // allAnnotations[5].ay = 4; //move M down
    //
    // houseAnnotations[1].ay = -3; //move DLR up
    // houseAnnotations[2].ay = -4; //move Fingal up
    // houseAnnotations[3].ay = 4; //move SD down
    // houseAnnotations[4].ay = 4; //move K down
    // houseAnnotations[5].ay = 4; //move M down
    //
    // popRateAnnotations[0].ay = 6; // DC
    // popRateAnnotations[1].ay = -6; // DLR
    // popRateAnnotations[2].ay = -4; // Fingal
    // popRateAnnotations[3].ay = 4; // SD
    // popRateAnnotations[4].ay = 5; // K
    // popRateAnnotations[5].ay = -3; // M
    //
    // houseRateAnnotations[1].ay = -5; // DLR
    // houseRateAnnotations[2].ay = -4; // Fingal
    // houseRateAnnotations[3].ay = 4; // SD
    // houseRateAnnotations[4].ay = -7; // K
    // houseRateAnnotations[5].ay = 7; // M
    //
    //
    // //Set default view annotations
    // layoutFig1.annotations = allAnnotations; //set default
    //
    // //Set button menu
    // let updateMenus = [{
    //   buttons: [{
    //       args: [{
    //           'visible': [true, true, true, true, true, true, true,
    //             false, false, false, false, false, false, false,
    //             false, false, false, false, false, false, false,
    //             false, false, false, false, false, false, false
    //           ]
    //         },
    //         {
    //           'title': popTitle,
    //           'annotations': allAnnotations,
    //
    //         }
    //       ],
    //       label: 'Population',
    //       method: 'update',
    //       execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [false, false, false, false, false, false, false,
    //             true, true, true, true, true, true, true,
    //             false, false, false, false, false, false, false,
    //             false, false, false, false, false, false, false
    //           ]
    //         },
    //         {
    //           'title': houseTitle,
    //           'annotations': houseAnnotations
    //         }
    //       ],
    //       label: 'Households',
    //       method: 'update',
    //       execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [false, false, false, false, false, false, false,
    //             false, false, false, false, false, false, false,
    //             true, true, true, true, true, true, true,
    //             false, false, false, false, false, false, false
    //           ]
    //         },
    //         {
    //           'title': popRateTitle,
    //           'annotations': popRateAnnotations
    //
    //         }
    //       ],
    //       label: 'Population % change',
    //       method: 'update',
    //       execute: true
    //     },
    //     {
    //       args: [{
    //           'visible': [false, false, false, false, false, false, false,
    //             false, false, false, false, false, false, false,
    //             false, false, false, false, false, false, false,
    //             true, true, true, true, true, true, true
    //           ]
    //         },
    //         {
    //           'title': houseRateTitle,
    //           'annotations': houseRateAnnotations
    //         }
    //       ],
    //       label: 'Household % change',
    //       method: 'update',
    //       execute: true
    //     }
    //   ],
    //   type: 'buttons',
    //   direction: 'right',
    //   font: {
    //     family: null,
    //     size: 16,
    //     color: null
    //   },
    //   bordercolor: 'grey',
    //   pad: {
    //
    //     't': 0,
    //     'r': 0,
    //     'b': 0,
    //     'l': 0
    //   },
    //   showactive: true,
    //   active: 0,
    //   xref: 'container',
    //   x: 0.0,
    //   xanchor: 'left',
    //   yref: 'container',
    //   y: 1.05, //place above plot area with >1.0
    //   yanchor: 'bottom'
    // }];
    //
    // layoutFig1.updatemenus = updateMenus;
    //
    //
    // let chartTraces = allTracesFig1
    //   .concat(houseTraces)
    //   .concat(popRateTraces)
    //   .concat(houseRateTraces);
    //
    // // //Set default visible traces (i.e. traces on each chart)
    // chartTraces.map((t, i) => {
    //   if (i < 7) return t.visible = true;
    //   else return t.visible = false;
    // });
    //
    //
    layoutFig1.annoations = allAnnotations;

    Plotly.newPlot(divIDFig1, allTracesFig1, layoutFig1, {
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