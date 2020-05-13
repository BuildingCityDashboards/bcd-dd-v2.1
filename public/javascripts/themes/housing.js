let houseCompCharts, contributionChart, housePricesChart, rentByBedsChart, dccChart, drccChart, fccChart, sdccChart, newCompByTypeChart, hCBTChart, HPM06Charts
let rentByBedTT, planningTT
Promise.all([
  d3.csv('../data/Housing/processed/NDQ05.csv'),
  d3.csv('../data/Housing/planningapplications.csv'),
  d3.csv('../data/Housing/supplyoflands.csv'),
  d3.csv('../data/Housing/developercontributions.csv'),
  d3.csv('../data/Housing/houseprices.csv'),
  d3.csv('../data/Housing/RIQ02.csv'),
  d3.csv('../data/Housing/rentpricebybeds.csv'),
  d3.csv('../data/Housing/rentalinspections.csv'),
  d3.csv('../data/Housing/houseunitcompbytype.csv'),
  d3.csv('../data/Housing/NDQ08.csv'),
  d3.csv('../data/Housing/NDQ06.csv'),
  d3.csv('../data/Housing/HPM06.csv'),
  d3.csv('../data/Housing/HPM06Rate.csv')
]).then(datafiles => {
  const getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p) // function

  // 1.  data processing for house completion chart

  if (document.getElementById('#chart-houseComp')) {
    const completionsData = datafiles[0]
    let completionsColumns = completionsData.columns.slice(1)
  // completionsColumns.pop() // remove total column for 'Dublin'
    const completionsDate = completionsData.columns[0]
    const compDataProcessed = dataSets(completionsData, completionsColumns)

    compDataProcessed.forEach(function (d) {
      d.label = d[completionsDate]
      d[completionsDate] = convertQuarter(d[completionsDate])
    // d.year = formatYear(d[dateField])
    })

    const houseCompContent = {
      e: '#chart-houseComp',
      d: compDataProcessed,
      k: completionsColumns,
      xV: completionsDate,
      yV: 'Dublin',
      tX: 'Quarter',
      tY: 'Units'
    }

  // console.log("\n\ncompDataProcessed: " + JSON.stringify(compDataProcessed[0]) + "\n\n");
  // console.log("\n\nHousing keys " + JSON.stringify(keys) + "\n\n");

    houseCompCharts = new MultiLineChart(houseCompContent)
    houseCompCharts.drawChart()
    houseCompCharts.addTooltip('Units by Month:', 'thousands', 'year')
  // houseCompCharts.tickNumber = 4;
    houseCompCharts.showSelectedLabels([1, 3, 5, 7, 9, 11, 13, 15, 17, 19])
  }

  // setup chart and data for New Dwelling Completion by type chart
  // process the data
  if (document.getElementById('chart-newCompByType')) {
    const newCompByTypeData = datafiles[10],
      newCompByTypeType = newCompByTypeData.columns.slice(2),
      newCompByTypeDate = newCompByTypeData.columns[0],
      newCompByTypeRegions = newCompByTypeData.columns[1],
      newCompByTypeDataProcessed = dataSets(newCompByTypeData, newCompByTypeType)

    newCompByTypeDataProcessed.forEach(d => {
      d.label = (d[newCompByTypeDate])
      d[newCompByTypeDate] = convertQuarter(d[newCompByTypeDate])
    })

    const newCompByTypeContent = {
      e: '#chart-newCompByType',
      d: newCompByTypeDataProcessed,
      k: newCompByTypeRegions,
      xV: newCompByTypeDate,
      yV: newCompByTypeType[0],
      tX: 'Quarters',
      tY: 'Numbers'
    }

  // draw the chart
    newCompByTypeChart = new MultiLineChart(newCompByTypeContent)
    newCompByTypeChart.drawChart()
    newCompByTypeChart.addTooltip('Total Houses - ', 'thousands', 'label')
  }

  // 2.  data processing for planning charts.
  if (document.getElementById('chart-planningDCC')) {
    const planningData = datafiles[1],
      types = planningData.columns.slice(2),
      date = planningData.columns[0],
      planningDataProcessed = dataSets(planningData, types),

      dcc = planningDataProcessed.filter(d => {
        return d.region === 'Dublin'
      }),
      drcc = planningDataProcessed.filter(d => {
        return d.region === 'Dun Laoghaire- Rathdown'
      }),
      fcc = planningDataProcessed.filter(d => {
        return d.region === 'Fingal'
      }),
      sdcc = planningDataProcessed.filter(d => {
        return d.region === 'South Dublin'
      }),

      dccContent = {
        e: '#chart-planningDCC',
        d: dcc,
        ks: types,
        xV: date,
        tX: 'Years',
        tY: 'Applications'
      // ySF: "percentage"
      },

      drccContent = {
        e: '#chart-planningDRCC',
        d: drcc,
        ks: types,
        xV: date,
        tX: 'Years',
        tY: 'Applications'
      // ySF: "percentage"
      },

      fccContent = {
        e: '#chart-planningFCC',
        d: fcc,
        ks: types,
        xV: date,
        tX: 'Years',
        tY: 'Applications'
      // ySF: "percentage"
      },

      sdccContent = {
        e: '#chart-planningSDCC',
        d: sdcc,
        ks: types,
        xV: date,
        tX: 'Years',
        tY: 'Applications'
      // ySF: "percentage"
      }

    planningTT = {
      title: 'Planning Applications - Year',
      datelabel: date,
      format: 'thousands'
    }

  // drawing charts for planning data.
    dccChart = new GroupedBarChart(dccContent)
    drccChart = new GroupedBarChart(drccContent)
    fccChart = new GroupedBarChart(fccContent)
    sdccChart = new GroupedBarChart(sdccContent)

    dccChart.drawChart()
    drccChart.drawChart()
    fccChart.drawChart()
    sdccChart.drawChart()

    dccChart.addTooltip(planningTT)
    drccChart.addTooltip(planningTT)
    fccChart.addTooltip(planningTT)
    sdccChart.addTooltip(planningTT)
  }

  if (document.getElementById('chart-houseSupply')) {
    const supplyData = datafiles[2],
      supplyType = supplyData.columns.slice(2),
      supplyDate = supplyData.columns[0],
      supplyRegions = supplyData.columns[1],
      supplyDataProcessed = dataSets(supplyData, supplyType)

    supplyDataProcessed.forEach(d => {
      d[supplyDate] = parseYear(d[supplyDate])
      d.label = formatYear(d[supplyDate])
    })

    const supplyContent = {
      e: '#chart-houseSupply',
      d: supplyDataProcessed,
      k: supplyRegions,
      xV: supplyDate,
      yV: 'Hectares',
      tX: 'Years',
      tY: 'Hectares'
    }
    supplyChart = new MultiLineChart(supplyContent)
    supplyChart.drawChart()
    supplyChart.addTooltip('Land - Year', 'thousands', 'label')

    d3.select('#supply_land').on('click', function () {
      activeBtn(this)

      supplyChart.yV = 'Hectares'
      supplyChart.tY = 'Hectares'
      supplyChart.updateChart()

      supplyChart.addTooltip('Land - Year', 'thousands', 'label')
    })

    d3.select('#supply_units').on('click', function () {
      activeBtn(this)

      supplyChart.yV = 'Units'
      supplyChart.tY = 'Units'
      supplyChart.updateChart()

      supplyChart.addTooltip('Units - Year', 'thousands', 'label')
    })
  }
  // setup chart and data for annual contribution chart
  // process the data
  if (document.getElementById('chart-houseContributions')) {
    const contributionData = datafiles[3],
      contributionType = contributionData.columns.slice(2),
      contributionDate = contributionData.columns[0],
      contributionRegions = contributionData.columns[1],
      contributionDataProcessed = dataSets(contributionData, contributionType)

    contributionDataProcessed.forEach(d => {
      d.label = d[contributionDate]
      d[contributionDate] = parseYear(d[contributionDate])
    })

    const contriContent = {
      e: '#chart-houseContributions',
      d: contributionDataProcessed,
      k: contributionRegions,
      xV: contributionDate,
      yV: 'value',
      tX: 'Years',
      tY: '€'
    }

  // draw the chart
    contributionChart = new MultiLineChart(contriContent)
    contributionChart.yScaleFormat = 'millions'
    contributionChart.drawChart()
    contributionChart.addTooltip('In Millions - Year ', 'millions', 'label', '€')
  }

  if (document.getElementById('chart-housePrices')) {
  // setup chart and data for quarterly house prices chart
  // process the data
    const housePricesData = datafiles[4],
      housePricesType = housePricesData.columns.slice(2),
      housePricesDate = housePricesData.columns[0],
      housePricesRegions = housePricesData.columns[1],
      housePricesDataProcessed = dataSets(housePricesData, housePricesType),
      yLabels4 = []

    housePricesDataProcessed.forEach(d => {
      d.label = (d[housePricesDate])
      d[housePricesDate] = convertQuarter(d[housePricesDate])
    })

    const housePricesContent = {
      e: '#chart-housePrices',
      d: housePricesDataProcessed,
      k: housePricesRegions,
      xV: housePricesDate,
      yV: 'value',
      tX: 'Quarters',
      tY: '€'
    }

  // draw the chart
    housePricesChart = new MultiLineChart(housePricesContent)
    housePricesChart.ySF = 'millions'
    housePricesChart.drawChart()
    housePricesChart.addTooltip('In thousands - ', 'thousands', 'label', '€')
  }

  // setup chart and data for quarterly house prices chart
  // process the data

  if (document.getElementById('chart-rentPrices')) {
    const rentPricesData = datafiles[5],
      rentPricesType = rentPricesData.columns.slice(2),
      rentPricesDate = rentPricesData.columns[0],
      rentPricesRegions = rentPricesData.columns[1],
      rentPricesDataProcessed = dataSets(rentPricesData, rentPricesType)

    rentPricesDataProcessed.forEach(d => {
      d.label = d[rentPricesDate]
      d[rentPricesDate] = convertQuarter(d[rentPricesDate])
    })

  // console.log("\n\nrentPricesDataProcessed: " + JSON.stringify(rentPricesDataProcessed));

    const rentPricesContent = {
      e: '#chart-rentPrices',
      d: rentPricesDataProcessed,
      k: rentPricesRegions,
      xV: rentPricesDate,
      yV: 'value',
      tX: 'Quarters',
      tY: '€'
    }

    rentPricesChart = new MultiLineChart(rentPricesContent)
    rentPricesChart.drawChart()
    rentPricesChart.addTooltip('In thousands - ', 'thousands', 'label', '€')
  }

  //  Setup data and chart for rent prices by quarter by bed numbers
  if (document.getElementById('chart-rentByBeds')) {
    const rentByBedsData = datafiles[6],
      rentByBedsTypes = rentByBedsData.columns.slice(2),
      rentByBedsDate = rentByBedsData.columns[0],
      rentByBedsDataProcessed = dataSets(rentByBedsData, rentByBedsTypes),

      rentByBedContent = {
        e: '#chart-rentByBeds',
        d: rentByBedsDataProcessed,
        ks: rentByBedsTypes,
        xV: rentByBedsDate,
        tX: 'Quarters',
        tY: 'Price',
        ySF: 'euros'
      }

    rentByBedTT = {
      title: 'Rent Prices - Year:',
      datelabel: rentByBedsDate,
      format: 'euros2'
    }

  // drawing charts for planning data.
    rentByBedsChart = new GroupedBarChart(rentByBedContent)
    rentByBedsChart.drawChart()
    rentByBedsChart.addTooltip(rentByBedTT)
  }

  //  Setup data and chart for rent prices by quarter by bed numbers
  if (document.getElementById('chart-rentInspect')) {
    const rentInspectData = datafiles[7],
      rentInspectTypes = rentInspectData.columns.slice(1),
      rentInspectDate = rentInspectData.columns[0],
      rentInspectDataProcessed = dataSets(rentInspectData, rentInspectTypes),

      rentInspectContent = {
        e: '#chart-rentInspect',
        d: rentInspectDataProcessed,
        ks: rentInspectTypes,
        xV: rentInspectDate,
        tX: 'Years',
        tY: 'Inspections'
      },

      rentInspectTT = {
        title: 'Rent Inspections - Year:',
        datelabel: rentInspectDate,
        format: 'thousands'
      }

  // console.log("rentInspect data processed", rentInspectDataProcessed);
  // drawing charts for planning data.
  //          rentInspectChart = new GroupedBarChart(rentInspectContent);
  //          rentInspectChart.addTooltip(rentInspectTT);
  //
  }

  // process the data
  if (document.getElementById('chart-houseCompByType')) {
    const hCBTData = datafiles[8],
      hCBTType = hCBTData.columns.slice(2),
      hCBTDate = hCBTData.columns[0],
      hCBTRegions = hCBTData.columns[1],
      hCBTDataProcessed = dataSets(hCBTData, hCBTType)

    hCBTDataProcessed.forEach(d => {
      d.label = (d[hCBTDate])
      d[hCBTDate] = convertQuarter(d[hCBTDate])
    })

    const hCBTContent = {
      e: '#chart-houseCompByType',
      d: hCBTDataProcessed,
      k: hCBTRegions,
      xV: hCBTDate,
      yV: hCBTType[0],
      tX: 'Quarters',
      tY: 'Numbers'
    }

  // draw the chart
    hCBTChart = new MultiLineChart(hCBTContent)
    hCBTChart.drawChart()
    hCBTChart.addTooltip('Total Houses - ', 'thousands', 'label')
  }

  d3.select('#houseCompByType_total').on('click', function () {
    activeBtn(this)

    hCBTChart.yV = hCBTType[0]
    hCBTChart.updateChart()
    hCBTChart.addTooltip('Total Houses - ', 'thousands', 'label')
    hCBTChart.hideRate(false)
  })

  d3.select('#houseCompByType_private').on('click', function () {
    activeBtn(this)

    hCBTChart.yV = hCBTType[1]
    hCBTChart.updateChart()
    hCBTChart.addTooltip('Private Houses - ', 'thousands', 'label')
    hCBTChart.hideRate(false)
  })

  d3.select('#houseCompByType_social').on('click', function () {
    activeBtn(this)

    hCBTChart.yV = hCBTType[2]
    hCBTChart.updateChart()
    hCBTChart.addTooltip('Social Houses - ', 'thousands', 'label')
    hCBTChart.hideRate(true)
  })

  // setup chart and data for esb non new connections of land chart
  // process the data
  if (document.getElementById('chart-nonNewConnections')) {
    const nonNewConnectionsData = datafiles[9],
      nonNewConnectionsType = nonNewConnectionsData.columns.slice(2),
      nonNewConnectionsDate = nonNewConnectionsData.columns[0],
      nonNewConnectionsRegions = nonNewConnectionsData.columns[1],
      nonNewConnectionsDataProcessed = dataSets(nonNewConnectionsData, nonNewConnectionsType),
      nonNewGroup = getKeys(nonNewConnectionsData.map(o => o.type))

    nonNewConnectionsDataProcessed.forEach(d => {
      d.label = (d[nonNewConnectionsDate])
      d[nonNewConnectionsDate] = convertQuarter(d[nonNewConnectionsDate])
    })

    let nonNewCon = nestData(nonNewConnectionsDataProcessed, 'label', nonNewConnectionsRegions, 'value'),
      nonNewGroupContent = {
        e: '#chart-nonNewConnections',
        d: nonNewCon,
        ks: nonNewGroup,
        xV: nonNewConnectionsDate,
        tX: 'Quarters',
        tY: 'Numbers',
        ySF: 'millions'
      }

  //  const nonNewConnectionsChart = new StackedAreaChart(nonNewGroupContent);
  //
  //  nonNewConnectionsChart.tickNumber = 20;
  //  nonNewConnectionsChart.addTooltip("House Type -", "Units", "label");
  }
  if (document.getElementById('chart-HPM06')) {
  // new chart Price Index
    const HPM06 = datafiles[11],
      HPM06R = HPM06.columns[1],
      HPM06V = HPM06.columns[2],
      HPM06V2 = HPM06.columns[3],
      HPM06V3 = HPM06.columns[3],
      HPM06D = HPM06.columns[0]

  // create content object
    const HPM06Content = chartContent(HPM06, HPM06R, HPM06V, HPM06D, '#chart-HPM06')
    HPM06Content.tX = 'Months'
    HPM06Content.tY = 'Price Index (Base 100)'

  // draw the chart
    HPM06Charts = new MultiLineChart(HPM06Content)
    HPM06Charts.drawChart() // draw axis
    HPM06Charts.addTooltip('Price Index - ', '', 'label') // add tooltip
    HPM06Charts.addBaseLine(100) // add horizontal baseline
  }

  // add buttons to switch between total, housing and apartments

  // d3.select(window).on("resize", function() {
  //   console.log("Resize Housing");
  //   supplyChart.drawChart();
  //   supplyChart.addTooltip("Land - Year", "thousands", "label");
  //
  //   houseCompCharts.drawChart();
  //   houseCompCharts.addTooltip("Units by Month:", "thousands", "year");
  //
  //   contributionChart.drawChart();
  //   contributionChart.addTooltip("In Millions - Year ", "millions", "label", "€");
  //
  //   housePricesChart.drawChart();
  //   housePricesChart.addTooltip("In thousands - ", "thousands", "label", "€");
  //
  //   rentPricesChart.drawChart();
  //   rentPricesChart.addTooltip("In thousands - ", "thousands", "label", "€");
  //
  //   rentByBedsChart.drawChart();
  //   rentByBedsChart.addTooltip(rentByBedTT);
  //
  //   dccChart.drawChart();
  //   drccChart.drawChart();
  //   fccChart.drawChart();
  //   sdccChart.drawChart();
  //
  //   dccChart.addTooltip(planningTT);
  //   drccChart.addTooltip(planningTT);
  //   fccChart.addTooltip(planningTT);
  //   sdccChart.addTooltip(planningTT);
  //
  //
  //   HPM06Charts.drawChart(); // draw axis
  //   HPM06Charts.addTooltip("Price Index - ", "", "label"); // add tooltip
  //   HPM06Charts.addBaseLine(100); // add horizontal baseline
  // });
}).catch(function (error) {
  console.log(error)
})

function convertQuarter (q) {
  let splitted = q.split('Q')
  let year = splitted[0]
  let quarterEndMonth = splitted[1] * 3 - 2
  let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
  return date
}

function qToQuarter (q) {
  let splitted = q.split('Q')
  let year = splitted[0]
  let quarter = splitted[1]
  let quarterString = ('Quarter ' + quarter + ' ' + year)
  return quarterString
}

function dataSets (data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      // d[columns[i]] !== "null" ? d[columns[i]] = +d[columns[i]] : d[columns[i]] = "unavailable";
      d[columns[i]] = +d[columns[i]]
    }
    return d
  })
  return coercedData
}

function formatQuarter (date) {
  let newDate = new Date()
  newDate.setMonth(date.getMonth() + 1)
  let year = (date.getFullYear())
  let q = Math.ceil((newDate.getMonth()) / 3)
  return 'Quarter ' + q + ' ' + year
}

function filterbyDate (data, dateField, date) {
  return data.filter(d => {
    return d[dateField] >= new Date(date)
  })
}

function filterByDateRange (data, dateField, dateOne, dateTwo) {
  return data.filter(d => {
    return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo)
  })
}

function nestData (data, label, name, value) {
  let nested_data = d3.nest()
    .key(function (d) {
      return d[label]
    })
    .entries(data) // its the string not the date obj

  let mqpdata = nested_data.map(function (d) {
    let obj = {
      label: d.key
    }
    d.values.forEach(function (v) {
      obj[v[name]] = v[value]
      obj.date = v.date
    })
    return obj
  })
  return mqpdata
}

function chartContent (data, key, value, date, selector) {
  data.forEach(function (d) { // could pass types array and coerce each matching key using dataSets()
    d.label = d[date]
    d.date = parseYearMonth(d[date])
    d[value] = +d[value]
  })

  // nest the processed data by regions
  const nest = d3.nest().key(d => {
    return d[key]
  }).entries(data)

  // get array of keys from nest
  const keys = []
  nest.forEach(d => {
    keys.push(d.key)
  })

  return {
    e: selector,
    d: nest,
    xV: date,
    yV: value
  }
}

function activeBtn (e) {
  let btn = e
  $(btn).siblings().removeClass('active')
  $(btn).addClass('active')
}
