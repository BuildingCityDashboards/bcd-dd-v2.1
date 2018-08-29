class StackedAreaChart {

    // constructor function
    constructor (_element, _titleX, _titleY){
        //valid data input?

        // load in arguments from config object
        this.element = _element;
        this.titleX = _titleX;
        this.titleY = _titleY;
        
        // create the chart
        this.init();
    }
    // initialise method to draw chart area
    init(){
        let dv = this;
        
        // this is getting repetitive
        dv.margin = { 
            top: 50, 
            right: 150, 
            bottom: 100, 
            left: 80
        };

        // need to get the width and height from the element
        dv.height = 500 - dv.margin.top - dv.margin.bottom;
        // dv.width = (dv.element.offsetWidth) - dv.margin.left - dv.margin.right;
        dv.width = 900 - dv.margin.left - dv.margin.right;

        // select parent element and append SVG + g
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.margin.left + dv.margin.right)
            .attr("height", dv.height + dv.margin.top + dv.margin.bottom);

        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.margin.left + 
                ", " + dv.margin.top + ")");

        dv.chartTop = $(dv.element + " svg g").offset().top;
        console.log(dv.chartTop);

        // dv.colour = d3.scaleOrdinal(d3.schemeBlues[9]);
        dv.colour = d3.scaleOrdinal(["#aae0fa","#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8","#003d68"]);

        // for the tooltip from the d3 book
        dv.bisectDate = d3.bisector(function(d) { return parseTime(d.date); }).left;

        // set scales
        dv.x = d3.scaleTime().range([0, dv.width]);
        dv.y = d3.scaleLinear().range([dv.height, 0]);

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

        // d3 area function
        dv.area = d3.area()
            .x(function(d) { return dv.x(parseTime(d.data.date))})
            .y0(function(d) { return dv.y(d[0]); })
            .y1(function(d) { return dv.y(d[1]); });

        // call the legend method
        dv.addLegend();

        // call the getdata method
        dv.getData();
    }

    getData(){
        let dv = this;

        let variable = $("#chart-select").val();
        // console.log(variable);

        // 1. nest the data by quarter
        dv.quarterNest = d3.nest()
            .key(function(d){ return d.quarter; })
            .entries(stackData);

        // console.log(dv.quarterNest);

        // 2. filter the values by select variable
        dv.dataFiltered = dv.quarterNest
        .map(function(q){
            return q.values.reduce(function(accumulator, current){
                accumulator.date = q.key
                accumulator[current.region] = accumulator[current.region] + current[variable]
                return accumulator;
            }, {
                "Border": 0,
                "Midland": 0,
                "Mid-East": 0,
                "Mid-West": 0,
                "South-East": 0,
                "South-West": 0,
                "West": 0,
                "Dublin": 0,
                "Ireland": 0
            });
        });

        console.log("filtered data stack",dv.dataFiltered);

        dv.update();
    }

    update(){
        let dv = this;
        d3.select(dv.element).select(".focus").remove();
        d3.select(dv.element).select(".focus_overlay").remove();
        
        // transition 
        const t = () => { return d3.transition().duration(1000); };

        // d3 stack function
        const stack = d3.stack().keys(nut3regions);

        const yAxisCall = d3.axisLeft();
        const xAxisCall = d3.axisBottom();

        const DataStacked = (stack(dv.dataFiltered));
        console.log("data stacked output: ", DataStacked);

        // get the the combined max value for the y scale
        let maxDateVal = d3.max(dv.dataFiltered, d => {
            var vals = d3.keys(d).map(key => { 
                return key !== 'date' ? d[key] : 0 
            });
            return d3.sum(vals);
        });

        // Update scales
        dv.x.domain(d3.extent(dv.dataFiltered, (d) => {  return parseTime(d.date); }));
        dv.y.domain([0, maxDateVal]);

        // Update axes
        xAxisCall.scale(dv.x);
        dv.xAxis.transition(t()).call(xAxisCall);

        yAxisCall.scale(dv.y);
        dv.yAxis.transition(t()).call(yAxisCall);

        // select all regions and join data with old
        const regions = dv.g.selectAll(".region")
            .data(DataStacked);
        
        // Exit old elements not present in new data.
        // regions.exit()
        //     .transition(t)
        //     .attr("y", y(0))
        //     .attr("height", 0)
        //     .remove();

        // update the paths
        regions.select(".area")
            .transition(t)
            .attr("d", dv.area);

        // Enter elements
        regions.enter().append("g")
            .attr("class", function(d){ return "region " + d.key })
            .append("path")
                .attr("class", "area")
                // .transition(t)
                .attr("d", dv.area)
                .style("fill", function(d){
                    return dv.colour(d.key);
                })
                .style("fill-opacity", 0.5);

        
        
          // tooltip
        let tooltips = dv.g.append("g")
            .attr("class", "tooltip-container")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", dv.chartTop + "px");
        
        
        // tooltip based on the example in the d3 Book
        // add group to contain all the focus elements
        let focus = dv.g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        console.log(focus);
        nut3regions.forEach( d => {
            dv.tooltip = focus.append("g")
                .attr("class", "tooltip_" + d);

            dv.tooltip.append("circle")
                .attr("r", 5)
                .attr("fill", dv.colour(d));

            dv.tooltip.append("text")
                .attr("x", 9)
                .attr("dy", ".35rem");
        });

        // Year Label
        focus.append("text")
            .attr("class", "focus_quarter")
            .attr("x", 9)
            .attr("y", 7);

        // Focus line
        focus.append("line")
            .attr("class", "focus_line")
            .attr("y1", 0)
            .attr("y2", height);

        dv.g.append("rect")
            .attr("width", width-50)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => { 
                focus.style("display", null); 
                tooltips.style("visibility", "visible");
            })
            .on("mouseout", () => { 
                focus.style("display", "none"); 
                tooltips.style("visibility", "hidden");
            })
            .on("mousemove", mousemove);

        function mousemove() {
            let mouse = d3.mouse(this);
            
            nut3regions.forEach( (region, idx) => {

                let regionData = DataStacked[idx];
                console.log("this should be an Array: ", regionData);

                    // this is from the d3 book
                    let x0 = dv.x.invert(mouse[0]),
                    i = dv.bisectDate(dv.dataFiltered, x0, 1),
                    d0 = regionData[i - 1],
                    d1 = regionData[i],
                    d;
                    console.log("d0 is: ", d0);
                    console.log("d1 is: ", d1);
                    console.log("x0 is: ", x0);
                    console.log("i is: ",i);
    
                    if(d1 !== undefined){

                        d = x0 - d0.data.date > d1.data.date - x0 ? d1 : d0;
                        let id = ".tooltip_" + region;
                        console.log("tool tip to select .",id);

                        // only this element tooltips
                        let tooltip = d3.select(dv.element).select(id); 
                        // console.log("tooltip selected", tooltip);
                            console.log((d.data.date));

                            tooltip.attr("transform", "translate(" + dv.x(parseTime(d.data.date)) + "," + dv.y(d[1]) + ")");

                            tooltip.select("text").text(d.data[region]);
                    }
            });
        }    
    }

    addLegend(){
        var dv = this;

        // create legend group
        var legend = dv.g.append("g")
            .attr("transform", "translate(" + (-50) + 
                        ", " + (0) + ")"); // if the legend needs to be moved

        // create legend array, this needs to come from the data.
        var legendArray = [
            {label: "Dublin", colour: dv.colour("Dublin")},
            {label: "Ireland", colour: dv.colour("Ireland")}
        ];

        // get data and enter onto the legend group
        var legend = legend.selectAll(".legend")
            .data(legendArray.reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; })
            .style("font", "12px sans-serif");
        
        // add legend boxes    
        legend.append("rect")
            .attr("class", "legendRect")
            .attr("x", width + 25)
            // style similar to hospital legend
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d => { return d.colour; })
            .attr("fill-opacity", 0.5);
        
        // add legend text
        legend.append("text")
            .attr("class", "legendText")
            .attr("x", width + 60)
            .attr("y", 12)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(d => { return d.label; }); 
    }

}



