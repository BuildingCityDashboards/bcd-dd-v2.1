//Options for chart
//TODO: pass these in as config and/or create accessor functions
const srcPathFig7 = "../data/Stories/Housing/",
  srcFileFig7 = "House_Com.csv";
const regionsFig7 = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin", "Kildare", "Meath", "Wicklow"];
let titleFig7 = "Social Housing Units Built or Acquired through Purchase/Long-term Lease, and Sold";
const divIDFig7 = "social-housing-units-build-chart";


d3.csv(srcPathFig7 + srcFileFig7)
  .then((data) => {
    //Data per region- use the array of region variable values
    let dataByRegion = [];
    regionsFig7.forEach((regionName) => {
      dataByRegion.push(data.filter((v) => {
        return v.region === regionName;
      }));
    });

    //Traces
    let socialHousingBuildTraces = [];
    dataByRegion.forEach((regionData, i) => {
      let trace = Object.assign({}, TRACES_DEFAULT);
      (i < 4) ? trace.name = regionData[0].region: trace.name = '';
      // trace.name = regionData[0].region;
      //reassign colour to -defocus some traces
      (i < 4) ? trace.opacity = 1.0: trace.opacity = 0.5; //magic number!!!
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker);
      (i < 4) ? trace.marker.color = null: trace.marker.color = 'grey'; //magic number!!!

      trace.x = regionData.map((v) => {
        return v.date;
      });

      trace.y = regionData.map((v) => {
        return v.value;
      });

      socialHousingBuildTraces.push(trace);
    });


    //Set layout options
    let chartLayout = Object.assign({}, MULTILINE_CHART_LAYOUT);
    chartLayout.title.text = titleFig7;
    chartLayout.height = 500;
    chartLayout.showlegend = false;
    chartLayout.xaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.xaxis);
    chartLayout.xaxis.range = [1994, 2016];
    chartLayout.yaxis = Object.assign({}, MULTILINE_CHART_LAYOUT.yaxis);
    chartLayout.yaxis.title = '';
    chartLayout.margin = Object.assign({}, MULTILINE_CHART_LAYOUT.margin);
    chartLayout.margin = {
      l: 0,
      r: 200, //Dun Laoghaire!!!
      t: 100 //button row
    };

    // chartLayout.hidesources = false;

    //Set annotations per chart with config per trace

    let socialHousingBuildAnnotations = [];
    socialHousingBuildTraces.forEach((trace, i) => {
      // console.log("trace: " + JSON.stringify(trace));
      let annotation = Object.assign({}, ANNOTATIONS_DEFAULT);
      annotation.x = trace.x[trace.x.length - 1];
      annotation.y = trace.y[trace.y.length - 1];
      annotation.text = trace.name;
      //de-focus some annotations
      //TODO: function for this
      (i < 4) ? annotation.opacity = 1.0: annotation.opacity = 0.5;
      annotation.font = Object.assign({}, ANNOTATIONS_DEFAULT.font);
      (i < 4) ? annotation.font.color = CHART_COLORWAY[i]: annotation.font.color = 'grey'; //magic number!!!

      // console.log(annotation.font.color);
      socialHousingBuildAnnotations.push(annotation);
    })

    //set individual annotation stylings
    //TODO: be better! Don't use array index for access
    socialHousingBuildAnnotations[0].ay = 5; //move DC
    socialHousingBuildAnnotations[1].ay = -8; //move DLR
    socialHousingBuildAnnotations[2].ay = -10; //move Fingal
    socialHousingBuildAnnotations[3].ay = 0; //move SD
    socialHousingBuildAnnotations[4].ay = 0; //move K
    socialHousingBuildAnnotations[5].ay = 0; //move M
    socialHousingBuildAnnotations[6].ay = 0; //move M

    //Set default view annotations
    chartLayout.annotations = socialHousingBuildAnnotations; //set default

    Plotly.newPlot(divIDFig7, socialHousingBuildTraces, chartLayout, {
      modeBar: {
        orientation: 'v',
        bgcolor: 'black',
        color: null,
        activecolor: null
      },
      modeBarButtons: MULTILINE_CHART_MODE_BAR_BUTTONS_TO_INCLUDE,
      displayModeBar: true,
      displaylogo: false,
      showSendToCloud: false,
      responsive: true,
      toImageButtonOptions: {
        filename: 'Dublin Dashboard - ' + titleFig7,
        width: null,
        height: null,
        format: 'png'
      }
    });
  }) //end of then
  .catch(function(err) {
    console.log("Error loading file:\n " + err)
  });