const parseTime = d3.timeParse("%d/%m/%Y");
const parseYear = d3.timeParse("%Y");

function dataSets (data, columns){
    coercedData = data.map( d => {
        for( var i = 0, n = columns.length; i < n; i++ ){
            d[columns[i]] = +d[columns[i]];
        }
    return d;
    });
    return coercedData;
}

Promise.all([
    d3.csv("/data/Economy/QNQ22_employment.csv"),
    d3.csv("/data/Demographics/population.csv"),
    d3.csv("data/Housing/houseComp.csv"),
    d3.csv("data/Housing/propertyprices.csv"),
]).then( dataFiles => {

    const economyData = dataFiles[0];
    const demographicsData = dataFiles[1];
    const houseCompData = dataFiles[2];
    const priceList = dataFiles[3];

    console.log("house comp data", houseCompData);

    const columnNames1 = economyData.columns.slice(2);
    const columnNames2 = demographicsData.columns.slice(2);
    const columnNames3 = houseCompData.columns.slice(1);
    const columnNames4 = priceList.columns.slice(1);

    const empValue = columnNames1[1];
    const unempValue = columnNames1[1];

    const annualPopRate = columnNames2[1];

    const xValue = houseCompData.columns[0];
    const xValue2 = priceList.columns[0];

    const dataSet = dataSets(economyData, columnNames1);
    const dataSet2 = dataSets(demographicsData, columnNames2);
    const dataSet3 = dataSets(houseCompData, columnNames3);
    const dataSet4 = dataSets(priceList, columnNames4);

    dataSet.forEach( d => {
        d.quarter = parseTime(d.quarter);
    });
    
    const dateFiltered = dataSet.filter( d => {
        return d.quarter >= new Date("Tue Jan 01 2016 00:00:00");
    });

    const dublinData =  dateFiltered.filter( d => {
        return d.region === "Dublin";
    });

    const irelandData = dateFiltered.filter( d => {
        return d.region === "Ireland";
    });

    const dublinAnnualRate = dataSet2.filter( d => {
        return d.region === "Dublin";
    });

    const irelandAnnualRate = dataSet2.filter( d => {
        return d.region === "Ireland";
    });

    console.log("these are the datasets for pop for ireland and dublin", dublinAnnualRate, irelandAnnualRate);

    // charts setup here

    const houseCompMonthly = new GroupedBarChart(dataSet3, columnNames3, xValue, "#hc-glance", "Units", "title2");
   
    const priceListQuartley = new GroupedBarChart(dataSet4, columnNames4, xValue2, "#ap-glance", "€", "title2");
    // const dublinData = DublinOnly.filter( d => {
    //     return d.quarter >= new Date("Tue Jan 01 2013 00:00:00");
    // });
    
    // for now will just copy but need to create a class for this chart objects
    const lv = dublinData.length;

    let elementNode = d3.select("#test-glance").node();
    let eWidth = elementNode.getBoundingClientRect().width; 

    const lastValue = dublinData[lv-1];
    const lastValue2 = irelandData[lv-1];
    
    // dimensions margins, width and height
    const m = [20, 10, 25, 10],
        w = eWidth - m[1] - m[3],
        h = 120 - m[0] - m[2];
    
    // setting the line values range
    let x = d3.scaleTime().range([0, w-5]);
    let y = d3.scaleLinear().range([h, 0]);
    
    // setup the line chart
    let valueline = d3.line()
        .x(function(d,i) { return x(d.quarter); })
        .y(function(d) { return y(d[empValue]); })
        .curve(d3.curveBasis);

    let valueline2 = d3.line()
        .x(function(d,i) { return x(d.quarter); })
        .y(function(d) { return y(d[unempValue]); })
        .curve(d3.curveBasis);

    // Adds the svg canvas
    let svg = d3.select("#test-glance")
        .append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("g")
        .attr("transform", "translate(" + m[3] + "," + "10" + ")");
        // Scale the range of the data
        let maxToday = dublinData.length > 0 ? d3.max(dublinData, function(d) { return d[empValue]; }) : 0;
        let maxReference = irelandData.length > 0 ? d3.max(irelandData, function(d) { return d[unempValue]; }) : 0;
        x.domain(d3.extent(dublinData, d => {
            return (d.quarter); }));
        y.domain([0, Math.max(maxToday, maxReference)]);
    

    svg.append("path")
        .attr("d", valueline2(irelandData))
        .attr("stroke","rgba(150,150,150,.3)")
        .attr("stroke-width", 4)
        .attr("fill", "none")
        .attr("stroke-linecap", "round");
 
    svg.append("path")
        .attr("class", "activity")
        .attr("d", valueline(dublinData))
        .attr("stroke","#16c1f3")
        .attr("stroke-width", 4)
        .attr("fill", "none")
        .attr("stroke-linecap", "round");
    
    svg.append("text")
        .attr("dx", 0)
        .attr("dy", 105)
        .attr("class", "label yesterday")
        .attr("fill", "#f8f9fabd")
        .text("Ireland");

    svg.append("text")
        .attr("dx", 150)
        .attr("dy", 105)
        .attr("class", "label employment")
        .attr("fill", "#f8f9fabd")
        .text("Q2 2017 : " + lastValue2[empValue] + "%");

    svg.append("text")
        .attr("dx", 0)
        .attr("dy", 2)
        .attr("class", "label employment")
        .attr("fill", "#16c1f3")
        .text("Dublin")

    svg.append("text")
        .attr("dx", 150)
        .attr("dy", 2)
        .attr("class", "label employment")
        .attr("fill", "#16c1f3")
        .text("Q2 2017 : " + lastValue[unempValue] + "%");


    const size = dublinAnnualRate.length;   
    const lValue = dublinAnnualRate[size-1];
    const lValue2 = irelandAnnualRate[size-1];
        
    // setting the line values range
    let x2 = d3.scaleLinear().range([0, w-5]);
    let y2 = d3.scaleLinear().range([h, 0]);
        
    // setup the line chart
    let valuelineRate = d3.line()
        .x(function(d,i) { return x2(d.date); })
        .y(function(d) { return y2(d[annualPopRate]); })
        .curve(d3.curveBasis);
    
    // Adds the svg canvas
    let svg2 = d3.select("#pr-glance")
        .append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("g")
        .attr("transform", "translate(" + m[3] + "," + "10" + ")");
        // Scale the range of the data
        let maxDublin = dublinAnnualRate.length > 0 ? d3.max(dublinAnnualRate, function(d) { return d[annualPopRate]; }) : 0;
        let maxIreland = irelandAnnualRate.length > 0 ? d3.max(irelandAnnualRate, function(d) { return d[annualPopRate]; }) : 0;
        x2.domain(d3.extent(dublinAnnualRate, d => {
            return (d.date); }));
        y2.domain([0, Math.max(maxDublin, maxIreland)]);
        
        svg2.append("path")
            .attr("d", valuelineRate(irelandAnnualRate))
            .attr("stroke","rgba(150,150,150,.3)")
            .attr("stroke-width", 4)
            .attr("fill", "none")
            .attr("stroke-linecap", "round");
     
        svg2.append("path")
            .attr("class", "activity")
            .attr("d", valuelineRate(dublinAnnualRate))
            .attr("stroke","#16c1f3")
            .attr("stroke-width", 4)
            .attr("fill", "none")
            .attr("stroke-linecap", "round");
        
        svg2.append("text")
            .attr("dx", 0)
            .attr("dy", 105)
            .attr("class", "label yesterday")
            .attr("fill", "#f8f9fabd")
            .text("Ireland");
    
        svg2.append("text")
            .attr("x", w)
            .attr("y", h + 30)
            .attr("text-anchor", "end")
            .attr("class", "label employment")
            .attr("fill", "#f8f9fabd")
            .text("2016: " + lValue2[annualPopRate] + " (No. per 1000 Pop.)");
    
        svg2.append("text")
            .attr("dx", 0)
            .attr("dy", 2)
            .attr("class", "label employment")
            .attr("fill", "#16c1f3")
            .text("Dublin")
    
        svg2.append("text")
            .attr("x", w)
            .attr("y", 2)
            .attr("text-anchor", "end")
            .attr("class", "label employment")
            .attr("fill", "#16c1f3")
            .text("2016 : " + lValue[annualPopRate] + " (No. per 1000 Pop.)");

}).catch(function(error){
    console.log(error);
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});


class DataGlanceLine{

    // constructor function
    constructor (_data, _data2, _keys, _lastItem, _xValue, _element, _titleX, _titleY){

        this.data = _data;
        this.data2 = _data2 !== null ? _data2 : null;
        this.keys = _keys;
        this.lastItem = _lastItem;
        this.xValue = _xValue;
        this.element = _element;
        this.titleX = _titleX; 
        this.titleY = _titleY; 

        // create the chart area
        this.init();
    }

    init(){
        let dv = this;

        dv.elementNode = d3.select(dv.element).node();
        dv.eWidth = elementNode.getBoundingClientRect().width; 
        
        // dimensions margins, width and height
        const m = [20, 10, 25, 10],
            w = eWidth - m[1] - m[3],
            h = 120 - m[0] - m[2];
        
        // setting the line values range
        let x = d3.scaleTime().range([0, w-5]);
        let y = d3.scaleLinear().range([h, 0]);
        
        // setup the line chart
        let valueline = d3.line()
            .x(function(d,i) { return x(d.quarter); })
            .y(function(d) { return y(d[empValue]); })
            .curve(d3.curveBasis);
    
        let valueline2 = d3.line()
            .x(function(d,i) { return x(d.quarter); })
            .y(function(d) { return y(d[unempValue]); })
            .curve(d3.curveBasis);
    }

}

class GroupedBarChart{

    // constructor function
    constructor (_data, _keys, _xValue, _element, _titleX, _titleY){

        this.data = _data;
        this.keys = _keys;
        this.xValue = _xValue;
        this.element = _element;
        this.titleX = _titleX;
        this.titleY = _titleY;

        this.init();
    }

    // initialise method to draw chart area
    init(){
        let dv = this; 
        let last = dv.data.length -1;

        let eNode = d3.select(dv.element).node();
        let eWidth = eNode.getBoundingClientRect().width; 
        
        // margin
        dv.m = [20, 10, 25, 10]
        
        dv.width = eWidth - dv.m[1] - dv.m[3];
        dv.height = 120 - dv.m[0] - dv.m[2];

        console.log("values of dimensions", dv.width, dv.height);

        dv.tooltip = d3.select(".page__root")
            .append('div')  
            .attr('class', 'tool-tip');  

        // add the svg to the target element
        const svg = d3.select(dv.element)
            .append("svg")
            .attr("width", dv.width + dv.m[1] + dv.m[3])
            .attr("height", dv.height + dv.m[0] + dv.m[2]);
       
        // add the g to the svg and transform by top and left margin
        dv.g = svg.append("g")
            .attr("transform", "translate(" + dv.m[3] + "," + "10" + ")");
    
        // transition 
        dv.t = () => { return d3.transition().duration(1000); }
    
        dv.colourScheme = ["#aae0fa","#00929e","#16c1f3","#16c1f3","#da1e4d","#086fb8","#16c1f3"];

        // set colour function
        dv.colour = d3.scaleOrdinal(dv.colourScheme.reverse());

        dv.x0 = d3.scaleBand()
            .range([0, dv.width])
            .padding(0.05);

        dv.x1 = d3.scaleBand()
            .paddingInner(0.1);
    
        dv.y = d3.scaleLinear()
            .range([dv.height, 0]);

        // dv.xAxisCall = d3.axisBottom()
        // .tickSize(0);

        // dv.xAxis = dv.g.append("g")
        //     .attr("class", "no-axis x-axis")
        //     .attr("transform", "translate(0," + (dv.height + 10) +")");
    
        // Start Month
        dv.g.append("text")
            .attr("class", "label")
            .attr("x", 0)
            .attr("y", dv.height + 30)
            .attr("text-anchor", "start")
            .attr("fill", "#f8f9fabd")
            .text(dv.data[0].date);
    
        // Last Month
        dv.g.append("text")
            .attr("class", "label")
            .attr("x", dv.width)
            .attr("y", dv.height + 30)
            .attr("text-anchor", "end")
            .attr("fill", "#f8f9fabd")
            .text(dv.data[last].date);
        
        // Title 
        dv.g.append("text")
            .attr("dx", 0)
            .attr("dy", 2)
            .attr("class", "label")
            .attr("fill", "#16c1f3")
            .text(dv.keys[0]);

        // Last Month Value in Units
        dv.g.append("text")
            .attr("x", dv.width)
            .attr("y", 2)
            .attr("text-anchor", "end")
            .attr("class", "label")
            .attr("fill", "#16c1f3")
            .text(dv.titleX === "€" ? dv.data[last].date + " : " + dv.titleX + d3.format(",")(dv.data[last][dv.keys[0]]) :
                  dv.data[last].date + " : " +dv.data[last][dv.keys[0]] + " " + dv.titleX);
    
        dv.update();
    
    }
    
    update(){
        let dv = this;

        // Update scales
        console.log("grouped bar chart data", dv.data);
        dv.x0.domain(dv.data.map(d => { return d[dv.xValue]; }));
        dv.x1.domain(dv.keys).range([0, dv.x0.bandwidth()]);
        dv.y.domain([0, d3.max(dv.data, d => { return d3.max(dv.keys, key => { return d[key]; }); })]).nice();

        // Update axes
        // dv.xAxisCall.scale(dv.x0);
        // dv.xAxis.call(dv.xAxisCall);
        
        // dv.yAxisCall.scale(dv.y);
        // dv.yAxis.call(dv.yAxisCall);

        // join new data with old elements.
        dv.rects = dv.g.append("g")
            .attr("class","parent")
            .selectAll("g")
            .data(dv.data)
            .enter()
            .append("g")
            .attr("transform", (d) => { return "translate(" + dv.x0(d[dv.xValue]) + ", 10)"; })
            .selectAll("rect")
            .data(d => { return dv.keys.map( key => { 
                    return {
                        key: key, 
                        value: d[key]
                     }; 
                }); 
            })
            .enter().append("rect")
            .attr("x", d => { return dv.x1(d.key); })
            .attr("y", d => { return dv.y(d.value); })
            .attr("width", dv.x1.bandwidth())
            .attr("height", d => { return (dv.height - dv.y(d.value)) ; })
            .attr("rx","2")
            .attr("ry","2")
            .attr("fill", "rgba(29, 158, 201, 0.42)")
            .attr("fill-opacity", ".75");

            d3.select(".parent g:nth-last-child(1) rect")
                .attr("fill", "#16c1f3")
                .attr("fill-opacity", "1");
        
        // dv.g.selectAll("rect")
        //     .on("mouseover", function(){ 
        //         dv.tooltip.style("display", "inline-block"); 
        //     })
        //     .on("mouseout", function(){ 
        //         dv.tooltip.style("display", "none"); 
        //     })
        //     .on("mousemove", function(d){
        //         let dx  = parseFloat(d3.select(this).attr('x')) + dv.x0.bandwidth() + 100, 
        //             dy  = parseFloat(d3.select(this).attr('y')) + 10;
        //         var x = d3.event.pageX, 
        //             y = d3.event.clientY;
        //         console.log("mouse positions", x, y);

        //         dv.tooltip
        //             .style( 'left', (d3.event.pageX+10) + "px" )
        //             .style( 'top', (d3.event.pageY) + "px" )
        //             .style( 'display', "inline-block" )
        //             .text("The value is: " + (d.value)); // what should the value be ?
        //     });
    }
    
}
