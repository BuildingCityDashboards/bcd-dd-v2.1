// var section = d3.select("#economy");
// var article = d3.select("#income_poverty", section);

// load csv data and turn value into a number
d3.csv("../data/Economy/IncomeAndLivingData.csv").then(function(data){
    // blank array
    var transposedData = [];
    data.forEach(d => {
        for (var key in d) {
            var obj = {};
            if (!(key === "type" || key === "region")){
            d[key] = +d[key];
            obj.type = d.type;
            obj.region = d.region;
            obj.year = key;
            obj.value = d[key];
            transposedData.push(obj);
          }
          else{ d[key] = d[key];}
        }
    });
    // using filter to just get the poverty data
    povertData = transposedData.filter(d => {
        return (d.region === "Dublin" && (d.type ==="At Risk of Poverty Rate (%)" || d.type ==="Consistent Poverty Rate (%)" || d.type ==="Deprivation Rate (%)"));
    });

    console.log(povertData);

    console.log(transposedData.filter(d => {
        return (d.region === "Dublin" && d.type ==="Median Real Household Disposable Income (Euro)");
    }));

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
    console.log(data);
    // blank array
    var transposedData = [];
    data.forEach(d => {
        for (var key in d) {
            var obj = {};
            if (!(key === "type" || key === "region")){
            d[key] = +d[key];
            obj.type = d.type;
            obj.region = d.region;
            obj.quarter = key;
            obj.value = d[key];
            transposedData.push(obj);
          }
          else{ d[key] = d[key];}
        }
    });

// margins
var margin = {top: 50, right: 20, bottom: 100, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// get the div cart-area and add svg 400 x400
var g = d3.select("#chart-employment")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x label
    g.append("text")
        .attr("x", width/2)
        .attr("y", height + 70)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Numbers of Employment in Dublin");
    
     // y label
    g.append("text")
        .attr("x", - (height/2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Persons (000s)");

    // set band scale
    var x = d3.scaleBand().domain(
        transposedData.map((d)=>{ return d.quarter; })
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
        .call(xAxis)
        .selectAll("text")
        .attr("y", "-5")
        .attr("x", "-10")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)");

    // y axis
    var yAxis = d3.axisLeft(y)
        .tickFormat((d) => {return d;});
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // select all rectangles and associate with the data
//     var rects = g.selectAll("rect")
//         .data(transposedData.filter(d => {
//             return (d.region === "Dublin" && d.type ==="Numbers in Employment");
//         }
//     ))
//         .enter()
//         .append("rect")
//             .attr("x", (d) => {return x(d.quarter);})
//             .attr("y", (d) => {return y(d.value);})
//             .attr("width", x.bandwidth)
//             .attr("height", (d) =>{return height - y(d.value);})
//             .attr("fill", "#0570b0");
// 
})
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
});
