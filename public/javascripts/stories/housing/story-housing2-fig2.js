//Options for chart
const srcPathFig2 = "../data/Stories/Housing/part_2/processed/E1071.csv";
const titleFig2 = "Housing Stock and Vacancy Rates (1991-2016)";
const divIDFig2 = "vacant-housing-chart";
// const regionsFig2 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow", "State"];

d3.csv(srcPathFig2)
  .then((data) => {
    let dataByRegion = d3.nest()
      .key((d) => {
        return d["region"];
      })
      .object(data);
    const regions = Object.keys(dataByRegion);
    console.log(regions);

    // //traces for chart
    let vacantCountTraces = [];
    regions.forEach((regionName, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);

      trace.x = dataByRegion[regionName].map((v) => {
        return v.date;
      });

      trace.y = dataByRegion[regionName].map((v) => {
        return v["Vacant (Number)"];
      });

      trace.name = regionName + " vacant houses";
      trace.type = 'line';
      trace.stackgroup = 'one';
      // trace.base = 'relative';
      //reassign colour to -defocus some traces
      // trace.opacity = CHART_OPACITY_BY_REGION[regionName] || 0.5;
      trace.fillcolor = Object.assign({}, TRACES_DEFAULT.line);
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.opacity = 0.1;
      trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'


      trace.text = trace.y.map(String);
      trace.textposition = "inside";
      trace.textfont = {
        family: null,
        size: null,
        color: '#ffffff'
      }
      // trace.hoverinfo = 'none';

      vacantCountTraces.push(trace);
    });

    let stockTraces = [];
    regions.forEach((regionName) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionName + " total houses";
      trace.type = 'line';
      trace.stackgroup = 'one';
      // trace.base = 'relative';
      //reassign colour to -defocus some traces
      trace.opacity = 0.5;
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey';
      trace.fill = CHART_COLORS_BY_REGION[regionName] || 'grey';
      trace.x = dataByRegion[regionName].map((v) => {
        return v.date;
      });

      trace.y = dataByRegion[regionName].map((v) => {
        return v["Total housing stock (Number)"];
      });
      trace.text = trace.y.map(String);
      trace.textposition = "inside";
      trace.textfont = {
        family: null,
        size: null,
        color: '#ffffff'
      }
      // trace.hoverinfo = 'none';
      stockTraces.push(trace);
    });



    let vacantRateTraces = [];
    regions.forEach((regionName, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = regionName;
      trace.mode = 'lines';
      //reassign colour to -defocus some traces
      // (i < 1) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.color = CHART_COLORS_BY_REGION[regionName] || 'grey'
      trace.x = dataByRegion[regionName].map((v) => {
        return v.date;
      });

      trace.y = dataByRegion[regionName].map((v) => {
        return v["Vacancy rate (%)"];
      });

      vacantRateTraces.push(trace);
    });
    //This seems bad as it is order dependant
    let traces = vacantCountTraces
      .concat(stockTraces)
      .concat(vacantRateTraces);

    //Set default visible traces (i.e. traces on each chart)
    traces.map((t) => {
      if (t.name === "State total houses" || t.name === "State vacant houses") return t.visible = true;
      else return t.visible = false;
    });


    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig2;
    layout.height = 500;
    layout.showlegend = false;
    layout.barmode = 'relative';
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = '';
    // layout.xaxis.nticks = 5;
    layout.xaxis.range = [1989, 2018];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    // layout.yaxis.range = [0.1, 2100000];
    // layout.yaxis.visible = false;
    layout.yaxis.title = '';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 0,
      r: 150,
      t: 100, //button row
      b: 20
    };
    // layout.hidesources = false;

    let stateAnnotations = [];
    let dublinAnnotations = [];
    // traces.forEach((trace, i) => {
    //   let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    //   annotation.x = trace.x[trace.x.length - 1];
    //   annotation.y = trace.y[trace.y.length - 1];
    //   annotation.text = trace.name;
    //   //de-focus some annotations
    //   //TODO: function for this
    //   // (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
    //   annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
    //   annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey';
    //   if (trace.name === "State total houses" || trace.name === "State vacant houses") {
    //     stateAnnotations.push(annotation);
    //     console.log(annotation);
    //   } else {
    //     dublinAnnotations.push(annotation);
    //   }
    // })
    // //set individual annotation stylings
    // apartAnnotations[0].ay = 0; //Dublin
    // apartAnnotations[1].ay = 0; //Rest
    // apartAnnotations[2].ay = 0; //Nat
    //
    // stateAnnotations[0].ay = 5; //Dublin
    // stateAnnotations[1].ay = 10; //Rest
    // stateAnnotations[2].ay = -10; //Nat
    //
    // allAnnotations[0].ay = -2; //Dublin
    // allAnnotations[1].ay = 10; //Rest
    // allAnnotations[2].ay = -15; //Nat

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [true, false, false, false, false, false, false, false,
                true, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false
              ]
            },
            {
              'title': titleFig2,
              'annotations': null

            }
          ],
          label: 'State Count',
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [false, true, true, true, true, true, true, true,
                false, true, true, true, true, true, true, true,
                false, false, false, false, false, false, false, false
              ]
            },
            {
              'title': titleFig2,
              'annotations': dublinAnnotations
            }
          ],
          label: 'Dublin Area Count',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
                true, true, true, true, true, true, true, true
              ]
            },
            {
              'title': titleFig2,
              'annotations': dublinAnnotations
            }
          ],
          label: 'Vacancy % Rate',
          method: 'update',
          execute: true
        },
      ],
    });

    layout.updatemenus = updateMenus;
    layout.annotations = stateAnnotations;

    Plotly.newPlot(divIDFig2, traces, layout, {
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
        filename: 'Dublin Dashboard - ' + titleFig2,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });