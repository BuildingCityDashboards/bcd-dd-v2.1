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

    let dcPop = {
      x: dcData.map((v) => {
        return v.date;
      }),
      y: dcData.map((v) => {
        return v.population;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      marker: {
        symbol: null,
        color: null, //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
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
      opacity: 1.0,
      marker: {
        symbol: null,
        color: null, //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
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
      opacity: 1.0,
      marker: {
        symbol: null,
        color: null, //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
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
      opacity: 1.0,
      marker: {
        symbol: null,
        color: null, //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
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
      opacity: 0.5,
      marker: {
        symbol: null,
        color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
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
      opacity: 0.5,
      marker: {
        symbol: null,
        color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
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
      opacity: 0.5,
      marker: {
        symbol: null,
        color: colorWay[colorWay.length - 1], //lines + markers, defaults to colorway
        line: {
          width: null,
          color: null
        }
      },
      name: regions[6],
      visible: true //'legendonly'
    };

    let dcHouse = {
      x: dcData.map((v) => {
        return v.date;
      }),
      y: dcData.map((v) => {
        return v.households;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[0] + ' house',
      visible: true //'legendonly'
    };

    let popData = [dcPop, dlrPop, fPop, sdPop, kPop, mPop, wPop, dcHouse];

    let updateMenus = [{
      buttons: [{
          args: [{
              //Each variable has 16 traces
              'visible': [true, true, true, true, true, true, true, false]
            },
            {
              'title': 'Pop',
              // 'annotations': high_annotations
            }
          ],
          label: 'Pop',
          method: 'update'
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false, true]
            },
            {
              'title': 'House',
              // 'annotations': high_annotations
            }
          ],
          label: 'House',
          method: 'update'
        }
      ],
      direction: 'left',
      pad: {
        'r': 10,
        't': 10
      },
      showactive: true,
      type: 'buttons',
      x: 0.5,
      xanchor: 'center',
      y: 0.95,
      yanchor: 'bottom'
    }];

    let popLayout = Object.assign({}, multilineChartLayout);
    popLayout.title.text = title;
    popLayout.showlegend = false;
    popLayout.updatemenus = updateMenus;


    popLayout.annotations = [{
      x: dcData[dcData.length - 1].date,
      y: dcData[dcData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null, //text box
      height: null,
      align: 'right', //within textbox
      text: regions[0],
      font: {
        family: null,
        size: null,
        color: colorWay[0]
      },
      showarrow: true, //need this to use ay offset
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: 0,
      borderpad: 5
    }, {
      x: dlrData[dlrData.length - 1].date,
      y: dlrData[dlrData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null,
      height: null,
      align: 'right',
      text: regions[1],
      font: {
        family: null,
        size: null,
        color: colorWay[1]
      },
      showarrow: true,
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: 5,
      borderpad: 5
    }, {
      x: fData[fData.length - 1].date,
      y: fData[fData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null,
      height: null,
      align: 'right',
      text: regions[2],
      font: {
        family: null,
        size: null,
        color: colorWay[2]
      },
      showarrow: true,
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: -5,
      borderpad: 5
    }, {
      x: sdData[sdData.length - 1].date,
      y: sdData[sdData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null,
      height: null,
      align: 'right',
      text: regions[3],
      font: {
        family: null,
        size: null,
        color: colorWay[3]
      },
      showarrow: true,
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: 5,
      borderpad: 5
    }, {
      x: kData[kData.length - 1].date,
      y: kData[kData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null,
      height: null,
      align: 'right',
      text: regions[4],
      font: {
        family: null,
        size: null,
        color: colorWay[colorWay.length - 1] //last element should be grey
      },
      showarrow: true,
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: -7,
      borderpad: 5
    }, {
      x: mData[mData.length - 1].date,
      y: mData[mData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null,
      height: null,
      align: 'right',
      text: regions[5],
      font: {
        family: null,
        size: null,
        color: colorWay[colorWay.length - 1]
      },
      showarrow: true,
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: 4,
      borderpad: 5
    }, {
      x: wData[wData.length - 1].date,
      y: wData[wData.length - 1].population,
      xref: 'x',
      yref: 'y',
      width: null,
      height: null,
      align: 'right',
      text: regions[6],
      font: {
        family: null,
        size: null,
        color: colorWay[colorWay.length - 1]
      },
      showarrow: true,
      xanchor: 'left',
      arrowcolor: '#fff',
      arrowhead: 7,
      ax: 0,
      ay: 0,
      borderpad: 5
    }]; //end of annotations

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