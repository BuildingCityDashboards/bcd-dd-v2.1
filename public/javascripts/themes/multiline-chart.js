class MultiLineChart{

    constructor (_Element, _titleX, _titleY, _yLabels){
        this.element = _Element;
        this.titleX = _titleX;
        this.titleY = _titleY;
        this.yLabels = _yLabels;

        this.init();
    }

    // initialise method to draw chart area
    init(){
        let dv = this;

        // margin
        dv.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        // dimension settings - need to adjust these based on parent size
        let height = 500 - dv.margin.top - dv.margin.bottom;
        let width = 900 - dv.margin.left - dv.margin.right;
        
        // add the svg to the target element
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", width + dv.margin.left + dv.margin.right)
            .attr("height", height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");
        
        // set transition variable
        dv.t = function() { return d3.transition().duration(1000); };

        // dv.colour = d3.scaleOrdinal(d3.schemeBlues[9]);
        
        dv.colour = d3.scaleOrdinal(["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8","#003d68"]);

        // for the tooltip from the d3 book
        dv.bisectDate = d3.bisector(function(d) { return d.date; }).left;

        // set scales
        dv.x = d3.scaleTime()
            .range([0, width]);

        dv.y = d3.scaleLinear()
            .range([height, 0]);

        dv.yAxisCall = d3.axisLeft();

        dv.xAxisCall = d3.axisBottom();

        dv.xAxis = dv.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height +")");
        
        dv.yAxis = dv.g.append("g")
            .attr("class", "y axis");

        // X title
        dv.xLabel = dv.g.append("text")
            .attr("class", "xtitle")
            .attr("x", width/2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.titleX);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "ytitle")
            .attr("x", - (height/2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);

        dv.addLegend();
        // dv.addSelectForm();
        
        dv.getData();

    }

    getData(){
        let dv = this;
        
        // 1. get select value
        // dv.variable = $("#multi-select").val();

        dv.variable = $(".series1").val();
        // console.log("the variable is", dv.variable);

        // 2. add the value of the selector and parse date to the object array
        dv.filteredData = multilineData.map( d => {
            d.selectvalue = d[dv.variable];
            d.date = parseTime(d.quarter); 
            // d.active = d.region === "Dublin" ? true : false;
            return d; 
        });
        console.log("filtered data", dv.filteredData);

        // 3. nest and group data by region
        dv.regionData = d3.nest()
            .key(function(d){ return d.region;})
            .entries(dv.filteredData);
        
            console.log("nested data", dv.regionData);

        // dv.regionData.map( d => {
        //     return d.active = d.key === "Dublin" ? true : false;
        // });

        dv.update();
    }

    update(){
        let dv = this;
        d3.select(dv.element).select(".focus").remove();
        d3.select(dv.element).select(".focus_overlay").remove();

        // console.log("this should be just the focus in the multiLine chart: ", check);
        // console.log("this should not be here", d3.select(".focus"));
        // d3.select(".focus").remove();
        // d3.select(dv.focus).remove(); // just this objects focus element
        
        // TO DO: Add ToolTip
        // 1. remove all the instances of tooltip lines, circles, text


        // Update scales
        dv.x.domain(d3.extent(dv.regionData[0].values, function(d) {return parseTime(d.quarter); }));
        
        // Set axis scales
        dv.y.domain([0,
        //   d3.min(dv.regionData, function (d) {
        //     return d3.min(d.values, function (d) { return d.selectvalue; });
        //   }),
          d3.max(dv.regionData, function (d) { 
            return d3.max(d.values, function (d) { return d.selectvalue; });
          })
        ]);

        // Update axes
        dv.xAxisCall.scale(dv.x);
        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);
        dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);

         // Done: Update x-axis label based on selector
        dv.xLabel.text(dv.variable);

        // Done: Update y-axis label based on selector
        var selectorKey = keys.findIndex( d => {  return d === this.variable });
        // console.log("selector key", selectorKey);
        var newYLabel = dv.yLabels[selectorKey];
        
        dv.yLabel.text(newYLabel);

         // d3 line function
        dv.line = d3.line()
            .x(function(d) {
                return dv.x(parseTime(d.quarter)); 
            })
            .y(function(d) { //this works
                return dv.y(d.selectvalue); 
            });
            // .curve(d3.curveBasis);
        
        // 2. add the on mouseover and on mouseout to the joined data

        // select all regions and join data
        dv.regions = dv.g.selectAll(".regions")
            .data(dv.regionData);
        
        // update the paths
        dv.regions.select(".line")
            .transition(dv.t)
            .attr("d", function (d) { return dv.line(d.values); });
            // .attr("d", function(d) { 
            //     return d.active ? dv.line(d.values) : null; });
        
        // Enter elements
        dv.regions.enter().append("g")
            .attr("class", "regions")
            .append("path")
            .attr("class", "line")
            .attr("id", d => d.key)
            .attr("lineId", d => d.key)
            .attr("d", d => { return dv.line(d.values); })
            // .attr("d", function(d) { 
            //     return d.active ? dv.line(d.values) : null; })
            .style("stroke", d => { return dv.colour(d.key); })
            .style("stroke-width", "1px")
            .style("fill", "none");  
        
        // dv.regions.transition(dv.t)
        //     .attr("d", function (d) { return dv.line(d.values); });
            
        dv.regions.exit()
            .transition(dv.t).remove();

        // tooltip based on the example in the d3 Book

        // add group to contain all the focus elements
        let focus = dv.g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        // console.log(nut3regions);
        
        // attach group append circle and text for each region
        nut3regions.forEach( d => {
            // console.log(tooltip[d]);
            console.log(dv.colour(d));

            let tooltip = focus.append("g")
                .attr("class", "tooltip_" + d);

            tooltip.append("circle")
                .attr("r", 5)
                .attr("fill", "white")
                .attr("stroke", dv.colour(d));

            tooltip.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");
            
            // console.log(dv.tooltip);

        });

        // Year label
        focus.append("text")
            .attr("class", "focus_quarter")
            .attr("x", 9)
            .attr("y", 7);
        
        // Focus line
        focus.append("line")
            .attr("class", "focus_line")
            .attr("y1", 0)
            .attr("y2", height);

        // append a rectangle overlay to capture the mouse
        dv.g.append("rect")
            .attr("class", "focus_overlay")
            .attr("width", width - 25) // minus the width of the legend
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => { focus.style("display", null); })
            .on("mouseout", () => { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove(){

            let mouse = d3.mouse(this);

            dv.regionData.forEach(reg => {
                
                // console.log(reg.values);

                // this is from the d3 book
                let x0 = dv.x.invert(mouse[0]),
                i = dv.bisectDate(reg.values, x0, 1),
                d0 = reg.values[i - 1],
                d1 = reg.values[i],
                d;  

                // console.log("x0 is", x0);
                // console.log("should return a number", i);

                d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;
                
                let id = ".tooltip_" + reg.key;
                // console.log("tool tip to select #",id);

                let tooltip = d3.select(dv.element).select(id); 
                
                if(d !== undefined){
                    tooltip.attr("transform", "translate(" + dv.x(parseTime(d.quarter)) + "," + dv.y(d.selectvalue) + ")");

                    tooltip.select("text").text(d.selectvalue);
                }
            });
        }
    }

    addLegend(){
        let dv = this;

        // create legend group
        var legend = dv.g.append("g")
            .attr("transform", "translate(" + (-50) + 
                        ", " + (0) + ")"); // if the legend needs to be moved

        // create legend array, this needs to come from the data.
        var legendArray = [
            {label: "Dublin", colour: dv.colour("Dublin")},
            {label: "Ireland", colour: dv.colour("Ireland")}
        ];

        // var legendArray = dv.regionData;
        // console.log(legendArray);

        // get data and enter onto the legend group
        var legend = legend.selectAll(".legend")
            .data(legendArray.reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; })
            .style("font", "12px sans-serif");

        // // get data and enter onto the legend group
        // legend = legend.selectAll(".legend")
        //     .data(dv.regionData)
        //     .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; })
        //     .style("font", "12px sans-serif");
        
        // add legend boxes    
        legend.append("rect")
            .attr("class", "legendRect")
            .attr("x", width + 25)
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.5);

        legend.append("text")
            .attr("class", "legendText")
            .attr("x", width + 60)
            .attr("y", 12)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(d => { return d.label; }); 
    }


            // // taking from the d3 book
            // .on("click", d => {
            //     console.log(d);
            //     var active   = d.active ? false : true,
            //     newOpacity = active ? 1 : 0; 
            //     console.log("active", active);
            //     console.log("opactiy", newOpacity);
            //     // Hide or show the elements based on the ID
            //     d3.select("#"+d.label)
            //         .transition().duration(100) 
            //         .style("opacity", newOpacity); 
            //     d3.select(dv.element).select(".tooltip_"+d.label)
            //         .transition().duration(100) 
            //         .style("opacity", newOpacity);

            //     // Update whether or not the elements are active
            //     d.active = active;
            //     });

        // add legend text
    
    // addSelectForm(){
    //     var dv = this

    //     dv.list = d3.select("#seriesMenu1")
    //         .append("select")
    //         .attr("class","form-control");

    //     dv.list.selectAll("option")
    //     // add the data and join
    //         .data(keys)
    //         .enter()
    //     // append option with type name as value and text
    //         .append("option")
    //         .attr("value", d => d)
    //         .text( d => d );
        
    //     dv.list.on("change", function(){
    //         mlineChart.getData();
    //     });
    // }

}