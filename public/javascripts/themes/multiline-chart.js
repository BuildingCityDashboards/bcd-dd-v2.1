class MultiLineChart{
    

    constructor (obj){

        this.element = obj.element;
        this.data = obj.data;
        this.value = obj.value;
        this.colourScheme = obj.colour;
        this.xTitle = obj.xTitle;
        this.yTitle = obj.yTitle;

        this.init();
    }

    // initialise method to draw c area
    init(){
        let c = this,
            eN = d3.select(c.element).node(),
            eW = eN.getBoundingClientRect().width,
            aR = eW < 800 ? eW * 0.55 : eW * 0.5,
            cScheme = c.colourScheme || d3.schemeBlues[5].slice(1),
            m = {},
            bP = 678;
        
            // margins
            m.t = eW < bP ? 40 : 50;
            m.b = eW < bP ? 30 : 80;
            m.r = eW < bP ? 20 : 140;
            m.l = eW < bP ? 20 : 60;
        
            c.width = c.width || eW - m.l - m.r;
            c.height = c.height || aR - m.t - m.b;

            d3.select(c.element).select("svg").remove();
    
            // add the svg to the target element
            c.svg = d3.select(c.element)
                .append("svg")
                .attr("width", c.width + m.l + m.r + 5)
                .attr("height", c.height + m.t + m.b);
       
            // add the g to the svg and transform by top and left margin
            c.g = c.svg.append("g")
                .attr("transform", "translate(" + m.l + 
                    ", " + m.t + ")")
                .attr("class","chart-group");
        
            // set chart transition method
            c.t = () => { return d3.transition().duration(1000); };
            // set chart colour method
            c.colour = d3.scaleOrdinal(cScheme);
            // set chart bisecector method
            c.bisectDate = d3.bisector( (d) => { return d.date; } ).left;
    
    }

    drawChart(){
        let c = this;
            c.addAxis();
            c.getKeys();
            c.drawTooltip();
            c.createScales();
            c.drawLines();
            c.drawLegend();            
    }

    updateChart(){
        let c = this;
        c.createScales();
        c.drawLines();
        c.drawLegend();
    }

    addAxis(){       
        let c = this,
            g = c.g,
            gLines,
            xLabel,
            yLabel;


            gLines = g.append("g")
                .attr("class", "grid-lines");

            c.xAxis = g.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + c.height +")");
            
            c.yAxis = g.append("g")
                .attr("class", "y-axis");

            // X title
            xLabel = g.append("text")
                .attr("class", "titleX")
                .attr("x", c.width/2)
                .attr("y", c.height + 60)
                .attr("text-anchor", "middle");

            // Y title
            yLabel = g.append("text")
                .attr("class", "titleY")
                .attr("x", - (c.height/2))
                .attr("y", -45)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)");
            
    }

    getKeys(){
        let c = this;
            c.colour.domain(c.data.map(d => { return d.key; }));
            c.keys = c.colour.domain();
    }

    // // replace all this with a data validator
    // // getData( _valueString, _data, _tX, _tY, yScaleFormat){
    // getData( _valueString, _tX, _tY, yScaleFormat){
    //     let c = this;
    //         _tX ? c.titleX = _tX: c.titleX = "";
    //         _tY ? c.titleY = _tY: c.titleY = "";
        
    //     // _data !== null ? c.data =_data : c.data = c.data;
    //     // c.data = _data !== null ? _data : c.data;
    //     c.value = _valueString;

    // }

    // needs to be called everytime the data changes
    createScales(){
        let c = this,
            yAxisCall = d3.axisLeft(),
            xAxisCall = d3.axisBottom(),
            x = c.getElement(".titleX"),
            y = c.getElement(".titleY");

        //update axis titles
        x.text(c.xTitle);
        y.text(c.yTitle);

        // set scales
        c.x = d3.scaleTime().range([0, c.width]);
        c.y = d3.scaleLinear().range([c.height, 0]);

        // Update scales
        c.x.domain(d3.extent(c.data[0].values, d => {
            return (d.date); }));// this needs to be dynamic c.date!!
        
        // for the y domain to track negative numbers 
        const minValue = d3.min(c.data, d => {
            return d3.min(d.values, d => { return d[c.value]; });
        });

        // Set Y axis scales 0 if positive number else use minValue
        c.y.domain([ minValue >=0 ? 0 : minValue,
            d3.max(c.data, d => { 
            return d3.max(d.values, d => { return d[c.value]; });
            })
        ]);

        c.drawGridLines();

        // Update X axis
        c.tickNumber ? xAxisCall.scale(c.x).ticks(c.tickNumber) : xAxisCall.scale(c.x);
        c.xAxis.transition(c.t()).call(xAxisCall);
        
        // Update Y axis
        c.yScaleFormat ? yAxisCall.scale(c.y).tickFormat(c.formatValue(c.yScaleFormat) ) : yAxisCall.scale(c.y);
        c.yAxis.transition(c.t()).call(yAxisCall);
    }

    drawLines(){
        let c = this,
            g = c.g; 

        // d3 line function
       c.line = d3.line()
           .defined(function(d){return !isNaN(d[c.value]);})
           .x( d => {
               return c.x(d.date); // this needs to be dynamic c.date!!
           })
           .y( d => { //this works
               return c.y(d[c.value]); 
           });
            // .curve(d3.curveCatmullRom);

       // select all regions and join data
       c.regions = g.selectAll(".regions")
           .data(c.data);
       
       // update the paths
       c.regions.select(".line")
           .transition(c.t)
           // .attr("d", d => {return c.line(d.values); });
           .attr("d", d => { 
               return d.disabled ? null : c.line(d.values); });
       
       // Enter elements
       c.regions.enter().append("g")
           .attr("class", "regions")
           .append("path")
           .style("stroke", d => {return c.colour(d.key); })
           .attr("class", "line")
           .attr("id", d => d.key)
           // .attr("d", d => {return c.line(d.values); })
           .attr("d", d => { 
               return d.disabled ? null : c.line(d.values); })
           // .style("stroke", d => ( c.data.map(function(v,i) {
           //     return c.colour || c.color[i % 10];
           //   }).filter(function(d,i) { return !c.data[i].disabled })))
           .style("stroke-width", "3px")
           .style("fill", "none");  
       
       // c.regions.transition(c.t)
       //     .attr("d", function (d) { return c.line(d.values); });
           
       c.regions.exit()
           .transition(c.t).remove();
    
    }

    drawTooltip(){
        let c = this;

            c.newToolTip = d3.select(c.element)
                .append("div")
                    .attr("class","tool-tip bcd")
                    .style("visibility","hidden");

            c.newToolTipTitle = c.newToolTip
                .append("div")
                    .attr("id", "bcd-tt-title");

            c.tooltipHeaders();
            c.tooltipBody();
    }

    tooltipHeaders(){
        let c = this,
            div,
            p;
            
        div = c.newToolTip
            .append("div")
                .attr("class", "headers");

        div.append("span")
            .attr("class", "bcd-dot");

        p = div
            .append("p")
                .attr("class","bcd-text");

        p.append("span")
            .attr("class","bcd-text-title")
            .text("Type");

        p.append("span")
            .attr("class","bcd-text-value")
            .text("Value");

        p.append("span")
            .attr("class","bcd-text-rate")
            .text("% Rate");

        p.append("span")
            .attr("class","bcd-text-indicator");
    }

    tooltipBody(){
        let c = this,
            keys = c.keys,
            div,
            p;

        keys.forEach( (d, i) => {
            div = c.newToolTip
                    .append("div")
                    .attr("id", "bcd-tt" + i);
                
            div.append("span").attr("class", "bcd-dot");

            p = div.append("p").attr("class","bcd-text");

            p.append("span").attr("class","bcd-text-title");
            p.append("span").attr("class","bcd-text-value");
            p.append("span").attr("class","bcd-text-rate");
            p.append("span").attr("class","bcd-text-indicator");
        });
    }

    drawFocusLine(){
        // add group to contain all the focus elements
        let c = this,
            g = c.g; 
            
            focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none")
                .style("visibility", "hidden");
            
            // Focus line
            focus.append("line")
                .attr("class", "focus_line")
                .attr("y1", 0)
                .attr("y2", c.height);
        
            focus.append("g")
                .attr("class", "focus_circles");
            
            // attach group append circle and text for each region
            c.keys.forEach( (d,i) => {
                c.drawFocusCircles(d,i);
            });
    }

    drawFocusCircles(d,i){
        let c = this,
            g = c.g; 

        let tooltip = g.select(".focus_circles")
            .append("g")
            .attr("class", "tooltip_" + i);

            tooltip.append("circle")
                .attr("r", 0)
                .transition(c.t)
                .attr("r", 5)
                .attr("fill", c.colour(d))
                .attr("stroke", c.colour(d));
    }

    addTooltip(title, format, dateField, prefix, postfix){
        let c = this;

            d3.select(c.element).select(".focus").remove();
            d3.select(c.element).select(".focus_overlay").remove();

            c.ttTitle = title;
            c.valueFormat = format;
            c.dateField = dateField;
            c.ttWidth = 305;
            c.prefix = prefix ? prefix : " ";
            c.postfix = postfix ? postfix: " ";
            c.valueFormat = c.formatValue(c.valueFormat);

            c.drawFocusLine();
            c.drawFocusOverlay();
    }

    drawFocusOverlay(){
        let c = this,
            g = c.g,
            focus = d3.select(c.element).select(".focus"),
            overlay = g.append("rect");
            
            overlay.attr("class", "focus_overlay")
                .attr("width", c.width)
                .attr("height", c.height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .style("visibility", "hidden");

                overlay.on("mouseover", (d) => { 
                        focus.style("display", null);
                    }, {passive:true})
                    .on("touchstart", ()=>{
                        focus.style("display", null);
                    }, {passive: true})
                    .on("mouseout", () => { 
                        focus.style("display", "none"); 
                        c.newToolTip.style("visibility","hidden");
                    })
                    .on("touchmove", mousemove, {passive:true})
                    .on("mousemove", mousemove, {passive:true});

            function mousemove(){

                focus.style("visibility","visible");
                c.newToolTip.style("visibility","visible");

                let mouse = d3.mouse(this),
                    ttTextHeights = 0,
                    x0 = c.x.invert(mouse[0]),
                    i = c.bisectDate(c.data[0].values, x0, 1);

                const tooldata = c.data.map(d => {
                    let s,
                        sPrev,
                        s0 = d.values[i - 1],
                        s1 = d.values[i],
                        v = c.value;

                        s1 !== undefined ? s = x0 - s0.date > s1.date - x0 ? s1 : s0 : s = s0;
                        s1 !== undefined ? sPrev = x0 - s0.date > s1.date - x0 ? d.values[i-1] : d.values[i-2] : false;
                        c.newToolTipTitle.text(c.ttTitle + " " + (s[c.dateField]));

                    let obj = {};
                        obj.key = d.key;
                        obj.label = s.label;
                        obj.value = s[v];
                        obj.change = c.getPerChange(s, sPrev, v);
                    return obj;
                });

                tooldata.sort((a, b) => b.value - a.value);

                tooldata.forEach(( d, i) => {

                    let id = "#bcd-tt" + i,
                        div = c.newToolTip.select(id),
                        unText = "N/A",
                        indicatorColour,
                        indicator = d.change > 0 ? " ▲" : d.change < 0 ? " ▼" : "",
                        rate = !d.change ? unText :d3.format(".1%")(!isNaN(d.change) ? d.change : null),
                        value =  isNaN(d.value) ? "" :  c.valueFormat !=="undefined"? c.prefix + c.valueFormat(d.value) : d.value,
                        p = div.select(".bcd-text");

                        if(c.arrowChange === true){
                            indicatorColour = d.change < 0 ? "#20c997" : d.change > 0 ? "#da1e4d" : "#f8f8f8";
                        }
                        else{
                            indicatorColour = d.change > 0 ? "#20c997" : d.change < 0 ? "#da1e4d" : "#f8f8f8";
                        }

                        div.style("opacity", 1);
                        div.select(".bcd-dot").style("background-color", c.colour(d.key));
                        p.select(".bcd-text-title").text(d.key);
                        p.select(".bcd-text-value").text(value);
                        p.select(".bcd-text-rate").text(rate);
                        p.select(".bcd-text-indicator").text(" " + indicator).style("color", indicatorColour);
                });
                
                c.data.forEach((reg, idx) => {
                    let d0 = reg.values[i - 1],
                        d1 = reg.values[i],
                        d,
                        dOld,
                        v = c.value;

                        d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;
                        d1 !== undefined ? dOld = x0 - d0.date > d1.date - x0 ? reg.values[i-1] : reg.values[i-2] : false;
                    
                    let id = ".tooltip_" + idx,
                        tooltip = d3.select(c.element).select(id);

                    
                    if(d !== undefined){
                        c.updatePosition(c.x(d.date), 80);
                        tooltip.attr("transform", "translate(" + c.x(d.date) + "," + c.y(!isNaN(d[v]) ? d[v]: 0) + ")");
                        focus.select(".focus_line").attr("transform", "translate(" + c.x(d.date) + ", 0)");
                    }
                });
            }
    }

    getPerChange(d1, d0, v){
        let value;
            value = !isNaN(d1[v]) ? d0 ? (d1[v] -  d0[v])/d0[v]: "null" : null;
                if( value === Infinity){
                    return 0;   
                }
                else if(isNaN(value)){
                    return 0;
                }
        return value;
    }

    updatePosition(xPosition, yPosition){
        let c = this,
            g = c.g; 
        // get the x and y values - y is static
        let [tooltipX, tooltipY] = c.getTooltipPosition([xPosition, yPosition]);
            // move the tooltip
            g.select(".bcd-tooltip").attr("transform", "translate(" + tooltipX + ", " + tooltipY +")");
            c.newToolTip.style("left", tooltipX + "px").style("top", tooltipY + "px");
    }

    getTooltipPosition([mouseX, mouseY]) {
        let c = this;
        let ttX,
            ttY = mouseY,
            cSize = c.width - c.ttWidth;

        // show right - 60 is the margin large screens
        if (mouseX < cSize) {
            ttX = mouseX + 60 + 30;
        } else {
            // show left - 60 is the margin large screens
            ttX = (mouseX + 60) - c.ttWidth;
        }
        return [ttX, ttY];
    }

    getElement(name){
        let c = this,
            s = d3.select(c.element),
            e = s.selectAll(name);
        return e;
    }
    
    textWrap(text, width, xpos = 0, limit=2) {
        text.each(function() {
            let words,
                word,
                line,
                lineNumber,
                lineHeight,
                y,
                dy,
                tspan;

            text = d3.select(this);
    
            words = text.text().split(/\s+/).reverse();
            line = [];
            lineNumber = 0;
            lineHeight = 1;
            y = text.attr("y");
            dy = parseFloat(text.attr("dy"));
            tspan = text
                .text(null)
                .append("tspan")
                .attr("x", xpos)
                .attr("y", y)
                .attr("dy", dy + "em");
    
            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));

                if (tspan.node() && tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));

                    if (lineNumber < limit - 1) {
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", xpos*2)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
                        // if we need two lines for the text, move them both up to center them
                        text.classed("move-up", true);
                    } else {
                        line.push("...");
                        tspan.text(line.join(" "));
                        break;
                    }
                }
            }
        });
    }

    drawGridLines(){
        let c = this,
            gLines = c.getElement(".grid-lines");

            gLines.selectAll("line")
                .remove();

            gLines.selectAll("line.horizontal-line")
                .data(c.y.ticks)
                .enter()
                .append("line")
                    .attr("class", "horizontal-line")
                    .attr("x1", (0))
                    .attr("x2", c.width)
                    .attr("y1", (d) => c.y(d))
                    .attr("y2", (d) => c.y(d));
    }

    formatValue(format){
        // formats thousands, Millions, Euros and Percentage
        switch (format){
            case "millions":
                return d3.format(".4s");
                break;
        
            case "euros":
                return "undefined";
                break;
        
            case "thousands":
                return d3.format(",");
                break;
        
            case "percentage":
                return d3.format(".2%");
                break;
        
            default:
                return "undefined";
        }
    }

    formatQuarter(date, i){
        let newDate = new Date();
        newDate.setMonth(date.getMonth() + 1);
        let year = (date.getFullYear());
        let q = Math.ceil(( newDate.getMonth()) / 3 );
        return year+" Q" + q;
    }

    hideRate(value){
        let c = this,
            i = c.getElement(".bcd-text-indicator"),
            r = c.getElement(".bcd-text-rate");     

            if(value){
                console.log("value of hide", value);
                i.style("display", "none");
                r.style("display", "none");
            }
            else{
                i.style("display", "block");
                r.style("display", "block");
            }
            // value ? g.selectAll(".tp-text-indicator").style("display", "none") : g.selectAll(".tp-text-indicator").style("display", "block")
    }

    addBaseLine(value){
        let c = this,
            gLines = c.getElement(".grid-lines");;
        
            gLines.append("line")
                .attr("x1", 0)
                .attr("x2", c.width)
                .attr("y1", c.y(value))
                .attr("y2", c.y(value))
                .attr("stroke", "#dc3545");

    }

    //replacing old legend method with new inline labels
    drawLegend() {
        // chart (c) object, vlaue (v), colour (z), line height(lH)
        let c = this,
            g = c.g,
            v = c.value,
            z = c.colour,
            lH = 18;
        
        // data values for last readable value
        const lines = c.data.map(d => {
            let obj = {},
                vs = d.values.filter(idFilter),
                s = vs.length -1;
                // sF = d.values.length -1;
                obj.key = d.key;
                obj.last = vs[s][v];
                obj.x = c.x(vs[s].date);
                // obj.y = sF === s ? c.y(vs[s][v]) : c.y(vs[s][v]) - 15;
                obj.y = c.y(vs[s][v]);
            return obj;
        });

        const circles = c.data.map(d => {
            let obj = {},
                vs = d.values.filter(idFilter),
                s = vs.length -1;
                obj.key = d.key;
                obj.last = vs[s][v];
                obj.x = c.x(vs[s].date);
                obj.y = c.y(vs[s][v]);
            return obj;
        });

        // Define a custom force to stop labels going outside the svg
        const forceClamp = (min, max) => {
                let nodes;
                const force = () => {
                nodes.forEach(n => {
                    if (n.y > max) n.y = max;
                    if (n.y < min) n.y = min;
                });
                };
                force.initialize = (_) => nodes = _;
                return force;
        }

        // Set up the force simulation
        const force = d3.forceSimulation()
            .nodes(lines)
            .force("collide", d3.forceCollide(lH / 2))
            .force("y", d3.forceY(d => d.y).strength(1))  
            .force("x", d3.forceX(d => d.x).strength(1))   
            .force("clamp", forceClamp(0, c.height))
            .stop();

            // Execute the simulation
            for (let i = 0; i < 30; i++) force.tick();

        // Add labels
        const legendNames = g.selectAll(".label-legend").data(lines, d => d.y);
              legendNames.exit().remove();

        const legendCircles = g.selectAll(".legend-circles").data(circles, d => d.y);
              legendCircles.exit().remove();

        const legendGroup = legendNames.enter().append("g")
                .attr("class", "label-legend")
                .attr("transform", d => "translate(" + d.x + ", " + d.y + ")");

        const legendGC = legendCircles.enter().append("g")
                .attr("class", "legend-circles")
                .attr("transform", d => "translate(" + d.x + ", " + d.y + ")");
            
            legendGroup.append("text")
                .attr("class", "legendText")
                .attr("dy", ".01em")
                .text(d => d.key)
                // .call(c.textWrap, 110, 6)
                .attr("fill", d => z(d.key))
                .attr("alignment-baseline", "middle")
                .attr("dx", ".5em")
                .attr("x", 2);
        
            // legendGroup.append("line")
            //     .attr("class", "legend-line")
            //     .attr("x1", 0)
            //     .attr("x2", 6)
            //     .attr("stroke", "#fff");
            
            legendGC.append("circle")
                .attr("class", "l-circle")
                .attr("r", "6")
                .attr("fill", d => z(d.key));

        // check if number
        function isNum(d) {
            return !isNaN(d);
          }

        //filter out the NaN
        function idFilter(d) {
           return isNum(d[v]) && d[v] !== 0 ? true : false; 
        }
    }  

}
