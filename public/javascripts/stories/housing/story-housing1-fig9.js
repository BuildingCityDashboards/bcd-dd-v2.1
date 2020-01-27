//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig9 = "../data/Stories/Housing/part_1/",
  srcFileFig9 = "Property_tax.csv";
const typesFig9 = ["Property Related Tax Revenue", "Other Tax Revenue"];
const titleFig9_1 = "Property-Related & Other Tax Revenue in Billions of Euros (1997-2009)";
const titleFig9_2 = "Property-Related Tax as a Proportion of All Tax Revenue (1997-2009)";
const divIDFig9 = "property-tax-chart";

//@TODO: replace with bluebird style Promise.each, or e.g. https://www.npmjs.com/package/promise-each
//Want a better mechanism for page load that doesn't have to wait for all the data

d3.csv(srcPathFig9 + srcFileFig9)
  .then((data) => {

    const yAxisRangeEuros = [1, 50];
    const yAxisRangePercent = [1, 100];
    const marginREuros = 100;
    const marginRPercent = 0;
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
        trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
        // trace.marker.opacity = 0.0;
        // trace.marker.color = null : trace.marker.color = 'grey'; //use default colorway or grey

        trace.x = data[key].map((x) => {
          return x[xVar];
        });

        trace.y = data[key].map((y) => {
          return y[yVar] / 1000;
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
      return (val1 + val2) / 1000; //Bad coder!
    });
    taxTraces.push(totalTrace);
    // console.log(taxTraces);


    let rateTrace1 = Object.assign({}, taxTraces[1]);
    rateTrace1.name = 'Property Related Tax %';
    rateTrace1.stackgroup = 'one';
    rateTrace1.groupnorm = 'percent';
    rateTrace1.visible = false; //default on load
    taxTraces.push(rateTrace1);

    //Manually compute traces for rate
    let rateTrace2 = Object.assign({}, taxTraces[2]);
    rateTrace2.name = '';
    rateTrace2.hoverinfo = 'none';
    rateTrace2.stackgroup = 'one';
    rateTrace2.visible = false;
    taxTraces.push(rateTrace2);

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title = Object.assign({}, MULTILINE_CHART_LAYOUT.title);
    layout.title.text = titleFig9_1;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.range = [1997, 2009];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.autorange = false;
    layout.yaxis.range = [0.5, 50];
    layout.yaxis.title = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis.title);
    layout.yaxis.title.text = '€bn';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 50,
      r: marginREuros, //annotations space
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
      annotation.text = trace.name.split('Rev')[0];
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORWAY[i]; //Is this order smae as fetching from object in trace?
      if (i === 3) {
        annotation.text = trace.name;
        annotation.y = 5;
        annotation.font.color = CHART_COLORWAY[2];
        rateAnnotations.push(annotation);
      } else { //booooo!
        countAnnotations.push(annotation);
      }
    })

    countAnnotations[0].ay = 10; //other
    countAnnotations[1].ay = -25; //prop
    countAnnotations[2].ay = -15; //total

    countAnnotations[0].ax = -0;
    countAnnotations[1].ax = -65; //prop
    countAnnotations[2].ax = -0;

    rateAnnotations[0].showarrow = false;
    rateAnnotations[0].xshift = -170;
    rateAnnotations[0].yshift = 40;
    //

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
              'title': titleFig9_1,
              'annotations': countAnnotations,
              'yaxis.range': [0.5, 50],
              'yaxis.title.text': '€bn',
              'margin.r': marginREuros

            }
          ],
          label: 'Amount (€bn)',
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
              'title': titleFig9_2,
              'annotations': rateAnnotations,
              'yaxis.range': yAxisRangePercent,
              'yaxis.title.text': '%',
              'margin.r': marginRPercent

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
        filename: 'Dublin Dashboard - ' + titleFig9_1,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });