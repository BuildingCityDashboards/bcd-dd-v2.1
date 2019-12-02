//Options for chart
const srcPathFig5 = "../data/Stories/Housing/part_2/processed/home_mortgage_arrears.csv";
const titleFig5 = "Home Mortage Arrears (2009-2018)";
const divIDFig5 = "home-mortgage-arrears-chart";
// const regionsFig5 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow", "State"];
const shortColumnNames = {
  "Outstanding Mortgages: Total mortgage loan accounts outstanding": "Outstanding Mortgages",
  "Arrears: Total mortgage accounts in arrears": "Total in Arrears",
  "Arrears: Total mortgage accounts in arrears - over 90 days": "Total in Arrears 90+ Days",
  "Arrears: % of loan accounts in arrears for more than 90 days": "Portion in Arrears 90+ Days"
};


d3.csv(srcPathFig5)
  .then((data) => {
    let traces = [];
    const yAxisRangeCount = [1, 825000];
    const yAxisRangePercent = [1, 100];
    const marginRCount = 100;
    const marginRPercent = 0;

    let colName = "Outstanding Mortgages: Total mortgage loan accounts outstanding";
    let totalTrace = getTrace(data, "date", colName);
    totalTrace.text = totalTrace.y.map(String);
    totalTrace.name = shortColumnNames[colName];
    totalTrace.mode = 'lines';
    totalTrace.visible = true;
    // totalTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    // totalTrace.marker.color = CHART_COLORS_BY_REGION["State"] || 'grey';
    traces.push(totalTrace);
    //
    colName = "Arrears: Total mortgage accounts in arrears";
    let arrearsTrace = getTrace(data, "date", colName);
    arrearsTrace.text = arrearsTrace.y.map(String);
    arrearsTrace.name = shortColumnNames[colName];
    // sarrearsTrace.type = 'scatter';
    arrearsTrace.mode = 'lines';
    arrearsTrace.visible = true;
    // arrearsTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    // arrearsTrace.marker.color = CHART_COLORS_BY_REGION["State"] || 'grey';
    traces.push(arrearsTrace);

    colName = "Arrears: Total mortgage accounts in arrears - over 90 days"
    let arrears90DaysTrace = getTrace(data, "date", colName);
    arrears90DaysTrace.text = arrearsTrace.y.map(String);
    arrears90DaysTrace.name = shortColumnNames[colName];
    // sarrears90DaysTrace.type = 'scatter';
    arrears90DaysTrace.mode = 'lines';
    arrears90DaysTrace.visible = true;
    // arrears90DaysTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    // arrears90DaysTrace.marker.color = CHART_COLORS_BY_REGION["State"] || 'grey';
    traces.push(arrears90DaysTrace);

    //dummy trace for normalised stack
    colName = "Arrears: % of loan accounts in arrears for more than 90 days";
    let arrearsPercentTrace = getTrace(data, "date", "Arrears: % of loan accounts in arrears for more than 90 days");

    arrearsPercentTrace.text = arrearsTrace.y.map(String);
    arrearsPercentTrace.name = shortColumnNames[colName];
    arrearsPercentTrace.stackgroup = 'one';
    arrearsPercentTrace.groupnorm = 'percent';
    // arrearsPercentTrace.type = 'scatter';
    arrearsPercentTrace.mode = 'lines';
    arrearsPercentTrace.visible = false;
    // arrearsPercentTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    // arrearsPercentTrace.marker.color = CHART_COLORS_BY_REGION["State"] || 'grey';

    traces.push(arrearsPercentTrace);

    let arrears100PercentTrace = Object.assign({}, TRACES_DEFAULT);
    arrears100PercentTrace.x = data.map((x) => {
      let parts = x["date"].split('-');
      return parts[0] + ' 20' + parts[1]; //modified date format

    });
    arrears100PercentTrace.y = data.map((y) => {
      return 100 - y[colName];
    });
    arrears100PercentTrace.mode = 'lines';
    arrears100PercentTrace.visible = false;
    arrears100PercentTrace.stackgroup = 'one';
    arrears100PercentTrace.hoverinfo = 'none';
    traces.push(arrears100PercentTrace);

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.x = data.map((x) => {
        let parts = x[xVar].split('-');
        return parts[0] + ' 20' + parts[1]; //modified date format;
      });
      trace.y = data.map((y) => {
        return y[yVar];
      });
      return trace;
    }

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig5;
    layout.height = 500;
    layout.showlegend = false;
    layout.barmode = 'relative';
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = '';
    layout.xaxis.nticks = 5;
    // layout.xaxis.range = [1989, 2018];
    layout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    layout.yaxis.range = yAxisRangeCount;
    // layout.yaxis.visible = false;
    layout.yaxis.title = '';
    layout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    layout.margin = {
      l: 0,
      r: marginRCount,
      t: 100, //button row
      b: 20
    };

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
              'visible': [true, true, true, false, false

              ]
            },
            {
              'title': titleFig5,
              'annotations': null,
              'yaxis.range': yAxisRangeCount,
              'yaxis.title.text': '',
              'margin.r': marginRCount

            }
          ],
          label: "Numbers of Mortgage Accounts",
          method: 'update',
          // execute: true
        },
        {
          args: [{
              'visible': [false, false, false, true, true]
            },
            {
              'title': titleFig5,
              'annotations': null,
              'yaxis.range': yAxisRangePercent,
              'yaxis.title.text': '%',
              'margin.r': marginRPercent
            }
          ],
          label: "Proportion of Mortgages in Arrears (%)",
          method: 'update',
          // execute: true
        }
      ],
    });

    layout.updatemenus = updateMenus;
    // layout.annotations = stateAnnotations;

    Plotly.newPlot(divIDFig5, traces, layout, {
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
        filename: 'Dublin Dashboard - ' + titleFig5,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });