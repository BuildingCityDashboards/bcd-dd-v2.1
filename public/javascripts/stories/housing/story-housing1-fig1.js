//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig1 = "../data/Stories/Housing/part_1/",
  srcFileFig11 = "pop_house.csv";
const regionsFig1 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
let titleFig1 = "Growth in population and households 1991-2016";
const popTitle = "Population of Dublin and Surrounding Areas (1991-2016)";
const houseTitle = "Number of Households in Dublin and Surrounding Areas (1991-2016)";
const popRateTitle = "Population % Change in Dublin and Surrounding Areas (1991-2016)";
const houseRateTitle = "Households % Change in Dublin and Surrounding Areas (1991-2016)";
titleFig1 = popTitle; //set default on load
const divIDFig1 = "population-households-chart";


d3.csv(srcPathFig1 + srcFileFig11)
  .then((data) => {
    //Data per region- use the array of region variable values
    let dataByRegion = [];
    let dataRateByRegion = [];
    regionsFig1.forEach((regionName) => {
      dataByRegion.push(data.filter((v) => {
        return v.region === regionName;
      }));
      dataRateByRegion.push(data.filter((v) => {
        return v.region === regionName;
      }));
    });

    //Traces
    //traces for chart a
    let popTraces = [];
    dataByRegion.forEach((regionData, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionData[0].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
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
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionData[0].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
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
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionData[0].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = regionData.map((v) => {
        return v.date;
      });

      trace.y = regionData.map((v) => {
        return v["population rate"];
      });

      popRateTraces.push(trace);
    });
    //traces for chart d
    let houseRateTraces = [];
    dataRateByRegion.forEach((regionData, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionData[1].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = regionData.map((v) => {
        return v.date;
      });

      trace.y = regionData.map((v) => {
        return v["households rate"];
      });
      houseRateTraces.push(trace);
    });

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title);
    layout.title.text = titleFig1;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis.title);
    layout.xaxis.range = [1991, 2016];
    layout.xaxis.tickmode = 'array';
    layout.xaxis.tickvals = [1991, 1996, 2002, 2006, 2011, 2016];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title);
    layout.yaxis.range = [10, 600000];
    layout.yaxis.tickmode = 'array';
    layout.yaxis.tickvals = [200000, 400000];
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin.r = 185; //Dun Laoghaire!!!
    layout.legend = Object.assign({}, MULTILINE_CHART_LAYOUT.legend);

    //Set annotations per chart with config per trace
    let popAnnotations = [];
    popTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      popAnnotations.push(annotation);
    })

    let houseAnnotations = [];
    houseTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      houseAnnotations.push(annotation);
    })

    let popRateAnnotations = [];
    popRateTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      popRateAnnotations.push(annotation);
    })

    let houseRateAnnotations = [];
    houseRateTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      houseRateAnnotations.push(annotation);
    })

    //set individual annotation stylings
    //TODO: be better! Don't use array index for access
    popAnnotations[1].yshift = -6; //move DLR down
    popAnnotations[2].yshift = 4; //move Fingal up
    popAnnotations[3].yshift = -4; //move SD down
    popAnnotations[4].yshift = 6; //move K up
    popAnnotations[5].yshift = -8; //move M down

    houseAnnotations[1].yshift = 3; //move DLR up
    houseAnnotations[2].yshift = 4; //move Fingal up
    houseAnnotations[3].yshift = -4; //move SD down
    houseAnnotations[4].yshift = -4; //move K down
    houseAnnotations[5].yshift = -8; //move M down

    popRateAnnotations[0].yshift = -6; // DC
    popRateAnnotations[1].yshift = 6; // DLR
    popRateAnnotations[2].yshift = 4; // Fingal
    popRateAnnotations[3].yshift = -4; // SD
    popRateAnnotations[4].yshift = -5; // K
    popRateAnnotations[5].yshift = 3; // M

    houseRateAnnotations[1].yshift = 5; // DLR
    houseRateAnnotations[2].yshift = 4; // Fingal
    houseRateAnnotations[3].yshift = -4; // SD
    houseRateAnnotations[4].yshift = 7; // K
    houseRateAnnotations[5].yshift = -7; // M


    //Set default view annotations
    layout.annotations = popAnnotations; //set default

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false
              ]
            },
            {
              'title': popTitle,
              'annotations': popAnnotations,
              'yaxis.title.text': '',
              // 'yaxis.title.standoff': 0,
              'yaxis.range': [10, 600000],
              'yaxis.tickvals': [200000, 400000]

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
              'title': houseTitle,
              'annotations': houseAnnotations,
              'yaxis.title.text': '',
              // 'yaxis.title.standoff': 0,
              'yaxis.range': [10, 250000],
              'yaxis.tickvals': [100000, 200000]
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
              'title': popRateTitle,
              'annotations': popRateAnnotations,
              'yaxis.title.text': '%',
              // 'yaxis.title.standoff': 20,
              'yaxis.range': [1, 200],
              'yaxis.tickvals': [50, 100, 150]

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
              'title': houseRateTitle,
              'annotations': houseRateAnnotations,
              'yaxis.title.text': '%',
              // 'yaxis.title.standoff': 20,
              // 'updatemenus.pad.l': -60,
              'yaxis.range': [1, 200],
              'yaxis.tickvals': [50, 100, 150]
            }
          ],
          label: 'Household % change',
          method: 'update',
          execute: true
        }
      ]
    });

    layout.updatemenus = updateMenus;


    let chartTraces = popTraces
      .concat(houseTraces)
      .concat(popRateTraces)
      .concat(houseRateTraces);

    // //Set default visible traces (i.e. traces on each chart)
    chartTraces.map((t, i) => {
      if (i < 7) return t.visible = true;
      else return t.visible = false;
    });


    Plotly.newPlot(divIDFig1, chartTraces, layout, {
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

    // //Fix for non-responsive chart height bug
    // //get the height of the chart div before resize (- padding),
    // //then apply this to the svg element of the plot after resize
    // let e = document.getElementById(divIDFig1);
    // let h = parseInt(window.getComputedStyle(e, null).getPropertyValue('height'));
    // let p = parseInt(window.getComputedStyle(e, null).getPropertyValue('padding-top'));
    // let svgH = h - p;
    //
    // window.addEventListener('resize', function() {
    //   let w = parseInt(window.getComputedStyle(e, null).getPropertyValue('width'));
    //   let update = {
    //     height: svgH,
    //     width: w
    //
    //   };
    //   Plotly.relayout(divIDFig1, update);
    // });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });