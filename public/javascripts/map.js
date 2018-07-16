const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;
// const HEIGHT = document.getElementById('map__container').offsetWidth
const HEIGHT = 700;
const ZOOM_THRESHOLD = [0.3, 7];
const OVERLAY_MULTIPLIER = 1;
const ZOOM_DURATION = 500;
const ZOOM_IN_STEP = 2;
const ZOOM_OUT_STEP = 1 / ZOOM_IN_STEP;
const HOVER_COLOR = "#63C1DE";

// Event Handlers
const zoom = d3
  .zoom()
  .scaleExtent(ZOOM_THRESHOLD);

function mouseOverHandler(d, i) {
  d3.select(this).attr("fill", HOVER_COLOR);
  d3.select(this).style("cursor", "pointer"); 
}

function mouseOutHandler(d, i) {
  d3.select(this).attr("fill", "#001F35");
  d3.select(this).style("cursor", "default"); 
}

function clickHandler(d, i) {
  d3.selectAll(".country").classed("country-on", false)
  d3.select(this).classed("country-on", true)
  d3.select("#map__text").text(` ${d.properties.ENGLISH}`)
  d3.select("#region__text").text(`In 2016 the total population in ${d.properties.ENGLISH} was: ${d.properties.POPULATION}, `)
  d3.select("#region__sex").text(`of which Males numbered ${d.properties.MALES} and Females were ${d.properties.FEMALES}. `)
  d3.select("#region__house").text(`The total housing stock was ${d.properties.HOUSESTOCK} of which vacant households (excluding holiday homes) numbered ${d.properties.VACANT}`)
}

// SVG container for placing the map,
// and overlay a transparent rectangle for pan and zoom.
const svg = d3
  .select("#map__container")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const g = svg.append("g");

// Project geojson
// projection config.
const projection = d3
  .geoMercator()
  .center([-6.280387, 53.346174]) //53.346174, -6.280387
  .scale(40000)
  .translate([WIDTH / 4, HEIGHT / 2]);

// SVG path
// use above projection.
const path = d3.geoPath().projection(projection);


// 1. Plot the map from data source `dublincoco`
// 2. Place the local aut name in the map
renderMap(dublincoco);

function renderMap(root) {
  // Draw local aut and register event listeners
  g
    .append("g")
    .selectAll("path")
    .data(root.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#001F35")
    .attr("stroke", "#FFF")
    .attr("stroke-width", 1)
    .attr("class", "country")
    .on("mouseover", mouseOverHandler)
    .on("mouseout", mouseOutHandler)
    .on("click", clickHandler);

  // Place name in the middle
  g
    .append("g")
    .selectAll("text")
    .data(root.features)
    .enter()
    .append("text")
    .attr("transform", d => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("fill", "#FFF")
    .attr("font-size", 10)
    .attr("cursor", "pointer")
    .text(d => d.properties.ENGLISH);
}
