class StackBarChart {

    constructor(obj){

        this.d = obj.d;
        this.e = obj.e;
        this.k = obj.k;
        this.ks = obj.ks;
        this.xV = obj.xV;
        this.yV = obj.yV;
        this.tY = obj.tY;
        this.tX = obj.tX;
        this.cS = obj.c;
        this.sFY = obj.sFY;

        this.init();
    }

    init(){
        let c = this,
            eN = d3.select(c.e).node(),
            eW = eN.getBoundingClientRect().width,
            aR = eW < 800 ? eW * 0.55 : eW * 0.5,
            bP = 678;
            c.eN = eN;
            d3.select(c.e).select("svg").remove();
        
        // margin
        c.m = { };

        c.m.t = eW < bP ? 10 : 50;
        c.m.b = eW < bP ? 30 : 80;

        c.m.r = eW < bP ? 12.5 : 140;
        c.m.l = eW < bP ? 20 : 60;
        
        c.width = eW - c.m.l - c.m.r;
        c.height = aR - c.m.t - c.m.b;
        
        // default colour Scheme
        c.cS = c.cS || d3.schemeBlues[9].slice(4);

        // set colour function
        c.colour = d3.scaleOrdinal(c.cS);

        c.initTooltip();

        // add the svg to the target element
        c.svg = d3.select(c.e)
            .append("svg")
            .attr("width", c.width + c.m.l + c.m.r)
            .attr("height", c.height + c.m.t + c.m.b);
       
        // add the g to the svg and transform by top and left m
        c.g = c.svg.append("g")
            .attr("transform", "translate(" + c.m.l + 
                ", " + c.m.t + ")");

        // set scales functions
        c.x = d3.scaleBand()
            .range([0, c.width])
            .padding(0.2);

        c.y = d3.scaleLinear()
            .range([c.height, 0]);

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
            .attr("y", c.height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(c.tX);

        // Y title
        c.yLabel = c.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (c.height/2))
            .attr("y", -45)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(c.tY);
        
        c.stackData();
    
    }

    stackData(){
        let chart = this,
            data = chart.d,
            keys,
            groupData,
            stack = d3.stack();

            chart.colour.domain(data.map(d => { return d[chart.k]; }));
            keys = chart.colour.domain();

            groupData = d3.nest()
                .key(d => { return d[chart.xV] })
                .rollup((d, i) => {
                    const d2 = {
                        [chart.xV]: d[0][chart.xV]
                    };
                    d.forEach(d => {
                        d2[d.type] = d[chart.yV];
                    });
                return d2;
                })
                .entries(data)
                .map(d => { return d[chart.yV]; });

        chart.stackD = stack.keys(keys)(groupData);
        chart.keys = keys.reverse();
        chart.gData = groupData;
        
        chart.update();
    }

    update(){
        let c = this;

        // transition 
        const t = () => { return d3.transition().duration(1000); };

        const yAxisCall = d3.axisLeft();
        const xAxisCall = d3.axisBottom();

        c.x.domain(c.d.map( d => {
            return d[c.xV];
        }));

        // have a check to see what domain values to use
        c.y.domain([0, d3.max(
            c.stackD, d => { return d3.max(d, d => { return d[1]; }); 
        })]).nice();

        // c.y.domain([0, 100]);
        c.drawGridLines();

        xAxisCall.scale(c.x);
        c.xAxis.transition(t()).call(xAxisCall);

        c.yScaleFormat = c.formatValue(c.sFY); //move to getData
        c.yScaleFormat !== "undefined" ? yAxisCall.scale(c.y).tickFormat(c.yScaleFormat ) : yAxisCall.scale(c.y);
        yAxisCall.scale(c.y);
        c.yAxis.transition(t()).call(yAxisCall);

        c.layers = c.g.selectAll(".stack")
                .data(c.stackD)
                .enter().append("g")
                .attr("class", "stack")
                .attr("fill", d => {
                    return c.colour(d.key); 
                    })
                .style("fill-opacity", 0.75);
            
        c.layers.selectAll("rect")
            .data( d => { return d; })
            .enter().append("rect")
                .attr("x", d => { 
                    return c.x(d.data[c.xV]); 
                })
                .attr("y", d => { 
                    return c.y(d[1]); 
                })
                .attr("height", d => { return c.y(d[0]) - c.y(d[1]);})
                .attr("width", c.x.bandwidth())
                .style("stroke-width", "1");
        
        c.addLegend();
    }

    initTooltip(){
        let chart = this,
            keys,
            div,
            p;

            chart.colour.domain(chart.d.map(d => { return d[chart.k]; }));
            keys = chart.colour.domain();

            chart.newToolTip = d3.select(chart.e)
                .append("div")
                .attr("class","tool-tip bcd")
                .style("visibility","hidden");

            chart.newToolTipTitle = chart.newToolTip
                .append("div")
                .attr("id", "bcd-tt-title");

            keys.forEach( (d, i) => {
                div = chart.newToolTip
                        .append("div")
                        .attr("id", "bcd-tt" + i);
                    
                div.append("span").attr("class", "bcd-rect");

                p = div.append("p").attr("class","bcd-text");

                p.append("span").attr("class","bcd-text-title");
                p.append("span").attr("class","bcd-text-value");
                p.append("span").attr("class","bcd-text-rate");
                p.append("span").attr("class","bcd-text-indicator");
            });

        let lastDiv = chart.newToolTip.append("div")
                    .attr("id", "bcd-tt-total"),
            
            lastDot = lastDiv.append("span")
                    .attr("class", "bcd-rect"),

            lastP = lastDiv.append("p")
                    .attr("class","bcd-text");

                lastP.append("span").attr("class","bcd-text-title");
                lastP.append("span").attr("class","bcd-text-value");
                lastP.append("span").attr("class","bcd-text-rate");
                lastP.append("span").attr("class","bcd-text-indicator");

    }

    addLegend(){
        let c =this;

        // create legend group
        let legend = c.layers.append("g")

            .attr("transform", d => { 
                    let size = d.length -1;

                    return "translate("
                        + (c.x(d[size].data[c.xV]) + c.x.bandwidth() + 6)
                        + "," 
                        + ((c.y(d[size][0]) + c.y(d[size][1])) / 2) 
                        + ")"; 
                    }
                );

                legend.append("line")
                    .attr("class", "legend-line")
                    .attr("x1", -6)
                    .attr("x2", 6)
                    .attr("stroke", "#fff");

                legend.append("text")
                    .attr("class", "legendText")
                    .attr("x", 9)
                    .attr("dy", "0.35em")
                    .attr("fill", "#fff")
                    .style("font", "10px sans-serif")
                    .text(function(d) { return d.key; })
                    .call(c.textWrap, 100, 10);
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

    addTooltip(title, format, date){

        let c = this;
            c.datelabel = date;

            c.tooltip = c.svg.append("g")
                .classed("tool-tip", true);

            c.ttTitle = title;
            c.valueFormat = c.formatValue(format);
            c.ttWidth = 290,
            c.ttHeight = 50,
            c.ttBorderRadius = 3;
            c.formatYear = d3.timeFormat("%Y");
            c.hV = 0;

            c.layers.selectAll("rect")
            // .on("mouseover", function(){ 

            // })
            .on("mouseout", function(){
                c.newToolTip.style("visibility","hidden");
            })
            .on("mousemove", d => c.mousemove(d));
    }

    mousemove(d){
        let chart=this,
            pos = d3.mouse(chart.eN),
            x = chart.x(d.data[chart.xV]), 
            y = pos[1],
            total = 0,
            tooltipX = chart.getTooltipPosition(x,y),
            bisect = d3.bisector(function(d) { return d[chart.xV]; }).left,
            i = bisect(chart.gData, d.data[chart.xV]);

        chart.newToolTip.style("visibility","visible");
 
        chart.newToolTip.style('left', tooltipX[0] + "px").style("top", tooltipX[1] +"px");

        chart.keys.forEach( (reg,idx) => {
                total += chart.gData[i][reg];// for the last text total;
        
            let id = "#bcd-tt" + idx,
                div = chart.newToolTip.select(id),
                p = div.select(".bcd-text"),
                unText = "N/A",
                title = chart.newToolTipTitle,
                perc = d3.format(".2%"),
                cur = chart.gData[i],
                prev = chart.gData[i-1] ? chart.gData[i-1] : 0,
                item = chart.keys[idx],
                rV = prev !== 0 ? (cur[item] -  prev[item])/cur[item]: 0,
                r = rV !== 0 ? perc(rV) : "N/A", 
                indicator = rV > 0 ? " ▲" : rV < 0 ? " ▼" : "",
                valueString =  chart.valueFormat !=="undefined"? chart.valueFormat(cur[item]) : cur[item],
                indicatorColour = chart.arrowChange === true ? rV < 0 ?"#20c997" 
                                    : rV > 0 ? "#da1e4d" : "#f8f8f8" 
                                    : rV > 0 ? "#20c997" : rV < 0 ? "#da1e4d" 
                                    : "#f8f8f8";

                title.text(chart.ttTitle + " " + (d.data[chart.datelabel]));
                div.style("opacity", 1);
                div.select(".bcd-rect").style("background-color", chart.colour(reg));
                p.select(".bcd-text-title").text(reg);
                p.select(".bcd-text-value").text(valueString);
                p.select(".bcd-text-rate").text(r);
                p.select(".bcd-text-indicator").text(" " + indicator)
                    .style("color", indicatorColour);
        });
        chart.svg.select("#tooltipbody_last .tp-text-right").text(chart.valueFormat !=="undefined"? "Total = " + chart.valueFormat(total) : "Total = " + total);
        chart.newToolTip.select("#bcd-tt-total .bcd-text-title").text("Total = ").style("text-align","end");
        chart.newToolTip.select("#bcd-tt-total .bcd-text-value").text(chart.valueFormat !=="undefined"? chart.valueFormat(total) : total);
    }

    getTooltipPosition(mouseX, mouseY) {
        let c = this,
            ttX,
            ttY,
            cW,
            cH;

            cW = c.width  - c.ttWidth;
            cH = c.height;

            if ( mouseX < cW) {
                ttX = mouseX + c.m.l + c.x.bandwidth() + 10;
            }
            else{
                ttX = (mouseX + c.m.l + c.x.bandwidth() - 25) - c.ttWidth;
            } 

            if ( mouseY < cH ) {
                ttY = mouseY - 25;
            }
            else{   
                ttY = cH;
            } 

            return [ttX,ttY];
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
                return d3.format(".0%");
                break;
        
            case "percentage2":
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