d3.csv("../data/Demographics/population_projections.csv")
  .then(function(data) {

    let dsData = data.filter((v) => {
      return v.Region === "D&S";
    });

    let niData = data.filter((v) => {
      return v.Region === "NI";
    });

    let donegalData = data.filter((v) => {
      return v.Region === "Donegal";
    });

    let roiData = data.filter((v) => {
      return v.Region === "ROI";
    });

    let popProjDS = {
      x: dsData.map((v) => {
        return v.Year;
      }),
      y: dsData.map((v) => {
        return v.Count;
      }),
      mode: 'lines+markers',
      name: 'D&S'
    };

    let popProjNI = {
      x: niData.map((v) => {
        return v.Year;
      }),
      y: niData.map((v) => {
        return v.Count;
      }),
      mode: 'lines+markers',
      name: 'NI',
      visible: 'legendonly'
    };

    let popProjDon = {
      x: donegalData.map((v) => {
        return v.Year;
      }),
      y: donegalData.map((v) => {
        return v.Count;
      }),
      mode: 'lines+markers',
      name: 'Donegal'
    };

    let popProjROI = {
      x: roiData.map((v) => {
        return v.Year;
      }),
      y: roiData.map((v) => {
        return v.Count;
      }),
      mode: 'lines+markers',
      name: 'RoI',
      visible: 'legendonly'
    };

    let popProjectionData = [popProjROI, popProjNI, popProjDon, popProjDS];
    let popProjectionLayout = Object.assign({}, multilineChartLayout);
    popProjectionLayout.title = 'Population Projections';
    popProjectionLayout.legend = {
      x: 1,
      y: 0.5
    };

    Plotly.newPlot('pop-projection-chart', popProjectionData, popProjectionLayout, {
      modeBarButtons: multilineModeBarButtonsInclude,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true
    });

  })
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });