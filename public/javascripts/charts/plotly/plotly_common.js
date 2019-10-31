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

let chartColor = '#ffffff';
// let chartColor = '#d8d8d8'; //nearly same as background
//colorWay is used in charts and high_annotations- defaults here
let colorWay = ['#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844'];
// let colorWay = ['#e7a4b6', '#a262a9', '#6f4d96', '#182844'];
// let colorWay = ['#f4a582', '#f7f7f7', '#92c5de', '#0571b0']; //colorbrewer divergent

const cA1 = [
    "#00929e", //BCD-teal
    "#ffc20e", //BCD-yellow
    "#16c1f3", //BCD-blue
    "#da1e4d", //BCD-red
    "#086fb8", //BCD-strong-blue
    "#aae0fa", //BCD-pale-blue
    "#012e5f" //BCD-navy
  ], // orignal

  cA2 = [
    // "#012e5f", //BCD-navy
    "#086fb8", //BCD-strong-blue
    "#da1e4d", //BCD-red
    "#16c1f3", //BCD-blue
    "#ffc20e", //BCD-yellow
    "#00929e", //BCD-teal
    "#aae0fa", //BCD-pale-blue
    // "#6aedc7", //pale-green
    "#f5b4c4", //pink
    "#998ce3", //purple
  ], // new version

  cA3 = [
    "#d73027",
    "#f46d43",
    "#fdae61",
    "#fee090",
    "#ffffbf",
    "#e0f3f8",
    "#abd9e9",
    "#74add1",
    "#4575b4"
  ].reverse(), //diverging blue to red

  cA3_2 = [
    "#d73027",
    "#4575b4"
  ].reverse(), //diverging blue to red

  cA4 = [
    "#00929e", //BCD-teal
    "#ffc20e", //BCD-yellow
    "#16c1f3", //BCD-blue
    "#da1e4d", //BCD-red
    "#998ce3", //purple
    "#6aedc7", //green
  ];

cA5 = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9"
]; // qualitative pastel

colorWay = cA1; //choose the colorWay to be applied in the chart
colorWay.push('grey'); //add grey as last element to allow muted colors for secondary variab;es

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
  title: {
    text: 'Plot Title',
    font: {
      family: null,
      size: 20
    },
    xref: 'container',
    x: 0
  },
  xaxis: {
    showticklabels: false
  },
  yaxis: {
    showticklabels: true
  },
  paper_bgcolor: chartColor,
  plot_bgcolor: chartColor,
  colorway: colorWay,
  font: chartFont,
  showlegend: true,
  legend: {
    x: 1,
    y: 0.5,
    'orientation': 'v'
  },
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