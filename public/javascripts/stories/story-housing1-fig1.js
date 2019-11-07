//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig1 = "../data/Stories/Housing/",
  srcFileFig11 = "pop_house.csv",
  srcFileFig12 = "pop_house_rate_new.csv";
const regionsFig1 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
let titleFig1 = "Growth in population and households 1991-2016";
const popTitle = "Population of Dublin and surrounding areas 1991-2016";
const houseTitle = "Number of households in Dublin and surrounding areas 1991-2016";
const popRateTitle = "Population % change in Dublin and surrounding areas 1991-2016";
const houseRateTitle = "Households % change in Dublin and surrounding areas 1991-2016";
titleFig1 = popTitle; //set default on load
const divIDFig1 = "population-households-chart";


//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data
Promise.all([
    d3.csv(srcPathFig1 + srcFileFig11),
    d3.csv(srcPathFig1 + srcFileFig12)
  ]).then((data) => {
    //Data per region- use the array of region variable values
    let dataByRegion = [];
    let dataRateByRegion = [];
    regionsFig1.forEach((regionName) => {
      dataByRegion.push(data[0].filter((v) => {
        return v.region === regionName;
      }));
      dataRateByRegion.push(data[1].filter((v) => {
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

      popTraces.push(trace);
    });
    //traces for chart b
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

      //chart b- households
      trace.y = regionData.map((v) => {
        return v.households;
      });

      houseTraces.push(trace);
      // console.log("trace house " + JSON.stringify(trace));
    });
    //traces for chart c
    let popRateTraces = [];
    dataRateByRegion.forEach((regionData, i) => {
      let trace = Object.assign({}, TRACES_COMMON);
      trace.name = regionData[1].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_COMMON.marker);
      (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = regionData.map((v) => {
        return v.date;
      });

      trace.y = regionData.map((v) => {
        return v.population_rate;
      });

      popRateTraces.push(trace);
    });
    //traces for chart d
    let houseRateTraces = [];
    dataRateByRegion.forEach((regionData, i) => {
      let trace = Object.assign({}, TRACES_COMMON);
      trace.name = regionData[1].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_COMMON.marker);
      (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = regionData.map((v) => {
        return v.date;
      });

      trace.y = regionData.map((v) => {
        return v.households_rate;
      });

      houseRateTraces.push(trace);
      // console.log("trace house " + JSON.stringify(trace));
    });


    //Set layout options
    let chartLayout = Object.assign({}, multilineChartLayout);
    chartLayout.title.text = titleFig1;
    chartLayout.showlegend = false;
    chartLayout.xaxis = Object.assign({}, multilineChartLayout.xaxis);
    chartLayout.xaxis.range = [1991, 2016];
    chartLayout.margin = Object.assign({}, multilineChartLayout.margin);
    chartLayout.margin = {
      l: 0,
      r: 200, //Dun Laoghaire!!!
      b: 40, //x axis tooltip
      t: 100 //button row
    };

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

    let houseAnnotations = [];
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

    let popRateAnnotations = [];
    popRateTraces.forEach((trace, i) => {
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
      popRateAnnotations.push(annotation);
    })

    let houseRateAnnotations = [];
    houseRateTraces.forEach((trace, i) => {
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
      houseRateAnnotations.push(annotation);
    })

    //set individual annotation stylings
    //TODO: be better! Don't use array index for access
    popAnnotations[1].ay = 6; //move DLR down
    popAnnotations[2].ay = -4; //move Fingal up
    popAnnotations[3].ay = 4; //move SD down
    popAnnotations[4].ay = -6; //move K up
    popAnnotations[5].ay = 4; //move M down

    houseAnnotations[1].ay = -3; //move DLR up
    houseAnnotations[2].ay = -4; //move Fingal up
    houseAnnotations[3].ay = 4; //move SD down
    houseAnnotations[4].ay = 4; //move K down
    houseAnnotations[5].ay = 4; //move M down

    popRateAnnotations[0].ay = 6; // DC
    popRateAnnotations[1].ay = -6; // DLR
    popRateAnnotations[2].ay = -4; // Fingal
    popRateAnnotations[3].ay = 4; // SD
    popRateAnnotations[4].ay = 5; // K
    popRateAnnotations[5].ay = -3; // M

    houseRateAnnotations[1].ay = -5; // DLR
    houseRateAnnotations[2].ay = -4; // Fingal
    houseRateAnnotations[3].ay = 4; // SD
    houseRateAnnotations[4].ay = -7; // K
    houseRateAnnotations[5].ay = 7; // M


    //Set default view annotations
    chartLayout.annotations = popAnnotations; //set default

    //Set button menu
    let updateMenus = [{
      buttons: [{
          args: [{
              'visible': [true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false
              ]
            },
            {
              'titleFig1': popTitle,
              'annotations': popAnnotations,
            }
          ],
          label: 'Population',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false
              ]
            },
            {
              'titleFig1': houseTitle,
              'annotations': houseAnnotations
            }
          ],
          label: 'Households',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                true, true, true, true, true, true, true,
                false, false, false, false, false, false, false
              ]
            },
            {
              'titleFig1': popRateTitle,
              'annotations': popRateAnnotations
            }
          ],
          label: 'Population % change',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                true, true, true, true, true, true, true
              ]
            },
            {
              'titleFig1': houseRateTitle,
              'annotations': houseRateAnnotations
            }
          ],
          label: 'Household % change',
          method: 'update',
          execute: true
        }
      ],
      type: 'buttons',
      direction: 'right',
      font: {
        family: null,
        size: 16,
        color: null
      },
      bordercolor: 'grey',
      pad: {

        't': 0,
        'r': 0,
        'b': 0,
        'l': 0
      },
      showactive: true,
      active: 0,
      x: 0, // -0.05,
      xref: 'container',
      xanchor: 'left',
      yref: 'container',
      y: 1.05, //place above plot area with >1.0
      yanchor: 'bottom'
    }];

    chartLayout.updatemenus = updateMenus;


    let chartTraces = popTraces
      .concat(houseTraces)
      .concat(popRateTraces)
      .concat(houseRateTraces);

    // //Set default visible traces (i.e. traces on each chart)
    chartTraces.map((t, i) => {
      if (i < 7) return t.visible = true;
      else return t.visible = false;
    });


    Plotly.newPlot(divIDFig1, chartTraces, chartLayout, {
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