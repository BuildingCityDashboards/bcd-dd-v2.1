let eN = d3.select("#chart-employment-sector").node(),
    eW = eN.getBoundingClientRect().width,
    aR = eW < 800 ? eW * 0.55 : eW * 0.5,
    m = {},
    bP = 678,
    cR = ["#a6cee3",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a",
        "#b15928",
        // "#4575b4",
        // "#d73027",
        "#9e0142",
        "#d53e4f"
    ];

    // margins
    m.t = eW < bP ? 20 : 30;
    m.b = eW < bP ? 10 : 30;
    m.r = 15;
    m.l = 15;

let width = eW - m.r -m.l,
    height = aR - m.t - m.b,
    
    svg = d3.select("#chart-employment-sector")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

let color = d3.scaleOrdinal(//d3.schemeCategory10
        cR.map(function(c) { return d3.interpolateRgb(c, "#fff")(0.1); })
        ),
    format = d3.format(",d");

let treemap = d3.treemap()
    .tile(d3.treemapResquarify) 
    .size([width, height])
    .round(true)
    .paddingInner(0); 


d3.json("../data/Economy/QLF07.json").then( data => { 

  let root = d3.hierarchy(data)
      .eachBefore((d) => { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySize)
      .sort((a, b) => { return b.height - a.height || b.value - a.value; });

  treemap(root);

   let sector =  d3.select("#chart-employment-sector")
      .selectAll(".node")
      .data(root.leaves())
      .enter().append("div")
        .attr("class", "node")
        .attr("title", function(d) { return d.data.name + "\n" + format(d.value); })
        .style("left", function(d) { return d.x0 + 30 + "px"; })
        .style("top", function(d) { return d.y0 + 42 + "px"; })
        .style("width", function(d) { return d.x1 - d.x0 + "px"; })
        .style("height", function(d) { return d.y1 - d.y0 + "px"; })
        .style("background", function(d) { 
            //while (d.depth > 1) d = d.parent.data; return color(d.id); 
            return color(d.data.id);  
        });

        sector.append("div")
            .attr("class", "node-label")
            .text(function(d) {  
                return d.data.name;
            });
    //   sector.append("div")
    //     .attr("class", "node-value")
    //     .text(function(d) {
    //         return format(d.value) + ",000"; 
    //     })
        sector.append("div")
            .attr("class", "node-perc")
            .style("font-size", (d) => {
                return Math.max(12, 0.5*(d.value))+'px'; })
            .text(function(d) { 
                let diff = (d.value)/root.value;
                return d3.format(".2%")(diff); 
            });

    sector.append("div")
        .attr("class", "node-rate")
        .text(function(d) {
            let string = d.data.rate > 0 ? "▲ "+ d3.format(".0%")(d.data.rate) : "▼ "+ d3.format(".0%")(d.data.rate);  
            return string; 
        });

    d3.select("#chart-employment-sector")
        .append("div")
        .attr("class", "titleY")
        .text("2018 Q3");
    })
// catch any error and log to console
.catch(function(error){
console.log(error);
});

function sumBySize(d) {
    return d.size;
  }