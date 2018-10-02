let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

Promise.all([
    d3.csv("../data/Housing/constructionsmonthlies.csv"),
]).then(datafiles => {

    const completionData = datafiles[0],
          yLabels = [];

    let regionNames = completionData.columns.slice(1);
    let houseCompData = completionData.columns.slice(1).map(function(region) {
        return {
          key: region,
          values: completionData.map(function(d) {
            return {date: parseMonth(d.date),  value: +d[region]};
          }),
          disabled: false
        };
      });

      console.log("this is the data for the house comp:", houseCompData);
      console.log("this is the region names", regionNames);

    const houseCompChart = new MultiLineChart("#chart-houseComp", "Months", "Units", yLabels, regionNames);

    houseCompChart.getData("value", houseCompData);
    houseCompChart.addTooltip("Units - ", "units", "");

}).catch(function(error){
        console.log(error);
});



function convertQuarter(q){
    let splitted = q.split('Q');
    let year = splitted[0];
    let quarterEndMonth = splitted[1] * 3 - 2;
    let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year);
    return date;
}

function qToQuarter(q){
    let splitted = q.split('Q');
    let year = splitted[0];
    let quarter = splitted[1];
    let quarterString = ("Quarter "+ quarter + ' ' + year);
    return quarterString;
}