let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    formatYear = d3.timeFormat("%Y"),
    formatMonthYear = d3.timeFormat("%b-%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

const getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p);

Promise.all([
    d3.csv("../data/Health/trolleys_transposed.csv"),
    d3.csv("../data/Health/healthlevels2011.csv"),
    d3.csv("../data/Health/healthlevelscount2011.csv")
]).then(datafiles => {
    // t is for trolleys
    const tData = datafiles[0],
          tKeys = tData.columns.slice(3),
          tdateField = tData.columns[2],
          tDataProcessed = dataSets(tData, tKeys);

          tDataProcessed.forEach( d => {
            d.label = "W" + d.week;  
            d.date = parseTime(d[tdateField]);

          });  

          const trolleys2016 = filterByDateRange(tDataProcessed, "date", "Dec 29 2015", "Dec 31 2016");
          const weeksGroup1 = trolleys2016.slice(0,32);

          const tCharts = new StackedAreaChart("#chart-trolleys", "Weeks", "No. of Patients", "date", tKeys);
          // (data, title of X axis, title of Y Axis, y Scale format, name of type, name of value field )  
          tCharts.getData(weeksGroup1);
          tCharts.addTooltip("No. of Patients:", "000");
  
  
    

    // const trolleys2016 = filterByDateRange(trolleysData, "date", "Dec 29 2015", "Dec 31 2016");
    // const trolleys2015 = filterByDateRange(trolleysData, "date", "Dec 29 2014", "Dec 31 2015");
    // const trolleys2014 = filterByDateRange(trolleysData, "date", "Dec 29 2013", "Dec 31 2014");
    // const trolleys2013 = filterByDateRange(trolleysData, "date", "Dec 29 2012", "Dec 31 2013");

    // const weeksGroup1 = trolleys2016.slice(0,13);
    // const weeksGroup2 = trolleys2016.slice(13,26);
    // const weeksGroup3 = trolleys2016.slice(26,39);
    // const weeksGroup4 = trolleys2016.slice(39,52);
    // console.log("Weeks " + weeksGroup1[0].week + " - " + weeksGroup1[12].week, weeksGroup1);
    // console.log("Weeks " + weeksGroup2[0].week + " - " + weeksGroup2[12].week, weeksGroup2);

    // const types = d3.nest()
    // .key( d => {
    //     return d[groupBy];
    // }).entries(valueData);

    // // TODO: replace with d3 nest function do processing before like with date
    // const tData = trolleysType.map(function(hosiptal) {
    //         return {
    //           key: hosiptal,
    //           values: trolleys2016.map(function(d) {
    //             let value = d[hosiptal] !== "NULL" ? +d[hosiptal] : 0; 
    //             return {year: d.year, label: "W" + d.week, date: d.date,  value: value};
    //           }),
    //           disabled: false
    //         };
    //       });
    // console.log(tData);

    //     // draw the chart
    // // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    // const trolleysChart = new MultiLineChart("#chart-trolleys",[], trolleysType);
    // // 1. Value Key, 2. Data set
    // trolleysChart.getData("value", tData, "Quarters", "Numbers");
    // // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    // trolleysChart.addTooltip("Patients Waiting - ", "thousands", "label");

    // d3.select("#trolleys_total").on("click", function(){
    //     $(this).siblings().removeClass('active');
    //     $(this).addClass('active');
    //     trolleysChart.getData(trolleysType[0], trolleysDataNested, "Years", "Hectares");
    //     trolleysChart.addTooltip("Total Houses - ", "thousands", "label");
    // });
    
    // d3.select("#trolleys_private").on("click", function(){
    //     $(this).siblings().removeClass('active');
    //     $(this).addClass('active');
    //     trolleysChart.getData(trolleysType[1], trolleysDataNested, "Years", "Units");
    //     trolleysChart.addTooltip("Private Houses - ", "thousands", "label");
    // });

    // d3.select("#trolleys_social").on("click", function(){
    //     $(this).siblings().removeClass('active');
    //     $(this).addClass('active');
    //     trolleysChart.getData(trolleysType[2], trolleysDataNested, "Years", "Units");
    //     trolleysChart.addTooltip("Social Houses - ", "thousands", "label");
    // });

    // health levels data and chart
    // data and chart for hl = health levels
    const hlData = datafiles[2],
          hlRateData = datafiles[1],
          hlTypes = hlData.columns.slice(1),
          hlDate = hlData.columns[0],
          hlDataProcessed = dataSets(hlData, hlTypes),
          hlDataRateProcessed = dataSets(hlRateData, hlTypes);

    // console.log("hl data processed", hlDataProcessed);
    // drawing charts for planning data.
    const hlChart = new GroupedBarChart(hlDataProcessed, hlTypes, hlDate, "#chart-healthlevels", "Health Level", "Population");

    // d3.select("#hlevels_count").on("click", function(){
    //     $(this).siblings().removeClass('active');
    //     $(this).addClass('active');
    //     trolleysChart.getData(trolleysType[0], trolleysDataNested, "Years", "Hectares");
  
    // });

    // d3.select("#hlevels_rate").on("click", function(){
    //     $(this).siblings().removeClass('active');
    //     $(this).addClass('active');
    //     trolleysChart.getData(trolleysType[0], trolleysDataNested, "Years", "Hectares");
   
    // });


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

function dataSets(data, columns){
    
    coercedData = data.map( d => {
        for( var i = 0, n = columns.length; i < n; i++ ){
            d[columns[i]] !== "NULL" ? d[columns[i]]= +d[columns[i]] : d[columns[i]] = 0;
            // d[hosiptal] !== "NULL" ? +d[hosiptal] : 0;
        }
        return d;
        });

    return coercedData;
}

function formatQuarter(date){
    
    let newDate = new Date();
        newDate.setMonth(date.getMonth() + 1);
    
    let year = (date.getFullYear());
    let q = Math.ceil(( newDate.getMonth()) / 3 );
    
    return "Quarter "+ q + ' ' + year;
}

function filterByDateRange(data, dateField, dateOne, dateTwo){
    return data.filter( d => {
        return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo);
    });
}