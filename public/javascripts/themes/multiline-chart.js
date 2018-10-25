class MultiLineChart{

    // constructor (_Element, _keys, _data){
    constructor (obj){

        this.element = obj.element;
        this.keys = obj.keys;
        this.data = obj.data;
        this.value = obj.value;

        this.init();
    }

    // initialise method to draw chart area
    init(){
        let dv = this,
            elementNode = d3.select(dv.element).node(),
            elementWidth = elementNode.getBoundingClientRect().width,
            aspectRatio = elementWidth < 800 ? elementWidth * 0.65 : elementWidth * 0.5;

        const breakPoint = 678;
        
        // margin
        dv.margin = { };

        dv.margin.top = elementWidth < breakPoint ? 40 : 50;
        dv.margin.bottom = elementWidth < breakPoint ? 30 : 80;

        dv.margin.right = elementWidth < breakPoint ? 20 : 150;
        dv.margin.left = elementWidth < breakPoint ? 20 : 80;
        
        dv.width = elementWidth - dv.margin.left - dv.margin.right;
        dv.height = aspectRatio - dv.margin.top - dv.margin.bottom;

        d3.select(dv.element).select("svg").remove();
        
        // add the svg to the target element
        dv.svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = dv.svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");
        
        // set transition variable
        dv.t = function() { return d3.transition().duration(1000); };

        // dv.colourScheme = ["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8"];
        dv.colourScheme =d3.schemeBlues[5].slice(1);
        
        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme);

        // for the tooltip from the d3 book
        dv.bisectDate = d3.bisector( d => { return d.date; } ).left;

        // tick numbers
        dv.tickNumber = "undefined";

        // tick formats
        dv.tickFormat = "undefined";
        
        dv.addAxis();
    
    }

    addAxis(){       
        let dv = this;

        dv.yAxisCall = d3.axisLeft();

        dv.xAxisCall = d3.axisBottom();

        dv.gridLines = dv.g.append("g")
            .attr("class", "grid-lines");

        dv.xAxis = dv.g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + dv.height +")");
        
        dv.yAxis = dv.g.append("g")
            .attr("class", "y-axis");

        // X title
        dv.xLabel = dv.g.append("text")
            .attr("class", "titleX")
            .attr("x", dv.width/2)
            .attr("y", dv.height + 60)
            .attr("text-anchor", "middle");

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (dv.height/2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)");
            
    }

    // replace all this with a data validator
    // getData( _valueString, _data, _tX, _tY, yScaleFormat){
    getData( _valueString, _tX, _tY, yScaleFormat){
        let dv = this;
            dv.yScaleFormat = dv.formatValue(yScaleFormat);

            _tX ? dv.titleX = _tX: dv.titleX = "";
            _tY ? dv.titleY = _tY: dv.titleY = "";
        
        // _data !== null ? dv.data =_data : dv.data = dv.data;
        // dv.data = _data !== null ? _data : dv.data;
        dv.value = _valueString;

        dv.createScales();
    }

    // needs to be called everytime the data changes
    createScales(){
        let dv = this;

        // set scales
        dv.x = d3.scaleTime().range([0, dv.width]);
        dv.y = d3.scaleLinear().range([dv.height, 0]);

        // Update scales
        dv.x.domain(d3.extent(dv.data[0].values, d => {
            return (d.date); }));// this needs to be dynamic dv.date!!
        
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

        dv.xLabel.text(dv.titleX);
        dv.yLabel.text(dv.titleY);

        dv.drawGridLines();
        // dv.tickNumber = 0 ; //=  dv.data[0].values.length;

        // Update axes
        dv.tickNumber !== "undefined" ? dv.xAxisCall.scale(dv.x).ticks(dv.tickNumber) : dv.xAxisCall.scale(dv.x);

        // // Update axes - what about ticks for smaller devices??
        // dv.xAxisCall.scale(dv.x).ticks(d3.timeYear.filter((d) => {
        //     return d = parseYear("2016");
        // }));
        // dv.xAxisCall.scale(dv.x).ticks(dv.tickNumber).tickFormat( (d,i) => {
        //     return i < dv.tickNumber ? dv.data[0].values[i].label : "";
        // });
        
        // .tickFormat(dv.formatQuarter);
        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);
        
         //ticks(dv.tickNumberY)
        dv.yScaleFormat !== "undefined" ? dv.yAxisCall.scale(dv.y).tickFormat(dv.yScaleFormat ) : dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);

        // Update x-axis label based on selector
        // dv.xLabel.text(dv.variable);

        // Update y-axis label based on selector
        // var selectorKey = dv.keys.findIndex( d => {  return d === dv.variable; });
        // var newYLabel =[selectorKey];
        // dv.yLabel.text(newYLabel);

        dv.update();
    }

    update(){
        let dv = this;

        // d3 line function
       dv.line = d3.line()
           .defined(function(d){return !isNaN(d[dv.value]);})
           .x( d => {
               return dv.x(d.date); // this needs to be dynamic dv.date!!
           })
           .y( d => { //this works
               return dv.y(d[dv.value]); 
           });
            // .curve(d3.curveCatmullRom);

       // Adapted from the tooltip based on the example in the d3 Book
       
       // 2. add the on mouseover and on mouseout to the joined data

       // select all regions and join data
       dv.regions = dv.g.selectAll(".regions")
           .data(dv.data);
       
       // update the paths
       dv.regions.select(".line")
           .transition(dv.t)
           // .attr("d", d => {return dv.line(d.values); });
           .attr("d", d => { 
               return d.disabled ? null : dv.line(d.values); });
       
       // Enter elements
       dv.regions.enter().append("g")
           .attr("class", "regions")
           .append("path")
           .style("stroke", d => {return dv.colour(d.key); })
           .attr("class", "line")
           .attr("id", d => d.key)
           // .attr("d", d => {return dv.line(d.values); })
           .attr("d", d => { 
               return d.disabled ? null : dv.line(d.values); })
           // .style("stroke", d => ( dv.data.map(function(v,i) {
           //     return dv.colour || dv.color[i % 10];
           //   }).filter(function(d,i) { return !dv.data[i].disabled })))
           .style("stroke-width", "3px")
           .style("fill", "none");  
       
       // dv.regions.transition(dv.t)
       //     .attr("d", function (d) { return dv.line(d.values); });
           
       dv.regions.exit()
           .transition(dv.t).remove();

        dv.drawLegend();
    
    }

    addTooltip(title, format, dateField, prefix, postfix){
        let dv = this;

            d3.select(dv.element).select(".focus").remove();
            d3.select(dv.element).select(".focus_overlay").remove();

            dv.ttTitle = title;
            dv.valueFormat = format;
            dv.dateField = dateField;
            dv.ttWidth = 280;
            dv.ttHeight = 50;
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");
            dv.prefix = prefix ? prefix : " ";
            dv.postfix = postfix ? postfix: " ";

            dv.valueFormat = dv.formatValue(dv.valueFormat);

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
                .attr("class", "focus_circles");

        let bcdTooltip = focus.append("g")
                .attr("class", "bcd-tooltip tool-tip")
                .attr("width", dv.ttWidth)
                .attr("height", dv.ttHeight);
            
        let toolGroup =  bcdTooltip.append("g")
                .attr("class", "tooltip-group")
                .style("visibility", "hidden");

            dv.drawTooltip();
            
            // attach group append circle and text for each region
            dv.keys.forEach( (d,i) => {
                let tooltip = dv.g.select(".focus_circles")
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
                .attr("width", dv.width) // give a little extra for last value
                .attr("height", dv.height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .style("visibility", "hidden")
                .on("mouseover", (d) => { 
                    // console.log(d);
                    focus.style("display", null); 
                    bcdTooltip.style("display", "inline");
                }, {passive:true})
                .on("touchstart", ()=>{
                    focus.style("display", null); 
                    bcdTooltip.style("display", "inline");
                }, {passive: true})
                .on("mouseout", () => { 
                    focus.style("display", "none"); 
                    bcdTooltip.style("display", "none");
                })
                .on("touchmove", mousemove, {passive:true})
                .on("mousemove", mousemove, {passive:true});
            
            function mousemove(){

                focus.style("visibility","visible");
                toolGroup.style("visibility","visible");

                let mouse = d3.mouse(this),
                    ttTextHeights = 0,
                    x0 = dv.x.invert(mouse[0]),
                    i = dv.bisectDate(dv.data[0].values, x0, 1),
                    dTest;

                const tooldata = dv.data.map(d => {
                    let obj = {};
                        obj.key = d.key;
                        obj.v0 = d.values[i-1];//[dv.value];
                        obj.v1 = d.values[i];//[dv.value];
                    return obj;
                });

                dTest = x0 - tooldata[0].v0.date > tooldata[0].v1.date - x0 ? "v1" : "v0" ;
                
                dv.data.forEach((reg, idx) => {
                    // this is from the d3 book
                    // let x0 = dv.x.invert(mouse[0]),
                    // i = dv.bisectDate(reg.values, x0, 1), // use the biset for linear scale.
                let d0 = reg.values[i - 1],
                    d1 = reg.values[i],
                    d,
                    dOld,
                    unText = "unavailable",
                    v = dv.value,
                    valueString;

                    d1 !== undefined ? d = x0 - d0.date > d1.date - x0 ? d1 : d0 : false;
                    d1 !== undefined ? dOld = x0 - d0.date > d1.date - x0 ? reg.values[i-1] : reg.values[i-2] : false;
                       
                    // d.sort((a, b) => b.v1[dv.value] - a.v1[dv.value])
                    
                    let id = ".tooltip_" + idx,
                        tpId = ".tooltipbody_" + idx,
                        ttTitle = dv.g.select(".tooltip-title");

                    let tooltip = d3.select(dv.element).select(id),
                        tooltipBody = d3.select(dv.element).select(tpId), 
                        textHeight = tooltipBody.node().getBBox().height ? tooltipBody.node().getBBox().height : 0,
                        difference = dv.getPerChange(d, dOld, v),
                        indicatorColour,
                        indicatorSymbol = difference > 0 ? " ▲" : difference < 0 ? " ▼" : "",
                        diffPercentage = !difference ? unText :d3.format(".1%")(!isNaN(difference) ? difference : null);
                    if(dv.arrowChange === true){
                        indicatorColour = difference < 0 ? "#20c997" : difference > 0 ? "#da1e4d" : "#f8f8f8";
                    }
                    else{
                        indicatorColour = difference > 0 ? "#20c997" : difference < 0 ? "#da1e4d" : "#f8f8f8";
                    }
                    
                    tooltipBody.attr("transform", "translate(5," + ttTextHeights +")");
                    
                    if(d !== undefined){
                        valueString =  isNaN(d[v]) ? "" :  dv.valueFormat !=="undefined"? dv.prefix + dv.valueFormat(d[v]) : d[v];

                        dv.updatePosition(dv.x(d.date), 10);

                        tooltip.attr("transform", "translate(" + dv.x(d.date) + "," + dv.y(!isNaN(d[v]) ? d[v]: 0) + ")");
                        tooltipBody.select(".tp-text-right").text(valueString);
                        tooltipBody.select(".tp-text-indicator").text(diffPercentage +" "+indicatorSymbol).attr("fill",indicatorColour);
                        ttTitle.text(dv.ttTitle + " " + (d[dv.dateField]));

                        focus.select(".focus_line").attr("transform", "translate(" + dv.x(d.date) + ", 0)");
                    }
                    ttTextHeights += textHeight + 5;
                });
            }
    }

    getPerChange(d1, d0, v){
        let value;
            // o = d0 ? d0[v] : 1,
            // n = d1[v],
            // isNegative = n - o < 0,
            // oneg =  o *= -1;
            // console.log((d1[v] -  d0[v])/d0[v]);
            value = !isNaN(d1[v]) ? d0 ? (d1[v] -  d0[v])/d0[v]: "null" : null;
                if( value === Infinity){
                    return d1[v];   
                }
                else if(isNaN(value)){
                    return 0;
                }
        return value;
    }

    drawTooltip(){
        let dv = this;

        let tooltipTextContainer = dv.g.select(".tooltip-group")
          .append("g")
            .attr("class","tooltip-text")
            .attr("fill","#f8f8f8");

        let tooltip = tooltipTextContainer
            .append("rect")
            .attr("class", "tooltip-container")
            .attr("width", dv.ttWidth)
            .attr("height", dv.ttHeight)
            .attr("rx", dv.ttBorderRadius)
            .attr("ry", dv.ttBorderRadius)
            .attr("fill","#001f35e6")
            .attr("stroke", "#6c757d")
            .attr("stroke-width", 2);

        let tooltipTitle = tooltipTextContainer
            .append("text")
              .text("test tooltip")
              .attr("class", "tooltip-title")
              .attr("x", 5)
              .attr("y", 16)
              .attr("dy", ".35em")
              .style("fill", "#a5a5a5");

        let tooltipDivider = tooltipTextContainer
            .append("line")
                .attr("class", "tooltip-divider")
                .attr("x1", 0)
                .attr("x2", dv.ttWidth)
                .attr("y1", 31)
                .attr("y2", 31)
                .style("stroke", "#6c757d");

        let tooltipBody = tooltipTextContainer
                .append("g")
                .attr("class","tooltip-body")
                .attr("transform", "translate(5,45)");
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
            .attr("dy", ".35em")
            .call(dv.textWrap, 140, 12);

        tooltipBodyItem.append("text")
            .attr("class", "tp-text-right")
            .attr("x", "10")
            .attr("dy", ".35em")
            .attr("dx", dv.ttWidth - 90)
            .attr("text-anchor","end");

        tooltipBodyItem.append("text")
            .attr("class", "tp-text-indicator")
            .attr("x", "10")
            .attr("dy", ".35em")
            .attr("dx", dv.ttWidth - 25)
            .attr("text-anchor","end");

        tooltipBodyItem.append("circle")
            .attr("class", "tp-circle")
            .attr("r", "6")
            .attr("fill", dv.colour(d))
            .attr("stroke","#ffffff");
        
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
        dv.ttHeight += height + 2;
        dv.g.select(".tooltip-container").attr("height", dv.ttHeight);
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
            ttX = mouseX + 10;
        } else {
            // show left
            ttX = mouseX -290
        }
        return [ttX, ttY];
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
                            .attr("x", xpos)
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
                .attr('y1', (d) => dv.y(d))
                .attr('y2', (d) => dv.y(d));
    }

    formatValue(format){
        // formats thousands, Millions, Euros and Percentage
        switch (format){
            case "millions":
                return d3.format(".2s");
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
        let dv = this;
        value ? dv.g.selectAll(".tp-text-indicator").style("display", "none") : dv.g.selectAll(".tp-text-indicator").style("display", "block")
    }

    addBaseLine(value){
        let chart = this;
        
        chart.gridLines.append("line")
            .attr("x1", 0)
            .attr("x2", chart.width)
            .attr("y1", chart.y(value))
            .attr("y2", chart.y(value))
            .attr("stroke", "#dc3545");

    }

    //replacing old legend method with new inline labels
    drawLegend() {
        // chart object
        let chart = this,
            v = chart.value,
            c = chart.colour;
        
        // data values for last readable value
        const lines = chart.data.map(d => {
            let obj = {},
                vs = d.values.filter(idFilter),
                s = vs.length -1;
                obj.key = d.key;
                obj.last = vs[s][v];
                obj.x = chart.x(vs[s].date);
                obj.y = chart.y(vs[s][v])
            return obj;
        });

        // Add labels
        const legendNames = chart.g.selectAll(".label-legend").data(lines, d => d.y);
              legendNames.exit().remove();

        const legendGroup = legendNames.enter().append("g")
                .attr("class", "label-legend")
                .attr("transform", d => "translate(" + d.x + ", " + d.y + ")");
            
            legendGroup.append("text")
                .attr("class", "legendText")
                .text(d => d.key)
                .attr("fill", d => c(d.key))
                .attr("alignment-baseline", "middle")
                .attr("dx", ".5em")
                .attr("x", 5);
            
            legendGroup.append("circle")
                .attr("class", "l-circle")
                .attr("r", "6")
                .attr("fill", d => c(d.key))
                .attr("stroke","#ffffff");

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
