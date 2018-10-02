class StackedAreaChart {

    // constructor function
    constructor (_element, _titleX, _titleY, _dateVariable, _keys){
        //valid data input?

        // load in arguments from config object
        this.element = _element;
        this.titleX = _titleX;
        this.titleY = _titleY;
        this.date = _dateVariable;
        this.keys = _keys;
        
        // create the chart
        this.init();
    }
    // initialise method to draw chart area
    init(){
        let dv = this;
        
        let elementNode = d3.select(dv.element).node();
        let elementWidth = elementNode.getBoundingClientRect().width; 
        let aspectRatio = elementWidth < 800 ? elementWidth * 0.65 : elementWidth * 0.5;

        const breakPoint = 678;
        
        // margin
        dv.margin = { 
            top: 50,
            bottom: 80
        };

        dv.margin.right = elementWidth < breakPoint ? 0 : 150;
        dv.margin.left = elementWidth < breakPoint ? 0 : 80;

        console.log(dv.margin);
        
        dv.width = elementWidth - dv.margin.left - dv.margin.right;
        dv.height = aspectRatio - dv.margin.top - dv.margin.bottom;

        // select parent element and append SVG + g
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);

        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");

        dv.chartTop = $(dv.element + " svg g").offset().top;
        // console.log(dv.chartTop);

        dv.colourScheme = ["#aae0fa","#00929e","#da1e4d","#ffc20e","#16c1f3","#086fb8","#003d68"];

        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme.reverse());

        // for the tooltip from the d3 book
        dv.bisectDate = d3.bisector(function(d) { return parseTime(d[dv.date]); }).left;

        // set scales
        dv.x = d3.scaleTime().range([0, dv.width]);
        dv.y = d3.scaleLinear().range([dv.height, 0]);

        dv.gridLines = dv.g.append("g")
            .attr("class", "grid-lines");

        dv.xAxis = dv.g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + dv.height +")");

        dv.yAxis = dv.g.append("g")
            .attr("class", "y-axis");

        // X title
        dv.g.append("text")
            .attr("class", "titleX")
            .attr("x", dv.width/2)
            .attr("y", dv.height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.titleX);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (dv.height/2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);

        // d3 area function
        dv.area = d3.area()
            .x(function(d) { return dv.x(parseTime(d.data[dv.date]))})
            .y0(function(d) { return dv.y(d[0]); })
            .y1(function(d) { return dv.y(d[1]); });

        // call the legend method
        dv.addLegend();

        // call the getdata method
    }

    // pass the data and the nest value
    getData(_data){

        let dv = this;
            dv.nestedData = _data,

        dv.update();
    }

    update(){
        let dv = this;
        d3.select(dv.element).select(".focus").remove();
        d3.select(dv.element).select(".focus_overlay").remove();
        
        // transition 
        const t = () => { return d3.transition().duration(1000); };

        // d3 stack function
        const stack = d3.stack().keys(nut3regions);

        dv.drawGridLines();

        const yAxisCall = d3.axisLeft();
        const xAxisCall = d3.axisBottom();

        dv.data = (stack(dv.nestedData));

        // get the the combined max value for the y scale
        let maxDateVal = d3.max(dv.nestedData, d => {
            var vals = d3.keys(d).map(key => { 
                return key !== dv.date ? d[key] : 0;
            });
            return d3.sum(vals);
        });

        // Update scales
        dv.x.domain(d3.extent(dv.nestedData, (d) => {  return parseTime(d[dv.date]); }));
        dv.y.domain([0, maxDateVal]);

        // Update axes
        xAxisCall.scale(dv.x);
        dv.xAxis.transition(t()).call(xAxisCall);

        yAxisCall.scale(dv.y);
        dv.yAxis.transition(t()).call(yAxisCall);

        // select all regions and join data with old
        const regions = dv.g.selectAll(".region")
            .data(dv.data);
        
        // Exit old elements not present in new data.
        // regions.exit()
        //     .transition(t)
        //     .attr("y", y(0))
        //     .attr("height", 0)
        //     .remove();

        // update the paths
        regions.select(".area")
            .transition(t)
            .attr("d", dv.area);

        // Enter elements
        regions.enter().append("g")
            .attr("class", "region")
            .append("path")
                .attr("class", "area")
                // .transition(t)
                .attr("d", dv.area)
                .style("fill", function(d){
                    return dv.colour(d.key);
                })
                .style("fill-opacity", 0.75);
             
        // tooltip based on the example in the d3 Book
        // add group to contain all the focus elements
        // let focus = dv.g.append("g")
        //     .attr("class", "focus")
        //     .style("display", "none");
        
        // // Year Label
        // focus.append("text")
        //     .attr("class", "focus_quarter")
        //     .attr("x", 9)
        //     .attr("y", 7);

        // // Focus line
        // focus.append("line")
        //     .attr("class", "focus_line")
        //     .attr("y1", 0)
        //     .attr("y2", dv.height);

        // nut3regions.forEach( d => {
        //     dv.tooltip = focus.append("g")
        //         .attr("class", "tooltip_" + d);

        //     dv.tooltip.append("circle")
        //     .attr("r", 5)
        //     .attr("fill", "white")
        //     .attr("stroke", dv.colour(d));

        //     dv.tooltip.append("text")
        //         .attr("x", 9)
        //         .attr("dy", ".35rem");
        // });

        // dv.g.append("rect")
        //     .attr("width", dv.width + 10)
        //     .attr("height", dv.height)
        //     .style("fill", "none")
        //     .style("pointer-events", "all")
        //     .on("mouseover", () => { 
        //         focus.style("display", null); 
        //     })
        //     .on("mouseout", () => { 
        //         focus.style("display", "none"); 
        //     })
        //     .on("mousemove", mousemove);

        // function mousemove() {
        //     let mouse = d3.mouse(this);
            
        //     nut3regions.forEach( (region, idx) => {

        //         let regionData = DataStacked[idx];
        //         // console.log("this should be an Array: ", regionData);

        //             // this is from the d3 book
        //             let x0 = dv.x.invert(mouse[0]),
        //             i = dv.bisectDate(dv.nestedData, x0, 1),
        //             d0 = regionData[i - 1],
        //             d1 = regionData[i],
        //             d;
                    
        //             d1 !== undefined ? d = x0 - d0[dv.date] > d1[dv.date] - x0 ? d1 : d0 : d = d0;
                
        //             let id = ".tooltip_" + region;
    
        //             let tooltip = d3.select(dv.element).select(id); 
                    
        //             if(d !== undefined){
        //                 tooltip.attr("transform", "translate(" + dv.x(parseTime(d.data[dv.date])) + "," + dv.y(d[1]) + ")");
        //                 tooltip.select("text").text(d.data[region]);
        //                 focus.select(".focus_line").attr("transform", "translate(" + dv.x(parseTime(d.data[dv.date])) + ", 0)");
        //             }
        //     });
        // }    
    }

    addLegend(){
        var dv = this;

        // create legend group
        var legend = dv.g.append("g")
            .attr("transform", "translate(0,0)");

        // create legend array, this needs to come from the data.
        var legendArray = [
            {label: "Ireland", colour: dv.colour("Ireland")},
            {label: "Dublin", colour: dv.colour("Dublin")}
        ];

        // get data and enter onto the legend group
        var legend = legend.selectAll(".legend")
            .data(legendArray)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; })
            .style("font", "12px sans-serif");
        
        // add legend boxes    
        legend.append("rect")
            .attr("class", "legendRect")
            .attr("x", dv.width + 25)
            // style similar to hospital legend
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.75);
        
        // add legend text
        legend.append("text")
            .attr("class", "legendText")
            .attr("x", dv.width + 60)
            .attr("y", 12)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(d => { return d.label; }); 
    }

    drawGridLines(){
        let dv = this;

        dv.gridLines.selectAll('line')
            .remove();

        dv.gridLines.selectAll('line.horizontal-line')
            .data(dv.y.ticks)
            .enter()
                .append('line')
                .attr('class', 'horizontal-line')
                .attr('x1', (0))
                .attr('x2', dv.width)
                .attr('y1', (d) => { return dv.y(d) })
                .attr('y2', (d) => dv.y(d));
    }

    addTooltip(title, format, data){

        let dv = this;
            dv.ttTitle = title;
            dv.valueFormat = format;
            dv.ttWidth = 250,
            dv.ttHeight = 50,
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");

            // formats thousands, Millions, Euros and Percentage

        // add group to contain all the focus elements
        let focus = dv.g.append("g")
                .attr("class", "focus")
                .style("display", "none")
                .style("visibility", "hidden");
            
            // Year label
            focus.append("text")
                .attr("class", "focus_quarter")
                .attr("x", 9)
                .attr("y", 7);
            
            // Focus line
            focus.append("line")
                .attr("class", "focus_line")
                .attr("y1", 0)
                .attr("y2", dv.height);
        
            focus.append("g")
                .attr("class", "focus-circles");

        let bcdTooltip = focus.append("g")
                .attr("class", "bcd-tooltip")
                .attr("width", dv.ttWidth)
                .attr("height", dv.ttHeight);
            
        let toolGroup =  bcdTooltip.append("g")
                .attr("class", "tooltip-group")
                .style("visibility", "hidden");

            dv.drawTooltip();
            
            // attach group append circle and text for each region
            dv.keys.forEach( (d,i) => {
                let tooltip = dv.g.select(".focus-circles")
                    .append("g")
                    .attr("class", "tooltip_" + i);
    
                tooltip.append("circle")
                    .attr("r", 0)
                    .transition(dv.t)
                    .attr("r", 5)
                    .attr("fill", dv.colour(d))
                    .attr("stroke", dv.colour(d));
                
                dv.updateTooltip(d,i);

            });
    
            // append a rectangle overlay to capture the mouse
            dv.g.append("rect")
                .attr("class", "focus_overlay")
                .attr("width", dv.width + 10) // give a little extra for last value
                .attr("height", dv.height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .style("visibility", "hidden")
                .on("mouseover", () => { focus.style("display", null); })
                .on("mouseout", () => { focus.style("display", "none"); })
                .on("mousemove", mousemove);
            
            function mousemove(){
                focus.style("visibility","visible");
                toolGroup.style("visibility","visible");

                let mouse = d3.mouse(this);

                console.log("this is the data source stacked area chart", dv.data);
                dv.data.forEach((reg, idx) => {

                    // this is from the d3 book
                    let x0 = dv.x.invert(mouse[0]),
                    i = dv.bisectDate(dv.nestedData, x0, 1), // use the bisect for linear scale.
                    d0 = reg[i - 1],
                    d1 = reg[i],
                    d;  

                    // console.log("this is the date value for the line position", d0, d1);
    
                    d1 !== undefined ? d = x0 - d0.data[dv.date] > d1.data[dv.date] - x0 ? d1 : d0 : false;
                    
                    let id = ".tooltip_" + idx;
                    let tpId = ".tooltipbody_" + idx;
                    let ttTitle = dv.g.select(".tooltip-title");

                    dv.updatePosition(mouse[0], 10);
                    
                    let tooltip = d3.select(dv.element).select(id);
                    let tooltipBody = d3.select(dv.element).select(tpId); 
                        tooltipBody.attr("transform", "translate(5," + idx * 25 +")");
                    
                    if(d !== undefined){
                        console.log("This is the data source selected for stacked area : ", d);
                        // tooltip.attr("transform", "translate(" + dv.x(parseTime(d.data[dv.date])) + "," + dv.y(d[dv.value]) + ")");
                        // tooltipBody.attr("transform", "translate(" + dv.x(d.date) + "," + dv.y(d[dv.value]) + ")");
                        // tooltipBody.select(".tp-text-left").text(dv.keys[idx]);
                        tooltipBody.select(".tp-text-right").text(d[1] -d[0]);
                        // ttTitle.text(dv.ttTitle + " " + dv.formatYear(d.date));
                        focus.select(".focus_line").attr("transform", "translate(" + dv.x(parseTime(d.data[dv.date])) + ", 0)");
                    }
                });
            }
    }

    drawTooltip(){
        let dv = this;

        let tooltipTextContainer = dv.g.select(".tooltip-group")
          .append("g")
            .attr("class","tooltip-text");

        let tooltip = tooltipTextContainer
            .append("rect")
            .attr("class", "tooltip-container")
            .attr("width", dv.ttWidth)
            .attr("height", dv.ttHeight)
            .attr("rx", dv.ttBorderRadius)
            .attr("ry", dv.ttBorderRadius)
            .attr("fill","#f8f8f8")
            .attr("stroke", "#6c757d")
            .attr("stroke-width", "1");

        let tooltipTitle = tooltipTextContainer
          .append("text")
            .text("test tooltip")
            .attr("class", "tooltip-title")
            .attr("x", 5)
            .attr("y", 16)
            .attr("dy", ".35em")
            .style("fill", "#1d2124");

        let tooltipDivider = tooltipTextContainer
            .append("line")
                .attr("class", "tooltip-divider")
                .attr("x1", 5)
                .attr("x2", 240)
                .attr("y1", 31)
                .attr("y2", 31)
                .style("stroke", "#6c757d");

        let tooltipBody = tooltipTextContainer
                .append("g")
                .attr("class","tooltip-body")
                // .style("transform", "translateY(8px)")
                .attr("transform", "translate(5,50)");
    }

    updateTooltip(d,i){
        let dv = this;

        let tooltipBodyItem = dv.g.select(".tooltip-body")
            .append("g")
            .attr("class", "tooltipbody_" + i);

        tooltipBodyItem.append("text")
            .text(d)
            .attr("class", "tp-text-left")
            .attr("x", "12")
            .attr("dy", ".35em");

        tooltipBodyItem.append("text")
            .attr("class", "tp-text-right")
            .attr("x", "10")
            .attr("dy", ".35em")
            .attr("dx", dv.ttWidth - 40)
            .attr("text-anchor","end");

        tooltipBodyItem.append("circle")
            .attr("class", "tp-circle")
            .attr("r", "6")
            .attr("fill", dv.colour(d));
        
        dv.updateSize();
    }

    updatePosition(xPosition, yPosition){
        let dv = this;
        // get the x and y values - y is static
        let [tooltipX, tooltipY] = dv.getTooltipPosition([xPosition, yPosition]);
        // move the tooltip
        dv.g.select(".bcd-tooltip").attr("transform", "translate(" + tooltipX + ", " + tooltipY +")");
    }

    updateSize(){
        let dv = this;
        let height = dv.g.select(".tooltip-body").node().getBBox().height;
        dv.ttHeight += height + 5;
        dv.g.select(".tooltip-container").attr("height", dv.ttHeight);
        console.log("what is the tooltip height now", dv.ttHeight);
    }

    resetSize() {
        let dv = this;
        dv.ttHeight = 50;
    }

    getTooltipPosition([mouseX, mouseY]) {
        let dv = this;
        let ttX,
            ttY = mouseY;

        // show right
        if (mouseX < dv.width / 2) {
            ttX = mouseX;
        } else {
            // show left
            ttX = mouseX -255
        }
        return [ttX, ttY];
    }


}



