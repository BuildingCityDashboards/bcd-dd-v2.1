// Chart of house completions over time, by type of house, for each region in Dublin+
// This chart will have multiple plots for each year loaded by buttons.
// 6 sub-plots each containing a row chart.
// Each sub-plot will show a different house type and value per LA

//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig2 = "../data/Stories/Housing/",
  srcFileFig2 = "housetype.csv";

const titleFig2 = "Number of Households by Type, by Region (2002-2016)";
// titleFig2 = popTitle; //set default on load
const fig2DivID = "housing-types-chart";
//This array controls the order in which subplotsare drawn
const regionsFig2 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];

//object used to look up shorter names to use a s labels in plots
const shortNames = {
  "Flat or apartment in a converted house or commercial building and bedsits": "Flat, apartment (converted) or bedsit",
  "Flat or apartment in a purpose- built block": "Flat or apartment (purpose-built)"
} // (converted house/commercial building) or bedsit"

d3.csv(srcPathFig2 + srcFileFig2)
  .then((data) => {
    let completionsByYearByRegion = d3.nest()
      .key(function(d) {
        return d["date"];
      })
      .key(function(d) {
        return d["region"];
      })
      .object(data);

    //Create a subplot for each region
    let years = Object.keys(completionsByYearByRegion);
    //console.log(years);
    let noOfSubplots = regionsFig2.length; //assumes same no of regions per year
    //console.log(noOfSubplots);

    let fig2Plots = []; //the array of plots to be used as an arg to Plotly instantiation
    //
    //Nested for each loops are undesriable here
    years.forEach((year) => {
      regionsFig2.forEach((region) => {
        fig2Plots.push(getSubplot(completionsByYearByRegion[year][region], 'value', 'type'));
      })
    })
    //TODO remove this additional loop
    fig2Plots.forEach((plot, i) => {
      plot.xaxis = 'x' + ((i % noOfSubplots) + 1); //% no of subplots
      plot.yaxis = 'y' + ((i % noOfSubplots) + 1);
      // console.log(plot.xaxis);
    })

    // //Set default visible traces (i.e. traces on each chart)
    fig2Plots.map((t, i) => {
      if (i < 7) return t.visible = true;
      else return t.visible = false;
    });

    function getSubplot(data, xVar, yVar) {
      let trace = {
        x: data.map((v) => {
          return shortNames[v[xVar]] || v[xVar]; //type - if there's a shortNames entry, use it
        }),
        y: data.map((v) => {
          return shortNames[v[yVar]] || v[yVar]; //region
        }),
        xaxis: null,
        yaxis: null,
        transforms: [{
          type: 'sort',
          target: 'y',
          order: 'descending'
        }],
        name: data[0]["region"],
        orientation: 'h',
        type: 'bar',
        mode: 'bars+text',
        marker: {
          color: CHART_COLORS_BY_REGION[data[0]["region"]] || 'grey'
        }
        // text: ['test']
      }
      return trace;
    }

    //Configure the layout object common to all plots
    let fig2Layout = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS);
    fig2Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.title);
    fig2Layout.title.text = titleFig2;
    fig2Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.margin);
    fig2Layout.margin.t = 100;

    const xaxisRange = [0, 80000]; //TODO: get the max value from the data 
    //configure the axes for each subplot
    regionsFig2.forEach((region, i) => {
      const xAxisName = "xaxis" + (i + 1);
      fig2Layout[xAxisName] = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
      fig2Layout[xAxisName].title = region;
      fig2Layout[xAxisName].visible = false;
      fig2Layout[xAxisName].titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
      fig2Layout[xAxisName].titlefont.color = CHART_COLORS_BY_REGION[region] || null;
      fig2Layout[xAxisName].range = xaxisRange;
      fig2Layout[xAxisName].anchor = 'y' + (i + 1);

      const yAxisName = "yaxis" + (i + 1);
      fig2Layout[yAxisName] = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
      fig2Layout[yAxisName].anchor = 'x' + (i + 1);
      fig2Layout[yAxisName].titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);
      if (region === "Kildare" || region === "Meath" || region === "Wicklow") {
        fig2Layout[yAxisName].visible = false;
      }
    })
    fig2Layout.xaxis.visible = false;
    fig2Layout.xaxis.domain = [0, 0.45];
    fig2Layout.xaxis2.domain = [0.55, 1.0];
    fig2Layout.xaxis3.domain = [0.0, 0.45];
    fig2Layout.xaxis4.domain = [0.55, 1.0];
    fig2Layout.xaxis5.domain = [0, 0.3];
    fig2Layout.xaxis6.domain = [0.35, 0.65];
    fig2Layout.xaxis7.domain = [0.7, 1.0];

    fig2Layout.yaxis.domain = [0.7, 1.0];
    fig2Layout.yaxis2.domain = [0.7, 1.0];
    fig2Layout.yaxis3.domain = [0.30, 0.60];
    fig2Layout.yaxis4.domain = [0.30, 0.60];
    fig2Layout.yaxis5.domain = [0.0, 0.15];
    fig2Layout.yaxis6.domain = [0.0, 0.15];
    fig2Layout.yaxis7.domain = [0.0, 0.15];

    let annotations = [];
    fig2Plots.forEach((plot, i) => {
      if (i < 7) {
        annotations.push(getAnnotationForPlot(plot, i));
      }
    });
    // annotations.push(getAnnotationForPlot(fig2Plots[0]));

    function getAnnotationForPlot(plot, i) {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.xref = 'x' + (i + 1); //Is order guaranteed?
      annotation.yref = 'y' + (i + 1);
      annotation.xanchor = 'right';
      annotation.align = 'right';
      annotation.x = xaxisRange[1];
      annotation.y = 'Detached house'; //the y axis label to align with
      annotation.ay = 0;

      annotation.text = plot["name"];
      annotation.opacity = 1.0;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      annotation.font.color = CHART_COLORS_BY_REGION[plot["name"]] || 'grey';
      annotation.font.size = 18;
      //de-focus some annotations
      //TODO: function for this
      // (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      // annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      // (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      return annotation;
    };

    fig2Layout.annotations = annotations;
    // console.log(fig2Layout);


    //Set button menu
    let updateMenus = [{
      buttons: [{
          args: [{
              'visible': [true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false
              ]
            },
            {
              // 'title': '2002',
              'annotations': annotations

            }
          ],
          label: '2002',
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
              // 'title': '2006',
              'annotations': annotations
            }
          ],
          label: '2006',
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
              // 'title': '2011',
              'annotations': annotations

            }
          ],
          label: '2011',
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
              // 'title': '2016',
              'annotations': annotations
            }
          ],
          label: '2016',
          method: 'update',
          execute: true
        }
      ],
      type: 'buttons',
      direction: 'right',
      font: {
        family: null,
        size: 16,
        color: null
      },
      bordercolor: 'grey',
      pad: {

        't': 0,
        'r': 0,
        'b': 0,
        'l': 0
      },
      showactive: true,
      active: 0,
      xref: 'container',
      x: 0.0,
      xanchor: 'left',
      yref: 'container',
      y: 1.05, //place above plot area with >1.0
      yanchor: 'bottom'
    }];

    fig2Layout.updatemenus = updateMenus;

    // fig2Layout.grid = {
    //   rows: 3,
    //   // columns: 2,
    //   pattern: 'independent'
    // }

    Plotly.newPlot(fig2DivID, fig2Plots, fig2Layout, {
      modeBarButtons: ROW_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true
    });

    //workaround to place y axis labels on bars
    document.getElementById(fig2DivID).on('plotly_afterplot', function() {

      let yAxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .ytick text, [class*=" yaxislayer"] .ytick text'))
      for (let i = 0; i < yAxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
        yAxisLabels[i].setAttribute('text-anchor', 'start');
        yAxisLabels[i].setAttribute('x', '10'); //add left spacing
      }

      let y2AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y2tick text, [class*=" yaxislayer"] .y2tick text'))
      for (let i = 0; i < y2AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
        y2AxisLabels[i].setAttribute('text-anchor', 'start');
        let y2x = parseInt(y2AxisLabels[i].getAttribute('x'));
        y2x += 5;
        y2AxisLabels[i].setAttribute('x', y2x); //add left spacing
      }

      let y3AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y3tick text, [class*=" yaxislayer"] .y3tick text'))
      for (let i = 0; i < y3AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
        y3AxisLabels[i].setAttribute('text-anchor', 'start');
        let y3x = parseInt(y3AxisLabels[i].getAttribute('x'));
        y3x += 5;
        y3AxisLabels[i].setAttribute('x', y3x); //add left spacing
      }

      let y4AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y4tick text, [class*=" yaxislayer"] .y4tick text'))
      for (let i = 0; i < y4AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
        y4AxisLabels[i].setAttribute('text-anchor', 'start');
        let y4x = parseInt(y4AxisLabels[i].getAttribute('x'));
        y4x += 5;
        y4AxisLabels[i].setAttribute('x', y4x); //add left spacing
      }
      // //
      // let y5AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y5tick text, [class*=" yaxislayer"] .y5tick text'))
      // for (let i = 0; i < y5AxisLabels.length; i++) {
      //   // yAxisLabels[i].setAttribute('visible', true);
      //   y5AxisLabels[i].setAttribute('text-anchor', 'start');
      //   let y5x = parseInt(y5AxisLabels[i].getAttribute('x'));
      //   y5x += 5;
      //   y5AxisLabels[i].setAttribute('x', y5x); //add left spacing
      // }
      //
      // let y6AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y6tick text, [class*=" yaxislayer"] .y6tick text'))
      // for (let i = 0; i < y6AxisLabels.length; i++) {
      //   // yAxisLabels[i].setAttribute('visible', true);
      //   y6AxisLabels[i].setAttribute('text-anchor', 'start');
      //   let y6x = parseInt(y6AxisLabels[i].getAttribute('x'));
      //   y6x += 5;
      //   y6AxisLabels[i].setAttribute('x', y6x); //add left spacing
      // }
      //
      // let y7AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y7tick text, [class*=" yaxislayer"] .y7tick text'))
      // for (let i = 0; i < y7AxisLabels.length; i++) {
      //   // yAxisLabels[i].setAttribute('visible', true);
      //   y7AxisLabels[i].setAttribute('text-anchor', 'start');
      //   let y7x = parseInt(y7AxisLabels[i].getAttribute('x'));
      //   y7x += 5;
      //   y7AxisLabels[i].setAttribute('x', y7x); //add left spacing
      // }

    })

  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });