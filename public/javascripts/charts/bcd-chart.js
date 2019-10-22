class Chart {

  constructor(obj) {

    this.d = obj.d; // the data
    this.e = obj.e; // selector element
    this.k = obj.k; // key
    this.ks = obj.ks;
    this.xV = obj.xV; // x value
    this.yV = obj.yV; // y value
    this.cS = obj.cS; // colour scheme
    this.tX = obj.tX;
    this.tY = obj.tY;
    this.ySF = obj.ySF || "thousands"; // format for y axis


  }
  // initialise method to draw c area
  init() {
    let c = this,
      eN,
      eW,
      aR,
      cScheme,
      m = c.m = {},
      w,
      h,
      bP;

    eN = d3.select(c.e).node(),
      eW = eN.getBoundingClientRect().width,
      aR = eW < 800 ? eW * 0.55 : eW * 0.5,
      cScheme = c.cS || d3.schemeBlues[5],
      bP = 450;
    // console.log("ew: " + eW);
    // margins
    m.t = eW < bP ? 40 : 50;
    m.b = eW < bP ? 30 : 80;
    m.r = eW < bP ? 15 : 140;
    m.l = eW < bP ? 9 : 60;

    // dimensions
    w = eW - m.l - m.r;
    h = aR - m.t - m.b;

    c.w = w;
    c.h = h;
    c.eN = eN;
    c.sscreens = eW < bP ? true : false;

    // to remove existing svg on resize
    d3.select(c.e).select("svg").remove();

    // add the svg to the target element
    c.svg = d3.select(c.e)
      .append("svg")
      .attr("width", w + m.l + m.r)
      .attr("height", h + m.t + m.b);

    // add the g to the svg and transform by top and left margin
    c.g = c.svg.append("g")
      .attr("transform", "translate(" + m.l +
        ", " + m.t + ")")
      .attr("class", "chart-group");

    // set chart transition method
    c.t = () => {
      return d3.transition().duration(1000);
    };
    c.ease = d3.easeQuadInOut;

    // set chart colour method
    c.colour = d3.scaleOrdinal(cScheme);
    // set chart bisecector method
    c.bisectDate = d3.bisector((d) => {
      return d[c.xV];
    }).left;
  }

  addAxis() {
    let c = this,
      g = c.g,
      gLines,
      xLabel,
      yLabel;

    gLines = g.append("g")
      .attr("class", "grid-lines");

    c.xAxis = g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + c.h + ")");

    c.yAxis = g.append("g")
      .attr("class", "y-axis");

    // X title
    xLabel = g.append("text")
      .attr("class", "titleX")
      .attr("x", c.w / 2)
      .attr("y", c.h + 60)
      .attr("text-anchor", "middle")
      .text(c.tX);

    // Y title
    yLabel = g.append("text")
      .attr("class", "titleY")
      .attr("x", -(c.h / 2))
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text(c.tY);
  }

  getKeys() {
    let c = this,
      findKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p);
    c.colour.domain(c.d.map(d => {
      return d.key;
    }));

    c.ks = c.ks !== undefined ? c.ks : c.d[0].key ? c.colour.domain() : findKeys(c.d.map(d => d[c.k]));
  }

  drawTooltip() {
    let c = this;

    d3.select(c.e).select(".tool-tip.bcd").remove();

    c.newToolTip = d3.select(c.e)
      .append("div")
      .attr("class", "tool-tip bcd");

    // check screen size
    c.sscreens ?
      c.newToolTip.style("visibility", "visible") :
      c.newToolTip.style("visibility", "hidden");

    c.newToolTipTitle = c.newToolTip
      .append("div")
      .attr("id", "bcd-tt-title");

    c.tooltipHeaders();
    c.tooltipBody();
  }

  tooltipHeaders() {
    let c = this,
      div,
      p;

    div = c.newToolTip
      .append("div")
      .attr("class", "headers");

    div.append("span")
      .attr("class", "bcd-dot");

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

      div.append("span").attr("class", "bcd-dot");

      p = div.append("p").attr("class", "bcd-text");

      p.append("span").attr("class", "bcd-text-title");
      p.append("span").attr("class", "bcd-text-value");
      p.append("span").attr("class", "bcd-text-rate");
      p.append("span").attr("class", "bcd-text-indicator");
    });
  }

  drawGridLines() {
    let c = this,
      gLines;

    gLines = c.getElement(".grid-lines");

    gLines.selectAll("line")
      .remove();

    gLines.selectAll("line.horizontal-line")
      .data(c.y.ticks)
      .enter()
      .append("line")
      .attr("class", "horizontal-line")
      .attr("x1", (0))
      .attr("x2", c.w)
      .attr("y1", (d) => c.y(d))
      .attr("y2", (d) => c.y(d));
  }

  getElement(name) {
    let c = this,
      s = d3.select(c.e),
      e = s.selectAll(name);
    return e;
  }

  drawFocusLine() {
    let c = this,
      g = c.g;

    c.focus = g.append("g")
      .attr("class", "focus");

    c.focus.append("line")
      .attr("class", "focus_line")
      .attr("y1", 0)
      .attr("y2", c.h);

    c.focus.append("g")
      .attr("class", "focus_circles");

    c.ks.forEach((d, i) => {
      c.drawFocusCircles(d, i);
    });
  }

  drawFocusCircles(d, i) {
    let c = this,
      g = c.g;

    let tooltip = g.select(".focus_circles")
      .append("g")
      .attr("class", "tooltip_" + i);

    tooltip.append("circle")
      .attr("r", 0)
      .transition(c.t)
      .attr("r", 5)
      .attr("fill", c.colour(d))
      .attr("stroke", c.colour(d));
  }

  // for data that needs to be nested
  // check if the data needs to be nested or not!!
  nestData() {
    let c = this;
    c.d = c.d[0].key ? c.d : c.nest(c.d, c.k);
  }
  nest(data, key) {
    return d3.nest().key(d => {
        return d[key];
      })
      .entries(data);
  }

  formatValue(format) {
    // formats thousands, Millions, Euros and Percentage
    switch (format) {
      case "millions":
        return d3.format(".2s");
        break;

      case "euros":
        return locale.format("$,.0f");
        break;

      case "euros2":
        return locale.format("$,.2f");
        break;

      case "thousands":
        return d3.format(",");
        break;

      case "percentage2":
        return d3.format(".2%");
        break;

      case "percentage":
        return d3.format(".0%");
        break;

      default:
        return "undefined";
    }
  }

}