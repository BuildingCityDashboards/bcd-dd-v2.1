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
    d3.csv("../data/Housing/HPM06.csv"),
    d3.csv("../data/Housing/HPM06Rate.csv"),
]).then(datafiles => {

    const getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p);
    
    //1.  data processing for house completion chart
    const completionData = datafiles[0],
          keys = completionData.columns.slice(1),
          dateField = completionData.columns[0],
          compDataProcessed = dataSets(completionData, keys);

          compDataProcessed.forEach(function(d) {  
            d.label = d[dateField];
            d[dateField] = parseMonth(d[dateField]);
            d.year = formatYear(d[dateField]);
          });

    const houseCompCharts = new StackedAreaChart("#chart-houseComp", "Months", "Units", dateField, keys);
          houseCompCharts.pagination(compDataProcessed, "#chart-houseComp", 12, 5, "year", "Units by Month:");
          houseCompCharts.addTooltip("Units by Month:", "thousands", "year");



    //2.  data processing for planning charts.
    const planningData = datafiles[1],
          types = planningData.columns.slice(2),
          date = planningData.columns[0],
          planningDataProcessed = dataSets(planningData, types),

        dcc = planningDataProcessed.filter( d => {
            return d.region === "Dublin";
        }),
        drcc = planningDataProcessed.filter( d => {
            return d.region === "Dun Laoghaire- Rathdown";
        }),
        fcc = planningDataProcessed.filter( d => {
            return d.region === "Fingal";
        }),
        sdcc = planningDataProcessed.filter( d => {
            return d.region === "South Dublin";
        }),

        dccContent = {
            element: "#chart-planningDCC",
            data: dcc,
            keys: types,
            value: date,
            titleX: "Years",
            titleY: "Applications",
            // yScaleFormat: "percentage"
        },

        drccContent = {
            element: "#chart-planningDRCC",
            data: drcc,
            keys: types,
            value: date,
            titleX: "Years",
            titleY: "Applications",
            // yScaleFormat: "percentage"
        },

        fccContent = {
            element: "#chart-planningFCC",
            data: fcc,
            keys: types,
            value: date,
            titleX: "Years",
            titleY: "Applications",
            // yScaleFormat: "percentage"
        },

        sdccContent = {
            element: "#chart-planningSDCC",
            data: sdcc,
            keys: types,
            value: date,
            titleX: "Years",
            titleY: "Applications",
            // yScaleFormat: "percentage"
        },

        planningTT = {
            title: "Planning Applications - Year",
            datelabel: date,
            valueFormat: "thousands",
        },

        // drawing charts for planning data.
        dccChart = new GroupedBarChart(dccContent),
        drccChart = new GroupedBarChart(drccContent),
        fccChart = new GroupedBarChart(fccContent),
        sdccChart = new GroupedBarChart(sdccContent);

        dccChart.addTooltip(planningTT);
        drccChart.addTooltip(planningTT);
        fccChart.addTooltip(planningTT);
        sdccChart.addTooltip(planningTT);

    
    const supplyData = datafiles[2],
          supplyType = supplyData.columns.slice(2),
          supplyDate = supplyData.columns[0],
          supplyRegions = supplyData.columns[1],
          supplyDataProcessed = dataSets(supplyData, supplyType);
    
    supplyDataProcessed.forEach( d => {
            d[supplyDate] = parseYear(d[supplyDate]);
            d.label = formatYear(d[supplyDate]);
        });

    // need to convert date field to readable js date format

    // nest the processed data by regions
    const supplyDataNested =  d3.nest().key( d => {
         return d[supplyRegions];
        })
        .entries(supplyDataProcessed);

    const supplyContent = {
        element: "#chart-houseSupply",
        data: supplyDataNested,
        value: "Hectares",
        xTitle: "Years",
        yTitle: "Hectares"
    }
    const supplyChart = new MultiLineChart(supplyContent);
          supplyChart.drawChart();
          supplyChart.addTooltip("Land - Year", "thousands", "label");

    d3.select("#supply_land").on("click", function(){
        activeBtn(this);
        
        supplyChart.value = "Hectares";
        supplyChart.yTitle = "Hectares";
        
        supplyChart.updateChart();
        supplyChart.addTooltip("Land - Year", "thousands", "label");
    });
    
    d3.select("#supply_units").on("click", function(){
        activeBtn(this);

        supplyChart.value = "Units";
        supplyChart.yTitle = "Units";
        
        supplyChart.updateChart();
        supplyChart.addTooltip("Units - Year", "thousands", "label");
    });

    // setup chart and data for annual contribution chart
    // process the data
    const contributionData = datafiles[3],
          contributionType = contributionData.columns.slice(2),
          contributionDate = contributionData.columns[0],
          contributionRegions = contributionData.columns[1],
          contributionDataProcessed = dataSets(contributionData, contributionType);
    
    contributionDataProcessed.forEach( d => {
        d.label = d[contributionDate];
        d[contributionDate] = parseYear(d[contributionDate]);
    });

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const contributionDataNested =  d3.nest().key( d => { return d[contributionRegions];})
            .entries(contributionDataProcessed);

        const contriContent = {
            element: "#chart-houseContributions",
            data: contributionDataNested,
            value: "value",
            xTitle: "Years",
            yTitle: "€"
        };

    // draw the chart
    const contributionChart = new MultiLineChart(contriContent);
          contributionChart.yScaleFormat = "millions";
          contributionChart.drawChart();
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
            d.label = (d[housePricesDate]);
            d[housePricesDate] = convertQuarter(d[housePricesDate]);
        });

    const hPricesFiltered  = filterbyDate(housePricesDataProcessed, housePricesDate, "Jan 01 2008");

    // need to convert date field to readable js date format

    // nest the processed data by regions
        const housePricesDataNested =  d3.nest().key( d => { return d[housePricesRegions];})
            .entries(hPricesFiltered);

        const housePricesContent = {
            element: "#chart-housePrices",
            data: housePricesDataNested,
            value: "value",
            xTitle: "Quarters",
            yTitle: "€"
        };

    // draw the chart
    const housePricesChart = new MultiLineChart(housePricesContent);
          housePricesChart.yScaleFormat = "millions";
          housePricesChart.drawChart();
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

    // nest the processed data by regions
        const rentPricesDataNested =  d3.nest().key( d => { return d[rentPricesRegions];})
            .entries(rentPricesDataProcessed);

        const rentPricesContent = {
            element: "#chart-rentPrices",
            data: rentPricesDataNested,
            value: "value",
            xTitle: "Quarters",
            yTitle: "€"
        }

    // draw the chart
    const rentPricesChart = new MultiLineChart(rentPricesContent);
          rentPricesChart.drawChart();
          rentPricesChart.addTooltip("In thousands - ", "thousands", "label", "€");
    

    //  Setup data and chart for rent prices by quarter by bed numbers
    const rentByBedsData = datafiles[6],
          rentByBedsTypes = rentByBedsData.columns.slice(2),
          rentByBedsDate = rentByBedsData.columns[0],
          rentByBedsDataProcessed = dataSets(rentByBedsData, rentByBedsTypes),

          rentByBedContent = {
            element: "#chart-rentByBeds",
            data: rentByBedsDataProcessed,
            keys: rentByBedsTypes,
            value: rentByBedsDate,
            titleX: "Quarters",
            titleY: "Price",
            yScaleFormat: "euros"
        },

        rentByBedTT = {
            title: "Rent Prices - Year:",
            datelabel: rentByBedsDate,
            format: "euros2",
        },

        // drawing charts for planning data.
        rentByBedsChart = new GroupedBarChart(rentByBedContent);
        rentByBedsChart.addTooltip(rentByBedTT);


    //  Setup data and chart for rent prices by quarter by bed numbers
    const rentInspectData = datafiles[7],
    rentInspectTypes = rentInspectData.columns.slice(1),
    rentInspectDate = rentInspectData.columns[0],
    rentInspectDataProcessed = dataSets(rentInspectData, rentInspectTypes),

    rentInspectContent = {
        element: "#chart-rentInspect",
        data: rentInspectDataProcessed,
        keys: rentInspectTypes,
        value: rentInspectDate,
        titleX: "Years",
        titleY: "Inspections",
    },

    rentInspectTT = {
        title: "Rent Inspections - Year:",
        datelabel: rentInspectDate,
        format: "thousands",
    },

    // console.log("rentInspect data processed", rentInspectDataProcessed);
    // drawing charts for planning data.
          rentInspectChart = new GroupedBarChart(rentInspectContent);
          rentInspectChart.addTooltip(rentInspectTT);
    
    
    // process the data
    const houseCompByTypeData = datafiles[8],
          houseCompByTypeType = houseCompByTypeData.columns.slice(2),
          houseCompByTypeDate = houseCompByTypeData.columns[0],
          houseCompByTypeRegions = houseCompByTypeData.columns[1],
          houseCompByTypeDataProcessed = dataSets(houseCompByTypeData, houseCompByTypeType);
    
    houseCompByTypeDataProcessed.forEach( d => {
        d.label = (d[houseCompByTypeDate]);
        d[houseCompByTypeDate] = convertQuarter(d[houseCompByTypeDate]);
    });

    // nest the processed data by regions
        const houseCompByTypeDataNested =  d3.nest().key( d => { return d[houseCompByTypeRegions];})
            .entries(houseCompByTypeDataProcessed);

        const houseCompByTypeContent = {
            element: "#chart-houseCompByType",
            data: houseCompByTypeDataNested,
            value: houseCompByTypeType[0], 
            xTitle: "Quarters", 
            yTitle: "Numbers"
        }

    // draw the chart
    const houseCompByTypeChart = new MultiLineChart(houseCompByTypeContent);
          houseCompByTypeChart.drawChart();
          houseCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");

    d3.select("#houseCompByType_total").on("click", function(){
        activeBtn(this);

        houseCompByTypeChart.value = houseCompByTypeType[0];
        houseCompByTypeChart.updateChart();
        houseCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");
        houseCompByTypeChart.hideRate(false);
    });
    
    d3.select("#houseCompByType_private").on("click", function(){
        activeBtn(this);

        houseCompByTypeChart.value = houseCompByTypeType[1];
        houseCompByTypeChart.updateChart();
        houseCompByTypeChart.addTooltip("Private Houses - ", "thousands", "label");
        houseCompByTypeChart.hideRate(false);
    });

    d3.select("#houseCompByType_social").on("click", function(){
        activeBtn(this);

        houseCompByTypeChart.value = houseCompByTypeType[2];
        houseCompByTypeChart.updateChart();
        houseCompByTypeChart.addTooltip("Social Houses - ", "thousands", "label");
        houseCompByTypeChart.hideRate(true);
    });

    // setup chart and data for esb non new connections of land chart
    // process the data
    const nonNewConnectionsData = datafiles[9],
          nonNewConnectionsType = nonNewConnectionsData.columns.slice(2),
          nonNewConnectionsDate = nonNewConnectionsData.columns[0],
          nonNewConnectionsRegions = nonNewConnectionsData.columns[1],
          nonNewConnectionsDataProcessed = dataSets(nonNewConnectionsData, nonNewConnectionsType),
          nonNewGroup = getKeys(nonNewConnectionsData.map(o => o.type));

    
          nonNewConnectionsDataProcessed.forEach( d => {
              d.label = (d[nonNewConnectionsDate]);
              d[nonNewConnectionsDate] = convertQuarter(d[nonNewConnectionsDate]);
          });

    let nonNewCon = nestData(nonNewConnectionsDataProcessed, "label", nonNewConnectionsRegions, "value")
    //console.log(nonNewCon);
    // const nonNewConFiltered  = filterbyDate(nonNewCon, nonNewConnectionsDate, "Jan 01 2016");

    const nonNewConnectionsChart = new StackedAreaChart("#chart-nonNewConnections", "Quarters", "Numbers", nonNewConnectionsDate, nonNewGroup);
    
    // (data, title of X axis, title of Y Axis, y Scale format, name of type, name of value field )  
    nonNewConnectionsChart.tickNumber = 20;
    nonNewConnectionsChart.getData(nonNewCon);
    nonNewConnectionsChart.addTooltip("House Type -", "Units", "label");

    // setup chart and data for New Dwelling Completion by type chart
    // process the data
    const newCompByTypeData = datafiles[10],
          newCompByTypeType = newCompByTypeData.columns.slice(2),
          newCompByTypeDate = newCompByTypeData.columns[0],
          newCompByTypeRegions = newCompByTypeData.columns[1],
          newCompByTypeDataProcessed = dataSets(newCompByTypeData, newCompByTypeType);
    
          newCompByTypeDataProcessed.forEach( d => {
              d.label = (d[newCompByTypeDate]);
              d[newCompByTypeDate] = convertQuarter(d[newCompByTypeDate]);
          });

         // need to convert date field to readable js date format

        // nest the processed data by regions
        const newCompByTypeDataNested =  d3.nest().key( d => { return d[newCompByTypeRegions];})
            .entries(newCompByTypeDataProcessed);

        const newCompByTypeContent = {
            element: "#chart-newCompByType",
            data: newCompByTypeDataNested,
            value: newCompByTypeType[0],
            xTitle: "Quarters",
            yTitle: "Numbers"
        };
        

    // draw the chart
    const newCompByTypeChart = new MultiLineChart(newCompByTypeContent);
          newCompByTypeChart.drawChart();
          newCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");


    // new chart Price Index
    const HPM06 = datafiles[11],
          HPM06R = HPM06.columns[1],
          HPM06V = HPM06.columns[2],
          HPM06D = HPM06.columns[0];

    // create content object
    const HPM06Content = chartContent(HPM06, HPM06R, HPM06V, HPM06D, "#chart-HPM06");
          HPM06Content.xTitle = "Months";
          HPM06Content.yTitle = "Price Index (Base 100)"

    // draw the chart
    const HPM06Charts = new MultiLineChart(HPM06Content);
            HPM06Charts.drawChart(); // draw axis
            HPM06Charts.addTooltip("Price Index - ", "", "label"); // add tooltip
            HPM06Charts.addBaseLine(100); // add horizontal baseline

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
            // d[columns[i]] !== "null" ? d[columns[i]] = +d[columns[i]] : d[columns[i]] = "unavailable";
            d[columns[i]] =  +d[columns[i]];
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

function filterbyDate(data, dateField, date){
    return data.filter( d => {
        return d[dateField] >= new Date(date);
    });
}

function filterByDateRange(data, dateField, dateOne, dateTwo){
    return data.filter( d => {
        return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo);
    });
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

function chartContent(data, key, value, date, selector){

    data.forEach(function(d) {  //could pass types array and coerce each matching key using dataSets()
        d.label = d[date];
        d.date = parseYearMonth(d[date]);
        d[value] = +d[value];
    });

    // nest the processed data by regions
    const nest =  d3.nest().key( d => { return d[key] ;}).entries(data);
    
    // get array of keys from nest
    const keys = [];
          nest.forEach(d => {keys.push(d.key);});

    return {
            element: selector,
            data: nest,
            value: value
        }

}

function activeBtn(e){
    let btn = e;
    $(btn).siblings().removeClass('active');
    $(btn).addClass('active');
}