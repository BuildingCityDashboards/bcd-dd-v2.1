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

        let dv = this;

        let elementNode = d3.select(dv.element).node();
        let elementWidth = elementNode.getBoundingClientRect().width; 
        let aspectRatio = elementWidth < 800 ? elementWidth * 0.65 : elementWidth * 0.5;

        const breakPoint = 678;
        
        // margin
        dv.margin = { 
            top: 50,
            bottom: 80
        };

        dv.margin.right = elementWidth < breakPoint ? 0 : 100;
        dv.margin.left = elementWidth < breakPoint ? 0 : 80;

        console.log(dv.margin);
        
        dv.width = elementWidth - dv.margin.left - dv.margin.right;
        dv.height = aspectRatio - dv.margin.top - dv.margin.bottom;
        
        // add the svg to the target element
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");

        // stack function
        dv.stack = d3.stack().keys(dv.columns);
        dv.colourScheme = ["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8","#003d68"];

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

        dv.xAxis = dv.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dv.height +")");
        
        dv.yAxis = dv.g.append("g")
            .attr("class", "y axis");

        // X title
        dv.xLabel = dv.g.append("text")
            .attr("class", "xtitle")
            .attr("x", dv.width/2)
            .attr("y", dv.height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.xTitle);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "ytitle")
            .attr("x", - (dv.height/2))
            .attr("y", -60)
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

        xAxisCall.scale(dv.x);
        dv.xAxis.transition(t()).call(xAxisCall);

        yAxisCall.scale(dv.y);
        dv.yAxis.transition(t()).call(yAxisCall);

        const layers = dv.g.selectAll(".stack")
                .data(dv.series)
                .enter().append("g")
                .attr("class", "stack")
                .attr("fill", d => {
                    // console.log("colour should be: ", d.key);
                    return dv.colour(d.key); 
                    })
                .style("fill-opacity", 0.75);
            
        layers.selectAll("rect")
            .data( d => { return d; })
            .enter().append("rect")
                .attr("x", d => { 
                    return dv.x(d.data.date); 
                })
                .attr("y", d => { 
                    // console.log("this is the y value: ", d);
                    return dv.y(d[1]); 
                })
                .attr("height", d => { return dv.y(d[0]) - dv.y(d[1]);})
                .attr("width", dv.x.bandwidth())
                .style("stroke-width", "1")
                .on( 'mouseover', function( d ){
                    let dx  = parseFloat(d3.select(this).attr('x')) + (dv.x.bandwidth() * 2), 
                        dy  = parseFloat(d3.select(this).attr('y')) + dv.margin.top,
                        value = Math.round((d[1] - d[0]) * 10) / 10,
                        fill = d3.select(this).style("fill"),
                        text = Object.keys(d.data).find(key => d.data[key] == value);

                    dv.tooltip
                        .style( 'left', dx + "px" )
                        .style( 'top', dy + "px" )
                        .style( 'display', 'block' );
                    
                    dv.tooltip.append("div")
                        .attr("class", "tip-box")
                        .style("background", fill)
                        .style("opacity", 0.75)
                        .style("width", "18px")
                        .style("height", "18px")
                        .style("margin-right", "5px")
                        .style("float", "left");

                    dv.tooltip.append("div")
                        .attr("class", "tip-text")
                        .style("font", "12px sans-serif")
                        .style("line-height", "1.25rem")
                        .text(
                            dv.yTitle !== "€" ? (text + " : "  + value + " " + dv.yTitle) : (text + " : " + dv.yTitle + value)
                        );
                        
                    // dv.tooltip
                    //     .style( 'left', dx + "px" )
                    //     .style( 'top', dy + "px" )
                    //     .style( 'display', 'block' );
                    //     for (var key in filtered) {
                    //         if (filtered.hasOwnProperty(key)) {
                    //             let tip = dv.tooltip.append("div")
                    //                 .attr("class", "tip-text")
                    //                 .text(key + " : " + filtered[key]);
                    //                 tip.insert("div", ".tip-text")
                    //                 .style("background", dv.colour(key));
                    //         }
                    //     }

                })
                .on( 'mouseout', function(){
                    d3.select(dv.element).selectAll(".tip-box").remove();
                    d3.select(dv.element).selectAll(".tip-text").remove();
                    
                    dv.tooltip
                        .style( 'display', 'none' );
                });

            dv.tooltip = d3.select(dv.element)
                .append('div')  
                .attr('class', 'tool-tip')
                .attr("width", 250)
                .attr("height", 100)
                .attr("rx", 3)
                .attr("ry", 3)
                .style("fill","#001f35")
                .style("stroke", "rgb(210, 214, 223)")
                .style("stroke-width", "1");

    }

    addLegend(){
        let dv =this;

        // create legend group
        let legend = dv.g.append("g")
        .attr("transform", "translate(0,0)");
        // .attr("transform", "translate(" + (-75) + 
        //             ", " + (0) + ")"); // if the legend needs to be moved
        
        let legends = legend.selectAll(".legend")
        .data(dv.columns.reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => {
                return "translate(0," + i * 20 + ")"; })
            .style("font", "12px sans-serif");
        
        legends.append("rect")
            .attr("x", dv.width + 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", dv.colour)
            .attr("fill-opacity", 0.75);
        
        legends.append("text")
            .attr("x", dv.width + 44)
            .attr("y", 9)
            .attr("dy", ".35rem")
            .attr("text-anchor", "start")
            .text(d => { return d; });
    }

}