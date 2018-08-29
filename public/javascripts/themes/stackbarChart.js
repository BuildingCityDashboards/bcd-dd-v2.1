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

        // margin
        dv.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        // dimension settings - need to adjust these based on parent size
        let height = 500 - dv.margin.top - dv.margin.bottom;
        let width = 900 - dv.margin.left - dv.margin.right;
        
        // add the svg to the target element
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", width + dv.margin.left + dv.margin.right)
            .attr("height", height + dv.margin.top + dv.margin.bottom);
       
        // add the g to the svg and transform by top and left margin
        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");

        // stack function
        dv.stack = d3.stack().keys(dv.columns);

        // set colour function
        dv.colour = d3.scaleOrdinal(["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8","#003d68"]);

        // set scales functions
        dv.x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.3)
            .align(0.3);

        dv.y = d3.scaleLinear()
            .range([height, 0]);

        dv.yAxisCall = d3.axisLeft();

        dv.xAxisCall = d3.axisBottom();

        dv.xAxis = dv.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height +")");
        
        dv.yAxis = dv.g.append("g")
            .attr("class", "y axis");

        // X title
        dv.xLabel = dv.g.append("text")
            .attr("class", "xtitle")
            .attr("x", width/2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.xTitle);

        // Y title
        dv.yLabel = dv.g.append("text")
            .attr("class", "ytitle")
            .attr("x", - (height/2))
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
        
        dv.series = dv.stack(dv.data);

        dv.update();
    }

    update(){

    
        let dv = this;

        // transition 
        const t = () => { return d3.transition().duration(1000); };

        const yAxisCall = d3.axisLeft();
        const xAxisCall = d3.axisBottom();

        console.log("income data", dv.series);

        dv.x.domain(dv.data.map( d => {
            console.log("x domain date list: ", d.date);
            return d.date;
        }));

        // have a check to see what domain values to use
        dv.y.domain([0, d3.max(dv.series[dv.series.length - 1],function (d) { return d[0] + d[1];})]).nice();
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
                    console.log("this is the y value: ", d);
                    return dv.y(d[1]); 
                })
                .attr("height", d => { return dv.y(d[0]) - dv.y(d[1]);})
                .attr("width", dv.x.bandwidth())
                .on( 'mouseover', function( d ){
                    var dx  = parseFloat(d3.select(this).attr('x')) + (dv.x.bandwidth() * 2); 
                    var dy  = parseFloat(d3.select(this).attr('y')) - 50;
                    dv.tooltip
                        .style( 'left', dx + "px" )
                        .style( 'top', dy + "px" )
                        .style( 'display', 'block' )
                        .text("the value for " + d.data.region + " is : " + (d[1]-d[0]));

                })
                .on( 'mouseout', function(){
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
                .style("fill","rgb(255, 255, 255)")
                .style("stroke", "rgb(210, 214, 223)")
                .style("stroke-width", "1");

    }

    addLegend(){
        let dv =this;

        // create legend group
        let legend = dv.g.append("g")
        .attr("transform", "translate(" + (-50) + 
                    ", " + (0) + ")"); // if the legend needs to be moved
        
        let legends = legend.selectAll(".legend")
        .data(dv.columns.reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => {
                return "translate(0," + i * 20 + ")"; })
            .style("font", "12px sans-serif");
        
        legends.append("rect")
            .attr("x", width + 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", dv.colour)
            .attr("fill-opacity", 0.75);
        
        legends.append("text")
            .attr("x", width + 44)
            .attr("y", 9)
            .attr("dy", ".35rem")
            .attr("text-anchor", "start")
            .text(d => { return d; });
    }

}