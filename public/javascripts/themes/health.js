Promise.all([
    d3.csv("../data/Health/trolleys_transposed.csv"),
    d3.csv("../data/Health/healthlevels2011.csv"),
    d3.csv("../data/Health/healthlevelscount2011.csv")
]).then(datafiles => {
    // t is for trolleys
    const getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p),
          tData = datafiles[0],
          tKeys = tData.columns.slice(3),
          tdateField = tData.columns[2],
          tDataProcessed = dataSets(tData, tKeys),
          selector = "#chart-trolleys",
          cS = [
            "#00929e", //BCD-teal
            "#ffc20e", //BCD-yellow
            "#16c1f3", //BCD-blue
            "#da1e4d", //BCD-red
            "#998ce3", //purple
            "#6aedc7", //green
            ];

          tDataProcessed.forEach( d => {
            let d1 = parseTime(d[tdateField]);
                d1.setDate(d1.getDate()-2);
                d.label = "W" + d.week;  
                d.date = d1;
          });

        const tCharts = new StackedAreaChart(selector, "Weeks", "No. of Patients", "date", tKeys, cS);

              tCharts.tickNumber = 12;
              tCharts.pagination(tDataProcessed, selector, 52, 4, "year", "No. of Patients:", "000", true);
              tCharts.addTooltip("No. of Patients:", "thousands", "label");

    // health levels data and chart
    // data and chart for hl = health levels
    const hlData = datafiles[2],
          hlRateData = datafiles[1],
          hlTypes = hlData.columns.slice(1),
          hlDate = hlData.columns[0],
          hlDataProcessed = dataSets(hlData, hlTypes),
          hlDataRateProcessed = dataSets(hlRateData, hlTypes),


    hlContent = {
        element: "#chart-healthlevels",
        data: hlDataProcessed,
        keys: hlTypes,
        value: hlDate,
        titleX: "Health Level",
        titleY: "Population",
        yScaleFormat: "millions"
    },

    hlTT = {
        title: "Health Levels - Year:",
        datelabel: hlDate,
        format: "thousands",
    },

    // console.log("hl data processed", hlDataProcessed);
    // drawing charts for planning data.
    hlChart = new GroupedBarChart(hlContent);
    hlChart.addTooltip(hlTT);
    hlChart.hideRate(true);


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
            d[columns[i]] = d[columns[i]] !== "NULL" ? +d[columns[i]] : "unavailable";
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

function activeBtn(e){
    let btn = e;
    $(btn).siblings().removeClass('active');
    $(btn).addClass('active');
}