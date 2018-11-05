class GroupStackBar {

    // constructor fn
    constructor(obj){

        this.e = obj.e;
        this.k = obj.k;
        this.d = obj.d;
        this.v = obj.v;//not sure

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

        chart.svg = e.append("svg")
                .attr("width", w + m.l + m.r)
                .attr("height", h + m.t + m.b);

        chart.g = chart.svg.append("g")
            .attr("transform", "translate(" + m.l + "," + m.t + ")");

        chart.grid = chart.g.append("g").attr("class", "grid-lines");

        // set transition variable
        chart.t = function() { return d3.transition().duration(1000); };

        // chart.colourScheme = ["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8"];
        chart.colourScheme = d3.schemeBlues[9].slice(3);

        // set colour function
        chart.colour = d3.scaleOrdinal(chart.colourScheme);

        // tick numbers
        chart.tickNumber = "undefined";

        // tick formats
        chart.tickFormat = "undefined";

        chart.yAxisCall = d3.axisLeft();

        chart.xAxisCall = d3.axisBottom();

        chart.stackData();
        chart.createScales();
        chart.addAxis();
        chart.drawGrid();
        chart.drawChart();
        chart.addLegend();
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
    }

    createScales(){
        let chart = this,

            x0 = d3.scaleBand()
                    .range([0, chart.w])
                    .padding(0.2),

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
            .attr("x1", 0)
            .attr("x2", 6)
            .attr("stroke", "#fff");

        legend.append("text")
            .attr("class","legendText")
            .attr("x", 10)
            .attr("dy", "0.35em")
            .attr("fill", "#fff")
            .style("font", "10px sans-serif")
            .text( d =>  { 
                return d.key; 
            });
    }

    addTooltip(title, format, date){

        let dv = this;
            dv.datelabel = date;

            dv.tooltip = dv.svg.append("g")
                .classed("tool-tip", true);

            dv.ttTitle = title;
            dv.valueFormat = formatValue(format);
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

            dv.keys.forEach( (d,i) => {
                dv.updateTooltip(d,i);
            });

            dv.totalText();

            dv.series.selectAll("rect")
            .on("mouseover", function(){ 
                dv.tooltip.style("display", "inline-block"); 
            })
            .on("mouseout", function(){ 
                dv.tooltip.style("display", "none"); 
            })
            .on("mousemove", d => dv.mousemove(d));
    }

    mousemove(d){
        let chart = this;
        

        chart.toolGroup.style("visibility","visible");
        let x = chart.x0(d.data.region) + chart.x1(d.data.date), 
            y = 100,
            // bisect = d3.bisector(function(d) {
            //     return d.region; 
            // }).left,
            // i = bisect(chart.groupD, d.data.region),
            total = 0;
        let tooltipX = chart.getTooltipPosition(x);

        chart.tooltip.attr("transform", "translate("+ tooltipX +"," + y + ")");

        chart.keys.forEach( (reg,idx) => {
                total += d.data[reg];// for the last text total;

            let tpId = ".tooltipbody_" + idx,
                ttTitle = chart.svg.select(".tooltip-title"),
                // cur = chart.d[i],
                // prev = chart.d[i-1] ? chart.d[i-1] : 0,
                item = chart.keys[idx];
                // difference = prev !== 0 ? cur[item] -  prev[item]: 0, 
                // indicatorSymbol = difference > 0 ? " ▲" : difference < 0 ? " ▼" : "",
                // valueString =  chart.valueFormat !=="undefined"? chart.valueFormat(cur[item]) : cur[item];
            
            let tooltipBody = chart.svg.select(tpId);
                tooltipBody.select(".tp-text-right").text(d.data[reg]);
                // tooltipBody.select(".tp-text-symbol").text(indicatorSymbol);
                ttTitle.text(chart.ttTitle + " " + (d.data.date));
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
            .call(textWrap, 140, 12, 4);

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

            chartSize = dv.w  - dv.ttWidth;
            // show right
            if ( mouseX < chartSize) {
                ttX = mouseX + dv.m.l + dv.x1.bandwidth() + 2;
                console.log("tt pos", chartSize, ttX, mouseX);
            }
            else{
                ttX = (mouseX + dv.m.l -2) - dv.ttWidth;
                console.log("tt pos", mouseX);
            } 
            // else {
            //     // show left minus the size of tooltip + 10 padding
            //     ttX = (dv.width + dv.margin.left) - dv.ttWidth;
            //     console.log(mouseX);
            // }
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