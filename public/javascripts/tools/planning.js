
/* Map variables and instantiation */

var authorityNames = [];
var decisionCategories = [];
var regex = /GRANT/;

//Proj4js.defs["EPSG:29902"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
//Proj4js.defs["EPSG:29903"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29903", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

var dub_lng = -6.2603;
var dub_lat = 53.36;
var dublinX, dublinY;
//data loading
var dublinDataURI = '/data/tools/planning/json/Dublin_all_Planning_Test_';
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
var mapHeight = 600;
var chartHeight = 400;
/* Parse GeoJSON */
var jsonFeaturesArr = []; //all the things!
var allDim;
//We'd like to use d3's simple json loader with queue, but it doesn't play well with geojson...
//queue()
//        .defer(d3.json, "../data/corkCity_20.json")
//        .await(makeGraphs);

//... so we'll use the more powerful Promise pattern
loadJsonFile(dublinDataURI, 0, 39); //0-38 inclusive
////////////////////////////////////////////////////////////////////////////

//Uses Promises to get all json data based on url and file count (i.e only 2000 records per file),
//Adds to Leaflet layers to referenced map and clusters
function loadJsonFile(JSONsrc_, fileOffset_, fileCount_) { //, clusterName_, map_) {

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
//        var url ="../data/PlanningApplications_CorkCity_0.geojson";
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

        console.log("Features length: " + jsonFeaturesArr.length); //features from one loadJSONFile call, multiple files
        console.log("jsonFeatures[1000] clean:  " + JSON.stringify(jsonFeaturesArr[1000]));
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

    records.forEach(function (d) {
        //                    d.properties.ReceivedDate.setMinutes(0);
//                    d.properties.ReceivedDate.setSeconds(0);
//d.properties.PlanningAuthority
//d.properties.DecisionDate

//        d.geometry.coordinates[0] = +d.geometry.coordinates[0];
//        d.geometry.coordinates[1] = +d.geometry.coordinates[1];
        var result = proj4(firstProjection, secondProjection,
                [+d.geometry.coordinates[0], +d.geometry.coordinates[1]]);
        d.x = result[0];
        d.y = result[1];
        d.properties.ReceivedDate = +d.properties.ReceivedDate;
        
//        d.properties.DecisionDate = +d.properties.DecisionDate;
        d.properties.AreaofSite = +d.properties.AreaofSite;
        d.properties.Decision = _.trim(d.properties.Decision).toUpperCase(); //clean leading & trailing whitespaces
//        if (d.properties.Decision === '') {
//            d.properties.Decision = 'OTHER';
//            
//        }
        d.properties.DecisionCategory = d.properties.Decision;
/*TODO: profile this for performance and explore regex*/
        if (d.properties.Decision.indexOf("GRANT")!==-1) {
          d.properties.DecisionCategory = "GRANT";
        }
        else if (d.properties.Decision.indexOf("REFUSE")!==-1) {
          d.properties.DecisionCategory = "REFUSE";
        }
//        else if (d.properties.Decision.indexOf("WITHDRAW")!==-1) {
//          d.properties.DecisionCategory = "WITHDRAW";
//        }
        else if (d.properties.Decision.indexOf("INVALID")!==-1) {
          d.properties.DecisionCategory = "INVALID";
        }
        else{
            d.properties.DecisionCategory = "OTHER";
        }


    }); //end of forEach

//    function categorize(s) {
//        if (regex.test(s)) {
//            return s;
//            //console.log("we found it in the string!");
//        }
//    }


//    console.log("record count: " + i);
    //Create a Crossfilter instance
    var planningXF = crossfilter(records);
    console.log("crossfilter count: " + planningXF.size());
//               Define Dimensions
    var authorityDim = planningXF.dimension(function (d) {
        return d.properties.PlanningAuthority;
    });

    var rDateDim = planningXF.dimension(function (d) {
        return d.properties.ReceivedDate;
    });

//    var dDateDim = planningXF.dimension(function (d) {
//        return d.properties.DecisionDate;
//    });
    var decisionDim = planningXF.dimension(function (d) {

//        console.log('.');
        return d.properties.Decision;
    });

    var decisionCategoryDim = planningXF.dimension(function (d) {

//        console.log('.');
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

    var receivedDateGroup = rDateDim.group();
//    var recordsByDDate = dDateDim.group();
    var decisionGroup = decisionDim.group();
    var decisionCategoryGroup = decisionCategoryDim.group();
    for (i = 0; i < decisionCategoryGroup.all().length; i += 1) {
        decisionCategories.push(decisionCategoryGroup.all()[i].key);
    }
//    console.log("decisionCategories:" + decisionCategories);    

//    var recordsByLocation = locationDim.group();
    var all = planningXF.groupAll();
    //Values to be used in charts

    //null sizes have been coerced to zero so we'll use that on the size slider
    var minAreaSize = areaDim.bottom(1)[0].properties.AreaofSite; //probably zero
    //console.log("min area: " + minAreaSize);
    var maxAreaSize = areaDim.top(1)[0].properties.AreaofSite;
//    console.log("max area: " + maxAreaSize);



    //Treat date data so zeros and future dates are excluded from charts(but still in data dims)
    //Find earliest date with d3
//    var minChartDate = d3.min(records, function (d) {
//        return d.properties.ReceivedDate;
//    });
    //Alternative: null dates have been coerced to 0, so scan through to find earliest valid date
    //
//***TODO: compare for performance    
    var minChartDate=0, index=1;
    while (minChartDate === 0) {
        minChartDate = rDateDim.bottom(index)[index - 1].properties.ReceivedDate;
        index += 1;
        
    } //returns the whole record with earliest date

    
    var maxChartDate = rDateDim.top(1)[0].properties.ReceivedDate;
    var now = Date.now();
    if(maxChartDate > now){
        maxChartDate = now;
    };
    console.log("minChartDate: " + JSON.stringify(minChartDate)
            + " | maxChartDate: " + JSON.stringify(maxChartDate)
            + "| now: "+now);
    


    //Charts
//    var numberRecordsND = dc.numberDisplay("#number-records-nd");
    var timeChart = dc.barChart("#time-chart");
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
            .width(600)
            .height(chartHeight)
            .brushOn(true)
            .margins({top: 10, right: 50, bottom: 20, left: 20})
            .dimension(rDateDim)
            .group(receivedDateGroup)
            .transitionDuration(500)
            .x(d3.scaleTime().domain([minChartDate, maxChartDate]))
            .elasticY(true)
            .yAxis().ticks(4);

    timeChart.render();

    decisionChart
            .width(600)
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

    dcCharts = [timeChart, decisionChart];
////Update the map if any dc chart get filtered
    _.each(dcCharts, function (dcChart) {
        dcChart.on("filtered", function (chart, filter) {
            makeMap();
//            console.log("chart filtered");
        });
    });

    ;
    //UI elements

    var areaSlider = document.getElementById('area-slider');
//document.getElementById('input-number-min').setAttribute("value", 1231200000000);
//document.getElementById('input-number-max').setAttribute("value", 1516886449143);
//    var inputNumberMin = document.getElementById('min-area-nb');
//    var inputNumberMax = document.getElementById('max-area-nb');

    noUiSlider.create(areaSlider, {
        start: [minAreaSize, maxAreaSize],
        connect: true,
        //tooltips: [ true, true ],
        range: {
            'min': [minAreaSize, minAreaSize],
            '25%': [100.0, 100.0], //TODO: formularise
            '50%': [1000.0, 1000.0],
            '75%': [10000.0, 10000.0],
            'max': [maxAreaSize, maxAreaSize]
        }
    });

    areaSlider.noUiSlider.on('update', function (values, handle) {
//handle = 0 if min-slider is moved and handle = 1 if max slider is moved
        if (handle === 0) {
            document.getElementById('min-area-nb').value = values[0];
        } else {
            document.getElementById('max-area-nb').value = values[1];
        }
        areaDim.filterRange([values[0], values[1]]);
        makeMap();
        updateCharts();

//    rangeMin = document.getElementById('input-number-min').value;
//    rangeMax = document.getElementById('input-number-max').value; 
    });

//handle the Local Authoirty checkboxes

    //initialise checkbox to checked only if LA present in data
    //disbale checkbox if no data for that LA
    //
//    $(document).ready(function () {
    d3.selectAll('.la-checkbox').each(function (d) {
        var cb = d3.select(this);

        if (authorityNames.includes(cb.property("value"))) {
            cb.property("checked", true);

        } else {
            cb.property("checked", false);
            cb.property("disabled", true);
        }
        ;
    });
//push the LA name into the authorityNamesChecked array if box is ticked and it is in authorityNames
    d3.selectAll(".la-checkbox").on('change', function () {
        var authorityNamesChecked = []; //list of LAs with checked boxes
        d3.selectAll(".la-checkbox").each(function (d) {
            var cb = d3.select(this);
            if (cb.property("checked")) {
                if (authorityNames.includes(cb.property("value"))) {
                    authorityNamesChecked.push(cb.property("value"));
                }
            }
        });

        console.log("LA Names: " + authorityNames);
        console.log("LA Names Checked: " + authorityNamesChecked);
        authorityDim.filterFunction(function (d) {
            return authorityNamesChecked.includes(d);
        });
        makeMap();
        updateCharts();
    });
    
    
    //handle the decision checkboxes...
    //initalise
    d3.selectAll('.decision-checkbox').each(function (d) {
        var cb = d3.select(this);

        if (decisionCategories.includes(cb.property("value"))) {
            cb.property("checked", true);

        } else {
            cb.property("checked", false);
            cb.property("disabled", true);
        }
        ;
    });
//push the decision into the decisionsChecked array if box is ticked and it is in decisionCategories
    d3.selectAll(".decision-checkbox").on('change', function () {
        var decisionCategoriesChecked = []; //list of LAs with checked boxes
        d3.selectAll(".decision-checkbox").each(function (d) {
            var cb = d3.select(this);
            if (cb.property("checked")) {
                if (decisionCategories.includes(cb.property("value"))) {
                    decisionCategoriesChecked.push(cb.property("value"));
                }
            }
        });

        console.log("Decision categories: " + decisionCategories);
        console.log("Decision categories checked: " + decisionCategoriesChecked);
        decisionCategoryDim.filterFunction(function (d) {
            return decisionCategoriesChecked.includes(d);
        });
        makeMap();
        updateCharts();
    });
    

    function updateCharts() {
        timeChart.redraw();
        decisionChart.redraw();
    }
}
; //end of makeGraphs

var planningClusters = L.markerClusterGroup();
function makeMap() {

    planningClusters.clearLayers();
    map.removeLayer(planningClusters);
    _.each(allDim.top(Infinity), function (d) {
        var marker = new L.Marker(
                new L.LatLng(d.y, d.x)
                );
        marker.bindPopup(getContent(d));
        planningClusters.addLayer(marker);
//       markers.push([d.geometry.coordinates[0], d.geometry.coordinates[1], "test"]);
//        map.addLayer(new L.Marker(new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]), "test"));
//        console.log("d.geo:"+JSON.stringify(allDim));
//console.log("d:"+JSON.stringify(d.properties.DevelopmentAddress));
    });
    map.addLayer(planningClusters);
}

function getContent(d_) {
    var str = '';
    if (d_.properties.ApplicationNumber) {
        str += '<p> #' + d_.properties.ApplicationNumber + '</p><br>';
    }
    if (d_.properties.DevelopmentAddress) {
        str += '<p>' + d_.properties.DevelopmentAddress + '</p><br>';
    }
    if (d_.properties.PlanningAuthority) {
        str += '<p>' + d_.properties.PlanningAuthority + '</p><br>';
    }
    if (d_.properties.ReceivedDate) {
        str += '<strong>Application received</strong>: ' + new Date(d_.properties.ReceivedDate) + '<br>';
    }
    if (d_.properties.Decision) {
        str += '<strong>Decision</strong>: ' + d_.properties.Decision + '<br>';
    }
//    if (d_.properties.DecisionDate) {
//        str += '<strong>Decision date</strong>: ' + new Date(d_.properties.DecisionDate);
//    }
    ;
    return str;
}
;
