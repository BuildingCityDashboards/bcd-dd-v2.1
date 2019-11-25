//Options for chart
const srcPathFig2 = "../data/Stories/Housing/part_2/processed/E1071.csv";
let titleFig2 = "Housing Stock and Vacancy Rates (1991-2016)";
const divIDFig2 = "vacant-housing-chart";

d3.csv(srcPathFig2)
  .then((data) => {
    let dataByRegion = d3.nest()
      .key((d) => {
        return d["region"];
      })
      .object(data);
    const regions = Object.keys(dataByRegion);
    // console.log(regions);

    // //traces for chart
    let stockTraces = [];
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
        return v["Total housing stock (Number)"];
      });

      stockTraces.push(trace);
    });

    let apartTraces = [];
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
        return v.apartments;
      });

      apartTraces.push(trace);
    });

    let allTraces = [];
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

      allTraces.push(trace);
    });

    let traces = stockTraces;
    // .concat(apartTraces)
    // .concat(allTraces);


    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig2;
    layout.height = 500;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = '';
    // layout.xaxis.nticks = 5;
    layout.xaxis.range = [1991, 2016];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.range = [0.1, 100000];
    // layout.yaxis.visible = false;
    layout.yaxis.title = '';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 0,
      r: 0,
      t: 100 //button row
    };
    // layout.hidesources = false;

    // Set annotations per chart with config per trace
    let stockAnnotations = [];
    stockTraces.forEach((trace, i) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
      stockAnnotations.push(annotation);
    })

    let apartAnnotations = [];
    apartTraces.forEach((trace, i) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
      apartAnnotations.push(annotation);
    })

    let allAnnotations = [];
    allTraces.forEach((trace, i) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 1) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 1) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!
      allAnnotations.push(annotation);
    })

    // //set individual annotation stylings
    apartAnnotations[0].ay = 0; //Dublin
    apartAnnotations[1].ay = 0; //Rest
    apartAnnotations[2].ay = 0; //Nat

    stockAnnotations[0].ay = 5; //Dublin
    stockAnnotations[1].ay = 10; //Rest
    stockAnnotations[2].ay = -10; //Nat

    allAnnotations[0].ay = -2; //Dublin
    allAnnotations[1].ay = 10; //Rest
    allAnnotations[2].ay = -15; //Nat

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [true, true, true, true, true, true, true, true,
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false
              ]
            },
            {
              'title': titleFig2,
              'annotations': stockAnnotations

            }
          ],
          label: 'Housing & vacancy counts',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false, false,
                true, true, true, true, true, true, true, true,
                false, false, false, false, false, false, false, false
              ]
            },
            {
              'title': titleFig2,
              'annotations': apartAnnotations
            }
          ],
          label: 'Vacancy rate',
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
              'annotations': allAnnotations

            }
          ],
          label: 'Both',
          method: 'update',
          execute: true
        }
      ],
    });

    layout.updatemenus = updateMenus;

    //Set default visible traces (i.e. traces on each chart)
    traces.map((t, i) => {
      if (i < 8) return t.visible = true;
      else return t.visible = false;
    });
    layout.annotations = allAnnotations;

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