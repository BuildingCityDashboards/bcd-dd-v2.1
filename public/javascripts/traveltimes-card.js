d3.json("/data/Transport/traveltimes.json").then(function (data) {
    processTravelTimes(data);
});


function processTravelTimes(data_) {
    //console.log("travel times data : " + JSON.stringify(data_));
    //console.log("\n " + JSON.stringify(d3.keys(data_)));
    let roadDelays = [];
    d3.keys(data_).forEach(
            //for each key
                    function (d) {

                        //console.debug(JSON.stringify(d));
                        //for each data array
                        data_[d].data.forEach(function (d_) {
                            d.type = "road";
                            if (d_["current_travel_time"] > (d_["free_flow_travel_time"] * 1.1))
                            {
                                
                                data_[d].data.delay = +(d_["current_travel_time"] - d_["free_flow_travel_time"]);
                                console.debug("delay: "+data_[d].data.delay);
//                                console.debug("Delay on road from " + d_["from_name"] + " to " + d_["to_name"]
//                                        + " is about " + d_["distance"] / 1000 + " km)"
//                                    + "\nFree flow " + d_["free_flow_travel_time"] + " seconds"
//                                    + "\nCurrent time " + d_["current_travel_time"] + " seconds"
//                                        );


//                            console.debug("From " + d_["from_name"] + " to " + d_["to_name"]
//                                    + " (" + d_["distance"] / 1000 + " km)"
//                                    + "\nFree flow " + d_["free_flow_travel_time"] + " seconds"
//                                    + "\nCurrent time " + d_["current_travel_time"] + " seconds"
//                                    );
                            }
                        });
                    }
            );

            console.debug("Max delay is " + JSON.stringify(data_)); //d3.max(data_.delay)+ " seconds");
        }
;

//    let bikeNode = d3.select("#rt-bikes").node();
//    let bikeWidth = bikeNode.getBoundingClientRect().width;
//    // dimensions margins, width and height
//    const m = [20, 10, 25, 10],
//            w = bikeWidth - m[1] - m[3],
//            h = 120 - m[0] - m[2];
//
//   let bikeSVG = d3.select("#rt-bikes")
//            .attr("width", w + m[1] + m[3])
//            .attr("height", h + m[0] + m[2])
//            .attr("transform", "translate(" + m[3] + "," + "10" + ")")
//;
//    bikeSVG.append("text")
//        .attr("dx", 0)
//        .attr("dy", 55)
////        .attr("class", "label")
//        .attr("fill", "#ffffffff")//#f8f9fabd")
//        .html("<b>"+availableBikes+"</b> bikes are available"
//        +"<br>"
//        +"<b>"+availableStands+"</b> stands are available");
////

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
