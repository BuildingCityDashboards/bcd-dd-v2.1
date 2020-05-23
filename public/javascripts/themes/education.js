import { coerceWideTable } from '../modules/bcd-data.js'

Promise.all([
  d3.csv('../data/Education/EDA56.csv'), // number of nat schools
  d3.csv('../data/Education/EDA57.csv'), // number of primary pupils
  d3.csv('../data/Education/EDA69.csv'), // number of 2nd level pupils
  d3.csv('../data/Education/educationlevels.csv')
]).then(datafiles => {
  const pupilsPrimary = datafiles[1]
  const pupilsPrimaryColNames = pupilsPrimary.columns.slice(1)
  let pupilsPrimaryData = coerceWideTable(pupilsPrimary, pupilsPrimaryColNames)
  // console.log(pupilsPrimary)

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
    title: 'Primary school pupil numbers for ',
    datelabel: pupilsPrimary.columns[0],
    format: 'thousands'
  }

  let pupilsPrimaryChart = new GroupedBarChart(pupilsPrimaryPlot)
  pupilsPrimaryChart.addTooltip(pupilsPrimaryToolTip)

  const pupilsSecondary = datafiles[2]
  const pupilsSecondaryColNames = pupilsSecondary.columns.slice(1)
  let pupilsSecondaryData = coerceWideTable(pupilsSecondary, pupilsSecondaryColNames)
  // console.log(pupilsSecondary)

  let pupilsSecondaryPlot = {
    e: '#chart-pupilsSecondLevel',
    d: pupilsSecondaryData,
    ks: pupilsSecondaryColNames,
    xV: pupilsSecondary.columns[0],
    yV: pupilsSecondaryColNames,
    tX: 'Years',
    tY: 'No. of Pupils'
  }

  let pupilsSecondaryToolTip = {
    title: 'Secondary school pupil numbers for ',
    datelabel: pupilsSecondary.columns[0],
    format: 'thousands'
  }

  let pupilsSecondaryChart = new GroupedBarChart(pupilsSecondaryPlot)
  pupilsSecondaryChart.addTooltip(pupilsSecondaryToolTip)

  // const dataFile2 = datafiles[1]
  // const dataFile3 = datafiles[2]
  // const dataFile4 = datafiles[3]
  // const columnNames2 = dataFile2.columns.slice(1)
  // const columnNames3 = dataFile3.columns.slice(1)
  // const columnNames4 = dataFile4.columns.slice(1)
  //
  // let xValue2 = dataFile2.columns[0]
  // let xValue3 = dataFile3.columns[0]
  // let xValue4 = dataFile4.columns[0]
  //
  // const dataSet2 = coerceWideTable(dataFile2, columnNames2)
  // const dataSet3 = coerceWideTable(dataFile3, columnNames3)
  // const dataSet4 = coerceWideTable(dataFile4, columnNames4)
  //
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
  //
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
  //
  // let sSLevelTT = {
  //   title: 'Number of Pupils in Year ',
  //   datelabel: xValue1,
  //   format: 'thousands'
  // }
  //
  // let hEduChart = new GroupedBarChart(hEduContent)
  // let pFLevelChart = new StackedAreaChart(pFLevelContent)
  // let sSLevelChart = new GroupedBarChart(sSLevelContent)
  //
  // // hEduChart.addTooltip(hEduTT)
  // pFLevelChart.addTooltip(pFLevelTT)

  // sSLevelChart.addTooltip(sSLevelTT)

    // highestEducationChart.selectAll(".tick text").call(texTrap, 100, 50);

        // xValue = data.columns[0];
        // groupBy = data.columns[0];
        // yLabels =["Population (000s)", "Rate %"];
}).catch(function (error) {
  console.log(error)
})

