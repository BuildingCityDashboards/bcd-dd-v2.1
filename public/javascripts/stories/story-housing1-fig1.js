const srcPath = "../data/Stories/Housing/",
  srcFile1 = "pop_house.csv",
  srcFile2 = "pop_house_rate_new.csv";
const regions = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
let title = "Growth in population and households 1991-2016";
const popTitle = "Populations of Dublin and surrounding areas 1991-2016";
const houseTitle = "Numbers of households in Dublin and surrounding areas 1991-2016";
const popRateTitle = "Population % changes in Dublin and surrounding areas 1991-2016";
const houseRateTitle = "Households % changes in Dublin and surrounding areas 1991-2016";
title = popTitle;
const divID = "population-households-chart";
Promise.all([
    d3.csv(srcPath + srcFile1),
    d3.csv(srcPath + srcFile2)
  ]).then(function(data) {

    let dcData = data[0].filter((v) => {
      return v.region === regions[0];
    });

    let dlrData = data[0].filter((v) => {
      return v.region === regions[1];
    });

    let fData = data[0].filter((v) => {
      return v.region === regions[2];
    });

    let sdData = data[0].filter((v) => {
      return v.region === regions[3];
    });

    let kData = data[0].filter((v) => {
      return v.region === regions[4];
    });

    let mData = data[0].filter((v) => {
      return v.region === regions[5];
    });

    let wData = data[0].filter((v) => {
      return v.region === regions[6];
    });
    //Traces
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let dlrHouse = {
      x: dlrData.map((v) => {
        return v.date;
      }),
      y: dlrData.map((v) => {
        return v.households;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let fHouse = {
      x: fData.map((v) => {
        return v.date;
      }),
      y: fData.map((v) => {
        return v.households;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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
      line: {
        shape: 'spline'
      },
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

    let dcRateData = data[1].filter((v) => {
      return v.region === regions[0];
    });
    let dlrRateData = data[1].filter((v) => {
      return v.region === regions[1];
    });
    let fRateData = data[1].filter((v) => {
      return v.region === regions[2];
    });
    let sdRateData = data[1].filter((v) => {
      return v.region === regions[3];
    });
    let kRateData = data[1].filter((v) => {
      return v.region === regions[4];
    });
    let mRateData = data[1].filter((v) => {
      return v.region === regions[5];
    });
    let wRateData = data[1].filter((v) => {
      return v.region === regions[6];
    });

    let dcPopRate = {
      x: dcRateData.map((v) => {
        return v.date;
      }),
      y: dcRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let dlrPopRate = {
      x: dlrRateData.map((v) => {
        return v.date;
      }),
      y: dlrRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let fPopRate = {
      x: fRateData.map((v) => {
        return v.date;
      }),
      y: fRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let sdPopRate = {
      x: sdRateData.map((v) => {
        return v.date;
      }),
      y: sdRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let kPopRate = {
      x: kRateData.map((v) => {
        return v.date;
      }),
      y: kRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 0.5,
      line: {
        shape: 'spline'
      },
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
    let mPopRate = {
      x: mRateData.map((v) => {
        return v.date;
      }),
      y: mRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 0.5,
      line: {
        shape: 'spline'
      },
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
    let wPopRate = {
      x: wRateData.map((v) => {
        return v.date;
      }),
      y: wRateData.map((v) => {
        return v.population_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 0.5,
      line: {
        shape: 'spline'
      },
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

    let dcHouseRate = {
      x: dcRateData.map((v) => {
        return v.date;
      }),
      y: dcRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let dlrHouseRate = {
      x: dlrRateData.map((v) => {
        return v.date;
      }),
      y: dlrRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let fHouseRate = {
      x: fRateData.map((v) => {
        return v.date;
      }),
      y: fRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let sdHouseRate = {
      x: sdRateData.map((v) => {
        return v.date;
      }),
      y: sdRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 1.0,
      line: {
        shape: 'spline'
      },
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
    let kHouseRate = {
      x: kRateData.map((v) => {
        return v.date;
      }),
      y: kRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 0.5,
      line: {
        shape: 'spline'
      },
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
    let mHouseRate = {
      x: mRateData.map((v) => {
        return v.date;
      }),
      y: mRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 0.5,
      line: {
        shape: 'spline'
      },
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
    let wHouseRate = {
      x: wRateData.map((v) => {
        return v.date;
      }),
      y: wRateData.map((v) => {
        return v.households_rate;
      }),
      type: 'scatter',
      mode: 'lines+markers',
      opacity: 0.5,
      line: {
        shape: 'spline'
      },
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
      dcHouse, dlrHouse, fHouse, sdHouse, kHouse, mHouse, wHouse,
      dcPopRate, dlrPopRate, fPopRate, sdPopRate, kPopRate, mPopRate, wPopRate,
      dcHouseRate, dlrHouseRate, fHouseRate, sdHouseRate, kHouseRate, mHouseRate, wHouseRate
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

    let popRateAnnotations = [{
      x: dcRateData[dcRateData.length - 1].date,
      y: dcRateData[dcRateData.length - 1].population_rate,
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
      ay: 6,
      borderpad: 5
    }, {
      x: dlrRateData[dlrRateData.length - 1].date,
      y: dlrRateData[dlrRateData.length - 1].population_rate,
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
      ay: -6,
      borderpad: 5
    }, {
      x: fRateData[fRateData.length - 1].date,
      y: fRateData[fRateData.length - 1].population_rate,
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
      x: sdRateData[sdRateData.length - 1].date,
      y: sdRateData[sdRateData.length - 1].population_rate,
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
      x: kRateData[kRateData.length - 1].date,
      y: kRateData[kRateData.length - 1].population_rate,
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
      ay: 2,
      borderpad: 5
    }, {
      x: mRateData[mRateData.length - 1].date,
      y: mRateData[mRateData.length - 1].population_rate,
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
      ay: -2,
      borderpad: 5
    }, {
      x: wRateData[wRateData.length - 1].date,
      y: wRateData[wRateData.length - 1].population_rate,
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
    }]; //end of pop rate annotations

    let houseRateAnnotations = [{
      x: dcRateData[dcRateData.length - 1].date,
      y: dcRateData[dcRateData.length - 1].households_rate,
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
      ay: 2,
      borderpad: 5
    }, {
      x: dlrRateData[dlrRateData.length - 1].date,
      y: dlrRateData[dlrRateData.length - 1].households_rate,
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
      ay: -2,
      borderpad: 5
    }, {
      x: fRateData[fRateData.length - 1].date,
      y: fRateData[fRateData.length - 1].households_rate,
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
      x: sdRateData[sdRateData.length - 1].date,
      y: sdRateData[sdRateData.length - 1].households_rate,
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
      x: kRateData[kRateData.length - 1].date,
      y: kRateData[kRateData.length - 1].households_rate,
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
      ay: -6,
      borderpad: 5
    }, {
      x: mRateData[mRateData.length - 1].date,
      y: mRateData[mRateData.length - 1].households_rate,
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
      ay: 6,
      borderpad: 5
    }, {
      x: wRateData[wRateData.length - 1].date,
      y: wRateData[wRateData.length - 1].households_rate,
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
    }]; //end of house rate annotations

    popLayout.annotations = popAnnotations;

    let updateMenus = [{
      buttons: [{
          args: [{
              //Each variable has 16 traces
              'visible': [true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false
              ]
            },
            {
              'title': popTitle,
              'annotations': popAnnotations
            }
          ],
          label: 'Populations',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false
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
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                true, true, true, true, true, true, true,
                false, false, false, false, false, false, false,
              ]
            },
            {
              'title': popRateTitle,
              'annotations': popRateAnnotations
            }
          ],
          label: 'Population % change',
          method: 'update',
          execute: true
        },
        {
          args: [{
              'visible': [false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                false, false, false, false, false, false, false,
                true, true, true, true, true, true, true
              ]
            },
            {
              'title': houseRateTitle,
              'annotations': houseRateAnnotations
            }
          ],
          label: 'Households % change',
          method: 'update',
          execute: true
        }
      ],
      direction: 'down',
      pad: {
        'l': 0,
        't': 0,
        'b': 0
      },
      showactive: true,
      active: 0,
      type: 'buttons',
      x: -0.05,
      xref: 'container',
      xanchor: 'right',
      yref: 'container',
      y: 1,
      yanchor: 'top'
    }];


    popLayout.updatemenus = updateMenus;

    Plotly.newPlot(divID, popData, popLayout, {
      modeBarButtons: multilineModeBarButtonsInclude,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true,
      toImageButtonOptions: {
        filename: 'Dublin Dashboard - ' + title,
        width: null,
        height: null,
        format: 'png'
      }
    });


  })
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });