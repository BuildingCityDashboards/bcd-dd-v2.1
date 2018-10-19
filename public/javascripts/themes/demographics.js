var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var parseYear = d3.timeParse("%Y");


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
        data: types
    };

    const populationChart = new MultiLineChart(population);
          populationChart.yLabels=yLabels;
          populationChart.value=columnNames[0];
        //   populationChart.data=types;
          populationChart.titleX="years";
          populationChart.titleY=yLabels[0];
          populationChart.yScaleFormat = d3.format(".2s");
          populationChart.createScales();

        // add the tooltip
        populationChart.addTooltip("Year: ","","label");
        
        //hide year labels for now.
        // d3.select("#chart-population").selectAll(".x-axis text").style("display","none");
    //WIP
    // let start,
    //     end,
    //     size = types[0].values.length - 1;
        
    //     start = types[0].values[0].label;
    //     end = types[0].values[size].label;
    
    //buttons
    d3.select(".demographics_count").on("click", function(){
        populationChart.value=columnNames[0];
        populationChart.yScaleFormat = d3.format(".2s");
        populationChart.createScales();
    });

    //buttons
    d3.select(".demographics_arate").on("click", function(){
        populationChart.value=columnNames[1];
        populationChart.yScaleFormat = d3.format(".0%");
        populationChart.createScales();
    });

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
    let array = []

    combinedData.forEach( d => {
        let obj = {}
        obj.date = d.key;
        obj.Dublin = d.value.dublin;
        obj.State = d.value.state;
        array.push(obj);
    });

    //  for each d in combineData get the key and assign to each d in d.values

    const outsideStateChart = new GroupedBarChart(array, columnNames, xValue, "#chart-bornOutsideState", "grouped bar chart", "Millions");
    // console.log(outsideStateChart);    
    outsideStateChart.scaleFormatY = (d3.format(".2s"));//update yaxis scale
    outsideStateChart.update();//update object

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
    });

    const houseHoldsChart = new GroupedBarChart(valueData, columnNames, xValue, "#chart-households", "Years", "Number of Households");
   


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
    });

const houseHoldCompositionChart = new GroupedBarChart(valueData, columnNames, xValue, "#chart-householdComposition", "Person per Household ", "Number of Households");
   
}).catch(function(error){
    console.log(error);
});