//Options for chart
const srcPathFig6 = "../data/Stories/Housing/part_2/processed/btl_mortgage_arrears.csv";
const titleFig6 = "Buy-to-let Mortage Arrears (2012-2018)";
const divIDFig6 = "btl-mortgage-arrears-chart";
// const regionsFig6 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow", "State"];



d3.csv(srcPathFig6)
  .then((data) => {

    const shortColumnNames = {
      "Outstanding Mortgages: Total mortgage loan accounts outstanding": "Outstanding Mortgages",
      "Arrears: Total mortgage accounts in arrears": "All Mortgages in Arrears",
      "Arrears: Total mortgage accounts in arrears - over 90 days": "Mortgages in Arrears >90 Days",
      "Arrears: % of loan accounts in arrears for more than 90 days": "Percentage in Arrears >90 Days",
      "Arrears: % of loan accounts in arrears": "Percentage in Arrears"
    };
    let traces = [];
    const yAxisRangeCount = [1, 160000];
    const yAxisRangePercent = [1, 100];
    const marginRCount = 0;
    const marginRPercent = 0;

    let colName = "Outstanding Mortgages: Total mortgage loan accounts outstanding";
    let totalTrace = getTrace(data, "date", colName);
    totalTrace.text = totalTrace.y.map(String);
    totalTrace.name = shortColumnNames[colName];
    totalTrace.mode = 'lines';
    totalTrace.opacity = 0.5
    totalTrace.visible = true;
    totalTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    totalTrace.marker.color = 'grey';
    traces.push(totalTrace);
    //
    colName = "Arrears: Total mortgage accounts in arrears";
    let arrearsTrace = getTrace(data, "date", colName);
    arrearsTrace.text = arrearsTrace.y.map(String);
    arrearsTrace.name = shortColumnNames[colName];
    // sarrearsTrace.type = 'scatter';
    arrearsTrace.mode = 'lines';
    arrearsTrace.visible = true;
    arrearsTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    arrearsTrace.marker.color = CHART_COLORWAY_VARIABLES[0];
    traces.push(arrearsTrace);

    colName = "Arrears: Total mortgage accounts in arrears - over 90 days"
    let arrears90DaysTrace = getTrace(data, "date", colName);
    arrears90DaysTrace.text = arrearsTrace.y.map(String);
    arrears90DaysTrace.name = shortColumnNames[colName];
    // sarrears90DaysTrace.type = 'scatter';
    arrears90DaysTrace.mode = 'lines';
    arrears90DaysTrace.visible = true;
    arrears90DaysTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    arrears90DaysTrace.marker.color = CHART_COLORWAY_VARIABLES[1];
    traces.push(arrears90DaysTrace);

    let arrears100PercentTrace = Object.assign({}, TRACES_DEFAULT);
    arrears100PercentTrace.x = data.map((x) => {
      let parts = x["date"].split('-');
      return parts[0] + ' 20' + parts[1]; //modified date format

    });
    arrears100PercentTrace.y = data.map((y) => {
      return 102;
    });
    arrears100PercentTrace.name = 'All Outstanding Mortgages';
    arrears100PercentTrace.mode = 'lines';
    arrears100PercentTrace.stackgroup = 'three';
    arrears100PercentTrace.hoverinfo = 'none';
    arrears100PercentTrace.opacity = 0.5;
    arrears100PercentTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    arrears100PercentTrace.marker.color = 'grey';
    traces.push(arrears100PercentTrace);

    colName = "Arrears: % of loan accounts in arrears";
    let arrearsPercentTrace = getTrace(data, "date", colName);

    arrearsPercentTrace.text = arrearsTrace.y.map(String);
    arrearsPercentTrace.name = shortColumnNames[colName];
    arrearsPercentTrace.stackgroup = 'two';
    arrearsPercentTrace.mode = 'lines';
    arrearsPercentTrace.visible = false;
    arrearsPercentTrace.opacity = 1.0;
    arrearsPercentTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    arrearsPercentTrace.marker.color = CHART_COLORWAY_VARIABLES[0];
    traces.push(arrearsPercentTrace);

    colName = "Arrears: % of loan accounts in arrears for more than 90 days";
    let arrears90DaysPercentTrace = getTrace(data, "date", colName);
    arrears90DaysPercentTrace.text = arrearsTrace.y.map(String);
    arrears90DaysPercentTrace.name = shortColumnNames[colName];
    arrears90DaysPercentTrace.stackgroup = 'one';
    arrears90DaysPercentTrace.mode = 'lines';
    arrears90DaysPercentTrace.visible = false;
    arrears90DaysPercentTrace.marker = Object.assign({}, TRACES_DEFAULT.marker);
    arrears90DaysPercentTrace.marker.color = CHART_COLORWAY_VARIABLES[1];
    traces.push(arrears90DaysPercentTrace);

    function getTrace(data, xVar, yVar) {
      let trace = Object.assign({}, TRACES_DEFAULT);
      trace.x = data.map((x) => {
        let parts = x[xVar].split('-');
        return parts[0] + ' 20' + parts[1]; //modified date format;
      });
      trace.y = data.map((y) => {
        return y[yVar];
      });
      trace.hoverinfo = 'y';
      return trace;
    }

    //Set layout options
    let layout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    layout.title.text = titleFig6;
    layout.height = 500;
    layout.colorway = CHART_COLORWAY_VARIABLES;
    layout.showlegend = false;
    layout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    layout.xaxis.title = '';
    layout.xaxis.nticks = 5;
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

    let countAnnotations = [];
    let rateAnnotations = [];
    traces.forEach((trace, i) => {
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      annotation.showarrow = false;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      if (i < 3) {
        countAnnotations.push(annotation);
        // console.log(annotation);
      } else {
        rateAnnotations.push(annotation);
      }
    })
    // //set individual annotation stylings
    countAnnotations[0].yshift = 0; //Outstanding
    countAnnotations[1].yshift = 5; //In arrears
    countAnnotations[2].yshift = -3; //90 days
    countAnnotations[0].opacity = 0.5;
    countAnnotations[0].font.color = totalTrace.marker.color;
    countAnnotations[1].font.color = arrearsTrace.marker.color;
    countAnnotations[2].font.color = arrears90DaysTrace.marker.color;


    rateAnnotations[0].y = 50;
    rateAnnotations[1].yshift = -5;
    rateAnnotations[2].yshift = -25;
    rateAnnotations[0].opacity = 0.5;
    rateAnnotations[0].font.color = arrears100PercentTrace.marker.color;
    rateAnnotations[1].font.color = arrearsPercentTrace.marker.color;
    rateAnnotations[2].font.color = arrears90DaysPercentTrace.marker.color;

    //Set button menu
    let updateMenus = [];
    updateMenus[0] = Object.assign({}, UPDATEMENUS_BUTTONS_BASE);
    updateMenus[0] = Object.assign(updateMenus[0], {
      buttons: [{
          args: [{
              'visible': [true, true, true, false, false, false]
            },
            {
              'title': titleFig6,
              'annotations': countAnnotations,
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
              'visible': [false, false, false, true, true, true]
            },
            {
              'title': titleFig6,
              'annotations': rateAnnotations,
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
    layout.annotations = countAnnotations;

    Plotly.newPlot(divIDFig6, traces, layout, {
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
        filename: 'Dublin Dashboard - ' + titleFig6,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });