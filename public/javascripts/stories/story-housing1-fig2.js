//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig2 = "../data/Stories/Housing/",
  srcFileFig2 = "housetype.csv";

const regionsFig2 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
const typesFig2 = ["Detached house", "Semi-detached house", "Terraced house",
  "Flat or apartment in a purpose- built block", "Flat or apartment in a converted house or commercial building and bedsits",
  "Not stated"
];
// let titleFig2 = "Growth in population and households 1991-2016";
// const popTitle = "Population of Dublin and Surrounding Areas (1991-2016)";
// const houseTitle = "Number of Households in Dublin and Surrounding Areas (1991-2016)";
// const popRateTitle = "Population % Change in Dublin and Surrounding Areas (1991-2016)";
// const houseRateTitle = "Households % Change in Dublin and Surrounding Areas (1991-2016)";
// titleFig2 = popTitle; //set default on load
// const divIDFig2 = "population-households-chart";

d3.csv(srcPathFig2 + srcFileFig2)
  .then((data) => {
    //Data per region- use the array of region variable values
    let dataByRegion = [];
    regionsFig2.forEach((regionName) => {
      dataByRegion.push(data.filter((v) => {
        return v.region === regionName;
      }));
    });

    //Traces
    //traces for chart 1
    let chartTraces = getTracesForVariable(dataByRegion, 'Detached house');
    console.log(JSON.stringify(chartTraces));

    function getTracesForVariable(dataByRegion_, variable) {
      let traces = [];
      dataByRegion_.forEach((regionData, i) => {
        let trace = Object.assign({}, TRACES_DEFAULT);
        trace.name = regionData[0].region;
        //reassign colour to -defocus some traces
        (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
        trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
        (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!
        //.filter(function(obj) {
        // return obj.selected;
        // }).map(function(obj) { return obj.id; });
        trace.x = regionData.filter((rd) => {
          return rd.type === 'Detached house'
        }).map((v) => {
          return v[`date`];
        });
        trace.y = regionData.filter((rd) => {
          return rd.type === 'Detached house'
        }).map((v) => {
          return v[`value`];
        });

        traces.push(trace);
      });
      return traces;
    }

    //traces for chart 2
    // let houseTraces = [];
    // dataByRegion.forEach((regionData, i) => {
    //   let trace = Object.assign({}, TRACES_DEFAULT);
    //   trace.name = regionData[0].region;
    //   //reassign colour to -defocus some traces
    //   (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
    //   trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    //   (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!
    //
    //   trace.x = regionData.map((v) => {
    //     return v.date;
    //   });
    //
    //   //chart b- households
    //   trace.y = regionData.map((v) => {
    //     return v.households;
    //   });
    //
    //   houseTraces.push(trace);
    //   // console.log("trace house " + JSON.stringify(trace));
    // });
    // //traces for chart c
    // let popRateTraces = [];
    // dataRateByRegion.forEach((regionData, i) => {
    //   let trace = Object.assign({}, TRACES_DEFAULT);
    //   trace.name = regionData[1].region;
    //   //reassign colour to -defocus some traces
    //   (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
    //   trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    //   (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!
    //
    //   trace.x = regionData.map((v) => {
    //     return v.date;
    //   });
    //
    //   trace.y = regionData.map((v) => {
    //     return v.population_rate;
    //   });
    //
    //   popRateTraces.push(trace);
    // });
    // //traces for chart d
    // let houseRateTraces = [];
    // dataRateByRegion.forEach((regionData, i) => {
    //   let trace = Object.assign({}, TRACES_DEFAULT);
    //   trace.name = regionData[1].region;
    //   //reassign colour to -defocus some traces
    //   (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
    //   trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    //   (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!
    //
    //   trace.x = regionData.map((v) => {
    //     return v.date;
    //   });
    //
    //   trace.y = regionData.map((v) => {
    //     return v.households_rate;
    //   });
    //
    //   houseRateTraces.push(trace);
    //   // console.log("trace house " + JSON.stringify(trace));
    // });


    //Set layout options
    // let chartLayout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    // chartLayout.title.text = titleFig2;
    // chartLayout.height = 500;
    // chartLayout.showlegend = false;
    // chartLayout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    // chartLayout.xaxis.range = [1991, 2016];
    // chartLayout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    // chartLayout.yaxis.title = '';
    // chartLayout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    // chartLayout.margin = {
    //   l: 0,
    //   r: 200, //Dun Laoghaire!!!
    //   t: 100 //button row
    // };
    //
    // // chartLayout.hidesources = false;
    //
    // //Set annotations per chart with config per trace
    //
    // let popAnnotations = [];
    // chartTraces1.forEach((trace, i) => {
    //   // console.log("trace: " + JSON.stringify(trace));
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //
    //   // console.log(annotation.font.color);
    //   popAnnotations.push(annotation);
    // })
    //
    // let houseAnnotations = [];
    // houseTraces.forEach((trace, i) => {
    //   // console.log("trace: " + JSON.stringify(trace));
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //
    //   // console.log(annotation.font.color);
    //   houseAnnotations.push(annotation);
    // })
    //
    // let popRateAnnotations = [];
    // popRateTraces.forEach((trace, i) => {
    //   // console.log("trace: " + JSON.stringify(trace));
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //
    //   // console.log(annotation.font.color);
    //   popRateAnnotations.push(annotation);
    // })
    //
    // let houseRateAnnotations = [];
    // houseRateTraces.forEach((trace, i) => {
    //   // console.log("trace: " + JSON.stringify(trace));
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
    //
    //   // console.log(annotation.font.color);
    //   houseRateAnnotations.push(annotation);
    // })
    //
    // //set individual annotation stylings
    // //TODO: be better! Don't use array index for access
    // popAnnotations[1].ay = 6; //move DLR down
    // popAnnotations[2].ay = -4; //move Fingal up
    // popAnnotations[3].ay = 4; //move SD down
    // popAnnotations[4].ay = -6; //move K up
    // popAnnotations[5].ay = 4; //move M down
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
    // chartLayout.annotations = popAnnotations; //set default
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
    //           'annotations': popAnnotations,
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
    //   x: 0,
    //   xanchor: 'left',
    //   yref: 'container',
    //   y: 1.05, //place above plot area with >1.0
    //   yanchor: 'bottom'
    // }];
    //
    // chartLayout.updatemenus = updateMenus;
    //
    //
    // let chartTraces = chartTraces1
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
    // Plotly.newPlot(divIDFig2, chartTraces, chartLayout, {
    //   modeBar: {
    //     orientation: 'v',
    //     bgcolor: 'black',
    //     color: null,
    //     activecolor: null
    //   },
    //   modeBarButtons: MULTILINE_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
    //   displayModeBar: true,
    //   displaylogo: false,
    //   showSendToCloud: false,
    //   responsive: true,
    //   toImageButtonOptions: {
    //     filename: 'Dublin Dashboard - ' + titleFig2,
    //     width: null,
    //     height: null,
    //     format: 'png'
    //   }
    // });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });