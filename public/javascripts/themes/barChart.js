class BarChart{

// constructor function
    constructor (_element, _variableRegion, _variableType, _titleX, _titleY){
        // load in arguments from config object
        this.element = _element;
        this.variableRegion = _variableRegion;
        this.variableType = _variableType;
        this.titleX = _titleX;
        this.titleY = _titleY
        
        // create the chart area
        this.init();

    }

    // initialise method to draw chart area
    init(){
        var dv = this; 
        dv.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        dv.height = 500 - dv.margin.top - dv.margin.bottom;
        // dv.width = (dv.element.offsetWidth) - dv.margin.left - dv.margin.right;
        dv.width = 950 - dv.margin.left - dv.margin.right;

        dv.tooltip = d3.select(dv.element)
            .append('div')  
            .attr('class', 'tool-tip');  

        // select parent element and append SVG + g
        dv.svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);

        dv.g = dv.svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");

        // transition 
        dv.t = () => { return d3.transition().duration(1000); }

        // dv.color = d3.scaleOrdinal(d3.schemeGreys[4]);

        dv.x = d3.scaleBand()
            .range([0, dv.width])
            .padding(0.2);

        dv.y = d3.scaleLinear()
            .range([dv.height, 0]);

        dv.yAxisCall = d3.axisLeft();

        dv.xAxisCall = d3.axisBottom()
            .tickFormat(d => {return d});

        dv.xAxis = dv.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dv.height +")");
        
        dv.yAxis = dv.g.append("g")
            .attr("class", "y axis");

        // X title
        dv.g.append("text")
            .attr("class", "title")
            .attr("x", width/2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(dv.titleX);

        // Y title
        dv.g.append("text")
            .attr("x", - (height/2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(dv.titleY);

        dv.getData();

    }

    getData(){
        var dv = this;

        dv.dataFiltered = newList.find( 
            d => d.key === dv.variableRegion)
            .values.find(
                d => d.key === dv.variableType
            ).values;

        dv.update();
    };

    update(){
        var dv = this;

        // Update scales
        dv.x.domain(dv.dataFiltered.map((d)=>{ return d.year; }));
        dv.y.domain([0, d3.max(dv.dataFiltered, (d) => { return +d.value; })]);

        // Update axes
        dv.xAxisCall.scale(dv.x);
        dv.xAxis.transition(dv.t()).call(dv.xAxisCall);
        
        dv.yAxisCall.scale(dv.y);
        dv.yAxis.transition(dv.t()).call(dv.yAxisCall);

        // join new data with old elements.
        dv.rects = dv.g.selectAll("rect").data(dv.dataFiltered, function(d){
            return d.year;
        });

        // exit old elements not present in new data.
        dv.rects.exit()
            .attr("class", "exit")
            .transition(dv.t())
            .attr("height", 0)
            .attr("y", dv.height)
            .style("fill-opacity", "0.1")
            .remove();

        // update old elements present in new data.
        dv.rects.attr("class", "update")
            .transition(dv.t())
                .attr("y", function(d){ return dv.y(d.value); })
                .attr("height", function(d){ return (dv.height - dv.y(d.value)); })
                .attr("x", function(d){ return dv.x(d.year) })
                .attr("width", dv.x.bandwidth)

        // enter new elements present in new data.
        dv.rects
            .enter()
            .append("rect")
            .attr("class", "enter")
            .attr("fill", "#3182bd")
            .attr("height", 0)
            .attr("x", function(d){ return dv.x(d.year); })
            .attr("width", dv.x.bandwidth)
            .attr("y", height)
            .transition(dv.t())
            .attr("y", function(d){ return dv.y(d.value); })
            .attr("height", function(d){ return (dv.height - dv.y(d.value)); });
        
        dv.g.selectAll("rect")
            .on("mouseover", function(){ 
                dv.tooltip.style("display", null); 
            })
            .on("mouseout", function(){ 
                dv.tooltip.style("display", "none"); 
            })
            .on("mouseover", function(d){
                var dx  = parseFloat(d3.select(this).attr('x')) + dv.x.bandwidth(), 
                    dy  = parseFloat(d3.select(this).attr('y')) + 10;
                dv.tooltip
                    .style( 'left', dx + "px" )
                    .style( 'top', dy + "px" )
                    .style( 'display', 'block' )
                    .text("The value is: €" + (d.value));
            });
    }

}