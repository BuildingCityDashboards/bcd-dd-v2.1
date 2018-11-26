
let annual ="../data/Economy/annualemploymentchanges.csv",
    QNQ22 = "../data/Economy/QNQ22_2.csv",
    pageSize = 12;
    
    /*** This QNQ22 employment and unemployment Charts ***/
    Promise.all([
        d3.csv(annual),
        d3.csv(QNQ22)

    ]).then(datafiles => {
        const QNQ22 = datafiles[1],
              annual = datafiles[0],
              keys = QNQ22.columns.slice(3), // 0-2 is date, quarter, region
              groupBy = "region",
              keysA = annual.columns.slice(2),
              test = d3Nest(QNQ22, "date"); // annual rate keys

              // coerce values and parse dates
              coerceNum(QNQ22, keys);
              coerceNum(annual, keysA);
              parseQuarter(QNQ22,"quarter");
              parseYearDates(annual, "date");  
            
        const emp = keys[0],
              unemp = QNQ22.columns[4],
              fData = filterbyDate(QNQ22, "date", "Jan 01  2006"),
              aNest = d3Nest(annual, groupBy),
              unempData = stackNest(fData, "label", "region" , unemp),
              empData = stackNest(fData, "label", "region" , emp),
              grouping = ["Dublin", "Ireland"],
              unempContent = {
                element: "#chart-unemp-rate",
                data: aNest,
                value: keysA[1],
                xTitle: "Years",
                yTitle: "%",
                yScaleFormat: "percentage",
              },
              empContent = {
                element: "#chart-emp-rate",
                data: aNest,
                value: keysA[0],
                xTitle: "Years",
                yTitle: "%",
                yScaleFormat: "percentage",
              };

        const employmentStack = new StackedAreaChart("#chart-employment", "Quarters", "Thousands", "date", grouping),
              unemploymentStack = new StackedAreaChart("#chartNew", "Quarters", "Thousands", "date", grouping);
                
              employmentStack.tickNumber = 5;
              employmentStack.pagination(empData, "#chart-employment", 24, 2, "year", "Thousands - Quarter:");
              employmentStack.addTooltip("Thousands - Quarter:", "thousands", "label");

              unemploymentStack.tickNumber = 5;
              unemploymentStack.pagination(unempData, "#chartNew", 24, 2, "year", "Thousands - Quarter:");
              unemploymentStack.addTooltip("Thousands - Quarter:", "thousands", "label");

        const employmentLine = new MultiLineChart(empContent);
              employmentLine.tickNumber = 24;
              employmentLine.drawChart();

              d3.select("#chart-emp-rate").style("display","none");
              employmentLine.addTooltip("Employment Annual % Change - ", "percentage", "label");
              employmentLine.hideRate(true);

            d3.select(".employment_count").on("click", function(){
                activeBtn(this);
                d3.select("#chart-employment").style("display","block");
                d3.select("#chart-emp-rate").style("display","none");
            });

            d3.select(".employment_arate").on("click", function(){
                activeBtn(this);
                d3.select("#chart-employment").style("display","none");
                d3.select("#chart-emp-rate").style("display","block");
            });

        const unemploymentLine = new MultiLineChart(unempContent);
              unemploymentLine.tickNumber = 24;
              unemploymentLine.drawChart()
              unemploymentLine.hideRate(true);
              
              d3.select("#chart-unemp-rate").style("display","none");
              unemploymentLine.addTooltip("Unemployment Annual % Change - ", "percentage", "year");

            d3.select(".unemployment_count").on("click", function(){
                activeBtn(this);
                d3.select("#chartNew").style("display","block");
                d3.select("#chart-unemp-rate").style("display","none");
            });

            d3.select(".unemployment_arate").on("click", function(){
                activeBtn(this);
                d3.select("#chartNew").style("display","none");
                d3.select("#chart-unemp-rate").style("display","block");
            });
    
    })
    .catch(function(error){
        console.log(error);
        });

    /*** This the Gross Value Added per Capita at Basic Prices Chart ***/
    d3.csv("../data/Economy/RAA01.csv").then( data => {

        let columnNames = data.columns.slice(1);
        let incomeData = data;
            incomeData.forEach( d => {
                d.label = d.date;
                d.date = parseYear(d.date);
                d.value = +d.value;
            })

        let idN = d3.nest().key( d => { return d.region;}).entries(incomeData);

        const idContent = {
            element: "#chart-gva",
            value: "value",
            data: idN,
            xTitle: "Years",
            yTitle: "€"
        };
        
        const IncomeGroupedBar = new MultiLineChart(idContent);
              IncomeGroupedBar.drawChart();
              IncomeGroupedBar.addTooltip("Gross Value Added - Year:", "thousands", "label");

        $("[id='Dublin plus Mid East']").attr("dy", -15);// hack as the force simulation won't work on partial data sets
    
    })
    .catch(function(error){
        console.log(error);
    });


    /*** This Survey on Income and Living Conditions for Dublin Charts ***/
    d3.csv("../data/Economy/SIA20.csv").then( data => {
        let columnNames = data.columns.slice(2);
        
        let incomeData = data;

            incomeData.forEach( d => {
                d.value = +d.value;
            });

        const IncomeGroupedBar = new StackBarChart("#chart-poverty-rate", incomeData, "type", "value", "%", "Survey on Income and Living Conditions for Dublin");
              IncomeGroupedBar.addTooltip("Poverty Rating - Year:", "percentage", "date");
        
    
    })
    .catch(function(error){
        console.log(error);
    });

    // load csv data and turn value into a number
    d3.csv("../data/Economy/IncomeAndLivingData.csv").then( data => {   
        var keys = data.columns;

        // blank array
        var transposedData = [];
        data.forEach(d => {
            for (var key in d) {
                // console.log(key);
                var obj = {};
                if (!(key === "type" || key === "region")){
                obj.type = d.type;
                obj.region = d.region;
                obj[d.type] = +d[key];
                obj.year = key;
                obj.value = +d[key];
                transposedData.push(obj);
            }}
        });

        console.log(transposedData);

        const tooltipContent = {
            title: "Dublin County - Year",
            datelabel: "year",
            valueFormat: "thousands",
        };

        newList = d3.nest()
            .key(d => { return d.region })
            // .key(d => { return d.type })
            .entries(transposedData);

        let dataFiltered = newList.find( d => d.key === "Dublin").values.filter(
                d => d.type === "Median Real Household Disposable Income (Euro)"
            );

        const disosableIncomeChart = new GroupedBarChart(dataFiltered, ["Median Real Household Disposable Income (Euro)"], "year", "#chart-disposable-income", "Years", "€");
              disosableIncomeChart.addTooltip(tooltipContent);
        
    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });

    // load csv data and turn value into a number
    d3.csv("../data/Economy/IncomeAndLivingData.csv").then( data => {   
        let columnNames = data.columns.slice(2),
            employeesSizeData = data;

    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });

    // /*** Industry Sectors Charts here ***/
    // //#chart-employment-sector
    d3.csv("../data/Economy/QNQ4017Q2.csv").then( data => { 
    //console.log("the sector data", data);

        data.forEach(d => {
            d.value = +d.value;
        })

       const treemap =  d3.treemap()
                        .size([800, 500])
                        .padding(1)
                        .round(true),

            stratify = d3.stratify(),
            //             .parentId(function(d) { return d.type.substring(0, d.type.lastIndexOf(" ")); }),
            root = d3.hierarchy(data).sum(function(d) {
                return d.value;
              });
              
                    // .sum(function(d) { return d.value; })
                    // .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
             
            treeData = treemap(root);

            const svg = d3.select("#chart-employment-sector").append("svg")
            
                  svg.append("g")
                    .selectAll("rect")
                    .data(treeData)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) { return d.x0; })
                    .attr("y", function(d) { return d.y0; })
                    .attr("width", function(d) { return d.x1 - d.x0; })
                    .attr("height", function(d) { return d.y1 - d.y0; })
        

        // let columnNames = data.columns.slice(2);

        // data.forEach(d => {
        //     for(var i = 0, n = columnNames.length; i < n; ++i){
        //         d[columnNames[i]] = +d[columnNames[i]] || 0;
        //         d.date = d.quarter;
        //     }
        //     return d;
        // });

        // // const employeesBySectorChart = new MultiLineChart(nestData, "#chart-employment-sector", "Quarters", "Persons (000s)", "xValue", grouping);
        // const newTest = new StackBarChart("#chart-employment-sector", data, columnNames, "Persons (000s)", "Quarters");
        // newTest.addTooltip("Poverty Rating Year:", "percentage", "date");
        
    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });
    
    //#chart-employees-by-size
    // load csv data and turn value into a number
    d3.csv("../data/Economy/BRA08.csv").then( data => { 

        let columnNames = data.columns.slice(3),
        xValue = data.columns[0];

        data.forEach(d => {
            for(var i = 0, n = columnNames.length; i < n; ++i){

                d[columnNames[i]] = +d[columnNames[i]];
                d.label = d.date;
                d.date = parseYear(d.date);
            }
            return d;
        });

        const employeesBySizeData = data;
        
        let nestData = d3.nest()
            .key( d =>{ return d.type;})
            .entries(employeesBySizeData);

        const employeesBySize = {
            element: "#chart-employees-by-size",
            value: "value",
            data: nestData,
            xTitle: "Years",
            yTitle: "Persons Engaged"
        };
        
        const employeesBySizeChart = new MultiLineChart(employeesBySize);
              employeesBySizeChart.yScaleFormat = "millions"; // update the y axis scale
              employeesBySizeChart.drawChart();
              employeesBySizeChart.addTooltip("Year:", "thousands", "year");
    })
    // catch any error and log to console
    .catch(function(error){
    console.log(error);
    });
    

    //#chart-overseas-vistors
        // load csv data and turn value into a number
        d3.csv("../data/Economy/overseasvisitors.csv").then( data => { 

            let columnNames = data.columns.slice(1),
                xValue = data.columns[0];

                data.forEach(d => {
                    for(var i = 0, n = columnNames.length; i < n; ++i){
                        d[columnNames[i]] = +d[columnNames[i]];
                    }
                    return d;
                });

            let overseasVisitorsData = data;
        
            const overseasvisitorsChart = new GroupedBarChart(overseasVisitorsData, columnNames, xValue, "#chart-overseas-vistors", "grouped bar chart", "Millions");
                  overseasvisitorsChart.addTooltip("Oversea Vistors (Millions) - Year", "thousands", xValue);
        
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

function coerceNum(d,k){
    d.forEach( d => {
        for( var i = 0, n = k.length; i < n; i++ ){
            d[k[i]] = d[k[i]] !== "null" ? +d[k[i]] : "unavailable";
        }
    return d;
    });
}

function  stackNest(data, date, name, value){
    let nested_data = d3Nest(data, date),
        mqpdata = nested_data.map(function(d){   
            let obj = {
                label: d.key
                }
                d.values.forEach(function(v){
                    obj.date = v.date;
                    obj.year = v.year;
                    obj[v[name]] = v[value];
                })
                return obj;
        })
        return mqpdata;
}

function d3Nest(d, n){
    let nest = d3.nest()
            .key( name => { return name[n];})
            .entries(d);
    return nest;
}

function parseYearDates(d,v){
    d.forEach( d => {
        d.label = d[v];
        d[v] = parseYear(d[v]);
      });
}

function parseQuarter(d,v){
    d.forEach( d => {
        d.label = d[v];
        d.date = convertQuarter(d[v]);
        d[v] = qToQuarter(d[v]);
        d.year = formatYear(d.date);
    });
}

function convertQuarter(q){
    let splitted = q.split('Q'),
        year = splitted[0],
        quarterEndMonth = splitted[1] * 3 - 2,
        date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year);

    return date;
}

function qToQuarter(q){
    let splitted = q.split('Q'),
        year = splitted[0],
        quarter = splitted[1],
        quarterString = (year + " Quarter "+ quarter);

    return quarterString;
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