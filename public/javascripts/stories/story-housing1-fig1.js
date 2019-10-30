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
    let lastY = dcData[dcData.length - 1].population;
    let lastX = dcData[dcData.length - 1].date;


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

    let dcPop = {
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

    let dlrPop = {
      x: dlrData.map((v) => {
        return v.date;
      }),
      y: dlrData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[1],
      visible: true //'legendonly'
    };

    let fPop = {
      x: fData.map((v) => {
        return v.date;
      }),
      y: fData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[2],
      visible: true //'legendonly'
    };

    let sdPop = {
      x: sdData.map((v) => {
        return v.date;
      }),
      y: sdData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[3],
      visible: true //'legendonly'
    };

    let kPop = {
      x: kData.map((v) => {
        return v.date;
      }),
      y: kData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[4],
      visible: true //'legendonly'
    };

    let mPop = {
      x: mData.map((v) => {
        return v.date;
      }),
      y: mData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[5],
      visible: true //'legendonly'
    };

    let wPop = {
      x: wData.map((v) => {
        return v.date;
      }),
      y: wData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[6],
      visible: true //'legendonly'
    };

    // let dcHouse = {
    //   x: dcData.map((v) => {
    //     return v.date;
    //   }),
    //   y: dcData.map((v) => {
    //     return v.households;
    //   }),
    //   type: 'scatter',
    //   mode: 'lines+markers',
    //   name: regions[0] + ' house',
    //   visible: true //'legendonly'
    // };

    let popData = [dcPop, dlrPop, fPop, sdPop, kPop, mPop, wPop];
    //, popProjNI, popProjDon, popProjDS];
    let popLayout = Object.assign({}, multilineChartLayout);
    popLayout.title.text = title;
    popLayout.showlegend = false;

    popLayout.legend = {
      x: 0.95,
      y: 0.99
    };

    popLayout.annotations = [{
      x: lastX,
      y: lastY,
      xref: 'x',
      yref: 'y',
      align: 'right',
      text: regions[0],
      showarrow: true,
      arrowhead: 7,
      ax: 50,
      ay: 0
    }]

    Plotly.newPlot(divID, popData, popLayout, {
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