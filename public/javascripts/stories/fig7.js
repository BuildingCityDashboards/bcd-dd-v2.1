var sum1 = 0;
var v1 = 0;
var v2 = 0;
var v3 = 0;
var v4 = 0;
var v5 = 0;
var v6 = 0;
var v7 = 0;
var v8 = 0;
var text = "";

/* Note*/
/*webographie : http://bl.ocks.org/mbostock/3943967*/
/*Basée sur le travail de Mike Bostock’s Blocks*/
// var d.value
var parseDate = d3.timeParse("%Y");
var formatTime = d3.timeFormat("%Y");

var margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
  },
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;



//var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var svg = d3.select("#chart7").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);


var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
  .range([0, width])
  .padding(0.4);

var x1 = d3.scaleBand()
  .padding(0.1);

var yBar = d3.scaleLinear()
  .range([height, 0]);

var yStack = d3.scaleLinear()
  .range([height, 0]);

var color = d3.scaleOrdinal()
  .range(["#ff0000", "#33ccff", "#ffff80", "#004080", "#009999", "#1affff", "#ffb3d9", " #999966"]);

// lecture du fichier stocks.csv

//var xAxis = d3.scaleLinear().orient("bottom").ticks(5);


var tooltip = d3.select("body").append("div").attr("class", "toolTip");


d3.csv('/data/Housing/House_Com.csv', function(StockData) {

  var nest_by_year = d3.nest()
    .key(function(d) {
      return formatTime(parseDate(d.date));
    })
    .entries(StockData);

  // console.log(StockData);
  var Transitional_data = [];

  nest_by_year.forEach(function(KeyYear) {

    var nest_by_symbol = d3.nest()
      .key(function(d) {
        return d.region;
      })
      .rollup(function(v) {
        return d3.mean(v, function(d) {
          return d.value;
        })
      })


      .object(KeyYear.values);

    Transitional_data.push({
      key: +KeyYear.key,
      values: nest_by_symbol

    });
  });



  //  console.log(Transitional_data) afficher l'objet 0

  var Final_data = Transitional_data.map(function(d) {
    var merged = {
      year: d.key
    };
    Object.keys(d.values).forEach(function(key) {
      merged[key] = d.values[key];
    });
    return merged;
    // console.log(merged)
  });



  for (j in Final_data) {
    //text += Final_data[j] + "<br>";
    //   console.log(Final_data[9].);
  }



  var keys = d3.keys(Final_data[0]).slice(1);

  /*for(var i = 0; i < keys.length; i++) {
        var obj = keys[i];
        //text = text+obj +'<br>';
        text = text + (obj +'----' + parseInt(Final_data[9][obj]) + '--' + parseInt(Final_data[9][obj])/68821) + '<br />';
      }

console.log(text);*/


  //console.log(text);

  var keys = d3.keys(Final_data[0]).slice(1);
  //console.log(keys)


  // on somme les données

  var SumData = [];
  Final_data.forEach(function(d) {
    SumData.push(d3.sum(keys, function(key) {
      return d[key];
    }))
  });




  x.domain(Final_data.map(function(d) {
    return d.year;
  }));
  x1.domain(keys).range([0, x.bandwidth()]);
  yBar.domain([0, d3.max(Final_data, function(d) {
    return d3.max(keys, function(key) {
      return d[key];
    });
  })]);
  yStack.domain([0, d3.max(SumData)]);

  var group = g
    .selectAll("g")
    .data(d3.stack().keys(keys)(Final_data))
    .enter().append("g")
    .attr("fill", function(d) {
      return color(d.key);
    });


  g.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Houses Completed by Year");
  var rect = group.selectAll("rect")
    .data(function(d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function(d) {
      return x(d.data.year);
      x(d.data.region);
    })
    .attr("y", function(d) {
      return yStack(d[1]);
    })
    .attr("height", function(d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .attr("width", x.bandwidth())
    .on("mouseover", function(d) {


      if (d.data.year === 1994) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[0][obj]) + '--' + (parseInt(Final_data[0][obj]) *
            100 / SumData[0]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[0];

        text = text + "</div>";
      }




      if (d.data.year === 1995) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[1][obj]) + '--' + (parseInt(Final_data[1][obj]) *
            100 / SumData[1]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[1];

        text = text + "</div>";
      }



      if (d.data.year === 1996) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[2][obj]) + '--' + (parseInt(Final_data[2][obj]) *
            100 / SumData[2]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[2];

        text = text + "</div>";
      }



      if (d.data.year === 1997) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[3][obj]) + '--' + (parseInt(Final_data[3][obj]) *
            100 / SumData[3]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[3];

        text = text + "</div>";
      }


      if (d.data.year === 1998) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[4][obj]) + '--' + (parseInt(Final_data[4][obj]) *
            100 / SumData[4]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[3];

        text = text + "</div>";
      }





      if (d.data.year === 1999) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[5][obj]) + '--' + (parseInt(Final_data[5][obj]) *
            100 / SumData[5]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[5];

        text = text + "</div>";
      }


      if (d.data.year === 2000) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[6][obj]) + '--' + (parseInt(Final_data[6][obj]) *
            100 / SumData[6]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[6];

        text = text + "</div>";
      }


      if (d.data.year === 2001) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[7][obj]) + '--' + (parseInt(Final_data[7][obj]) *
            100 / SumData[7]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[7];

        text = text + "</div>";
      }


      if (d.data.year === 2002) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[8][obj]) + '--' + (parseInt(Final_data[8][obj]) *
            100 / SumData[8]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[8];

        text = text + "</div>";
      }

      if (d.data.year === 2003) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[9][obj]) + '--' + (parseInt(Final_data[9][obj]) *
            100 / SumData[9]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[9];

        text = text + "</div>";
      }


      if (d.data.year === 2004) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[10][obj]) + '--' + (parseInt(Final_data[10][obj]) *
            100 / SumData[10]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[10];

        text = text + "</div>";
      }


      if (d.data.year === 2005) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[11][obj]) + '--' + (parseInt(Final_data[11][obj]) *
            100 / SumData[11]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[11];

        text = text + "</div>";
      }


      if (d.data.year === 2006) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[12][obj]) + '--' + (parseInt(Final_data[12][obj]) *
            100 / SumData[12]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[12];

        text = text + "</div>";
      }

      if (d.data.year === 2007) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[13][obj]) + '--' + (parseInt(Final_data[13][obj]) *
            100 / SumData[13]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[13];

        text = text + "</div>";
      }

      if (d.data.year === 2008) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[14][obj]) + '--' + (parseInt(Final_data[14][obj]) *
            100 / SumData[14]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[14];

        text = text + "</div>";
      }

      if (d.data.year === 2009) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[15][obj]) + '--' + (parseInt(Final_data[15][obj]) *
            100 / SumData[15]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[15];

        text = text + "</div>";
      }


      if (d.data.year === 2010) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[16][obj]) + '--' + (parseInt(Final_data[16][obj]) *
            100 / SumData[16]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[16];

        text = text + "</div>";
      }


      if (d.data.year === 2011) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[17][obj]) + '--' + (parseInt(Final_data[17][obj]) *
            100 / SumData[17]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[17];

        text = text + "</div>";
      }


      if (d.data.year === 2012) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[18][obj]) + '--' + (parseInt(Final_data[18][obj]) *
            100 / SumData[18]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[18];

        text = text + "</div>";
      }

      if (d.data.year === 2013) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[19][obj]) + '--' + (parseInt(Final_data[19][obj]) *
            100 / SumData[19]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[19];

        text = text + "</div>";
      }



      if (d.data.year === 2014) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[20][obj]) + '--' + (parseInt(Final_data[20][obj]) *
            100 / SumData[20]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[20];

        text = text + "</div>";
      }

      if (d.data.year === 2015) {
        text = "<div class='square-set'>" + ""
        text = text + "Region " + "&emsp;&emsp;&emsp;&emsp;&emsp;" + "values" + "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + "%" + "<br>"
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[21][obj]) + '-------' + (parseInt(Final_data[21][obj]) *
            100 / SumData[21]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[21];

        text = text + "</div>";
      }

      if (d.data.year === 2016) {
        text = "<div class='square-set'>" + ""
        for (var i = 0; i < keys.length; i++) {

          var obj = keys[i];
          //text = text+obj +'<br>';
          text = text + obj + '----' + parseInt(Final_data[22][obj]) + '--' + (parseInt(Final_data[22][obj]) *
            100 / SumData[22]).toFixed(2) + '<br />' + '<br>';
        }

        text = text + '<br>' + 'Total: ' + '&emsp;&emsp;&emsp;' + '----- ' + '<br>' + '&emsp;&emsp;&emsp;' + SumData[22];

        text = text + "</div>";
      }

      tooltip
        .style("left", d3.event.pageX - 200 + "px")
        .style("top", d3.event.pageY - 200 + "px")
        .style("display", "inline-block")
        .style("left", d3.event.pageX - 200 + "px")
        .style("top", d3.event.pageY - 200 + "px")
        .style("display", "inline-block")
        .html(text)
    })



    .on("mouseout", function(d) {
      tooltip.style("display", "none");
    });


  g.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  var yAxis = g.append("g")
    .call(d3.axisLeft(yStack));

  yAxis.append("text")
    .attr("x", -35)
    .attr("y", -15)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("value");

  d3.selectAll("input")
    .on("click", changed);

  function changed() {
    if (this.value === "grouped") GroupeIt();
    else StackIt();
  };

  function GroupeIt() {
    rect
      .transition().duration(900)
      .attr("width", x1.bandwidth())
      .transition().duration(1000)
      .attr("x", function(d) {
        return x(d.data.year) + x1(this.parentNode.__data__.key)
      })
      .transition().duration(1000)
      .attr("y", function(d) {
        return yBar(d[1] - d[0]);
      })
      .attr("height", function(d) {
        return yBar(0) - yBar(d[1] - d[0]);
      });

    yAxis
      .transition()
      .call(d3.axisLeft(yBar));
  };

  function StackIt() {
    rect
      .transition().duration(1000)
      .attr("y", function(d) {
        return yStack(d[1] - d[0]);
      })
      .attr("height", function(d) {
        return yStack(d[0]) - yStack(d[1]);
      })
      .transition().duration(1000)
      .attr("y", function(d) {
        return yStack(d[1]);
      })
      .transition().duration(900)
      .attr("x", function(d) {
        return x(d.data.year);
      })
      .attr("width", x.bandwidth());

    yAxis
      .transition()
      .call(d3.axisLeft(yStack));
  };

  var legend = svg.selectAll(".legend")
    .data(color.domain().reverse()).enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 15 + ")";
    });

  legend.append("path")
    .style("fill", function(d) {
      return color(d);
    })
    .attr("d", d3.symbol().type(d3.symbolSquare).size(100))
    .attr("transform", "translate(" + width / 1.1 + "," + 20 + ")");

  legend.append("text")
    .attr("x", width / 2.5 + 470)
    .attr("y", 20)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) {
      return d;
    });
});