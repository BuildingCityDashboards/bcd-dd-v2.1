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

        this.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        this.height = 500 - this.margin.top - this.margin.bottom;
        // this.width = (this.element.offsetWidth) - this.margin.left - this.margin.right;
        this.width = 950 - this.margin.left - this.margin.right;

        this.tooltip = d3.select(this.element)
            .append('div')  
            .attr('class', 'tool-tip');  

        // select parent element and append SVG + g
        this.svg = d3.select(this.element)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + 
                ", " + this.margin.top + ")");

        // transition 
        this.t = () => { return d3.transition().duration(1000); }

        // this.color = d3.scaleOrdinal(d3.schemeGreys[4]);

        this.x = d3.scaleBand()
            .range([0, this.width])
            .padding(0.2);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

        this.yAxisCall = d3.axisLeft();

        this.xAxisCall = d3.axisBottom()
            .tickFormat(d => {return d});

        this.xAxis = this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height +")");
        
        this.yAxis = this.g.append("g")
            .attr("class", "y axis");

        // X title
        this.g.append("text")
            .attr("class", "title")
            .attr("x", width/2)
            .attr("y", height + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(this.titleX);

        // Y title
        this.g.append("text")
            .attr("x", - (height/2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(this.titleY);

        this.getData();

    }

    getData(){
        var vis = this;

        vis.dataFiltered = newList.find( d => d.key === vis.variableRegion).values.find(d => d.key === vis.variableType).values;
        vis.update();
    };

    update(){
        var vis = this;

        // Update scales
        vis.x.domain(vis.dataFiltered.map((d)=>{ return d.year; }));
        vis.y.domain([0, d3.max(vis.dataFiltered, (d) => { return +d.value; })]);

        // Update axes
        vis.xAxisCall.scale(vis.x);
        vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
        
        vis.yAxisCall.scale(vis.y);
        vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

        // join new data with old elements.
        vis.rects = vis.g.selectAll("rect").data(vis.dataFiltered, function(d){
            return d.year;
        });

        // exit old elements not present in new data.
        vis.rects.exit()
            .attr("class", "exit")
            .transition(vis.t())
            .attr("height", 0)
            .attr("y", vis.height)
            .style("fill-opacity", "0.1")
            .remove();

        // update old elements present in new data.
        vis.rects.attr("class", "update")
            .transition(vis.t())
                .attr("y", function(d){ return vis.y(d.value); })
                .attr("height", function(d){ return (vis.height - vis.y(d.value)); })
                .attr("x", function(d){ return vis.x(d.year) })
                .attr("width", vis.x.bandwidth)

        // ENTER new elements present in new data.
        vis.rects
            .enter()
            .append("rect")
            .attr("class", "enter")
            .attr("fill", "#3182bd")
            .attr("height", 0)
            .attr("x", function(d){ return vis.x(d.year); })
            .attr("width", vis.x.bandwidth)
            .attr("y", height)
            .transition(vis.t())
            .attr("y", function(d){ return vis.y(d.value); })
            .attr("height", function(d){ return (vis.height - vis.y(d.value)); });
        
        vis.g.selectAll("rect")
            .on("mouseover", function(){ 
                vis.tooltip.style("display", null); 
            })
            .on("mouseout", function(){ 
                vis.tooltip.style("display", "none"); 
            })
            .on("mouseover", function(d){
                var dx  = parseFloat(d3.select(this).attr('x')) + vis.x.bandwidth(), 
                    dy  = parseFloat(d3.select(this).attr('y')) + 10;
                vis.tooltip
                    .style( 'left', dx + "px" )
                    .style( 'top', dy + "px" )
                    .style( 'display', 'block' )
                    .text("The value is: €" + (d.value));
            });
    }

}