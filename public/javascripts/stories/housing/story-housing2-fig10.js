//Options for chart
const srcPathFig10a = "../data/Stories/Housing/part_2/processed/traveller_accomodation_accomodated.csv";
const srcPathFig10b = "../data/Stories/Housing/part_2/processed/traveller_accomodation_unauthorised.csv";
let titleFig10 = "Traveller Accomodation (2002-2013)";
const divIDFig10 = "traveller-accomodation-chart";

Promise.all([
    d3.csv(srcPathFig10a),
    d3.csv(srcPathFig10b)
  ]).then((data) => {

    const regionsFig10 = [...REGIONS_ORDERED_DUBLIN].concat([...REGIONS_ORDERED_NEIGHBOURS]);
    regionsFig10.push("state");
    const marginRUnauth = 190;
    const marginRAccom = 190;
    const marginRBoth = 75;

    let tracesUnauthorisedFig10 = [];
    let tracesAccomodatedFig10 = [];

    regionsFig10.forEach((region) => {
      tracesUnauthorisedFig10.push(getTrace(data[1], "date", region));
      tracesAccomodatedFig10.push(getTrace(data[0], "date", region));
    })
    //change stat from defaults
    tracesUnauthorisedFig10[7].stackgroup = 'two';
    tracesUnauthorisedFig10[7].name = 'Total for State';
    tracesAccomodatedFig10[7].stackgroup = 'two';
    tracesAccomodatedFig10[7].name = 'Total for State';
    //set default visibility on load
    tracesUnauthorisedFig10.forEach((trace) => {
      return trace.visible = true;
    })
    let tracesFig10 = tracesUnauthorisedFig10.concat(tracesAccomodatedFig10);

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.name = yVar;
      trace.stackgroup = 'one';
      trace.visible = false;
      trace.x = data.map((x) => {
        return x[xVar];
      });
      trace.y = data.map((y) => {
        return y[yVar];
      });
      trace.connectgaps = true;
      trace.mode = 'lines';
      // trace.name === 'state' ? trace.visible = true : trace.visible = true;
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      trace.marker.opacity = 1.0; //how to adjust fill opacity?
      trace.marker.color = CHART_COLORS_BY_REGION[trace.name] || 'grey';
      return trace;
    }

    //Set layout options
    let layoutFig10 = Object.assign({}, STACKED_AREA_CHART_LAYOUT);
    layoutFig10.title.text = titleFig10;
    // layoutFig10.height = 500;
    layoutFig10.showlegend = false;
    layoutFig10.xaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.xaxis);
    layoutFig10.xaxis.title = '';
    layoutFig10.xaxis.nticks = 6;
    layoutFig10.xaxis.range = [2002, 2013];
    layoutFig10.yaxis = Object.assign({}, STACKED_AREA_CHART_LAYOUT.yaxis);
    layoutFig10.yaxis.fixedrange = false;
    // layoutFig10.yaxis.range = [0.1, 500];
    // layoutFig10.yaxis.visible = false;
    layoutFig10.yaxis.title = '';
    layoutFig10.margin = Object.assign({}, STACKED_AREA_CHART_LAYOUT.margin);
    layoutFig10.margin = {
      l: 0,
      r: marginRUnauth,
      t: 100 //button row
    };
    // // layoutFig10.hidesources = false;

    // Set annotations per chart with config per trace
    let unauthorisedAnnotations = [];
    let accomodatedAnnotations = [];
    let bothAnnotations = [];

    tracesUnauthorisedFig10.forEach((trace) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = +trace.x[trace.x.length - 1];
      annotation.y = +trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      annotation.showarrow = true;
      annotation.ax = +10;
      annotation.arrowcolor = CHART_COLORS_BY_REGION[trace.name] || 'grey';;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //magic number!!!

      unauthorisedAnnotations.push(annotation);
      // trace.name === 'state' ? annotation.opacity = 0.75 : annotation.opacity = 1.0;
      // trace.name === 'state' ? unauthorisedAnnotations.push(annotation) : accomodatedAnnotations.push(annotation);
      bothAnnotations.push(Object.assign({}, annotation));
    })
    //need to adjust y to take account of stacking
    unauthorisedAnnotations[1].y = unauthorisedAnnotations[1].y + unauthorisedAnnotations[0].y;
    unauthorisedAnnotations[2].y = unauthorisedAnnotations[2].y + unauthorisedAnnotations[1].y;
    unauthorisedAnnotations[3].y = unauthorisedAnnotations[3].y + unauthorisedAnnotations[2].y;
    unauthorisedAnnotations[0].ay = 12;
    unauthorisedAnnotations[1].ay = -2;
    unauthorisedAnnotations[2].ay = -10;
    unauthorisedAnnotations[3].ay = -25;
    unauthorisedAnnotations[4].visible = false;
    unauthorisedAnnotations[5].visible = false;
    unauthorisedAnnotations[6].visible = false;

    let hoverAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    hoverAnnotation.x = 2008;
    hoverAnnotation.y = 700;
    hoverAnnotation.opacity = 0.75;
    hoverAnnotation.text = 'Hover for more regions';
    hoverAnnotation.font.color = 'grey';
    unauthorisedAnnotations.push(hoverAnnotation);
    let dragAnnotation = Object.assign({}, ANNOTATIONS_DEFAULT);
    dragAnnotation.x = 2006;
    dragAnnotation.y = 800;
    dragAnnotation.opacity = 0.75;
    dragAnnotation.text = 'Drag vertically on plot to zoom, on yaxis to scroll';
    unauthorisedAnnotations.push(dragAnnotation);


    tracesAccomodatedFig10.forEach((trace) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = +trace.x[trace.x.length - 1];
      annotation.y = +trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      annotation.showarrow = true;
      annotation.ax = +10;
      annotation.arrowcolor = CHART_COLORS_BY_REGION[trace.name] || 'grey';;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORS_BY_REGION[trace.name] || 'grey'; //magic number!!!
      accomodatedAnnotations.push(annotation);

      // trace.name === 'state' ? annotation.opacity = 0.75 : annotation.opacity = 1.0;
      // trace.name === 'state' ? unauthorisedAnnotations.push(annotation) : accomodatedAnnotations.push(annotation);
      bothAnnotations.push(Object.assign({}, annotation));
    })

    accomodatedAnnotations[1].y = accomodatedAnnotations[1].y + accomodatedAnnotations[0].y;
    accomodatedAnnotations[2].y = accomodatedAnnotations[2].y + accomodatedAnnotations[1].y;
    accomodatedAnnotations[3].y = accomodatedAnnotations[3].y + accomodatedAnnotations[2].y;
    accomodatedAnnotations[0].ay = 15;
    accomodatedAnnotations[1].ay = 0;
    accomodatedAnnotations[2].ay = -10;
    accomodatedAnnotations[3].ay = -15;
    accomodatedAnnotations[4].visible = false;
    accomodatedAnnotations[5].visible = false;
    accomodatedAnnotations[6].visible = false;

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [true, true, true, true, true, true, true, true,
                false, false, false, false, false, false, false, false
              ]
            },
            {
              'title': titleFig10,
              'annotations': unauthorisedAnnotations,
              'margin.r': marginRUnauth
            }
          ],
          label: 'Unauthorised Sites',
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false, false,
                true, true, true, true, true, true, true, true
              ]
            },
            {
              'title': titleFig10,
              'annotations': accomodatedAnnotations,
              'margin.r': marginRAccom
            }
          ],
          label: 'Accomodated by Local Authorities',
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false,
                false, false, false, false,
              ]
            },
            {
              'title': titleFig10,
              'annotations': bothAnnotations,
              'margin.r': marginRAccom

            }
          ],
          label: 'Both',
          method: 'update',
          // execute: true
        }
      ],
    });

    layoutFig10.updatemenus = updateMenus;
    layoutFig10.annotations = unauthorisedAnnotations;

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