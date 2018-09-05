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
    d3.csv("/data/Demographics/CNA13.csv"),
    d3.csv("data/Housing/houseComp.csv"),
]).then( dataFiles => {

    const economyData = dataFiles[0];
    const demographicsData = dataFiles[1];
    const houseCompData = dataFiles[2];

    console.log("house comp data", houseCompData);

    const columnNames1 = economyData.columns.slice(2);
    
    const columnNames2 = demographicsData.columns.slice(2);

    const columnNames3 = houseCompData.columns.slice(1);

    const empValue = columnNames1[1];
    const unempValue = columnNames1[1];
    
    const annualPop = columnNames2[1];
    const annualCat = demographicsData.columns[0];

    const dataSet = dataSets(economyData, columnNames1);
    const dataSet2 = dataSets(demographicsData, columnNames2);
    const dataSet3 = dataSets(houseCompData, columnNames3);

    dataSet.forEach( d => {
        d.quarter = parseTime(d.quarter);
    });

    dataSet2.forEach( d => {
        d.date = parseYear(d.date);
    });
    
    const dateFiltered = dataSet.filter( d => {
        return d.quarter >= new Date("Tue Jan 01 2016 00:00:00");
    });

    const dateFiltered2 = dataSet2.filter( d => {
        return d.date >= new Date("Tue Jan 01 1990 00:00:00");
    });

    console.log("the population fitlered by date", dateFiltered2);

    const dublinData =  dateFiltered.filter( d => {
        return d.region === "Dublin";
    });

    const irelandData = dateFiltered.filter( d => {
        return d.region === "Ireland";
    });

    const bothAnnualRate = dateFiltered2.filter( d => {
        return d.category === "Both Sexes";
    });

    // const dublinData = DublinOnly.filter( d => {
    //     return d.quarter >= new Date("Tue Jan 01 2013 00:00:00");
    // });
    console.log("dataSet:", bothAnnualRate);
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
