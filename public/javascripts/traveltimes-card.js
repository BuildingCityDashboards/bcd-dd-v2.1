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
//            console.log("ind " + JSON.stringify(indicatorUpSymbol.style));
        }
;
let indicatorUpSymbol = "▲",
            indicatorUpColor = "#da1e4d"; /*TODO: color symbol with style*/

function updateDisplay(d__) {
    
 
    if (d__) {
        let name = d__.name.split('_')[0];
        let direction = d__.name.split('_')[1].split('B')[0];
        let info = "Longest current delay- travelling on the "
                + "<b>" + name + "</b> " + direction
                + " from <b>" + d__["from_name"] + "</b> to <b>" + d__["to_name"] + "</b>"
                + " is taking <b>" + d__.delay + " seconds</b> longer than with free-flowing traffic";
        updateInfo("#traveltimes-chart a", info);

        d3.select("#rt-travelTimes").select("#card-left")
                .html('<h3>' + name + '</h3>'
                        + '<p>' + direction + '</p>');

        d3.select("#rt-travelTimes").select("#card-center")
                .html('<img src = "/images/transport/car-w-15.svg" width="60">');


        d3.select("#rt-travelTimes").select("#card-right")
                .html('<h3> ' + indicatorUpSymbol +' '
                        + d__.delay + '</h3>'
                        + '<p>seconds</p>');


    } else {
        updateInfo("#traveltimes-chart a", "Current travel times are close to free-flow times on all motorways");
    }
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

