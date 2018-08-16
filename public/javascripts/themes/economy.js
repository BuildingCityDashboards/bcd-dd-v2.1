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
d3.json("../data/Economy/QNQ22.json").then(function(data){
    
    var regions = data.dataset.dimension['NUTS 3 Regions'].category.label;
    var result = splitArray(data.dataset.value, data.dataset.dimension.size[1] * data.dataset.dimension.size[2] );
    // .filter( country => {
    //     var dataNotEmpty = (country.income && country.life_exp);
    //     return dataNotEmpty;

    var years = Object.values(data.dataset.dimension.Quarter.category.label)
        .map(function(d){
            var splitted = d.split('Q');
            // console.log(splitted);
            var year = splitted[0];
            // console.log(year);
            var quarterEndMonth = splitted[1] * 3 - 2;
            // console.log(quarterEndMonth);
            return d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year);
        });

    var quarterLabels = Object.values(data.dataset.dimension.Quarter.category.label);
    var types = data.dataset.dimension.Statistic.category.label;
    var dublin_values = result[4];
    var state_values = result[0];
    var employmentDublin = getNth(dublin_values, 5, 5);
    var unemploymentDublin = getNth(dublin_values, 5, 4);
    var employmentState = getNth(state_values, 5, 5);
    var unemploymentState = getNth(state_values, 5, 4);
    var groupData = [];
    for(var i in employmentState){
        groupData.push({y:employmentState[i],x:years[i],q:quarterLabels[i]});
    }
    
    var cleanData = groupData.filter(function(obj) { return obj.y != null });

    
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

var formatDate = d3.timeFormat("%m-%Y")
var bisectDate = d3.bisector(function(d) { return d.x; }).left;

// Scales
// set band scale
var x = d3.scaleTime().range([0, width]);
// set linear scale
var y = d3.scaleLinear().range([height, 0]); 

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
.x(function(d) { return x(d.x); })
.y(function(d) { return y(d.y); });

// Set scale domains
x.domain(d3.extent(cleanData, function(d) { return d.x; }));
y.domain([0 , 2500]);
z.domain(["Dublin", "State"]);
 
// Generate axes once scales have been set
 xAxis.call(xAxisCall.scale(x));
 yAxis.call(yAxisCall.scale(y));
 
// Add line to chart
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", "2px")
    .attr("d", line(cleanData));

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

function mousemove() {
var x0 = x.invert(d3.mouse(this)[0]),
    i = bisectDate(cleanData, x0, 1),
    d0 = cleanData[i - 1],
    d1 = cleanData[i],
    d = (x0 - d0.x) > (d1.x - x0) ? d1 : d0;
// need to add error catcher
focus.attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")");
focus.select("text").text("Value: " + d.y + " Date: " + d.q);
focus.select(".x-hover-line").attr("y2", height - y(d.y));
focus.select(".y-hover-line").attr("x2", -x(d.x));
}

})
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
});

function splitArray(valArray, split_size){
    var index = 0;
    var arrayLength = valArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += split_size) {
        arraySplit = valArray.slice(index, index+split_size);
        // Do something if you want with the group
        tempArray.push(arraySplit);
    }

    return tempArray;
}

const getNth = (arr, nth, offset) => arr.filter((e, i) => { 
    return ((i + offset) % nth === 0)});
