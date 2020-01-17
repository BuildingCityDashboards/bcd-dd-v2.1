let employmentLine, unemploymentLine, employmentStack, unemploymentStack
let annual = '../data/Economy/annualemploymentchanges.csv',
  QNQ22 = '../data/Economy/QNQ22_2.csv',
  pageSize = 12

/** * This QNQ22 employment and unemployment Charts ***/
Promise.all([
  d3.csv(annual),
  d3.csv(QNQ22)

]).then(datafiles => {
  const QNQ22 = datafiles[1],
    annual = datafiles[0],
    keys = QNQ22.columns.slice(3), // 0-2 is date, quarter, region
    groupBy = 'region',
    keysA = annual.columns.slice(2),
    test = d3Nest(QNQ22, 'date') // annual rate keys

    // coerce values and parse dates
  coerceNum(QNQ22, keys)
  coerceNum(annual, keysA)
  parseQuarter(QNQ22, 'quarter')
  parseYearDates(annual, 'date')
    // d3.select('#economy').selectAll(".chart-holder").style("background-image", "none");
    // d3.select('#').selectAll(".chart-holder").style("background-color","#f8f8f8");
    // d3.selectAll(".chart-holder_PH").attr("class", "chart-holder");
    // d3.select('#chart-healthlevels').selectAll(".chart-holder").style("background-image", "none");

    /* d3.select("#chart-employment").style("background-image", "none");
    d3.select("#chart-emp-rate").style("background-image", "none");
    d3.select("#chart-unemp-rate").style("background-image", "none");
    d3.select("#chart-unemployment").style("background-image", "none");
    d3.select("#chart-population").style("background-image", "none");
    d3.select("#chart-households").style("background-image", "none");
    d3.select("#chart-bornOutsideState").style("background-image", "none");
    d3.select("#chart-householdComposition").style("background-image", "none");
    d3.select("#chart-waste").style("background-image", "none");
    d3.select("#chart-recyclings").style("background-image", "none");
    d3.select("#chart-organicrecyclings").style("background-image", "none");
    d3.select("#chart-watercons").style("background-image", "none");
    d3.select("#chart-riverqualities").style("background-image", "none");
    d3.select("#chart-greenflags").style("background-image", "none");
    d3.select("#chart-localagendas").style("background-image", "none"); */
    //

    /* d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none");
    d3.select("#").style("background-image", "none"); */
    //

  const emp = keys[0],
    unemp = QNQ22.columns[4],
    fData = filterbyDate(QNQ22, 'date', 'Jan 01  2001'),
    aNest = d3Nest(annual, groupBy),
    unempData = stackNest(fData, 'label', 'region', unemp),
    empData = stackNest(fData, 'label', 'region', emp),
    grouping = ['Dublin', 'Rest of Ireland'],
    unempContent = {
      e: '#chart-unemp-rate',
      d: aNest,
      xV: 'date',
      yV: keysA[1],
      tX: 'Years',
      tY: '%',
      ySF: 'percentage'
    },
    empContent = {
      e: '#chart-emp-rate',
      d: aNest,
      k: 'region',
      xV: 'date',
      yV: keysA[0],
      tX: 'Years',
      tY: '%',
      ySF: 'percentage'
    },
    unempCStack = {
      e: '#chart-unemployment',
      d: unempData,
      ks: grouping,
      xV: 'date',
      tX: 'Quarters',
      tY: 'Thousands',
      ySF: 'millions'
    },
    empCStack = {
      e: '#chart-employment',
      d: empData,
      ks: grouping,
      xV: 'date',
      tX: 'Quarters',
      tY: 'Thousands',
      ySF: 'millions'
    }
  employmentStack = new StackedAreaChart(empCStack)
  employmentStack.tickNumber = 12
    //   employmentStack.pagination(empData, "#chart-employment", 24, 3, "year", "Thousands - Quarter:");
    //   employmentStack.getData(empData);
  employmentStack.drawChart()
  employmentStack.addTooltip('Thousands - Quarter:', 'thousands', 'label')

  employmentLine = new MultiLineChart(empContent)
  employmentLine.tickNumber = 12
  employmentLine.drawChart()
  employmentLine.addTooltip('Employment Annual % Change - ', 'percentage2', 'label')
  employmentLine.hideRate(true) // hides the rate column in the tooltip when the % change chart is shown

  unemploymentStack = new StackedAreaChart(unempCStack)
  unemploymentStack.tickNumber = 12
    //   unemploymentStack.getData(unempData);
  unemploymentStack.drawChart()
  unemploymentStack.addTooltip('Thousands - Quarter:', 'thousands', 'label')
    //   employmentLine.createScales();

  unemploymentLine = new MultiLineChart(unempContent)
  unemploymentLine.tickNumber = 12
  unemploymentLine.drawChart()
  unemploymentLine.addTooltip('Unemployment Annual % Change - ', 'percentage2', 'label')
  unemploymentLine.hideRate(true)

  d3.select('#chart-emp-rate').style('display', 'none')

  d3.select('.employment_count').on('click', function () {
    activeBtn(this)
    d3.select('#chart-employment').style('display', 'block')
    d3.select('#chart-emp-rate').style('display', 'none')
      // need to redraw in case window size has changed
    employmentStack.tickNumber = 12
    employmentStack.drawChart()
    employmentStack.addTooltip('Thousands - Quarter:', 'thousands', 'label')
  })

  d3.select('.employment_arate').on('click', function () {
    activeBtn(this)
    d3.select('#chart-employment').style('display', 'none')
    d3.select('#chart-emp-rate').style('display', 'block')
    employmentLine.tickNumber = 10
    employmentLine.drawChart()
    employmentLine.addTooltip('Employment Annual % Change - ', 'percentage2', 'label')
    employmentLine.hideRate(true)
  })

  d3.select('#chart-unemp-rate').style('display', 'none')

  d3.select('.unemployment_count').on('click', function () {
    activeBtn(this)
    d3.select('#chart-unemployment').style('display', 'block')
    d3.select('#chart-unemp-rate').style('display', 'none')
    unemploymentStack.tickNumber = 12
    unemploymentStack.drawChart()
    unemploymentStack.addTooltip('Thousands - Quarter:', 'thousands', 'label')
  })

  d3.select('.unemployment_arate').on('click', function () {
    activeBtn(this)
    d3.select('#chart-unemployment').style('display', 'none')
    d3.select('#chart-unemp-rate').style('display', 'block')
    unemploymentLine.tickNumber = 10
    unemploymentLine.drawChart()
    unemploymentLine.addTooltip('Unemployment Annual % Change - ', 'percentage2', 'label')
    unemploymentLine.hideRate(true)
  })
})
  .catch(function (error) {
    console.log(error)
  })

/** * This the Gross Value Added per Capita at Basic Prices Chart ***/
// d3.csv("../data/Economy/RAA01.csv").then( data => {
//
//     let columnNames = data.columns.slice(1),
//         incomeData = data;
//
//         incomeData.forEach( d => {
//             d.label = d.date;
//             d.date = parseYear(d.date);
//             d.value = +d.value;
//         });
//
//     const idContent = {
//         e: "#chart-gva",
//         xV: "date",
//         yV: "value",
//         d: incomeData,
//         k: "region",
//         ks: ["Dublin","Dublin plus Mid East","State"],
//         tX: "Years",
//         tY: "€"
//     };
//
//     const GVA = new MultiLineChart(idContent);
//           GVA.drawChart();
//           GVA.addTooltip("Gross Value Added - Year:", "thousands", "label");
//
//     $("[id='Dublin plus Mid East']").attr("dy", -15);// hack as the force simulation won't work on partial data sets
//
// })
// .catch(function(error){
//     console.log(error);
// });
//
//
// /*** This Survey on Income and Living Conditions for Dublin Charts ***/
// d3.csv("../data/Economy/SIA20.csv").then( data => {
//     let incomeData = data,
//         incomeContent;
//
//         incomeData.forEach( d => {
//             d.value = +d.value;
//         });
//
//         incomeContent = {
//             e: "#chart-poverty-rate",
//             d: incomeData,
//             k: "type",
//             xV: "date",
//             yV: "value",
//             tY: "%",
//             tX: "Years",
//             ySF: "percentage",
//         };
//
//     const IncomeGroupedBar = new StackBarChart(incomeContent);
//           IncomeGroupedBar.addTooltip("Poverty Rating - Year:", "percentage2", "date");
//
//
// })
// .catch(function(error){
//     console.log(error);
// });
//
// // load csv data and turn value into a number
// d3.csv("../data/Economy/IncomeAndLivingData.csv").then( data => {
//     let keys = data.columns,
//           transposedData = [],
//           newList,
//           dataFiltered,
//           tooltipContent,
//           disosableIncomeContent,
//           key = ["Median Real Household Disposable Income (Euro)"];
//
//           data.forEach(d => {
//             for (var key in d) {
//                 // console.log(key);
//                 var obj = {};
//                 if (!(key === "type" || key === "region")){
//                 obj.type = d.type;
//                 obj.region = d.region;
//                 obj[d.type] = +d[key];
//                 obj.year = key;
//                 obj.value = +d[key];
//                 transposedData.push(obj);
//             }}
//           });
//
//         newList = d3.nest()
//             .key(d => { return d.region })
//             // .key(d => { return d.type })
//             .entries(transposedData);
//
//         dataFiltered = newList.find( d => d.key === "Dublin").values.filter(
//             d => d.type === "Median Real Household Disposable Income (Euro)"
//         );
//
//         tooltipContent = {
//             title: "Dublin County - Year",
//             datelabel: "year",
//             format: "euros",
//         };
//
//         disosableIncomeContent = {
//             e: "#chart-disposable-income",
//             d: dataFiltered,
//             ks: key,
//             xV: "year",
//             tX: "Years",
//             tY: "",
//             ySF: "euros"
//         };
//
//     const disosableIncomeChart = new GroupedBarChart(disosableIncomeContent);
//           disosableIncomeChart.addTooltip(tooltipContent);
//
// })
// // catch any error and log to console
// .catch(function(error){
// console.log(error);
// });
//
// // load csv data and turn value into a number
// d3.csv("../data/Economy/IncomeAndLivingData.csv").then( data => {
//     let columnNames = data.columns.slice(2),
//         employeesSizeData = data;
//
// })
// // catch any error and log to console
// .catch(function(error){
// console.log(error);
// });
//
// //#chart-employees-by-size
// // load csv data and turn value into a number
// d3.csv("../data/Economy/BRA08.csv").then( data => {
//
//     let columnNames = data.columns.slice(3),
//     xValue = data.columns[0];
//
//     data.forEach(d => {
//         for(var i = 0, n = columnNames.length; i < n; ++i){
//
//             d[columnNames[i]] = +d[columnNames[i]];
//             d.label = d.date;
//             d.date = parseYear(d.date);
//         }
//         return d;
//     });
//
//     const employeesBySizeData = data,
//           employeesBySize = {
//             e: "#chart-employees-by-size",
//             xV: "date",
//             yV: "value",
//             d:employeesBySizeData,
//             k:"type",
//             tX: "Years",
//             tY: "Persons Engaged",
//             ySF: "millions"
//           };
//
//     const employeesBySizeChart = new MultiLineChart(employeesBySize);
//           employeesBySizeChart.drawChart();
//           employeesBySizeChart.addTooltip("Persons Engaged by Size of Company - Year:", "thousands", "label");
// })
// // catch any error and log to console
// .catch(function(error){
// console.log(error);
// });
//
//
// //#chart-overseas-vistors
//     // load csv data and turn value into a number
//     d3.csv("../data/Economy/overseasvisitors.csv").then( data => {
//
//         let columnNames = data.columns.slice(1),
//             xValue = data.columns[0];
//
//             data.forEach(d => {
//                 for(var i = 0, n = columnNames.length; i < n; ++i){
//                     d[columnNames[i]] = +d[columnNames[i]];
//                 }
//                 return d;
//             });
//
//         let overseasVisitorsData = data;
//
//         const tooltipContent = {
//             title: "Oversea Vistors (Millions) - Year",
//             datelabel: xValue,
//             format: "thousands",
//         },
//
//         overseasVisitorContent = {
//             e: "#chart-overseas-vistors",
//             d: overseasVisitorsData,
//             ks: columnNames,
//             xV: xValue,
//             tX: "Years",
//             tY: "Visitors (Millions)",
//             // ySF: "percentage"
//         },
//
//         overseasvisitorsChart = new GroupedBarChart(overseasVisitorContent);
//         overseasvisitorsChart.addTooltip(tooltipContent);
//
//     })
//     // catch any error and log to console
//     .catch(function(error){
//     console.log(error);
//     });

function join (lookupTable, mainTable, lookupKey, mainKey, select) {
  var l = lookupTable.length,
    m = mainTable.length,
    lookupIndex = [],
    output = []

  for (var i = 0; i < l; i++) { // loop through the lookup array
    var row = lookupTable[i]
    lookupIndex[row[lookupKey]] = row // create a index for lookup table
  }

  for (var j = 0; j < m; j++) { // loop through m items
    var y = mainTable[j]
    var x = lookupIndex[y[mainKey]] // get corresponding row from lookupTable
    output.push(select(y, x)) // select only the columns you need
  }

  return output
}

function d3Nest (d, n) {
  let nest = d3.nest()
    .key(name => {
      return name[n]
    })
    .entries(d)
  return nest
}

function filterByDateRange (data, dateField, dateOne, dateTwo) {
  return data.filter(d => {
    return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo)
  })
}

function filterbyDate (data, dateField, date) {
  return data.filter(d => {
    return d[dateField] >= new Date(date)
  })
}

function stackNest (data, date, name, value) {
  let nested_data = d3Nest(data, date),
    mqpdata = nested_data.map(function (d) {
      let obj = {
        label: d.key
      }
      d.values.forEach(function (v) {
        obj.date = v.date
        obj.year = v.year
        obj[v[name]] = v[value]
      })
      return obj
    })
  return mqpdata
}

function activeBtn (e) {
  let btn = e
  $(btn).siblings().removeClass('active')
  $(btn).addClass('active')
}
// d3.selectAll(".chart-holder_PH").attr("class", "chart-holder");
