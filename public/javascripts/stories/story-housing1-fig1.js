const srcPath = "../data/Stories/Housing/",
  srcFile = "pop_house.csv";
const regions = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
const title = "Growth in population and households 1991-2016";
const divID = "population-households-chart";

d3.csv(srcPath + srcFile)
  .then(function(data) {

    let dcData = data.filter((v) => {
      return v.region === regions[0];
    });

    let dlrData = data.filter((v) => {
      return v.region === regions[1];
    });

    let fData = data.filter((v) => {
      return v.region === regions[2];
    });

    let sdData = data.filter((v) => {
      return v.region === regions[3];
    });

    let kData = data.filter((v) => {
      return v.region === regions[4];
    });

    let mData = data.filter((v) => {
      return v.region === regions[5];
    });

    let wData = data.filter((v) => {
      return v.region === regions[6];
    });

    let popProjDC = {
      x: dcData.map((v) => {
        return v.date;
      }),
      y: dcData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[0],
      visible: true //'legendonly'
    };

    // let popProjNI = {
    //   x: niData.map((v) => {
    //     return v.Year;
    //   }),
    //   y: niData.map((v) => {
    //     return v.Count;
    //   }),
    //   mode: 'lines+markers',
    //   name: 'NI',
    //   visible: 'legendonly'
    // };
    //
    // let popProjDon = {
    //   x: donegalData.map((v) => {
    //     return v.Year;
    //   }),
    //   y: donegalData.map((v) => {
    //     return v.Count;
    //   }),
    //   mode: 'lines+markers',
    //   name: 'Donegal'
    // };
    //
    // let popProjROI = {
    //   x: roiData.map((v) => {
    //     return v.Year;
    //   }),
    //   y: roiData.map((v) => {
    //     return v.Count;
    //   }),
    //   mode: 'lines+markers',
    //   name: 'RoI',
    //   visible: 'legendonly'
    // };

    let popProjectionData = [popProjDC]
    //, popProjNI, popProjDon, popProjDS];
    let popProjectionLayout = Object.assign({}, multilineChartLayout);
    popProjectionLayout.title.text = title;
    popProjectionLayout.legend = {
      x: 1,
      y: 1,
      'orientation': 'v'
    };

    Plotly.newPlot(divID, popProjectionData, popProjectionLayout, {
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