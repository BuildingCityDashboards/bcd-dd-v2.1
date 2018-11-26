class StackedAreaChart {

    // constructor function
    constructor (_element, _titleX, _titleY, _dateVariable, _keys, _cScheme){

        // load in arguments from config object
        this.element = _element;
        this.titleX = _titleX;
        this.titleY = _titleY;
        this.date = _dateVariable;
        this.keys = _keys;
        this.cScheme = _cScheme;
        
        // create the chart
        this.init();
    }

    // initialise method to draw chart area
    init(){
        let c = this,
            elementNode = d3.select(c.element).node(),
            elementWidth = elementNode.getBoundingClientRect().width,
            aspectRatio = elementWidth < 800 ? elementWidth * 0.55 : elementWidth * 0.5;

            d3.select(c.element).select("svg").remove();
            
        const breakPoint = 678;
        
        // margin
        c.margin = { };

        c.margin.top = elementWidth < breakPoint ? 40 : 50;
        c.margin.bottom = elementWidth < breakPoint ? 30 : 80;

        c.margin.right = elementWidth < breakPoint ? 20 : 140;
        c.margin.left = elementWidth < breakPoint ? 20 : 60;
        
        c.width = elementWidth - c.margin.left - c.margin.right;
        c.height = aspectRatio - c.margin.top - c.margin.bottom;

        // select parent element and append SVG + g
        c.svg = d3.select(c.element)
            .append("svg")
            .attr("width", c.width + c.margin.left + c.margin.right)
            .attr("height", c.height + c.margin.top + c.margin.bottom);

        c.g = c.svg.append("g")
            .attr("transform", "translate(" + c.margin.left + 
                ", " + c.margin.top + ")");

        // default transition 
        c.t = () => { return d3.transition().duration(1000); };
        c.ease = d3.easeQuadInOut;
        
        // c.colourScheme = ["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8",'#1d91c0','#225ea8','#0c2c84'];
        
        // default colourScheme
        c.cScheme = c.cScheme ? c.cScheme : d3.schemeBlues[5].slice(1);
        
        // colour function
        c.colour = d3.scaleOrdinal(c.cScheme);

        // bisector for tooltip
        c.bisectDate = d3.bisector(d => { return (d[c.date]); }).left;

        // tick numbers
        c.tickNumber = "undefined";

        // tick formats
        c.tickFormat = "undefined";

        c.addAxis();
    }

    addAxis(){
        let c = this;

        c.yAxisCall = d3.axisLeft();
        c.xAxisCall = d3.axisBottom();

        c.gridLines = c.g.append("g")
            .attr("class", "grid-lines");

        c.xAxis = c.g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + c.height +")");

        c.yAxis = c.g.append("g")
            .attr("class", "y-axis");

        // X title
        c.xLabel = c.g.append("text")
            .attr("class", "titleX")
            .attr("x", c.width/2)
            .attr("y", c.height + 50)
            .attr("text-anchor", "start")
            .text(c.titleX);

        // Y title
        c.yLabel = c.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (c.height/2))
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(c.titleY);

        // call the legend method
        c.addLegend();
        c.drawTooltip();
    }

    // pass the data and the nest value
    getData(_data, _tX, _tY, yScaleFormat){
        let c = this;
            c.yScaleFormat = c.formatValue(yScaleFormat);
            
            _tX ? c.titleX = _tX: c.titleX = c.titleX;
            _tY ? c.titleY = _tY: c.titleY = c.titleY;
            
            c.nestedData =_data;
            // c.tickNumber =  c.nestedData.length;
            c.createScales();
    }

    getKeys(){
        let c = this,
            keys;
            c.colour.domain(c.data.map(d => { return d.key; }));
            keys = c.colour.domain();
        
        return keys.reverse();
    }

    createScales(){
        let c = this;

        // set scales
        c.x = d3.scaleTime().range([0, c.width]);
        c.y = d3.scaleLinear().range([c.height, 0]);

        // get the the combined max value for the y scale
        let maxDateVal = d3.max(c.nestedData, d => {
            let vals = d3.keys(d).map(key => { 
                return key === c.date || typeof d[key] === 'string' ? 0:d[key];
                // return key !== c.date ? d[key] : 0;
            });
            return d3.sum(vals);
        });

        // Update scales
        c.x.domain(d3.extent(c.nestedData, (d) => { return (d[c.date]); }));
        c.y.domain([0, maxDateVal]);

        c.drawGridLines();

        // Update axes
        c.tickNumber !== "undefined" ? 
                    c.xAxisCall.scale(c.x).ticks(c.tickNumber)
                    : c.xAxisCall.scale(c.x);

        c.xAxis.transition(c.t()).call(c.xAxisCall);

        c.yAxisCall.scale(c.y);
        c.yAxis.transition(c.t()).call(c.yAxisCall);
        
        c.arealine = d3.line()
            .defined(function(d) { return !isNaN(d[1]); })
            // .curve(c.area.curve())
            .x(d => { return c.x(d.data[c.date]); })
            .y(d => { return c.y( d[1]); });


        // d3 area function
         c.area = d3.area()
            .defined(function(d) { return !isNaN(d[1]); })
            .x(function(d) { return c.x(d.data[c.date]); })
            .y0(function(d) { return c.y(d[0]); })
            .y1(function(d) { return c.y( d[1]); });

         // d3 stack function
        c.stack = d3.stack().keys(c.keys);
        c.data = (c.stack(c.nestedData));

        c.update();
    }

    update(){
        let c = this;
            d3.select(c.element).select(".focus").remove();
            d3.select(c.element).select(".focus_overlay").remove();
            c.g.selectAll(".region")
                .transition(c.t())
                .style("opacity", 0)
                .remove(); // cheap fix for now

        // select all regions and join data with old
        c.regions = c.g.selectAll(".area")
            .data(c.data, d => { return d})
            .enter()
                .append("g")
                    .attr("class","region");
        
        // remove old data not working
        // c.regions
        //     .exit()
        //     .transition(c.t())
        //     .style("opacity", 0)
        //     .remove();

        c.regions
            .append("path")
            .attr("class", "area")
            .attr("d", c.area)
            .style("fill-opacity", 0.75)
            .style("fill", (d) => {return c.colour(d.key);}) ;
            
    
        c.regions
            .append("path")
            .attr("class", "area-line")
            .attr("d", c.arealine)
            .style("stroke", (d) => {return c.colour(d.key);});
            

        // Update
        c.g.selectAll(".area")
            .data(c.data)
            .transition(c.t())
            .attr("d", c.area)
            .style("fill-opacity", 0.75)
            .style("fill", (d) => {return c.colour(d.key);});
            
    
        c.g.selectAll(".area-line")
            .data(c.data)
            .transition(c.t())
            .attr("d", c.arealine);
    
    }

    addLegend(){
        let c = this;

        // create legend group
        var legend = c.g.append("g")
            .attr("transform", "translate(0,0)");

        // create legend array, this needs to come from the data.
        c.legendArray = [];
        
        c.keys.forEach( (d) => {

            let obj = {};
                obj.label = d;
                obj.colour = c.colour(d);
                c.legendArray.push(obj);
        });
        c.legendArray.reverse();

        // get data and enter onto the legend group
        let legends = legend.selectAll(".legend")
            .data(c.legendArray)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => { return "translate(0," + i * 40 + ")"; })
            .attr("id", (d,i) => "legend-item" + i )
            .style("font", "12px sans-serif");
        
        // add legend boxes    
        legends.append("rect")
            .attr("class", "legendRect")
            .attr("x", c.width + 10)
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.75);

        legends.append("text")
            .attr("class", "legendText")
            // .attr("x", c.width + 40)
            .attr("y", 12)
            .attr("dy", ".025em")
            .attr("text-anchor", "start")
            .text(d => { return d.label; })
            .call(c.textWrap, 110, c.width + 34); 
    }

    drawGridLines(){
        let c = this;

        c.gridLines.selectAll('line')
            .remove();

        c.gridLines.selectAll('line.horizontal-line')
            .data(c.y.ticks)
            .enter()
                .append('line')
                .attr('class', 'horizontal-line')
                .attr('x1', (0))
                .attr('x2', c.width)
                .attr('y1', (d) => { return c.y(d) })
                .attr('y2', (d) => c.y(d));
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
            .attr("class", "bcd-rect");

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
                
            div.append("span").attr("class", "bcd-rect");

            p = div.append("p").attr("class","bcd-text");

            p.append("span").attr("class","bcd-text-title");
            p.append("span").attr("class","bcd-text-value");
            p.append("span").attr("class","bcd-text-rate");
            p.append("span").attr("class","bcd-text-indicator");
        });
    }

    drawFocus(){
        let c = this,
            g = c.g; 
        
            c.focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none")
                .style("visibility", "hidden");
        
            c.drawFocusLine();
            c.drawFocusOverlay();
    }

    drawFocusLine(){
        let c = this,
            focus = c.focus;
            
            // Focus line
            focus.append("line")
                .attr("class", "focus_line")
                .attr("y1", 0)
                .attr("y2", c.height);
        
            c.drawFocusCircles();
    }

    drawFocusCircles(){
        let c = this,
            focus = c.focus,
            // keys = c.getKeys(),

            focusCircles = focus.append("g")
                .attr("class", "focus_circles");

            // attach group append circle and text for each region
            c.keys.forEach( (d,i) => {

                focusCircles.append("g")
                    .attr("class", "tooltip_" + i)
                        .append("circle")
                            .attr("r", 0)
                            .transition(c.t)
                            .attr("r", 5)
                            .attr("fill", c.colour(d))
                            .attr("stroke", c.colour(d));

            });
    }

    addTooltip(title, format, dateField, prefix, postfix){
        let c = this;

            d3.select(c.element).select(".focus").remove();
            d3.select(c.element).select(".focus_overlay").remove();

            c.ttTitle = title || c.ttTitle;
            c.valueFormat = format || c.valueFormat;
            c.dateField = dateField || c.dateField;
            // c.arrowChange = arrowChange;
            c.ttWidth = 305;
            c.prefix = prefix ? prefix : " ";
            c.postfix = postfix ? postfix: " ";
            c.valueFormat = c.formatValue(c.valueFormat);

            c.drawFocus();
    }   
    
    drawFocusOverlay(){
        let c = this,
            g = c.g,
            focus = c.focus,
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
                    i = c.bisectDate(c.nestedData, x0, 1),
                    d0 = c.nestedData[i - 1],
                    d1 = c.nestedData[i],
                    d,
                    dPrev,
                    keys = c.getKeys(); 

                    d1 !== undefined ? d = x0 - d0[c.date] > d1[c.date] - x0 ? d1 : d0 : false;
                    d1 !== undefined ? dPrev = x0 - d0[c.date] > d1[c.date] - x0 ? c.nestedData[i-1] : c.nestedData[i-2] : false;
                
                keys.forEach((reg,idx) => {
                    let dvalue = c.data[idx],
                        key = reg,
                        id = "#bcd-tt" + idx,
                        div = c.newToolTip.select(id),
                        p = div.select(".bcd-text"),
                        dd0 = dvalue[i - 1],
                        dd1 = dvalue[i],
                        dd,
                        unText = "N/A",
                        difference = dPrev ? (d[key] -  dPrev[key])/dPrev[key]: 0,
                        indicatorColour,
                        indicator = difference > 0 ? " ▲" : difference < 0 ? " ▼" : "",
                        rate = isNaN(difference) ? unText :d3.format(".1%")(difference);

                    if(c.arrowChange === true){
                        indicatorColour = difference < 0 ? "#20c997" : difference > 0 ? "#da1e4d" : "#f8f8f8";
                    }
                    else{
                        indicatorColour = difference > 0 ? "#20c997" : difference < 0 ? "#da1e4d" : "#f8f8f8";
                    }

                    if(d !== undefined){
                        let dot = ".tooltip_" + idx,
                        tooltip = focus.select(dot);
                        
                        c.updatePosition(c.x(d[c.date]), 80);

                        dd1 !== undefined ? dd = x0 - dd0.data[c.date] > dd1.data[c.date] - x0 ? dd1 : dd0 : false;

                        div.style("opacity", 1);
                        div.select(".bcd-dot").style("background-color", c.colour(d.key));
                        p.select(".bcd-text-title").text(key);
                        p.select(".bcd-text-value").text(isNaN(d[key]) ? "N/A" : d[key]);
                        p.select(".bcd-text-rate").text(rate);
                        p.select(".bcd-text-indicator").text(" " + indicator).style("color", indicatorColour);

                        c.newToolTipTitle.text(c.ttTitle + " " + (d[c.dateField]));

                        tooltip.attr("transform", "translate(" + c.x(d[c.date]) + "," + c.y(dd[1] ? dd[1]: 0 ) + ")");
                        focus.select(".focus_line").attr("transform", "translate(" + c.x((d[c.date])) + ", 0)");
                    }
                });
            }

        }

    OlddrawTooltip(){
        let c = this;

        let tooltipTextContainer = c.g.select(".tooltip-group")
          .append("g")
            .attr("class","tooltip-text")
            .attr("fill","#f8f8f8");

        let tooltip = tooltipTextContainer
            .append("rect")
            .attr("class", "tooltip-container")
            .attr("width", c.ttWidth)
            .attr("height", c.ttHeight)
            .attr("rx", c.ttBorderRadius)
            .attr("ry", c.ttBorderRadius)
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
                .attr("x2", c.ttWidth)
                .attr("y1", 31)
                .attr("y2", 31)
                .style("stroke", "#6c757d");

        let tooltipBody = tooltipTextContainer
                .append("g")
                .attr("class","tooltip-body")
                .attr("transform", "translate(5,45)");
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

    updateTTSize(){
        let c = this;
        let h = c.g.select(".tooltip-body").node().getBBox().height;
            c.ttHeight += h + 4;
            c.g.select(".tooltip-container").attr("height", c.ttHeight);
    }

    resetSize() {
        let c = this;
            c.ttHeight = 50;
    }

    getTooltipPosition([mouseX, mouseY]) {
        let c = this;
        let ttX,
            ttY = mouseY,
            cSize = c.width - c.ttWidth;

        // show right - 60 is the margin large screens
        if (mouseX < cSize) {
            ttX = mouseX + 105;
        } else {
            // show left - 60 is the margin large screens
            ttX = (mouseX + 90) - c.ttWidth;
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

slicer( arr, sliceBy ){
    if ( sliceBy < 1 || !arr ) return () => [];
    
    return (p) => {
        const base = p * sliceBy,
              size = arr.length;

        let slicedArray = p < 0 || base >= arr.length ? [] : arr.slice( base,  base + sliceBy );
            
            if (slicedArray.length < (sliceBy/2)) return slicedArray = arr.slice(size - sliceBy);
            
            return slicedArray;
    };
}

pagination(data, selector, sliceBy, pageNumber, label){

    const c = this;
    
    const slices = c.slicer( data, sliceBy ), 
          times =  pageNumber,
          startSet = slices(times - 1);
          
        //  let newStart = [];
        //  startSet.length < sliceBy ? newStart = data.slice(50 - sliceBy) : newStart = startSet;

        d3.selectAll(selector + " .pagination-holder").remove();

    let moreButtons = d3.select(selector)
        .append("div")
        .attr("class", "pagination-holder text-center pb-2");

        c.getData(startSet);
        c.addTooltip();

    for(let i=0; i<times; i++){
        // let wg = slices(i)
            // wg.length < sliceBy ? wg = data.slice(50 - sliceBy) : wg;
        
        let wg = slices(i),
            sliceNumber = sliceBy - 1,
            secondText;

            if (typeof wg[sliceNumber] != 'undefined'){
                secondText = wg[sliceNumber]
            }
            else{
                let lastEl = wg.length - 1;
                    secondText = wg[lastEl];
            }

        let textString = wg[0][label] + " - " + secondText[label];

        moreButtons.append("button")
            .attr("type", "button")
            .attr("class", i === times -1 ? "btn btn-page mx-1 active" : "btn btn-page")
            .style("border-right", i === times -1 ? "none" : "1px Solid #838586")
        // .text(label + " " + (1+(i*sliceBy)) +" - "+ ((i+1)*sliceBy)) // pass this to the function
            .text(textString)
            .on("click", function(){
            if(!$(this).hasClass("active")){
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                    c.getData(wg);
                    c.addTooltip();
                }
            });
        }


    }

    showSelectedLabels(array){
        let c = this, 
            e = c.xAxis;
            c.axisArray = array || c.axisArray;

            e.selectAll(".x-axis .tick")
            .style("display", "none");

        c.axisArray.forEach( n => {
            d3.select(  e._groups[0][0].childNodes[n])
            .style("display", "block");
        })

    }

}


