class MultiLineChart{

    constructor (_Element, _titleX, _titleY, _yLabels){
        this.Element = _Element;
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
        const svg = d3.select(dv.Element)
            .append("svg")
            .attr("width", width + dv.margin.left + dv.margin.right)
            .attr("height", height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");
        
        // set transition variable
        dv.t = function() { return d3.transition().duration(1000); };

        dv.colour = d3.scaleOrdinal(d3.schemeBlues[9]);
        
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
        console.log("the variable is", dv.variable);

        // 2. add the value of the selector to the object array
        dv.filteredData = multilineData.map( d => {
            d.selectvalue = d[dv.variable];
            d.date = parseTime(d.quarter); 
            return d; 
        });
        // console.log("filtered data", dv.filteredData);

        // 3. nest and group data by region
        dv.regionData = d3.nest()
            .key(function(d){ return d.region; })
            .entries(dv.filteredData);
        
        console.log("nested data", dv.regionData);

        dv.update();
    }

    update(){
        let dv = this;
        d3.select(".focus").remove();
        
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
        dv.regions.select(".multi-line")
            .transition(dv.t)
            .attr("d", function (d) { console.log(d.values); return dv.line(d.values); });
        
        // Enter elements
        dv.regions.enter().append("g")
            .attr("class", "regions")
            .append("path")
            .attr("class", "multi-line")
            // 3. add on mouseover and on mouseout?
            // When implementing clickable legend
            //.attr("d", function(d) { return d.visible ? dv.line(d.values) : null;})
            .attr("id", d => d.key)
            .attr("lineId", d => d.key)
            .attr("d", function (d) { return dv.line(d.values); })
            .style("stroke", function (d) { return dv.colour(d.key); })
            .style("stroke-width", "1px")
            .style("fill", "none");  
        
        // dv.regions.transition(dv.t)
        //     .attr("d", function (d) { return dv.line(d.values); });
            
        dv.regions.exit()
            .transition(dv.t).remove();

        // tooltip based on the example in the d3 Book

        let focus = dv.g.append("g")
                        .attr("class", "focus")
                        .style("display", "none");

        console.log(nut3regions);
        
        // attach group with circle and text
        nut3regions.forEach( d => {
            // console.log(tooltip[d]);
            dv.tooltip = focus.append("g").attr("id", "tooltip_" + d);
            dv.tooltip.append("circle").attr("r", 5);
            dv.tooltip.append("text").attr("x", 9).attr("dy", ".35em");
            console.log(dv.tooltip);

        });

        // Year label
        focus.append("text").attr("class", "focus quarter").attr("x", 9).attr("y", 7);
        
        // Focus line
        focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", height);

        // append the rectangle to capture mouse
        dv.g.append("rect")
            .attr("width", width - 25) // minus the width of the legend
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove(){

            var mouse = d3.mouse(this),
                minY = height;

            console.log(mouse);

            dv.regionData.forEach(reg => {
                
                console.log("whats this", reg.values);

                var x0 = dv.x.invert(mouse[0]),
                i = dv.bisectDate(reg.values, x0, 1),
                d0 = reg.values[i - 1],
                d1 = reg.values[i],
                d;  

                console.log("x0 is", x0);
                console.log("should return a number", i);

                d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;
                console.log("this should be a data set", d);
                console.log("this is the value", d.selectvalue);

                var id = "#tooltip_" + reg.key;
                console.log("this should be the id",id);

                var tooltip = d3.select(id); 
                console.log("who is this", tooltip);
                
                tooltip.attr("transform", "translate(" + dv.x(parseTime(d.quarter)) + "," + dv.y(d.selectvalue) + ")");
                tooltip.select("text").text(d.selectvalue);

            });
            // need to loop through the data for each region and then apply below

        

                // nut3regions.forEach( reg => {

                    // console.log(reg);
                    // var id = "#" + reg;
                    // console.log(id);
                    // var tooltip = d3.select(id); 
                    // console.log("who is this", d.quarter);
                    
                    // tooltip.attr("transform", "translate(" + dv.x(parseTime(d.quarter)) + "," + dv.y(d.selectvalue) + ")");
                    // tooltip.select("text").text(d.selectvalue);
                
                    // minY = Math.min(minY, dv.yScale(tooltip.yFunct(d)));

                // });

        }
        
        

        // dv.mouseGroup = dv.svg.append("g")
        //     .attr("class", "mouse-over")
        //     .attr("transform", "translate(" + dv.margin.left + 
        //         ", " + dv.margin.top + ")");
      
        // dv.mouseGroup.append("path") // verticle mouse line to follow
        //     .attr("class", "mouse-line")
        //     .style("stroke", "black")
        //     .style("stroke-width", "1px")
        //     .style("opacity", "0");

        // dv.lines = document.getElementsByClassName('multi-line');
        // // console.log(dv.lines);

        // dv.mousePerLine = dv.mouseGroup.selectAll('.mouse-per-line')
        //     .data(dv.regionData)
        //     .enter()
        //     .append("g")
        //     .attr("class", "mouse-per-line")
        //     .attr("id", d => 'm' + d.key);
        
        // dv.mousePerLine.append("circle")
        //     .attr("r", 7)
        //     .style("fill", "none")
        //     .style("stroke-width", "1px")
        //     .style("opacity", "0");

        // dv.mousePerLine.append("text")
        //     .attr("transform", "translate(10,3)");

        // dv.mouseGroup.append('svg:rect') // append a rect to catch mouse movements on canvas
        //     .attr('width', width) // can't catch mouse events on a g element
        //     .attr('height', 200)
        //     .attr("transform", "translate(0," + height + ")")
        //     .attr('fill', 'none')
        //     .attr('pointer-events', 'all')
        //     .on('mouseout', function() { // on mouse out hide line, circles and text
        //         d3.select(".mouse-line")
        //             .style("opacity", "0");
        //         d3.selectAll(".mouse-per-line circle")
        //             .style("opacity", "0");
        //         d3.selectAll(".mouse-per-line text")
        //             .style("opacity", "0");
        //     })
        //     .on('mouseover', touchStart)
        //     .on('touchstart', touchStart)
        //     .on('mousemove', touchMove)
        //     .on('touchmove', touchMove);        
    
    
          function touchStart(){
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
            }
        
            function touchMove(){
                console.log("mouse over");
                // d3.event.preventDefault();
        
                var mouse = d3.mouse(this);
                console.log(mouse);
                // transform = d3.zoomTransform(zoomRect.node());
                // xtScale = transform.rescaleX(x);
                
                d3.select(".mouse-line")
                    .attr("d", function() {
                        //var x0 = xtScale.invert(mouse[0]);
                        var d = "M" + mouse[0] + "," + height;
                        //var d = "M" + x0 + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        console.log ('mousemove d: ' + d);
                        return d;
                    });
        
                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d, i) {
                        //console.log(width/mouse[0]);
                        // var xDate = xtScale.invert(mouse[0]),
                        var x0 = dv.x.invert(mouse[0]);
                            // bisect = d3.bisector(function(d) { return d.date; }).right,
                            // idx = bisect(d.values, x0);
        
                        var beginning = 0,
                            end = dv.lines[i].getTotalLength(),
                            target = null;
        
                        while (true){
                            target = Math.floor((beginning + end) / 2);
                            var pos = dv.lines[i].getPointAtLength(target);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0]) end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                            else break; //position found
                        }
        
                        var fillColor = "grey";
                        //d3.select("#legendRect" + d.key).attr("fill"); 
        
                d3.select(this).select('circle')
                    .style("stroke", fillColor);
              
                d3.select(this).select('text')
                    .text(dv.y.invert(pos.y).toFixed(2));
        
                d3.select(".xaxislabel")
                    .text(x0);
                      
                d3.select("#legendData" + d.key)
                    .text(dv.y.invert(pos.y).toFixed(2));
        
                  return "translate(" + mouse[0] + "," + pos.y +")";
               });
            }
    
    }

    addLegend(){
        var dv = this;

        // create legend group
        dv.legend = dv.g.append("g")
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
        var legend = dv.legend.selectAll(".legend")
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