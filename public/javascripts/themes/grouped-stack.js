class GroupStackBar {

    // constructor fn
    constructor(obj){

        this.e = obj.e;
        this.k = obj.k;
        this.d = obj.d;
        this.v = obj.v;//not sure
        this.cScheme = obj.c;

        this.init();
    }

    init(){
        let chart = this,
            e = d3.select(chart.e),
            eN = e.node(),
            eW = eN.getBoundingClientRect().width,
            aR = eW < 800 ? eW * 0.65 : eW * 0.5,
            bP = 678,
            w,
            h,
            m = chart.m = {};

            m.t = eW < bP ? 40 : 50;
            m.b = eW < bP ? 30 : 80;
            m.r = eW < bP ? 20 : 100;
            m.l = eW < bP ? 20 : 80;

            w = eW - m.l - m.r;
            h = aR - m.t - m.b;

        chart.w = w;
        chart.h = h;

        // set transition variable
        chart.t = function() { return d3.transition().duration(1000); };

        // chart.colourScheme = ["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8"];
        chart.cScheme = chart.cScheme ? chart.cScheme : d3.schemeBlues[9].slice(3);

        // set colour function
        chart.colour = d3.scaleOrdinal(chart.cScheme);

        // tick numbers
        chart.tickNumber = "undefined";

        // tick formats
        chart.tickFormat = "undefined";

        chart.yAxisCall = d3.axisLeft();

        chart.xAxisCall = d3.axisBottom();

        chart.drawTooltip();

        chart.svg = e.append("svg")
                .attr("width", w + m.l + m.r)
                .attr("height", h + m.t + m.b);

        chart.g = chart.svg.append("g")
            .attr("transform", "translate(" + m.l + "," + m.t + ")");

        chart.grid = chart.g.append("g").attr("class", "grid-lines");

        chart.stackData();
        chart.createScales();
        chart.addAxis();
        chart.drawGrid();
        chart.drawChart();
        chart.addLegend();
    }

    drawTooltip(){
        let chart = this,
            keys,
            div,
            p,
            divHeaders,
            pHeader;
        
            chart.colour.domain(chart.d.map(d => { return d[chart.k]; }));
            keys = chart.colour.domain();

            chart.newToolTip = d3.select(chart.e)
                .append("div")
                .attr("class","tool-tip bcd")
                .style("visibility","hidden");

            chart.newToolTipTitle = chart.newToolTip
                .append("div")
                .attr("id", "bcd-tt-title");

            divHeaders = chart.newToolTip
                .append("div")
                .attr("class", "headers");

            divHeaders
                .append("span")
                .attr("class", "bcd-rect");

            pHeader = divHeaders
                .append("p")
                .attr("class","bcd-text");

            pHeader
                .append("span")
                .attr("class","bcd-text-title")
                .text("Type");

            pHeader
                .append("span")
                .attr("class","bcd-text-value")
                .text("Value");

            pHeader
                .append("span")
                .attr("class","bcd-text-slice")
                .text("% Slice");

            // pHeader
            //     .append("span")
            //     .attr("class","bcd-text-rate")
            //     .text("% Rate");

            // pHeader
            //     .append("span")
            //     .attr("class","bcd-text-indicator");


            keys.forEach( (d, i) => {
                div = chart.newToolTip
                        .append("div")
                        .attr("id", "bcd-tt" + i);
                    
                div.append("span").attr("class", "bcd-rect");

                p = div.append("p").attr("class","bcd-text");

                p.append("span").attr("class","bcd-text-title");
                p.append("span").attr("class","bcd-text-value");
                p.append("span").attr("class","bcd-text-slice");
                // p.append("span").attr("class","bcd-text-rate");
                // p.append("span").attr("class","bcd-text-indicator");
            });

        let lastDiv = chart.newToolTip.append("div")
                    .attr("id", "bcd-tt-total"),
            
            lastDot = lastDiv.append("span")
                    .attr("class", "bcd-rect"),

            lastP = lastDiv.append("p")
                    .attr("class","bcd-text");

            lastP.append("span")
                .attr("class","bcd-text-title");
            lastP.append("span")
                .attr("class","bcd-text-value")
                .style("border-top","1px solid");
            lastP.append("span")
                .attr("class","bcd-text-slice");
            // lastP.append("span")
            //     .attr("class","bcd-text-rate");
            // lastP.append("span")
            //     .attr("class","bcd-text-indicator");

    }

    stackData(){
        let chart = this,
            data = chart.d,
            keys,
            groupData,
            stack = d3.stack();

            chart.colour.domain(data.map(d => { return d.type; }));
            keys = chart.colour.domain();
  
            groupData = d3.nest()
                .key(d => { return d.date + d.region; })
                .rollup((d, i) => {
                    const d2 = {
                        date: d[0].date, 
                        region: d[0].region
                    };
                    d.forEach(d => {
                        d2[d.type] = d.value;
                    });
                return d2;
                })
                .entries(data)
                .map(d => { return d.value; });

            chart.stackD = stack.keys(keys)(groupData);
            chart.keys = keys.reverse();
            chart.gData = groupData;

            // console.log("grouped the shit", chart.stackD);
    }

    createScales(){
        let chart = this,

            x0 = d3.scaleBand()
                    .range([0, chart.w])
                    .padding(0.05),

            x1 = d3.scaleBand()
                    .padding(0.05),

            y = d3.scaleLinear()
                    .range([chart.h, 0]);

            x0.domain(chart.d.map(d => { return d.region; }));

            x1.domain(chart.d.map(d => { return d.date; }))
                .rangeRound([0, x0.bandwidth()])
                .padding(0.2);

            y.domain([0, d3.max(
                chart.stackD, d => { return d3.max(d, d => { return d[1]; }); 
                })]).nice();

            chart.xAxisCall.scale(x0);
            chart.yAxisCall.scale(y);

            chart.x0 = x0,
            chart.x1 = x1,
            chart.y = y;
    }

    addAxis(){       
        let chart = this,
            g = chart.g,

            xAxis = g.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + chart.h +")")
                .call(chart.xAxisCall)
                .selectAll(".tick text")
                .call(textWrap, 60, 0),
            
            yAxis = g.append("g")
                .attr("class", "y-axis")
                .call(chart.yAxisCall),
    
            // X title
            xLabel = g.append("text")
                .attr("class", "titleX")
                .attr("x", chart.w/2)
                .attr("y", chart.h + 60)
                .attr("text-anchor", "middle"),
    
            // Y title
            yLabel = g.append("text")
                .attr("class", "titleY")
                .attr("x", - (chart.h/2))
                .attr("y", -50)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)");
    }

    drawGrid(){
        let chart = this,
            y = chart.y,
            w = chart.w,
            gd = chart.grid;

            gd.selectAll('line')
                .remove();

            gd.selectAll('line.horizontal-line')
                .data(y.ticks)
                .enter()
                    .append('line')
                    .attr('class', 'horizontal-line')
                    .attr('x1', (0))
                    .attr('x2', w)
                    .attr('y1', (d) => { return y(d); })
                    .attr('y2', (d) => y(d));
    }

    drawChart(){
        let chart = this,
            data = chart.stackD,
            g = chart.g,
            c = chart.colour,
            x0 = chart.x0,
            x1 = chart.x1,
            y = chart.y;

            chart.series = g.selectAll(".series")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "series")
                    .attr("fill", d =>  { return c(d.key); });
  
            chart.series.selectAll("rect")
                    .data(d => { 
                        return d; 
                    })
                    .enter()
                    .append("rect")
                        .attr("class", "series-rect")
                        .attr("transform", d =>  { 
                            return "translate(" + x0(d.data.region) + ",0)"; 
                        })
                        .attr("x", d =>  { 
                            return x1(d.data.date);
                        })
                        .attr("y", d =>  { 
                            return y(d[1]);
                        })
                        .attr("height", d =>  { 
                            return y(d[0]) - y(d[1]); 
                        })
                        .attr("width", x1.bandwidth())
                        .style("fill-opacity", 0.75)
                        .on("click", (d, i) => { 
                            console.log("series-rect click d", i, d); 
                        });
    }

    addLegend(){
        let chart = this,
            x0 = chart.x0,
            x1 = chart.x1,
            y = chart.y;

        const legend = chart.series.append("g")
            .attr("class", "legend")
            .attr("transform", d =>  { 
                const d1 = d[d.length - 1]; 
                return "translate(" 
                    + (x0(d1.data.region) 
                    + x1(d1.data.date) 
                    + x1.bandwidth()) 
                    + "," 
                    + ((y(d1[0]) 
                    + y(d1[1])) / 2) 
                    + ")"; 
                });

        legend.append("line")
            .attr("class", "legend-line")
            .attr("x1", 1)
            .attr("x2", 10)
            .attr("stroke", "#fff");

        legend.append("text")
            .attr("class","legendText")
            .attr("x", 25)
            .attr("dy", "0.35em")
            .attr("fill", "#fff")
            .style("font", "10px sans-serif")
            .text( d =>  { 
                return d.key; 
            })
            .call(textWrap, 100, 12);
    }

    addTooltip(title, format, date){

        let dv = this;
            dv.datelabel = date;
            dv.ttTitle = title;
            dv.valueFormat = formatValue(format);
            dv.ttWidth = 290;
            dv.ttHeight = 50;
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");
            dv.hV = 0;

            dv.series.selectAll("rect")
            .on("mouseover", function(){ 
                dv.newToolTip.style("visibility","visible");
            })
            .on("mouseout", function(){
                dv.newToolTip.style("visibility","hidden");
            })
            .on("mousemove", d => dv.mousemove(d));
    }

    mousemove(d){
        let chart = this,
            x = chart.x0(d.data.region) + chart.x1(d.data.date), 
            y = 100,
            total = 0,
            tooltipX = chart.getTooltipPosition(x),
            bisect = d3.bisector(function(d) { return d.date; }).left,
            cArray = chart.gData.filter( (v) =>{
                return ((v.region === d.data.region));
            }),
            iNum = bisect(cArray, d.data.date),
            prev = cArray[iNum-1] ? cArray[iNum-1] : null;

            // chart.keys.forEach( (reg,idx) => {
            //     console.log( prev ? ((cArray[iNum-1][reg] - cArray[iNum][reg]) / cArray[iNum-1][reg]) : "N/A")
            // });

            chart.newToolTip.style('left', tooltipX + "px").style("top", "20px");

            chart.keys.forEach( (reg,idx) => {
                total += d.data[reg];
            });

            chart.keys.forEach( (reg,idx) => {
                    // total += d.data[reg];// for the last text total;
                console.log("total value is", total);

            let id = "#bcd-tt" + idx,
                div = chart.newToolTip.select(id),
                unText = "N/A",
                indicatorColour,
                item = chart.keys[idx],
                p = div.select(".bcd-text"),
                perc = d3.format(".2%"),
                v = d.data[reg],
                rV = prev ? ((cArray[iNum][reg] - cArray[iNum-1][reg]) / cArray[iNum][reg]) : 0,
                rate = rV !== 0 ? perc(rV) : "N/A",
                slice = perc(v/total),
                indicator = rV > 0 ? " ▲" : rV < 0 ? " ▼" : "";
                indicatorColour = chart.arrowChange === true ? rV < 0 ?"#20c997" 
                                                : rV > 0 ? "#da1e4d" : "#f8f8f8" 
                                                : rV > 0 ? "#20c997" : rV < 0 ? "#da1e4d" 
                                                : "#f8f8f8";

                chart.newToolTipTitle.text(chart.ttTitle + " " + (d.data.date));

                div.style("opacity", 1);
                div.select(".bcd-rect").style("background-color", chart.colour(reg));
                p.select(".bcd-text-title").text(reg);
                p.select(".bcd-text-value").text(v);
                // p.select(".bcd-text-rate").text((rate));
                // p.select(".bcd-text-indicator").text(" " + indicator).style("color", indicatorColour);
                p.select(".bcd-text-slice").text(slice);

        });

        chart.svg.select("#tooltipbody_last .tp-text-right").text(chart.valueFormat !=="undefined"? "Total = " + chart.valueFormat(total) : "Total = " + total);
        chart.newToolTip.select("#bcd-tt-total .bcd-text-title").text("Total = ").style("text-align","end");
        chart.newToolTip.select("#bcd-tt-total .bcd-text-value").text(chart.valueFormat !=="undefined"? chart.valueFormat(total) : total);
    }

    getTooltipPosition(mouseX) {
        let dv = this,
            ttX,
            cW;

            cW = dv.w  - dv.ttWidth;
            // show right
            if ( mouseX < cW) {
                ttX = mouseX + dv.m.l + dv.x1.bandwidth()*2;
                console.log("tt pos", cW, ttX, mouseX);
            }
            else{
                ttX = (mouseX + dv.m.l + dv.x1.bandwidth()) - dv.ttWidth;
                console.log("tt pos", mouseX);
            } 

            return ttX;
    }
}

function formatValue(format){
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

function textWrap(text, width, xpos = 0, limit=3) {
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
                    ++lineNumber;
                    line = [word];
                    tspan = text.append('tspan')
                        .attr('x', xpos)
                        .attr('y', y)
                        .attr('dy', lineHeight + dy + 'em')
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