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
        let dv = this,
            elementNode = d3.select(dv.element).node(),
            elementWidth = elementNode.getBoundingClientRect().width,
            aspectRatio = elementWidth < 800 ? elementWidth * 0.55 : elementWidth * 0.5;

            d3.select(dv.element).select("svg").remove();
            
        const breakPoint = 678;
        
        // margin
        dv.margin = { };

        dv.margin.top = elementWidth < breakPoint ? 30 : 50;
        dv.margin.bottom = elementWidth < breakPoint ? 30 : 60;

        dv.margin.right = elementWidth < breakPoint ? 12.5 : 150;
        dv.margin.left = elementWidth < breakPoint ? 20 : 80;
        
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

        // default transition 
        dv.t = () => { return d3.transition().duration(1000); };
        dv.ease = d3.easeQuadInOut;
        
        // dv.colourScheme = ["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8",'#1d91c0','#225ea8','#0c2c84'];
        
        // default colourScheme
        dv.cScheme = dv.cScheme ? dv.cScheme : d3.schemeBlues[9].slice(4);
        
        // colour function
        dv.colour = d3.scaleOrdinal(dv.cScheme);

        // bisector for tooltip
        dv.bisectDate = d3.bisector(d => { return (d[dv.date]); }).left;

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
            .attr("y", dv.height + 50)
            .attr("text-anchor", "start")
            .text(dv.titleX);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (dv.height/2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);

        // call the legend method
        dv.addLegend();
    }

    // pass the data and the nest value
    getData(_data, _tX, _tY, yScaleFormat){
        let dv = this;
            dv.yScaleFormat = dv.formatValue(yScaleFormat);
            
            _tX ? dv.titleX = _tX: dv.titleX = dv.titleX;
            _tY ? dv.titleY = _tY: dv.titleY = dv.titleY;
            
            dv.nestedData =_data;
            // dv.tickNumber =  dv.nestedData.length;
            dv.createScales();
    }

    createScales(){
        let dv = this;

        // set scales
        dv.x = d3.scaleTime().range([0, dv.width]);
        dv.y = d3.scaleLinear().range([dv.height, 0]);

        // get the the combined max value for the y scale
        let maxDateVal = d3.max(dv.nestedData, d => {
            let vals = d3.keys(d).map(key => { 
                return key === dv.date || typeof d[key] === 'string' ? 0:d[key];
                // return key !== dv.date ? d[key] : 0;
            });
            return d3.sum(vals);
        });

        // Update scales
        dv.x.domain(d3.extent(dv.nestedData, (d) => { return (d[dv.date]); }));
        dv.y.domain([0, maxDateVal]);

        dv.drawGridLines();

        // Update axes
        dv.tickNumber !== "undefined" ? dv.xAxisCall.scale(dv.x).ticks(dv.tickNumber).tickFormat( (d,i) => {
            return i < dv.tickNumber ? dv.nestedData[i].label : ""; }) : dv.xAxisCall.scale(dv.x);

        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);

        dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);
        
        dv.arealine = d3.line()
            .defined(function(d) { return !isNaN(d[1]); })
            // .curve(dv.area.curve())
            .x(d => { return dv.x(d.data[dv.date]); })
            .y(d => { return dv.y( d[1]); });


        // d3 area function
         dv.area = d3.area()
            .defined(function(d) { return !isNaN(d[1]); })
            .x(function(d) { return dv.x(d.data[dv.date]); })
            .y0(function(d) { return dv.y(d[0]); })
            .y1(function(d) { return dv.y( d[1]); });

         // d3 stack function
        dv.stack = d3.stack().keys(dv.keys);
        dv.data = (dv.stack(dv.nestedData));

        dv.update();
    }

    update(){
        let dv = this;
            d3.select(dv.element).select(".focus").remove();
            d3.select(dv.element).select(".focus_overlay").remove();
            dv.g.selectAll(".region")
                .transition(dv.t())
                .style("opacity", 0)
                .remove(); // cheap fix for now

        // select all regions and join data with old
        dv.regions = dv.g.selectAll(".area")
            .data(dv.data, d => { return d})
            .enter()
                .append("g")
                    .attr("class","region");
        
        // remove old data not working
        // dv.regions
        //     .exit()
        //     .transition(dv.t())
        //     .style("opacity", 0)
        //     .remove();

        dv.regions
            .append("path")
            .attr("class", "area")
            .attr("d", dv.area)
            .style("fill-opacity", 0.75)
            .style("fill", (d) => {return dv.colour(d.key);}) ;
            
    
        dv.regions
            .append("path")
            .attr("class", "area-line")
            .attr("d", dv.arealine)
            .style("stroke", (d) => {return dv.colour(d.key);});
            

        // Update
        dv.g.selectAll(".area")
            .data(dv.data)
            .transition(dv.t())
            .attr("d", dv.area)
            .style("fill-opacity", 0.75)
            .style("fill", (d) => {return dv.colour(d.key);});
            
    
        dv.g.selectAll(".area-line")
            .data(dv.data)
            .transition(dv.t())
            .attr("d", dv.arealine);
    
    }

    addLegend(){
        let dv = this;

        // create legend group
        var legend = dv.g.append("g")
            .attr("transform", "translate(0,0)");

        // create legend array, this needs to come from the data.
        dv.legendArray = [];
        
        dv.keys.forEach( (d) => {

            let obj = {};
                obj.label = d;
                obj.colour = dv.colour(d);
                dv.legendArray.push(obj);
        });
        dv.legendArray.reverse();

        // get data and enter onto the legend group
        let legends = legend.selectAll(".legend")
            .data(dv.legendArray)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => { return "translate(0," + i * 40 + ")"; })
            .attr("id", (d,i) => "legend-item" + i )
            .style("font", "12px sans-serif");
        
        // add legend boxes    
        legends.append("rect")
            .attr("class", "legendRect")
            .attr("x", dv.width + 10)
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.75);

        legends.append("text")
            .attr("class", "legendText")
            // .attr("x", dv.width + 40)
            .attr("y", 12)
            .attr("dy", ".025em")
            .attr("text-anchor", "start")
            .text(d => { return d.label; })
            .call(dv.textWrap, 110, dv.width + 34); 
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

    addTooltip(title, format, arrowChange){

        let dv = this;
            // ttData = data;
            dv.arrowChange = arrowChange;
            dv.ttTitle = title;
            dv.valueFormat = format;
            dv.ttWidth = 280,
            dv.ttHeight = 50,
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");

            // formats thousands, Millions, Euros and Percentage

        // add group to contain all the focus elements
        let focus = dv.g.append("g")
                .attr("class", "focus")
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
                .attr("class", "bcd-tooltip tool-tip")
                // .attr("width", dv.ttWidth)
                .attr("height", dv.ttHeight);
            
        let toolGroup =  bcdTooltip.append("g")
                .attr("class", "tooltip-group")
                .style("visibility", "hidden");

            dv.drawTooltip();
            
            // attach group append circle and text for each region

            // let reverseData = dv.keys;
            // reverseData.reverse();

            dv.keys.forEach( (d,i) => {
                
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
                .on("mouseover", () => { 
                    focus.style("display", null); 
                    bcdTooltip.style("display", "inline");
                }, {passive:true})
                .on("touchstart", ()=>{
                    focus.style("display", null); 
                    bcdTooltip.style("display", "inline");
                },{passive:true})
                .on("mouseout", () => { 
                    focus.style("display", "none"); 
                    bcdTooltip.style("display", "none");
                }, {passive:true})
                .on("touchmove", mousemove, {passive:true})
                .on("mousemove", mousemove, {passive:true});
            
            function mousemove(){
                focus.style("visibility","visible");
                toolGroup.style("visibility","visible");

                let mouse = d3.mouse(this),
            
                    ttTextHeights = 0,
                    x0 = dv.x.invert(mouse[0]),
                    i = dv.bisectDate(dv.nestedData, x0, 1), // use the bisect for linear scale.
                    d0 = dv.nestedData[i - 1],
                    d1 = dv.nestedData[i],
                    d,
                    dPrev;  

                d1 !== undefined ? d = x0 - d0[dv.date] > d1[dv.date] - x0 ? d1 : d0 : false;
                d1 !== undefined ? dPrev = x0 - d0[dv.date] > d1[dv.date] - x0 ? dv.nestedData[i-1] : dv.nestedData[i-2] : false;
            
                let length = dv.keys.length - 1;
                
                dv.keys.forEach( (reg,idx) => {
                    
                    let reverseIndex = (length-idx),
                        dvalue = dv.data[reverseIndex],
                        key = dv.keys[reverseIndex],
                        id = ".tooltip_" + reverseIndex,
                        tpId = ".tooltipbody_" + reverseIndex,
                        ttTitle = dv.g.select(".tooltip-title"),
                        dd0 = dvalue[i - 1],
                        dd1 = dvalue[i],
                        dd,
                        unText = "unavailable",
                        difference = dPrev ? (d[key] -  dPrev[key])/dPrev[key]: 0,
                        indicatorColour,
                        indicatorSymbol = difference > 0 ? " ▲" : difference < 0 ? " ▼" : "",
                        diffPercentage = isNaN(difference) ? unText :d3.format(".1%")(difference),
                        rateString = (diffPercentage + " " +indicatorSymbol),
                        tooltip,
                        tooltipBody,
                        textHeight;

                    if(dv.arrowChange === true){
                        indicatorColour = difference < 0 ? "#20c997" : difference > 0 ? "#da1e4d" : "#f8f8f8";
                    }
                    else{
                        indicatorColour = difference > 0 ? "#20c997" : difference < 0 ? "#da1e4d" : "#f8f8f8";
                    }

                    tooltip = d3.select(dv.element).select(id);
                    tooltipBody = d3.select(dv.element).select(tpId);
                    textHeight = tooltipBody.node().getBBox().height ? tooltipBody.node().getBBox().height : 0;
                    tooltipBody.attr("transform", "translate(5," + ttTextHeights +")");
                        
 
                    if(d !== undefined){
                        
                        dv.updatePosition(dv.x(d[dv.date]), 0);

                        dd1 !== undefined ? dd = x0 - dd0.data[dv.date] > dd1.data[dv.date] - x0 ? dd1 : dd0 : false;

                        tooltip.attr("transform", "translate(" + dv.x(d[dv.date]) + "," + dv.y(dd[1] ? dd[1]: 0 ) + ")");
                        tooltipBody.select(".tp-text-right").text(isNaN(d[key]) ? "" : d[key]);
                        tooltipBody.select(".tp-text-indicator")
                            .text(rateString)
                            .attr("fill",indicatorColour);
                        ttTitle.text(dv.ttTitle + " " + (d.label)); //label needs to be passed to this function 
                        focus.select(".focus_line").attr("transform", "translate(" + dv.x((d[dv.date])) + ", 0)");
                    }

                    ttTextHeights += textHeight + 6;
                });
            }
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
                // .style("transform", "translateY(8px)")
                .attr("transform", "translate(5,45)");
    }

    updateTooltip(d,i){
        let dv = this;

        let tooltip = dv.g.select(".focus-circles")
            .append("g")
            .attr("class", "tooltip_" + i);

            tooltip.append("circle")
                .attr("r", 0)
                .transition(dv.t)
                .attr("r", 5)
                .attr("fill", dv.colour(d))
                .attr("stroke", dv.colour(d));

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
        
        dv.updateTTSize();
    }

    updatePosition(xPosition, yPosition){
        let dv = this;
        // get the x and y values - y is static
        let [tooltipX, tooltipY] = dv.getTooltipPosition([xPosition, yPosition]);
        // move the tooltip
        dv.g.select(".bcd-tooltip").attr("transform", "translate(" + tooltipX + ", " + tooltipY +")");
    }

    updateTTSize(){
        let dv = this;
        let h = dv.g.select(".tooltip-body").node().getBBox().height;
        dv.ttHeight += h + 4;
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
        if (mouseX < dv.width - dv.ttWidth) {
            ttX = mouseX + 10;
        } else {
            // show left
            ttX = mouseX - 290
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

    // nestData(data, date, name, value){
    //     let nested_data = d3.nest()
    //         .key(function(d) { return d[date]; })
    //         .entries(data); // its the string not the date obj

    //         console.log("data before split into objects HAHAHA",nested_data);

    //     let mqpdata = nested_data.map(function(d){
    //         let obj = {
    //             label: d.key
    //         }
    //             d.values.forEach(function(v){
    //             obj[v[name]] = v[value];
    //             obj.date = v.date;
    //         })
    //     return obj;
    //   })
    //   console.log("this is the data sent", mqpdata);
    //   return mqpdata;
    // }

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

pagination(_data, _selector, _sliceBy, _pageNumber, _label, _text, _format, _arrow){

    const chartObj = this;
    
    const slices = chartObj.slicer( _data, _sliceBy ), 
          times =  _pageNumber,
          startSet = slices(times - 1);
          
        //  let newStart = [];
        //  startSet.length < _sliceBy ? newStart = _data.slice(50 - _sliceBy) : newStart = startSet;

          d3.selectAll(".pagination-holder").remove();

    let moreButtons = d3.select(_selector)
        .append("div")
        .attr("class", "pagination-holder text-center pb-2");

        chartObj.getData(startSet);
        chartObj.addTooltip(_text,_format ,_arrow);

    for(let i=0; i<times; i++){
        // let wg = slices(i)
            // wg.length < _sliceBy ? wg = _data.slice(50 - _sliceBy) : wg;
        
        let wg = slices(i),
            sliceNumber = _sliceBy - 1,
            secondText;

            if (typeof wg[sliceNumber] != 'undefined'){
                secondText = wg[sliceNumber]
            }
            else{
                let lastEl = wg.length - 1;
                    secondText = wg[lastEl];
            }

        let textString = _label === "year" ? wg[sliceNumber][_label] : wg[0][_label] + " - " + secondText[_label];

        moreButtons.append("button")
            .attr("type", "button")
            .attr("class", i === times -1 ? "btn btn-page mx-1 active" : "btn btn-page")
            .style("border-right", i === times -1 ? "none" : "1px Solid #838586")
        // .text(_label + " " + (1+(i*_sliceBy)) +" - "+ ((i+1)*_sliceBy)) // pass this to the function
            .text(textString)
            .on("click", function(){
            if(!$(this).hasClass("active")){
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                    chartObj.getData(wg);
                    chartObj.addTooltip(_text, _format, _arrow);
                }
            });
        }
    }

}


