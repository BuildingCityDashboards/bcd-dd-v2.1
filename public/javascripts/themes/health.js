let parseTime = d3.timeParse("%d/%m/%Y"),
    formatTime = d3.timeFormat("%d/%m/%Y"),
    formatYear = d3.timeFormat("%Y"),
    formatMonthYear = d3.timeFormat("%b-%Y"),
    parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
    parseYear = d3.timeParse("%Y");

const getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p);

Promise.all([
    d3.csv("../data/Health/trolleys_transposed.csv"),
    d3.csv("../data/Health/healthlevels2011.csv"),
    d3.csv("../data/Health/healthlevelscount2011.csv")
]).then(datafiles => {
    // t is for trolleys

    const tData = datafiles[0],
          tKeys = tData.columns.slice(3),
          tdateField = tData.columns[2],
          tDataProcessed = dataSets(tData, tKeys)
          selector = "#chart-trolleys";

          tDataProcessed.forEach( d => {
            let d1 = parseTime(d[tdateField]);
                d1.setDate(d1.getDate()-2);
                d.label = "W" + d.week;  
                d.date = d1;
          });

        const tCharts = new StackedAreaChart(selector, "Weeks", "No. of Patients", "date", tKeys);
        // (data, title of X axis, title of Y Axis, y Scale format, name of type, name of value field )  

        
        // const trolleys2016 = filterByDateRange(tDataProcessed, "date", "Dec 29 2015", "Dec 31 2016"),
        //       trolleys2015 = filterByDateRange(tDataProcessed, "date", "Dec 28 2014", "Dec 31 2015"),
        //       trolleys2014 = filterByDateRange(tDataProcessed, "date", "Dec 28 2013", "Dec 31 2014"),
        //       trolleys2013 = filterByDateRange(tDataProcessed, "date", "Dec 28 2012", "Dec 31 2013");

              tCharts.pagination(tDataProcessed, selector, 52, 4, "year", "No. of Patients:", "000", true);

            // d3.select("#t2016").on("click", function(){
            //     $(this).siblings().removeClass("active");
            //     $(this).addClass("active");
            //     tCharts.pagination(trolleys2016, selector, 13, 4);
            // });

            // d3.select("#t2015").on("click", function(){
            //     $(this).siblings().removeClass("active");
            //     $(this).addClass("active");
            //     tCharts.pagination(trolleys2015, selector, 13, 4);
            // });

            // d3.select("#t2014").on("click", function(){
            //     $(this).siblings().removeClass("active");
            //     $(this).addClass("active");
            //     tCharts.pagination(trolleys2014, selector, 13, 4);
            // });

            // d3.select("#t2013").on("click", function(){
            //     $(this).siblings().removeClass("active");
            //     $(this).addClass("active");
            //     tCharts.pagination(trolleys2013, selector, 13, 4);
            // });

        // all this goes into a function pass the chart obj, selector, xTitle
        // const slices = slicer( trolleys2016, 13 ),
        //     times =  4,
        //     startSet = slices(times - 1);
        
        // let moreButtons = d3.select(selector)
        //         .append("div")
        //         .attr("class", "text-center pb-2");

        //     tCharts.getData(startSet);
        //     tCharts.addTooltip("No. of Patients:", "000");

        //     for(i=0; i<times; i++){
        //         let wg = slices(i);

        //         moreButtons.append("button")
        //         .attr("type", "button")
        //         .attr("class", i === times -1 ? "btn btn-page mx-1 active" : "btn btn-page")
        //         .style("border-right", i === times -1 ? "none" : "1px Solid #838586")
        //         .text("Weeks "+ (1+(i*13)) +" - "+ ((i+1)*13))
        //         .on("click", function(){
        //             if(!$(this).hasClass("active")){
        //                 $(this).siblings().removeClass("active");
        //                 $(this).addClass("active");
        //                 tCharts.getData(wg);
        //                 tCharts.addTooltip("No. of Patients:", "000");
        //             }
        //         });
        //     }

    // health levels data and chart
    // data and chart for hl = health levels
    const hlData = datafiles[2],
          hlRateData = datafiles[1],
          hlTypes = hlData.columns.slice(1),
          hlDate = hlData.columns[0],
          hlDataProcessed = dataSets(hlData, hlTypes),
          hlDataRateProcessed = dataSets(hlRateData, hlTypes);

    // console.log("hl data processed", hlDataProcessed);
    // drawing charts for planning data.
    const hlChart = new GroupedBarChart(hlDataProcessed, hlTypes, hlDate, "#chart-healthlevels", "Health Level", "Population");

    // d3.select("#hlevels_count").on("click", function(){
    //     $(this).siblings().removeClass("active");
    //     $(this).addClass("active");
    //     trolleysChart.getData(trolleysType[0], trolleysDataNested, "Years", "Hectares");
  
    // });

    // d3.select("#hlevels_rate").on("click", function(){
    //     $(this).siblings().removeClass("active");
    //     $(this).addClass("active");
    //     trolleysChart.getData(trolleysType[0], trolleysDataNested, "Years", "Hectares");
   
    // });


}).catch(function(error){
    console.log(error);
});

function convertQuarter(q){
    let splitted = q.split("Q");
    let year = splitted[0];
    let quarterEndMonth = splitted[1] * 3 - 2;
    let date = d3.timeParse("%m %Y")(quarterEndMonth + " " + year);
    return date;
}

function qToQuarter(q){

    let splitted = q.split("Q");
    let year = splitted[0];
    let quarter = splitted[1];
    let quarterString = ("Quarter "+ quarter + " " + year);

    return quarterString;
}

function dataSets(data, columns){
    
    coercedData = data.map( d => {
        for( var i = 0, n = columns.length; i < n; i++ ){
            d[columns[i]] !== "NULL" ? d[columns[i]]= +d[columns[i]] : d[columns[i]] = 0;
            // d[hosiptal] !== "NULL" ? +d[hosiptal] : 0;
        }
        return d;
        });

    return coercedData;
}

function formatQuarter(date){
    
    let newDate = new Date();
        newDate.setMonth(date.getMonth() + 1);
    
    let year = (date.getFullYear());
    let q = Math.ceil(( newDate.getMonth()) / 3 );
    
    return "Quarter "+ q + " " + year;
}

function filterByDateRange(data, dateField, dateOne, dateTwo){
    return data.filter( d => {
        return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo);
    });
}

function filterbyDate(data, dateField, date){
    return data.filter( d => {
        return d[dateField] >= new Date(date);
    });
}

// function slicer( arr, sliceBy ){
//     if ( sliceBy < 1 || !arr ) return () => [];
    
//     return (p) => {
//         const base = p * sliceBy;

//         return p < 0 || base >= arr.length ? [] : arr.slice( base,  base + sliceBy );
//     };
// }

// function pagination(_data, _selector, _sliceBy, _pageNumber){
    
//     const chartObj = this;
//     console.log(chartObj);
    
//     const slices = slicer( _data, _sliceBy ), 
//           times =  _pageNumber,
//           startSet = slices(times - 1);

//     let moreButtons = d3.select(_selector)
//         .append("div")
//         .attr("class", "text-center pb-2");

//     // tCharts.getData(startSet);
//     // tCharts.addTooltip("No. of Patients:", "000");

//     for(i=0; i<times; i++){
//         let wg = slices(i);

//         moreButtons.append("button")
//         .attr("type", "button")
//         .attr("class", i === times -1 ? "btn btn-page mx-1 active" : "btn btn-page")
//         .style("border-right", i === times -1 ? "none" : "1px Solid #838586")
//         .text("Weeks "+ (1+(i*13)) +" - "+ ((i+1)*13))
//         // .on("click", function(){
//         //     if(!$(this).hasClass("active")){
//         //         $(this).siblings().removeClass("active");
//         //         $(this).addClass("active");
//         //         tCharts.getData(wg);
//         //         tCharts.addTooltip("No. of Patients:", "000");
//         //     }
//         // });
//     }
// }