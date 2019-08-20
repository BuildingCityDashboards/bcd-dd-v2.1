//Manage periodic async data fetching (for realtime data cards)
let setIntervalAsync = SetIntervalAsync.dynamic.setIntervalAsync;
// // // let setIntervalAsync = SetIntervalAsync.fixed.setIntervalAsync
// // // let setIntervalAsync = SetIntervalAsync.legacy.setIntervalAsync
let clearIntervalAsync = SetIntervalAsync.clearIntervalAsync

const parseTime = d3.timeParse("%d/%m/%Y"),
  parseYear = d3.timeParse("%Y"),
  formatYear = d3.timeFormat("%Y"),
  parseMonth = d3.timeParse("%Y-%b"),
  formatMonth = d3.timeFormat("%b-%y"),
  breakPoint = 768;

let locale = d3.formatLocale({
  "decimal": ".",
  "thousands": ",",
  "grouping": [3],
  "currency": ["€", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

//   d3.formatLocale(locale);

function dataSets(data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      d[columns[i]] = +d[columns[i]];
    }
    return d;
  });
  return coercedData;
}

Promise.all([
  d3.csv("/data/Economy/QNQ22_2.csv"),
  d3.csv("/data/Demographics/population.csv"),
  d3.csv("data/Housing/houseComp.csv"),
  d3.csv("data/Housing/HPM06.csv"),
]).then(dataFiles => {

  const economyData = dataFiles[0];
  const demographicsData = dataFiles[1];
  const houseCompData = dataFiles[2];
  const priceList = dataFiles[3];

  const columnNames1 = economyData.columns.slice(3);
  const columnNames2 = demographicsData.columns.slice(2);
  const columnNames3 = houseCompData.columns.slice(1);
  const columnNames4 = priceList.columns.slice(2);

  const empValue = columnNames1[1];
  const annualPopRate = columnNames2[0];

  const xValue = houseCompData.columns[0];
  const xValue2 = priceList.columns[0];

  const dataSet = dataSets(economyData, columnNames1);
  const dataSet2 = dataSets(demographicsData, columnNames2);
  const dataSet3 = dataSets(houseCompData, columnNames3);
  const dataSet4 = dataSets(priceList, columnNames4);

  dataSet.forEach(d => {
    d.quarter = convertQuarter(d.quarter);
    d.label = formatQuarter(d.quarter);
    d[empValue] = +d[empValue] * 1000;
  });

  dataSet4.forEach(d => {
    d.date = parseMonth(d.date);
    d.label = formatMonth(d.date);
  });

  const dateFiltered = dataSet.filter(d => {
    return d.quarter >= new Date("Tue Jan 01 2013 00:00:00") && d.quarter <= new Date("Tue Feb 01 2017 00:00:00");
  });

  const date4Filtered = dataSet4.filter(d => {
    // return d.region === "Dublin";
    return d.region === "Dublin" && !isNaN(d.all);
  });

  const dublinData = dataSet.filter(d => {
    return d.region === "Dublin" && !isNaN(d[empValue]);
  });

  const dublinAnnualRate = dataSet2.filter(d => {
    return d.region === "Dublin";
  });

  // charts setup here
  const unemploy = {
      d: dublinData,
      e: "#test-glance",
      yV: empValue,
      xV: "quarter",
      sN: "region",
      fV: d3.format(".2s"),
      dL: "label"

    },

    unemployChart = new DataGlanceLine(unemploy);

  const pop = {
      d: dublinAnnualRate,
      e: "#pr-glance",
      yV: annualPopRate,
      xV: "date",
      sN: "region",
      fV: d3.format(".2s"),
      dL: "date"
    },

    popChart = new DataGlanceLine(pop);


  const houseCompMonthly = new GroupedBarChart(dataSet3, columnNames3, xValue, "#hc-glance", "Units", "title2");

  // const priceListQuartley = new GroupedBarChart(date4Filtered, columnNames4, xValue2, "#ap-glance", "€", "title2");

  d3.select(window).on("resize", function() {
    houseCompMonthly.init();
    unemployChart.init();
    popChart.init();
    priceIndexChart.init();

    let screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenSize >= 768) {
      renderMap(dublincoco);
    } else {
      renderTabs(dublincoco);
    }
    laElement.dispatchEvent(clickEvent);
  });

  const priceIndex = {
      d: date4Filtered,
      e: "#ap-glance",
      yV: "all",
      xV: "date",
      sN: "region",
      dL: "label"
    },
    priceIndexChart = new DataGlanceLine(priceIndex);

  updateInfoText("#emp-chart a", "<b>Total Unemployment</b> in Dublin for ", " on previous quarter", dublinData, columnNames1[1], "label", d3.format(".2s"), true);
  updateInfoText("#app-chart a", "The <b>Property Price Index</b> for Dublin on ", " on previous month", date4Filtered, columnNames4[0], "label", locale.format(""));
  updateInfoText("#apd-chart a", "The <b>Total Population</b> of Dublin in ", " on 2011", dataSet2, columnNames2[0], "date", d3.format(".2s"));
  updateInfoText("#huc-chart a", "<b>Monthly House Unit Completions</b> in Dublin ", " on previous month", dataSet3, columnNames3[0], "date", d3.format(""));


}).catch(function(error) {
  console.log(error);
});

class DataGlanceLine {

  // constructor function
  constructor(obj) {

    this.d = obj.d;
    this.e = obj.e;
    this.yV = obj.yV;
    this.xV = obj.xV;
    this.sN = obj.sN;
    this.fV = obj.fV;
    this.dL = obj.dL;

    // create the chart area
    this.init();
  }

  init() {
    let c = this;

    d3.select(c.e).select("svg").remove();

    c.eN = d3.select(c.e).node();
    c.eW = c.eN.getBoundingClientRect().width;

    // dimensions margins, width and height
    c.m = [20, 10, 25, 10];
    c.w = c.eW - c.m[1] - c.m[3];
    c.h = 120 - c.m[0] - c.m[2];

    c.setScales();
    c.drawLine();
    c.drawLabels();
  }

  setScales() {
    let c = this,
      maxToday = c.d.length > 0 ? d3.max(c.d, (d) => {
        return d[c.yV];
      }) : 0;

    // setting the line values ranges
    c.x = d3.scaleTime().range([0, c.w - 5]);
    c.y = d3.scaleLinear().range([c.h - 10, 0]);

    // setup the line chart function
    c.line = d3.line()
      .defined((d) => {
        return !isNaN(d[c.yV]);
      })
      .x(d => {
        return c.x(d[c.xV]);
      })
      .y(d => {
        return c.y(d[c.yV]);
      })
      .curve(d3.curveBasis);

    c.x.domain(d3.extent(c.d, d => {
      return (d[c.xV]);
    }));

    c.y.domain([0, Math.max(maxToday)]);

  }

  drawLine() {
    let c = this;

    // Adds the svg canvas
    c.svg = d3.select(c.e)
      .append("svg")
      .attr("width", c.w + c.m[1] + c.m[3])
      .attr("height", c.h + c.m[0])
      .append("g")
      .attr("transform", "translate(" + c.m[3] + "," + "20" + ")");

    // add the data
    c.svg.append("path")
      .attr("class", "activity")
      .attr("d", c.line(c.d))
      .attr("stroke", "#16c1f3") // move to css
      .attr("stroke-width", 4) // move to css
      .attr("fill", "none"); // move to css
  }

  drawLabels() {
    let c = this,
      l = c.d.length,
      lD = c.d[l - 1],
      fD = c.d[0];

    // Region/type name
    c.svg.append("text")
      .attr("dx", 0)
      .attr("dy", -10)
      .attr("class", "label")
      .attr("fill", "#16c1f3") // move to css
      .text(lD[c.sN]); // needs to be a d.name

    // value label
    c.svg.append("text")
      .attr("x", c.w + 10)
      .attr("y", c.y(lD[c.yV]) - 10)
      .attr("text-anchor", "end") // move to css
      .attr("class", "label")
      .attr("fill", "#f8f9fabd") // move to css
      .text(c.fV ? c.fV(lD[c.yV]) : lD[c.yV]);

    // latest date label
    c.svg.append("text")
      .attr("x", c.w)
      .attr("y", c.h - 5)
      .attr("text-anchor", "end") // move to css
      .attr("class", "label employment")
      .attr("fill", "#f8f9fabd") // move to css
      .text(lD[c.dL]);

    // first date label
    c.svg.append("text")
      .attr("x", 0)
      .attr("y", c.h - 5)
      .attr("text-anchor", "start") // move to css
      .attr("class", "label employment")
      .attr("fill", "#f8f9fabd") // move to css
      .text(fD[c.dL]);

    c.svg.append("circle")
      .attr("cx", c.x(lD[c.xV]))
      .attr("cy", c.y(lD[c.yV]))
      .attr("r", 3)
      .attr("transform", "translate(0,0)") // move to css
      .attr("class", "cursor")
      .style("stroke", "#16c1f3") // move to css
      .style("stroke-width", "2px"); // move to css
  }
}

class GroupedBarChart {

  // constructor function
  constructor(_data, _keys, _xValue, _element, _titleX, _titleY) {

    this.data = _data;
    this.keys = _keys;
    this.xValue = _xValue;
    this.element = _element;
    this.titleX = _titleX;
    this.titleY = _titleY;

    this.init();
  }

  // initialise method to draw chart area
  init() {
    let c = this,
      last = c.data.length - 1;
    c.lastValue = c.data[last].Dublin;

    d3.select(c.element).select("svg").remove();

    let eNode = d3.select(c.element).node();
    let eWidth = eNode.getBoundingClientRect().width;

    // margin
    c.m = [20, 10, 25, 10];

    c.width = eWidth - c.m[1] - c.m[3];
    c.height = 120 - c.m[0] - c.m[2];

    // add the svg to the target element
    const svg = d3.select(c.element)
      .append("svg")
      .attr("width", c.width + c.m[1] + c.m[3])
      .attr("height", c.height + c.m[0]);

    // add the g to the svg and transform by top and left margin
    c.g = svg.append("g")
      .attr("transform", "translate(" + c.m[3] + "," + "20" + ")");

    // transition
    c.t = () => {
      return d3.transition().duration(1000);
    }

    c.colourScheme = ["#aae0fa", "#00929e", "#16c1f3", "#16c1f3", "#da1e4d", "#086fb8", "#16c1f3"];

    // set colour function
    c.colour = d3.scaleOrdinal(c.colourScheme.reverse());

    c.x0 = d3.scaleBand()
      .range([0, c.width])
      .padding(0.05);

    c.x1 = d3.scaleBand()
      .paddingInner(0.1);

    c.y = d3.scaleLinear()
      .range([c.height, 0]);

    // Start Month
    c.g.append("text")
      .attr("class", "label")
      .attr("x", 0)
      .attr("y", c.height - 5)
      .attr("text-anchor", "start")
      .attr("fill", "#f8f9fabd")
      .text(c.data[0].date);

    // Last Month
    c.g.append("text")
      .attr("class", "label")
      .attr("x", c.width)
      .attr("y", c.height - 5)
      .attr("text-anchor", "end")
      .attr("fill", "#f8f9fabd")
      .text(c.data[last].date);

    // Title
    c.g.append("text")
      .attr("dx", 0)
      .attr("dy", -10)
      .attr("class", "label")
      .attr("fill", "#16c1f3")
      .text(c.keys[0]);

    c.update();

  }

  update() {
    let c = this;

    // Update scales
    c.x0.domain(c.data.map(d => {
      return d[c.xValue];
    }));
    c.x1.domain(c.keys).range([0, c.x0.bandwidth()]);
    c.y.domain([0, d3.max(c.data, d => {
      return d3.max(c.keys, key => {
        return d[key];
      });
    })]).nice();

    // join new data with old elements.
    c.rects = c.g.append("g")
      .attr("class", "parent")
      .selectAll("g")
      .data(c.data, (d) => {
        return !isNaN(d.Value);
      })
      .enter()
      .append("g")
      .attr("transform", (d) => {
        return "translate(" + c.x0(d[c.xValue]) + ", 0)";
      })
      .selectAll("rect")
      .data(d => {
        return c.keys.map(key => {
          return {
            key: key,
            value: d[key]
          };
        });
      })
      .enter().append("rect")
      .attr("x", d => {
        return c.x1(d.key);
      })
      .attr("y", d => {
        return c.y(d.value);
      })
      .attr("width", c.x1.bandwidth())
      .attr("height", d => {
        return (c.height - c.y(d.value) - c.m[0]);
      })
      .attr("rx", "2")
      .attr("ry", "2")
      .attr("fill", "rgba(29, 158, 201, 0.6)");

    d3.select(".parent g:nth-last-child(1) rect")
      .attr("fill", "#16c1f3");

    c.g.append("text")
      .attr("dx", c.width)
      .attr("dy", c.y(c.lastValue) - 10)
      .attr("text-anchor", "end")
      .attr("class", "label value")
      .attr("fill", "#f8f9fabd")
      .text(c.lastValue);
  }

}

function convertQuarter(q) {
  let splitted = q.split('Q');
  let year = splitted[0];
  let quarterEndMonth = splitted[1] * 3 - 2;
  let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year);

  return date;
}

function formatQuarter(date) {
  let newDate = new Date();
  newDate.setMonth(date.getMonth() + 1);
  let year = (date.getFullYear());
  let q = Math.ceil((newDate.getMonth()) / 3);
  return year + " Q" + q;
}

function updateInfoText(selector, startText, endText, data, valueName, labelName, format, changeArrrow) {
  let lastData = data[data.length - 1],
    previousData = data[data.length - 2],
    currentValue = lastData[valueName],
    prevValue = previousData[valueName],
    difference = ((currentValue - prevValue) / currentValue),
    lastElementDate = lastData[labelName];
  let green = "#20c997",
    red = "#da1e4d",
    text = d3.select("#data-text p"),
    // textString = text.text(),
    textString = "<b>Hover over these charts for more information, click to go to the data page </b>",
    cArrow = changeArrrow,
    indicatorSymbol = difference > 0 ? "▲ " : difference < 0 ? "▼ " : " ",
    indicator = difference > 0 ? "Up" : difference < 0 ? "Down" : " a change of ",
    indicatorColour = cArrow ? difference > 0 ? red : green : difference > 0 ? green : red,
    startString = startText,
    endString = endText;

  d3.select(selector)
    .on("mouseover", (d) => {

      text.html(startString).attr("class", "bold-text");
      text.append("span").text(lastElementDate).attr("class", "bold-text");

      text.append("text").text(" was ");

      text.append("span").text(format(currentValue))
        .attr("class", "bold-text");

      text.append("text").text(". That's ");

      text.append("span").text(indicatorSymbol).attr("class", "bold-text").style("color", indicatorColour);
      text.append("span").text(indicator + " " + d3.format(".2%")(difference)).attr("class", "bold-text");

      text.append("text").text(" " + endString);
    })
    .on("mouseout", (d) => {
      text.html(textString);
    });

  d3.select(selector).on("blur", (d) => {
    text.text(textString);
  });

  d3.select(selector).on("focus", (d) => {
    text.text(startString);
    text.append("span").text(lastElementDate).attr("class", "bold-text");

    text.append("text").text(" was ");

    text.append("span").text(format(currentValue))
      .attr("class", "bold-text");

    text.append("text").text(". That's ");

    text.append("span").text(indicator + " " + d3.format(".2%")(difference)).attr("class", "bold-text").style("color", indicatorColour);

    text.append("text").text(" " + endString);
  });
}

function infoText() {

}