class GroupStackBar {

    constructor(obj){
      //  console.clear();
        //console.log('hereffff');
        this.d = obj.d; // the data
        this.e = obj.e; // selector element
        this.k = obj.k; // key
        //console.log(typeof this.k);
        this.ks = obj.ks;
        this.xV = obj.xV; // x value
        this.yV = obj.yV; // y value

        this.cS = obj.cS; // colour scheme

        this.tX = obj.tX;
        this.tY = obj.tY;
        this.ySF = obj.ySF || "thousands"; // format for y axis



                      //var keys = z1.domain().reverse();


        this.drawChart();


    }

    drawChart(){
        let c = this;

        c.init();
        c.stackData();
        // c.getKeys();
        // c.drdfawTooltip();
        c.createScales();//parent once I setup setScales:done and setDomain with switch.
        c.addAxis();
        c.drawGridLines();
        c.drawStack();
        c.addLegend();
    }

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
        c.Scheme = c.cS || d3.schemeBlues[5].slice(1),
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

        // to remove existing svg on resize
        d3.select(c.e).select("svg").remove();
               // add the svg to the target element
        c.svg = d3.select(c.e)
            .append("svg")
            .attr("width", w + m.l + m.r)
            .attr("height", h + m.t + m.b);
            //.attr("width", w + m.l + m.r)
            //.attr("height", h + m.t + m.b);

        c.g = c.svg.append("g")
            .attr("transform", "translate(" + m.l + "," + m.t + ")");


        // set transition variable
        c.t = function() { return d3.transition().duration(1000); };
        c.ease = d3.easeQuadInOut;

        // set colour function
      //  c.colour = d3.scaleOrdinal(c.cScheme); The Original Script
       c.colour = d3.scaleOrdinal().range(["#375073", "#6794D3  ", "#5981B8  ", "#486895  ", "#375073  ", "#2A3D58" ]);
       c.colour2 = d3.scaleOrdinal().range(["#FEFFBE", "#FDFF98", "#FDFF77", "#FCFF46", "#FAFD24", "#FBFF07" ]);


        //--



        //--


        // // tick numbers
        // c.tickNumber = "undefined";

        // // tick formats
        // c.tickFormat = "undefined";

        c.bisectDate = d3.bisector( (d) => { return d[c.xV]; } ).left;

        // c.yAxisCall = d3.axisLeft();

        // c.xAxisCall = d3.axisBottom();

        c.drawTooltip();


 }

    addAxis(){
        let c = this,


            g = c.g,
            gLines,
            xLabel,
            yLabel;

            gLines = g.append("g")
                .attr("class", "grid-lines");

            c.xAxis = g.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + c.h +")");

            c.yAxis = g.append("g")
                .attr("class", "y-axis");

            // X title
           xLabel = g.append("text")

                .attr("class", "titleX")
                .attr("x", c.w/2)
                .attr("y", c.h + 60)
                .attr("text-anchor", "middle");
                //.text(c.tX);

            // Y title
            yLabel = g.append("text")
                .attr("class", "titleY")
                .attr("x", - (c.h/2))
                .attr("y", -45)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .text(c.tY);
    }

    drawTooltip(){
        let c = this,
            keys,
            keys2,
            div,
            p,
            divHeaders,
            pHeader;

            c.colour.domain(c.d.map(d => { return d[c.k]; }));
            keys = c.colour.domain();

            //c.colour2.domain(c.d.map(d => { return d[c.k]; }));
            //keys = c.colour2.domain();

            //keys = c.colour2.domain();

            //--
            c.colour2.domain(c.d.map(d => { return d[c.k]; }));
             keys2 = c.colour2.domain();

            //--

            c.newToolTip = d3.select(c.e)
                .append("div")
                .attr("class","tool-tip bcd")
                .style("visibility","hidden");

            c.newToolTipTitle = c.newToolTip
                .append("div")
                .attr("id", "bcd-tt-title");

            divHeaders = c.newToolTip
                .append("div")
                .attr("class", "headers");

            divHeaders
                .append("span")
                .attr("fill", 'red')
                .attr("class", "bcd-rect");

            pHeader = divHeaders
                .append("p")
                .attr("fill", 'red')
                .attr("class","bcd-text");

            pHeader
                .append("span")
                .attr("class","bcd-text-title")
                .text("Type");

            pHeader
                .append("span")
                .attr("class","bcd-text-value")
                //.style("fill", 'red')
                .text("Value");

            pHeader
                .append("span")
                .attr("class","bcd-text-slice")
                .text("Portion");

            // pHeader
            //     .append("span")
            //     .attr("class","bcd-text-rate")
            //     .text("% Rate");

            // pHeader
            //     .append("span")
            //     .attr("class","bcd-text-indicator");


            keys.forEach( (d, i) => {
                div = c.newToolTip
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

        let lastDiv = c.newToolTip.append("div")
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
        let c = this,
            data = c.d,
            keys,
            keys2,

            groupData,
            stack = d3.stack();

            c.colour.domain(data.map(d => { return d.type; }));
            keys = c.colour.domain();

            c.colour2.domain(data.map(d => { return d.type; }));
            keys2 = c.colour.domain();

          groupData = d3.nest()
                .key(d => { return  d.date + d.region })
                .rollup((d, i) => {


                    const d2 = {
                        date: d[0].date,
                        region: d[0].region
                    }

                    d.forEach(d => {
                    d2[d.type] = d.value;
                    });
                return d2;
                })
                .entries(data)
                .map(d => { return d.value; });

            c.stackD = stack.keys(keys)(groupData)
            c.keys = keys.reverse();
            c.gData = groupData;

            // console.log("grouped the shit", c.stackD);
    }

    createScales(){
        let c = this,
            yAxisCall,
            xAxisCall,
            x0,
            x1,
            y,
            xt,
            yt;

        yAxisCall = d3.axisLeft();
        xAxisCall = d3.axisBottom();
        xt = c.getElement(".titleX").text(c.tX);
        yt = c.getElement(".titleY").text(c.tY);

        x0 = d3.scaleBand()
                .range([10, c.w])
                .padding(0.05),

        x1 = d3.scaleBand()
                .padding(0.05),

        y = d3.scaleLinear()
                .range([c.h, 0]);

        x0.domain(c.d.map(d => { return d.date; }));

        x1.domain(c.d.map(d => { return d.region; }))
            .rangeRound([0, x0.bandwidth()])
            .padding(0.2);

        y.domain([0, d3.max(
            c.stackD, d => { return d3.max(d, d => { return d[0]; });
            })]).nice();

        xAxisCall.scale(x0)
        //.tickFormat(function(d) { return d.date; });
        //.orient("bottom");
        c.ySF ? yAxisCall.scale(y).tickFormat(formatValue(c.ySF) ) : yAxisCall.scale(y);
        // c.yAxisCall.scale(y);

        c.x0 = x0,
        c.x1 = x1,
        c.y = y;
    }

    drawGridLines(){
        let c = this,
            gLines;

        gLines = c.getElement(".grid-lines");

        gLines.selectAll("line")
            .remove();

        gLines.selectAll("line.horizontal-line")
            .data(c.y.ticks)
            .enter()
            .append("line")
                .attr("class", "horizontal-line")
                .attr("x1", (0))
                .attr("x2", c.w)
                .attr("y1", (d) => c.y(d))
                .attr("y2", (d) => c.y(d));
    }

    getElement(name){
        let c = this,
            s = d3.select(c.e),
            e = s.selectAll(name);
        return e;
    }

    drawStack(){

        let c = this,
            data = c.stackD,
            g = c.g,
            z = c.colour,
            x0 = c.x0,
            x1 = c.x1,
            y = c.y;


            let co1=['#6f0000','#930000','#b70000','#db0000','#ff2424','#ff4848'];
            let wkc=['#ffc9c9','#ffbaba','#ffabab','#ff9c9c','#ff8d8d','#ff7e7e'];
            let Fic=['#bbffff','#b2ffff','#a8ffff','#9cffff','#8effff','#7effff'];
            let Mec=['#e5e5a2','#e8e89c','#ebeb95','#efef8d','#f4f483','#f9f978'];
            let kic=['#2f4970','#365481','#3e6194','#476faa','#527fc3','#5e92df'];
            let Dlc=['#46bb98','#41b18f','#3da686','#399b7d','#359074','#31856b'];
            let SDc=['#d5e6ef','#cae0eb','#bfdae7','#b4d4e3','#a9cedf','#9ec8db'];

            var z1 = d3.scaleOrdinal()
                .range(co1);
            var z2 = d3.scaleOrdinal()
                    .range(wkc);
            var z3=d3.scaleOrdinal()
                    .range(Fic);
            var z4=d3.scaleOrdinal()
                   .range(Mec);
            var z5=d3.scaleOrdinal()
                          .range(kic);

            var z6=d3.scaleOrdinal()
                        .range(Dlc);

            var z7=d3.scaleOrdinal()
                        .range(SDc);

            z1.domain(c.stackD.map(function(d) { return d.type}))
            z2.domain(c.stackD.map(function(d) { return d.type}))
            z3.domain(c.stackD.map(function(d) { return d.type}))
            z4.domain(c.stackD.map(function(d) { return d.type}))
            z5.domain(c.stackD.map(function(d) { return d.type}))
            z6.domain(c.stackD.map(function(d) { return d.type}))
            z7.domain(c.stackD.map(function(d) { return d.type}))


            c.series = g.selectAll(".series")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "series")
                    .attr("fill", (g) =>  {
                     return z(g.key);
                   })


                     .each(function(d)  {
                       //console.log(d);
                     })
                    .attr("width", x1.bandwidth())
                    .style("fill-opacity", 0.75)
                    .on("click", (d, i) => {
                   //console.log("series-rect click d", i, d);
                    }
                  );


            c.series.selectAll("rect")
                    .data(d => {

                        return d;
                    }).enter()
                    .append("rect")
                        .attr("class", "series-rect")
                        .attr("transform", d =>  {
                            return "translate(" + x0(d.data.date) + ",0)";
                        })
                        .attr("x", d =>  {
                            return x1(d.data.region);
                        })
                        .attr("y", d =>  {
                        //  console.log(d[1]);
                            return y(d[1]);
                        })
                        .attr("height", d =>  {
                            return y(d[0]) - y(d[1]);
                        })
                        .attr("width", x1.bandwidth())

                        .style("fill-opacity", 0.75)

                        .on("click", (d, i) => {
                           //console.log("series-rect click d", i, d);
                        })

                          c.series.selectAll("rect")
                          .filter(function(d,i)
                          { return i < 7  })
                          .attr("fill",function(i) {
                           return z1(i)});

                          c.series.selectAll("rect")
                          .filter(function(d,i) {return i > 3  && i < 8 })
                          .attr("fill", function(i) {
                           return z2(i)});

                           c.series.selectAll("rect")
                           .filter(function(d,i) {return i > 7  && i < 12  })
                           .attr("fill", function(i) {
                            return z3(i)});

                            c.series.selectAll("rect")
                            .filter(function(d,i) {return i > 11  && i < 16  })
                            .attr("fill", function(i) {
                             return z4(i)});

                             c.series.selectAll("rect")
                             .filter(function(d,i) {return i > 15  && i < 20  })
                             .attr("fill", function(i) {
                              return z5(i)});

                              c.series.selectAll("rect")
                              .filter(function(d,i) {return i > 19  && i < 24  })
                              .attr("fill", function(i) {
                               return z6(i)});

                               c.series.selectAll("rect")
                               .filter(function(d,i) {return i > 23  && i < 28   })
                               .attr("fill", function(i) {
                                return z7(i)});

    }


//var rects = d3.selectAll(c.series)


    addLegend(){
        let c = this,
            x0 = c.x0,
            x1 = c.x1,
            y = c.y;

        const legend = c.series.append("g")
            .attr("class", "legend")
            .attr("transform", d =>  {
                const d1 = d[d.length - 1];
                return "translate("
                    + (x0(d1.data.date)
                    + x1(d1.data.region)
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
            dv.ttWidth = 305;
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
        let c = this,
            x = c.x0(d.data.date) + c.x1(d.data.region),
            y = 100,
            total = 0,
            tooltipX = c.getTooltipPosition(x),
            bisect = d3.bisector(function(d) { return d.date; }).left,
            cArray = c.gData.filter( (v) =>{
                return ((v.region === d.data.region));
            }),
            iNum = bisect(cArray, d.data.date),
            prev = cArray[iNum-1] ? cArray[iNum-1] : null;

            // c.keys.forEach( (reg,idx) => {
            //     console.log( prev ? ((cArray[iNum-1][reg] - cArray[iNum][reg]) / cArray[iNum-1][reg]) : "N/A")
            // });

            c.newToolTip.style('left', tooltipX + "px").style("top", "20px");

            c.keys.forEach( (reg,idx) => {
                total += d.data[reg];
            });

            c.keys.forEach( (reg,idx) => {
                    // total += d.data[reg];// for the last text total;


            let id = "#bcd-tt" + idx,
                div = c.newToolTip.select(id),
                unText = "N/A",
                indicatorColour,
                item = c.keys[idx],
                p = div.select(".bcd-text"),
                perc = d3.format(".2%"),
                v = d.data[reg],
                rV = prev ? ((cArray[iNum][reg] - cArray[iNum-1][reg]) / cArray[iNum][reg]) : 0,
                rate = rV !== 0 ? perc(rV) : "N/A",
                slice = perc(v/total),
                indicator = rV > 0 ? " ▲" : rV < 0 ? " ▼" : "";
                indicatorColour = c.arrowChange === true ? rV < 0 ?"#20c997"
                                                : rV > 0 ? "#da1e4d" : "#f8f8f8"
                                                : rV > 0 ? "#20c997" : rV < 0 ? "#da1e4d"
                                                : "#f8f8f8";

                c.newToolTipTitle.text(c.ttTitle + " " + (d.data.date) + " " + d.data.region );
                /*let f= d.data.region;
                console.log(f);
                if (f =='Fingal')
                {
                 c.colour=c.colour2;
                 div.select(".bcd-rect").style("background-color", c.colour2(reg));
                }

                if (f !=='Fingal')
                {
                 c.colour=c.colour;
                 div.select(".bcd-rect").style("background-color", c.colour(reg));
               }*/



                div.style("opacity", 1);
                div.select(".bcd-rect").style("background-color", c.colour(reg));
                p.select(".bcd-text-title").text(reg);
                p.select(".bcd-text-value").text(v);
                // p.select(".bcd-text-rate").text((rate));
                // p.select(".bcd-text-indicator").text(" " + indicator).style("color", indicatorColour);
                p.select(".bcd-text-slice").text(slice);
                c.colour2=c.colour;

        });

        c.svg.select("#tooltipbody_last .tp-text-right").text(c.valueFormat !=="undefined"? "Total = " + c.valueFormat(total) : "Total = " + total);
        c.newToolTip.select("#bcd-tt-total .bcd-text-title").text("Total = ").style("text-align","end");
        c.newToolTip.select("#bcd-tt-total .bcd-text-value").text(c.valueFormat !=="undefined"? c.valueFormat(total) : total);
    }

    getTooltipPosition(mouseX) {
        let dv = this,
            ttX,
            cW;

            cW = dv.w  - dv.ttWidth;
            // show right
            if ( mouseX < cW) {
                ttX = mouseX + dv.m.l + dv.x1.bandwidth()*2;
                //console.log("tt pos", cW, ttX, mouseX);
            }
            else{
                ttX = (mouseX + dv.m.l + dv.x1.bandwidth()) - dv.ttWidth;
                //console.log("tt pos", mouseX);
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

        case "m":
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
    //  console.clear();
}
  // console.clear();
