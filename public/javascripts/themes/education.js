
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
        element: "#chart-educationLevel",
        data: dataSet1,
        keys: columnNames1,
        value: xValue1,
        titleX: "Levels of Education",
        titleY: "Population",
    },

    hEduTT = {
        title: "Rent Inspections - Year:",
        datelabel: xValue1,
        format: "thousands",
    },

    pFLevelContent = {
        element: "#chart-pupilsFirstLevel",
        data: dataSet2,
        keys: columnNames2,
        value: xValue2,
        titleX: "Years",
        titleY: "No. of Pupils",
    },

    pFLevelTT = {
        title: "Rent Inspections - Year:",
        datelabel: xValue2,
        format: "thousands",
    },

    pSLevelContent = {
        element: "#chart-pupilsSecondLevel",
        data: dataSet3,
        keys: columnNames3,
        value: xValue3,
        titleX: "Years",
        titleY: "No. of Pupils",
    },

    pSLevelTT = {
        title: "Rent Inspections - Year:",
        datelabel: xValue3,
        format: "thousands",
    },

    sSLevelContent = {
        element: "#chart-specialSchoolsLevel",
        data: dataSet4,
        keys: columnNames4,
        value: xValue4,
        titleX: "Years",
        titleY: "No of Schools",
    },

    sSLevelTT = {
        title: "Rent Inspections - Year:",
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