    // var section = d3.select("#economy");
    // var article = d3.select("#income_poverty");
    
    var parseTime = d3.timeParse("%d/%m/%Y");
    var formatTime = d3.timeFormat("%d/%m/%Y");
    var parseYear = d3.timeParse("%Y");

    var nut3regions = [
        "Dublin",
        "Ireland",
    ];

    /*** This employment Chart ***/
    d3.csv("../data/Economy/QNQ22_employment.csv").then(function(data){
        const columnNames = data.columns.slice(2),
            xValue = data.columns[0],
            groupBy = data.columns[1],
            yLabels = ["Thousands", "% Change", "% Change"];
        console.log("data",data);

        data.forEach(d => {
            d.date = parseTime(d.quarter);
            for(var i = 0, n = columnNames.length; i < n; ++i){
                d[columnNames[i]] = +d[columnNames[i]]; 
            }
            return d;
        })

        const types = d3.nest()
            .key(function(d){ return d[groupBy];})
            .entries(data);

        console.log("types", types);

        let grouping = types.map(d => d.key);
        console.log("key names of the grouping", grouping );

        let annualData = data;

        let annual = annualData.filter((e) => {
                    var dateStr = "01/10/";
                    return (e.quarter.indexOf(dateStr) !== -1);
                  });

                  console.log("this is just the last quarter data", annual);

            annual = d3.nest()
                  .key(function(d){ return d[groupBy];})
                  .entries(annual);

                  console.log("this is the last quarter data nested!", annual);
                
            annual.forEach( ad => {
                ad.values.map( (d, i) => {
                    if(ad.values[i - 1] && i < (ad.values.length - 1)){
                        let selectType = columnNames[0];
                        let prev = ad.values[i - 1][selectType] ;
                        let diff = ((d[selectType]  - prev)/d[selectType] ) * 100;
                        let year = d.date.getYear();

                        console.log("how many loops?", year);

                        d.key = d.key;
                        d.date = d.date;
                        d.diff = diff;
                    } else{
                        d.diff = 0;
                        d.date = d.date;
                    }
                });
            });

        console.log("whats this data set values",annual);

      
        


        // // categories the data into types based on the columns
        // const types = columnNames.map(name => { 
        //     return {
        //       name: name, 
        //       values: data.map(d => { 
        //         let dates = parseTime(d.quarter);
        //         return {
        //           date: dates,
        //           region: d.region, 
        //           quarter: d.quarter,
        //           year: dates.getFullYear(),
        //           value: +(d[name])
        //           };
        //       }),
        //     };
        //   });

        

        // let countData = types.find( d => d.name === columnNames[0] );
        //     countData = d3.nest()
        //     .key(function(d){ return d[groupBy];})
        //     .entries(countData.values);

        // let qChangeData = (types.find( d => d.name === columnNames[1] ));
        //     qChangeData = d3.nest()
        //     .key(function(d){ return d[groupBy];})
        //     .entries(qChangeData.values);

        // console.log("first qChangeData", qChangeData);

        // let annualData = types.find( d => d.name === columnNames[0] );
        //     annualData = d3.nest()
        //                 .key(function(d){ return d[groupBy];})
        //                 .key(function(d){ return d.year;})
        //                 .rollup(function(v) { return d3.sum(v, function(d) { return d.value; });})
        //                 .entries(annualData.values);
        // console.log("this shiuyld have more valuies but it doesn't", annualData);
        
        // annualData.forEach( data => {
        //     data.values.map( (d, i) => {
        //         if(data.values[i - 1] && i < (data.values.length - 1)){
        //             let prev = data.values[i - 1].value;
        //             let diff = ((d.value - prev)/d.value) * 100;
        //             console.log("how many loops?");
        //             d.key = d.key;
        //             d.date = parseYear(d.key);
        //             d.diff = diff;
        //         } else{
        //             d.diff = 0;
        //             d.date = parseYear(d.key);
        //         }
        //     });

        // });

        // console.log("whats this data set values",annualData)
  
        // let regionData = d3.nest()
        //       .key(function(d){ return d[groupBy];})
        //       .entries(countData.values);

        const mlineChart = new MultiLineChart("#chart-employment", "Quarters", "Thousands", yLabels, grouping);
        mlineChart.getData(types, columnNames[0]);

        d3.select(".employment_count").on("click", function(){
            mlineChart.getData(types, columnNames[0]);
        });
        
        d3.select(".employment_qrate").on("click", function(){
            mlineChart.getData(types, columnNames[1]);
        });

        d3.select(".employment_arate").on("click", function(){
            mlineChart.getData(annual, "diff");
        });

        console.log(mlineChart);
    })
    .catch(function(error){
        console.log(error);
        });

    /*** This unemployment Chart ***/
    d3.csv("../data/Economy/QNQ22_2.csv").then(function(data){

        const columnNames = data.columns.slice(2);
        const staticNames = data.columns.slice(0,2);

        data.forEach(d => {
            for(var i = 0, n = columnNames.length; i < n; ++i){
                d[columnNames[i]] = +d[columnNames[i]];
            }
            return d;
        });

        var types = columnNames.map(function(name) { // Nest the data into an array of objects with new keys

            return {
              name: name, // "name": the csv headers except date
              values: data.map(function(d) { // "values": which has an array of the dates and ratings
                return {
                  date: d.quarter,
                  region: d.region, 
                  value: +(d[name]),
                  };
              }),
            };
          });

        const employment = types.find( d => d.name === columnNames[0] );
        const unemployment = types.find( d => d.name === columnNames[1] );

        console.log("lets see if this works", employment);
        console.log("lets see if this works", unemployment);

        stackData = data;
        multilineData = data;
        
        // console.log("mutliline Data", multilineData);
    
        keys = data.columns.slice(2);
        
        const xValue = data.columns[0];
        const groupBy = data.columns[1];

        const regionEmployment = d3.nest()
        .key(function(d){ return d[groupBy];})
        .entries(employment.values);

        console.log("nested figs", regionEmployment);

    
        // $("#chart-select").on("change", function(){
        //     employmentCharts.getData();
        // });
        
        // let list = d3.select("#chart-employment")
        //     .append("div")
        //     .attr("class","ml-5 pt-2");
    
        // list.selectAll("buttons")
        // // add the data and join
        //     .data(keys)
        //     .enter()
        // // append option with type name as value and text
        //     .append("buttons")
        //     .attr("value", d => d)
        //     .text( d => d )
        //     .attr("class", "btn btn-dark");
        
        // list.on("click", function(){
        //     mlineChart.getData();// pass data through here?
        // });

        // let list2 = d3.select("#chart-select2")
        //     .append("select")
        //     .attr("class","form-control series2");
    
        // list2.selectAll("option")
        // // add the data and join
        //     .data(keys)
        //     .enter()
        // // append option with type name as value and text
        //     .append("option")
        //     .attr("value", d => d)
        //     .text( d => d );
        
        // list2.on("change", function(){
        //     employmentCharts.getData();
        // });
        
        var yLabels = [
            "Thousands",
            "Thousands",
            "Thousands",
            "%",
            "%"
        ];
        
        const employmentCharts = new StackedAreaChart("#chartNew", 
        "Persons aged 15 years and over in Employment (Thousand)", "Euros");
        
        })// catch any error and log to console
        .catch(function(error){
        console.log(error);
        });


    /*** This the Gross Value Added per Capita at Basic Prices Chart ***/
    d3.csv("../data/Economy/RAA01.csv").then(function(data){

        // console.log("Income New Data", data);

        let columnNames = data.columns.slice(1);
        let incomeData = data;

        const IncomeGroupedBar = new StackBarChart("#chart-gva", incomeData, columnNames, "€", "Count");
    
    })
    .catch(function(error){
        console.log(error);
    });


    /*** This Survey on Income and Living Conditions for Dublin Charts ***/
    d3.csv("../data/Economy/SIA20.csv").then(function(data){

        let columnNames = data.columns.slice(2);
        // console.log(columnNames);
        let incomeData = data;

        console.log("Income data stacked values", incomeData);
        const IncomeGroupedBar = new StackBarChart("#chart-poverty-rate", incomeData, columnNames, "%", "Survey on Income and Living Conditions for Dublin");
        
    
    })
    .catch(function(error){
        console.log(error);
    });

    // load csv data and turn value into a number
    d3.csv("../data/Economy/IncomeAndLivingData.csv").then(function(data){   
        var keys = data.columns;
        
        // console.log(keys);

        // blank array
        var transposedData = [];
        data.forEach(d => {
            for (var key in d) {
                // console.log(key);
                var obj = {};
                if (!(key === "type" || key === "region")){
                obj.type = d.type;
                obj.region = d.region;
                obj.year = key;
                obj.value = +d[key];
                transposedData.push(obj);
            }}
        });

        newList = d3.nest()
            .key(d => { return d.region })
            .key(d => { return d.type })
            .entries(transposedData);

        // console.log("the data to use", newList);

        const disosableIncomeChart = new BarChart( newList,"#chart-disposable-income", "Dublin", "Median Real Household Disposable Income (Euro)", "Median Real Household Disposable Income", "Euros");
        
        // console.log("this should be the bar chart area", disosableIncomeChart);
    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });

    // load csv data and turn value into a number
    d3.csv("../data/Economy/IncomeAndLivingData.csv").then(function(data){   
        let columnNames = data.columns.slice(2);
        // console.log(columnNames);
        let employeesSizeData = data;
        // console.log(employeesSizeData);

    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });

    /*** Industry Sectors Charts here ***/
    //#chart-employment-sector
    d3.csv("../data/Economy/QNQ40.csv").then(function(data){ 

        let columnNames = data.columns.slice(2);

        data.forEach(d => {
            for(var i = 0, n = columnNames.length; i < n; ++i){

                d[columnNames[i]] = +d[columnNames[i]] || 0;
                // convert quarter to js time
                // var splitted = d.quarter.split('Q');
                // var year = splitted[0];
                // var quarterEndMonth = splitted[1] * 3 - 2;
                // d.date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year);
                d.date = d.quarter;
            }
            return d;
        });

        // // blank array
        // const transposedData = [];
        //     data.forEach(d => {
        //         for (var key in d) {
        //             // console.log(key);
        //             var obj = {};
        //             if (!(key === "date" || key === "region" || key === "quarter")){
        //             obj.date = d.date;
        //             obj.region = d.region;
        //             obj.quarter = d.quarter;
        //             obj.type = key;
        //             obj.value = +d[key];
        //             transposedData.push(obj);
        //         }}
        //     });

        // let nestData = d3.nest()
        //     .key(function(d){ return d.type;})
        //     .entries(transposedData);
        // console.log("employees By Sector Data", nestData);

        // let grouping = nestData.map(d => d.key);
        
        // const employeesBySectorChart = new MultiLineChart(nestData, "#chart-employment-sector", "Quarters", "Persons (000s)", "xValue", grouping);
        const newTest = new StackBarChart("#chart-employment-sector", data, columnNames, "Persons (000s)", "Quarters");
        
    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });
    
    //#chart-employees-by-size
    // load csv data and turn value into a number
    d3.csv("../data/Economy/BRA08.csv").then(function(data){ 

        let columnNames = data.columns.slice(3),
        xValue = data.columns[0];

        data.forEach(d => {
            for(var i = 0, n = columnNames.length; i < n; ++i){

                d[columnNames[i]] = +d[columnNames[i]];
                d.date = parseYear(d.date);
            }
            return d;
        });

        let employeesBySizeData = data;
        let nestData = d3.nest()
            .key(function(d){ return d.type;})
            .entries(employeesBySizeData);
        console.log("employeesBySizeData Data", nestData);

        let grouping = nestData.map(d => d.key);
        
        const employeesBySizeChart = new MultiLineChart("#chart-employees-by-size", "Years", "€", xValue, grouping);
              employeesBySizeChart.getData(nestData, "value");
    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });
    
    //#chart-overseas-vistors
        // load csv data and turn value into a number
        d3.csv("../data/Economy/overseasvisitors.csv").then(function(data){ 

            let columnNames = data.columns.slice(1),
                xValue = data.columns[0];
                console.log(xValue);

                data.forEach(d => {
                    for(var i = 0, n = columnNames.length; i < n; ++i){

                        d[columnNames[i]] = +d[columnNames[i]];
                    }
                    return d;
                });

            let overseasVisitorsData = data;
            // console.log("Overseas Data", overseasVisitorsData);
        
            const overseasvisitorsChart = new GroupedBarChart(overseasVisitorsData, columnNames, xValue, "#chart-overseas-vistors", "grouped bar chart", "Millions");
        })
        // catch any error and log to console
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