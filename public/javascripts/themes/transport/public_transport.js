//            The health data exists in seperate files for hospitals, GP 
//            surgeries etc. We could create an array of data objects for each, 
//            and add each to the map as a layer, with a layer control.
//            We're going to take the approach of loading all data into d3 and
//            filtering it as needed- this adds more potential for comparisons 
//            across various charts and visualisation elements, as they are all 
//            'connected'.

console.log("Creating map");

var bikeTime = d3.timeFormat("%a %B %d, %Y, %H:%M");

//  1. declare map variables and initialise base map
var map = new L.Map('chart-public-transport');
var plotlist;
var plotlayers = [];
var dubLat = 53.3498;
var dubLng = -6.2603;
var min_zoom = 8, max_zoom = 18;
var zoom = 10;
// tile layer with correct attribution
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
var osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
var stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
var stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
var stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
var osm = new L.TileLayer(stamenTonerUrl, {minZoom: min_zoom, maxZoom: max_zoom, attribution: stamenTonerAttrib});
map.setView(new L.LatLng(dubLat, dubLng), zoom);
map.addLayer(osm);


var bikeCluster = L.markerClusterGroup();
var busCluster = L.markerClusterGroup();
//var iconAX = 15;  //icon Anchor X
//var iconAY = 15; //icon Anchor Y
//            Custom map icons
//var hospitalIcon = L.icon({
//    iconUrl: 'img/Hospital.png',
//    iconSize: [30, 30],
//    iconAnchor: [iconAX, iconAY],
//    popupAnchor: [-3, -76]
//});

d3.json("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=7189fcb899283cf1b42a97fc627eb7682ae8ff7d").then(function(data) {
  //console.log(data[0]);
  processBikes(data);
});

d3.json("/data/Travel/busstopinformation_bac.json").then(function(data) {
  console.log(data.results[0]);
  processBusStops(data.results); //TODO: bottleneck?
});

function processBikes(data_) {

    console.log("Bike data \n");
    data_.forEach(function (d) {
        d.lat = +d.position.lat;
        d.lng = +d.position.lng;
        //add a property to act as key for filtering
        d.type = "Dublin Bike Station";
   
    });
    console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
    
    console.log("# of bike stations is " + data_.length + "\n"); // +
    updateMapBikes(data_);
//        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
};

function processBusStops(res_) {

    console.log("Bus data \n");
    res_.forEach(function (d) {
        d.lat = +d.latitude;
        d.lng = +d.longitude;
        //add a property to act as key for filtering
        d.type = "Dublin Bus Stop";
   
    });
    console.log("Bus Stop: \n" + JSON.stringify(res_[0]));
    
    console.log("# of bus stops is " + res_.length + "\n"); // +
    updateMapBuses(res_);
//        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
};


function updateMapBikes(data__) {
    bikeCluster.clearLayers();
    map.removeLayer(bikeCluster);
    _.each(data__, function (d, i) {
    
        bikeCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng))//, {icon: getIcon(d.type)})
                .bindPopup(getBikeContent(d)));
    });
    //finally add layer to map
    map.addLayer(bikeCluster);
}

function updateMapBuses(data__) {
    busCluster.clearLayers();
    map.removeLayer(busCluster);
    _.each(data__, function (d, i) {
        busCluster.addLayer(L.marker(new L.LatLng(d.lat, d.lng))//, {icon: getIcon(d.type)})
                .bindPopup(getBusContent(d)));
    });
    //finally add layer to map
    map.addLayer(busCluster);
}
    
function getBikeContent(d_) {
    var str = '';
    if (d_.name) {
        str += d_.name + '<br>';
    }
    if (d_.type) {
        str += d_.type + '<br>';
    } 
    if (d_.address && d_.address!==d_.name) {
        str += d_.address + '<br>';
    }
    if (d_.available_bike_stands) {
        str += d_.available_bike_stands + ' stands are available<br>';
    } 
    if (d_.available_bikes) {
        str += d_.available_bikes + ' bikes are available<br>';
    } 
    if (d_.last_update) {
        str += 'Last updated ' + bikeTime(new Date(d_.last_update)) + '<br>';
    }
    return str;
}

function getBusContent(d_) {
    var str = '';
    if (d_.fullname) {
        str += d_.fullname + '<br>';
    }
    if (d_.stopid) {
        str += 'Stop '+d_.stopid + '<br>';
    } 
    if (d_.operators[0].routes) {
        str += 'Routes: ';
        d_.operators[0].routes.forEach(function(i){
           str += i; 
           str += ' ';
        });
        + '<br>';        
    }
    
    return str;    
        
    }
    //    /*****************************/
//
////                3. Create subsets of data as necessary using d3
//    //Create a Crossfilter instance
//    var xRecords = crossfilter(allHealthCenters);
//    console.log("crossfilter count: " + xRecords.size());
////               Define Dimensions
//    var typeDim = xRecords.dimension(function (d) {
////                    console.log("hospitals d:" + JSON.stringify(d.type));
//        return d.type;
//    });
//
//    var allDim = xRecords.dimension(function (d) {
//        return d;
//    });
//
//    var typeGroup = typeDim.group(); // an array containing a key ('Hospital', 
//    //'GP' etc. and value (no. of occurances) e.g '8', '638'
//    var allGroup = allDim.groupAll();
//
//    typeCount.dimension(xRecords)
//            .group(allGroup);
//
//    typePie.width(500)
//            .height(300)
//            .slicesCap(5)
//            .innerRadius(25)
//            .dimension(typeDim)
//            .group(typeGroup)
//            .legend(dc.legend())
//            .transitionDuration(750)
//            // workaround for #703: not enough data is accessible through .label() to display percentages
//            .on('pretransition', function (chart) {
//                chart.selectAll('text.pie-slice').text(function (d) {
//                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
//                })
//            });
//
//
////    var dcCharts = [typePie]; //the charts upon which we want to detect application of filters
//
////Update the map if any dc chart gets filtered. Filters apply across the crossfilter (duh)
////    _.each(dcCharts, function (dcChart) {
////        dcChart.on("filtered", function (chart, filter) {
////            updateMap();
////            if(filter!==null){
////            d3.select('#type-filter-text').html("<br>"+filter);
////        }
////        else{
////            d3.select('#type-filter-text').html("");
////        }
////        });
////    });
//    dc.renderAll();
//    updateMap();
//
//
////                4. Load map data

//
//    function getIcon(t) {
//        if (t === "hospitals") {
//            return hospitalIcon;
//        } else if (t === "general practitioners") {
//            return gpIcon;
//        } else if (t === "dentists") {
//            return dentistIcon;
//        } else if (t === "pharmacies") {
//            return pharmacyIcon;
//        } else {
//            return healthCenterIcon;
//        }
//    }
//
//    //Button helper functions
//    d3.select('#hospital_button').on('click', function () {
//        typeDim.filter("hospitals");
//        typePie.filter(null)
//                .filter("hospitals");
//        d3.select('#chosen-type-text').text("Available datasets for hospitals:"); //TODO: hacky- fix using filter and dim
//        dc.redrawAll();
//        updateMap();
//    });
//

//    d3.select('#all_button').on('click', function () {
//        d3.select('#chosen-type-text').text("Choose a health location type to see available datasets.");
//        d3.select('#type-filter-text').text('');
//        dc.filterAll();
//        dc.redrawAll();
//        updateMap();
//    });
//
//
//}//End of processInputs()
//
//

