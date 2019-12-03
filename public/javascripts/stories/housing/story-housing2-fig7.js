//Options for chart
const srcPathFig7 = "../data/Stories/Housing/part_2/processed/social_housing_wait_list.csv";
let titleFig7 = "Social Housing Waiting List, by Region (2005-2018)";
const divIDFig7 = "social-housing-wait-chart";

d3.csv(srcPathFig7)
  .then((data) => {

    const regionsFig7 = REGIONS_ORDERED_DUBLIN;
    regionsFig7.push("National");
    const marginRNat = 75;
    const marginRDub = 185;
    const marginRBoth = 75;

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
      trace.name === 'National' ? trace.visible = true : trace.visible = false;
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey';
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
    layoutFig7.xaxis.range = [1991, 2018];
    layoutFig7.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    // layoutFig7.yaxis.range = [0.1, 150];
    // layoutFig7.yaxis.visible = false;
    layoutFig7.yaxis.title = '';
    layoutFig7.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layoutFig7.margin = {
      l: 0,
      r: marginRNat,
      t: 100 //button row
    };
    // // layoutFig7.hidesources = false;

    // Set annotations per chart with config per trace
    let nationalAnnotations = [];
    let dublinAnnotations = [];
    let bothAnnotations = [];

    tracesFig7.forEach((trace) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //magic number!!!

      trace.name === 'National' ? annotation.opacity = 0.75 : annotation.opacity = 1.0;
      trace.name === 'National' ? nationalAnnotations.push(annotation) : dublinAnnotations.push(annotation);
      bothAnnotations.push(Object.assign({}, annotation));
    })

    bothAnnotations[0].yshift = 20; //Dublin C
    bothAnnotations[1].yshift = 5; //DLR
    bothAnnotations[2].yshift = 25; //F
    bothAnnotations[3].yshift = 15; //SDCC

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [false, false, false, false, true]
            },
            {
              'title': titleFig7,
              'annotations': nationalAnnotations,
              'margin.r': marginRNat
            }
          ],
          label: 'National',
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [true, true, true, true, false]
            },
            {
              'title': titleFig7,
              'annotations': dublinAnnotations,
              'margin.r': marginRDub
            }
          ],
          label: 'Dublin',
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [true, true, true, true, true]
            },
            {
              'title': titleFig7,
              'annotations': bothAnnotations,
              'margin.r': marginRDub

            }
          ],
          label: 'Both',
          method: 'update',
          // execute: true
        }
      ],
    });

    layoutFig7.updatemenus = updateMenus;
    layoutFig7.annotations = nationalAnnotations;

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