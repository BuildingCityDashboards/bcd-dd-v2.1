    // var section = d3.select("#economy");
    // var article = d3.select("#income_poverty");
    
    var parseTime = d3.timeParse("%d/%m/%Y");
    var formatTime = d3.timeFormat("%d/%m/%Y");
    var parseYear = d3.timeParse("%Y");

    var nut3regions = [
        "Dublin",
        "Ireland"
    ];

    /*** Trolley Chart ***/
    d3.csv("../data/Health/trolleys_transposed.csv").then(function(data){
        const columnNames = data.columns.slice(3), //skip first 3 cols
            xValue = data.columns[2], //date
            groupBy = data.columns[2],
            yLabels = ["Thousands", "% Change", "% Change"];
        
//        console.log("data",data);
//        console.log("columnNames",columnNames);
//console.log("xV",xValue);
//console.log("grp",groupBy)
        ;
        // data.forEach(d => {
        //     for(var i = 0, n = columnNames.length; i < n; ++i){
        //         d[columnNames[i]] = +d[columnNames[i]];
        //     }
        //     return d;
        // });

        // let annualData = d3.nest()
        //     .key(function(d) { return d.quarter; })
        //     .rollup(function(d) { return d3.sum(d, function(d) {return d.value; });
        //     }).entries(data);
        
        //     console.log("annual figures", annualData);

        const columnData = columnNames.map(name => { 
            return {
              name: name, 
              values: data.map(d => { 
                let dateParsed = parseTime(d.date);
                return {
                  date: dateParsed,
//                  region: d.region, 
//                  quarter: d.quarter,
//                  year: dates.getFullYear(),
                  value: +(d[name])
                  };
              })
            };
          });

        console.log("columnData[0]: ", JSON.stringify(columnData[0])); 
        
        var timeLine = dc.lineChart("#line");
    var timeLineWidth = 800;
    timeLine
            .width(timeLineWidth).height(550)
            .brushOn(false).renderArea(true).xyTipsOn(true)
            .margins({top: 50, right: 100, bottom: 50, left: 50})
            .dimension(dateDim)
            .group(wait_0_3_Group, '0-3 Months')
            .stack(wait_3_6_Group, '3-6 Months')
            .stack(wait_6_9_Group, '6-9 Months')
            .stack(wait_9_12_Group, '9-12 Months')
            .stack(wait_12_15_Group, '12-15 Months')
            .stack(wait_15_18_Group, '15-18 Months')
            .stack(wait_18Plus_Group, '18+ Months')
            .transitionDuration(750)
            .x(d3.scaleTime().domain([earliest, latest]))
            .elasticY(true)
            .yAxis().ticks(4)
            ;
//                    customise colours used on stacked areas
//TODO: use colorbrewer for safe colours
    timeLine.ordinalColors(['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b']);

    timeLine.title('0-3 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 0-3 months";
    });
    timeLine.title('3-6 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 3-6 months";
    });
    timeLine.title('6-9 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 6-9 months";
    });
    timeLine.title('9-12 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 9-12 months";
    });
    timeLine.title('12-15 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 12-15 months";
    });
    timeLine.title('15-18 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 15-18 months";
    });
    timeLine.title('18+ Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 18+ months";
    });
//                    interactive legend for each stack
    timeLine.legend(dc.legend().x(705).y(60).itemHeight(25).gap(40).autoItemWidth(false));

//                    workaround to filter by legend click
    timeLine.on('renderlet', function (chart) {
        chart.selectAll('.dc-legend-item')
                .on('click', function (d) {

                    var nme = d.name.toString();
//                    console.log("Click on legend: " + nme);
                    waitDim.filter(nme);
                    dc.redrawAll();
                })
    });


//                    workaround for inverting the legend stack layers
    dc.override(timeLine, 'legendables', timeLine._legendables);

    dc.override(timeLine, 'legendables', function () {
        var legendables = this._legendables();
        if (!this.dashStyle()) {
            return legendables.reverse();
        }
        return legendables.map(function (l) {
            l.dashstyle = this.dashStyle();
            return l.reverse();
        });
    });
        
        
        
        
        
//        let countData = columnData.find( d => d.name === columnNames[0] );
//          console.log("countData: ", countData);
//            countData = d3.nest()
//            .key(function(d){ return d[groupBy];})
//            .entries(countData.values);
//
//        let qChangeData = (columnData.find( d => d.name === columnNames[1] ));
//        qChangeData = d3.nest()
//        .key(function(d){ return d[groupBy];})
//        .entries(qChangeData.values);

//        // let annualData = 
//
//        console.log("filtered data", qChangeData, countData);

  
        // let regionData = d3.nest()
        //       .key(function(d){ return d[groupBy];})
        //       .entries(countData.values);
//
//        let grouping = countData.map(d => d.key);
//        console.log("grouping from countData", grouping );

//        const mlineChart = new StackedAreaChart2("#chart-trolleys", "Quarters", "Thousands", yLabels, grouping);
//        mlineChart.getData(columnData);
////
//        let employmentButtons = d3.selectAll(".employment-btn");
//        console.log("employmentButtons", employmentButtons);
//
//        d3.select(".employment_count").on("click", function(){
//            mlineChart.getData(countData);
//        });
//        
//        d3.select(".employment_qrate").on("click", function(){
//            mlineChart.getData(qChangeData);
//        });
//
//        console.log(mlineChart);
    }) //end of d3.csv().then()
    .catch(function(error){
        console.log(error);
        });
    
function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    
    for (var i = 0; i < l; i++) { // loop through the lookup array
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create a index for lookup table
    }
    
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    
    return output;
}