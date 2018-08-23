class StackedAreaChart {

    // constructor function
    constructor (_element, _titleX, _titleY){
        // load in arguments from config object
        this.element = _element;
        this.titleX = _titleX;
        this.titleY = _titleY;
        
        // create the chart
        this.init();
    }
    // initialise method to draw chart area
    init(){
        var dv = this;
        
        // this is getting repetitive
        dv.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        // need to get the width and height from the element
        dv.height = 500 - dv.margin.top - dv.margin.bottom;
        // dv.width = (dv.element.offsetWidth) - dv.margin.left - dv.margin.right;
        dv.width = 900 - dv.margin.left - dv.margin.right;

        // select parent element and append SVG + g
        dv.svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);

        dv.g = dv.svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");

        // transition 
        dv.t = () => { return d3.transition().duration(1000); };

        dv.colour = d3.scaleOrdinal(d3.schemeBlues[9]);

        // set scales
        dv.x = d3.scaleTime().range([0, dv.width]);
        dv.y = d3.scaleLinear().range([dv.height, 0]);

        dv.yAxisCall = d3.axisLeft();
        dv.xAxisCall = d3.axisBottom();

        dv.xAxis = dv.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dv.height +")");

        dv.yAxis = dv.g.append("g")
            .attr("class", "y axis");

        // X title
        dv.g.append("text")
            .attr("class", "title")
            .attr("x", width/2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.titleX);

        // Y title

        // d3 stack function
        dv.stack = d3.stack()
            .keys(nut3regions);

        // d3 area function
        dv.area = d3.area()
            .x(function(d) { return dv.x(parseTime(d.data.date))})
            .y0(function(d) { return dv.y(d[0]); })
            .y1(function(d) { return dv.y(d[1]); });

        // call the legend method
        dv.addLegend();

        // call the getdata method
        dv.getData();
    }

    getData(){
        var dv = this;

        dv.variable = $("#chart-select").val();
        // console.log(dv.variable);

        // 1. nest the data by quarter
        dv.quarterNest = d3.nest()
            .key(function(d){ return d.quarter; })
            .entries(stackData);

        // console.log(dv.quarterNest);

        // 2. filter the values by select variable
        dv.dataFiltered = dv.quarterNest
        .map(function(q){
            return q.values.reduce(function(accumulator, current){
                accumulator.date = q.key
                accumulator[current.region] = accumulator[current.region] + current[dv.variable]
                return accumulator;
            }, {
                "Border": 0,
                "Midland": 0,
                "Mid-East": 0,
                "Mid-West": 0,
                "South-East": 0,
                "South-West": 0,
                "West": 0,
                "Dublin": 0,
                "Ireland": 0
            });
        });

        // console.log("filtered data stack",dv.dataFiltered);

        dv.update();
    }

    update(){
        var dv = this;

        // get the the combined max value for the y scale
        dv.maxDateVal = d3.max(dv.dataFiltered, function(d){
            var vals = d3.keys(d).map(function(key){ 
                return key !== 'date' ? d[key] : 0 
            });
            return d3.sum(vals);
        });

        // Update scales
        dv.x.domain(d3.extent(dv.dataFiltered, (d) => {  return parseTime(d.date); }));
        dv.y.domain([0, dv.maxDateVal]);

        // Update axes
        dv.xAxisCall.scale(dv.x);
        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);
        dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);

        // select all regions and join data with old
        dv.regions = dv.g.selectAll(".region")
            .data(dv.stack(dv.dataFiltered));
        // console.log(dv.stack(dv.dataFiltered));
        
        // Exit old elements not present in new data.
        // dv.regions.exit()
        //     .transition(dv.t)
        //     .attr("y", y(0))
        //     .attr("height", 0)
        //     .remove();

        // update the paths
        dv.regions.select(".area")
            .transition(dv.t)
            .attr("d", dv.area)

        // Enter elements
        dv.regions.enter().append("g")
            .attr("class", function(d){ return "region " + d.key })
            .append("path")
                .attr("class", "area")
                // .transition(dv.t)
                .attr("d", dv.area)
                .style("fill", function(d){
                    return dv.colour(d.key)
                })
                .style("fill-opacity", 0.5)
    }

    addLegend(){
        var dv = this;

        // create legend group
        var legend = dv.g.append("g")
            .attr("transform", "translate(" + (-50) + 
                        ", " + (0) + ")"); // if the legend needs to be moved

        // create legend array, this needs to come from the data.
        var legendArray = [
            {label: "Border", colour: dv.colour("Border")},
            {label: "Midland", colour: dv.colour("Midland")},
            {label: "West", colour: dv.colour("West")},
            {label: "Dublin", colour: dv.colour("Dublin")},
            {label: "Mid-East", colour: dv.colour("Mid-East")},
            {label: "Mid-West", colour: dv.colour("Mid-West")},
            {label: "South-East", colour: dv.colour("South-East")},
            {label: "South-West", colour: dv.colour("South-West")},
            {label: "Ireland", colour: dv.colour("Ireland")}
        ];

        // get data and enter onto the legend group
        var legend = legend.selectAll(".legend")
            .data(legendArray.reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; })
            .style("font", "12px sans-serif");
        
        // add legend boxes    
        legend.append("rect")
            .attr("class", "legendRect")
            .attr("x", width + 25)
            // style similar to hospital legend
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.5);
        
        // add legend text
        legend.append("text")
            .attr("class", "legendText")
            .attr("x", width + 60)
            .attr("y", 12)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(d => { return d.label; }); 
    }

}



