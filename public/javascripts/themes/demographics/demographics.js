import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { activeBtn } from '../../modules/bcd-ui.js'

const parseYear = d3.timeParse('%Y')
let populationChart

if (document.getElementById('chart-population')) {
  d3.csv('../data/Demographics/CNA13.csv').then(data => {
    // d3.selectAll(".chart-holder_PH").attr("class","chart-holder");
    // d3.select('#population').selectAll(".chart-holder").style("background-image", "none");
    // d3.select('#').selectAll(".chart-holder").style("background-image", "none");
    // d3.select('#').selectAll(".chart-holder").style("background-image", "none");
    // d3.select('#').selectAll(".chart-holder").style("background-color", "#000000");

    const columnNames = data.columns.slice(2)
    const groupBy = data.columns[0]
    const yLabels = ['Population (000s)', 'Rate %']

    const valueData = data.map(d => {
      d.label = d.date
      d.date = parseYear(d.date)
      for (var i = 0, n = columnNames.length; i < n; i++) {
        d[columnNames[i]] = +d[columnNames[i]]
      }
      return d
    })

    const types = d3.nest()
      .key(d => {
        return d[groupBy]
      }).entries(valueData)

    const grouping = types.map(d => d.key)

    const population = {
      e: 'chart-population',
      ks: grouping,
      xV: 'date',
      yV: columnNames[0],
      d: types,
      tX: 'Years',
      tY: 'Population',
      ySF: 'millions'
    }

    populationChart = new BCDMultiLineChart(population)

    function redraw () {
      populationChart.yLabels = yLabels
      // populationChart.tickNumber = 106
      populationChart.drawChart()
      populationChart.addTooltip('Year: ', 'thousands', 'label')
      populationChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10, 12, 14, 16])
      populationChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14, 16, 18])
    }
    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })
  }).catch(function (error) {
    console.log(error)
  })
}
