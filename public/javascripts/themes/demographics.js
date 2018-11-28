
d3.csv("../data/Demographics/CNA13.csv").then( data => {

    const columnNames = data.columns.slice(2),
          xValue = data.columns[0];
          groupBy = data.columns[0];
          yLabels =["Population (000s)", "Rate %"];

    const valueData = data.map( d => {
            d.label = d.date;
            d.date = parseYear(d.date);
            for( var i = 0, n = columnNames.length; i < n; i++ ){
                d[columnNames[i]] = +d[columnNames[i]];
            }
        return d;
    });

    const types = d3.nest()
        .key( d => {
            return d[groupBy];
        }).entries(valueData);

    const grouping = types.map( d => d.key);

    const population = {
        element: "#chart-population",
        keys: grouping,
        data: types,
        xTitle: "Years",
        yTitle: "Population",
        yScaleFormat : "millions"
    };

    const populationChart = new MultiLineChart(population);
          populationChart.yLabels=yLabels;
          populationChart.value=columnNames[0];
          populationChart.tickNumber = 106; 
          populationChart.drawChart();

        // add the tooltip
        populationChart.addTooltip("Year: ","thousands","label");
        populationChart.showSelectedLabels([0,16,26,36,41,46,51,56,61,69,71,76,81,86,92,96,101,106]);
        
        //hide year labels for now.
        // d3.select("#chart-population").selectAll(".x-axis text").style("display","none");
    //WIP
    // let start,
    //     end,
    //     size = types[0].values.length - 1;
        
    //     start = types[0].values[0].label;
    //     end = types[0].values[size].label;

}).catch(function(error){
    console.log(error);
});

d3.csv("../data/Demographics/CNA14.csv").then( data => {

    data.forEach( d => {
        d.Dublin = +d.Dublin;
    });
    // const femaleRateBar = new BarChart( data,"#chart-femalespermales", "date", "Dublin", "Year", "Rate");

}).catch(function(error){
    console.log(error);
});

d3.csv("../data/Demographics/CNA31.csv").then( data => {

    const columnNames = data.columns.slice(2),
          xValue = data.columns[1];
          yLabels =["Population (000s)"];

    const combinedData = d3.nest()
                    .key(function(g){ return g.date;})
                    .rollup(function(v) { return{
                        state: d3.sum(v, function(g) { return g.State; }),
                        dublin: d3.sum(v, function(g) { return g.Dublin; })
                    }; })
                    .entries(data);
    let array = [];

    combinedData.forEach( d => {
        let obj = {}
        obj.date = d.key;
        obj.Dublin = d.value.dublin;
        obj.State = d.value.state;
        array.push(obj);
    });

    const outsideStateContent = {
        element: "#chart-bornOutsideState",
        data: array,
        keys: columnNames,
        value: xValue,
        titleX: "Years",
        titleY: "Population",
        yScaleFormat: "millions"
    },

    outsideStateTT = {
        title: "Born Outside the State - Year:",
        datelabel: xValue,
        format: "thousands",
    },

    //  for each d in combineData get the key and assign to each d in d.values

    outsideStateChart = new GroupedBarChart(outsideStateContent);

    outsideStateChart.addTooltip(outsideStateTT);

}).catch(function(error){
    console.log(error);
});


d3.csv("../data/Demographics/CNA33.csv").then( data => {
    const columnNames = data.columns.slice(1);
    const xValue = data.columns[0];

    const valueData = data.map( d => {
        for( var i = 0, n = columnNames.length; i < n; i++ ){
            d[columnNames[i]] = +d[columnNames[i]];
        }
        return d;
    }), 
        houseHoldsContent = {
            element: "#chart-households",
            data: valueData,
            keys: columnNames,
            value: xValue,
            titleX: "Years",
            titleY: "Number of Households",
            yScaleFormat: "millions"
        },

        houseHoldsTT = {
            title: "Number of Households - Year:",
            datelabel: xValue,
            format: "thousands",
        },

        houseHoldsChart = new GroupedBarChart(houseHoldsContent);
        houseHoldsChart.addTooltip(houseHoldsTT);
   


}).catch(function(error){
    console.log(error);
});


d3.csv("../data/Demographics/CNA29.csv").then( data => {

    const columnNames = data.columns.slice(2);
    const xValue = data.columns[0];

    const valueData = data.map( d => {
        for( var i = 0, n = columnNames.length; i < n; i++ ){
            d[columnNames[i]] = +d[columnNames[i]];
        }
        return d;
    }),
    houseHoldCompositionContent = {
        element: "#chart-householdComposition",
        data: valueData,
        keys: columnNames,
        value: xValue,
        titleX: "Person per Household",
        titleY: "Number of Households",
        yScaleFormat: "millions"
    },

    houseHoldCompositionTT = {
        title: "Person per Household:",
        datelabel: xValue,
        format: "thousands",
    },

    houseHoldCompositionChart = new GroupedBarChart(houseHoldCompositionContent);
    houseHoldCompositionChart.addTooltip(houseHoldCompositionTT);
    houseHoldCompositionChart.hideRate(true);
   
}).catch(function(error){
    console.log(error);
});