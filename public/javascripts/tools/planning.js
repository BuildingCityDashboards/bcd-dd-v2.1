let chartMargins = [10, 0, 30, 20];
//(map size - margins)/2 map size is specified in the css for leaflet charts
let chartHeight = (400 - chartMargins[0] - chartMargins[2]) / 2;
let chartWidth = 400;
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
//Convert from Irish Grid to useable latlong
const firstProjection = "EPSG:3857";
const secondProjection = "EPSG:4326";

const dub_lng = -6.2603;
const dub_lat = 53.36;
const min_zoom = 10, max_zoom = 16;
const zoom = min_zoom;
// tile layer with correct attribution
const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmUrl_BW = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
const osmUrl_Hot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
const stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';
const osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
const osmAttrib_Hot = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
const stamenTonerAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

let map = new L.Map('planning-map');
let osm = new L.TileLayer(stamenTonerUrl_Lite, {minZoom: min_zoom, maxZoom: max_zoom, attribution: stamenTonerAttrib});
map.setView(new L.LatLng(dub_lat, dub_lng), zoom);
map.addLayer(osm);

//let dummyLayer = L.geoJson().addTo(map);
//map.spin(true);
let planningClusters = L.markerClusterGroup();

let jsonFeaturesArr = []; //all the things!
//data loading
const dublinDataURI = '/data/tools/planning/json/Dublin_all_Planning_Test_';
//var dublinSAURI = '/data/tools/census2016/';
//let smallAreaBoundaries = 'Small_Areas__Generalised_20m__OSi_National_Boundaries.geojson';
//let countyAdminBoundaries = 'Administrative_Counties_Generalised_20m__OSi_National_Administrative_Boundaries_.geojson';
let allDim, appNumberDim, authorityDim;

loadFiles(dublinDataURI, 9, 10); //0, 38 for all
//Uses Promises to get all json data based on url and file count (i.e only 2000 records per file),
//Adds to Leaflet layers to referenced map and clusters
function loadFiles(JSONsrc_, fileOffset_, fileCount_) { //, clusterName_, map_) {
    //var promises = []; //this will hold an array of promises
    let crossfilterPlanning = crossfilter();
    let remaining = fileCount_ - fileOffset_;
    for (let i = fileOffset_; i < (fileOffset_ + fileCount_); i++) {
        var url = JSONsrc_ + i + '.geojson';
        d3.json(url).then(function (data) {
            initMapData(processFeatures(data.features));
            crossfilterPlanning.add(processFeatures(data.features));
            remaining -= 1;
            //console.log("Files remaining to load "+remaining);
            if (remaining === 0) {
                //console.log("Re-cluster");
                updateDimensions(crossfilterPlanning);
                updateMapData();
            }
        });
    }
}

function processFeatures(data_) {
    //Clean features data
    data_.forEach(function (d) {
        /***TODO: query the data with outSR as 4326 and compare load times
         * without these projections***/
        var result = proj4(firstProjection, secondProjection,
                [+d.geometry.coordinates[0], +d.geometry.coordinates[1]]);
        d.x = result[0];
        d.y = result[1];
        d.properties.ReceivedDate = +d.properties.ReceivedDate;
        //d.properties.DecisionDate = +d.properties.DecisionDate;
        d.properties.AreaofSite = +d.properties.AreaofSite;
        d.properties.Decision = _.trim(d.properties.Decision).toUpperCase();
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
    return(data_);
}


function initMapData(data_) {
    data_.forEach(function (d) {
        //console.log("x: "+d.x);
        let marker = new L.Marker(
                new L.LatLng(d.y, d.x)
                );
        planningClusters.addLayer(marker);

    });
    map.addLayer(planningClusters);
}

function updateMapData() {
    planningClusters.clearLayers();
    map.removeLayer(planningClusters);
    _.each(allDim.top(Infinity), function (d) {
        var marker = new L.Marker(
                new L.LatLng(d.y, d.x)
                );
        marker.bindPopup(getContent(d));
        marker.on('click', function (e, d) {
            console.log('object:' + d);

        });
        planningClusters.addLayer(marker);
    });
    map.addLayer(planningClusters);
}

//////////////////////////////////////////////////////////////////////////////
function updateDimensions(planningXF) {
//       console.log("json: "+JSON.stringify(recordsJson.features));
    //console.log("crossfilter count: " + planningXF.size());
    //
    allDim = planningXF.dimension(function (d) {
        return d;
    });
//Define dimensions
    authorityDim = planningXF.dimension(function (d) {
        return d.properties.PlanningAuthority;
    });
    var rDateDim = planningXF.dimension(function (d) {
        return d.properties.ReceivedDate;
    });
    appNumberDim = planningXF.dimension(function (d) {
        return d.properties.ApplicationNumber;
    });
//    var decisionDim = planningXF.dimension(function (d) {
//        return d.properties.Decision;
//    });
    var decisionCategoryDim = planningXF.dimension(function (d) {
        return d.properties.DecisionCategory;
    });
//    var areaDim = planningXF.dimension(function (d) {
//        return d.properties.AreaofSite;
//    });
//    var locationDim = planningXF.dimension(function (d) {
//        return d.loc;
//    });

    //Group Data
    var authorityGroup = authorityDim.group();
    //Store names of LAs in array as strings
    for (i = 0; i < authorityGroup.all().length; i += 1) {
        authorityNames.push(authorityGroup.all()[i].key);
    }
    console.log("LAs:" + authorityNames);
    console.log("LAs:" + JSON.stringify(authorityGroup.all()[0].key));

    //var rDateGroup = rDateDim.group();
//    var recordsByDDate = dDateDim.group();
    //var decisionGroup = decisionDim.group();
    var decisionCategoryGroup = decisionCategoryDim.group();
    for (i = 0; i < decisionCategoryGroup.all().length; i += 1) {
        decisionCategories.push(decisionCategoryGroup.all()[i].key);
    }
//    var areaGroup = areaDim.group();
//    console.log("decisionCategories:" + decisionCategories);

//    var recordsByLocation = locationDim.group();
//    var all = planningXF.groupAll();
    //Values to be used in charts

    //null sizes have been coerced to zero so we'll use that on the size slider
//    var minAreaSize = areaDim.bottom(1)[0].properties.AreaofSite; //probably zero
//    //console.log("min area: " + minAreaSize);
//    var maxAreaSize = areaDim.top(1)[0].properties.AreaofSite;
//    //console.log("max area: " + maxAreaSize);
//    var medianAreaSize = d3.mean(records, function (d) {
//        return d.properties.AreaofSite;
//    });
}

// function createSAMap(url_) {
//     var promise = [];
//     promise.push($.getJSON(url_));
//     $.when.apply($, promise).done(function () {
//
// // This callback will be called with multiple arguments,
// // one for each promise call
// // Each argument is an array with the following structure: [data, statusText, jqXHR]
//         var saAll = arguments[0].features;
//         console.log("SA features length: " + saAll.length);
//         console.log("First point: " + JSON.stringify(saAll[0].geometry.coordinates[0][0]));
//
// //        var smallArea = arguments[0].features[0].geometry.coordinates; //2-d array of points
// //console.log("args: " + JSON.stringify(smallArea[0]));
// //smallArea[0].forEach(function (p){
// //    console.log("pt: " + JSON.stringify(p));
// //});
//         var saStyle_DublinCity = {
//             color: "#6baed6",
//             fillColor: getColor,
//             weight: 1,
//             opacity: 1
//         };
//
//         function style(f) {
//             return {
//                 fillColor: getColor(Math.floor(Math.random() * 1000)),
//                 weight: 0,
//                 opacity: 1,
//                 //color: 'white',
//                 //dashArray: '3',
//                 fillOpacity: 0.5
//             };
//         }
//         ;
//
//         saLayer_DublinAll = L.geoJSON(saAll,
//                 {
//                     filter: function (f, l) {
//                         return f.properties.COUNTYNAME.includes("Dublin")
//                                 || f.properties.COUNTYNAME.includes("Fingal")
//                                 || f.properties.COUNTYNAME.includes("Rathdown")
//                                 ;
//                     },
//                     style: style,
//                     onEachFeature: onEachFeature
//                 });
//
//         function onEachFeature(feature, layer) {
//             layer.bindPopup(
//                     '<p><b>' + feature.properties.EDNAME + '</b></p>'
//                     + '<p>' + feature.properties.COUNTYNAME + '</p>'
//                     + '<p>SA #' + feature.properties.SMALL_AREA + '</p>'
//                     );
//             //bind click
//             layer.on({
//                 click: function () {
//                     console.log(JSON.stringify(feature));
//                 }
//             });
//         }
// //       map.addLayer(saLayer_DublinAll);
//         saLayer_DublinAll.addTo(map);
//     }); //end of done function
// }
// ; //end of createSAMap

//////////////////////////////////////////////////////////////////////////////
function createGraphs(error, records) {
//       console.log("json: "+JSON.stringify(recordsJson.features));

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
//    d3.select("#start_date").value = minChartDate;
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

    timeChart
            .width(chartWidth)
            .height(chartHeight)
            .brushOn(true)
//            .yAxisLabel("# Applications")
            .margins({top: chartMargins[0], right: chartMargins[1],
                bottom: chartMargins[2], left: chartMargins[3]})
            .dimension(rDateDim)
            .group(rDateGroup)
            .transitionDuration(200)
            .x(d3.scaleTime().domain([minChartDate, maxChartDate]))
//            .elasticX(true)
            .elasticY(true)
            .yAxis().ticks(4);
    timeChart.render();

    var decisionChart = dc.rowChart("#decision-row-chart");
    decisionChart
            .width(400)
            .height(chartHeight)
            .margins({top: chartMargins[0], right: chartMargins[1],
                bottom: chartMargins[2], left: chartMargins[3]})
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


////Update the map if any dc chart gets filtered
    _.each(dcCharts, function (dcChart) {
        dcChart.on("filtered", function (chart, filter) {
            updateMap();
//            console.log("chart filtered");
        });
    });
    ;

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


//
//    console.log("d3: "+d3.select("#end_date").node().value);
//
//
//    d3.select("#start_date").on('input', function () {
//        var sd = Date.parse(this.value);
//        var ed = Date.parse(d3.select("#end_date").node().value);
//        console.log('start date: ' + sd + '\t exisitng end: ' + ed);
//        rDateDim.filterRange([sd, ed]);
//        updateCharts();
//        updateMap();
//    });

//    d3.select("#end_date").on('input', function () {
//        var ed = Date.parse(this.value);
//        var sd = Date.parse(d3.select("#start_date").node().value);
//        console.log('end date: ' + ed + '\t exisitng start: ' + sd);
//        rDateDim.filterRange([sd, ed]);
//        updateCharts();
//        updateMap();
//    });



    var early = new Date(minChartDate);
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
//        sizeChart.redraw();
        decisionChart.redraw();
    }

    updateMap();
}
; //end of makeGraphs


d3.select("#search-result-count").html("");
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
    //updateCharts();
    updateMapData();
});

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

/********************
 * Handle Checkboxes
 ********************/

 d3.selectAll("button[type=checkbox]").on("click", function(){
   console.log("checkbox");
   d3.selectAll("button[type=checkbox]").each(function (d) {
     let cb = d3.select(this);
     console.log("Value: "+cb.property("value"));
   });
   //             let cb = d3.select(this);

   // let cb = d3.select(this);
   // if($(this).hasClass('active')){
   //   $(this).removeClass('active');
   //   //     authorityDim.filterFunction(function (d) {
   //   //         return authorityNamesChecked.includes(d);
   //   //     });
   //   // console.log("ACTIVE");
   // }
   // else{
   //   $(this).addClass('active');
   //   if (authorityNames.includes(cb.property("value"))) {
   //        authorityNamesChecked.push(cb.property("value"));
   //      };
   // }
   // console.log("active; "+$(this).hasClass('active'));
   // updateMapData();

 });

 // d3.selectAll('input[type=checkbox]').on('click', function () {
 //      console.log("change");
 //      d3.selectAll("input[type=checkbox]").each(function (d) {
 //             let cb = d3.select(this);
 //             if (cb.property("checked")) {
 //                  console.log("cbox checked: " + cb.property("checked"));
 //                  d3.select('#dublin-city-label').property("active")=true;
 //                  // if (authorityNames.includes(cb.property("value"))) {
 //                  //     authorityNamesChecked.push(cb.property("value"));
 //                  // };
 //             }
 //          });
 // });














 // d3.select("#dlr-checkbox").on("click", function(){
 //   console.log("dlr");
 //   if($(this).hasClass('active')){
 //     $(this).removeClass('active');
 //     // console.log("ACTIVE");
 //   }
 //   else{
 //     $(this).addClass('active');
 //     //console.log("INACTIVE");
 //   }
 //   console.log("active; "+$(this).hasClass('active'));
 //
 // });
 //
 // d3.select("#f-checkbox").on("click", function(){
 //   console.log("f");
 //   if($(this).hasClass('active')){
 //     $(this).removeClass('active');
 //     // console.log("ACTIVE");
 //   }
 //   else{
 //     $(this).addClass('active');
 //     //console.log("INACTIVE");
 //   }
 //   console.log("active; "+$(this).hasClass('active'));
 //
 // });
 // d3.select("#sdcc-checkbox").on("click", function(){
 //   console.log("sdcc");
 //   if($(this).hasClass('active')){
 //     $(this).removeClass('active');
 //     // console.log("ACTIVE");
 //   }
 //   else{
 //     $(this).addClass('active');
 //     //console.log("INACTIVE");
 //   }
 //   console.log("active; "+$(this).hasClass('active'));
 //
 // });

// d3.selectAll("input[type=checkbox]").each(function (d) {
// //    authorityNames = ['Dublin City'];
//    console.log("Found checkbox");
//    let cb = d3.select(this);
//    let lbl = d3.select(this.parentNode);
//    console.log("Active is " + lbl.property("active"));
// //    if (authorityNames.includes(cb.property("value"))) {
// //        cb.property("checked", true);
// //        lbl.property("active", true);
// //    } else {
// //        cb.property("checked", false);
// //        lbl.property("disabled", true);
// //    }
//
//
//    ;
// });

// d3.selectAll('input[type=checkbox]').each(function (d) {
// console.log("selected");
// });

////push the decision into the decisionsChecked array if box is ticked and it is in decisionCategories
////push the LA name into the authorityNamesChecked array if box is ticked and it is in authorityNames


//     var authorityNamesChecked = []; //list of LAs with checked boxes
//     d3.selectAll("input[type = checkbox]").each(function (d) {
//         var cb = d3.select(this);
//         if (cb.property("active")) {
//             console.log("cbox checked: " + cb.property("active"));
//             if (authorityNames.includes(cb.property("value"))) {
//                 authorityNamesChecked.push(cb.property("value"));
//             };
//         }
//     });
//     console.log("LA Names: " + authorityNames);
//     console.log("LA Names Checked: " + authorityNamesChecked);
//     authorityDim.filterFunction(function (d) {
//         return authorityNamesChecked.includes(d);
//     });
//     updateMap();
//     updateCharts();
// });

/**************
 *
 * @param {type} d_
 * @returns {String}
 *
 *
 */
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

$(document).ready(function () {
//    console.log("ready");
    //TODO: calculate width of charts after page DOM loads
//    console.log("Width: " + d3.select('#time-chart').node().get);
});
