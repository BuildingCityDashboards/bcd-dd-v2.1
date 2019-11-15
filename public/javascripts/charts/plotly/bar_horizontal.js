d3.csv("../data/Economy/employment_by_sector_all.csv")
  .then(function(data) {
    let employSector = {
      y: data.map((v) => {
        return ' ' + v["Sector"]; //add a space to pad the axis title in bar
      }),
      x: data.map((v) => {
        return v.Count;
      }),

      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'ascending'
      }],
      name: 'Employment by Sector',
      orientation: 'h',
      type: 'bar',
      mode: 'bars+text'
      // text: ['test']

    };
    let employSectorData = [employSector];
    let employSectorLayout = Object.assign({}, rowChartLayout);
    employSectorLayout.title = 'Employment by Sector';

    Plotly.newPlot('employment-sectors-chart', employSectorData, employSectorLayout, {
      modeBarButtons: rowChartModeBarButtonsInclude,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true

    });
    //workaround to place y axis labels on bars
    document.getElementById('employment-sectors-chart').on('plotly_afterplot', function() {
      let yAxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .ytick text, [class*=" yaxislayer"] .ytick text'))
      for (let i = 0; i < yAxisLabels.length; i++) {
        yAxisLabels[i].setAttribute('text-anchor', 'start');
      }
    })
  }).catch(function(err) {
    console.log("Error loading file:\n " + err)
  });