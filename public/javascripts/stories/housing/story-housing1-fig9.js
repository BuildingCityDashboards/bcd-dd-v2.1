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

    //Manually compute trace for total value
    let totalTrace = Object.assign({}, TRACES_DEFAULT);
    totalTrace.name = 'Total Tax';
    totalTrace.mode = "lines";
    totalTrace.x = Object.keys(dataByDate).map((key) => {
      return key;
    });

    totalTrace.y = Object.keys(dataByDate).map((key) => {
      let val1 = +dataByDate[key][0]["value"];
      let val2 = +dataByDate[key][1]["value"];
      return val1 + val2 //Bad coder!
    });
    taxTraces.push(totalTrace);


    //Manually compute trace for rate
    let rateTrace1 = Object.assign({}, taxTraces[1]);
    rateTrace1.name = '% Property Tax';
    rateTrace1.stackgroup = 'one';
    rateTrace1.groupnorm = 'percent';
    rateTrace1.visible = false;
    taxTraces.push(rateTrace1);

    let rateTrace2 = Object.assign({}, taxTraces[0]);
    rateTrace2.name = '';
    rateTrace2.hoverinfo = 'none';
    rateTrace2.stackgroup = 'one';
    rateTrace2.visible = false;
    taxTraces.push(rateTrace2);


    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig9;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.range = [1997, 2009];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.range = [1, 50000];
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 0,
      r: 125, //annotations space
      b: 40, //x axis tooltip
      t: 100 //button row
    };

    //Set annotations per chart with config per trace
    let countAnnotations = [];
    let rateAnnotations = [];
    taxTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];

      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORWAY[i]; //Is this order smae as fetching from object in trace?
      if (i < 3) { //booooo!
        annotation.text = trace.name.split('Rev')[0];
        countAnnotations.push(annotation);
      } else {
        annotation.text = 'test';
        rateAnnotations.push(annotation);
      }
    })

    console.log(rateAnnotations);

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
              'visible': [true, true, true,
                false, false
              ]
            },
            {
              'title': titleFig9,
              'annotations': countAnnotations,
              'yaxis.range': [1, 50000]

            }
          ],
          label: 'Amount (€)',
          method: 'update',

          // execute: true
        },
        {
          args: [{
              'visible': [false, false, false,
                true, true
              ]
            },
            {
              'title': titleFig9,
              'annotations': rateAnnotations,
              'yaxis.range': [0, 100]

            }
          ],
          label: 'Proportion (%)',
          method: 'update',

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