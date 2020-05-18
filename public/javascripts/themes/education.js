
Promise.all([
  d3.csv('../data/Education/EDA56.csv'),
  d3.csv('../data/Education/EDA57.csv'),
  d3.csv('../data/Education/EDA69.csv'),
  d3.csv('../data/Education/educationlevels.csv')
]).then(datafiles => {
  // const dataFile2 = datafiles[1]
  // const dataFile3 = datafiles[2]
  // const dataFile4 = datafiles[3]
    // const columnNames2 = dataFile2.columns.slice(1)
  // const columnNames3 = dataFile3.columns.slice(1)
  // const columnNames4 = dataFile4.columns.slice(1)

  // let xValue2 = dataFile2.columns[0]
  // let xValue3 = dataFile3.columns[0]
  // let xValue4 = dataFile4.columns[0]

  // const dataSet2 = dataSets(dataFile2, columnNames2)
  // const dataSet3 = dataSets(dataFile3, columnNames3)
  // const dataSet4 = dataSets(dataFile4, columnNames4)

  const pupilsPrimary = datafiles[0]
  const pupilsPrimaryColNames = pupilsPrimary.columns.slice(1)
  let pupilsPrimaryData = dataSets(pupilsPrimary, pupilsPrimaryColNames)
  console.log(pupilsPrimary)

  let pupilsPrimaryPlot = {
    e: '#chart-pupilsFirstLevel',
    d: pupilsPrimaryData,
    ks: pupilsPrimaryColNames,
    xV: pupilsPrimary.columns[0],
    yV: pupilsPrimaryColNames,
    tX: 'Years',
    tY: 'No. of Pupils'
  }

  let pupilsPrimaryToolTip = {
    title: '',
    datelabel: pupilsPrimary.columns[0],
    format: 'thousands'
  }

  let pupilsPrimaryChart = new GroupedBarChart(pupilsPrimaryPlot)
  pupilsPrimaryChart.addTooltip(pupilsPrimaryToolTip)

  // let pSLevelContent = {
  //   e: '#chart-pupilsSecondLevel',
  //   d: dataSet3,
  //   ks: columnNames3,
  //   xV: xValue3,
  //   yV: columnNames3,
  //   tX: 'test',
  //   tY: 'No. of Pupils'
  // }
  // let hEduContent = {
  //   e: '#chart-educationLevel',
  //   d: dataSet1,
  //   ks: columnNames1,
  //   xV: xValue1,
  //   tX: 'Levels of Education',
  //   tY: 'Population'
  // }
  //
  // let hEduTT = {
  //   title: '',
  //   datelabel: xValue1,
  //   format: 'thousands'
  // }
  //
  // let pFLevelContent = {
  //   e: '#chart-pupilsFirstLevel',
  //   d: dataSet2,
  //   ks: columnNames2,
  //   xV: xValue2,
  //   tX: 'Years',
  //   tY: 'No. of Pupils'
  // }
  //
  // let pFLevelTT = {
  //   title: '',
  //   datelabel: xValue2,
  //   format: 'thousands'
  // }

  // let pSLevelTT = {
  //   title: 'Number of Pupils in Year ',
  //   datelabel: xValue3,
  //   format: 'thousands'
  // }
  //
  // let sSLevelContent = {
  //   e: '#chart-specialSchoolsLevel',
  //   d: dataSet4,
  //   ks: columnNames4,
  //   xV: xValue4,
  //   tX: 'Years',
  //   tY: 'No of Schools'
  // }

  // let sSLevelTT = {
  //   title: 'Number of Pupils in Year ',
  //   datelabel: xValue1,
  //   format: 'thousands'
  // }

          // hEduChart = new GroupedBarChart(hEduContent),
  // let pFLevelChart = new StackedAreaChart(pFLevelContent)
          // sSLevelChart = new GroupedBarChart(sSLevelContent);
          //
          // hEduChart.addTooltip(hEduTT);
  // pFLevelChart.addTooltip(pFLevelTT)

  // sSLevelChart.addTooltip(sSLevelTT)

    // highestEducationChart.selectAll(".tick text").call(texTrap, 100, 50);

        // xValue = data.columns[0];
        // groupBy = data.columns[0];
        // yLabels =["Population (000s)", "Rate %"];
}).catch(function (error) {
  console.log(error)
})

function dataSets (data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      d[columns[i]] = +d[columns[i]]
    }
    return d
  })
  return coercedData
}
