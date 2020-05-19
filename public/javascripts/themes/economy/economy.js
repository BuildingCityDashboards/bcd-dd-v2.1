//  /** * This Survey on Income and Living Conditions for Dublin Charts ***/
// d3.csv('../data/Economy/SIA20.csv').then(data => {
//   let incomeData = data,
//     incomeContent
//
//   incomeData.forEach(d => {
//     d.value = +d.value
//   })
//
//   incomeContent = {
//     e: '#chart-poverty-rate',
//     d: incomeData,
//     k: 'type',
//     xV: 'date',
//     yV: 'value',
//     tY: '%',
//     tX: 'Years',
//     ySF: 'percentage'
//   }
//
//   const IncomeGroupedBar = new StackBarChart(incomeContent)
//   IncomeGroupedBar.addTooltip('Poverty Rating - Year:', 'percentage2', 'date')
// })
//  .catch(function (error) {
//    console.log(error)
//  })
//
//  // load csv data and turn value into a number
// d3.csv('../data/Economy/IncomeAndLivingData.csv').then(data => {
//   let keys = data.columns,
//     transposedData = [],
//     newList,
//     dataFiltered,
//     tooltipContent,
//     disosableIncomeContent,
//     key = ['Median Real Household Disposable Income (Euro)']
//
//   data.forEach(d => {
//     for (var key in d) {
//                  // console.log(key);
//       var obj = {}
//       if (!(key === 'type' || key === 'region')) {
//         obj.type = d.type
//         obj.region = d.region
//         obj[d.type] = +d[key]
//         obj.year = key
//         obj.value = +d[key]
//         transposedData.push(obj)
//       }
//     }
//   })
//
//   newList = d3.nest()
//              .key(d => { return d.region })
//              // .key(d => { return d.type })
//              .entries(transposedData)
//
//   dataFiltered = newList.find(d => d.key === 'Dublin').values.filter(
//              d => d.type === 'Median Real Household Disposable Income (Euro)'
//          )
//
//   tooltipContent = {
//     title: 'Dublin County - Year',
//     datelabel: 'year',
//     format: 'euros'
//   }
//
//   disosableIncomeContent = {
//     e: '#chart-disposable-income',
//     d: dataFiltered,
//     ks: key,
//     xV: 'year',
//     tX: 'Years',
//     tY: '',
//     ySF: 'euros'
//   }
//
//   const disosableIncomeChart = new GroupedBarChart(disosableIncomeContent)
//   disosableIncomeChart.addTooltip(tooltipContent)
// })
//  // catch any error and log to console
//  .catch(function (error) {
//    console.log(error)
//  })
//
//  // load csv data and turn value into a number
// d3.csv('../data/Economy/IncomeAndLivingData.csv').then(data => {
//   let columnNames = data.columns.slice(2),
//     employeesSizeData = data
// })
//  // catch any error and log to console
//  .catch(function (error) {
//    console.log(error)
//  })
//
// // #chart-employees-by-size
// // load csv data and turn value into a number
// d3.csv('../data/Economy/BRA08.csv').then(data => {
//   let columnNames = data.columns.slice(3),
//     xValue = data.columns[0]
//
//   data.forEach(d => {
//     for (var i = 0, n = columnNames.length; i < n; ++i) {
//       d[columnNames[i]] = +d[columnNames[i]]
//       d.label = d.date
//       d.date = parseYear(d.date)
//     }
//     return d
//   })
//
//   const employeesBySizeData = data,
//     employeesBySize = {
//       e: '#chart-employees-by-size',
//       xV: 'date',
//       yV: 'value',
//       d: employeesBySizeData,
//       k: 'type',
//       tX: 'Years',
//       tY: 'Persons Engaged',
//       ySF: 'millions'
//     }
//
//   const employeesBySizeChart = new MultiLineChart(employeesBySize)
//   employeesBySizeChart.drawChart()
//   employeesBySizeChart.addTooltip('Persons Engaged by Size of Company - Year:', 'thousands', 'label')
// })
// // catch any error and log to console
//  .catch(function (error) {
//    console.log(error)
//  })
//
// // #chart-overseas-vistors
//      // load csv data and turn value into a number
// d3.csv('../data/Economy/overseasvisitors.csv').then(data => {
//   let columnNames = data.columns.slice(1),
//     xValue = data.columns[0]
//
//   data.forEach(d => {
//     for (var i = 0, n = columnNames.length; i < n; ++i) {
//       d[columnNames[i]] = +d[columnNames[i]]
//     }
//     return d
//   })
//
//   let overseasVisitorsData = data
//
//   const tooltipContent = {
//       title: 'Oversea Vistors (Millions) - Year',
//       datelabel: xValue,
//       format: 'thousands'
//     },
//
//     overseasVisitorContent = {
//       e: '#chart-overseas-vistors',
//       d: overseasVisitorsData,
//       ks: columnNames,
//       xV: xValue,
//       tX: 'Years',
//       tY: 'Visitors (Millions)'
//              // ySF: "percentage"
//     },
//
//     overseasvisitorsChart = new GroupedBarChart(overseasVisitorContent)
//   overseasvisitorsChart.addTooltip(tooltipContent)
// })
//      // catch any error and log to console
//      .catch(function (error) {
//        console.log(error)
//      })

function coerceData (d, k) {
  d.forEach(d => {
    for (var i = 0, n = k.length; i < n; i++) {
      d[k[i]] = d[k[i]] !== 'null' ? +d[k[i]] : 'unavailable'
    }
    return d
  })
}

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
