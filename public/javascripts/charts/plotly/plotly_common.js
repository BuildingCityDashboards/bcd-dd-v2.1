let modeBarButtonsRemove = ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'toggleSpikelines'];
let rowChartModeBarButtonsInclude = [
  ['toImage']
];
let multilineModeBarButtonsInclude = [
  ['toImage', 'hoverClosestCartesian', 'hoverCompareCartesian']
];
let areaChartModeBarButtonsInclude = [
  ['toImage', 'hoverClosestCartesian', 'hoverCompareCartesian']
];

let chartFont = {
  family: 'PT Sans',
  size: 16,
  color: '#313131'
};

// let chartColor = '#ffffff';
let chartColor = '#d8d8d8'; //nearly same as background

// let colorWay = ['#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844'];
// let colorWay = ['#e7a4b6', '#a262a9', '#6f4d96', '#182844'];
let colorWay = ['#f4a582', '#f7f7f7', '#92c5de', '#0571b0']; //colorbrewer divergent


let margins = {
  l: 40,
  r: 40,
  b: 40,
  t: 60,
  pad: 0
};

let rowChartLayout = {
  responsive: true,
  margin: margins,
  yaxis: {
    showticklabels: true
  },
  paper_bgcolor: chartColor,
  plot_bgcolor: chartColor,
  colorway: colorWay,
  font: chartFont,
  showlegend: false,
  annotations: [],
  hovermode: 'closest'
};

let groupedColumnLayout = {
  barmode: 'group',
  responsive: true,
  margin: margins,
  yaxis: {
    autotick: true,
    ticks: 'inside',
    tickson: 'labels',
    tick0: 0,
    // dtick: 0.25,
    ticklen: 8,
    tickwidth: 2,
    tickcolor: '#000'
  },
  paper_bgcolor: chartColor,
  plot_bgcolor: chartColor,
  colorway: colorWay,
  font: chartFont,
  showlegend: true,
  annotations: [],
  hovermode: 'x'
};

let multilineChartLayout = {
  responsive: true,
  margin: margins,
  yaxis: {
    showticklabels: true
  },
  paper_bgcolor: chartColor,
  plot_bgcolor: chartColor,
  colorway: colorWay,
  font: chartFont,
  showlegend: true,
  annotations: [],
  hovermode: 'x'
};

let areaChartLayout = {
  responsive: true,
  margin: margins,
  yaxis: {
    showticklabels: true
  },
  paper_bgcolor: chartColor,
  plot_bgcolor: chartColor,
  colorway: colorWay,
  font: chartFont,
  hovermode: 'x',
  annotations: [],
  showlegend: true
};