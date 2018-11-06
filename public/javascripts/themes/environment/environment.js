Promise.all([
    d3.csv("../data/Environment/wastes.csv"),
    d3.csv("../data/Environment/recyclings.csv"),
    d3.csv("../data/Environment/organicrecyclings.csv"),
    d3.csv("../data/Environment/watercons.csv"),
    d3.csv("../data/Environment/riverqualities.csv"),
    d3.csv("../data/Environment/greenflags.csv"),
    d3.csv("../data/Environment/localagendas.csv"),
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

    // get array of keys from nest
    const wasteRegionNames = [];
        wasteDataNested.forEach(d => {
            wasteRegionNames.push(d.key);
        });

    const wasteContent = {
        element: "#chart-waste",
        keys: wasteRegionNames,
        data: wasteDataNested
    };

    // draw the chart
    const wasteChart = new MultiLineChart(wasteContent);
          wasteChart.getData(wasteType[0], "Years", "Kg");
          wasteChart.addTooltip("Waste - Year ", "thousands", "label","","Kg");
    

    //  Setup data and chart for recyclings
    const recyclingsData = datafiles[1],
          recyclingsTypes = recyclingsData.columns.slice(1),
          recyclingsDate = recyclingsData.columns[0],
          recyclingsDataProcessed = dataSets(recyclingsData, recyclingsTypes);

    // drawing charts for planning data.
    const recyclingsChart = new GroupedBarChart(recyclingsDataProcessed, recyclingsTypes, recyclingsDate, "#chart-recyclings", "Years", "%");
          recyclingsChart.addTooltip("Recycling Rate Dry - Year", "percentage", recyclingsDate);


    //  Setup data and chart for organic recyclings
    const organicrecyclingsData = datafiles[2],
          organicrecyclingsTypes = organicrecyclingsData.columns.slice(1),
          organicrecyclingsDate = organicrecyclingsData.columns[0],
          organicrecyclingsDataProcessed = dataSets(organicrecyclingsData, organicrecyclingsTypes);

    // console.log("organicrecyclings data processed", organicrecyclingsDataProcessed);
    // drawing charts for planning data.
    const organicrecyclingsChart = new GroupedBarChart(organicrecyclingsDataProcessed, organicrecyclingsTypes, organicrecyclingsDate, "#chart-organicrecyclings", "Years", "%");
          organicrecyclingsChart.addTooltip("Recycling Rate Organics - Year", "percentage", recyclingsDate);


    // data and chart for watercons
    const waterconsData = datafiles[3],
    waterconsTypes = waterconsData.columns.slice(1),
    waterconsDate = waterconsData.columns[0],
    waterconsDataProcessed = dataSets(waterconsData, waterconsTypes);

    // console.log("watercons data processed", waterconsDataProcessed);
    // drawing charts for planning data.
    const waterconsChart = new GroupedBarChart(waterconsDataProcessed, waterconsTypes, waterconsDate, "#chart-watercons", "Years", "Litres");
          waterconsChart.addTooltip("Water Consumption - Year", "thousands", waterconsDate);


    // data and chart for riverqualities
    const riverqualitiesData = datafiles[4],
    riverqualitiesTypes = riverqualitiesData.columns.slice(1),
    riverqualitiesDate = riverqualitiesData.columns[0],
    riverqualitiesDataProcessed = dataSets(riverqualitiesData, riverqualitiesTypes);

    // console.log("riverqualities data processed", riverqualitiesDataProcessed);
    // drawing charts for planning data.
    const riverqualitiesChart = new GroupedBarChart(riverqualitiesDataProcessed, riverqualitiesTypes, riverqualitiesDate, "#chart-riverqualities", "Years", "% of Surveryed Channel Length (1156.5km)");
          riverqualitiesChart.addTooltip("Water Quality  - Years", "thousands", riverqualitiesDate);


    // data and chart for green flags
    const greenflagsData = datafiles[5],
    greenflagsTypes = greenflagsData.columns.slice(1),
    greenflagsDate = greenflagsData.columns[0],
    greenflagsDataProcessed = dataSets(greenflagsData, greenflagsTypes);

    // drawing charts for planning data.
    const greenflagsChart = new GroupedBarChart(greenflagsDataProcessed, greenflagsTypes, greenflagsDate, "#chart-greenflags", "Years", "Number of Schools");
          greenflagsChart.addTooltip("Green Flag Schools  - Year", "thousands", greenflagsDate);


    // data and chart for localagendas.csv
    // process the data
    const localagendasData = datafiles[6],
          localagendasType = localagendasData.columns.slice(2),
          localagendasDate = localagendasData.columns[0],
          localagendasRegions = localagendasData.columns[1],
          localagendasDataProcessed = dataSets(localagendasData, localagendasType);
    
        localagendasDataProcessed.forEach( d => {
            d.label = d[localagendasDate];
            d[localagendasDate] = parseYear(d[localagendasDate]);
        });

    // need to convert date field to readable js date format
    // nest the processed data by regions
    const localagendasDataNested =  d3.nest().key( d => { return d[localagendasRegions];})
        .entries(localagendasDataProcessed);

    // get array of keys from nest
    const localagendasRegionNames = [];
        localagendasDataNested.forEach(d => {
            localagendasRegionNames.push(d.key);
        });

    const localagendasContent = {
        element: "#chart-localagendas",
        keys: localagendasRegionNames,
        data: localagendasDataNested
    };

    // draw the chart
    // 1.Selector, 2. X axis Label, 3. Y axis Label, 4. , 5
    const localagendasChart = new MultiLineChart(localagendasContent);
          localagendasChart.getData(localagendasType[0], "Years", "Number of Projects");
          localagendasChart.addTooltip("Projects - Year ", "thousands", "label","","");


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