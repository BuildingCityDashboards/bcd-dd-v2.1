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

        dv.margin.right = elementWidth < breakPoint ? 12.5 : 150;
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
        dv.colourScheme = ["#aae0fa","#00929e","#da1e4d","#ffc20e","#16c1f3","#086fb8","#003d68"];

        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme.reverse());

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

        dv.addLegend();
        
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
    }

    addLegend(){
        let dv =this;

        // create legend group
        let legend = dv.g.append("g")
        .attr("transform", "translate(0,0)");
        
        let legends = legend.selectAll(".legend")
        .data(dv.columns.reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => {
                return "translate(-1," + i * 30 + ")"; })
            .style("font", "12px sans-serif");
        
        legends.append("rect")
            .attr("class", "legendRect")
            .attr("x", dv.width + 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", dv.colour)
            .attr("fill-opacity", 0.75);
        
        legends.append("text")
            .attr("class", "legendText")
            .attr("x", dv.width + 44)
            .attr("y", 9)
            .attr("dy", ".1rem")
            .attr("text-anchor", "start")
            .text(d => { return d; })
            .call(dv.textWrap, 100, dv.width + 44);
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
            dv.valueFormat = format;
            dv.ttWidth = 220,
            dv.ttHeight = 50,
            dv.ttBorderRadius = 3;
            dv.formatYear = d3.timeFormat("%Y");

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
            ttTextHeights = 0,
            bisect = d3.bisector(function(d) { return d.date; }).left,
            i = bisect(chart.data, d.data.date);

        let tooltipX = chart.getTooltipPosition(x);

        chart.tooltip.attr("transform", "translate("+ tooltipX +"," + y + ")");

        chart.columns.forEach( (reg,idx) => {
            let tpId = ".tooltipbody_" + idx,
                ttTitle = chart.svg.select(".tooltip-title"),
                difference = chart.data[i-1] ? chart.data[i][chart.columns[idx]] -  chart.data[i-1][chart.columns[idx]]: 0, 
                indicatorSymbol = difference > 0 ? " ▲" : difference < 0 ? " ▼" : "";
                 
                
            let tooltipBody = chart.svg.select(tpId),
                textHeight = tooltipBody.node().getBBox().height ? tooltipBody.node().getBBox().height : 0;

                tooltipBody.attr("transform", "translate(5," + ttTextHeights +")");

                tooltipBody.select(".tp-text-right").text(chart.data[i][chart.columns[idx]] + indicatorSymbol);
                ttTitle.text(chart.ttTitle + " " + (d.data[chart.datelabel]));
                ttTextHeights += textHeight + 6;
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

    updateSize(){
        let dv = this;
        let height = dv.svg.select(".tooltip-body").node().getBBox().height;
        dv.ttHeight += height + 5;
        dv.svg.select(".tooltip-container").attr("height", dv.ttHeight);
    }

    getTooltipPosition(mouseX) {
        let dv = this,
            ttX,
            chartSize;

            chartSize = dv.width  - (dv.margin.right + 88);
            console.log(chartSize);
            console.log(mouseX);
            // show right

            console.log(mouseX);
            if ( mouseX < chartSize) {
                ttX = mouseX + dv.margin.left + dv.x.bandwidth() ;
                console.log(mouseX);
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