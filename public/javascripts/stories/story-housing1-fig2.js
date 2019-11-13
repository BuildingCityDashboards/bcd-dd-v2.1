// Chart of house completions over time, by type of house, for each region in Dublin+
// This chart will have multiple plots for each year loaded by buttons.
// 6 sub-plots each containing a row chart.
// Each sub-plot will show a different house type and value per LA


//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig2 = "../data/Stories/Housing/",
  srcFileFig2 = "housetype.csv";

const regionsFig2 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
const yearsFig2 = ["Detached house", "Semi-detached house", "Terraced house",
  "Flat or apartment in a purpose- built block", "Flat or apartment in a converted house or commercial building and bedsits",
  "Not stated"
];
let titleFig2 = "Number of Household Types by Region (2002-2016)";
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

    // console.log(completetionsByYearByType);
    //generate a color array ordered by the data
    let colourArray = completetionsByYearByType["2002"]["Detached house"].map((v) => {
      return CHART_COLORS_BY_REGION[v["region"]] || 'grey';
    })

    let bars = {
      x: completetionsByYearByType["2002"]["Detached house"].map((v) => {
        return v["value"];
      }),
      y: completetionsByYearByType["2002"]["Detached house"].map((v) => {
        return v["region"];
      }),
      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'ascending'
      }],
      name: 'blah',
      orientation: 'h',
      type: 'bar',
      mode: 'bars+text',
      marker: {
        color: colourArray //order not guaranteed here!!!
      },
      // text: ['test']
    }

    let fig2Layout = Object.assign({}, ROW_CHART_LAYOUT_SMALL);
    fig2Layout.title = Object.assign({}, ROW_CHART_LAYOUT_SMALL.title);
    fig2Layout.title.text = titleFig2;
    fig2Layout.margin = Object.assign({}, ROW_CHART_LAYOUT_SMALL.margin);
    fig2Layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis);
    fig2Layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT_SMALL.yaxis.titlefont);
    fig2Layout.yaxis.titlefont.size = 32;

    Plotly.newPlot(divIDFig2, [bars], fig2Layout, {
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
        yAxisLabels[i].setAttribute('text-anchor', 'start');
        yAxisLabels[i].setAttribute('font-color', '#ffffb3');
        yAxisLabels[i].setAttribute('text-indent', '50px');
      }
    })

  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });