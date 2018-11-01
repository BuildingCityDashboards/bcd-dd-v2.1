d3.csv(src + "housetype.csv").then( data => { 

const chart = d3.select("#chart2"),
      elementNode = chart.node(),
      elementWidth = elementNode.getBoundingClientRect().width,
      aspectRatio = elementWidth < 800 ? elementWidth * 0.65 : elementWidth * 0.5,
      breakPoint = 678,
      m = {t:0, b:0, r:0, l:0};

    m.t = elementWidth < breakPoint ? 40 : 50,
    m.b = elementWidth < breakPoint ? 30 : 80,
    m.r = elementWidth < breakPoint ? 20 : 100;
    m.l = elementWidth < breakPoint ? 20 : 80;
    
const w = elementWidth - m.l - m.r,
      h = aspectRatio - m.t - m.b,
      svg = chart
        .append("svg")
        .attr("width", w + m.l + m.r)
        .attr("height", h + m.t + m.b);

const g = svg.append("g")
        .attr("transform", "translate(" + m.l + "," + m.t + ")");

const colourScheme = d3.schemeBlues[9].slice(3),
        colour = d3.scaleOrdinal(colourScheme);

const x0 = d3.scaleBand()
        .range([0, w])
        .padding(0.2);

const x1 = d3.scaleBand()
        .padding(0.05);

const y = d3.scaleLinear()
        .range([h, 0]);

// const y1 = d3.scaleBand()

const stack = d3.stack();
        // .offset(d3.stackOffsetExpand);
  
    data.forEach(d => {
        d.value = +d.value;
    });

    data.reverse();
  
    x0.domain(data.map(d => { return d.region; }));
    x1.domain(data.map(d => { return d.date; }))
            .rangeRound([0, x0.bandwidth()])
            .padding(0.2);
    
    colour.domain(data.map(d => { return d.type; }))

    const keys = colour.domain()
  
    // don't rollup values??
    const groupData = d3.nest()
        .key(d => { return d.date + d.region; })
        .rollup((d, i) => {
            const d2 = {date: d[0].date, region: d[0].region}
            d.forEach(d => {
                d2[d.type] = d.value
            })
            return d2;
        })
        .entries(data)
        .map(d => { return d.value; });
        // console.log("groupData", groupData);
  const stackData = stack
  	.keys(keys)(groupData)

      y.domain([0, d3.max(
        stackData, d => { return d3.max(d, d => { return d[1]; }); 
        })]).nice();

    console.log(y.domain);

  const serie = g.selectAll(".serie")
    .data(stackData)
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", d =>  { return colour(d.key); });
  
  serie.selectAll("rect")
    .data(d =>  { return d; })
    .enter().append("rect")
  		.attr("class", "serie-rect")
  		.attr("transform", d =>  { return "translate(" + x0(d.data.region) + ",0)"; })
      .attr("x", d =>  { return x1(d.data.date); })
      .attr("y", d =>  { return y(d[1]); })
      .attr("height", d =>  { return y(d[0]) - y(d[1]); })
      .attr("width", x1.bandwidth())
  		.on("click", function(d, i){ console.log("serie-rect click d", i, d); });
  
  g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x0))
      .selectAll(".tick text").call(textWrap, 60, 0);

  g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y)
    //   .ticks(null, "s")
      );

  const legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", d =>  { 
          const d1 = d[d.length - 1]; 
          return "translate(" 
            + (x0(d1.data.region) 
            + x1(d1.data.date) 
            + x1.bandwidth()) 
            + "," 
            + ((y(d1[0]) 
            + y(d1[1])) / 2) 
            + ")"; 
        });

  legend.append("line")
      .attr("x1", 0)
      .attr("x2", 6)
      .attr("stroke", "#fff");

  legend.append("text")
      .attr("x", 10)
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .style("font", "10px sans-serif")
      .text(d =>  { return d.key; });
})
// catch any error and log to console
.catch(function(error){
    console.log(error);
});

function textWrap(text, width, xpos = 0, limit=3) {
    text.each(function() {
        let words,
            word,
            line,
            lineNumber,
            lineHeight,
            y,
            dy,
            tspan;

        text = d3.select(this);

        words = text.text().split(/\s+/).reverse();
        line = [];
        lineNumber = 0;
        lineHeight = 1;
        y = text.attr('y');
        dy = parseFloat(text.attr('dy'));
        tspan = text
            .text(null)
            .append('tspan')
            .attr('x', xpos)
            .attr('y', y)
            .attr('dy', dy + 'em');

        while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(' '));

            if (tspan.node() && tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));

                if (lineNumber < limit - 1) {
                    line = [word];
                    tspan = text.append('tspan')
                        .attr('x', xpos)
                        .attr('y', y)
                        .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                        .text(word);
                    // if we need two lines for the text, move them both up to center them
                    text.classed('adjust-upwards', true);
                } else {
                    line.push('...');
                    tspan.text(line.join(' '));
                    break;
                }
            }
        }
    });
}