class GroupedBarChart{

    // constructor function
    constructor (_data, _keys, _xValue, _element, _titleX, _titleY){

        this.data = _data;
        this.keys = _keys;
        this.xValue = _xValue;
        this.element = _element;
        this.titleX = _titleX; // grouped bar chart
        this.titleY = _titleY; // millions

        // create the chart area
        this.init();
    }

    // initialise method to draw chart area
    init(){
        let dv = this,
            elementNode = d3.select(dv.element).node(),
            elementWidth = elementNode.getBoundingClientRect().width,
            aspectRatio = elementWidth < 800 ? elementWidth * 0.85 : elementWidth * 0.5;

        const breakPoint = 678;
        
        // margin
        dv.margin = { };

        dv.margin.top = elementWidth < breakPoint ? 40 : 50;
        dv.margin.bottom = elementWidth < breakPoint ? 30 : 80;

        dv.margin.right = elementWidth < breakPoint ? 20 : 150;
        dv.margin.left = elementWidth < breakPoint ? 20 : 80;
        
        dv.width = elementWidth - dv.margin.left - dv.margin.right;
        dv.height = aspectRatio - dv.margin.top - dv.margin.bottom;

        // add the svg to the target element
        dv.svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = dv.svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");
    
        // transition 
        // dv.t = () => { return d3.transition().duration(1000); }
    
        // dv.colourScheme = ["#aae0fa","#00929e","#da1e4d","#ffc20e","#16c1f3","#086fb8","#003d68"];
        dv.colourScheme =d3.schemeBlues[9].slice(3);

        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme);

        dv.x0 = d3.scaleBand()
            .range([0, dv.width])
            .padding(0.2);

        dv.x1 = d3.scaleBand()
            .paddingInner(0.1);
    
        dv.y = d3.scaleLinear()
            .range([dv.height, 0]);

        dv.yAxisCall = d3.axisLeft();

        dv.xAxisCall = d3.axisBottom()
            .tickFormat(d => {return d});

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
            .attr("text-anchor", "middle")
            .text(dv.titleX);
    
        // Y title
        dv.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (dv.height/2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);
    
        dv.update();
    
    }

    getData(){
        let dv = this;
    
    }
    
    update(){
        let dv = this;

        // Update scales
        dv.x0.domain(dv.data.map(d => {return d[dv.xValue]; }));
        dv.x1.domain(dv.keys).range([0, dv.x0.bandwidth()]);
        dv.y.domain([0, d3.max(dv.data, d => { return d3.max(dv.keys, key => { return d[key]; }); })]).nice();

        // Update axes
        dv.xAxisCall.scale(dv.x0);
        dv.xAxis.call(dv.xAxisCall)
        .selectAll(".tick text").call(dv.textWrap, 60, 0);
        
        dv.yAxisCall.scale(dv.y);
        dv.yAxis.call(dv.yAxisCall);

        dv.drawGridLines();

        // // join new data with old elements.
        // dv.rects = dv.g.selectAll("g")
        //     .data(dv.data);

        // exit old elements not present in new data.
        // dv.rects.exit()
        //     .attr("class", "exit")
        //     // .transition(dv.t())
        //     .attr("height", 0)
        //     .attr("y", dv.height)
        //     .style("fill-opacity", "0.1")
        //     .remove();

        // update old elements present in new data.
        // dv.rects.attr("class", "update")
        //     // .transition(dv.t())
        //         .attr("y", function(d){ return dv.y(d.value); }) // what value here
        //         .attr("height", function(d){ return (dv.height - dv.y(d.value)); }) //what value here
        //         .attr("x", function(d){ return dv.x1(d[dv.xValue]); }) // should this be passed as an opition?
        //         .attr("width", dv.x1.bandwidth);

        // enter new elements present in new data.

        // join new data with old elements.
        dv.rects = dv.g.append("g")
            .selectAll("g")
            .data(dv.data)
            .enter()
            .append("g")
            .attr("class","rect-group")
            .attr("transform", (d) => { return "translate(" + dv.x0(d[dv.xValue]) + ",0)"; })
            .selectAll("rect")
            .data(d => { return dv.keys.map( key => { 
                    return {
                        key: key, 
                        value: d[key],
                        date: d[dv.xValue]
                     }; 
                }); 
            })
            .enter().append("rect")
            .attr("x", d => { return dv.x1(d.key); })
            .attr("y", d => { return dv.y(d.value); })
            .attr("width", dv.x1.bandwidth())
            .attr("height", d => { return (dv.height - dv.y(d.value)); })
            .attr("fill", d => { return dv.colour(d.key); })
            .attr("fill-opacity", ".75");

        dv.addLegend();
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
                .attr('y1', (d) => {return dv.y(d)})
                .attr('y2', (d) => dv.y(d));
    }

    addLegend(){
        let dv = this;

        let legend = dv.g.append("g")
            .attr("transform", "translate(0,0)");

        let legendArray = [];

        dv.keys.forEach((d,i) =>{
            let obj = {};
                obj.label = d;
                obj.colour = dv.colour(d);
                legendArray.push(obj);
        });
        
        let legends = legend.selectAll(".legend")
                .data(legendArray)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i)=> {
                    return "translate(0," + i * 40 + ")"; 
                });

            legends.append("rect")
                .attr("class", "legendRect")
                .attr("x", dv.width + 5)
                .attr("fill", d => { return d.colour; })
                .attr("fill-opacity", 0.75);

            legends.append("text")
                .attr("class", "legendText")
                // .attr("x", dv.width + 30)
                .attr("y", 12)
                .attr("dy", ".0em")
                .attr("text-anchor", "start")
                .text(d => { return d.label; })
                .call(dv.textWrap, 100, dv.width + 30); 
    }

    addTooltip(title, format){

        let dv = this;

            dv.tooltip = dv.svg.append("g")
                .classed("tool-tip", true);

            dv.ttTitle = title;
            dv.valueFormat = format;
            dv.ttWidth = 240,
            dv.ttHeight = 50,
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");

        let bcdTooltip = dv.tooltip.append("g")
                .attr("class", "bcd-tooltip")
                .attr("width", dv.ttWidth)
                .attr("height", dv.ttHeight);
            
        let toolGroup =  bcdTooltip.append("g")
                .attr("class", "tooltip-group")
                .style("visibility", "hidden");

            dv.drawTooltip();
            dv.keys.forEach( (d,i) => {
                console.log(d);
                dv.updateTooltip(d,i);
            });

            dv.g.selectAll("rect")
            .on("mouseover", function(){ 
                dv.tooltip.style("display", "inline-block"); 
            })
            .on("mouseout", function(){ 
                dv.tooltip.style("display", "none"); 
            })
            .on("mousemove", function(d){
                toolGroup.style("visibility","visible");
                // let x = d3.event.pageX, 
                //     y = d3.event.pageY,
                // console.log(dv.x0(d[dv.xValue]) +  dv.x1(d.key));
                let x = dv.x0(d[dv.xValue]), 
                    y = 100,
                    fill = d3.select(this).style("fill"),
                    ttTextHeights = 0,
                    bisect = d3.bisector(function(d) { return d[dv.xValue]; }).left,
                    i = bisect(dv.data, d[dv.xValue]);

                let tooltipX = dv.getTooltipPosition(x);

                dv.tooltip
                    // .style( 'left', (tooltipX + 10) + "px" )
                    // .style( 'top', y + "px" )
                    .attr("transform", "translate("+ tooltipX +"," + y + ")");

                dv.keys.forEach( (reg,idx) => {
                    let tpId = ".tooltipbody_" + idx,
                        ttTitle = dv.svg.select(".tooltip-title");
                        
                    let tooltipBody = dv.svg.select(tpId),
                        textHeight = tooltipBody.node().getBBox().height ? tooltipBody.node().getBBox().height : 0;

                        tooltipBody.attr("transform", "translate(5," + ttTextHeights +")");

                        tooltipBody.select(".tp-text-right").text(dv.data[i][dv.keys[idx]]);
                        ttTitle.text(dv.ttTitle + " " + (d[dv.xValue])); //label needs to be passed to this function 
                        ttTextHeights += textHeight + 6;
                });

                // dv.tooltip.append("text")
                //     .text("The value is: " + (d.value)); 
                
                // dv.tooltip.append("rect")
                //     .attr("class", "tip-box")
                //     .style("background", fill)
                //     .style("opacity", 0.75)
                //     .style("width", "18px")
                //     .style("height", "18px")
                //     .style("margin-right", "5px")
                //     .style("float", "left");
            });
    }

    drawTooltip(){
        let dv = this;
        console.log("this functon is called");
        let tooltipTextContainer = dv.svg.select(".tooltip-group")
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
            .attr("stroke", "#001f35")
            .attr("stroke-width", 3);

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
                .attr("transform", "translate(5,50)");
    }

    updateTooltip(d,i){
        let dv = this;

        let tooltipBodyItem = dv.svg.select(".tooltip-body")
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
            .attr("dx", dv.ttWidth - 40)
            .attr("text-anchor","end");

        tooltipBodyItem.append("circle")
            .attr("class", "tp-circle")
            .attr("r", "6")
            .attr("stroke","#ffffff")
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
        let height = dv.svg.select(".tooltip-body").node().getBBox().height;
        dv.ttHeight += height + 5;
        dv.svg.select(".tooltip-container").attr("height", dv.ttHeight);
    }

    getTooltipPosition(mouseX) {
        let dv = this,
            ttX,
            chartSize,
            key = dv.keys;

            chartSize = dv.width - dv.margin.right - dv.margin.left;
            
            // show right
            if ( mouseX < chartSize + dv.x0.bandwidth()) {
                console.log(chartSize, mouseX);
                ttX = mouseX;
            } else {
                // show left minus the size of tooltip + 10 padding
                ttX = mouseX - 50;
            }
            return ttX;
    }

    textWrap(text, width, xpos = 0, limit=3) {
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
            y = text.attr('y');
            dy = parseFloat(text.attr('dy'));
            tspan = text
                .text(null)
                .append('tspan')
                .attr('x', xpos)
                .attr('y', y)
                .attr('dy', dy + 'em');

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(' '));

                if (tspan.node() && tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));

                    if (lineNumber < limit - 1) {
                        line = [word];
                        tspan = text.append('tspan')
                            .attr('x', xpos)
                            .attr('y', y)
                            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                            .text(word);
                        // if we need two lines for the text, move them both up to center them
                        text.classed('adjust-upwards', true);
                    } else {
                        line.push('...');
                        tspan.text(line.join(' '));
                        break;
                    }
                }
            }
        });
    }
    
}