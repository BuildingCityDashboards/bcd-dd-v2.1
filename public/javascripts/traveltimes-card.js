d3.json("/data/Transport/traveltimes.json").then(function (data) {
    processTravelTimes(data);
});


function processTravelTimes(data_) {
    let maxDelayed = null;
    let maxDelay = 0;
    d3.keys(data_).forEach(
            //for each key
                    function (d) {
//                        console.log("d = "+JSON.stringify(d));
                        //for each data array element

                        data_[d].data.forEach(function (d_) {
                            if (d_["current_travel_time"] > (d_["free_flow_travel_time"] * 1.25))
                            {
                                let delay = +(d_["current_travel_time"] - d_["free_flow_travel_time"]);
                                if (delay > maxDelay) {
                                    d_.name = d;
                                    d_.delay = delay;
                                    maxDelayed = d_;
                                }
                            }
                        });
                    }
            );
            updateDisplay(maxDelayed);
//            console.log("Longest delay " + maxDelayed.delay + " O: " + JSON.stringify(maxDelayed));
        }
;



function updateDisplay(d__) {
    if (d__) {
        let name = d__.name.split('_')[0];
        let direction = d__.name.split('_')[1].split('B')[0];
        let info = "Longest current delay- travelling on the "
                + "<b>" + name + "</b> " + direction
                + " from <b>" + d__["from_name"] + "</b> to <b>" + d__["to_name"] + "</b>"
                + " is taking <b>" + d__.delay + " seconds</b> longer than with free-flowing traffic";
        updateInfo("#traveltimes-chart a", info);

        let travelTimesNode = d3.select("#rt-travelTimes").node();
        let travelTimesWidth = travelTimesNode.getBoundingClientRect().width;
        //console.log("travelTimesHeight: " + travelTimesWidth);
// dimensions margins, width and height
        const m = [20, 10, 25, 10],
                w = travelTimesWidth,
                h = 120 - m[0] - m[2]; //
//
        let svg = d3.select("#rt-travelTimes")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
//                .attr("transform", "translate(" + m[3] + "," + "0" + ")");
                ;
     
        
        //car icon
        svg.append('svg:image')
                .attr("xlink:href", "/images/transport/car-w-15.svg")
                .attr('x', w/2-h/2)
                .attr('y', 0)
                .attr("width", h)
                .attr("height", h);
        
        //guide
//        svg.append("rect")
//                .attr("width", w)
//                .attr("height", h)
//                .attr("x", h)
//                .attr("y", 0)
//                .attr("fill", "#555555")
//        ;

        svg.append('text')
                .attr('x', m[3])
                .attr('y', 36)
//                .attr("width", w)
//                .attr("height", h)
                .attr("font-size", 48)
                //.attr("class", "label employment")
                .attr('fill', "#16c1f3")
                .text(name);
//        
           svg.append('text')
                .attr('x', m[3])
                .attr('y', 2*36)
//                .attr("width", w)
//                .attr("height", h)
                .attr("font-size", 24)
                //.attr("class", "label employment")
                .attr('fill', "#16c1f3")
                .text(direction);
//        
////        
        svg.append('text')
                .attr('x', w/2+h/2+2*m[3])
                .attr('y', 36)
                .attr("font-size", 48)
                //.attr("class", "label employment")
                .attr('fill', "#16c1f3")
                .text("+"+d__.delay);
        
        svg.append('text')
                .attr('x', w/2+h/2+4*m[3])
                .attr('y', 2*36)
                .attr("font-size", 24)
                //.attr("class", "label employment")
                .attr('fill', "#16c1f3")
                .text("seconds");


    } else {
        updateInfo("#traveltimes-chart a", "Current travel times are close to free-flow times on all motorways");

    }

}

function updateInfo(selector, infoText) {
    let indicatorSymbol = "▲ ",
            indicatorColour = "#da1e4d";

    let text = d3.select("#data-text p"),
            textString = text.text();
    ;

    d3.select(selector)
            .on("mouseover", (d) => {
                text.html(infoText);
//                text.append("span").text(indicatorSymbol).style("color", indicatorColour);
            })
            .on("mouseout", (d) => {
                text.text(textString);
            });

//        d3.select(selector).on("blur", (d) => {
//            text.text(textString);
//        });

//        d3.select(selector).on("focus", (d) => {
//            text.text(startString);
//            text.append("span").text(lastElementDate).attr("class", "bold-text");
//
//            text.append("text").text(" was ");
//            
//            text.append("span").text(format(currentValue))
//            .attr("class", "bold-text");
//            
//            text.append("text").text(". That's ");
//
//            text.append("span").text(indicator + " " + d3.format(".2%")(difference)).attr("class", "bold-text").style("color",indicatorColour);
//
//            text.append("text").text(" " + endString);
//        });
    // d3.select(selector).on("touchstart", (d) => {
    //     text.text(textString);
    // })
}

//

;
//let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
//function getBikeContent(d_) {
//    let str = '';
//    if (d_.name) {
//        str += d_.name + '<br>';
//    }
//    if (d_.type) {
//        str += d_.type + '<br>';
//    }
////    if (d_.address && d_.address !== d_.name) {
////        str += d_.address + '<br>';
////    }
//    if (d_.available_bikes) {
//        str += '<br><b>' + d_.available_bikes + '</b>' + ' bikes are available<br>';
//    }
//    if (d_.available_bike_stands) {
//        str += '<b>' + d_.available_bike_stands + '</b>' + ' stands are available<br>';
//    }
//
//    if (d_.last_update) {
//        str += '<br>Last updated ' + bikeTime(new Date(d_.last_update)) + '<br>';
//    }
//    return str;
//}
