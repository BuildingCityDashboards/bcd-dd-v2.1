
import { getDublinBoundsLatLng } from '../modules/bcd-maps.js'
// alert('sssssssss')
const dub_lng = -6.2603
const dub_lat = 53.42
let dublinX, dublinY
const min_zoom = 10
const max_zoom = 16
const zoom = min_zoom
// tile layer with correct attribution
const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
const osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
const stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
const wiki = 'https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png'
const osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
const osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmapGeodemos.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
const stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmapGeodemos.org/copyright">OpenStreetMap</a>'
const cartoDb = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
const cartoDb_Dark = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
const cartoDb_Lite = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
const CARTODB_POSITRON = 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
const CARTODB_ATTRIBUTION = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://carto.com/">CartoDB </a> contributors'
const columnData = {}
const punti_mappa = []
const myTestArray = []
const cov = 0

const GEODEMOS_COLORWAY_CATEGORICAL = ['#feedde',
  '#fdd0a2',
  '#fdae6b',
  '#fd8d3c',
  '#f16913',
  '#d94801',
  '#8c2d04']
const GEODEMOS_COLORWAY_CBSAFE = ['#d73027', '#f46d43', '#fdae61', '#fee090', '#abd9e9', '#74add1', '#4575b4']
const GEODEMOS_COLORWAY = GEODEMOS_COLORWAY_CATEGORICAL
// const gToLa =['Group1','Group2','Group3','Group4','Group5','Group6','Group7']

const traces = []
const ntraces = []
let layout = {}
const tracesIndx = []
let hmlayout = {}
const columnNames = {}
const columnNames2 = {}
const tarry = []

addheatmap()
updateGroupTxt('all')

d3.csv('/data/tools/geodemographics/dublin_zscores_t.csv')
  .then((zScores) => {
    zScores.forEach((row, i) => {
      const columnNames = Object.keys(row).sort(function (a, b) { return row[a] - row[b] })
      const trace = Object.assign({}, TRACES_DEFAULT)
      trace.mode = 'markers+text'
      trace.type = 'scatter'
      trace.marker = Object.assign({}, TRACES_DEFAULT.marker)
      trace.x = columnNames.map(name => {
        return row[name]
      })

      trace.y = columnNames

      traces.push(trace)
      trace.hovertemplate = `%{x:.2f}<extra>Group No: ${i + 1}</extra>`
      // hovertemplate= `z-score: %{trace.x:.2f}<extra></extra>`
    })

    layout = Object.assign({}, ROW_CHART_LAYOUT)
    // layout.mode = 'bars'
    layout.height = 500
    // layout.barmode = 'group';
    // layout.colorway = GEODEMOS_COLORWAY
    layout.title = Object.assign({}, ROW_CHART_LAYOUT.title)
    layout.title.text = ''
    layout.title.font = {
      color: '#6fd1f6',
      family: 'Courier New, monospace',
      size: 17

    },
    layout.showlegend = false
    layout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
    layout.legend.xanchor = 'right'
    // layout.legend.y = 0.1;
    // layout.legend.traceorder = 'reversed';
    layout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
    layout.xaxis.title = 'value'
    layout.xaxis.range = [-2, 2.9]
    layout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)
    layout.yaxis.tickfont = {
      family: 'PT Sans',
      size: 10,
      color: '#6fd1f6'
    }
    layout.xaxis.tickfont = {
      family: 'PT Sans',
      size: 10,
      color: '#6fd1f6'
    }

    layout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
    layout.yaxis.titlefont.size = 16 // bug? need to call this
    layout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)

    layout.plot_bgcolor = '#293135',
    layout.paper_bgcolor = '#293135'

    layout.yaxis.title = ''
    layout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)

    layout.margin = {
      l: 40,
      r: 40, // annotations space
      t: 40,
      b: 0

    }
  }) // end then

const lyt = {}
const soc_eco_val = 0

function updateGroupTxt (no) {
  d3.json('/data/home/geodem-text-data.json').then(function (dublinRegionsJson) {
    d3.select('#HM-text').text(dublinRegionsJson[0][no]).style('font-size', '15px')
  })
}
const ttt = []

const value = 0
const text = ''
function addheatmap () {
  const GroupsArray = ['Group1', 'Group2', 'Group3', 'Group4', 'Group5', 'Group6', 'Group7']
  hmlayout = Object.assign({}, ROW_CHART_LAYOUT)
  hmlayout.height = 500
  hmlayout.width = 560
  // layout.barmode = 'group';
  hmlayout.plot_bgcolor = '#293135',
  hmlayout.paper_bgcolor = '#293135'

  hmlayout.colorway = GEODEMOS_COLORWAY
  hmlayout.title = Object.assign({}, ROW_CHART_LAYOUT.title)
  hmlayout.title.text = ''
  hmlayout.title.x = 0.51
  hmlayout.title.y = 0.99
  hmlayout.title.xanchor = 'center'
  hmlayout.title.yanchor = 'top'
  hmlayout.title.font = {
    color: '#6fd1f6',
    family: 'Courier New, monospace',
    size: 17
  },
  hmlayout.showlegend = false
  hmlayout.legend = Object.assign({}, ROW_CHART_LAYOUT.legend)
  hmlayout.legend.xanchor = 'right'
  hmlayout.legend.y = 0.1
  hmlayout.legend.traceorder = 'reversed'
  hmlayout.xaxis = Object.assign({}, ROW_CHART_LAYOUT.xaxis)
  hmlayout.xaxis.title = ''
  hmlayout.yaxis = Object.assign({}, ROW_CHART_LAYOUT.yaxis)

  hmlayout.yaxis.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#6fd1f6'
  }
  hmlayout.xaxis.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#6fd1f6'
  }
  hmlayout.tickfont = {
    family: 'PT Sans',
    size: 10,
    color: '#6fd1f6'
  }

  hmlayout.yaxis.titlefont = Object.assign({}, ROW_CHART_LAYOUT.yaxis.titlefont)
  hmlayout.yaxis.titlefont.size = 16 // bug? need to call this
  hmlayout.yaxis.title = Object.assign({}, ROW_CHART_LAYOUT.yaxis.title)
  hmlayout.yaxis.title = ''
  hmlayout.margin = Object.assign({}, ROW_CHART_LAYOUT.margin)
  hmlayout.margin = {
    l: 20,
    r: 40, // annotations space
    t: 30,
    b: 0

  }

  d3.text('/data/tools/geodemographics/dublin_zscores.csv')
    .then((zScores) => {
      const newCsv = zScores.split('\n').map(function (line) {
        const columns = line.split(',') // get the columns
        columns.splice(0, 1) // remove total column
        return columns.reverse()
      }).join('\n')

      const rows = newCsv.split('\n')
      // alert(rows)
      // get the first row as header
      const header = rows.shift()
      // alert(header)
      // const header = columnNames;
      const numberOfColumns = header.split(',').length

      // initialize 2D-array with a fixed size
      const columnData = [...Array(numberOfColumns)].map(item => new Array())

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const rowData = row.split(',')

        // assuming that there's always the same
        // number of columns in data rows as in header row
        for (let j = 0; j < numberOfColumns; j++) {
          columnData[j].push((rowData[j]))
        }
      }
      const data = [
        {

          z: columnData,
          x: GroupsArray,
          y: header.split(','),

          hovertemplate: 'z-score: %{z:.2f}<extra></extra>',
          type: 'heatmap',
          hoverinfo: 'z',
          showscale: true,
          fixedrange: true,
          hoverinfo: 'z',
          colorbar: {
            // title: 'z-scores',

            tickcolor: '#6fd1f6',
            tickfont: {
              color: '#6fd1f6',
              size: 10
            },

            ticks: 'outside',
            dtick: 0.25,
            tickwidth: 2,
            ticklen: 10,
            showticklabels: true,
            xpad: 35,

            thickness: 40,
            thicknessmode: 'pixels',
            len: 0.9,
            lenmode: 'fraction',
            outlinewidth: 0

          },
          colorscale: [

            // Let first 10% (0.1) of the values have color rgb(0, 0, 0)

            [0, 'rgb(179,24,43)'],
            [0.1, 'rgb(179,24,43)'],

            // Let values between 10-20% of the min and max of z
            // have color rgb(20, 20, 20)

            [0.1, 'rgb(214,86,77)'],
            [0.2, 'rgb(214,86,77)'],

            // Values between 20-30% of the min and max of z
            // have color rgb(40, 40, 40)

            [0.2, 'rgb(244,165,130)'],
            [0.3, 'rgb(244,165,130)'],

            [0.3, 'rgb(253,219,199)'],
            [0.4, 'rgb(253,219,199)'],

            [0.4, 'rgb(247,247,247)'],
            [0.5, 'rgb(247,247,247)'],

            [0.5, 'rgb(209,229,240)'],
            [0.6, 'rgb(209,229,240)'],

            [0.6, 'rgb(146,197,222)'],
            [0.7, 'rgb(146,197,222)'],

            [0.7, 'rgb(67,147,195)'],
            [0.8, 'rgb(67,147,195)'],

            [0.8, 'rgb(33,102,172)'],
            [1.0, 'rgb(33,102,172)']

          ]
        }

      ]
      // Plotly.purge('chart-geodemos');
      Plotly.newPlot('chart-geodemosTem', data, hmlayout)
    })
}

