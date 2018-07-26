/* 
 
 */
var select1 = dc.selectMenu('#select1'),
        select2 = dc.selectMenu('#select2'),
        select3 = dc.selectMenu('#select3');
//        dataTable = dc.dataTable('#datatable');

var waitListXF; //the crossfilter
var nameDim, specialityDim, ageDim, dateDim, yearDim, allWaitlistDim, waitDim; //some dimensions for analysis
var nameGroup, specialityGroup, ageGroup, dateGroup, yearGroup, waitGroup, allWaitlistGroup; //some groupings 


d3.csv("/data/OP_Waiting_Lists_Dublin_Hospitals_2014-2018_2.csv").then(function (opWaitData) {
    /*Hospital Data*****************************/
                            console.log("opWaitData- \n" + opWaitData.length);
    processData(opWaitData);

});

function processData(opWData) {
    opWData.forEach(function (d) {
//                    set up useful properties for the data
        d.count = +d.Count; //coorece to a number
//                    d.dateString = d.ArchiveDate; //date stored as a string
        var timeParse = d3.timeParse("%d/%m/%Y");
        d.date = timeParse(d.ArchiveDate); // date stored in JS Date format
        d.wait = d["Time Bands"]; //we can add a more standardised property than the raw column names
        d.age = d["AgeProfile"]; //note this adds more fields to the data
        d.name = d["Hospital"];
        d.speciality = d["Speciality"];
        d.year = d.date.getFullYear();
    }
    );
    waitListXF = crossfilter(opWData);
//                    console.log("cf: " + waitListXF.size());

//                    specify which property will serve as the accessor for the dimension
//                    this is used to order the dimension (??? correct ???)
    nameDim = waitListXF.dimension(function (d) {
        return d.name;
    });
    nameGroup = nameDim.group();
//                    console.log("nameDim: " + JSON.stringify(nameDim.top(3)));
//    console.log("nameGroup: " + JSON.stringify(nameGroup.all()));

    specialityDim = waitListXF.dimension(function (d) {
        return d.speciality;
    });
    specialityGroup = specialityDim.group();
//                    console.log("specialityDim: " + JSON.stringify(specialityDim.top(3)));
//                    console.log("specialityGroup: " + JSON.stringify(specialityGroup.all()));

    ageDim = waitListXF.dimension(function (d) {
        return d.age;
    });
    ageGroup = ageDim.group();
//                    console.log("ageDim: " + JSON.stringify(ageDim.top(3)));
//                    console.log("ageGroup: " + JSON.stringify(ageGroup.all()));

//                dateStringDim = waitListXF.dimension(function (d) {
//                    return d.dateString;
//                });
//                dateStringGroup = dateStringDim.group();
    //as dates are strings, groups will not be ordered in chronological order...
//                    console.log("\ndateStringGroup.all(): " + JSON.stringify(dateStringGroup.all()));

    dateDim = waitListXF.dimension(function (d) {
        return d.date;
    });
    dateGroup = dateDim.group();
    //as dates are formatted, groups will be ordered chronologically...
//                    console.log("\ndateGroup.all(): " + JSON.stringify(dateGroup.all()));
//                    console.log("\ndateGroup.top(1)[0]: " + JSON.stringify(dateGroup.top(1)[0]));
    yearDim = waitListXF.dimension(function (d) {
        return d.year;
    });
    yearGroup = yearDim.group();


    waitDim = waitListXF.dimension(function (d) {
        return d.wait;
    });
    waitGroup = waitDim.group();

    allWaitlistDim = waitListXF.dimension(function (d) {
        return d;
    });
    allWaitlistGroup = allWaitlistDim.groupAll();

    makeCharts();
//    makeCalendar();

}


function makeCharts() {

//try some filters to reduce data for plotting
//                    filter out all but a single hospital by name
//                    nameDim.filter("Tallaght Hospital");
//                    filter leaving multiple hospitals in (union operation)
//                    nameDim.filterFunction(function (d) {
//                        return d === "Tallaght Hospital" || d === "Beaumont Hospital";
//                    });

//                    console.log("\nwaitGroup.all(): " + JSON.stringify(waitGroup.all()));
//                    
//                    create groups on the fly from one dimension using reduceSum
//                    we want to gather the count for each wait time span to plot 
//                    on individual layers of an area graph


    var wait_0_3_Group = dateDim.group().reduceSum(function (d) {
        //inconsistent entires need to be captured e.g. leading whitespace
        return d.wait === "0-3 Months" || d.wait === " 0-3 Months";
    });
    var wait_3_6_Group = dateDim.group().reduceSum(function (d) {
        return d.wait === "3-6 Months" || d.wait === " 3-6 Months";
    });
    var wait_6_9_Group = dateDim.group().reduceSum(function (d) {
        return d.wait === "6-9 Months" || d.wait === " 6-9 Months";
    });
    var wait_9_12_Group = dateDim.group().reduceSum(function (d) {
        return d.wait === "9-12 Months" || d.wait === " 9-12 Months";
    });
    var wait_12_15_Group = dateDim.group().reduceSum(function (d) {
        return d.wait === "12-15 Months" || d.wait === " 12-15 Months";
    });
    var wait_15_18_Group = dateDim.group().reduceSum(function (d) {
        return d.wait === "15-18 Months" || d.wait === " 15-18 Months";
    });
    var wait_18Plus_Group = dateDim.group().reduceSum(function (d) {
        return d.wait === "18+ Months" || d.wait === " 18+ Months";
    });

//                    waitDim.filter("18+ Months");
//                    ageDim.filter("0-15");
//                    specialityDim.filter("Chemical Pathology");

//Create some groups specific to charts


//                   dimensions are ordered by the named key e.g. date
//                   get the record with earliest date, 
//                   that exists in the dimension with non-zero value,
//                   observing any applied filters
    var earliest = dateDim.bottom(1)[0].date;
//                    and the most recent
    var latest = dateDim.top(1)[0].date;

//    console.log("\n\nEarliest (dateDim.bottom(1)[0].date) : " + JSON.stringify(earliest));
//    console.log("\nLatest (dateDim.top(1)[0].date) : " + JSON.stringify(latest));

//                    group.top(n) lists the top n groups BY VALUE (returns an array) 
    var topDate = dateGroup.top(1)[0]; //the date (key) of the group with highest associated value
    var bottomDate = dateGroup.top(Infinity)[dateGroup.size() - 1]; //
//                    groupAll() lists all groups BY KEY                    
    var bottomDateAll = dateGroup.all()[0]; //the first group in the returned array
//    console.log("\n\n Filtered values \nDate group all: " + JSON.stringify(dateGroup.all()));
//    console.log("\nDate group top: " + JSON.stringify(topDate));
//    console.log("\nDate group bottom: " + JSON.stringify(bottomDate));
//    console.log("\nDate group bottom All: " + JSON.stringify(bottomDateAll)); //affected by filters?
//                    var timeBar = dc.barChart("#bar");
//                    timeBar
//                            .width(600)
//                            .height(200)
//                            .brushOn(false)
//                            .margins({top: 10, right: 50, bottom: 20, left: 50})
//                            .dimension(dateDim)
//                            .group(dateGroup)
//                            .transitionDuration(50)
//                            .x(d3.time.scale().domain([earliest, latest]))
//                            .elasticY(true)
//                            .yAxis().ticks(4);
////                    timeBar.render();




    var timeLine = dc.lineChart("#line");
    var timeLineWidth = 800;
    timeLine
            .width(timeLineWidth).height(550)
            .brushOn(false).renderArea(true).xyTipsOn(true)
            .margins({top: 50, right: 100, bottom: 50, left: 50})
            .dimension(dateDim)
            .group(wait_0_3_Group, '0-3 Months')
            .stack(wait_3_6_Group, '3-6 Months')
            .stack(wait_6_9_Group, '6-9 Months')
            .stack(wait_9_12_Group, '9-12 Months')
            .stack(wait_12_15_Group, '12-15 Months')
            .stack(wait_15_18_Group, '15-18 Months')
            .stack(wait_18Plus_Group, '18+ Months')
            .transitionDuration(750)
            .x(d3.scaleTime().domain([earliest, latest]))
            .elasticY(true)
            .yAxis().ticks(4)
            ;
//                    customise colours used on stacked areas
//TODO: use colorbrewer for safe colours
    timeLine.ordinalColors(['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b']);

    timeLine.title('0-3 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 0-3 months";
    });
    timeLine.title('3-6 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 3-6 months";
    });
    timeLine.title('6-9 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 6-9 months";
    });
    timeLine.title('9-12 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 9-12 months";
    });
    timeLine.title('12-15 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 12-15 months";
    });
    timeLine.title('15-18 Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 15-18 months";
    });
    timeLine.title('18+ Months', function (d) {
        return d.key.getDate() + "-"
                + (d.key.getMonth() + 1) + "-"
                + d.key.getFullYear()
                + "\n" + d.value + " patients waited 18+ months";
    });
//                    interactive legend for each stack
    timeLine.legend(dc.legend().x(705).y(60).itemHeight(25).gap(40).autoItemWidth(false));

//                    workaround to filter by legend click
    timeLine.on('renderlet', function (chart) {
        chart.selectAll('.dc-legend-item')
                .on('click', function (d) {

                    var nme = d.name.toString();
//                    console.log("Click on legend: " + nme);
                    waitDim.filter(nme);
                    dc.redrawAll();
                })
    });


//                    workaround for inverting the legend stack layers
    dc.override(timeLine, 'legendables', timeLine._legendables);

    dc.override(timeLine, 'legendables', function () {
        var legendables = this._legendables();
        if (!this.dashStyle()) {
            return legendables.reverse();
        }
        return legendables.map(function (l) {
            l.dashstyle = this.dashStyle();
            return l.reverse();
        });
    });

    select1
            .dimension(nameDim)
            .group(nameGroup)
//                            .multiple(true)
            .controlsUseVisibility(false)
            .promptText('All hospitals')
            .width(100);
    select2
            .dimension(specialityDim)
            .group(specialityGroup)
//                            .multiple(true)
            .controlsUseVisibility(false)
            .promptText('All treatment types')
            .width(100);

    select3
            .dimension(ageDim)
            .group(ageGroup)
//                            .multiple(true)
//                            .numberVisible(10)
            .controlsUseVisibility(false)
            .promptText('All age groups')
            .width(100);
//
//    dataTable
//            .width(768)
//            .height(480)
//            .dimension(yearDim)
//            .group(function (d) { //note this isn't a xFilter group!
//                return '<b>No of patients: ' + d.count + '</b>'; //+ ' | ' + d.year + ' | ' + d.age + ' years </b>';
//            })
//
//            .columns(['name', 'speciality',
//                {label: 'Month/Year',
//                    format: function (d) {
//                        return '' + (d.date.getMonth() + 1) + '/' + d.date.getFullYear();
//                    }
//                },
//
//                'wait'])
//            .sortBy(function (d) {
//                return d.count;
//            })
//            .order(d3.descending)
//            .size(Infinity)
//            ;
//    update();
//                dataTable.render();


//                    var timeComposite = dc.compositeChart("#composite");
//                    timeComposite
//                            .width(600)
//                            .height(200)
//                            .margins({top: 10, right: 50, bottom: 20, left: 50})
//                            .compose([
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('blue')
//                                        .group(wait_18Plus_Group, "0-3 months")
//                                        .dashStyle([5, 5]),
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('red')
//                                        .group(wait_15_18_Group, "3-6 months")
//                                        .dashStyle([2, 2]),
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('blue')
//                                        .group(wait_12_15_Group, "0-3 months")
//                                        .dashStyle([5, 5]),
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('red')
//                                        .group(wait_9_12_Group, "3-6 months")
//                                        .dashStyle([2, 2]),
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('blue')
//                                        .group(wait_6_9_Group, "0-3 months")
//                                        .dashStyle([5, 5]),
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('red')
//                                        .group(wait_3_6_Group, "3-6 months")
//                                        .dashStyle([2, 2]),
//                                dc.lineChart(timeComposite)
//                                        .dimension(dateDim)
//                                        .colors('blue')
//                                        .group(wait_0_3_Group, "0-3 months")
//                                        .dashStyle([5, 5])
//                            ])
//                            .transitionDuration(50)
//                            .x(d3.time.scale().domain([earliest, latest]))
//                            .elasticY(true)
//                            .yAxis().ticks(4);

//                    add all charts/ dc elements we want to co-interact to an array for ease
    var waitChartGroup;
    var waitCharts = [timeLine, select1, select2, select3];
    
//                    use underscore each to check all the interactive elements 
    _.each(waitCharts, function (waitChart) {
        dc.registerChart(waitChart, waitChartGroup); //add all charts to group
        waitChart.on("filtered", function (chart, filter) {
            if (chart === select1) {
                if (filter === null) {
                    d3.select('#hospital_text').text('all hospitals');

                } else {
                    d3.select('#hospital_text').text(filter);
                }
            } else if (chart === select2)
            {
                if (filter === null) {
                    d3.select('#specialism_text').text('all types of treatment');
                } else {
                    d3.select('#specialism_text').text(filter);
                }
            } else if (chart === select3)
            {
                if (filter === null) {
                    d3.select('#age_text').text('of all ages');

                } else {
                    d3.select('#age_text').text('aged ' + filter + ' years');
                }
            }

        });

    });
    
    dc.renderAll(waitChartGroup);

}



function makeCalendar() {
    var width = 960,
            height = 750,
            cellSize = 25; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;

    var day = d3.time.format("%w"), // day of the week
            day_of_month = d3.time.format("%e"), // day of the month
            day_of_year = d3.time.format("%j"),
            week = d3.time.format("%U"), // week number of the year
            month = d3.time.format("%m"), // month number
            year = d3.time.format("%Y"),
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");
//
    var color = d3.scale.quantize()
            .domain([-.05, .05])
            .range(d3.range(11).map(function (d) {
                return "q" + d + "-11";
            }));
//
    var svg = d3.select("#cal").selectAll("svg")
            .data(d3.range(2008, 2011))
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "RdYlGn")
            .append("g")
//
    var rect = svg.selectAll(".day")
            .data(function (d) {
                return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            })
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function (d) {
                var month_padding = 1.2 * cellSize * 7 * ((month(d) - 1) % (no_months_in_a_row));
                return day(d) * cellSize + month_padding;
            })
            .attr("y", function (d) {
                var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
                var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                return (week_diff * cellSize) + row_level * cellSize * 8 - cellSize / 2 - shift_up;
            })
            .datum(format);
//
    var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
            .data(function (d) {
                return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            })
            .enter().append("text")
            .text(monthTitle)
            .attr("x", function (d, i) {
                var month_padding = 1.2 * cellSize * 7 * ((month(d) - 1) % (no_months_in_a_row));
                return month_padding;
            })
            .attr("y", function (d, i) {
                var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
                var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                return (week_diff * cellSize) + row_level * cellSize * 8 - cellSize - shift_up;
            })
            .attr("class", "month-title")
            .attr("d", monthTitle);

    var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
            .data(function (d) {
                return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            })
            .enter().append("text")
            .text(yearTitle)
            .attr("x", function (d, i) {
                return width / 2 - 100;
            })
            .attr("y", function (d, i) {
                return cellSize * 5.5 - shift_up;
            })
            .attr("class", "year-title")
            .attr("d", yearTitle);


    //  Tooltip Object
    var tooltip = d3.select("body")
            .append("div").attr("id", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("a simple tooltip");


    d3.csv("dji.csv", function (error, csv) {
        var data = d3.nest()
                .key(function (d) {
                    return d.Date;
                })
                .rollup(function (d) {
                    return (d[0].Close - d[0].Open) / d[0].Open;
                })
                .map(csv);
        
        console.log("Data: "+JSON.stringify(data));

        rect.filter(function (d) {
            return d in data;
        })
                .attr("class", function (d) {
                    return "day " + color(data[d]);
                })
                .select("title")
                .text(function (d) {
                    return d + ": " + percent(data[d]);
                });

        //  Tooltip
        rect.on("mouseover", mouseover);
        rect.on("mouseout", mouseout);
        function mouseover(d) {
            tooltip.style("visibility", "visible");
            var percent_data = (data[d] !== undefined) ? percent(data[d]) : percent(0);
            var purchase_text = d + ": " + percent_data;

            tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
            tooltip.html(purchase_text)
                    .style("left", (d3.event.pageX) + 30 + "px")
                    .style("top", (d3.event.pageY) + "px");
        }
        function mouseout(d) {
            tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            var $tooltip = $("#tooltip");
            $tooltip.empty();
        }

    });
//
    function dayTitle(t0) {
        return t0.toString().split(" ")[2];
    }
    function monthTitle(t0) {
        return t0.toLocaleString("en-us", {month: "long"});
    }
    function yearTitle(t0) {
        return t0.toString().split(" ")[3];
    }
}



// use odd page size to show the effect better
//var ofs = 0, pag = 17;
//function display() {
//    d3.select('#begin')
//            .text(ofs);
//    d3.select('#end')
//            .text(ofs + pag - 1);
//    d3.select('#last')
//            .attr('disabled', ofs - pag < 0 ? 'true' : null);
//    d3.select('#next')
//            .attr('disabled', ofs + pag >= waitListXF.size() ? 'true' : null);
//    d3.select('#size').text(waitListXF.size());
//}
//function update() {
//    dataTable.beginSlice(ofs);
//    dataTable.endSlice(ofs + pag);
//    display();
//}
//function next() {
//    ofs += pag;
//    update();
//    dataTable.redraw();
//}
//function last() {
//    ofs -= pag;
//    update();
//    dataTable.redraw();
//}



//                    opWaitData.forEach(function (d) {
////                        d.hospital = "hospitals";
////                    console.log("Coord: " + result);
////                        allHospitalData = allHospitalData.concat(d); //need to concat to add each new array element
//                    });
//                    console.log("# records for OP wait data" + allHospitalData.length + "\n");


//                var chart = dc.barChart("#test");
//                d3.csv("morley.csv").then(function (experiments) {
//
//                    experiments.forEach(function (x) {
//                        x.Speed = +x.Speed;
//                    });
//
//                    var ndx = crossfilter(experiments),
//                            runDimension = ndx.dimension(function (d) {
//                                return +d.Run;
//                            }),
//                            speedSumGroup = runDimension.group().reduce(function (p, v) {
//                        p[v.Expt] = (p[v.Expt] || 0) + v.Speed;
//                        return p;
//                    }, function (p, v) {
//                        p[v.Expt] = (p[v.Expt] || 0) - v.Speed;
//                        return p;
//                    }, function () {
//                        return {};
//                    });
//
//                    function sel_stack(i) {
//                        return function (d) {
//                            return d.value[i];
//                        };
//                    }
//
//                    chart
//                            .width(768)
//                            .height(480)
//                            .x(d3.scaleLinear().domain([1, 21]))
//                            .margins({left: 80, top: 20, right: 10, bottom: 20})
//                            .brushOn(false)
//                            .clipPadding(10)
//                            .title(function (d) {
//                                return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
//                            })
//                            .dimension(runDimension)
//                            .group(speedSumGroup, "1", sel_stack('1'))
//                            .renderLabel(true);
//
//                    chart.legend(dc.legend());
//
//                    dc.override(chart, 'legendables', function () {
//                        var items = chart._legendables();
//                        return items.reverse();
//                    });
//
//                    for (var i = 2; i < 6; ++i)
//                        chart.stack(speedSumGroup, '' + i, sel_stack(i));
//                    chart.render();
//
//                });


