const srcPath = "../data/Stories/Housing/",
  srcFile = "pop_house.csv";
const regions = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
let title = "Growth in population and households 1991-2016";
const popTitle = "Population of Dublin and surrounding areas 1991-2016";
const houseTitle = "Number of households in Dublin and surrounding areas 1991-2016";
title = popTitle;
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
      name: regions[0],
      visible: true //'legendonly'
    };

    let dlrHouse = {
      x: dlrData.map((v) => {
        return v.date;
      }),
      y: dlrData.map((v) => {
        return v.households;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[1],
      visible: true //'legendonly'
    };

    let fHouse = {
      x: fData.map((v) => {
        return v.date;
      }),
      y: fData.map((v) => {
        return v.households;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[2],
      visible: true //'legendonly'
    };

    let sdHouse = {
      x: sdData.map((v) => {
        return v.date;
      }),
      y: sdData.map((v) => {
        return v.households;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      name: regions[3],
      visible: true //'legendonly'
    };

    let kHouse = {
      x: kData.map((v) => {
        return v.date;
      }),
      y: kData.map((v) => {
        return v.households;
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
    let mHouse = {
      x: mData.map((v) => {
        return v.date;
      }),
      y: mData.map((v) => {
        return v.households;
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
    let wHouse = {
      x: wData.map((v) => {
        return v.date;
      }),
      y: wData.map((v) => {
        return v.households;
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

    let popData = [dcPop, dlrPop, fPop, sdPop, kPop, mPop, wPop,
      dcHouse, dlrHouse, fHouse, sdHouse, kHouse, mHouse, wHouse
    ];

    //Set default visible traces
    popData.map((t, i) => {
      if (i < 7) return t.visible = true;
      else return t.visible = false;
    });


    let popLayout = Object.assign({}, multilineChartLayout);
    popLayout.title.text = title;
    popLayout.showlegend = false;
    // popLayout.hidesources = false;


    let popAnnotations = [{
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
    }]; //end of pop annotations


    let houseAnnotations = [{
      x: dcData[dcData.length - 1].date,
      y: dcData[dcData.length - 1].households,
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
      y: dlrData[dlrData.length - 1].households,
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
      ay: -3,
      borderpad: 5
    }, {
      x: fData[fData.length - 1].date,
      y: fData[fData.length - 1].households,
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
      y: sdData[sdData.length - 1].households,
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
      y: kData[kData.length - 1].households,
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
      ay: 5,
      borderpad: 5
    }, {
      x: mData[mData.length - 1].date,
      y: mData[mData.length - 1].households,
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
      y: wData[wData.length - 1].households,
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
    }]; //end of house annotations

    popLayout.annotations = popAnnotations;

    let updateMenus = [{
      buttons: [{
          args: [{
              //Each variable has 16 traces
              'visible': [true, true, true, true, true, true, true,
                false, false, false, false, false, false, false
              ]
            },
            {
              'title': popTitle,
              'annotations': popAnnotations
            }
          ],
          label: 'Population',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                true, true, true, true, true, true, true
              ]
            },
            {
              'title': houseTitle,
              'annotations': houseAnnotations
            }
          ],
          label: 'Households',
          method: 'update',
          execute: true
        }
      ],
      direction: 'down',
      pad: {
        'l': 20,
        't': 0,
        'b': 0
      },
      showactive: true,
      active: 0,
      type: 'dropdown',
      x: 0,
      xanchor: 'auto',
      y: 1,
      yanchor: 'middle'
    }];


    popLayout.updatemenus = updateMenus;

    Plotly.newPlot(divID, popData, popLayout, {
      modeBarButtons: multilineModeBarButtonsInclude,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true,
      toImageButtonOptions: {
        filename: 'testytest',
        width: null,
        height: null,
        format: 'png'
      }
    });

  })
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });