/*
Default configuration objects for plotly charts used in Stories
*/

const REGIONS_ORDERED_DUBLIN = ["Dublin City", "Dún Laoghaire-Rathdown", "Fingal", "South Dublin"]
const REGIONS_ORDERED_NEIGHBOURS = ["Kildare", "Meath", "Wicklow"];

const MODE_BAR_BUTTONS_TO_REMOVE = ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'toggleSpikelines'];
const ROW_CHART_MODE_BAR_BUTTONS_TO_INCLUDE = [
  ['toImage']
];
const MULTILINE_CHART_MODE_BAR_BUTTONS_TO_INCLUDE = [
  ['toImage', 'hoverClosestCartesian', 'hoverCompareCartesian']
];
const STACKED_AREA_CHART_MODE_BAR_BUTTONS_TO_INCLUDE = [
  ['toImage', 'hoverClosestCartesian', 'hoverCompareCartesian']
];

const MARGINS = {
  l: 0,
  r: 0,
  b: 40,
  t: 0,
  pad: 0
};

const CHART_COLOR = '#ffffff';
// constCHART_COLOR = '#d8d8d8'; //nearly same as background
//CHART_COLORWAY is used in charts and high_annotations- defaults here
let CHART_COLORWAY = ['#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844'];
// constCHART_COLORWAY = ['#e7a4b6', '#a262a9', '#6f4d96', '#182844'];
// constCHART_COLORWAY = ['#f4a582', '#f7f7f7', '#92c5de', '#0571b0']; //colorbrewer divergent
const CHART_COLORWAY_BCD_1 = [
  "#00929e", //BCD-teal
  "#ffc20e", //BCD-yellow
  "#16c1f3", //BCD-blue
  "#da1e4d", //BCD-red
  "#086fb8", //BCD-strong-blue
  "#aae0fa", //BCD-pale-blue
  "#012e5f" //BCD-navy
]; // orignal
const CHART_COLORWAY_BCD_2 = [
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
] // new version
const CHART_COLORWAY_BLUE_RED = [
  "#d73027",
  "#f46d43",
  "#fdae61",
  "#fee090",
  "#ffffbf",
  "#e0f3f8",
  "#abd9e9",
  "#74add1",
  "#4575b4"
].reverse(); //diverging blue to red
const CHART_COLORWAY_BCD_3 = [
  "#00929e", //BCD-teal
  "#ffc20e", //BCD-yellow
  "#16c1f3", //BCD-blue
  "#da1e4d", //BCD-red
  "#998ce3", //purple
  "#6aedc7" //green
];
const CHART_COLORWAY_QUAL_PASTEL = [
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
CHART_COLORWAY = CHART_COLORWAY_BCD_1; //choose the CHART_COLORWAY to be applied in the chart
CHART_COLORWAY.push('grey'); //add grey as last element to allow muted colors for secondary variab;es

//Allows color get by name when data order is not guaranteed
const CHART_COLORS_BY_REGION = {
  "Dublin City": CHART_COLORWAY[0],
  "South Dublin": CHART_COLORWAY[3],
  "Dún Laoghaire-Rathdown": CHART_COLORWAY[1],
  "Fingal": CHART_COLORWAY[2],
  "Dublin": CHART_COLORWAY[0],
  "State": CHART_COLORWAY[4]
}
//TODO: placeholder- implement with design system
const CHART_COLORS_BY_VARIABLE = {
  "Dublin City": CHART_COLORWAY[0],
  "South Dublin": CHART_COLORWAY[3],
  "Dún Laoghaire-Rathdown": CHART_COLORWAY[1],
  "Fingal": CHART_COLORWAY[2],
  "Dublin": CHART_COLORWAY[0]
}

const CHART_COLORWAY_VARIABLES = CHART_COLORWAY_BCD_2;

const CHART_OPACITY_BY_REGION = {
  "Dublin City": 1.0,
  "South Dublin": 1.0,
  "Dún Laoghaire-Rathdown": 1.0,
  "Fingal": 1.0,
  "Dublin": 1.0,
  "State": 1.0

}
//TODO: placeholder- implement with design system
const CHART_OPACITY_BY_VARIABLE = {
  "Dublin City": 1.0,
  "South Dublin": 1.0,
  "Dún Laoghaire-Rathdown": 1.0,
  "Fingal": 1.0,
  "Dublin": 1.0

}

const CHART_FONT = {
  family: 'PT Sans',
  size: 16,
  color: '#313131'
};
const CHART_TITLE_FONT = {
  family: 'PT Sans',
  size: 20,
  color: '#313131'
}

const ANNOTATIONS_DEFAULT = {
  text: '',
  xref: 'x',
  yref: 'y',
  width: null, //text box
  height: null,
  align: 'right', //within textbox
  opacity: 1.0, //default
  font: {
    family: null,
    size: 16,
    color: null //default
  },
  showarrow: true, //need this to use ay offset
  xanchor: 'left',
  yanchor: 'center',
  arrowcolor: '#fff',
  arrowhead: 0,
  ax: 0,
  ay: 0,
  borderpad: 5
}

const TRACES_DEFAULT = {
  name: 'trace',
  type: 'scatter',
  mode: 'lines+markers',
  opacity: 1.0, //default
  marker: {
    symbol: null,
    color: null, //lines + markers, defaults to colorway
    line: {
      width: null
    }
  },
  fill: null,
  fillcolor: null,
  hoveron: 'points', //'points+fills',
  line: {
    color: null,
    shape: 'spline'
  },
  text: null,
  hoverinfo: null,
  visible: true //'legendonly'
};

const MULTILINE_CHART_LAYOUT = {
  responsive: true,
  height: 400,
  margin: {
    l: 0,
    r: 0,
    b: 50,
    t: 0
  },
  title: {
    text: '',
    font: CHART_TITLE_FONT,
    visible: false,
    xref: 'container',
    x: 0.0,
    xanchor: 'left',
    yref: 'container',
    y: 1.0,
    yanchor: 'top'
  },
  xaxis: {
    title: 'Years',
    titlefont: {
      size: 16
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12
    }
  },
  yaxis: {
    title: '',
    titlefont: {
      size: 16
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12
    }
  },

  paper_bgcolor: CHART_COLOR, //'#E0E0E0',
  plot_bgcolor: CHART_COLOR,
  colorway: CHART_COLORWAY,
  font: CHART_FONT,
  showlegend: false,
  legend: {
    x: null,
    y: null
    //'orientation': 'v'
  },
  annotations: [],
  hovermode: 'x'
};

const ROW_CHART_LAYOUT = {
  height: 400,
  margin: {
    l: 50,
    r: 0,
    b: 0,
    t: 0
  },
  title: {
    text: '',
    font: {
      family: null,
      size: 20
    },
    visible: false,
    xref: 'container',
    x: 0.0,
    xanchor: 'left',
    yref: 'container',
    y: 1.0,
    yanchor: 'top'
  },
  yaxis: {
    showticklabels: true
  },
  paper_bgcolor: CHART_COLOR,
  plot_bgcolor: CHART_COLOR,
  colorway: CHART_COLORWAY,
  font: CHART_FONT,
  showlegend: false,
  annotations: [],
  hovermode: 'closest'
};

const ROW_CHART_LAYOUT_SUBPLOTS = {
  height: 700,
  margin: {
    l: 0,
    r: 0,
    b: 40,
    t: 40
  },
  title: {
    text: '',
    font: CHART_TITLE_FONT,
    visible: true,
    xref: 'container',
    x: 0.0,
    xanchor: 'left',
    yref: 'container',
    y: 1.0,
    yanchor: 'top'
  },
  xaxis: {
    title: '',
    titlefont: {
      family: 'Arial, sans-serif',
      size: 16,
      color: 'grey'
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12,
      color: null
    }
  },
  yaxis: {
    title: '',
    titlefont: {
      family: 'Arial, sans-serif',
      size: 18,
      color: 'lightgrey'
    },
    visible: true, //false to left-align chart, changed in chart code OR...
    automargin: false, //... turn off auto margin
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    tickfont: {
      family: null,
      size: 14,
      color: 'verydarkgrey'
    },
  },
  paper_bgcolor: CHART_COLOR,
  plot_bgcolor: CHART_COLOR,
  colorway: CHART_COLORWAY,
  font: CHART_FONT,
  showlegend: false,
  annotations: [],
  hovermode: 'closest'
};

const GROUPED_COLUMN_CHART_LAYOUT = {
  barmode: 'group',
  responsive: true,
  margin: MARGINS,
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
  paper_bgcolor: CHART_COLOR,
  plot_bgcolor: CHART_COLOR,
  colorway: CHART_COLORWAY,
  font: CHART_FONT,
  showlegend: true,
  annotations: [],
  hovermode: 'x'
};

const STACKED_AREA_CHART_LAYOUT = {
  responsive: true,
  height: 400,
  margin: {
    l: 0,
    r: 0,
    b: 50,
    t: 0
  },
  title: {
    text: '',
    font: CHART_TITLE_FONT,
    visible: false,
    xref: 'container',
    x: 0.0,
    xanchor: 'left',
    yref: 'container',
    y: 1.0,
    yanchor: 'top'
  },
  xaxis: {
    title: 'Years',
    titlefont: {
      size: 16
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12
    }
  },
  yaxis: {
    title: '',
    titlefont: {
      size: 16
    },
    visible: true,
    type: null,
    range: null,
    fixedrange: true,
    showticklabels: true,
    nticks: null,
    ticks: '',
    automargin: true,
    tickfont: {
      family: null,
      size: 12
    }
  },
  paper_bgcolor: CHART_COLOR,
  plot_bgcolor: CHART_COLOR,
  colorway: CHART_COLORWAY,
  font: CHART_FONT,
  hovermode: 'x',
  annotations: [],
  showlegend: true
};

const UPDATEMENUS_BUTTONS_BASE = {
  type: 'buttons',
  direction: 'right',
  pad: {

    't': 0,
    'r': 0,
    'b': 0,
    'l': 0
  },
  font: {
    family: null,
    size: 16,
    color: null
  },
  fillcolor: 'black',
  bordercolor: 'grey',
  showactive: true,
  bgcolor: 'lightgrey',
  active: 0,
  xref: 'container',
  x: 0.0,
  xanchor: 'left',
  yref: 'container',
  y: 1.05, //place above plot area with >1.0
  yanchor: 'bottom'

}