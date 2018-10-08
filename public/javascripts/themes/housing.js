let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    formatYear = d3.timeFormat("%Y"),
    formatMonthYear = d3.timeFormat("%b-%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

Promise.all([
    d3.csv("../data/Housing/constructionsmonthlies.csv"),
    d3.csv("../data/Housing/planningapplications.csv"),
    d3.csv("../data/Housing/supplyoflands.csv"),
    d3.csv("../data/Housing/developercontributions.csv"),
    d3.csv("../data/Housing/houseprices.csv"),
    d3.csv("../data/Housing/RIQ02.csv"),
    d3.csv("../data/Housing/rentpricebybeds.csv"),
    d3.csv("../data/Housing/rentalinspections.csv"),
    d3.csv("../data/Housing/houseunitcompbytype.csv"),
    d3.csv("../data/Housing/NDQ08.csv"),
    d3.csv("../data/Housing/NDQ06.csv"),
]).then(datafiles => {

    //1.  data processing for house completion chart
    const completionData = datafiles[0],
          keys = completionData.columns.slice(1),
          dateField = completionData.columns[0],
          compDataProcessed = dataSets(completionData, keys);

          compDataProcessed.forEach(function(d) {
            d.label = d[dateField];
            d[dateField] = parseMonth(d[dateField]);
          });

          const dateFilter = compDataProcessed.filter( d => {
            return d[dateField] >= new Date("Mar 01 2017");
        });

    // let regionNames = completionData.columns.slice(1);
    // let houseCompData = completionData.columns.slice(1).map(function(region) {
    //     return {
    //       key: region,
    //       values: completionData.map(function(d) {
    //         return {label: d.date, date: parseMonth(d.date),  value: +d[region]};
    //       }),
    //       disabled: false
    //     };
    //   });

    const houseCompCharts = new StackedAreaChart("#chart-houseComp", "Months", "Thousands", dateField, keys);
        // (data, title of X axis, title of Y Axis, y Scale format, name of type, name of value field )  
        houseCompCharts.getData(dateFilter);
        houseCompCharts.addTooltip("Units - Months:", "000");

    // // setup the chart for house completion
    // // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    // const houseCompChart = new MultiLineChart("#chart-houseComp", "Months", "Units", [], regionNames);
    // // 1. Value Key, 2. Data set
    // houseCompChart.getData("value", houseCompData);
    // // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    // houseCompChart.addTooltip("Units - ","thousands", "label");

    //2.  data processing for planning charts.
    const planningData = datafiles[1],
          types = planningData.columns.slice(2),
          date = planningData.columns[0],
          planningDataProcessed = dataSets(planningData, types);

          planningDataProcessed.forEach(function(d) {
            d.label = d.date;
            d.date = parseYear(d.date);
          });

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
    
    supplyDataProcessed.forEach( d => {d[supplyDate] = parseYear(d[supplyDate]);
            d.label = formatYear(d[supplyDate]);
        });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const supplyDataNested =  d3.nest().key( d => { return d[supplyRegions];})
            .entries(supplyDataProcessed);
    // get array of keys from nest
        const supplyRegionNames = [];
        supplyDataNested.forEach(d => {
                supplyRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const supplyChart = new MultiLineChart("#chart-houseSupply", "years", "Hectares", yLabels2, supplyRegionNames);
    // 1. Value Key, 2. Data set
    supplyChart.getData("Hectares", supplyDataNested, "Years", "Hectares");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    supplyChart.addTooltip("Land - Year", "thousands", "label");

    d3.select("#supply_land").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        supplyChart.getData("Hectares", supplyDataNested, "Years", "Hectares");
        supplyChart.addTooltip("Land - Year", "thousands", "label");
    });
    
    d3.select("#supply_units").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        supplyChart.getData("Units", supplyDataNested, "Years", "Units");
        supplyChart.addTooltip("Units - Year", "thousands", "label");
    });

    // setup chart and data for annual contribution chart
    // process the data
    const contributionData = datafiles[3],
          contributionType = contributionData.columns.slice(2),
          contributionDate = contributionData.columns[0],
          contributionRegions = contributionData.columns[1],
          contributionDataProcessed = dataSets(contributionData, contributionType),
          yLabels3 = [];
    
    contributionDataProcessed.forEach( d => {
        d.label = d[contributionDate];
        d[contributionDate] = parseYear(d[contributionDate]);
    });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const contributionDataNested =  d3.nest().key( d => { return d[contributionRegions];})
            .entries(contributionDataProcessed);
    // get array of keys from nest
        const contributionRegionNames = [];
        contributionDataNested.forEach(d => {
                contributionRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const contributionChart = new MultiLineChart("#chart-houseContributions", "years", "€", yLabels2, contributionRegionNames);
    // 1. Value Key, 2. Data set
    contributionChart.getData("value", contributionDataNested, "Years", "€", "millions");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    contributionChart.addTooltip("In Millions - Year ", "millions", "label", "€");

    // setup chart and data for quarterly house prices chart
    // process the data
    const housePricesData = datafiles[4],
          housePricesType = housePricesData.columns.slice(2),
          housePricesDate = housePricesData.columns[0],
          housePricesRegions = housePricesData.columns[1],
          housePricesDataProcessed = dataSets(housePricesData, housePricesType),
          yLabels4 = [];
    
    housePricesDataProcessed.forEach( d => {
        d.label = qToQuarter(d[housePricesDate]);
        d[housePricesDate] = convertQuarter(d[housePricesDate]);
    });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const housePricesDataNested =  d3.nest().key( d => { return d[housePricesRegions];})
            .entries(housePricesDataProcessed);
    // get array of keys from nest
        const housePricesRegionNames = [];
        housePricesDataNested.forEach(d => {
                housePricesRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const housePricesChart = new MultiLineChart("#chart-housePrices", "Quarters", "€", yLabels4, housePricesRegionNames);
    // 1. Value Key, 2. Data set
    housePricesChart.getData("value", housePricesDataNested, "Quarters", "€", "thousands");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    housePricesChart.addTooltip("In thousands - ", "thousands", "label", "€");


        // setup chart and data for quarterly house prices chart
    // process the data
    const rentPricesData = datafiles[5],
          rentPricesType = rentPricesData.columns.slice(2),
          rentPricesDate = rentPricesData.columns[0],
          rentPricesRegions = rentPricesData.columns[1],
          rentPricesDataProcessed = dataSets(rentPricesData, rentPricesType);
    
    rentPricesDataProcessed.forEach( d => {
        d.label = d[rentPricesDate];
        d[rentPricesDate] = convertQuarter(d[rentPricesDate]);
    });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const rentPricesDataNested =  d3.nest().key( d => { return d[rentPricesRegions];})
            .entries(rentPricesDataProcessed);
    // get array of keys from nest
        const rentPricesRegionNames = [];
        rentPricesDataNested.forEach(d => {
                rentPricesRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const rentPricesChart = new MultiLineChart("#chart-rentPrices", "Quarters", "€", yLabels4, rentPricesRegionNames);
    // 1. Value Key, 2. Data set
    rentPricesChart.getData("value", rentPricesDataNested, "Quarters", "€", "thousands");
    // // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    rentPricesChart.addTooltip("In thousands - ", "thousands", "label", "€");
    

    //  Setup data and chart for rent prices by quarter by bed numbers
    const rentByBedsData = datafiles[6],
          rentByBedsTypes = rentByBedsData.columns.slice(2),
          rentByBedsDate = rentByBedsData.columns[0],
          rentByBedsDataProcessed = dataSets(rentByBedsData, rentByBedsTypes);

    // console.log("rentByBeds data processed", rentByBedsDataProcessed);
    // drawing charts for planning data.
    const rentByBedsChart = new GroupedBarChart(rentByBedsDataProcessed, rentByBedsTypes, rentByBedsDate, "#chart-rentByBeds", "Quarters", "Price");


    //  Setup data and chart for rent prices by quarter by bed numbers
    const rentInspectData = datafiles[7],
    rentInspectTypes = rentInspectData.columns.slice(1),
    rentInspectDate = rentInspectData.columns[0],
    rentInspectDataProcessed = dataSets(rentInspectData, rentInspectTypes);

    // console.log("rentInspect data processed", rentInspectDataProcessed);
    // drawing charts for planning data.
    const rentInspectChart = new GroupedBarChart(rentInspectDataProcessed, rentInspectTypes, rentInspectDate, "#chart-rentInspect", "Quarters", "Number");

    // setup chart and data for supply of land chart
    // process the data
    const houseCompByTypeData = datafiles[8],
          houseCompByTypeType = houseCompByTypeData.columns.slice(2),
          houseCompByTypeDate = houseCompByTypeData.columns[0],
          houseCompByTypeRegions = houseCompByTypeData.columns[1],
          houseCompByTypeDataProcessed = dataSets(houseCompByTypeData, houseCompByTypeType);
    
    houseCompByTypeDataProcessed.forEach( d => {
        d.label = qToQuarter(d[houseCompByTypeDate]);
        d[houseCompByTypeDate] = convertQuarter(d[houseCompByTypeDate]);
    });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const houseCompByTypeDataNested =  d3.nest().key( d => { return d[houseCompByTypeRegions];})
            .entries(houseCompByTypeDataProcessed);
    // get array of keys from nest
        const houseCompByTypeRegionNames = [];
        houseCompByTypeDataNested.forEach(d => {
                houseCompByTypeRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const houseCompByTypeChart = new MultiLineChart("#chart-houseCompByType", "Quarters", "Numbers", yLabels2, houseCompByTypeRegionNames);
    // 1. Value Key, 2. Data set
    houseCompByTypeChart.getData(houseCompByTypeType[0], houseCompByTypeDataNested, "Quarters", "Numbers");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    houseCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");

    d3.select("#houseCompByType_total").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        houseCompByTypeChart.getData(houseCompByTypeType[0], houseCompByTypeDataNested, "Years", "Units");
        houseCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");
    });
    
    d3.select("#houseCompByType_private").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        houseCompByTypeChart.getData(houseCompByTypeType[1], houseCompByTypeDataNested, "Years", "Units");
        houseCompByTypeChart.addTooltip("Private Houses - ", "thousands", "label");
    });

    d3.select("#houseCompByType_social").on("click", function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        houseCompByTypeChart.getData(houseCompByTypeType[2], houseCompByTypeDataNested, "Years", "Units");
        houseCompByTypeChart.addTooltip("Social Houses - ", "thousands", "label");
    });

    // setup chart and data for esb non new connections of land chart
    // process the data
    const nonNewConnectionsData = datafiles[9],
          nonNewConnectionsType = nonNewConnectionsData.columns.slice(2),
          nonNewConnectionsDate = nonNewConnectionsData.columns[0],
          nonNewConnectionsRegions = nonNewConnectionsData.columns[1],
          nonNewConnectionsDataProcessed = dataSets(nonNewConnectionsData, nonNewConnectionsType),
          nonNewGroup = ["Non-Domestic", "Reconnection", "Unfinished"]
    
    nonNewConnectionsDataProcessed.forEach( d => {
        d.label = qToQuarter(d[nonNewConnectionsDate]);
        d[nonNewConnectionsDate] = convertQuarter(d[nonNewConnectionsDate]);
    });

    let nonNewCon = nestData(nonNewConnectionsDataProcessed, "label", nonNewConnectionsRegions, "value")

    const nonNewConFiltered = nonNewCon.filter( d => {
        return d[dateField] >= new Date("Jun 01 2015");
    });

    const nonNewConnectionsChart = new StackedAreaChart("#chart-nonNewConnections", "Quarters", "Numbers", nonNewConnectionsDate, nonNewGroup);
    // (data, title of X axis, title of Y Axis, y Scale format, name of type, name of value field )  
    nonNewConnectionsChart.getData(nonNewConFiltered);
    nonNewConnectionsChart.addTooltip("House Type -", "Units");

    // // draw the chart
    // // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    // const nonNewConnectionsChart = new MultiLineChart("#chart-nonNewConnections", "Quarters", "Numbers", yLabels2, nonNewConnectionsRegionNames);
    // // 1. Value Key, 2. Data set
    // nonNewConnectionsChart.getData(nonNewConnectionsType[0], nonNewConnectionsDataNested, "Quarters", "Numbers");
    // // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    // nonNewConnectionsChart.addTooltip("House Type - ", "thousands", "label");


    // setup chart and data for New Dwelling Completion by type chart
    // process the data
    const newCompByTypeData = datafiles[10],
          newCompByTypeType = newCompByTypeData.columns.slice(2),
          newCompByTypeDate = newCompByTypeData.columns[0],
          newCompByTypeRegions = newCompByTypeData.columns[1],
          newCompByTypeDataProcessed = dataSets(newCompByTypeData, newCompByTypeType);
    
    newCompByTypeDataProcessed.forEach( d => {
        d.label = qToQuarter(d[newCompByTypeDate]);
        d[newCompByTypeDate] = convertQuarter(d[newCompByTypeDate]);
    });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const newCompByTypeDataNested =  d3.nest().key( d => { return d[newCompByTypeRegions];})
            .entries(newCompByTypeDataProcessed);
    // get array of keys from nest
        const newCompByTypeRegionNames = [];
        newCompByTypeDataNested.forEach(d => {
                newCompByTypeRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const newCompByTypeChart = new MultiLineChart("#chart-newCompByType", "Quarters", "Numbers", yLabels2, newCompByTypeRegionNames);
    // 1. Value Key, 2. Data set
    newCompByTypeChart.getData(newCompByTypeType[0], newCompByTypeDataNested, "Quarters", "Numbers");
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    newCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");

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

function nestData(data, label, name, value){
        let nested_data = d3.nest()
            .key(function(d) { return d[label]; })
            .entries(data); // its the string not the date obj

        let mqpdata = nested_data.map(function(d){
            let obj = {
                label: d.key
            }
                d.values.forEach(function(v){
                obj[v[name]] = v[value];
                obj.date = v.date;
            })
        return obj;
      })
    return mqpdata;
}