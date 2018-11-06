
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
    const dataSet4 = dataSets(dataFile4, columnNames4);

    const hEduChart = new GroupedBarChart(dataSet1, columnNames1, xValue1, "#chart-educationLevel", "Levels of Education", "Population");
    const pFLevelChart = new GroupedBarChart(dataSet2, columnNames2, xValue2, "#chart-pupilsFirstLevel", "Years", "No. of Pupils");
    const pSLevelChart = new GroupedBarChart(dataSet3, columnNames3, xValue3, "#chart-pupilsSecondLevel", "Years", "No of Pupils");
    const sSLevelChart = new GroupedBarChart(dataSet4, columnNames4, xValue3, "#chart-specialSchoolsLevel", "Years", "No of Schools");
   
    hEduChart.addTooltip("","","");
    pFLevelChart.addTooltip("","","");
    pSLevelChart.addTooltip("","","");
    sSLevelChart.addTooltip("","","");


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