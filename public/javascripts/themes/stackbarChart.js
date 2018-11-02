class StackBarChart {

    constructor(_element, _data, _columns, _yTitle, _xTitle){

        this.element = _element;
        this.data = _data;
        this.columns = _columns;
        this.yTitle = _yTitle;
        this.xTitle = _xTitle;

        this.init();
    }

    init(){
        let dv = this,
            elementNode = d3.select(dv.element).node(),
            elementWidth = elementNode.getBoundingClientRect().width,
            aspectRatio = elementWidth < 800 ? elementWidth * 0.55 : elementWidth * 0.5;

            d3.select(dv.element).select("svg").remove();
            
        const breakPoint = 678;
        
        // margin
        dv.margin = { };

        dv.margin.top = elementWidth < breakPoint ? 10 : 50;
        dv.margin.bottom = elementWidth < breakPoint ? 30 : 60;

        dv.margin.right = elementWidth < breakPoint ? 12.5 : 100;
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

        // stack function
        dv.stack = d3.stack().keys(dv.columns);
        // dv.colourScheme = ["#aae0fa","#00929e","#da1e4d","#ffc20e","#16c1f3","#086fb8","#003d68"];
        
        // default colourScheme
        dv.colourScheme =d3.schemeBlues[9].slice(4);

        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme);

        // set scales functions
        dv.x = d3.scaleBand()
            .range([0, dv.width])
            .padding(0.2);

        dv.y = d3.scaleLinear()
            .range([dv.height, 0]);

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
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.xTitle);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (dv.height/2))
            .attr("y", -50)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.yTitle);

        // Scale for Y
        dv.scaleY;
        
        dv.getData();
    
    }

    getData(){

        let dv = this;
        

        dv.update();
    }

    update(){
        let dv = this;

        dv.series = dv.stack(dv.data);

        // transition 
        const t = () => { return d3.transition().duration(1000); };

        const yAxisCall = d3.axisLeft();
        const xAxisCall = d3.axisBottom();

        // console.log("income data", dv.series);

        dv.x.domain(dv.data.map( d => {
            // console.log("x domain date list: ", d.date);
            return d.date;
        }));

        // have a check to see what domain values to use
        dv.y.domain([0, d3.max(
            dv.series, d => { return d3.max(d, d => { return d[1]; }); 
        })]).nice();

        // dv.y.domain([0, 100]);
        dv.drawGridLines();

        xAxisCall.scale(dv.x);
        dv.xAxis.transition(t()).call(xAxisCall);

        dv.yScaleFormat = dv.formatValue(dv.scaleY); //move to getData
        dv.yScaleFormat !== "undefined" ? yAxisCall.scale(dv.y).tickFormat(dv.yScaleFormat ) : yAxisCall.scale(dv.y);
        yAxisCall.scale(dv.y);
        dv.yAxis.transition(t()).call(yAxisCall);

        dv.layers = dv.g.selectAll(".stack")
                .data(dv.series)
                .enter().append("g")
                .attr("class", "stack")
                .attr("fill", d => {
                    return dv.colour(d.key); 
                    })
                .style("fill-opacity", 0.75);
            
        dv.layers.selectAll("rect")
            .data( d => { return d; })
            .enter().append("rect")
                .attr("x", d => { 
                    return dv.x(d.data.date); 
                })
                .attr("y", d => { 
                    return dv.y(d[1]); 
                })
                .attr("height", d => { return dv.y(d[0]) - dv.y(d[1]);})
                .attr("width", dv.x.bandwidth())
                .style("stroke-width", "1");
        
        dv.addLegend();
    }

    addLegend(){
        let dv =this;

        // create legend group
        let legend = dv.layers.append("g")
        // .attr("transform", "translate(0,0)");

            .attr("transform", d => { 
                    let size = d.length -1;
                    console.log("do something", dv.x.bandwidth());
                    return "translate("
                        + (dv.x(d[size].data.date) + dv.x.bandwidth() + 6)
                        + "," 
                        + ((dv.y(d[size][0]) + dv.y(d[size][1])) / 2) 
                        + ")"; 
                    }
                );

                legend.append("line")
                    .attr("x1", -6)
                    .attr("x2", 6)
                    .attr("stroke", "#fff");

                legend.append("text")
                    .attr("x", 9)
                    .attr("dy", "0.35em")
                    .attr("fill", "#fff")
                    .style("font", "10px sans-serif")
                    .text(function(d) { return d.key; })
                    .call(dv.textWrap, 100, 10);
        
        // let legends = legend.selectAll(".legend")
        // .data(dv.columns.reverse())
        // .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", (d, i) => {
        //         return "translate(-1," + i * 30 + ")"; })
        //     .style("font", "12px sans-serif");
        
        // legends.append("rect")
        //     .attr("class", "legendRect")
        //     .attr("x", dv.width + 18)
        //     .attr("width", 18)
        //     .attr("height", 18)
        //     .attr("fill", dv.colour)
        //     .attr("fill-opacity", 0.75);
        
        // legends.append("text")
        //     .attr("class", "legendText")
        //     .attr("x", dv.width + 44)
        //     .attr("y", 9)
        //     .attr("dy", ".1rem")
        //     .attr("text-anchor", "start")
        //     .text(d => { return d; })
        //     .call(dv.textWrap, 100, dv.width + 44);
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

    addTooltip(title, format, date){

        let dv = this;
            dv.datelabel = date;

            dv.tooltip = dv.svg.append("g")
                .classed("tool-tip", true);

            dv.ttTitle = title;
            dv.valueFormat = dv.formatValue(format);
            dv.ttWidth = 280,
            dv.ttHeight = 50,
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");
            dv.hV = 0;

        let bcdTooltip = dv.tooltip.append("g")
                .attr("class", "bcd-tooltip")
                .attr("width", dv.ttWidth)
                .attr("height", dv.ttHeight);
            
            dv.toolGroup =  bcdTooltip.append("g")
                .attr("class", "tooltip-group")
                .style("visibility", "hidden");

            dv.drawTooltip();
            dv.columns.forEach( (d,i) => {
                dv.updateTooltip(d,i);
            });
            dv.totalText();

            dv.layers.selectAll("rect")
            .on("mouseover", function(){ 
                dv.tooltip.style("display", "inline-block"); 
            })
            // .on("touchstart", ()=>{
            //     dv.tooltip.style("display", "inline-block");
            // })
            .on("mouseout", function(){ 
                dv.tooltip.style("display", "none"); 
            })
            // .on("touchmove", d => dv.mousemove(d))
            .on("mousemove", d => dv.mousemove(d));
    }

    mousemove(d){
        let chart=this;

        chart.toolGroup.style("visibility","visible");
        let x = chart.x(d.data.date), 
            y = 100,
            // ttTextHeights = 0,
            bisect = d3.bisector(function(d) { return d.date; }).left,
            i = bisect(chart.data, d.data.date),
            total = 0;

        let tooltipX = chart.getTooltipPosition(x);

        chart.tooltip.attr("transform", "translate("+ tooltipX +"," + y + ")");

        chart.columns.forEach( (reg,idx) => {
                total += chart.data[i][reg];// for the last text total;

            let tpId = ".tooltipbody_" + idx,
                ttTitle = chart.svg.select(".tooltip-title"),
                cur = chart.data[i],
                prev = chart.data[i-1] ? chart.data[i-1] : 0,
                item = chart.columns[idx],
                difference = prev !== 0 ? cur[item] -  prev[item]: 0, 
                indicatorSymbol = difference > 0 ? " ▲" : difference < 0 ? " ▼" : "",
                valueString =  chart.valueFormat !=="undefined"? chart.valueFormat(cur[item]) : cur[item];
                
            let tooltipBody = chart.svg.select(tpId);
                tooltipBody.select(".tp-text-right").text(valueString);
                tooltipBody.select(".tp-text-symbol").text(indicatorSymbol);
                ttTitle.text(chart.ttTitle + " " + (d.data[chart.datelabel]));
        });

        chart.svg.select("#tooltipbody_last .tp-text-right").text(chart.valueFormat !=="undefined"? "Total = " + chart.valueFormat(total) : "Total = " + total);
    }

    totalText(){
        let chart = this,
            h = chart.hV + 10;

        let tooltipLastItem = chart.svg.select(".tooltip-body")
                .append("g")
                .attr("id", "tooltipbody_last")
                .attr("transform", "translate("+ 0 +"," + h + ")");

            tooltipLastItem.append("line")
                .attr("class", "tooltip-divider")
                .attr("x1", 160)
                .attr("x2", 250)
                .attr("y1", -12 )
                .attr("y2", -12 )
                .style("stroke", "#6c757d");
            
            // tooltipLastItem.append("text").text("Total =")
            //     .attr("class", "tp-text-left")
            //     .attr("x", "18")
            //     .attr("dy", ".35em");

            tooltipLastItem.append("text").text("Total =")
                .attr("class", "tp-text-right")
                .attr("x", "18")
                .attr("dy", ".35em")
                .attr("dx", chart.ttWidth - 54)
                .attr("text-anchor","end");

    }

    drawTooltip(){
        let dv = this;

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
                .attr("transform", "translate(5,50)");
    }

    updateTooltip(d,i){
        let dv = this;

        let tooltipBodyItem = dv.svg.select(".tooltip-body")
            .append("g")
            .attr("class", "tooltipbody_" + i)
            .attr("transform", "translate(5," + dv.hV +")");

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
            .attr("dx", dv.ttWidth - 50)
            .attr("text-anchor","end");

        tooltipBodyItem.append("text")
            .attr("class", "tp-text-symbol")
            .attr("x", "10")
            .attr("dy", ".35em")
            .attr("dx", dv.ttWidth - 30)
            .attr("text-anchor","end");

        tooltipBodyItem.append("rect")
            .attr("class", "tp-rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("y", -5)
            .attr("x", -3)
            .attr("fill", dv.colour(d))
            .attr("fill-opacity", 0.75);

        let h = tooltipBodyItem.node().getBBox().height ? tooltipBodyItem.node().getBBox().height : 0;
        
            dv.hV += h + 6;

        // i === dv.columns.length -1 ? dv.totalText() : console.log("not yet");

        dv.updateSize();
    }

    updateSize(){
        let dv = this,
            height = dv.svg.select(".bcd-tooltip").node().getBBox().height;
            dv.svg.select(".tooltip-container").attr("height", height + 26);
    }

    getTooltipPosition(mouseX) {
        let dv = this,
            ttX,
            chartSize;

            chartSize = dv.width  - (dv.margin.right + 88);
            // show right
            if ( mouseX < chartSize) {
                ttX = mouseX + dv.margin.left + dv.x.bandwidth() ;
            }
            else{
                ttX = mouseX - (dv.margin.right + 8);
            } 
            // else {
            //     // show left minus the size of tooltip + 10 padding
            //     ttX = (dv.width + dv.margin.left) - dv.ttWidth;
            //     console.log(mouseX);
            // }
            return ttX;
    }

    formatValue(format){
        // formats thousands, Millions, Euros and Percentage
        switch (format){
            case "millions":
                return function(d){ return d3.format(",")(d) + "M"; }
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

    textWrap(text, width, xpos = 0, limit=2) {
        text.each(function() {
            var words,
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
                        text.classed("adjust-upwards", true);
                    } else {
                        line.push("...");
                        tspan.text(line.join(" "));
                        break;
                    }
                }
            }
        });
    }
}