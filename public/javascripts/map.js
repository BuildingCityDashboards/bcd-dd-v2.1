const HOVER_COLOR = "#16c1f3";
const svg = d3.select("#map__container");


const elementNode = svg.node();
const parentElement = elementNode.parentNode;
let elementWidth = parentElement.getBoundingClientRect().width; 
console.log(elementWidth);
let aspectRatio = elementWidth < 500 ? elementWidth * 1.5 : elementWidth * 1.5;
let scaleValue = elementWidth > 500 ? 50000 : elementWidth < 300 ? 20000 : 30000;


const WIDTH = elementWidth;
const HEIGHT = aspectRatio;

    svg.attr("width", WIDTH)
      .attr("height", HEIGHT);

// Event Handlers
function mouseOverHandler(d, i) {
  d3.select(this).attr("fill", HOVER_COLOR)
    .style("cursor", "pointer"); 
  // d3.select("#region" + d.properties.OBJECTID).attr("fill", HOVER_COLOR);
}

function mouseOutHandler(d, i) {
  d3.select(this).attr("fill", "#001F35")
    .style("cursor", "default"); 
  // d3.select("#region" + d.properties.OBJECTID).attr("fill", "#001F35");
}

function clickHandler(d, i) {
  d3.selectAll(".region").classed("region-on", false)
  // d3.select(this).classed("region-on", true)
  d3.select("#region" + d.properties.OBJECTID).classed("region-on", true)
  d3.select("#region__title").text(`${d.properties.ENGLISH}`)
  d3.select("#region__title__small").text(`${d.properties.ENGLISH} was `)
  d3.select("#region__population").text(`${d.properties.POPULATION}`)
  d3.select("#region__house").text(`${d.properties.HOUSESTOCK}`)
  d3.select("#region__vacant").text(`${d.properties.VACANT}.`)
  d3.select(".lp-map__compare").style("visibility", "visible");
}

// SVG container for placing the map,
// and overlay a transparent rectangle for pan and zoom
const g = svg.append("g");

// Project geojson
// projection config.
const projection = d3
  .geoMercator()
  // .center([-6.280387, 53.346174]) //53.346174, -6.280387
  // .center([-6.251264, 53.360643])
  .center([-6.458681, 53.360675])
  .scale(scaleValue)
  .translate([WIDTH / 4, HEIGHT / 2]);

// SVG path
// use above projection.
const path = d3.geoPath().projection(projection);


// 1. Plot the map from data source `dublincoco`
// 2. Place the local aut name in the map

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
    .attr("stroke", "#d1d1d182")
    .attr("stroke-width", 1)
    .attr("class", "region")
    .attr("id", d => "region" + d.properties.OBJECTID)
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
    .attr("id", d => "regionLabel" + d.properties.OBJECTID)
    .attr("transform", d => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("fill", "#FFF")
    .attr("font-size", 14)
    .attr("cursor", "pointer")
    // .on("mouseover", mouseOverHandler)
    // .on("mouseout", mouseOutHandler)
    .on("click", clickHandler)
    .text(d => d.properties.ENGLISH)
    .style('pointer-events', 'none');

}

renderMap(dublincoco);
