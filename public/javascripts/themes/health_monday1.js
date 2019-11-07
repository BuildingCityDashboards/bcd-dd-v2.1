// var section = d3.select("#economy");
// var article = d3.select("#income_poverty", section);
var parseTime = d3.timeParse("%d/%m/%Y"); //converts a string to a Date
var formatTime = d3.timeFormat("%d/%m/%Y"); //converts a Date to the human-readable 
//date format -> outputs a string
var cleanData = [];
//    var nut3regions = [
//        "Border",
//        "Midland",
//        "West",
//        "Dublin",
//        "Mid-East",
//        "Mid-West",
//        "South-East",
//        "South-West",
//        "Ireland"
//    ]

// margins top: 50, right: 100, bottom: 50, left: 50
var margin = {top: 50, right: 150, bottom: 100, left: 80},
        width = 950 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
var keys = []; // array of strings for column names for use as keys

// load csv data and turn value into a number
d3.csv("../data/Health/trolleys_transposed.csv").then(function (data) {

    //var tooltip = d3.select('#chart-trolleys')
    //    .append('div')  
    //    .attr('class', 'tool-tip');    

//    console.log(data);

    keys = data.columns; 
//    console.log("columns/ keys: " + keys);

    //Mutate the data...
    data.forEach(d => {
//        console.log("d: " + JSON.stringify(d));
        for (var i = 0; i < keys.length; i += 1) {
            if (keys[i] === "date") {
                d[keys[i]] = parseTime(d[keys[i]]); //stores a full Date
            } else {
                d[keys[i]] = +d[keys[i]]; //coerce all other data to numbers
            }
//        console.log("d clean: " + JSON.stringify(d));
//            cleanData.push(d); 
        }
    }
    );

    var valuesByDate = d3.nest()
            .key(function (d) {
                return d.date;
            })
            .rollup(function (v) {
                return d3.sum(v, function (d) {
//                        if(g.key!=="date" && g.key!=="year" && g.key!=="week"){
                    console.log("val: "+d[keys[3]]);
                    return d[keys[3]];
                });
            })
            .entries(data);

    data.forEach(d => {
        var sumIt = d3.sum(d, function (g) {
            return +g.value;
        });
        console.log("vByD: " + JSON.stringify(sumIt));
    });

    // get the div and add svg 400 x400
    var g = d3.select("#chart-trolleys")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x label
    g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle");
//         .text("Median Real Household Disposable Income");

    // y label
    g.append("text")
            .attr("x", -(height / 2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("# Patients");

    // // set band scale

    var x = d3.scaleTime().domain(
            [data[0].date, data[data.length - 1].date]
            ).range([0, width]);
//         .paddingInner(.2)
//         .paddingOuter(.2);

    console.log("max: " + d3.max(data, (d) => {
        return d.value;
    }));
    // // set linear scale
    var y = d3.scaleLinear()
            .domain([
                d3.min(data, (d) => {
                    return d.date;
                }),
                d3.max(data, (d) => {
                    return d.date;
                })])
            .range([height, 0]);

    // // x axis
    var xAxis = d3.axisBottom(x);
    g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

    // // y axis
    var yAxis = d3.axisLeft(y);
    g.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

    // // Bars
    // // select all rectangles and associate with the data
    // var rects = g.selectAll("rect")
    //     .data(transposedData.filter(d => {
    //         return (d.region === "Dublin" && d.type ==="Median Real Household Disposable Income (Euro)");
    //     }
    // ))
    // .enter()
    // .append("rect")
    //     .attr("x", (d) => {return x(d.year);})
    //     .attr("y", (d) => {return y(d.value);})
    //     .attr("width", x.bandwidth)
    //     .attr("height", (d) =>{return height - y(d.value);})
    //     .attr("fill", "#3182bd")
    //     .on( 'mouseover', function( d ){
    //         var dx  = parseFloat(d3.select(this).attr('x')) + x.bandwidth(); 
    //         var dy  = parseFloat(d3.select(this).attr('y')) + 10;
    //         tooltip
    //             .style( 'left', dx + "px" )
    //             .style( 'top', dy + "px" )
    //             .style( 'display', 'block' )
    //             .text("The value is: €" + d.value);
    //     })
    //     .on( 'mouseout', function(){
    //         tooltip
    //             .style( 'display', 'none' );
    //     });

    /* 
     
     *** End of Disposable Income chart *** 
     
     */

    //  At Risk of Poverty Rate
//    var chartTrolleys = d3.select("#chart-trolleys")
//            .append("svg")
//            .attr("width", width + margin.left + margin.right)
//            .attr("height", height + margin.top + margin.bottom);

//    var tooltip2 = d3.select('#chart2')
//        .append('div')  
//        .attr('class', 'tool-tip');  

//    g = chartTrolleys
//            .append("g")
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//    //  x label
//    g.append("text")
//            .attr("x", width / 2)
//            .attr("y", height + 60)
//            .attr("font-size", "20px")
//            .attr("text-anchor", "middle")
//            .text("Stacked Bar Chart");
//
//    // y label
//    g.append("text")
//            .attr("x", -(height / 2))
//            .attr("y", -40)
//            .attr("font-size", "20px")
//            .attr("text-anchor", "middle")
//            .attr("transform", "rotate(-90)")
//            .text("%");
//
//    //set scales
//    var x2 = d3.scaleBand()
//            .rangeRound([0, width])
//            .padding(0.3)
//            .align(0.3);
//
//    var y2 = d3.scaleLinear()
//            .rangeRound([height, 0]);
//
//    var colour = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//
//    // x axis
//    var xAxis2 = d3.axisBottom(x2);
//
//    // y axis
//    var yAxis2 = d3.axisLeft(y2);
//
//    g.append("g")
//            .attr("class", "y-axis")
//            .call(yAxis2);

    // manual categories - replace with dynamic
//    var xData = ["risk", "poverty", "deprivation"];

//    newList = d3.nest()
//        .key(d => { return d.region })
//        .key(d => { return d.type })
//        .entries(transposedData);


    // console.log(newList);

//    var risk = newList.find( d => d.key === "Dublin").values.find(d => d.key === "At Risk of Poverty Rate (%)").values,
//        poverty = newList.find( d => d.key === "Dublin").values.find(d => d.key === "Deprivation Rate (%)").values,
//        deprivation = newList.find( d => d.key === "Dublin").values.find(d => d.key === "Consistent Poverty Rate (%)").values;

    // console.log(newList);
    // console.log(risk);
    // join risk and poverty
//    var test = join( poverty, risk, "year", "year", function(risk, poverty) {
//        return {
//            year: risk.year,
//            region: risk.region,
//            risk: risk.value,
//            poverty: poverty.value
//        };
//    });

    // join test with deprivation
//    var completeArray = join(deprivation, test, "year", "year", function(test, deprivation) {
//        return {
//            year: test.year,
//            region: test.region,
//            risk: test.risk,
//            poverty: test.poverty,
//            deprivation: deprivation.value
//        };
//    });
//    
    // console.log(completeArray);

//    var stack = d3.stack()
//        .keys(xData)
//        .order(d3.stackOrderNone)
//        .offset(d3.stackOffsetNone);
//
//    series = stack(completeArray);
//
//    x2.domain(completeArray.map(function (d) {
//        return d.year;
//    }));            
//
//    y2.domain([0,
//        d3.max(series[series.length - 1],function (d) { return d[0] + d[1];})]).nice();
//    //replace with commented out section when loading data.
//    colour.domain(xData);
//    //colour.domain(sample.columns.slice(1));
//
//    // console.log(series);
//
//    var layer = g.selectAll(".stack")
//        .data(series)
//        .enter().append("g")
//        .attr("class", "stack")
//        .attr("fill", function(d) { return colour(d.key); });
//
//    layer.selectAll("rect")
//        .data(function (d) {return d;})
//        .enter().append("rect")
//            .attr("x", function (d) {return x2(d.data.year);})
//            .attr("y", function(d) { return y2(d[1]); })
//            .attr("height", function(d) { return y2(d[0]) - y2(d[1]); })
//            .attr("width", x2.bandwidth())
//            .on( 'mouseover', function( d ){
//                var dx  = parseFloat(d3.select(this).attr('x')) + x2.bandwidth(); 
//                var dy  = parseFloat(d3.select(this).attr('y')) + 10;
//                tooltip2
//                    .style( 'left', dx + "px" )
//                    .style( 'top', dy + "px" )
//                    .style( 'display', 'block' )
//                    .text(d[1]-d[0]);
//            })
//            .on( 'mouseout', function(){
//                tooltip2
//                    .style( 'display', 'none' );
//            });
//
//    g.append("g")
//        .attr("class", "x-axis")
//        .attr("transform", "translate(0, " + height +")")
//        .call(xAxis2);
//
//    var legend = g.selectAll(".legend")
//        .data(xData.reverse())
//        .enter().append("g")
//            .attr("class", "legend")
//            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
//            .style("font", "10px sans-serif");
//      
//    legend.append("rect")
//        .attr("x", width + 18)
//        .attr("width", 18)
//        .attr("height", 18)
//        .attr("fill", colour);
//    
//    legend.append("text")
//        .attr("x", width + 44)
//        .attr("y", 9)
//        .attr("dy", ".35em")
//        .attr("text-anchor", "start")
//        .text(function(d) { return d; });
//
//    const IncomeChart = new BarChart("#chart1", "Dublin", "Median Real Household Disposable Income (Euro)", "Median Real Household Disposable Income", "Euros");
//    })
//    // catch any error and log to console
//    .catch(function(error){
//    console.log(error);
}); //end of then()

// Employment Figures Charts

//d3.csv("../data/Economy/employment2.csv").then(function(data){
//
//    data.map(function(d){
//        d['ILO Participation Rate (15 years and over) (%)'] = +d['ILO Participation Rate (15 years and over) (%)']
//        d['ILO Unemployment Rate (15 - 74 years) (%)'] = +d['ILO Unemployment Rate (15 - 74 years) (%)']
//        d['Persons aged 15 years and over in Employment (Thousand)'] = +d['Persons aged 15 years and over in Employment (Thousand)']
//        d['Persons aged 15 years and over in Labour Force (Thousand)'] = +d['Persons aged 15 years and over in Labour Force (Thousand)']
//        d['Unemployed Persons aged 15 years and over (Thousand)'] = +d['Unemployed Persons aged 15 years and over (Thousand)']
//        d.quarter = d.quarter;
//        d.region = d.region;
//        return d;
//    });
//
//    stackData = data;
//    multilineData = data;
//
//    console.log("mutliline Data", multilineData);
//
//    keys = data.columns.slice(2);
//    console.log(keys);
//    const employmentCharts = new StackedAreaChart("#chartNew", "Persons aged 15 years and over in Employment (Thousand)", "Euros");
//
//    $("#chart-select").on("change", function(){
//        employmentCharts.getData();
//    });
//
//    $("#multi-select").on("change", function(){
//        mlineChart.getData();
//    });
//
//    const mlineChart = new MultiLineChart("#chartMulti", "Persons aged 15 years and over in Employment (Thousand)", "Euros");
//
//
//})// catch any error and log to console
//.catch(function(error){
//console.log(error);
//});
//
//// load csv data and turn value into a number
//d3.csv("../data/Economy/employment.csv").then(function(data){
//    
//    // console.log("Inital Data", data);
//
//    var transposedData = [];
//    data.forEach(d => {
//        for (var key in d) {
//            // console.log(key);
//            var obj = {};
//            if (!(key === "type" || key === "region")){
//                obj.type = d.type;
//                obj.region = d.region;
//                obj.quarter = key;
//                splitted = key.split('Q');
//                quarterEndMonth = splitted[1] * 3 - 2;
//                obj.date =  d3.timeParse('%m %Y')(quarterEndMonth + ' ' + splitted[0]);
//                obj.value = +d[key];
//                transposedData.push(obj);
//        }}
//    });
//
//    // console.log("rotated the quarters", transposedData);
//
//    entries = d3.nest()
//        .key(d => { return d.type })
//        .key(d => { return d.region })
//        .entries(transposedData);
//
//    // console.log("nested by type and then region", entries);
//
//    // // 1. nest array objects by type and then quarter.        DONE
//    // // 2. need to select the array that its key matchs the select opition like setOne 
//    // // 3. then for each quarter array need to create an object that has the quarter, date
//    // // 4. then need to match region with value like objCombined and push this to obj in step 2
//    
//    // // step 1
//    // entriesNew = d3.nest()
//    //     .key(d => { return d.type })
//    //     .key(d => { return d.quarter })
//    //     .entries(transposedData);
//
//    // console.log("Nested by type and then quarter", entriesNew);
//
//    // // Step 2 
//    // // need to bind the value of the selector to this, for now just use fixed data
//    // var setOne = entriesNew.find( d => d.key === "Numbers in Employment").values;
//    //     // .values.find(d => d.key === "2001Q1").values;// remove this after I figure step 3
//
//    // console.log("Employment Only type", setOne);
//
//    // // step 3
//    // var objFull = [];
//    // setOne.forEach(d => {
//    //     var obj = {};
//    //         obj.quarter = d.key;
//    //         obj.type = d.values[0].type;
//    //         obj.date = d.values[0].date;
//
//    //     //step 4 
//    //     var objCombined = d.values.reduce((obj, item) => (obj[item.region] = item.value, obj) ,{});
//
//    //     //merge the objects and push to the array
//    //     var objMerged = {...obj, ...objCombined}
//    //     objFull.push(objMerged);
//    // });
//
//    // console.log("merged the regions and values", objFull);
//
//    var dublin = entries.find( d => d.key === "Numbers in Employment").values.find(d => d.key === "Dublin");
//    var state = entries.find( d => d.key === "Numbers in Employment").values.find(d => d.key === "Ireland");
//    // console.log(dublin);
//
//    dublinData = dublin.values;
//    // console.log(dublinData);
//
//    stateData = state.values;
//    // console.log(stateData);
//
//// margins top: 50, right: 100, bottom: 50, left: 50
//var margin = {top: 50, right: 150, bottom: 100, left: 80},
//    width = 950 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;
//
//// get the Employment div chart-area and add svg 800x500
//var svg = d3.select("#chart-employment")
//    .append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom);
//
//
//var g = svg.append("g")
//        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//// For tooltip
//var bisectDate = d3.bisector(function(d) { return d.date; }).left;
//
//
//// Scales
//// set band scale
//var x = d3.scaleTime().range([0, width]);
//
//// set linear scale
//var y = d3.scaleLinear().range([height, 0]);
//var z = d3.scaleOrdinal(d3.schemeCategory10); 
//
//// Axis generators
//var xAxisCall = d3.axisBottom().ticks(16);
//var yAxisCall = d3.axisLeft()
//    .ticks(6);
//
//// Axis groups
//var xAxis = g.append("g")
//    .attr("class", "x axis")
//    .attr("transform", "translate(0," + height + ")");
//
//var yAxis = g.append("g")
//    .attr("class", "y axis")
//
//// Y-Axis label
//yAxis.append("text")
//    .attr("class", "axis-title")
//    .attr("transform", "rotate(-90)")
//    .attr("y", 6)
//    .attr("dy", ".71em")
//    .style("text-anchor", "end")
//    .attr("fill", "#5D6971");
//
//    // Line path generator
//var line = d3.line()
//    .curve(d3.curveBasis)
//    .x(function(d) { return x(d.date); })
//    .y(function(d) { return y(d.value); });
//
//// Set scale domains
//x.domain(d3.extent(dublinData, function(d) { return d.date; }));
//y.domain([0 , 2500]);
// 
//// Generate axes once scales have been set
// xAxis.call(xAxisCall.scale(x));
// yAxis.call(yAxisCall.scale(y));
//
//
//// Add line to chart
//var groupchart1 = g.append("g")
//    .attr("class", "group-1");
//
//var groupchart2 = g.append("g")
//    .attr("class", "group-2");
//
//groupchart1.append("path")
//    .attr("class", "line")
//    .attr("fill", "none")
//    .attr("stroke", "#3182bd")
//    .attr("stroke-width", "2px")
//    .attr("d", line(dublinData));	
//
//groupchart2.append("path")
//    .attr("class", "line")
//    .attr("fill", "none")
//    .attr("stroke", "#3182bd")
//    .attr("stroke-width", "2px")
//    .attr("d", line(stateData));
//
///* 
//tooltip
//*/
//
//var tooltipList = g.append("g")
//        .attr("class", "tool-tip-list");
//
//tooltipList.append("line")
//    .attr("class", "x-hover-line hover-line")
//    .attr("y1", 0)
//    .attr("y2", height)
//    .style("display", "none");
//
//tooltipList.append("line")
//    .attr("class", "y-hover-line hover-line")
//    .attr("x1", 0)
//    .attr("x2", width)
//    .style("display", "none");
//
//tooltipList.selectAll("dot")	
//    .data(dublinData)			
//    .enter().append("circle")
//    .attr("class", "dot")								
//    .attr("r", 6)
//    .attr("fill", "#3182bd")
//    .attr("fill-opacity", "1e-06")
//    .attr("stroke-opacity", "1e-06")		
//    .attr("cx", function(d) { return x(d.date); })		 
//    .attr("cy", function(d) { return y(d.value); })
//    .on("mouseover", mouseover)
//    .on("mouseout", mouseout)
//    .on("mousemove", mousemove);	
//
//tooltipList.append("text")
//    .attr("x", 15)
//    .attr("dy", ".31em");
//
//    tooltipList.selectAll("dot")	
//    .data(stateData)			
//    .enter().append("circle")
//    .attr("class", "dot")								
//    .attr("r", 6)
//    .attr("fill", "#3182bd")
//    .attr("fill-opacity", "1e-06")
//    .attr("stroke-opacity", "1e-06")		
//    .attr("cx", function(d) { return x(d.date); })		 
//    .attr("cy", function(d) { return y(d.value); })
//	
//
//tooltipList.append("text")
//    .attr("x", 15)
//    .attr("dy", ".31em");
//
//function mouseover() {
//    d3.select(this).attr("fill-opacity", "0.8");
//    tooltipList.select(".x-hover-line").style("display", null);
//    tooltipList.select(".y-hover-line").style("display", null);
//    tooltipList.select("text").style("display", null);
//}
//
//function mouseout() {
//    d3.select(this).attr("fill-opacity", "1e-06");
//    tooltipList.select(".x-hover-line").style("display", "none");
//    tooltipList.select(".y-hover-line").style("display", "none");
//    tooltipList.select("text").style("display", "none");
//}
//
//function mousemove() {
//    var x0 = x.invert(d3.mouse(this)[0]),
//        i = bisectDate(dublinData, x0, 1),
//        d0 = dublinData[i - 1],
//        d1 = dublinData[i];
//        // fix out of range issue
//        d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;
//
//    tooltipList.select(".x-hover-line").attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
//    tooltipList.select(".y-hover-line").attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
//    tooltipList.select("text").text("Value: " + d.value + " Quarter: " + d.quarter);
//    tooltipList.select(".x-hover-line").attr("y2", height - y(d.value));
//    tooltipList.select(".y-hover-line").attr("x2", -x(d.date));
//}
//
//})
//// catch any error and log to console
//    .catch(function(error){
//    console.log(error);
//});
//
//function join(lookupTable, mainTable, lookupKey, mainKey, select) {
//    
//    var l = lookupTable.length,
//        m = mainTable.length,
//        lookupIndex = [],
//        output = [];
//    
//    for (var i = 0; i < l; i++) { // loop through the lookup array
//        var row = lookupTable[i];
//        lookupIndex[row[lookupKey]] = row; // create a index for lookup table
//    }
//    
//    for (var j = 0; j < m; j++) { // loop through m items
//        var y = mainTable[j];
//        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
//        output.push(select(y, x)); // select only the columns you need
//    }
//    
//    return output;
//}