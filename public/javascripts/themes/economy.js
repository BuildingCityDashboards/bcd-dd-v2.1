// var section = d3.select("#economy");
// var article = d3.select("#income_poverty", section);

// load csv data and turn value into a number
d3.csv("../data/Economy/IncomeAndLivingData.csv").then(function(data){
    // console.log(data);
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

    // console.log(transposedData);
    // using filter to just get the poverty data
    povertData = transposedData.filter(d => {
        return (d.region === "Dublin" && (d.type ==="At Risk of Poverty Rate (%)" || d.type ==="Consistent Poverty Rate (%)" || d.type ==="Deprivation Rate (%)"));
    });

    // console.log(povertData);

    // console.log(transposedData.filter(d => {
    //     return (d.region === "Dublin" && d.type ==="Median Real Household Disposable Income (Euro)");
    // }));

// margins
var margin = {top: 50, right: 20, bottom: 100, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// get the div cart-area and add svg 400 x400
var g = d3.select(".chart-test")
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
    // g.append("text")
    //     .attr("x", - (height/2))
    //     .attr("y", -60)
    //     .attr("font-size", "20px")
    //     .attr("text-anchor", "middle")
    //     .attr("transform", "rotate(-90)")
    //     .text("Euros");

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
        .attr("fill", "#0570b0");

    
    var chart2 = d3.select(".chart-test2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        //  x label
        chart2.append("text")
            .attr("x", width/2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("At Risk of Poverty Rate");
        
         // y label
        // g.append("text")
        //     .attr("x", - (height/2))
        //     .attr("y", -60)
        //     .attr("font-size", "20px")
        //     .attr("text-anchor", "middle")
        //     .attr("transform", "rotate(-90)")
        //     .text("Euros");
    
        // set band scale
        var x2 = d3.scaleBand().domain(
            transposedData.map((d)=>{ return d.year; })
            ).range([0, width])
            .paddingInner(.2)
            .paddingOuter(.2);
        
        // set linear scale
        var y2 = d3.scaleLinear()
            .domain([0, 100
            //     d3.max(povertData, (d)=>{ 
            // return d.value;    
            //     })
            ])
            .range([height, 0]); 
    
        // x axis
        var xAxis = d3.axisBottom(x2);
        chart2.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0, " + height +")")
            .call(xAxis);
    
        // y axis
        var yAxis = d3.axisLeft(y2)
            .tickFormat((d => {return d + "%";}));
        chart2.append("g")
            .attr("class", "y-axis")
            .call(yAxis);
        
        // Bars
        // select all rectangles and associate with the data
        var rects2 = chart2.selectAll("rect")
            .data(transposedData.filter(d => {
                return (d.region === "Dublin" && d.type ==="At Risk of Poverty Rate (%)");
            }
        ))
            .enter()
            .append("rect")
                .attr("x", (d) => {return x2(d.year);})
                .attr("y", (d) => {return y2(d.value);})
                .attr("width", x.bandwidth)
                .attr("height", (d) =>{return height - y2(d.value);})
                .attr("fill", "#0570b0");
})
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
});
// load csv data and turn value into a number
d3.csv("../data/Economy/employment.csv").then(function(data){
    
    // console.log(data);
    
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

    // var transposedData = [];
    // data.forEach(d => {
    //     // 54 ds
    //     var objParen = {};
    //         objParen.region = d.region;
    //         objParen.type = d.type;
    //         objParen.values = [];
    //     for (var key in d) {
    //          //81 keys
    //         // create new object
    //         var objChild = {};
    //         // as ling
    //         if (!(key === "type" || key === "region")){
    //             objChild.year = key;
    //             objChild.value = +d[key];
    //             objParen.values.push(objChild); 
    //         }
    //     }
    //     transposedData.push(objParen);
    // });


    dublinData = (transposedData.filter( d => d.region === "Dublin" && d.type === "Numbers in Employment"));
        console.log(dublinData);

    stateData = (transposedData.filter( d => d.region === "Ireland" && d.type === "Numbers in Employment"));
        console.log(stateData);

// margins
var margin = {top: 50, right: 100, bottom: 100, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// get the div cart-area and add svg 400 x400
var svg = d3.select("#chart-employment").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var g = svg.append("g")
        .attr("transform", "translate(" + margin.left +
            "," + margin.top + ")");

var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Scales
// set band scale
var x = d3.scaleTime().range([0, width]);

// set linear scale
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleOrdinal(d3.schemeCategory10); 

// Axis generators
var xAxisCall = d3.axisBottom()
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
    .attr("stroke", "grey")
    .attr("stroke-width", "2px")
    .attr("d", line(dublinData));

// Add line to chart
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
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
        d1 = dublinData[i],
        d = (x0 - d0.date) > (d1.date - x0) ? d1 : d0;

// need to add error catcher
    
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