//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPath = "../data/Stories/Housing/",
  srcFile1 = "pop_house.csv",
  srcFile2 = "pop_house_rate_new.csv";
const regions = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
let title = "Growth in population and households 1991-2016";
const popTitle = "Population of Dublin and surrounding areas 1991-2016";
const houseTitle = "Number of households in Dublin and surrounding areas 1991-2016";
const popRateTitle = "Population % change in Dublin and surrounding areas 1991-2016";
const houseRateTitle = "Households % change in Dublin and surrounding areas 1991-2016";
title = ''; //set default on load
const divID = "population-households-chart";
const menuStyle = "dropdown";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data
Promise.all([
    d3.csv(srcPath + srcFile1),
    d3.csv(srcPath + srcFile2)
  ]).then((data) => {
    //Data per region
    let dataByRegion = [];
    regions.forEach((regionName) => {
      dataByRegion.push(data[0].filter((v) => {
        return v.region === regionName;
      }));
    });

    //Traces
    //common config
    let TRACES_COMMON = {
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0, //default
      line: {
        shape: 'spline'
      },
      marker: {
        symbol: null,
        color: null, //lines + markers, defaults to colorway
        line: {
          width: null
        }
      },
      name: 'trace',
      visible: true //'legendonly'
    };

    //traces for chart a
    let popTraces = [];
    let houseTraces = [];
    dataByRegion.forEach((regionData, i) => {
      let trace = Object.assign({}, TRACES_COMMON);
      trace.name = regionData[0].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_COMMON.marker);
      (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = regionData.map((v) => {
        return v.date;
      });

      //chart a- population
      trace.y = regionData.map((v) => {
        return v.population;
      });
      console.log("y: " + trace.y);
      popTraces.push(trace);

      //chart b- households
      trace.y = regionData.map((v) => {
        return v.households;
      });

      houseTraces.push(trace);
    });


    //Set layout options
    let chartLayout = Object.assign({}, multilineChartLayout);
    chartLayout.title.text = title;
    chartLayout.showlegend = false;
    // chartLayout.hidesources = false;

    //Set annotations per chart with config per trace
    let ANNOTATIONS_COMMON = {
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
    let popAnnotations = [];
    let houseAnnotations = [];
    popTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_COMMON);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_COMMON.font);
      (i < 4) ? annotation.font.color = colorWay[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      popAnnotations.push(annotation);
    })

    houseTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_COMMON);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_COMMON.font);
      (i < 4) ? annotation.font.color = colorWay[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      houseAnnotations.push(annotation);
    })

    //set individual annotation stylings
    //TODO: be better! Don't use array index for access
    popAnnotations[1].ay = -3; //move DLR up
    popAnnotations[2].ay = -4; //move Fingal up
    popAnnotations[3].ay = 4; //move SD down
    popAnnotations[4].ay = 4; //move K down
    popAnnotations[5].ay = 4; //move M down

    houseAnnotations[1].ay = -3; //move DLR up
    houseAnnotations[2].ay = -4; //move Fingal up
    houseAnnotations[3].ay = 4; //move SD down
    houseAnnotations[4].ay = 4; //move K down
    houseAnnotations[5].ay = 4; //move M down


    //Set default view annotations
    chartLayout.annotations = popAnnotations; //set default

    let chartData = popTraces.concat(houseTraces);

    console.log(chartData);

    Plotly.newPlot(divID, chartData, chartLayout, {
      modeBar: {
        orientation: 'v',
        bgcolor: 'black',
        color: null,
        activecolor: null
      },
      modeBarButtons: multilineModeBarButtonsInclude,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true,
      toImageButtonOptions: {
        filename: 'Dublin Dashboard - ' + title,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });

// let dcRateData = data[1].filter((v) => {
//   return v.region === regions[0];
// });
// let dlrRateData = data[1].filter((v) => {
//   return v.region === regions[1];
// });
// let fRateData = data[1].filter((v) => {
//   return v.region === regions[2];
// });
// let sdRateData = data[1].filter((v) => {
//   return v.region === regions[3];
// });
// let kRateData = data[1].filter((v) => {
//   return v.region === regions[4];
// });
// let mRateData = data[1].filter((v) => {
//   return v.region === regions[5];
// });
// let wRateData = data[1].filter((v) => {
//   return v.region === regions[6];
// });
//
// let dcPopRate = {
//   x: dcRateData.map((v) => {
//     return v.date;
//   }),
//   y: dcRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[0],
//   visible: true //'legendonly'
// };
// let dlrPopRate = {
//   x: dlrRateData.map((v) => {
//     return v.date;
//   }),
//   y: dlrRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[1],
//   visible: true //'legendonly'
// };
// let fPopRate = {
//   x: fRateData.map((v) => {
//     return v.date;
//   }),
//   y: fRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[2],
//   visible: true //'legendonly'
// };
// let sdPopRate = {
//   x: sdRateData.map((v) => {
//     return v.date;
//   }),
//   y: sdRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[3],
//   visible: true //'legendonly'
// };
// let kPopRate = {
//   x: kRateData.map((v) => {
//     return v.date;
//   }),
//   y: kRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 0.5,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[4],
//   visible: true //'legendonly'
// };
// let mPopRate = {
//   x: mRateData.map((v) => {
//     return v.date;
//   }),
//   y: mRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 0.5,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[5],
//   visible: true //'legendonly'
// };
// let wPopRate = {
//   x: wRateData.map((v) => {
//     return v.date;
//   }),
//   y: wRateData.map((v) => {
//     return v.population_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 0.5,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[6],
//   visible: true //'legendonly'
// };
//
// let dcHouseRate = {
//   x: dcRateData.map((v) => {
//     return v.date;
//   }),
//   y: dcRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[0],
//   visible: true //'legendonly'
// };
// let dlrHouseRate = {
//   x: dlrRateData.map((v) => {
//     return v.date;
//   }),
//   y: dlrRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[1],
//   visible: true //'legendonly'
// };
// let fHouseRate = {
//   x: fRateData.map((v) => {
//     return v.date;
//   }),
//   y: fRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[2],
//   visible: true //'legendonly'
// };
// let sdHouseRate = {
//   x: sdRateData.map((v) => {
//     return v.date;
//   }),
//   y: sdRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 1.0,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: null, //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[3],
//   visible: true //'legendonly'
// };
// let kHouseRate = {
//   x: kRateData.map((v) => {
//     return v.date;
//   }),
//   y: kRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 0.5,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[4],
//   visible: true //'legendonly'
// };
// let mHouseRate = {
//   x: mRateData.map((v) => {
//     return v.date;
//   }),
//   y: mRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 0.5,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//
//     }
//   },
//   name: regions[5],
//   visible: true //'legendonly'
// };
// let wHouseRate = {
//   x: wRateData.map((v) => {
//     return v.date;
//   }),
//   y: wRateData.map((v) => {
//     return v.households_rate;
//   }),
//   type: 'scatter',
//   mode: 'lines+markers',
//   opacity: 0.5,
//   line: {
//     shape: 'spline'
//   },
//   marker: {
//     symbol: null,
//     color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
//     line: {
//       width: null,
//       color: null
//     }
//   },
//   name: regions[6],
//   visible: true //'legendonly'
// };
//
// //TODO: could be a beter way of grouping traces per chart?
// //Add traces to chart data (all charts)
// let popData = countTraces.append([
//   dcHouse, dlrHouse, fHouse, sdHouse, kHouse, mHouse, wHouse,
//   dcPopRate, dlrPopRate, fPopRate, sdPopRate, kPopRate, mPopRate, wPopRate,
//   dcHouseRate, dlrHouseRate, fHouseRate, sdHouseRate, kHouseRate, mHouseRate, wHouseRate
// ]);
// console.log(popDatas);
//
//
// //Set default visible traces (i.e. traces on each chart)
// popData.map((t, i) => {
//   if (i < 7) return t.visible = true;
//   else return t.visible = false;
// });
//

//
//
// popAnnotations = [{
//   x: dcData[dcData.length - 1].date,
//   y: dcData[dcData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null, //text box
//   height: null,
//   align: 'right', //within textbox
//   text: regions[0],
//   font: {
//     family: null,
//     size: 16,
//     color: colorWay[0]
//   },
//   showarrow: true, //need this to use ay offset
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 0,
//   borderpad: 5
// }, {
//   x: dlrData[dlrData.length - 1].date,
//   y: dlrData[dlrData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[1],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 5,
//   borderpad: 5
// }, {
//   x: fData[fData.length - 1].date,
//   y: fData[fData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[2],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[2]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -5,
//   borderpad: 5
// }, {
//   x: sdData[sdData.length - 1].date,
//   y: sdData[sdData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[3],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[3]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 5,
//   borderpad: 5
// }, {
//   x: kData[kData.length - 1].date,
//   y: kData[kData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[4],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1] //last element should be grey
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -7,
//   borderpad: 5
// }, {
//   x: mData[mData.length - 1].date,
//   y: mData[mData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[5],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 4,
//   borderpad: 5
// }, {
//   x: wData[wData.length - 1].date,
//   y: wData[wData.length - 1].population,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[6],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 0,
//   borderpad: 5
// }]; //end of pop annotations
//
//
// let popRateAnnotations = [{
//   x: dcRateData[dcRateData.length - 1].date,
//   y: dcRateData[dcRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null, //text box
//   height: null,
//   align: 'right', //within textbox
//   text: regions[0],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[0]
//   },
//   showarrow: true, //need this to use ay offset
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 6,
//   borderpad: 5
// }, {
//   x: dlrRateData[dlrRateData.length - 1].date,
//   y: dlrRateData[dlrRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[1],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -6,
//   borderpad: 5
// }, {
//   x: fRateData[fRateData.length - 1].date,
//   y: fRateData[fRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[2],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[2]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -5,
//   borderpad: 5
// }, {
//   x: sdRateData[sdRateData.length - 1].date,
//   y: sdRateData[sdRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[3],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[3]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 5,
//   borderpad: 5
// }, {
//   x: kRateData[kRateData.length - 1].date,
//   y: kRateData[kRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[4],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1] //last element should be grey
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 2,
//   borderpad: 5
// }, {
//   x: mRateData[mRateData.length - 1].date,
//   y: mRateData[mRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[5],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -2,
//   borderpad: 5
// }, {
//   x: wRateData[wRateData.length - 1].date,
//   y: wRateData[wRateData.length - 1].population_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[6],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 0,
//   borderpad: 5
// }]; //end of pop rate annotations
//
// let houseRateAnnotations = [{
//   x: dcRateData[dcRateData.length - 1].date,
//   y: dcRateData[dcRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null, //text box
//   height: null,
//   align: 'right', //within textbox
//   text: regions[0],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[0]
//   },
//   showarrow: true, //need this to use ay offset
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 2,
//   borderpad: 5
// }, {
//   x: dlrRateData[dlrRateData.length - 1].date,
//   y: dlrRateData[dlrRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[1],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -2,
//   borderpad: 5
// }, {
//   x: fRateData[fRateData.length - 1].date,
//   y: fRateData[fRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[2],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[2]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -5,
//   borderpad: 5
// }, {
//   x: sdRateData[sdRateData.length - 1].date,
//   y: sdRateData[sdRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[3],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[3]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 5,
//   borderpad: 5
// }, {
//   x: kRateData[kRateData.length - 1].date,
//   y: kRateData[kRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[4],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1] //last element should be grey
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: -6,
//   borderpad: 5
// }, {
//   x: mRateData[mRateData.length - 1].date,
//   y: mRateData[mRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[5],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 6,
//   borderpad: 5
// }, {
//   x: wRateData[wRateData.length - 1].date,
//   y: wRateData[wRateData.length - 1].households_rate,
//   xref: 'x',
//   yref: 'y',
//   width: null,
//   height: null,
//   align: 'right',
//   text: regions[6],
//   font: {
//     family: null,
//     size: null,
//     color: colorWay[colorWay.length - 1]
//   },
//   showarrow: true,
//   xanchor: 'left',
//   arrowcolor: '#fff',
//   arrowhead: 7,
//   ax: 0,
//   ay: 0,
//   borderpad: 5
// }]; //end of house rate annotations
//
// chartLayout.annotations = popAnnotations; //set default
//
// //Set button menu
// let updateMenus = [{
//   buttons: [{
//       args: [{
//           //Each variable has 16 traces
//           'visible': [true, true, true, true, true, true, true,
//             false, false, false, false, false, false, false,
//             false, false, false, false, false, false, false,
//             false, false, false, false, false, false, false
//           ]
//         },
//         {
//           'title': null,
//           'annotations': popAnnotations
//         }
//       ],
//       label: popTitle,
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
//           'title': null,
//           'annotations': houseAnnotations
//         }
//       ],
//       label: houseTitle,
//       method: 'update',
//       execute: true
//     },
//     {
//       args: [{
//           'visible': [false, false, false, false, false, false, false,
//             false, false, false, false, false, false, false,
//             true, true, true, true, true, true, true,
//             false, false, false, false, false, false, false,
//           ]
//         },
//         {
//           'title': null,
//           'annotations': popRateAnnotations
//         }
//       ],
//       label: popRateTitle,
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
//           'title': null,
//           'annotations': houseRateAnnotations
//         }
//       ],
//       label: houseRateTitle,
//       method: 'update',
//       execute: true
//     }
//   ],
//   type: menuStyle,
//   direction: 'down',
//   font: {
//     family: null,
//     size: 20,
//     color: null
//
//   },
//   bordercolor: 'lightblue',
//   pad: {
//     'l': 0,
//     't': 0,
//     'b': 0
//   },
//   showactive: true,
//   active: 0,
//   x: -0.05,
//   xref: 'container',
//   xanchor: 'left',
//   yref: 'container',
//   y: 1.05, //place above plot area with >1.0
//   yanchor: 'bottom'
// }];
//
// chartLayout.updatemenus = updateMenus;