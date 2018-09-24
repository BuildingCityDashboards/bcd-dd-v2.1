class MultiLineChart{

    constructor (_Element, _titleX, _titleY, _yLabels, _keys){
        // this.data = _data;
        this.element = _Element;
        this.titleX = _titleX;
        this.titleY = _titleY;
        this.yLabels = _yLabels;
        this.keys = _keys;

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
        
        // add the svg to the target element
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");
        
        // set transition variable
        dv.t = function() { return d3.transition().duration(1000); };

        // dv.colour = d3.scaleOrdinal(d3.schemeBlues[9]);
        dv.colourScheme = ["#aae0fa","#00929e","#da1e4d","#ffc20e","#16c1f3","#086fb8","#003d68"];

        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme.reverse());

        // for the tooltip from the d3 book
        dv.bisectDate = d3.bisector( d => { return d.date; } ).left;
        
        dv.addAxis();
    
    }

    addAxis(){       
        let dv = this;
        dv.yAxisCall = d3.axisLeft();

        dv.xAxisCall = d3.axisBottom();

        dv.xAxis = dv.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dv.height +")");
        
        dv.yAxis = dv.g.append("g")
            .attr("class", "y axis");

        // X title
        dv.xLabel = dv.g.append("text")
            .attr("class", "titleX")
            .attr("x", dv.width/2)
            .attr("y", dv.height + 60)
            .attr("text-anchor", "middle")
            .text(dv.titleX);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (dv.height/2))
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);

        // console.log("this is the width at scale function", dv.width);

        dv.addLegend();
        // dv.addSelectForm();
        
        // dv.getData();
    }

    getData( _valueString, _data){
        let dv = this;
        
        _data !== null ? dv.data =_data : dv.data = dv.data;
        dv.value = _valueString;

        dv.createScales();
    }

    createScales(){
        let dv = this;

        // set scales
        dv.x = d3.scaleTime().range([0, dv.width]);

        dv.y = d3.scaleLinear().range([dv.height, 0]);

        // Update scales
        dv.x.domain(d3.extent(dv.data[0].values, d => {
            return (d.date); }));
        
        // for the y domain to track negative numbers 
        const minValue = d3.min(dv.data, d => {
            return d3.min(d.values, d => { return d[dv.value]; });
        });

        // Set Y axis scales 0 if positive number else use minValue
        dv.y.domain([ minValue >=0 ? 0 : minValue,
            d3.max(dv.data, d => { 
            return d3.max(d.values, d => { return d[dv.value]; });
            })
        ]);

        // Update axes - what about ticks for smaller devices??
        dv.xAxisCall.scale(dv.x).tickFormat(d3.timeFormat("%Y"));
        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);
        dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);

        // Update x-axis label based on selector
        // dv.xLabel.text(dv.variable);

        // Update y-axis label based on selector
        // var selectorKey = dv.keys.findIndex( d => {  return d === dv.variable; });
        // var newYLabel = dv.yLabels[selectorKey];
        // dv.yLabel.text(newYLabel);

        dv.update();
    }

    update(){
        let dv = this;

        d3.select(dv.element).select(".focus").remove();
        d3.select(dv.element).select(".focus_overlay").remove();

         // d3 line function
        dv.line = d3.line()
            .x( d => {
                return dv.x(d.date); 
            })
            .y( d => { //this works
                return dv.y(d[dv.value]); 
            }).curve(d3.curveCatmullRom);
            // .curve(d3.curveBasis);

        // Adapted from the tooltip based on the example in the d3 Book
        
        // 2. add the on mouseover and on mouseout to the joined data

        // select all regions and join data
        dv.regions = dv.g.selectAll(".regions")
            .data(dv.data);
        
        // update the paths
        dv.regions.select(".line")
            .transition(dv.t)
            .attr("d", d => { return dv.line(d.values); });
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
            .style("stroke-width", "4px")
            .style("fill", "none");  
        
        // dv.regions.transition(dv.t)
        //     .attr("d", function (d) { return dv.line(d.values); });
            
        dv.regions.exit()
            .transition(dv.t).remove();
    
    }

    addTooltip(title, format){

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
        
        let tooltipCircles = focus.append("g")
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

                dv.data.forEach((reg, idx) => {
                    // this is from the d3 book
                    let x0 = dv.x.invert(mouse[0]),
                    i = dv.bisectDate(reg.values, x0, 1), // use the biset for linear scale.
                    d0 = reg.values[i - 1],
                    d1 = reg.values[i],
                    d;  
    
                    d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;
                    
                    let id = ".tooltip_" + idx;
                    let tpId = ".tooltipbody_" + idx;
                    let ttTitle = dv.g.select(".tooltip-title");

                    dv.updatePosition(mouse[0], 10);
                    let tooltip = d3.select(dv.element).select(id);
                    let tooltipBody = d3.select(dv.element).select(tpId); 
                        tooltipBody.attr("transform", "translate(5," + idx * 25 +")");
                    
                    if(d !== undefined){
                        tooltip.attr("transform", "translate(" + dv.x(d.date) + "," + dv.y(d[dv.value]) + ")");
                        // tooltipBody.attr("transform", "translate(" + dv.x(d.date) + "," + dv.y(d[dv.value]) + ")");
                        // tooltipBody.select(".tp-text-left").text(dv.keys[idx]);
                        tooltipBody.select(".tp-text-right").text(d[dv.value]);
                        ttTitle.text(dv.ttTitle + " " + dv.formatYear(d.date));

                        focus.select(".focus_line").attr("transform", "translate(" + dv.x(d.date) + ", 0)");
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

    updateItems(){

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
        if ((mouseX - dv.ttWidth) < dv.ttWidth) {
            ttX = mouseX;
        } else {
            // show left
            ttX = mouseX -255
        }
        return [ttX, ttY];
    }

    addLegend(){
        let dv = this;

        // create legend group
        var legend = dv.g.append("g")
            .attr("transform", "translate(" + (0) + 
                        ", " + (0) + ")"); // if the legend needs to be moved

        // create legend array, this needs to come from the data.
        
        let legendArray = [];
        
        dv.keys.forEach( (d,i) => {

            let obj = {};
                obj.label = d;
                obj.colour = dv.colour(d);
                legendArray.push(obj);
        });

        // data.forEach(d => {
        //     for (var key in d) {
        //         // console.log(key);
        //         var obj = {};
        //         if (!(key === "type" || key === "region")){
        //         obj.type = d.type;
        //         obj.region = d.region;
        //         obj.year = key;
        //         obj.value = +d[key];
        //         legendArray.push(obj);
        //     }}
        // });

        // var legendArray = dv.regionData;
        // console.log(legendArray);

        // get data and enter onto the legend group
        var legends = legend.selectAll(".legend")
            .data(legendArray)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => { return "translate(0," + i * 40 + ")"; })
            .style("font", "12px sans-serif");

        // // get data and enter onto the legend group
        // legend = legend.selectAll(".legend")
        //     .data(dv.regionData)
        //     .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; })
        //     .style("font", "12px sans-serif");
        
        // console.log("width at the legend draw", dv.width);
        // add legend boxes    
        legends.append("rect")
            .attr("class", "legendRect")
            .attr("x", dv.width + 25)
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.75);

        legends.append("text")
            .attr("class", "legendText")
            .attr("x", dv.width + 60)
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

    // textWrap(text, width, xpos = 0) {
    //     text.each(function() {
    //         let words,
    //             word,
    //             line,
    //             lineNumber,
    //             lineHeight,
    //             y,
    //             dy,
    //             tspan;

    //         text = d3Selection.select(this);

    //         words = text.text().split(/\s+/).reverse();
    //         line = [];
    //         lineNumber = 0;
    //         lineHeight = 1.2;
    //         y = text.attr('y');
    //         dy = parseFloat(text.attr('dy'));
    //         tspan = text
    //             .text(null)
    //             .append('tspan')
    //             .attr('x', xpos)
    //             .attr('y', y)
    //             .attr('dy', dy + 'em');

    //         while ((word = words.pop())) {
    //             line.push(word);
    //             tspan.text(line.join(' '));

    //             // fixes for IE wrap text issue
    //             const textWidth = getTextWidth(line.join(' '), 16, 'Karla, sans-serif');

    //             if (textWidth > width) {
    //                 line.pop();
    //                 tspan.text(line.join(' '));

    //                 if (lineNumber < entryLineLimit - 1) {
    //                     line = [word];
    //                     tspan = text.append('tspan')
    //                         .attr('x', xpos)
    //                         .attr('y', y)
    //                         .attr('dy', ++lineNumber * lineHeight + dy + 'em')
    //                         .text(word);
    //                 }
    //             }
    //         }
    //     });

    // }

}

//     let tpOffset = {
//         y: -25,
//         x: 0
//     }

// function getTooltipPosition([mouseX, mouseY]){
//     let tooltipX, tooltipY;

//     // show tooltip on the right
//     if ((mouseX - 250) < 0) {
//         // Tooltip on the right
//         tooltipX = 250 - 185;
//     } else {
//         // else show tooltip to the left
//         tooltipX = -205
//     }

//     if (mouseY) {
//         tooltipY = tpOffset.y;
//         // tooltipY = mouseY + tpOffset.y;
//     } else {
//         tooltipY = tpOffset.y;
//     }

//     return [tooltipX, tooltipY];
// }

// console.log("mouse position test", getTooltipPosition([300, 300]));