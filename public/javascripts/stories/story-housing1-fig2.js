// Chart of house completions over time, by type of house, for each region in Dublin+
// This chart will have multiple plots for each year loaded by buttons.
// 6 sub-plots each containing a row chart.
// Each sub-plot will show a different house type and value per LA


//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig2 = "../data/Stories/Housing/",
  srcFileFig2 = "housetype.csv";

let titleFig2 = "Number of Households by Type by Region (2002-2016)";
// titleFig2 = popTitle; //set default on load
const divIDFig2 = "housing-types-chart";

const shortNames = {
  "Flat or apartment in a converted house or commercial building and bedsits": "Flat, apartment (converted) or bedsit",
  "Flat or apartment in a purpose- built block": "Flat or apartment (purpose-built)"
} // (converted house/commercial building) or bedsit"

d3.csv(srcPathFig2 + srcFileFig2)
  .then((data) => {
    let completetionsByYearByRegion = d3.nest()
      .key(function(d) {
        return d["date"];
      })
      .key(function(d) {
        return d["region"];
      })
      .object(data);

    let fig2Plots = [];

    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["Dublin City"], 'value', 'type'));
    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["Dún Laoghaire-Rathdown"], 'value', 'type'));
    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["Fingal"], 'value', 'type'));
    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["South Dublin"], 'value', 'type'));
    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["Kildare"], 'value', 'type'));
    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["Meath"], 'value', 'type'));
    fig2Plots.push(getBars(completetionsByYearByRegion["2002"]["Wicklow"], 'value', 'type'));
    fig2Plots.forEach((plot, i) => {
      plot.xaxis = 'x' + (i + 1);
      plot.yaxis = 'y' + (i + 1);
    })

    // let detachedBars = getBars(completetionsByYearByRegion["2002"]["Detached house"], 'value', 'region');
    // let detachedBars = getBars(completetionsByYearByRegion["2002"]["Detached house"], 'value', 'region');

    function getBars(data, xVar, yVar) {
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

    let fig2Layout = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS);
    fig2Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.title);
    fig2Layout.title.text = titleFig2;
    fig2Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.margin);

    const xaxisRange = [0, 70000];

    fig2Layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis.title = "Dublin City";
    fig2Layout.xaxis.visible = false;
    fig2Layout.xaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis.title] || null;
    fig2Layout.xaxis.range = xaxisRange;
    fig2Layout.xaxis.domain = [0, 0.45];
    fig2Layout.xaxis.anchor = 'y1';

    fig2Layout.xaxis2 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis2.title = "Dún Laoghaire-Rathdown";
    fig2Layout.xaxis2.visible = false;
    fig2Layout.xaxis2.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis2.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis2.title] || null;
    fig2Layout.xaxis2.range = xaxisRange;
    fig2Layout.xaxis2.domain = [0.55, 1.0];
    fig2Layout.xaxis2.anchor = 'y2';

    fig2Layout.xaxis3 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis3.title = "Fingal";
    fig2Layout.xaxis3.visible = false;
    fig2Layout.xaxis3.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis3.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis3.title] || null;
    fig2Layout.xaxis3.range = xaxisRange;
    fig2Layout.xaxis3.domain = [0.0, 0.45];
    fig2Layout.xaxis3.anchor = 'y3';

    fig2Layout.xaxis4 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis4.title = "South Dublin";
    fig2Layout.xaxis4.visible = false;
    fig2Layout.xaxis4.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis4.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis4.title] || null;
    fig2Layout.xaxis4.range = xaxisRange;
    fig2Layout.xaxis4.domain = [0.55, 1.0];
    fig2Layout.xaxis4.anchor = 'y4';

    fig2Layout.xaxis5 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis5.title = "Kildare";
    fig2Layout.xaxis5.visible = false;
    fig2Layout.xaxis5.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis5.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis5.title] || null;
    fig2Layout.xaxis5.range = xaxisRange;
    fig2Layout.xaxis5.domain = [0, 0.3];
    fig2Layout.xaxis5.anchor = 'y5';


    fig2Layout.xaxis6 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis6.title = "Meath";
    fig2Layout.xaxis6.visible = false;
    fig2Layout.xaxis6.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis6.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis6.title] || null;
    fig2Layout.xaxis6.range = xaxisRange;
    fig2Layout.xaxis6.domain = [0.35, 0.65];
    fig2Layout.xaxis6.anchor = 'y6';

    fig2Layout.xaxis7 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis);
    fig2Layout.xaxis7.title = "Wicklow";
    fig2Layout.xaxis7.visible = false;
    fig2Layout.xaxis7.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.xaxis.titlefont);
    fig2Layout.xaxis7.titlefont.color = CHART_COLORS_BY_REGION[fig2Layout.xaxis7.title] || null;
    fig2Layout.xaxis7.range = xaxisRange;
    fig2Layout.xaxis7.domain = [0.7, 1.0];
    fig2Layout.xaxis7.anchor = 'y7';


    fig2Layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis.domain = [0.7, 1.0];
    fig2Layout.yaxis.anchor = 'x1';
    fig2Layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);

    fig2Layout.yaxis2 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis2.domain = [0.7, 1.0];
    fig2Layout.yaxis2.anchor = 'x2';
    fig2Layout.yaxis2.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);

    fig2Layout.yaxis3 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis3.domain = [0.30, 0.60];
    fig2Layout.yaxis3.anchor = 'x3';
    fig2Layout.yaxis3.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);

    fig2Layout.yaxis4 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis4.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);
    fig2Layout.yaxis4.domain = [0.30, 0.60];
    fig2Layout.yaxis4.anchor = 'x4';

    fig2Layout.yaxis5 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis5.domain = [0.0, 0.15];
    fig2Layout.yaxis5.anchor = 'x5';
    fig2Layout.yaxis5.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);
    fig2Layout.yaxis5.showticklabels = false;

    fig2Layout.yaxis6 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis6.domain = [0.0, 0.15];
    fig2Layout.yaxis6.anchor = 'x6';
    fig2Layout.yaxis6.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);
    fig2Layout.yaxis6.showticklabels = false;

    fig2Layout.yaxis7 = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis);
    fig2Layout.yaxis7.domain = [0.0, 0.15];
    fig2Layout.yaxis7.anchor = 'x7';
    fig2Layout.yaxis7.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SUBPLOTS.yaxis.titlefont);
    fig2Layout.yaxis7.showticklabels = false;

    let annotations = [];
    fig2Plots.forEach((plot, i) => {
      annotations.push(getAnnotationForPlot(plot, i));
    });
    // annotations.push(getAnnotationForPlot(fig2Plots[0]));

    function getAnnotationForPlot(plot, i) {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.xref = 'x' + (i + 1); //Is order guaranteed?
      annotation.yref = 'y' + (i + 1);
      annotation.xanchor = 'right';
      annotation.align = 'right';
      annotation.x = 70000;
      annotation.y = 'Not stated';
      annotation.ay = 9;

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


    // fig2Layout.grid = {
    //   rows: 3,
    //   // columns: 2,
    //   pattern: 'independent'
    // }


    Plotly.newPlot(divIDFig2, fig2Plots, fig2Layout, {
      modeBarButtons: ROW_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true
    });

    //workaround to place y axis labels on bars
    document.getElementById(divIDFig2).on('plotly_afterplot', function() {

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
      //
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