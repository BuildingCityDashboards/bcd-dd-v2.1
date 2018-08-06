
/* Map variables and instantiation */

//var map = new L.Map('map');
//var dubLat = 53.3498;
//var dubLng = -6.2603;

var map_APIToken = "pk.eyJ1IjoibGlhbW9zdWxsaXZhbiIsImEiOiJjajNkYjhyZnAwMDAyMzNsN2FyZnY3cWQzIn0.c1qL12vFZfc2weViolmnTw";
var dub_lng = -8.80;
var dub_lat = 51.75;
var corkX, corkY;
var corkCityURL = '/data/tools/planning/json/PlanningApplications_CorkCity_';
var corkCountyURL = '/data/tools/planning/json/PlanningApplications_CorkCounty_';
var corkCountyURL_1 = '/data/tools/planning/json/PlanningApplications_CorkCounty_1.geojson';
var min_zoom = 9, max_zoom = 18;
var zoom = min_zoom;
var map_url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png' + "?access_token=" + map_APIToken;
var map = L.map('map-div').setView([dub_lat, dub_lng], zoom);
//console.log("drawing map");
var mapHeight = 600;
var chartHeight = (mapHeight / 3);
/* Parse GeoJSON */
var jsonFeaturesArr = []; //all the things!
var allDim;
//We'd like to use d3's simple json loader with queue, but it doesn't play well with geojson...
//queue()
//        .defer(d3.json, "../data/corkCity_20.json")
//        .await(makeGraphs);

//... so we'll use the more powerful Promise pattern
loadJsonFile(corkCityURL, 0, 2);
////////////////////////////////////////////////////////////////////////////

//Uses Promises to get all json data based on url and file count (i.e only 2000 records per file),
//Adds to Leaflet layers to referenced map and clusters
function loadJsonFile(JSONsrc_, fileOffset_, fileCount_) { //, clusterName_, map_) {

    var promises = []; //this will hold an array of promises
//             ***TODO: serach dir for # of files and for-each

    for (i = fileOffset_; i < fileCount_; i++) {
        promises.push(getData(i));
    }

    function getData(id) {
        var url = JSONsrc_ + id + '.geojson';
//        var url ="../data/PlanningApplications_CorkCity_0.geojson";
        return $.getJSON(url); // this returns a "promise"
    }


//    var countByDateArr; //will store number of planning apps per date

    $.when.apply($, promises).done(function () {
        // This callback will be called with multiple arguments,
        // one for each promises call
        // Each argument is an array with the following structure: [data, statusText, jqXHR]

        for (var i = 0, len = arguments.length; i < len; i++) {
            //  arguments[i][0] is a single object with all the file JSON data
            var arg = arguments[i][0];
//                        jsonFeaturesArr = jsonFeaturesArr.concat(arg);
            jsonFeaturesArr = jsonFeaturesArr.concat(arg.features); //  make a 1-D array of all the features
//                        console.log("featsArr has length:  " + jsonFeaturesArr.length);
//            console.log("***Argument " + JSON.stringify(arguments[i][0]) + "\n****************");
        }
//                    console.log(".done() - jsonData has length " + jsonFeaturesArr.length);
//                    console.log("JSON Data Array " + JSON.stringify(jsonFeaturesArr));

//        console.log("Features length: " + jsonFeaturesArr.length); //features from one loadJSONFile call, multiple files
//                    console.log("Features loaded: "+JSON.stringify(jsonFeaturesArr));

        makeGraphs(null, jsonFeaturesArr);
    }); //end of when()
} //end of loadJSONFIle




//////////////////////////////////////////////////////////////////////////////
function makeGraphs(error, recordsJson) {



//       console.log("json: "+JSON.stringify(recordsJson.features));

//Clean features data
//for plain JSON, access e.g. .properties.ReceivedDate
//for geoJSON, access e.g. .features.ReceivedDate  
    var records = recordsJson;
    //	var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
    var i = 0;
    records.forEach(function (d) {
        //		d["timestamp"] = dateFormat.parse(d["timestamp"]);
        //		d["timestamp"].setMinutes(0);
        //		d["timestamp"].setSeconds(0);
//                    		d["x"] = +d["x"];
//                    d.properties.ReceivedDate.setMinutes(0);
//                    d.properties.ReceivedDate.setSeconds(0);
//d.properties.PlanningAuthority
//d.properties.Decision
//d.properties.DecisionDate
        d.geometry.x = +d.geometry.x;
        d.geometry.y = +d.geometry.y;
//                    console.log("x:" + d.geometry.x);
//                    console.log("y:" + d.geometry.y);
//                      d["y"] = +d["y"];

        i += 1;
    });
    console.log("record count: " + i);
    //Create a Crossfilter instance
    var xRecords = crossfilter(records);
    console.log("crossfilter count: " + xRecords.size());
//               Define Dimensions
    var authorityDim = xRecords.dimension(function (d) {
        return d.properties.PlanningAuthority;
    });
    var rDateDim = xRecords.dimension(function (d) {
        return d.properties.ReceivedDate;
    });
    var dDateDim = xRecords.dimension(function (d) {
        return d.properties.DecisionDate;
    });
    var decisionDim = xRecords.dimension(function (d) {
        return d.properties.Decision;
    });
    var locationDim = xRecords.dimension(function (d) {
        return d.geometry;
    });
    allDim = xRecords.dimension(function (d) {
        return d;
    });
    //Group Data
    var recordsByAuthority = authorityDim.group();
    var recordsByRDate = rDateDim.group();
    var recordsByDDate = dDateDim.group();
    var recordsByDecision = decisionDim.group();
    var recordsByLocation = locationDim.group();
    var all = xRecords.groupAll();
    //Values to be used in charts
    var minDate = rDateDim.bottom(1); //returns the whole record with earliest date
    var maxDate = rDateDim.top(1);
    console.log("min: " + JSON.stringify(minDate[0].properties.ReceivedDate)
            + " | max: " + JSON.stringify(maxDate[0].properties.ReceivedDate));
    //Charts
    var numberRecordsND = dc.numberDisplay("#number-records-nd");
    var timeChart = dc.barChart("#time-chart");
    var decisionChart = dc.rowChart("#decision-row-chart");
//    var processingTimeChart = dc.rowChart("#processing-row-chart");
//    var locationChart = dc.rowChart("#location-row-chart");
    numberRecordsND
            .formatNumber(d3.format("d"))
            .valueAccessor(function (d) {
                return d;
            })
            .group(all);
    
//    timeChart
//            .width(600)
//            .height(chartHeight)
//            .brushOn(true)
//            .margins({top: 10, right: 50, bottom: 20, left: 20})
//            .dimension(rDateDim)
//            .group(recordsByRDate)
//            .transitionDuration(500)
//            .x(d3.time.scale().domain([minDate[0].properties.ReceivedDate, maxDate[0].properties.ReceivedDate]))
//            .elasticY(true)
//            .yAxis().ticks(4);
    decisionChart
            .width(600)
            .height(chartHeight)
            .dimension(decisionDim)
            .group(recordsByDecision)
//                        .ordering(function (d) {
//                            return -d.value;
//                        })
            .colors(['#6baed6'])
            .elasticX(true)
            .xAxis().ticks(4)
            ;
    makeMap();
//    dcCharts = [timeChart, decisionChart];
////Update the map if any dc chart get filtered
//    _.each(dcCharts, function (dcChart) {
//        dcChart.on("filtered", function (chart, filter) {
//            makeMap();
////            console.log("chart filtered");
//        });
//    });
//    dc.renderAll();

}
;
var cityClusters = L.markerClusterGroup();
var streetMap = L.tileLayer(map_url,
        {
            id: 'mapbox.streets',
            attribution: 'Tiles by <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
            maxZoom: max_zoom,
            minZoom: min_zoom
        }).addTo(map);

function makeMap() {
    cityClusters.clearLayers();
    map.removeLayer(cityClusters);
//    var baseMaps = {
//        "Streets": streetMap
//    }, planningMaps;

//                              map.clearLayers();

//                            _.each(allDim.top(Infinity), function (d) {
////                                var loc = d.brewery.location;
////                                var name = d.brewery.brewery_name;
////                                var marker = L.marker([loc.lat, loc.lng]);
////                                marker.bindPopup("<p>" + name + " " + loc.brewery_city + " " + loc.brewery_state + "</p>");
//                                breweryMarkers.addLayer(marker);
//                            });
//                            map.addLayer(breweryMarkers);


    _.each(allDim.top(Infinity), function (d) {
        var marker = new L.Marker(new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
        marker.bindPopup(getContent(d));
        cityClusters.addLayer(marker);
//       markers.push([d.geometry.coordinates[0], d.geometry.coordinates[1], "test"]);
//        map.addLayer(new L.Marker(new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]), "test"));
//        console.log("d.geo:"+JSON.stringify(allDim));
//console.log("d:"+JSON.stringify(d.properties.DevelopmentAddress));

    });
    map.addLayer(cityClusters);
    //console.log("Make Map:"+JSON.stringify(geoData[0]));

//    var heat = L.heatLayer(geoData,{
//			radius: 10,
//			blur: 20, 
//			maxZoom: 1
//		}).addTo(map);

//    var mapData = L.geoJson(jsonFeaturesArr, {
//        onEachFeature: function (feature, layer) {
//            layer.bindPopup(getContent());

//       map.addLayer(mapLayer);
//    cityClusters.addLayer(mapData);
//    map.addLayer(cityClusters);
//        makeGraphs(null, jsonFeaturesArr);


//        clusterName_.addLayer(mapData);
//        map_.addLayer(clusterName_);
////                    map_.fitBounds(mapData.getBounds());


//    makeGraphs(null, jsonFeaturesArr);
//    console.log("jsonFeaturesArr length: " + jsonFeaturesArr.length);
}

function getContent(d_) {
    var str = '';
    if (d_.properties.PlanningAuthority) {
        str += '<h3>' + d_.properties.PlanningAuthority + '</h3><br>';
    }
    if (d_.properties.ApplicationNumber) {
        str += '<p> #' + d_.properties.ApplicationNumber + '</p><br>';
    }
    if (d_.properties.DevelopmentAddress) {
        str += '<p>' + d_.properties.DevelopmentAddress + '</p><br>';
    }
    if (d_.properties.ReceivedDate) {
        str += '<strong>Application date</strong>: ' + new Date(d_.properties.ReceivedDate) + '<br>';
    }
    if (d_.properties.Decision) {
        str += '<strong>Decision</strong>: ' + d_.properties.Decision + '<br>';
    }
    if (d_.properties.DecisionDate) {
        str += '<strong>Decision date</strong>: ' + new Date(d_.properties.DecisionDate);
    }
    ;
    return str;
}
;
