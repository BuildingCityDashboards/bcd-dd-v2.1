
Promise.all([
    d3.csv("../data/Education/educationlevels.csv"),
    d3.csv("../data/Education/EDA57.csv"),
    d3.csv("../data/Education/EDA69.csv"),
    d3.csv("../data/Education/EDA56.csv"),
]).then(datafiles => {

    const dataFile1 = datafiles[0];
    const dataFile2 = datafiles[1];
    const dataFile3 = datafiles[2];
    const dataFile4 = datafiles[3];

    const columnNames1 = dataFile1.columns.slice(1),
          columnNames2 = dataFile2.columns.slice(1),
          columnNames3 = dataFile3.columns.slice(1),
          columnNames4 = dataFile4.columns.slice(1);

    const xValue1 = dataFile1.columns[0],
          xValue2 = dataFile2.columns[0],
          xValue3 = dataFile3.columns[0],
          xValue4 = dataFile4.columns[0];

    const dataSet1 = dataSets(dataFile1, columnNames1);
    const dataSet2 = dataSets(dataFile2, columnNames2);
    const dataSet3 = dataSets(dataFile3, columnNames3);
    const dataSet4 = dataSets(dataFile4, columnNames4),

    hEduContent = {
        e: "#chart-educationLevel",
        d: dataSet1,
        ks: columnNames1,
        xV: xValue1,
        tX: "Levels of Education",
        tY: "Population",
    },

    hEduTT = {
        title: "",
        datelabel: xValue1,
        format: "thousands",
    },

    pFLevelContent = {
        e: "#chart-pupilsFirstLevel",
        d: dataSet2,
        ks: columnNames2,
        xV: xValue2,
        tX: "Years",
        tY: "No. of Pupils",
    },

    pFLevelTT = {
        title: "",
        datelabel: xValue2,
        format: "thousands",
    },

    pSLevelContent = {
        e: "#chart-pupilsSecondLevel",
        d: dataSet3,
        ks: columnNames3,
        xV: xValue3,
        tX: "Years",
        tY: "No. of Pupils",
    },

    pSLevelTT = {
        title: "Number of Pupils in Year ",
        datelabel: xValue3,
        format: "thousands",
    },

    sSLevelContent = {
        e: "#chart-specialSchoolsLevel",
        d: dataSet4,
        ks: columnNames4,
        xV: xValue4,
        tX: "Years",
        tY: "No of Schools",
    },

    sSLevelTT = {
        title: "Number of Pupils in Year ",
        datelabel: xValue1,
        format: "thousands",
    },


          hEduChart = new GroupedBarChart(hEduContent),
          pFLevelChart = new GroupedBarChart(pFLevelContent);
          pSLevelChart = new GroupedBarChart(pSLevelContent);
          sSLevelChart = new GroupedBarChart(sSLevelContent);
   
          hEduChart.addTooltip(hEduTT);
          pFLevelChart.addTooltip(pFLevelTT);
          pSLevelChart.addTooltip(pSLevelTT);
          sSLevelChart.addTooltip(sSLevelTT);


    // highestEducationChart.selectAll(".tick text").call(texTrap, 100, 50);

        // xValue = data.columns[0];
        // groupBy = data.columns[0];
        // yLabels =["Population (000s)", "Rate %"];

}).catch(function(error){
    console.log(error);
});

function dataSets (data, columns){
    coercedData = data.map( d => {
        for( var i = 0, n = columns.length; i < n; i++ ){
            d[columns[i]] = +d[columns[i]];
        }
    return d;
    });
    return coercedData;
}