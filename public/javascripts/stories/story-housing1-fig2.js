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

d3.csv(srcPathFig2 + srcFileFig2)
  .then((data) => {
    let completetionsByYearByType = d3.nest()
      .key(function(d) {
        return d["date"];
      })
      .key(function(d) {
        return d["type"];
      })
      .object(data);

    // console.log(completetionsByYearByType.filter("2002"));
    //generate a color array ordered by the data- pick arbitrary data subset
    let colourArray = completetionsByYearByType["2002"]["Detached house"].map((v) => {
      return CHART_COLORS_BY_REGION[v["region"]] || 'lightgrey';
    })

    // Object.keys(completetionsByYearByType). //years
    // Object.keys(completetionsByYearByType).map((year) => {
    //   return getBars(year);
    // }); //types

    let detachedBars = getBars(completetionsByYearByType["2002"]["Detached house"], 'value', 'region');
    let semidBars = getBars(completetionsByYearByType["2002"]["Semi-detached house"], 'value', 'region');
    semidBars.xaxis = 'x2';
    semidBars.yaxis = 'y2';
    let terracedBars = getBars(completetionsByYearByType["2002"]["Terraced house"], 'value', 'region');
    terracedBars.xaxis = 'x3';
    terracedBars.yaxis = 'y3';
    let flatBlockBars = getBars(completetionsByYearByType["2002"]["Flat or apartment in a purpose- built block"], 'value', 'region');
    flatBlockBars.xaxis = 'x4';
    flatBlockBars.yaxis = 'y4';
    let flatConvertBars = getBars(completetionsByYearByType["2002"]["Flat or apartment in a converted house or commercial building and bedsits"], 'value', 'region');
    flatConvertBars.xaxis = 'x5';
    flatConvertBars.yaxis = 'y5';
    let notStatedBars = getBars(completetionsByYearByType["2002"]["Not stated"], 'value', 'region');
    notStatedBars.xaxis = 'x6';
    notStatedBars.yaxis = 'y6';

    // let detachedBars = getBars(completetionsByYearByType["2002"]["Detached house"], 'value', 'region');
    // let detachedBars = getBars(completetionsByYearByType["2002"]["Detached house"], 'value', 'region');

    function getBars(data, xVar, yVar) {
      let trace = {
        x: data.map((v) => {
          return v[xVar];
        }),
        y: data.map((v) => {
          return v[yVar];
        }),
        xaxis: null,
        yaxis: null,
        transforms: [{
          type: 'sort',
          target: 'x',
          order: 'ascending'
        }],
        name: '',
        orientation: 'h',
        type: 'bar',
        mode: 'bars+text',
        marker: {
          color: colourArray
        },
        // text: ['test']
      }
      return trace;
    }


    let fig2Layout = Object.assign({}, ROW_CHART_LAYOUT_SMALL);
    fig2Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SMALL.title);
    fig2Layout.title.text = titleFig2;
    fig2Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SMALL.margin);

    fig2Layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis.title = "Detached house";
    fig2Layout.xaxis2 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis2.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis2.title = "Semi-detached house";
    fig2Layout.xaxis3 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis3.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis3.title = "Terraced house";
    fig2Layout.xaxis4 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis4.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis4.title = "Flat or apartment (purpose-built)";
    fig2Layout.xaxis5 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis5.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis5.title = "Flat, apartment (converted) or bedsit";
    fig2Layout.xaxis6 = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis);
    fig2Layout.xaxis6.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.xaxis.titlefont);
    fig2Layout.xaxis6.title = "Not stated";

    fig2Layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
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

    fig2Layout.grid = {
      rows: 3,
      columns: 2,
      pattern: 'independent'
    }

    let plots = [detachedBars, semidBars, terracedBars, flatBlockBars, flatConvertBars, notStatedBars];
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
    })

  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });