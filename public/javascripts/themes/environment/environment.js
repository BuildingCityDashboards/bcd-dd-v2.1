let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    formatYear = d3.timeFormat("%Y"),
    formatMonthYear = d3.timeFormat("%b-%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

Promise.all([
    d3.csv("../data/Environment/wastes.csv"),
    d3.csv("../data/Environment/recyclings.csv"),
    d3.csv("../data/Environment/organicrecyclings.csv"),
    d3.csv("../data/Environment/watercons.csv"),
]).then(datafiles => {
    
    // setup chart and data for Waste 
    // process the data
    const wasteData = datafiles[0],
          wasteType = wasteData.columns.slice(2),
          wasteDate = wasteData.columns[0],
          wasteRegions = wasteData.columns[1],
          wasteDataProcessed = dataSets(wasteData, wasteType);
    
        wasteDataProcessed.forEach( d => {
            d.label = d[wasteDate];
            d[wasteDate] = parseYear(d[wasteDate]);
        });

    // need to convert date field to readable js date format
    // nest the processed data by regions
    const wasteDataNested =  d3.nest().key( d => { return d[wasteRegions];})
        .entries(wasteDataProcessed);

    console.log(wasteDataNested);

    // get array of keys from nest
    const wasteRegionNames = [];
        wasteDataNested.forEach(d => {
            wasteRegionNames.push(d.key);
        });

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const wasteChart = new MultiLineChart("#chart-waste", "Years", "Kg", [], wasteRegionNames);
    
    // 1. Value Key, 2. Data set, 3. x axis title, 4. y axis title
    wasteChart.getData(wasteType[0], wasteDataNested, "Years", "Kg");
    
    // 1. Tooltip title, 2. format, 3. dateField, 4. prefix, 5. postfix
    wasteChart.addTooltip("Waste - Year ", "thousands", "label","","Kg");
    

    //  Setup data and chart for recyclings
    const recyclingsData = datafiles[1],
          recyclingsTypes = recyclingsData.columns.slice(1),
          recyclingsDate = recyclingsData.columns[0],
          recyclingsDataProcessed = dataSets(recyclingsData, recyclingsTypes);

    // console.log("recyclings data processed", recyclingsDataProcessed);
    // drawing charts for planning data.
    const recyclingsChart = new GroupedBarChart(recyclingsDataProcessed, recyclingsTypes, recyclingsDate, "#chart-recyclings", "Years", "%");


    //  Setup data and chart for organic recyclings
    const organicrecyclingsData = datafiles[2],
          organicrecyclingsTypes = organicrecyclingsData.columns.slice(1),
          organicrecyclingsDate = organicrecyclingsData.columns[0],
          organicrecyclingsDataProcessed = dataSets(organicrecyclingsData, organicrecyclingsTypes);

    // console.log("organicrecyclings data processed", organicrecyclingsDataProcessed);
    // drawing charts for planning data.
    const organicrecyclingsChart = new GroupedBarChart(organicrecyclingsDataProcessed, organicrecyclingsTypes, organicrecyclingsDate, "#chart-organicrecyclings", "Years", "%");


    // data and chart for watercons
    const waterconsData = datafiles[3],
    waterconsTypes = waterconsData.columns.slice(1),
    waterconsDate = waterconsData.columns[0],
    waterconsDataProcessed = dataSets(waterconsData, waterconsTypes);

    // console.log("watercons data processed", waterconsDataProcessed);
    // drawing charts for planning data.
    const waterconsChart = new GroupedBarChart(waterconsDataProcessed, waterconsTypes, waterconsDate, "#chart-watercons", "Years", "Litres");


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