class MultiLineChart{

    constructor (_Element, _titleX, _titleY){
        this.Element = _Element;
        this.titleX = _titleX;
        this.titleY = _titleY;

        this.init();
    }

    // initialise method to draw chart area
    init(){
        var dv = this;

        // console.log(dv.variable);

        // margin
        dv.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        // dimension settings - need to adjust these based on parent size
        dv.height = 500 - dv.margin.top - dv.margin.bottom;
        dv.width = 900 - dv.margin.left - dv.margin.right;
        
        // add the svg to the target element
        dv.svg = d3.select(dv.Element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = dv.svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");
        
        // set transition variable
        dv.t = function() { return d3.transition().duration(1000); };

        dv.colour = d3.scaleOrdinal(d3.schemeBlues[9]);
        
        // for the tooltip from the d3 book
        dv.bisectDate = d3.bisector(function(d) { return d.date; }).left;

        // set scales
        dv.x = d3.scaleTime()
            .range([0, dv.width]);

        dv.y = d3.scaleLinear()
            .range([dv.height, 0]);

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
        dv.g.append("text")
            .attr("x", - (height/2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);

        dv.addLegend();
        
        dv.getData();

    }

    getData(){
        var dv = this;

        // 1. get select value
        dv.variable = $("#multi-select").val();
        // console.log("the variable is", dv.variable);

        // 2. add the value of the selector to the object array
        dv.filteredData = multilineData.map( d => {
            d.selectvalue = d[dv.variable]; 
            return d; 
        });
        // console.log("filtered data", dv.filteredData);

        // 3. nest and group data by region
        dv.regionData = d3.nest()
            .key(function(d){ return d.region; })
            .entries(dv.filteredData);
        // console.log("nested data", dv.regionData);

        dv.update();
    }

    update(){
        var dv = this;

        // Update scales
        dv.x.domain(d3.extent(dv.regionData[0].values, function(d) {return parseTime(d.quarter); }));
        
        // Set axis scales
        dv.y.domain([
          d3.min(dv.regionData, function (d) {
            return d3.min(d.values, function (d) { return d.selectvalue; });
          }),
          d3.max(dv.regionData, function (d) { 
            return d3.max(d.values, function (d) { return d.selectvalue; });
          })
        ]);

        // Update axes
        dv.xAxisCall.scale(dv.x);
        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);
        dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);

        // TO DO: Add ToolTip

         // TO DO: Update y-axis label based on selector

         // d3 line function
        dv.line = d3.line()
            .x(function(d) {
                return dv.x(parseTime(d.quarter)); 
            })
            .y(function(d) { //this works
                return dv.y(d.selectvalue); 
            })
            .curve(d3.curveBasis);
        
        // select all regions and join data
        dv.regions = dv.g.selectAll(".regions")
            .data(dv.regionData);
        
        // update the paths
        dv.regions.select(".line")
            .transition(dv.t)
            .attr("d", function (d) { console.log(d.values); return dv.line(d.values); });
        
        // Enter elements
        dv.regions.enter().append("g")
            .attr("class", "regions")
            .append("path")
            .attr("class", "line")
            // When implementing clickable legend
            //.attr("d", function(d) { return d.visible ? dv.line(d.values) : null;})
            .attr("d", function (d) { return dv.line(d.values); })
            .style("stroke", function (d) { return dv.colour(d.key); })
            .style("stroke-width", "1px")
            .style("fill", "none");  
        
        // dv.regions.transition(dv.t)
        //     .attr("d", function (d) { return dv.line(d.values); });
            
        dv.regions.exit()
            .transition(dv.t).remove();

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