/*
 * 
 * TODO: import SA_DublinCity_i geojsons instead of lagre generalised file
 * 
 */

var authorityNames = []; //names of authoirites as strings
var decisionCategories = []; //types of decisions as strings
//var regex = /GRANT/;
var minChartDate, maxChartDate;
var now = Date.now();
/* Map variables and instantiation */
//Proj4js.defs["EPSG:29902"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
//Proj4js.defs["EPSG:29903"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29903", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

var dub_lng = -6.2603;
var dub_lat = 53.36;
var dublinX, dublinY;
var min_zoom = 10, max_zoom = 16;
var zoom = min_zoom;
// tile layer with correct attribution
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
var osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
var stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
var stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
var stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

var map = new L.Map('planning-map');
var osm = new L.TileLayer(stamenTonerUrl_Lite, {minZoom: min_zoom, maxZoom: max_zoom, attribution: stamenTonerAttrib});
map.setView(new L.LatLng(dub_lat, dub_lng), zoom);
map.addLayer(osm);

//console.log("drawing map");
//var mapHeight = 600;
var chartHeight = 200;
/* Parse GeoJSON */
var jsonFeaturesArr = []; //all the things!
var allDim;
//We'd like to use d3's simple json loader with queue, but it doesn't play well with geojson...
//queue()
//        .defer(d3.json, "../data/corkCity_20.json")
//        .await(makeGraphs);

//... so we'll use the more powerful Promise pattern
//loadJsonFiles(baseurl, startOffset, no of files

//data loading
var dublinDataURI = '/data/tools/planning/json/Dublin_all_Planning_Test_';
var dublinSAURI = '/data/tools/small_areas/';
let smallAreaBoundaries = 'Small_Areas__Generalised_20m__OSi_National_Boundaries.geojson';
let countyAdminBoundaries = 'Administrative_Counties_Generalised_20m__OSi_National_Administrative_Boundaries_.geojson';



loadJsonFiles(dublinDataURI, 9, 15); //0-38 inclusive
createSAMap(dublinSAURI + 'Small_Areas__Generalised_20m__OSi_National_Boundaries.geojson');
//

////////////////////////////////////////////////////////////////////////////
//[]; //this will hold an array of promises
//             ***TODO: serach dir for # of files and for-each

//    for (i = fileOffset_; i < fileCount_; i++) {
//        promise.push(getData(i));
//    }

//    function getData(id) {
//        var url = JSONsrc_ + id + '.geojson';
////        var url ="../data/PlanningApplications_CorkCity_0.geojson";
//        return $.getJSON(url); // this returns a "promise"
//    }


//    var countByDateArr; //will store number of planning apps per date

let smallAreasURL = 

d3.csv("/data/tools/small_areas/SAPS2016_SA2017.csv").then(function (data) {
//    let keys = d3.keys(data.carparks);
//    console.log("carpark data.carparks :" + JSON.stringify(data.carparks[keys[0]]));
    console.log("SA :" + JSON.stringify(data[0]));
    processHydronet(data);
});

function createSAMap(url_) {
    var promise = [];
    promise.push($.getJSON(url_));
    $.when.apply($, promise).done(function () {

// This callback will be called with multiple arguments,
// one for each promise call
// Each argument is an array with the following structure: [data, statusText, jqXHR]
        var saAll = arguments[0].features;
        console.log("SA features length: " + saAll.length);
        console.log("First point: " + JSON.stringify(saAll[0].geometry.coordinates[0][0]));

//        var smallArea = arguments[0].features[0].geometry.coordinates; //2-d array of points
//console.log("args: " + JSON.stringify(smallArea[0]));
//smallArea[0].forEach(function (p){
//    console.log("pt: " + JSON.stringify(p));
//});
        var saStyle_DublinCity = {
            color: "#6baed6",
            fillColor: getColor,
            weight: 1,
            opacity: 1
        };

        function style(f) {
            return {
                fillColor: getColor(Math.floor(Math.random() * 1000)),
                weight: 0,
                opacity: 1,
                //color: 'white',
                //dashArray: '3',
                fillOpacity: 0.5
            };
        }
        ;

        saLayer_DublinAll = L.geoJSON(saAll,
                {
                    filter: function (f, l) {
                        return f.properties.COUNTYNAME.includes("Dublin") 
                                || f.properties.COUNTYNAME.includes("Fingal")
                                || f.properties.COUNTYNAME.includes("Rathdown")
                        ;
                    },
                    style: style,
                    onEachFeature: onEachFeature
                });

        function onEachFeature(feature, layer) {
            layer.bindPopup(
                    '<p><b>' + feature.properties.EDNAME + '</b></p>'
                    + '<p>'+ feature.properties.COUNTYNAME +'</p>'
                    +'<p>SA #' + feature.properties.SMALL_AREA + '</p>'                                        
                    );
            //bind click
            layer.on({
                click: function () {
                    console.log(JSON.stringify(feature));
                }
            });
        }
//       map.addLayer(saLayer_DublinAll);
        saLayer_DublinAll.addTo(map);
    }); //end of done function
}




; //end of createSAMap

//Uses Promises to get all json data based on url and file count (i.e only 2000 records per file),
//Adds to Leaflet layers to referenced map and clusters
function loadJsonFiles(JSONsrc_, fileOffset_, fileCount_) { //, clusterName_, map_) {

    var promises = []; //this will hold an array of promises

    /***TODO: 
     Lazy load JSON files after page load.
     Search dir for # of files and for-each
     Don't waterfall file loading for performance.
     Add progress bar for file load.
     ****/

    for (i = fileOffset_; i < (fileOffset_ + fileCount_); i++) {
        promises.push(getData(i));
    }

    function getData(id) {
        var url = JSONsrc_ + id + '.geojson';
        return $.getJSON(url); // this returns a Promise
    }


//    var countByDateArr; //will store number of planning apps per date

    $.when.apply($, promises).done(function () {
        // This callback will be called with multiple arguments,
        // one for each promises call
        // Each argument is an array with the following structure: [data, statusText, jqXHR]

        for (var i = 0, len = arguments.length; i < len; i++) {
            //  arguments[i][0] is a single object with all the file JSON data
            var arg = arguments[i][0].features;
            //  make a 1-D array of all the features
            jsonFeaturesArr = jsonFeaturesArr.concat(arg);
//            console.log("***Argument " + JSON.stringify(arguments[i][0]) + "\n****************");
        }
//                    console.log(".done() - jsonData has length " + jsonFeaturesArr.length);
//                    console.log("JSON Data Array " + JSON.stringify(jsonFeaturesArr));

//        console.log("Features length: " + jsonFeaturesArr.length); //features from one loadJSONFile call, multiple files
//        console.log("jsonFeatures[1000] clean:  " + JSON.stringify(jsonFeaturesArr[1000]));
        makeGraphs(null, jsonFeaturesArr);
    }); //end of when()
} //end of loadJSONFile


//////////////////////////////////////////////////////////////////////////////
function makeGraphs(error, records) {
//       console.log("json: "+JSON.stringify(recordsJson.features));

//Clean features data
//for plain JSON, access e.g. .properties.ReceivedDate
//for geoJSON, access e.g. .features.ReceivedDate  
//    var records = recordsJson;
//	var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
//    var i = 0;
//Convert from Irish Grid to useable latlong
    var firstProjection = "EPSG:3857";
    var secondProjection = "EPSG:4326";
//    var areaFormat = d3.format(",.2r");
    records.forEach(function (d) {
        //d.properties.ReceivedDate.setMinutes(0);
        //d.properties.ReceivedDate.setSeconds(0);
        //d.properties.PlanningAuthority
        //d.properties.DecisionDate
        //d.geometry.coordinates[0] = +d.geometry.coordinates[0];
        //d.geometry.coordinates[1] = +d.geometry.coordinates[1];

        /***TODO: query the data with outSR as 4326 and compare load times 
         * without these projections***/

        var result = proj4(firstProjection, secondProjection,
                [+d.geometry.coordinates[0], +d.geometry.coordinates[1]]);
        d.x = result[0];
        d.y = result[1];
        d.properties.ReceivedDate = +d.properties.ReceivedDate;
        //d.properties.DecisionDate = +d.properties.DecisionDate;
        d.properties.AreaofSite = +d.properties.AreaofSite;
        d.properties.Decision = _.trim(d.properties.Decision).toUpperCase(); //clean leading & trailing whitespaces
        //if (d.properties.Decision === '') {
        //d.properties.Decision = 'OTHER';
        //}
        d.properties.DecisionCategory = d.properties.Decision;
        /*TODO: profile this for performance and explore regex*/
        if (d.properties.Decision.indexOf("GRANT") !== -1) {
            d.properties.DecisionCategory = "GRANT";
        } else if (d.properties.Decision.indexOf("REFUSE") !== -1) {
            d.properties.DecisionCategory = "REFUSE";
        }
        //else if (d.properties.Decision.indexOf("WITHDRAW")!==-1) {
        //d.properties.DecisionCategory = "WITHDRAW";
        //}
        else if (d.properties.Decision.indexOf("INVALID") !== -1) {
            d.properties.DecisionCategory = "INVALID";
        } else {
            d.properties.DecisionCategory = "OTHER";
        }


    });

    //Create a Crossfilter instance
    var planningXF = crossfilter(records);
    //console.log("crossfilter count: " + planningXF.size());
    //Define dimensions
    var authorityDim = planningXF.dimension(function (d) {
        return d.properties.PlanningAuthority;
    });
    var rDateDim = planningXF.dimension(function (d) {
        return d.properties.ReceivedDate;
    });
    var appNumberDim = planningXF.dimension(function (d) {
        return d.properties.ApplicationNumber;
    });
//    var decisionDim = planningXF.dimension(function (d) {
//        return d.properties.Decision;
//    });
    var decisionCategoryDim = planningXF.dimension(function (d) {
        return d.properties.DecisionCategory;
    });
    var areaDim = planningXF.dimension(function (d) {
        return d.properties.AreaofSite;
    });
//    var locationDim = planningXF.dimension(function (d) {
//        return d.loc;
//    });
    allDim = planningXF.dimension(function (d) {
        return d;
    });
    //Group Data
    var authorityGroup = authorityDim.group();
    //Store names of LAs in array as strings
    for (i = 0; i < authorityGroup.all().length; i += 1) {
        authorityNames.push(authorityGroup.all()[i].key);
    }
    //    console.log("LAs:" + authorityNames);
    //console.log("LAs:" + JSON.stringify(authorityGroup.all()[0].key));

    var rDateGroup = rDateDim.group();
//    var recordsByDDate = dDateDim.group();
    //var decisionGroup = decisionDim.group();
    var decisionCategoryGroup = decisionCategoryDim.group();
    for (i = 0; i < decisionCategoryGroup.all().length; i += 1) {
        decisionCategories.push(decisionCategoryGroup.all()[i].key);
    }
    var areaGroup = areaDim.group();
//    console.log("decisionCategories:" + decisionCategories);    

//    var recordsByLocation = locationDim.group();
//    var all = planningXF.groupAll();
    //Values to be used in charts

    //null sizes have been coerced to zero so we'll use that on the size slider
    var minAreaSize = areaDim.bottom(1)[0].properties.AreaofSite; //probably zero
    //console.log("min area: " + minAreaSize);
    var maxAreaSize = areaDim.top(1)[0].properties.AreaofSite;
    //console.log("max area: " + maxAreaSize);
    var medianAreaSize = d3.mean(records, function (d) {
        return d.properties.AreaofSite;
    });
    //console.log("median area: " + medianAreaSize);
    //Treat date data so zeros and future dates are excluded from charts(but still in data dims)
    //Find earliest date with d3
//    var minChartDate = d3.min(records, function (d) {
//        return d.properties.ReceivedDate;
//    });
    //Alternative: null dates have been coerced to 0, so scan through to find earliest valid date
    //
//***TODO: compare for performance    
    minChartDate = 0, index = 1;
    while (minChartDate === 0) {
        minChartDate = rDateDim.bottom(index)[index - 1].properties.ReceivedDate;
        index += 1;
    } //returns the whole record with earliest date that's not null or zero
    d3.select("#start_date").value = minChartDate;
    maxChartDate = rDateDim.top(1)[0].properties.ReceivedDate;

    if (maxChartDate > now) {
        maxChartDate = now;
    }
    ;
    console.log("minChartDate: " + JSON.stringify(minChartDate)
            + " | maxChartDate: " + JSON.stringify(maxChartDate)
            + "| now: " + now);
    //Charts
//    var numberRecordsND = dc.numberDisplay("#number-records-nd");
    var timeChart = dc.barChart("#time-chart");
    var sizeChart = dc.barChart("#size-chart");
    var decisionChart = dc.rowChart("#decision-row-chart");
//    var processingTimeChart = dc.rowChart("#processing-row-chart");
//    var locationChart = dc.rowChart("#location-row-chart");
//    numberRecordsND
//            .formatNumber(d3.format("d"))
//            .valueAccessor(function (d) {
//                return d;
//            })
//            .group(all);



    timeChart
            .width(400)
            .height(chartHeight / 2)
            .brushOn(true)
            .margins({top: 10, right: 50, bottom: 20, left: 40})
            .dimension(rDateDim)
            .group(rDateGroup)
            .transitionDuration(500)
            .x(d3.scaleTime().domain([minChartDate, maxChartDate]))
//            .elasticX(true)
            .elasticY(true)
            .yAxis().ticks(4);
    timeChart.render();
    
    sizeChart
            .width(400)
            .height(chartHeight / 2)
            .brushOn(true)
            .margins({top: 10, right: 50, bottom: 20, left: 40})
            .dimension(areaDim)
            .group(areaGroup)
            .transitionDuration(500)
            .x(d3.scaleLog().domain([0.1, 100]))
//            .elasticX(true)
            .elasticY(true)
            .yAxis().ticks(4);
    sizeChart.render();
    decisionChart
            .width(400)
            .height(chartHeight)
            .dimension(decisionCategoryDim)
            .group(decisionCategoryGroup)
//                        .ordering(function (d) {
//                            return -d.value;
//                        })
            .colors(['#6baed6'])
            .elasticX(true)
            .xAxis().ticks(4)
            ;
    decisionChart.render();
    dcCharts = [timeChart, sizeChart, decisionChart];
    
    
////Update the map if any dc chart gets filtered
    _.each(dcCharts, function (dcChart) {
        dcChart.on("filtered", function (chart, filter) {
            updateMap();
//            console.log("chart filtered");
        });
    });
    ;
    //UI elements
//
    var areaSlider = document.getElementById('area-slider');
    noUiSlider.create(areaSlider, {
        start: [minAreaSize, maxAreaSize],
        connect: true,
        //tooltips: [ true, true ],
        range: {
            'min': [minAreaSize, minAreaSize],
//            '25%': [100.0, 100.0], //TODO: formularise
            '50%': [medianAreaSize, medianAreaSize],
//            '75%': [(maxAreaSize-medianAreaSize)*0.5, (maxAreaSize-medianAreaSize)*0.5],
            'max': [maxAreaSize, maxAreaSize]
        }
    });
    areaSlider.noUiSlider.on('update', function (values, handle) {
//handle = 0 if min-slider is moved and handle = 1 if max slider is moved
//        if (handle === 0) {
//            document.getElementById('min-area-nb').value = values[0];
//        } else {
//            document.getElementById('max-area-nb').value = values[1];
//        }
        areaDim.filterRange([values[0], values[1]]);
        updateMap();
        updateCharts();
//    rangeMin = document.getElementById('input-number-min').value;
//    rangeMax = document.getElementById('input-number-max').value; 
    });


    var dateSlider = document.getElementById('date-slider');
    noUiSlider.create(dateSlider, {
        start: [minChartDate, maxChartDate],
        connect: true,
        //tooltips: [ true, true ],
        range: {
            'min' : minChartDate, 
            'max': maxChartDate
        }
    });




////handle the Local Authoirty checkboxes
//
//    //initialise checkbox to checked only if LA present in data
//    //disbale checkbox if no data for that LA
//    //
////    $(document).ready(function () {
//    d3.selectAll('.la-checkbox').each(function (d) {
//        var cb = d3.select(this);
//        if (authorityNames.includes(cb.property("value"))) {
//            cb.property("checked", true);
//        } else {
//            cb.property("checked", false);
//            cb.property("disabled", true);
//        }
//        ;
//    });
////push the LA name into the authorityNamesChecked array if box is ticked and it is in authorityNames
//    d3.selectAll(".la-checkbox").on('change', function () {
//        var authorityNamesChecked = []; //list of LAs with checked boxes
//        d3.selectAll(".la-checkbox").each(function (d) {
//            var cb = d3.select(this);
//            if (cb.property("checked")) {
//                if (authorityNames.includes(cb.property("value"))) {
//                    authorityNamesChecked.push(cb.property("value"));
//                }
//            }
//        });
////        console.log("LA Names: " + authorityNames);
////        console.log("LA Names Checked: " + authorityNamesChecked);
//        authorityDim.filterFunction(function (d) {
//            return authorityNamesChecked.includes(d);
//        });
//        updateMap();
//        updateCharts();
//    });
//    //handle the decision checkboxes...
//    //initalise
//    d3.selectAll('.decision-checkbox').each(function (d) {
//        var cb = d3.select(this);
//        if (decisionCategories.includes(cb.property("value"))) {
//            cb.property("checked", true);
//        } else {
//            cb.property("checked", false);
//            cb.property("disabled", true);
//        }
//        ;
//    });
////push the decision into the decisionsChecked array if box is ticked and it is in decisionCategories
//    d3.selectAll(".decision-checkbox").on('change', function () {
//        var decisionCategoriesChecked = []; //list of LAs with checked boxes
//        d3.selectAll(".decision-checkbox").each(function (d) {
//            var cb = d3.select(this);
//            if (cb.property("checked")) {
//                if (decisionCategories.includes(cb.property("value"))) {
//                    decisionCategoriesChecked.push(cb.property("value"));
//                }
//            }
//        });
//        console.log("Decision categories: " + decisionCategories);
//        console.log("Decision categories checked: " + decisionCategoriesChecked);
//        decisionCategoryDim.filterFunction(function (d) {
//            return decisionCategoriesChecked.includes(d);
//        });
//        updateMap();
//        updateCharts();
//    });
    d3.select("#search-result").html("");
    d3.select("#app-number-search").on('change', function () {
        let searchQuery = this.value;
        console.log("Search for App Number: " + searchQuery + "\n");
        appNumberDim.filter(searchQuery);
        let len = appNumberDim.top(Infinity).length;
//        console.log("Size: " + appNumberDim.top(Infinity).length);
        if (len === 0) {
            appNumberDim.filterAll();
            d3.select("#search-result").html("No records found");
        } else if (len === 1) {
            d3.select("#search-result").html("Found " + len + " record");
        } else {
            d3.select("#search-result").html("Found " + len + " records");
        }
        /*TODO: add reset button, clear 'no records'*/
        updateCharts();
        updateMap();
    });
//    
//    console.log("d3: "+d3.select("#end_date").node().value);
//    
//
    d3.select("#start_date").on('input', function () {
        var sd = Date.parse(this.value);
        var ed = Date.parse(d3.select("#end_date").node().value);
        console.log('start date: ' + sd +'\t exisitng end: '+ed);
        rDateDim.filterRange([sd, ed]);
        updateCharts();
        updateMap();
    });    

    d3.select("#end_date").on('input', function () {
        var ed = Date.parse(this.value);
        var sd = Date.parse(d3.select("#start_date").node().value);
        console.log('end date: ' + ed +'\t exisitng start: '+sd);
        rDateDim.filterRange([sd, ed]);
        updateCharts();
        updateMap();
    });     
    
    var early= new Date(minChartDate);
    var day = ("0" + early.getDate()).slice(-2);
    var month = ("0" + (early.getMonth() + 1)).slice(-2);
    var earlyDay = early.getFullYear() + "-" + (month) + "-" + (day);
    $('#start_date').val(earlyDay);
   
    var late = new Date(maxChartDate);
    day = ("0" + late.getDate()).slice(-2);
    month = ("0" + (late.getMonth() + 1)).slice(-2);
    var lateDay = late.getFullYear() + "-" + (month) + "-" + (day);
    $('#end_date').val(lateDay);

    function updateCharts() {
        timeChart.redraw();
        sizeChart.redraw();
        decisionChart.redraw();
    }

}
; //end of makeGraphs

var planningClusters = L.markerClusterGroup();
var saLayer_DublinAll;
function updateMap() {
    planningClusters.clearLayers();
    map.removeLayer(planningClusters);
    _.each(allDim.top(Infinity), function (d) {
        var marker = new L.Marker(
                new L.LatLng(d.y, d.x)
                );
        marker.bindPopup(getContent(d));
//        marker.on('click', function (e, d) {
//            console.log('click: '+JSON.stringify(e));
//            console.log('object:'+d);
//            
//        });
        planningClusters.addLayer(marker);

    });
    map.addLayer(planningClusters);
}

function getContent(d_) {
    var str = '';
    if (d_.properties.ApplicationNumber) {
        str += '<p> #' + d_.properties.ApplicationNumber + '</p><br>';
    }
    if (d_.properties.DevelopmentAddress) {
        str += '<b> Address: </b>' + d_.properties.DevelopmentAddress + '<br>';
    } else {
        str += '<b> Address: </b> not listed (see description)<br>';
    }
    if (d_.properties.PlanningAuthority) {
        str += '<strong>Authority: </strong>: ' + d_.properties.PlanningAuthority + '</strong><br>';
    }
    if (d_.properties.ReceivedDate) {
        str += '<strong>Application received</strong>: ' + new Date(d_.properties.ReceivedDate).toDateString() + '<br>';
    }
    if (d_.properties.Decision) {
        str += '<strong>Decision</strong>: ' + d_.properties.Decision + '<br>';
    } else {
        str += '<strong>Decision: </strong>' + 'Not found/pending <br>';
    }
    if (d_.properties.AreaofSite) {
        str += '<strong>Area of site</strong>: ' + d_.properties.AreaofSite + '<br>';
    }

    if (d_.properties.DevelopmentDescription) {
        str += '<br><strong>Description</strong>: ' + d_.properties.DevelopmentDescription + '<br>';
    }
//    if (d_.properties.DecisionDate) {
//        str += '<strong>Decision date</strong>: ' + new Date(d_.properties.DecisionDate);
//    }
    ;
    return str;
}
;
function getColor(d) {
    return d > 1000 ? '#800026' :
            d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
            d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
            d > 20 ? '#FEB24C' :
            d > 10 ? '#FED976' :
            '#FFEDA0';
}

$(document).ready(function () {
    console.log("ready");

});
