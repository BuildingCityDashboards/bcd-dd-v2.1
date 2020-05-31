class GroupedBarChart extends Chart {

  constructor(obj) {
    super(obj);

    this.drawChart();
  }

  drawChart() {
    let c = this;

    super.init();
    super.addAxis();
    super.getKeys();
    c.drawTooltip();
    c.createScales(); //parent once I setup setScales:done and setDomain with switch.
    super.drawGridLines();
    c.drawBars(); //child - like createScales could be added to parent with switch.
    // c.drawLegend();//child - like createScales could be added to parent with switch.
  }

  createScales() {
    let c = this,
      yAxisCall,
      xAxisCall,
      x,
      y;

    yAxisCall = d3.axisLeft();
    xAxisCall = d3.axisBottom();
    x = c.getElement(".titleX").text(c.tX);
    y = c.getElement(".titleY").text(c.tY);

    c.x0 = d3.scaleBand()
      .range([0, c.w])
      .padding(0.1);

    c.x1 = d3.scaleBand()
      .paddingInner(0.1);

    c.y = d3.scaleLinear()
      .range([c.h, 0]);

    // Update scales
    c.x0.domain(c.d.map(d => {
      return d[c.xV];
    }));
    c.x1.domain(c.ks).range([0, c.x0.bandwidth()]);
    c.y.domain([0, d3.max(c.d, d => {
      return d3.max(c.ks, key => {
        return d[key];
      });
    })]).nice();

    // Update axes
    xAxisCall.scale(c.x0);
    //- Original code c.xAxis.call(xAxisCall).selectAll(".tick text").call(textWrap, 0, 0);
    c.xAxis.call(xAxisCall).selectAll(".tick text").call(textWrap, 0, 9).attr("transform", "rotate(-65)");

    // c.ySF ? yAxisCall.scale(c.y).tickFormat(c.formatValue(c.ySF)) : yAxisCall.scale(c.y);

    // yAxisCall.scale(c.y);

    // c.yAxis.call(yAxisCall);

    // // Update X axis
    // c.tickNumber ? xAxisCall.scale(c.x).ticks(c.tickNumber) : xAxisCall.scale(c.x);
    c.xAxis.transition(c.t()).call(xAxisCall);

    // Update Y axis
    c.ySF ? yAxisCall.scale(c.y).tickFormat(c.formatValue(c.ySF)) : yAxisCall.scale(c.y);
    c.yAxis.transition(c.t()).call(yAxisCall);

  }

  drawBars() {
    let c = this;

    c.drawGridLines();

    c.g.selectAll(".layers").remove();
    c.g.selectAll(".focus_overlay").remove();

    c.group = c.g.selectAll(".layers")
      .data(c.d);

    c.rectGroup = c.group.enter()
      .append("g")
      .attr("class", "layers")
      .attr("transform", (d) => {
        return "translate(" + c.x0(d[c.xV]) + ",0)";
      })

    c.rects = c.rectGroup.selectAll("rect")
      .data(d => {
        return c.ks.map(key => {
          return {
            key: key,
            [c.yV]: d[key],
            date: d[c.xV]
          };
        });
      }); //hmmm this needs to change?
    // could this be done differently.

    c.rect = c.rects.enter().append("rect")
      .attr("x", d => {
        return c.x1(d.key);
      })
      .attr("y", d => {
        return c.y(d[c.yV]);
      })
      .attr("width", c.x1.bandwidth())
      .attr("height", d => {
        return (c.h - c.y(d[c.yV]));
      })
      .attr("fill", d => {
        return c.colour(d.key);
      })
      .attr("fill-opacity", ".75");


    c.rectsOverlay = c.g.selectAll(".focus_overlay")
      .data(c.d)
      .enter();

    // // append a rectangle overlay to capture the mouse
    c.rectsOverlay.append("g")
      .attr("class", "focus_overlay")
      .append("rect")
      .attr("x", d => c.x0(d[c.xV]))
      .attr("y", "0")
      .attr("width", c.x0.bandwidth()) // give a little extra for last value
      .attr("height", c.h)
      .style("fill", "none")
      .style("stroke", "#00bff7")
      .style("pointer-events", "all")
      .style("visibility", "hidden")
      .on("mouseover", function() {
        d3.select(this).style("visibility", "visible");
      })
      .on("mouseout", function() {
        d3.select(this).style("visibility", "hidden");
        if (!c.sscreens) {
          c.newToolTip.style("visibility", "hidden");
          d3.select(this).style("visibility", "hidden");
        }
      })
      .on("mousemove", (d, e, a) => c.mousemove(d, e, a));

    if (!c.sscreens) {
      c.addLegend();
    }
  }

  addLegend() {
    let c = this;

    let legend = c.g.append("g")
      .attr("transform", "translate(0,0)");

    let legendArray = [];

    c.ks.forEach((d, i) => {
      let obj = {};
      obj.label = d;
      obj.colour = c.colour(d);
      legendArray.push(obj);
    });
    // TODO: compute padding for legend elements
    let legends = legend.selectAll(".legend")
      .data(legendArray)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        return "translate(5," + i * 28 + ")";
      });

    legends.append("rect")
      .attr("class", "legendRect")
      .attr("x", c.w + 2)
      .attr("fill", d => {
        return d.colour;
      })
      .attr("fill-opacity", 0.75);

    legends.append("text")
      .attr("class", "legendText")
      .attr("y", 12)
      .attr("dy", "0em")
      .attr("text-anchor", "start")
      .text(d => {
        return d.label;
      }).call(textWrap, 100, c.w + 22);
  }

  drawTooltip() {
    let c = this;
    if (c.sscreens) {
      // c.newToolTip.style("visibility", "visible");

    } else {
      c.newToolTip = d3.select(c.e)
        .append("div")
        .attr("class", "tool-tip bcd")
      c.newToolTip.style("visibility", "hidden");
      c.newToolTipTitle = c.newToolTip
        .append("div")
        .attr("id", "bcd-tt-title");

      c.tooltipHeaders();
      c.tooltipBody();

    }

    // if (c.sscreens) {
    //   c.ttContent(c.d[1], c.d[0], c.ks); //initalise tooltip hack
    // }

  }

  tooltipHeaders() {
    let c = this,
      div,
      p;

    div = c.newToolTip
      .append("div")
      .attr("class", "headers");

    div
      .append("span")
      .attr("class", "bcd-rect");

    p = div
      .append("p")
      .attr("class", "bcd-text");

    p.append("span")
      .attr("class", "bcd-text-title")
      .text("Type");

    p.append("span")
      .attr("class", "bcd-text-value")
      .text("Value");

    p.append("span")
      .attr("class", "bcd-text-rate")
      .text("% Rate");

    p.append("span")
      .attr("class", "bcd-text-indicator");
  }

  tooltipBody() {
    let c = this,
      keys = c.ks,
      div,
      p;

    keys.forEach((d, i) => {
      div = c.newToolTip
        .append("div")
        .attr("id", "bcd-tt" + i);

      div.append("span").attr("class", "bcd-rect");

      p = div.append("p").attr("class", "bcd-text");

      p.append("span").attr("class", "bcd-text-title");
      p.append("span").attr("class", "bcd-text-value");
      p.append("span").attr("class", "bcd-text-rate");
      p.append("span").attr("class", "bcd-text-indicator");
    });
  }

  addTooltip(obj) {
    let c = this;

    c.title = obj.title;
    c.datelabel = obj.data || "date";
    c.ttWidth = obj.width || 305;
    c.prefix = obj.prefix ? prefix : " ";
    c.postfix = obj.postfix ? postfix : " ";
    c.valueFormat = c.formatValue(obj.format);

    c.drawTooltip();

  }

  mousemove(d, e, a) {

    let c = this;
    if (!c.sscreens) {
      let x = c.x0(d[c.xV]),
        y = -20,
        tooltipX = c.getTooltipPosition(x),
        data = a[e].__data__,
        prevData = a[e - 1] ? a[e - 1].__data__ : null,
        key = c.ks;

      // console.log(`d: ${JSON.stringify(d)}, e: ${e}, a: ${JSON.stringify(a[0])}`);

      c.newToolTip.style("visibility", "visible");
      c.newToolTip.style("left", tooltipX + "px").style("top", y + "px");
      c.ttContent(data, prevData, key);
    }
  }

  getTooltipPosition(mouseX) {
    let c = this,
      ttX,
      cW,
      offset;

    cW = c.w - c.ttWidth;
    offset = c.x1.bandwidth() < 20 ? c.x1.bandwidth() : 15;

    // show right
    if (mouseX < cW) {
      ttX = mouseX + c.x0.bandwidth() + offset + c.m.l;

    } else {
      // show left minus the size of tooltip + 10 padding
      ttX = mouseX + c.m.l + offset - c.ttWidth;
    }
    return ttX;
  }

  hideRate(value) {
    let c = this;

    if (value) {
      //console.log("value of hide", value);
      d3.selectAll(c.e + " .bcd-text-indicator").style("display", "none");
      d3.selectAll(c.e + " .bcd-text-rate").style("display", "none");
    } else {
      d3.selectAll(c.e + " .bcd-text-indicator").style("display", "block");
      d3.selectAll(c.e + " .bcd-text-rate").style("display", "block");
    }
    // value ? c.svg.selectAll(".bcd-text-indicator").style("display", "none") : c.svg.selectAll(".bcd-text-indicator").style("display", "block");
  }

  ttContent(d, pD, k) {
    let c = this;
    k.forEach((v, i) => {
      let id = "#bcd-tt" + i,
        div = c.newToolTip.select(id),
        p = div.select(".bcd-text"),
        newD = d[k[i]],
        oldD = pD ? pD[k[i]] : null,
        diff = pD ? (newD - oldD) / oldD : 0,
        indicator = diff > 0 ? " ▲" : diff < 0 ? " ▼" : "",
        indicatorColour = diff > 0 ? "#20c997" : diff < 0 ? "#da1e4d" : "#f8f8f8",
        rate = indicator !== "" ? d3.format(".1%")(diff) : "N/A",
        vString = c.valueFormat ? c.valueFormat(newD) : newD;
      c.newToolTipTitle.text(c.title + " " + (d[c.xV])); //label needs to be passed to this function
      div.select(".bcd-rect").style("background-color", c.colour(v));
      p.select(".bcd-text-title").text(v);
      p.select(".bcd-text-value").text(vString);
      p.select(".bcd-text-rate").text((rate));
      p.select(".bcd-text-indicator").text(" " + indicator).style("color", indicatorColour);

    });
  }

  showSelectedLabels(array) {
    let c = this,
      e = c.xAxis;
    c.axisArray = array || c.axisArray;

    e.selectAll(".x-axis .tick")
      .style("display", "none");

    c.axisArray.forEach(n => {
      d3.select(e._groups[0][0].childNodes[n])
        .style("display", "block");
    })

  }

}