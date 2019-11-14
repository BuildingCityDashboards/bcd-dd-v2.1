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
      // .map(function(d) {
      //   // d["type"]
      //   return d;
      // })
      .object(data);

    // console.log(Object.keys(completetionsByYearByRegion["2002"]));

    // console.log(completetionsByYearByRegion.filter("2002"));
    //generate a color array ordered by the data- pick arbitrary data subset
    let colourArray = [];
    // Object.keys(completetionsByYearByRegion["2002"]).map((v) => {
    //   console.log(v);
    //   return CHART_COLORS_BY_REGION[v] || 'lightgrey';
    // })

    // console.log(colourArray);

    // Object.keys(completetionsByYearByRegion). //years
    // Object.keys(completetionsByYearByRegion).map((year) => {
    //   return getBars(year);
    // }); //types

    let dc2002 = getBars(completetionsByYearByRegion["2002"]["Dublin City"], 'value', 'type');
    let dlr2002 = getBars(completetionsByYearByRegion["2002"]["Dún Laoghaire-Rathdown"], 'value', 'type');
    dlr2002.xaxis = 'x2';
    dlr2002.yaxis = 'y2';
    let f2002 = getBars(completetionsByYearByRegion["2002"]["Fingal"], 'value', 'type');
    f2002.xaxis = 'x3';
    f2002.yaxis = 'y3';
    let sdcc2002 = getBars(completetionsByYearByRegion["2002"]["South Dublin"], 'value', 'type');
    sdcc2002.xaxis = 'x4';
    sdcc2002.yaxis = 'y4';
    let k2002 = getBars(completetionsByYearByRegion["2002"]["Kildare"], 'value', 'type');
    k2002.xaxis = 'x5';
    k2002.yaxis = 'y5';
    let m2002 = getBars(completetionsByYearByRegion["2002"]["Meath"], 'value', 'type');
    m2002.xaxis = 'x6';
    m2002.yaxis = 'y6';
    let w2002 = getBars(completetionsByYearByRegion["2002"]["Wicklow"], 'value', 'type');
    w2002.xaxis = 'x7';
    w2002.yaxis = 'y7';

    // let detachedBars = getBars(completetionsByYearByRegion["2002"]["Detached house"], 'value', 'region');
    // let detachedBars = getBars(completetionsByYearByRegion["2002"]["Detached house"], 'value', 'region');

    function getBars(data, xVar, yVar) {
      // console.log("data: " + JSON.stringify(data[0]["region"]));
      // colourArray.push(CHART_COLORS_BY_REGION[data[0]["region"]] || 'lightgrey');
      console.log(colourArray);
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
        name: '',
        orientation: 'h',
        type: 'bar',
        mode: 'bars+text',
        marker: {
          color: CHART_COLORS_BY_REGION[data[0]["region"]] || 'lightgrey'
        },
        // text: ['test']
      }
      return trace;
    }


    let fig2Layout = Object.assign({}, ROW_CHART_LAYOUT_SMALL);
    fig2Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SMALL.title);
    fig2Layout.title.text = titleFig2;
    fig2Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SMALL.margin);

    const xaxisRange = [0, 70000];
    fig2Layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis.title = "Dublin City";
    fig2Layout.xaxis.range = xaxisRange;
    fig2Layout.xaxis2 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis2.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis2.title = "Dún Laoghaire-Rathdown";
    fig2Layout.xaxis2.range = xaxisRange;
    fig2Layout.xaxis3 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis3.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis3.title = "Fingal";
    fig2Layout.xaxis3.range = xaxisRange;
    fig2Layout.xaxis4 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis4.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis4.title = "South Dublin";
    fig2Layout.xaxis4.range = xaxisRange;
    fig2Layout.xaxis5 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis5.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis5.title = "Kildare";
    fig2Layout.xaxis5.range = xaxisRange;
    fig2Layout.xaxis6 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis6.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis6.title = "Meath";
    fig2Layout.xaxis6.range = xaxisRange;
    fig2Layout.xaxis7 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis7.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis7.title = "Wicklow";
    fig2Layout.xaxis7.range = xaxisRange;

    fig2Layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis.titlefont.color =
      fig2Layout.yaxis2 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis2.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis3 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis3.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis4 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis4.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis5 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis5.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis6 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis6.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis7 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis7.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);


    fig2Layout.grid = {
      rows: 4,
      columns: 2,
      pattern: 'independent'
    }

    let plots = [dc2002, dlr2002, f2002, sdcc2002, k2002, m2002, w2002];
    Plotly.newPlot(divIDFig2, plots, fig2Layout, {
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

      let y5AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y5tick text, [class*=" yaxislayer"] .y5tick text'))
      for (let i = 0; i < y5AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
        y5AxisLabels[i].setAttribute('text-anchor', 'start');
        let y5x = parseInt(y5AxisLabels[i].getAttribute('x'));
        y5x += 5;
        y5AxisLabels[i].setAttribute('x', y5x); //add left spacing
      }

      let y6AxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .y6tick text, [class*=" yaxislayer"] .y6tick text'))
      for (let i = 0; i < y6AxisLabels.length; i++) {
        // yAxisLabels[i].setAttribute('visible', true);
        y6AxisLabels[i].setAttribute('text-anchor', 'start');
        let y6x = parseInt(y6AxisLabels[i].getAttribute('x'));
        y6x += 5;
        y6AxisLabels[i].setAttribute('x', y6x); //add left spacing
      }

    })

  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });