d3.json("/data/Transport/bikesData.xml").then(function (data) {
    //console.log(data[0]);
    processBikes(data);
});

function processBikes(data_) {
  let availableBikes = 0, availableStands = 0;
    //console.log("Bike data \n");
    data_.forEach(function (d) {
        d.lat = +d.position.lat;
        d.lng = +d.position.lng;
        //add a property to act as key for filtering
        if (d.available_bikes) {
            availableBikes += d.available_bikes;
        }
        if (d.available_bike_stands) {
            availableStands += d.available_bike_stands;
        }
    });
//    d3.select('#bike-card-bikes-count').html(availableBikes);
//    d3.select('#bike-card-stands-count').html(availableStands);
//let bikeDisplayHTML = 
//           "<b>" + bikeTime(forecasts[0].date) + "</b><br>"
//            + "<h2>" + forecasts[0].temperature + " C</h2>"
//            + "<strong>Precipitation</strong> : " + precip + " mm <br>"
//            + "<strong>Wind: Speed</strong> : " + windSpeed + " mps" + "\t Beaufort Scale: " + windB + "<br>"
//            + "<strong>Wind Direction</strong> : " + windD + "<br>"
//            + "<strong>Pressure</strong> : " + press + " hPa"
;


    let bikeNode = d3.select("#rt-bikes").node();
    let bikeWidth = bikeNode.getBoundingClientRect().width;
    // dimensions margins, width and height
    const m = [20, 10, 25, 10],
            w = bikeWidth - m[1] - m[3],
            h = 120 - m[0] - m[2];

   let bikeSVG = d3.select("#rt-bikes")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .attr("transform", "translate(" + m[3] + "," + "10" + ")")
;
    bikeSVG.append("text")
        .attr("dx", 0)
        .attr("dy", 55)
//        .attr("class", "label")
        .attr("fill", "#ffffffff")//#f8f9fabd")
        .html("<b>"+availableBikes+"</b> bikes are available"
        +"<br>"
        +"<b>"+availableStands+"</b> stands are available");
//
}
;
let bikeTime = d3.timeFormat("%a %B %d, %H:%M");
function getBikeContent(d_) {
    let str = '';
    if (d_.name) {
        str += d_.name + '<br>';
    }
    if (d_.type) {
        str += d_.type + '<br>';
    }
//    if (d_.address && d_.address !== d_.name) {
//        str += d_.address + '<br>';
//    }
    if (d_.available_bikes) {
        str += '<br><b>' + d_.available_bikes + '</b>' + ' bikes are available<br>';
    }
    if (d_.available_bike_stands) {
        str += '<b>' + d_.available_bike_stands + '</b>' + ' stands are available<br>';
    }

    if (d_.last_update) {
        str += '<br>Last updated ' + bikeTime(new Date(d_.last_update)) + '<br>';
    }
    return str;
}
