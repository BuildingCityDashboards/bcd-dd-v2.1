d3.json("/data/Transport/bikesData.json").then(function (data) {
//    console.lodata[0]);
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
//    console.log("Bike data : "+availableBikes+" "+availableStands);
    updateBikesDisplay(availableBikes, availableStands);
}
    
function updateBikesDisplay(ab, as){
        d3.select("#rt-bikes").select("#card-left")
                .html('<h3>' +ab +'</h3>'
                        + '<p>bikes</p>');

        d3.select("#rt-bikes").select("#card-center")
                .html('<img src = "/images/transport/bicycle-w-15.svg" width="60">');


        d3.select("#rt-bikes").select("#card-right")
                .html('<h3>' +as +'</h3>'
                        + '<p> stands </p>');

       updateInfo("#bikes-chart a", "<b>Dublin Bikes</b> currently have <b>"+ab+" bikes </b> and <b>"+as+" stands </b> available across the city");

}

function updateInfo(selector, infoText) {

    let text = d3.select("#data-text p"),
            textString = text.text();
    ;

    d3.select(selector)
            .on("mouseover", (d) => {
                text.html(infoText);
            })
            .on("mouseout", (d) => {
                text.text(textString);
            });
}
//
//
//;
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
