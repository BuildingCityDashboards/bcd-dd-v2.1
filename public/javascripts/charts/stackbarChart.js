class StackBarChart extends Chart{

    constructor (obj){
        super(obj);

        this.drawChart();
    }

    drawChart(){
        let c = this;

        super.init();
        super.addAxis();
        super.getKeys();
        // c.processData();
        c.stackData();
        super.drawTooltip();
        c.createScales();
        super.drawGridLines();
        c.drawStacks();
        c.drawLegend();            
    }

    updateChart(obj){
        let c = this;

        if(obj){
            c.d = obj.d || c.d;
            c.k = obj.k || c.k;
            c.ks = obj.ks || c.ks;
            c.tX = obj.tX || c.tX;
            c.tY = obj.tY || c.tY;
            c.xV = obj.xV || c.xV;
            c.yV = obj.yV || c.yV;
            c.cS = obj.c || c.cS;
            c.ySF = obj.ySF || c.ySF;
        }

        c.stackData();
        c.createScales();
        c.drawLegend();
    }

    stackData(){
        let c = this,
            data = c.d,
            keys,
            groupData,
            stack = d3.stack();

        keys = c.ks;

        groupData = d3.nest()
            .key(d => { return d[c.xV] })
            .rollup((d, i) => {
                const d2 = {
                    [c.xV]: d[0][c.xV]
                };
                d.forEach(d => {
                    d2[d.type] = d[c.yV];
                });
            return d2;
            })
            .entries(data)
            .map(d => { return d[c.yV]; });

        c.stackD = stack.keys(keys)(groupData);
        c.keys = keys.reverse();
        c.gData = groupData;

    }

    drawStacks(){
        let c = this;

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
    }

    // drawTooltip(){
    //     let c = this,
    //         keys,
    //         div,
    //         p;

    //         c.colour.domain(c.d.map(d => { return d[c.k]; }));
    //         keys = c.colour.domain();

    //         c.newToolTip = d3.select(c.e)
    //             .append("div")
    //             .attr("class","tool-tip bcd")
    //             .style("visibility","hidden");

    //         c.newToolTipTitle = c.newToolTip
    //             .append("div")
    //             .attr("id", "bcd-tt-title");

    //         keys.forEach( (d, i) => {
    //             div = c.newToolTip
    //                     .append("div")
    //                     .attr("id", "bcd-tt" + i);
                    
    //             div.append("span").attr("class", "bcd-rect");

    //             p = div.append("p").attr("class","bcd-text");

    //             p.append("span").attr("class","bcd-text-title");
    //             p.append("span").attr("class","bcd-text-value");
    //             p.append("span").attr("class","bcd-text-rate");
    //             p.append("span").attr("class","bcd-text-indicator");
    //         });

    //     let lastDiv = c.newToolTip.append("div")
    //                 .attr("id", "bcd-tt-total"),
            
    //         lastDot = lastDiv.append("span")
    //                 .attr("class", "bcd-rect"),

    //         lastP = lastDiv.append("p")
    //                 .attr("class","bcd-text");

    //             lastP.append("span").attr("class","bcd-text-title");
    //             lastP.append("span").attr("class","bcd-text-value");
    //             lastP.append("span").attr("class","bcd-text-rate");
    //             lastP.append("span").attr("class","bcd-text-indicator");

    // }

    // needs to be called everytime the data changes
    createScales(){
        let c = this,
            yAxisCall,
            xAxisCall,
            x,
            y;

        yAxisCall = d3.axisLeft();
        xAxisCall = d3.axisBottom();
        x = c.getElement(".titleX").text(c.tX);
        y = c.getElement(".titleY").text(c.tY);


        // set scales
        c.x = d3.scaleBand()
            .range([0, c.w])
            .padding(0.2);

        c.y = d3.scaleLinear().range([c.h, 0]);

        // Update scales
        c.x.domain(c.d.map( d => {
            return d[c.xV];
        }));

        // Set Y axis scales 0 if positive number else use minValue
        c.y.domain([0, d3.max(
            c.stackD, d => { return d3.max(d, d => { return d[1]; }); 
        })]).nice();

        // Update X axis
        c.tickNumber ? xAxisCall.scale(c.x).ticks(c.tickNumber) : xAxisCall.scale(c.x);
        c.xAxis.transition(c.t()).call(xAxisCall);
        
        // Update Y axis
        c.ySF ? yAxisCall.scale(c.y).tickFormat(c.formatValue(c.ySF) ) : yAxisCall.scale(c.y);
        c.yAxis.transition(c.t()).call(yAxisCall);
    }

    drawLegend(){
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
                    .call(textWrap, 100, 10);
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
        let c=this,
            pos = d3.mouse(c.eN),
            x = c.x(d.data[c.xV]), 
            y = pos[1],
            total = 0,
            tooltipX = c.getTooltipPosition(x,y),
            bisect = d3.bisector(function(d) { return d[c.xV]; }).left,
            i = bisect(c.gData, d.data[c.xV]);

        c.newToolTip.style("visibility","visible");
 
        c.newToolTip.style('left', tooltipX[0] + "px").style("top", tooltipX[1] +"px");

        c.keys.forEach( (reg,idx) => {
                total += c.gData[i][reg];// for the last text total;
        
            let id = "#bcd-tt" + idx,
                div = c.newToolTip.select(id),
                p = div.select(".bcd-text"),
                unText = "N/A",
                title = c.newToolTipTitle,
                perc = d3.format(".2%"),
                cur = c.gData[i],
                prev = c.gData[i-1] ? c.gData[i-1] : 0,
                item = c.keys[idx],
                rV = prev !== 0 ? (cur[item] -  prev[item])/cur[item]: 0,
                r = rV !== 0 ? perc(rV) : "N/A", 
                indicator = rV > 0 ? " ▲" : rV < 0 ? " ▼" : "",
                valueString =  c.valueFormat !=="undefined"? c.valueFormat(cur[item]) : cur[item],
                indicatorColour = c.arrowChange === true ? rV < 0 ?"#20c997" 
                                    : rV > 0 ? "#da1e4d" : "#f8f8f8" 
                                    : rV > 0 ? "#20c997" : rV < 0 ? "#da1e4d" 
                                    : "#f8f8f8";

                title.text(c.ttTitle + " " + (d.data[c.datelabel]));
                div.style("opacity", 1);
                div.select(".bcd-rect").style("background-color", c.colour(reg));
                p.select(".bcd-text-title").text(reg);
                p.select(".bcd-text-value").text(valueString);
                p.select(".bcd-text-rate").text(r);
                p.select(".bcd-text-indicator").text(" " + indicator)
                    .style("color", indicatorColour);
        });
        c.svg.select("#tooltipbody_last .tp-text-right").text(c.valueFormat !=="undefined"? "Total = " + c.valueFormat(total) : "Total = " + total);
        c.newToolTip.select("#bcd-tt-total .bcd-text-title").text("Total = ").style("text-align","end");
        c.newToolTip.select("#bcd-tt-total .bcd-text-value").text(c.valueFormat !=="undefined"? c.valueFormat(total) : total);
    }

    getTooltipPosition(mouseX, mouseY) {
        let c = this,
            ttX,
            ttY,
            cW,
            cH;
            cW = c.w  - c.ttWidth;
            cH = c.h;

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

    // formatValue(format){
    //     // formats thousands, Millions, Euros and Percentage
    //     switch (format){
    //         case "millions":
    //             return function(d){ return d3.format(",")(d) + "M"; }
    //             break;
        
    //         case "euros":
    //             return "undefined";
    //             break;
        
    //         case "thousands":
    //             return d3.format(",");
    //             break;
        
    //         case "percentage":
    //             return d3.format(".0%");
    //             break;
        
    //         case "percentage2":
    //             return d3.format(".2%");
    //             break;

    //         default:
    //             return "undefined";
    //     }
    // }
}