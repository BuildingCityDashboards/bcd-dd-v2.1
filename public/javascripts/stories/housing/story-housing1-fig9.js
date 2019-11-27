//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig9 = "../data/Stories/Housing/",
  srcFileFig9 = "Property_tax.csv";
const typesFig9 = ["Property Related Tax Revenue", "Other Tax Revenue"];
const titleFig9 = "Tax Revenue from Property and Other Sources (1997-2009)";
const divIDFig9 = "property-tax-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig9 + srcFileFig9)
  .then((data) => {

    //Data per type- use the array of type variable values
    let dataByType = d3.nest()
      .key(function(d) {
        return d["type"];
      })
      // .key(function(d) {
      //   return d["region"];
      // })
      .object(data);

    let dataByDate = d3.nest()
      .key(function(d) {
        return d["date"];
      })
      // .key(function(d) {
      //   return d["region"];
      // })
      .object(data);

    //Traces
    let taxTraces = [];

    taxTraces = getTraces(dataByType, "date", "value");

    function getTraces(data, xVar, yVar) {
      let traces = [];
      Object.keys(data).forEach((key) => {
        // console.log(typeName);
        let trace = Object.assign({}, TRACES_DEFAULT);
        trace.name = key;
        trace.mode = "lines";
        // trace.stackgroup = 'one'; //converts to grouped area
        //reassign colour to -defocus some traces
        // trace.opacity = CHART_OPACITY_BY_VARIABLE[typeName] || 0.5;
        // trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
        // trace.marker.opacity = 0.0;
        // trace.marker.color = null : trace.marker.color = 'grey'; //use default colorway or grey

        trace.x = data[key].map((x) => {
          return x[xVar];
        });

        trace.y = data[key].map((y) => {
          return y[yVar];
        });

        traces.push(trace);
      });
      return traces;
    }

    //Manually compute trace for total

    let trace = Object.assign({}, TRACES_DEFAULT);
    trace.name = 'Total Tax';
    trace.mode = "lines";
    trace.x = Object.keys(dataByDate).map((key) => {
      return key;
    });

    trace.y = Object.keys(dataByDate).map((key) => {
      let val1 = +dataByDate[key][0]["value"];
      let val2 = +dataByDate[key][1]["value"];
      return val1 + val2 //Bad coder!
    });

    taxTraces.push(trace);

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig9;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.range = [1997, 2009];
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 0,
      r: 125, //annotations space
      b: 40, //x axis tooltip
      t: 100 //button row
    };

    //Set annotations per chart with config per trace
    let countAnnotations = [];
    taxTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name.split('Rev')[0];
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORWAY[i]; //Is this order smae as fetching from object in trace?
      countAnnotations.push(annotation);
    })

    countAnnotations[0].ay = 7;
    countAnnotations[1].ay = 0;
    countAnnotations[2].ay = -7;

    //Set default view annotations
    layout.annotations = countAnnotations; //set default

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [true, true, true]
            },
            {
              'title': null,
              'annotations': countAnnotations

            }
          ],
          label: 'Count',
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [false, false, false]
            },
            {
              'title': '',
              'annotations': null
            }
          ],
          label: '%',
          method: 'update',
          execute: true
        },
      ],
    });

    layout.updatemenus = updateMenus;

    Plotly.newPlot(divIDFig9, taxTraces, layout, {
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
        filename: 'Dublin Dashboard - ' + titleFig9,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });