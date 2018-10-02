let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

Promise.all([
    d3.csv("../data/Housing/constructionsmonthlies.csv"),
    d3.csv("../data/Housing/planningapplications.csv"),
    d3.csv("../data/Housing/supplyoflands.csv"),
    d3.csv("../data/Housing/developercontributions.csv"),
]).then(datafiles => {

    //1.  data processing for house completion chart
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

      console.log("house completion data set after processing", houseCompData);

    // setup the chart for house completion
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const houseCompChart = new MultiLineChart("#chart-houseComp", "Months", "Units", yLabels, regionNames);
    // 1. Value Key, 2. Data set
    houseCompChart.getData("value", houseCompData);
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    houseCompChart.addTooltip("Units - ","thousands", "");

    //2.  data processing for planning charts.
    const planningData = datafiles[1],
          types = planningData.columns.slice(2),
          date = planningData.columns[0],
          planningDataProcessed = dataSets(planningData, types);

    // console.log("planning data processed", planningDataProcessed);

    const dcc = planningDataProcessed.filter( d => {
        return d.region === "Dublin";
    });
    const drcc = planningDataProcessed.filter( d => {
        return d.region === "Dun Laoghaire Rathdown";
    });
    const fcc = planningDataProcessed.filter( d => {
        return d.region === "Fingal";
    });
    const sdcc = planningDataProcessed.filter( d => {
        return d.region === "South Dublin";
    });

    // drawing charts for planning data.
    const dccChart = new GroupedBarChart(dcc, types, date, "#chart-planningDCC", "Years", "Number");
    const drccChart = new GroupedBarChart(drcc, types, date, "#chart-planningDRCC", "Years", "Number");
    const fccChart = new GroupedBarChart(fcc, types, date, "#chart-planningFCC", "Years", "Number");
    const sdccChart = new GroupedBarChart(sdcc, types, date, "#chart-planningSDCC", "Years", "Number");

    // setup chart and data for supply of land chart
    // process the data
    
    const supplyData = datafiles[2],
          supplyType = supplyData.columns.slice(2),
          supplyDate = supplyData.columns[0],
          supplyRegions = supplyData.columns[1],
          supplyDataProcessed = dataSets(supplyData, supplyType),
          yLabels2 = [];
    
    supplyDataProcessed.forEach( d => d[supplyDate] = parseYear(d[supplyDate]));

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const supplyDataNested =  d3.nest().key( d => { return d[supplyRegions];})
            .entries(supplyDataProcessed);
    // get array of keys from nest
        const supplyRegionNames = [];
        supplyDataNested.forEach(d => {
                supplyRegionNames.push(d.key);
        });

    console.log("processed supply data", supplyDataNested);
    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const supplyChart = new MultiLineChart("#chart-houseSupply", "years", "Hectares", yLabels2, supplyRegionNames);
    // 1. Value Key, 2. Data set
    supplyChart.getData("Hectares", supplyDataNested, "Years", "Hectares");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    supplyChart.addTooltip("Land - ", "thousands", "");

    d3.select("#supply_land").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        supplyChart.getData("Hectares", supplyDataNested, "Years", "Hectares");
        supplyChart.addTooltip("Land - ", "thousands", "");
    });
    
    d3.select("#supply_units").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        supplyChart.getData("Units", supplyDataNested, "Years", "Units");
        supplyChart.addTooltip("Units - ", "thousands", "");
    });

    // setup chart and data for annual contribution chart
    // process the data
    const contributionData = datafiles[3],
          contributionType = contributionData.columns.slice(2),
          contributionDate = contributionData.columns[0],
          contributionRegions = contributionData.columns[1],
          contributionDataProcessed = dataSets(contributionData, contributionType),
          yLabels3 = [];
    
    contributionDataProcessed.forEach( d => d[contributionDate] = parseYear(d[contributionDate]));

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const contributionDataNested =  d3.nest().key( d => { return d[contributionRegions];})
            .entries(contributionDataProcessed);
    // get array of keys from nest
        const contributionRegionNames = [];
        contributionDataNested.forEach(d => {
                contributionRegionNames.push(d.key);
        });

    console.log("processed contribution data", contributionDataNested);
    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const contributionChart = new MultiLineChart("#chart-houseContributions", "years", "€", yLabels2, contributionRegionNames);
    // 1. Value Key, 2. Data set
    contributionChart.getData("value", contributionDataNested, "Years", "€");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    contributionChart.addTooltip("In Millions - ", "millions", "", "€");

   

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