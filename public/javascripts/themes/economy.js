    // var section = d3.select("#economy");
    // var article = d3.select("#income_poverty", section);


    // margins top: 50, right: 100, bottom: 50, left: 50
    var margin = {top: 50, right: 150, bottom: 100, left: 80},
        width = 950 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // load csv data and turn value into a number
    d3.csv("../data/Economy/IncomeAndLivingData.csv").then(function(data){

    var tooltip = d3.select('#chart1')
    .append('div')  
    .attr('class', 'tool-tip');    
    
    console.log(data);
    
    var keys = data.columns;
    console.log(keys);

    // blank array
    var transposedData = [];
    data.forEach(d => {
        for (var key in d) {
            // console.log(key);
            var obj = {};
            if (!(key === "type" || key === "region")){
            obj.type = d.type;
            obj.region = d.region;
            obj.year = key;
            obj.value = +d[key];
            transposedData.push(obj);
        }}
    });

    // get the div cart-area and add svg 400 x400
    var g = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x label
    g.append("text")
        .attr("x", width/2)
        .attr("y", height + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Median Real Household Disposable Income");
    
     // y label
    g.append("text")
        .attr("x", - (height/2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Euros");

    // set band scale
    var x = d3.scaleBand().domain(
        transposedData.map((d)=>{ return d.year; })
        ).range([0, width])
        .paddingInner(.2)
        .paddingOuter(.2);
    
    // set linear scale
    var y = d3.scaleLinear()
        .domain([0, d3.max(transposedData, (d)=>{ 
        return d.value;    
        })])
        .range([height, 0]); 

    // x axis
    var xAxis = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + height +")")
        .call(xAxis);

    // y axis
    var yAxis = d3.axisLeft(y)
        .tickFormat((d => {return "€" + d3.format(".1s")(d);}));
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
    
    // Bars
    // select all rectangles and associate with the data
    var rects = g.selectAll("rect")
        .data(transposedData.filter(d => {
            return (d.region === "Dublin" && d.type ==="Median Real Household Disposable Income (Euro)");
        }
    ))
    .enter()
    .append("rect")
        .attr("x", (d) => {return x(d.year);})
        .attr("y", (d) => {return y(d.value);})
        .attr("width", x.bandwidth)
        .attr("height", (d) =>{return height - y(d.value);})
        .attr("fill", "#3182bd")
        .on( 'mouseover', function( d ){
            var dx  = parseFloat(d3.select(this).attr('x')) + x.bandwidth(); 
            var dy  = parseFloat(d3.select(this).attr('y')) + 10;
            tooltip
                .style( 'left', dx + "px" )
                .style( 'top', dy + "px" )
                .style( 'display', 'block' )
                .text("The value is: €" + d.value);
        })
        .on( 'mouseout', function(){
            tooltip
                .style( 'display', 'none' );
        });
        // .append("title")
        // .text( d=> {
        //     return ("The value is : €" + d.value);
        // }); // simple just using the title feature    
        // .on("mouseover", tooltipOver)
        // .on("mousemove", function(d){tooltipMove(d);})
        // .on("mouseout", tooltipOut);

/* 

*** End of Disposable Income chart *** 

*/

    //  At Risk of Poverty Rate
    var chart2 = d3.select("#chart2")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
    var tooltip2 = d3.select('#chart2')
        .append('div')  
        .attr('class', 'tool-tip');  

    g = chart2
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //  x label
    g.append("text")
        .attr("x", width/2)
        .attr("y", height + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Stacked Bar Chart");
    
    // y label
    g.append("text")
        .attr("x", - (height/2))
        .attr("y", -40)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("%");

    //set scales
    var x2 = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.3)
        .align(0.3);    

    var y2 = d3.scaleLinear()
        .rangeRound([height, 0]);

    var colour = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // x axis
    var xAxis2 = d3.axisBottom(x2);

    // y axis
    var yAxis2 = d3.axisLeft(y2);
    
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis2);

    // manual categories - replace with dynamic
    var xData = ["risk", "poverty", "deprivation"];

    var newList = d3.nest()
        .key(d => { return d.region })
        .key(d => { return d.type })
        .entries(transposedData);

    var risk = newList.find( d => d.key === "Dublin").values.find(d => d.key === "At Risk of Poverty Rate (%)").values,
        poverty = newList.find( d => d.key === "Dublin").values.find(d => d.key === "Deprivation Rate (%)").values,
        deprivation = newList.find( d => d.key === "Dublin").values.find(d => d.key === "Consistent Poverty Rate (%)").values;

    // console.log(risk);

    // join risk and poverty
    var test = join( poverty, risk, "year", "year", function(risk, poverty) {
        return {
            year: risk.year,
            region: risk.region,
            risk: risk.value,
            poverty: poverty.value
        };
    });

    // join test with deprivation
    var completeArray = join(deprivation, test, "year", "year", function(test, deprivation) {
        return {
            year: test.year,
            region: test.region,
            risk: test.risk,
            poverty: test.poverty,
            deprivation: deprivation.value
        };
    });
    
    // console.log(completeArray);

    var stack = d3.stack()
        .keys(xData)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var series = stack(completeArray);

    x2.domain(completeArray.map(function (d) {
        return d.year;
    }));            

    y2.domain([0,
        d3.max(series[series.length - 1],function (d) { return d[0] + d[1];})]).nice();
    //replace with commented out section when loading data.
    colour.domain(xData);
    //colour.domain(sample.columns.slice(1));

    console.log(series);

    var layer = g.selectAll(".stack")
        .data(series)
        .enter().append("g")
        .attr("class", "stack")
        .attr("fill", function(d) { return colour(d.key); });

    layer.selectAll("rect")
        .data(function (d) {return d;})
        .enter().append("rect")
            .attr("x", function (d) {return x2(d.data.year);})
            .attr("y", function(d) { return y2(d[1]); })
            .attr("height", function(d) { return y2(d[0]) - y2(d[1]); })
            .attr("width", x2.bandwidth())
            .on( 'mouseover', function( d ){
                var dx  = parseFloat(d3.select(this).attr('x')) + x.bandwidth(); 
                var dy  = parseFloat(d3.select(this).attr('y')) + 10;
                tooltip2
                    .style( 'left', dx + "px" )
                    .style( 'top', dy + "px" )
                    .style( 'display', 'block' )
                    .text(d[1]-d[0]);
            })
            .on( 'mouseout', function(){
                tooltip2
                    .style( 'display', 'none' );
            });

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + height +")")
        .call(xAxis2);

    var legend = g.selectAll(".legend")
        .data(xData.reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .style("font", "10px sans-serif");
      
    legend.append("rect")
        .attr("x", width + 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colour);
    
    legend.append("text")
        .attr("x", width + 44)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text(function(d) { return d; });

    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
});

// Employment Figures Charts

// load csv data and turn value into a number
d3.csv("../data/Economy/employment.csv").then(function(data){

    var keys = data.columns.slice(1);

    var transposedData = [];
    data.forEach(d => {
        for (var key in d) {
            // console.log(key);
            var obj = {};
            if (!(key === "type" || key === "region")){
                obj.type = d.type;
                obj.region = d.region;
                obj.quarter = key;
                splitted = key.split('Q');
                quarterEndMonth = splitted[1] * 3 - 2;
                obj.date =  d3.timeParse('%m %Y')(quarterEndMonth + ' ' + splitted[0]);
                obj.value = +d[key];
                transposedData.push(obj);
        }}
    });

    var entries = d3.nest()
        .key(d => { return d.type })
        .key(d => { return d.region })
        .entries(transposedData);
    
    // console.log(entries);
    
    var dublin = entries.find( d => d.key === "Numbers in Employment").values.find(d => d.key === "Dublin");
    var state = entries.find( d => d.key === "Numbers in Employment").values.find(d => d.key === "Ireland");
    // console.log(dublin);

    dublinData = dublin.values;
        // console.log(dublinData);

    stateData = state.values;
        // console.log(stateData);

// margins top: 50, right: 100, bottom: 50, left: 50
var margin = {top: 50, right: 150, bottom: 100, left: 80},
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// get the Employment div chart-area and add svg 800x500
var svg = d3.select("#chart-employment")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// For tooltip
var bisectDate = d3.bisector(function(d) { return d.date; }).left;




// Scales
// set band scale
var x = d3.scaleTime().range([0, width]);

// set linear scale
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleOrdinal(d3.schemeCategory10); 

// Axis generators
var xAxisCall = d3.axisBottom().ticks(16);
var yAxisCall = d3.axisLeft()
    .ticks(6);

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

var yAxis = g.append("g")
    .attr("class", "y axis")

// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971");

    // Line path generator
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

// Set scale domains
x.domain(d3.extent(dublinData, function(d) { return d.date; }));
y.domain([0 , 2500]);
 
// Generate axes once scales have been set
 xAxis.call(xAxisCall.scale(x));
 yAxis.call(yAxisCall.scale(y));


// Add line to chart
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#3182bd")
    .attr("stroke-width", "2px")
    .attr("d", line(dublinData));

// Add the scatterplot
g.selectAll("dot")	
.data(dublinData)			
.enter().append("circle")								
.attr("r", 2)
.attr("fill", "#3182bd")		
.attr("cx", function(d) { return x(d.date); })		 
.attr("cy", function(d) { return y(d.value); });		
// .on("mouseover", function(d) {		
//     div.transition()		
//         .duration(200)		
//         .style("opacity", .9);		
//     div	.html(d.quater + "<br/>"  + d.vale)	
//         .style("left", (d3.event.pageX) + "px")		
//         .style("top", (d3.event.pageY - 28) + "px");	
//     })					
// .on("mouseout", function(d) {		
//     div.transition()		
//         .duration(500)		
//         .style("opacity", 0);	
// });

// Add line to chart
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#9ecae1")
    .attr("stroke-width", "2px")
    .attr("d", line(stateData));



/* 
tooltip
*/

var focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");

focus.append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

focus.append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", width);

focus.append("circle")
    .attr("r", 7.5);

focus.append("text")
    .attr("x", 15)
    .attr("dy", ".31em");

g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(dublinData, x0, 1),
        d0 = dublinData[i - 1],
        d1 = dublinData[i];

        d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;

    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    focus.select("text").text("Value: " + d.value + " Date: " + d.quarter);
    focus.select(".x-hover-line").attr("y2", height - y(d.value));
    focus.select(".y-hover-line").attr("x2", -x(d.date));
}

})
// catch any error and log to console
    .catch(function(error){
    console.log(error);
});

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    
    return output;
}


// function tooltipOver() {
//     div.style("display", "inline");
// }
  
// function tooltipMove(d) {
//     div
//         .text(d.value)
//         // .style("left", (d3.event.clientX) + "px")
//         .style("left", (d3.select(this).attr('y')) + "px")
//         .style("top", (d3.select(this).attr('y')) + "px");

//         console.log(d3.event.clientY);
//         console.log((d3.event.clientY / 2) + (height/2));
//         console.log(d3.event.clientY - height + 80);

// }
  
// function tooltipOut() {
//     div.style("display", "none");
// }
