class GroupedBarChart{

    constructor (obj){

        this.d = obj.d;
        this.e = obj.e;
        this.k = obj.k;
        this.ks = obj.ks;
        this.xV = obj.xV;
        this.yV = obj.yV;
        this.cS = obj.c;
        this.tX = obj.tX;
        this.tY = obj.tY;
        this.ySF = obj.ySF || "thousands";

        this.init();
    }

    // initialise method to draw c area
    init(){
        let c = this,
            eN,
            eW,
            aR,
            cScheme,
            m = c.m = {},
            w,
            h,
            bP;

        eN = d3.select(c.e).node(),
        eW = eN.getBoundingClientRect().width,
        aR = eW < 800 ? eW * 0.55 : eW * 0.5,
        cScheme = c.cS || d3.schemeBlues[5].slice(1),
        bP = 576;

        // margins
        m.t = eW < bP ? 40 : 50;
        m.b = eW < bP ? 30 : 80;
        m.r = eW < bP ? 15 : 140;
        m.l = eW < bP ? 9 : 60;

        // dimensions
        w =  eW - m.l - m.r;
        h = aR - m.t - m.b;

        c.w = w;
        c.h = h;
        c.eN = eN;
        c.sscreens = eW < bP ? true : false;
        // add the svg to the target element
        c.svg = d3.select(c.e)
            .append("svg")
            .attr("width", w + m.l + m.r)
            .attr("height", h + m.t + m.b);
       
        // add the g to the svg and transform by top and left margin
        c.g = c.svg.append("g")
            .attr("transform", "translate(" + m.l + 
                ", " + m.t + ")");
    
        // transition 
        // c.t = () => { return d3.transition().duration(1000); }
    
        c.cS = c.cS || d3.schemeBlues[9].slice(3);

        // set colour function
        c.colour = d3.scaleOrdinal(c.cS);

        c.x0 = d3.scaleBand()
            .range([0, w])
            .padding(0.2);

        c.x1 = d3.scaleBand()
            .paddingInner(0.1);
    
        c.y = d3.scaleLinear()
            .range([h, 0]);

        c.yAxisCall = d3.axisLeft();

        c.xAxisCall = d3.axisBottom()
            .tickFormat(d => {return d});

        c.gridLines = c.g.append("g")
            .attr("class", "grid-lines");

        c.xAxis = c.g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + h +")");
        
        c.yAxis = c.g.append("g")
            .attr("class", "y-axis");
    
        // X title
        c.g.append("text")
            .attr("class", "titleX")
            .attr("x", w/2)
            .attr("y", h + 60)
            .attr("text-anchor", "middle")
            .text(c.tX);
    
        // Y title
        c.g.append("text")
            .attr("class", "titleY")
            .attr("x", - (h/2))
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(c.tY);

        c.update();
    
    }

    getData(){
        let c = this;
    
    }
    
    update(){
        let c = this;

        // Update scales
        c.x0.domain(c.d.map(d => {return d[c.xV]; }));
        c.x1.domain(c.ks).range([0, c.x0.bandwidth()]);
        c.y.domain([0, d3.max(c.d, d => { return d3.max(c.ks, key => { return d[key]; }); })]).nice();

        // Update axes
        c.xAxisCall.scale(c.x0);
        c.xAxis.call(c.xAxisCall)
        .selectAll(".tick text").call(c.textWrap, 60, 0);
        
        c.ySF ? c.yAxisCall.scale(c.y).tickFormat(c.formatValue(c.ySF)) : c.yAxisCall.scale(c.y);
        c.yAxisCall.scale(c.y);
        c.yAxis.call(c.yAxisCall);

        c.drawGridLines();

        c.g.selectAll(".layers").remove();
        c.g.selectAll(".focus_overlay").remove();

        c.group = c.g.selectAll(".layers")
            .data(c.d);

        c.rectGroup = c.group.enter()
            .append("g")
            .attr("class","layers")
            .attr("transform", (d) => { return "translate(" + c.x0(d[c.xV]) + ",0)"; })
            
        c.rects = c.rectGroup.selectAll("rect")
                .data(d => { 
                    return c.ks.map( key => { 
                    return {
                        key: key, 
                        [c.yV]: d[key],
                        date: d[c.xV]
                    }; 
                }); 
            });//hmmm this needs to change?
            // could this be done differently.

        c.rect = c.rects.enter().append("rect")
            .attr("x", d => {return c.x1(d.key);})
            .attr("y", d => {return c.y(d[c.yV]);})
            .attr("width", c.x1.bandwidth())
            .attr("height", d => { return (c.h - c.y(d[c.yV])); })
            .attr("fill", d => { return c.colour(d.key); })
            .attr("fill-opacity", ".75");

        
        c.rectsOverlay = c.g.selectAll(".focus_overlay")
            .data(c.d)
            .enter();

        // // append a rectangle overlay to capture the mouse
        c.rectsOverlay.append("g")
            .attr("class", "focus_overlay")
            .append("rect")
            .attr("x", d => c.x0(d[c.xV]))
            .attr("y", "0")
            .attr("width", c.x0.bandwidth()) // give a little extra for last value
            .attr("height", c.h)
            .style("fill", "none")
            .style("stroke","#00bff7")
            .style("pointer-events", "all")
            .style("visibility", "hidden")
            .on("mouseover", function(){
                d3.select(this).style("visibility", "visible");
            })
            .on("mouseout", function(){ 
                d3.select(this).style("visibility", "hidden");
                c.newToolTip.style("visibility","hidden");
            })
            .on("mousemove", (d, e, a)=> c.mousemove(d, e, a));

        c.addLegend();
    }

    drawGridLines(){
        let c = this;

        c.gridLines.selectAll("line")
            .remove();

        c.gridLines.selectAll("line.horizontal-line")
            .data(c.y.ticks)
            .enter()
                .append("line")
                .attr("class", "horizontal-line")
                .attr("x1", (0))
                .attr("x2", c.w)
                .attr("y1", (d) => {return c.y(d)})
                .attr("y2", (d) => c.y(d));
    }

    addLegend(){
        let c = this;

        let legend = c.g.append("g")
            .attr("transform", "translate(0,0)");

        let legendArray = [];

        c.ks.forEach((d,i) =>{
            let obj = {};
                obj.label = d;
                obj.colour = c.colour(d);
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
                .attr("x", c.w + 2)
                .attr("fill", d => { return d.colour; })
                .attr("fill-opacity", 0.75);

            legends.append("text")
                .attr("class", "legendText")
                .attr("y", 12)
                .attr("dy", "0em")
                .attr("text-anchor", "start")
                .text(d => { return d.label; })
                .call(c.textWrap, 100, c.w + 22); 
    }

    drawTooltip(){
        let c = this;

            c.newToolTip = d3.select(c.e)
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

        div
            .append("span")
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
            keys = c.ks,
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

    addTooltip(obj){
        let c = this;

            c.title = obj.title;
            c.datelabel = obj.data || "date";
            c.ttWidth = obj.width || 305;
            c.prefix = obj.prefix ? prefix : " ";
            c.postfix = obj.postfix ? postfix: " ";
            c.valueFormat = c.formatValue(obj.format);

            c.drawTooltip();

    }

    mousemove(d, e, a){
        let c = this,
            x = c.x0(d[c.xV]), 
            y = -20,
            tooltipX = c.getTooltipPosition(x),
            data = a[e].__data__,
            prevData = a[e-1] ? a[e-1].__data__ : null,
            key = c.ks;

            c.newToolTip.style("visibility","visible");
            c.newToolTip.style("left", tooltipX + "px").style("top", y + "px");
            c.ttContent(data,prevData, key);
    }

    getTooltipPosition(mouseX) {
        let c = this,
            ttX,
            cW,
            offset;

            cW = c.w  - c.ttWidth;
            offset = c.x1.bandwidth() < 20 ? c.x1.bandwidth() : 15;

            // show right
            if (mouseX < cW) {
                ttX = mouseX + c.x0.bandwidth() + offset + c.m.l;
                
            } else {
                // show left minus the size of tooltip + 10 padding
                ttX = mouseX + c.m.l + offset - c.ttWidth;
            }
            return ttX;
    }

    formatValue(format){
        // formats thousands, Millions, Euros and Percentage
        switch (format){
            case "millions":
                return d3.format(".2s");
                break;
        
            case "euros":
                return locale.format("$,.0f");
                break;

            case "euros2":
                return locale.format("$,.2f");
                break;
        
            case "thousands":
                return d3.format(",");
                break;
        
            case "percentage2":
                return d3.format(".2%");
                break;
            
            case "percentage":
                return d3.format(".0%");
                break;

            default:
                return "undefined";
        }
    }

    hideRate(value){
        let c = this;

        if(value){
            //console.log("value of hide", value);
            d3.selectAll(c.e + " .bcd-text-indicator").style("display", "none");
            d3.selectAll(c.e + " .bcd-text-rate").style("display", "none");
        }
        else{
            d3.selectAll(c.e + " .bcd-text-indicator").style("display", "block");
            d3.selectAll(c.e + " .bcd-text-rate").style("display", "block");
        }
        // value ? c.svg.selectAll(".bcd-text-indicator").style("display", "none") : c.svg.selectAll(".bcd-text-indicator").style("display", "block");
    }

    ttContent(d,pD,k){
        let c = this;
        k.forEach( (v,i) => {
            let id = "#bcd-tt" + i,
                div = c.newToolTip.select(id),
                p = div.select(".bcd-text"),
                newD = d[k[i]],
                oldD = pD ? pD[k[i]] : null,
                diff = pD ? (newD -  oldD)/oldD: 0, 
                indicator = diff > 0 ? " ▲" : diff < 0 ? " ▼" : "",
                indicatorColour = diff > 0 ? "#20c997" : diff < 0 ? "#da1e4d" : "#f8f8f8",
                rate = indicator !== "" ? d3.format(".1%")(diff) : "N/A",
                vString = c.valueFormat ? c.valueFormat(newD) : newD;
                c.newToolTipTitle.text(c.title + " " + (d[c.xV])); //label needs to be passed to this function 
                div.select(".bcd-rect").style("background-color", c.colour(v));
                p.select(".bcd-text-title").text(v);
                p.select(".bcd-text-value").text(vString);
                p.select(".bcd-text-rate").text((rate));
                p.select(".bcd-text-indicator").text(" " + indicator).style("color", indicatorColour);

        });
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