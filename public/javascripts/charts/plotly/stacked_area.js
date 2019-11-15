/*Because of the number of statistics here, this approach is quite unwieldy,
better way such as https://plot.ly/javascript/custom-buttons/#update-button */

d3.csv("../data/Economy/donegal_business_demography_all.csv")
  .then(function(rows) {
    // console.log("rows: " + JSON.stringify(rows))
    /*TODO: automate based on column names and variables*/
    //Active Enterprise Variable
    //1
    let miningDataActive = rows.filter((v) => {
      return v.Business === "Mining and quarrying (B)" && v.Statistic === "Active Enterprise (Number)";
    });
    let manuDataActive = rows.filter((v) => {
      return v.Business === "Manufacturing (C)" && v.Statistic === "Active Enterprise (Number)";
    });
    let electricityDataActive = rows.filter((v) => {
      return v.Business === "Electricity, gas, steam and air conditioning supply (D)" && v.Statistic === "Active Enterprise (Number)";
    });
    let waterDataActive = rows.filter((v) => {
      return v.Business === "Water supply, sewerage, waste management and remediation activities (E)" && v.Statistic === "Active Enterprise (Number)";
    });
    //5
    let constructionDataActive = rows.filter((v) => {
      return v.Business === "Construction (F)" && v.Statistic === "Active Enterprise (Number)";
    });
    let motorDataActive = rows.filter((v) => {
      return v.Business === "Wholesale and retail trade, repair of motor vehicles and motorcycles (G)" && v.Statistic === "Active Enterprise (Number)";
    });
    let transportationDataActive = rows.filter((v) => {
      return v.Business === "Transportation and storage (H)" && v.Statistic === "Active Enterprise (Number)";
    });
    let accomodationDataActive = rows.filter((v) => {
      return v.Business === "Accommodation and food service activities (I)" && v.Statistic === "Active Enterprise (Number)";
    });
    //9
    let infoDataActive = rows.filter((v) => {
      return v.Business === "Information and communication (J)" && v.Statistic === "Active Enterprise (Number)";
    });
    let financialDataActive = rows.filter((v) => {
      return v.Business === "Financial and insurance activities excluding activities of holding companies (K-642)" && v.Statistic === "Active Enterprise (Number)";
    });
    let realEstateDataActive = rows.filter((v) => {
      return v.Business === "Real estate activities (L)" && v.Statistic === "Active Enterprise (Number)";
    });
    let technicalDataActive = rows.filter((v) => {
      return v.Business === "Professional, scientific and technical activities (M)" && v.Statistic === "Active Enterprise (Number)";
    });
    //13
    let adminDataActive = rows.filter((v) => {
      return v.Business === "Administrative and support service activities (N)" && v.Statistic === "Active Enterprise (Number)";
    });
    let eduDataActive = rows.filter((v) => {
      return v.Business === "Education (P)" && v.Statistic === "Active Enterprise (Number)";
    });
    let ictDataActive = rows.filter((v) => {
      return v.Business === "ICT services (261 to 264,268,465,582,61,62,631)" && v.Statistic === "Active Enterprise (Number)";
    });
    //16
    let businessDataActive = rows.filter((v) => {
      return v.Business === "Business economy excluding activities of holding companies (B to N,-642)" && v.Statistic === "Active Enterprise (Number)";
    });
    //Persons Engaged Variable
    //1
    let miningDataPersons = rows.filter((v) => {
      return v.Business === "Mining and quarrying (B)" && v.Statistic === "Persons Engaged (Number)";
    });
    let manuDataPersons = rows.filter((v) => {
      return v.Business === "Manufacturing (C)" && v.Statistic === "Persons Engaged (Number)";
    });
    let electricityDataPersons = rows.filter((v) => {
      return v.Business === "Electricity, gas, steam and air conditioning supply (D)" && v.Statistic === "Persons Engaged (Number)";
    });
    let waterDataPersons = rows.filter((v) => {
      return v.Business === "Water supply, sewerage, waste management and remediation activities (E)" && v.Statistic === "Persons Engaged (Number)";
    });
    //5
    let constructionDataPersons = rows.filter((v) => {
      return v.Business === "Construction (F)" && v.Statistic === "Persons Engaged (Number)";
    });
    let motorDataPersons = rows.filter((v) => {
      return v.Business === "Wholesale and retail trade, repair of motor vehicles and motorcycles (G)" && v.Statistic === "Persons Engaged (Number)";
    });
    let transportationDataPersons = rows.filter((v) => {
      return v.Business === "Transportation and storage (H)" && v.Statistic === "Persons Engaged (Number)";
    });
    let accomodationDataPersons = rows.filter((v) => {
      return v.Business === "Accommodation and food service activities (I)" && v.Statistic === "Persons Engaged (Number)";
    });
    //9
    let infoDataPersons = rows.filter((v) => {
      return v.Business === "Information and communication (J)" && v.Statistic === "Persons Engaged (Number)";
    });
    let financialDataPersons = rows.filter((v) => {
      return v.Business === "Financial and insurance activities excluding activities of holding companies (K-642)" && v.Statistic === "Persons Engaged (Number)";
    });
    let realEstateDataPersons = rows.filter((v) => {
      return v.Business === "Real estate activities (L)" && v.Statistic === "Persons Engaged (Number)";
    });
    let technicalDataPersons = rows.filter((v) => {
      return v.Business === "Professional, scientific and technical activities (M)" && v.Statistic === "Persons Engaged (Number)";
    });
    //13
    let adminDataPersons = rows.filter((v) => {
      return v.Business === "Administrative and support service activities (N)" && v.Statistic === "Persons Engaged (Number)";
    });
    let eduDataPersons = rows.filter((v) => {
      return v.Business === "Education (P)" && v.Statistic === "Persons Engaged (Number)";
    });
    let ictDataPersons = rows.filter((v) => {
      return v.Business === "ICT services (261 to 264,268,465,582,61,62,631)" && v.Statistic === "Persons Engaged (Number)";
    });
    //16
    let businessDataPersons = rows.filter((v) => {
      return v.Business === "Business economy excluding activities of holding companies (B to N,-642)" && v.Statistic === "Persons Engaged (Number)";
    });

    //Employees Variable
    //1
    let miningDataEmployees = rows.filter((v) => {
      return v.Business === "Mining and quarrying (B)" && v.Statistic === "Employees (Number)";
    });
    let manuDataEmployees = rows.filter((v) => {
      return v.Business === "Manufacturing (C)" && v.Statistic === "Employees (Number)";
    });
    let electricityDataEmployees = rows.filter((v) => {
      return v.Business === "Electricity, gas, steam and air conditioning supply (D)" && v.Statistic === "Employees (Number)";
    });
    let waterDataEmployees = rows.filter((v) => {
      return v.Business === "Water supply, sewerage, waste management and remediation activities (E)" && v.Statistic === "Employees (Number)";
    });
    //5
    let constructionDataEmployees = rows.filter((v) => {
      return v.Business === "Construction (F)" && v.Statistic === "Employees (Number)";
    });
    let motorDataEmployees = rows.filter((v) => {
      return v.Business === "Wholesale and retail trade, repair of motor vehicles and motorcycles (G)" && v.Statistic === "Employees (Number)";
    });
    let transportationDataEmployees = rows.filter((v) => {
      return v.Business === "Transportation and storage (H)" && v.Statistic === "Employees (Number)";
    });
    let accomodationDataEmployees = rows.filter((v) => {
      return v.Business === "Accommodation and food service activities (I)" && v.Statistic === "Employees (Number)";
    });
    //9
    let infoDataEmployees = rows.filter((v) => {
      return v.Business === "Information and communication (J)" && v.Statistic === "Employees (Number)";
    });
    let financialDataEmployees = rows.filter((v) => {
      return v.Business === "Financial and insurance activities excluding activities of holding companies (K-642)" && v.Statistic === "Employees (Number)";
    });
    let realEstateDataEmployees = rows.filter((v) => {
      return v.Business === "Real estate activities (L)" && v.Statistic === "Employees (Number)";
    });
    let technicalDataEmployees = rows.filter((v) => {
      return v.Business === "Professional, scientific and technical activities (M)" && v.Statistic === "Employees (Number)";
    });
    //13
    let adminDataEmployees = rows.filter((v) => {
      return v.Business === "Administrative and support service activities (N)" && v.Statistic === "Employees (Number)";
    });
    let eduDataEmployees = rows.filter((v) => {
      return v.Business === "Education (P)" && v.Statistic === "Employees (Number)";
    });
    let ictDataEmployees = rows.filter((v) => {
      return v.Business === "ICT services (261 to 264,268,465,582,61,62,631)" && v.Statistic === "Employees (Number)";
    });
    //16
    let businessDataEmployees = rows.filter((v) => {
      return v.Business === "Business economy excluding activities of holding companies (B to N,-642)" && v.Statistic === "Employees (Number)";
    });

    var donegalBusinessTraces = [
      //Active
      {
        x: miningDataActive.map((v) => {
          return v.Year;
        }),
        y: miningDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Mining',
        stackgroup: 'one'
      },
      {
        x: manuDataActive.map((v) => {
          return v.Year;
        }),
        y: manuDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Manufacturing',
        stackgroup: 'one'
      },
      {
        x: electricityDataActive.map((v) => {
          return v.Year;
        }),
        y: electricityDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Electricity',
        stackgroup: 'one'
      },
      {
        x: waterDataActive.map((v) => {
          return v.Year;
        }),
        y: waterDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Water',
        stackgroup: 'one'
      },
      {
        x: constructionDataActive.map((v) => {
          return v.Year;
        }),
        y: constructionDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Construction',
        stackgroup: 'one'
      },
      {
        x: motorDataActive.map((v) => {
          return v.Year;
        }),
        y: motorDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Motor',
        stackgroup: 'one'
      },
      {
        x: transportationDataActive.map((v) => {
          return v.Year;
        }),
        y: transportationDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Transportation',
        stackgroup: 'one'
      },
      {
        x: accomodationDataActive.map((v) => {
          return v.Year;
        }),
        y: accomodationDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Accomodation',
        stackgroup: 'one'
      },
      {
        x: infoDataActive.map((v) => {
          return v.Year;
        }),
        y: infoDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Information',
        stackgroup: 'one'
      },
      {
        x: financialDataActive.map((v) => {
          return v.Year;
        }),
        y: financialDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Financial',
        stackgroup: 'one'
      },
      {
        x: realEstateDataActive.map((v) => {
          return v.Year;
        }),
        y: realEstateDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Real Estate',
        stackgroup: 'one'
      }, {
        x: technicalDataActive.map((v) => {
          return v.Year;
        }),
        y: technicalDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Technical',
        stackgroup: 'one'
      },
      {
        x: adminDataActive.map((v) => {
          return v.Year;
        }),
        y: adminDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Administration',
        stackgroup: 'one'
      },
      {
        x: eduDataActive.map((v) => {
          return v.Year;
        }),
        y: eduDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Education',
        stackgroup: 'one'
      },
      {
        x: ictDataActive.map((v) => {
          return v.Year;
        }),
        y: ictDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'ICT',
        stackgroup: 'one'
      },
      {
        x: businessDataActive.map((v) => {
          return v.Year;
        }),
        y: businessDataActive.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Business',
        stackgroup: 'one'
      },
      //Persons
      {
        x: miningDataPersons.map((v) => {
          return v.Year;
        }),
        y: miningDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Mining',
        stackgroup: 'one'
      },
      {
        x: manuDataPersons.map((v) => {
          return v.Year;
        }),
        y: manuDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Manufacturing',
        stackgroup: 'one'
      },
      {
        x: electricityDataPersons.map((v) => {
          return v.Year;
        }),
        y: electricityDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Electricity',
        stackgroup: 'one'
      },
      {
        x: waterDataPersons.map((v) => {
          return v.Year;
        }),
        y: waterDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Water',
        stackgroup: 'one'
      },
      {
        x: constructionDataPersons.map((v) => {
          return v.Year;
        }),
        y: constructionDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Construction',
        stackgroup: 'one'
      },
      {
        x: motorDataPersons.map((v) => {
          return v.Year;
        }),
        y: motorDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Motor',
        stackgroup: 'one'
      },
      {
        x: transportationDataPersons.map((v) => {
          return v.Year;
        }),
        y: transportationDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Transportation',
        stackgroup: 'one'
      },
      {
        x: accomodationDataPersons.map((v) => {
          return v.Year;
        }),
        y: accomodationDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Accomodation',
        stackgroup: 'one'
      },
      {
        x: infoDataPersons.map((v) => {
          return v.Year;
        }),
        y: infoDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Information',
        stackgroup: 'one'
      },
      {
        x: financialDataPersons.map((v) => {
          return v.Year;
        }),
        y: financialDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Financial',
        stackgroup: 'one'
      },
      {
        x: realEstateDataPersons.map((v) => {
          return v.Year;
        }),
        y: realEstateDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Real Estate',
        stackgroup: 'one'
      }, {
        x: technicalDataPersons.map((v) => {
          return v.Year;
        }),
        y: technicalDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Technical',
        stackgroup: 'one'
      },
      {
        x: adminDataPersons.map((v) => {
          return v.Year;
        }),
        y: adminDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Administration',
        stackgroup: 'one'
      },
      {
        x: eduDataPersons.map((v) => {
          return v.Year;
        }),
        y: eduDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Education',
        stackgroup: 'one'
      },
      {
        x: ictDataPersons.map((v) => {
          return v.Year;
        }),
        y: ictDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'ICT',
        stackgroup: 'one'
      },
      {
        x: businessDataPersons.map((v) => {
          return v.Year;
        }),
        y: businessDataPersons.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Business',
        stackgroup: 'one'
      },

      //Employees
      {
        x: miningDataEmployees.map((v) => {
          return v.Year;
        }),
        y: miningDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Mining',
        stackgroup: 'one'
      },
      {
        x: manuDataEmployees.map((v) => {
          return v.Year;
        }),
        y: manuDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Manufacturing',
        stackgroup: 'one'
      },
      {
        x: electricityDataEmployees.map((v) => {
          return v.Year;
        }),
        y: electricityDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Electricity',
        stackgroup: 'one'
      },
      {
        x: waterDataEmployees.map((v) => {
          return v.Year;
        }),
        y: waterDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Water',
        stackgroup: 'one'
      },
      {
        x: constructionDataEmployees.map((v) => {
          return v.Year;
        }),
        y: constructionDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Construction',
        stackgroup: 'one'
      },
      {
        x: motorDataEmployees.map((v) => {
          return v.Year;
        }),
        y: motorDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Motor',
        stackgroup: 'one'
      },
      {
        x: transportationDataEmployees.map((v) => {
          return v.Year;
        }),
        y: transportationDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Transportation',
        stackgroup: 'one'
      },
      {
        x: accomodationDataEmployees.map((v) => {
          return v.Year;
        }),
        y: accomodationDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Accomodation',
        stackgroup: 'one'
      },
      {
        x: infoDataEmployees.map((v) => {
          return v.Year;
        }),
        y: infoDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Information',
        stackgroup: 'one'
      },
      {
        x: financialDataEmployees.map((v) => {
          return v.Year;
        }),
        y: financialDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Financial',
        stackgroup: 'one'
      },
      {
        x: realEstateDataEmployees.map((v) => {
          return v.Year;
        }),
        y: realEstateDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Real Estate',
        stackgroup: 'one'
      }, {
        x: technicalDataEmployees.map((v) => {
          return v.Year;
        }),
        y: technicalDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Technical',
        stackgroup: 'one'
      },
      {
        x: adminDataEmployees.map((v) => {
          return v.Year;
        }),
        y: adminDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Administration',
        stackgroup: 'one'
      },
      {
        x: eduDataEmployees.map((v) => {
          return v.Year;
        }),
        y: eduDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Education',
        stackgroup: 'one'
      },
      {
        x: ictDataEmployees.map((v) => {
          return v.Year;
        }),
        y: ictDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'ICT',
        stackgroup: 'one'
      },
      {
        x: businessDataEmployees.map((v) => {
          return v.Year;
        }),
        y: businessDataEmployees.map((v) => {
          return v.Count;
        }),
        mode: 'lines+markers',
        name: 'Business',
        stackgroup: 'one'
      }
    ];
    //Set default visible traces
    donegalBusinessTraces.map((t, i) => {
      if (i < 16) return t.visible = true;
      else return t.visible = false;
    });

    let updateMenus = [{
        buttons: [{
            args: [{
                //Each variable has 16 traces
                'visible': [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
                  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
                  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false
                ]
              },
              {
                'title': 'Donegal Business by Sector - Active Enterprise',
                // 'annotations': high_annotations
              }
            ],
            label: 'Active Enterprise',
            method: 'update'
          },
          {
            args: [{
                'visible': [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
                  true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
                  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false
                ]
              },
              {
                'title': 'Donegal Business by Sector - Persons Engaged',
                // 'annotations': high_annotations
              }
            ],
            label: 'Persons Engaged',
            method: 'update'
          },
          {
            args: [{
                'visible': [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
                  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
                  true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
                ]
              },
              {
                'title': 'Donegal Business by Sector- Employees',
                // 'annotations': high_annotations
              }
            ],
            label: 'Employees',
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
      }

    ];

    let donegalBusinessLayout = Object.assign({}, areaChartLayout);
    // donegalBusinessLayout.title.text = 'Donegal Business - Active Enterprise';

    donegalBusinessLayout.title = {
      text: 'Donegal Business by Sector - Active Enterprise',
      xref: 'paper',
      x: 0.5
    };
    donegalBusinessLayout.legend = {
      font: {
        family: 'PT Sans',
        size: 14,
        color: '#313131'
      }
    };

    donegalBusinessLayout.hovermode = 'closest';
    donegalBusinessLayout.updatemenus = updateMenus;

    Plotly.newPlot('donegal-business-chart', donegalBusinessTraces, donegalBusinessLayout, {
      modeBarButtons: areaChartModeBarButtonsInclude,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true
    });


    // function getFirstWord(s) {
    //   let f = s.substr(0, s.indexOf(" "));
    //   if (f.endsWith(",")) {
    //     f = f.substr(0, f.indexOf(","));
    //   }
    //   // console.log("\nf; " + f);
    //   return f;
    // }
  })
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });