var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var parseYear = d3.timeParse("%Y");


d3.csv("../data/Demographics/CNA13.csv").then( data => {

    const columnNames = data.columns.slice(2),
          xValue = data.columns[0];
          groupBy = data.columns[0];
          yLabels =["Population (000s)", "Rate %"];

    const valueData = data.map( d => {
            d.year = d.date;
            d.date = parseYear(d.date);
            for( var i = 0, n = columnNames.length; i < n; i++ ){
                d[columnNames[i]] = +d[columnNames[i]];
            }
        return d;
    });
    console.log("value data should be here", valueData);

    const types = d3.nest()
        .key( d => {
            return d[groupBy];
        }).entries(valueData);

        console.log("Population data should be here", types);

    const grouping = types.map( d => d.key);

    const populationChart = new MultiLineChart("#chart-population", "Years", yLabels[0], yLabels, grouping);
    populationChart.getData(columnNames[0], types);
    populationChart.addTooltip("Year: ","","year");  

    d3.select(".demographics_count").on("click", function(){
        populationChart.getData(columnNames[0], types);
    });
    
    d3.select(".demographics_arate").on("click", function(){
        populationChart.getData(columnNames[1], types);
    });

//      need to work on the forumale to calculate this
//    let femaleRate = types;

}).catch(function(error){
    console.log(error);
});

d3.csv("../data/Demographics/CNA14.csv").then( data => {

    data.forEach( d => {
        d.Dublin = +d.Dublin;
    });

    console.log("this is the female data :", data);

    const femaleRateBar = new BarChart( data,"#chart-femalespermales", "date", "Dublin", "Year", "Rate");

}).catch(function(error){
    console.log(error);
});

d3.csv("../data/Demographics/CNA31.csv").then( data => {

    const columnNames = data.columns.slice(2),
          xValue = data.columns[1];
          yLabels =["Population (000s)"];

    // const valueData = columnNames.map(cat => {

    //     return {
    //       name: cat,
    //       values: data.map( d => {
    //         return {
    //           date: d.date,
    //           country: d.country, 
    //           value: +(d[cat]),
    //           };
    //       }),
    //     };
    //   });

    // const combinedData = valueData.map( d => {

    //     return{

    //         key: d.name,
    //         values: d3.nest()
    //                 .key(function(g){ return g.date;})
    //                 .rollup(function(v) { return d3.sum(v, function(g) { return g.value; });})
    //                 .entries(d.values)
    //     }

    // });


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



    console.log("this is the test data values :", array);

    const outsideStateChart = new GroupedBarChart(array, columnNames, xValue, "#chart-bornOutsideState", "grouped bar chart", "Millions");
   

}).catch(function(error){
    console.log(error);
});


d3.csv("../data/Demographics/CNA33.csv").then( data => {
    
    console.log("the data for the household numbers:", data);

    const columnNames = data.columns.slice(1);
    const xValue = data.columns[0];
    
    console.log("the regions' names", columnNames);

    const valueData = data.map( d => {
        for( var i = 0, n = columnNames.length; i < n; i++ ){
            d[columnNames[i]] = +d[columnNames[i]];
        }
        return d;
    });
    
    console.log("Household number coerced", valueData);


const houseHoldsChart = new GroupedBarChart(valueData, columnNames, xValue, "#chart-households", "Years", "Number of Households");
   


}).catch(function(error){
    console.log(error);
});


d3.csv("../data/Demographics/CNA29.csv").then( data => {
    
    console.log("the data for the household numbers:", data);

    const columnNames = data.columns.slice(2);
    const xValue = data.columns[0];
    
    console.log("the regions' names", columnNames);

    const valueData = data.map( d => {
        for( var i = 0, n = columnNames.length; i < n; i++ ){
            d[columnNames[i]] = +d[columnNames[i]];
        }
        return d;
    });
    
    console.log("Household number coerced", valueData);


const houseHoldCompositionChart = new GroupedBarChart(valueData, columnNames, xValue, "#chart-householdComposition", "Person per Household ", "Number of Households");
   


}).catch(function(error){
    console.log(error);
});