import { coerceWideTable } from '../modules/bcd-data.js'
import { BCDStackedAreaChart } from '../modules/BCDStackedAreaChart.js'
import { activeBtn } from '../modules/bcd-ui.js'

Promise.all([
  // d3.csv('../data/Education/EDA56.csv'), // number of nat schools
  d3.csv('../data/Education/EDA57.csv'), // number of primary pupils
  d3.csv('../data/Education/EDA69.csv')
  // , // number of 2nd level pupils
  // d3.csv('../data/Education/educationlevels.csv')
]).then(datafiles => {
  // console.log('edu data loaded')
  d3.select('#chart-pupils-primary').style('display', 'block')
  d3.select('#chart-pupils-secondary').style('display', 'none')

  let pupilsPrimaryChart
  if (document.getElementById('chart-pupils-primary')) {
    const pupilsPrimary = datafiles[0]
    const pupilsPrimaryColNames = pupilsPrimary.columns.slice(1)
    const pupilsPrimaryData = coerceWideTable(pupilsPrimary, pupilsPrimaryColNames)
    pupilsPrimaryData.forEach(d => {
      d.label = d.date
      d.date = new Date(d.date, 1, 1)
    })
    // console.log(pupilsPrimary)
    // console.log(pupilsPrimaryData[0])
    // console.log(pupilsPrimaryColNames )
    const pupilsPrimaryPlot = {
      e: 'chart-pupils-primary',
      d: pupilsPrimaryData,
      ks: pupilsPrimaryColNames,
      xV: 'date',
      yV: pupilsPrimaryColNames,
      tX: 'Years',
      tY: 'No. of Pupils'
      // ,
      // formaty: 'hundredThousandsShort'
    }

    // let pupilsPrimaryToolTip = {
    //   title: 'Primary school pupil numbers for ',
    //   datelabel: pupilsPrimary.columns[0],
    //   format: 'thousands'
    // }

    pupilsPrimaryChart = new BCDStackedAreaChart(pupilsPrimaryPlot)
    redraw(pupilsPrimaryChart, 'Pupils in primary level')

    window.addEventListener('resize', () => {
      if (document.getElementById(pupilsPrimaryPlot.e).style.display !== 'none') {
        redraw(pupilsPrimaryChart, 'Pupils in primary level')
      }
    })
  }

  let pupilsSecondaryChart
  if (document.getElementById('chart-pupils-secondary')) {
    const pupilsSecondary = datafiles[1]
    const pupilsSecondaryColNames = pupilsSecondary.columns.slice(1)
    const pupilsSecondaryData = coerceWideTable(pupilsSecondary, pupilsSecondaryColNames)
    pupilsSecondaryData.forEach(d => {
      d.label = d.date
      d.date = new Date(d.date, 1, 1)
    })
    // console.log(pupilsSecondary)

    const pupilsSecondaryPlot = {
      e: 'chart-pupils-secondary',
      d: pupilsSecondaryData,
      ks: pupilsSecondaryColNames,
      xV: pupilsSecondary.columns[0],
      yV: pupilsSecondaryColNames,
      tX: 'Years',
      tY: 'No. of Pupils'
    }

    pupilsSecondaryChart = new BCDStackedAreaChart(pupilsSecondaryPlot)

    window.addEventListener('resize', () => {
      if (document.getElementById(pupilsSecondaryPlot.e).style.display !== 'none') {
        console.log('redraw pup sec');
        redraw(pupilsSecondaryChart, 'Pupils in secondary level')
      }
    })

  }

  d3.select('#btn-pupils-primary').on('click', function () {
    activeBtn(this)
    d3.select('#chart-pupils-primary').style('display', 'block')
    d3.select('#chart-pupils-secondary').style('display', 'none')
    redraw(pupilsPrimaryChart, 'Pupils in primary level')
  })
  d3.select('#btn-pupils-secondary').on('click', function () {
    activeBtn(this)
    d3.select('#chart-pupils-primary').style('display', 'none')
    d3.select('#chart-pupils-secondary').style('display', 'block')
    redraw(pupilsSecondaryChart, 'Pupils in secondary level')
  })

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

function redraw (chart, title) {
  chart.drawChart()
  chart.addTooltip(title, '', 'label')
  chart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12, 14])
  chart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14])
  // employmentServiceChart.addTooltip(', ', '', 'label')
}
