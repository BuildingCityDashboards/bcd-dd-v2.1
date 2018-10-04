let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    formatYear = d3.timeFormat("%Y"),
    formatMonthYear = d3.timeFormat("%b-%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

Promise.all([
    d3.csv("../data/Health/trolleys_transposed.csv"),
    d3.csv("../data/Health/healthlevels2011.csv"),
    d3.csv("../data/Health/healthlevelscount2011.csv"),

]).then(datafiles => {

    const trolleysData = datafiles[0],
          trolleysType = trolleysData.columns.slice(3);

    const tDataNested =  d3.nest().key( d => { return d.year;})
          .entries(trolleysData);

    const trolleys2016 = tDataNested[3].values;

    const tData = trolleysType.map(function(hosiptal) {
            return {
              key: hosiptal,
              values: trolleys2016.map(function(d) {
                let value = d[hosiptal] !== "NULL" ? +d[hosiptal] : 0; 
                return {year: d.year, label: "W" + d.week, date: parseTime(d.date),  value: value};
              }),
              disabled: false
            };
          });
    
    console.log(tData);

        // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const trolleysChart = new MultiLineChart("#chart-trolleys", "Quarters", "Numbers", [], trolleysType);
    // 1. Value Key, 2. Data set
    trolleysChart.getData("value", tData, "Quarters", "Numbers");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    trolleysChart.addTooltip("Patients Waiting - ", "thousands", "label");

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

function dataSets (data, columns){
    
    coercedData = data.map( d => {
        for( var i = 0, n = columns.length; i < n; i++ ){
            d[columns[i]] = +d[columns[i]];
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