//            The health data exists in seperate files for hospitals, GP 
//            surgeries etc. We could create an array of data objects for each, 
//            and add each to the map as a layer, with a layer control.
//            We're going to take the approach of loading all data into d3 and
//            filtering it as needed- this adds more potential for comparisons 
//            across various charts and visualisation elements, as they are all 
//            'connected'.


//  1. declare map variables and initialise base map
var map = new L.Map('map');
//           var ajaxRequest;
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
var healthCluster = L.markerClusterGroup();

var iconAX = 15;  //icon Anchor X
var iconAY = 15; //icon Anchor Y
//            Custom map icons
var hospitalIcon = L.icon({
    iconUrl: '/images/themes/health/Hospital.png',
    iconSize: [30, 30],
    iconAnchor: [iconAX, iconAY],
    popupAnchor: [-3, -76]
});
var gpIcon = L.icon({
    iconUrl: '/images/themes/health/GP.png',
    iconSize: [30, 30],
    iconAnchor: [iconAX, iconAY],
    popupAnchor: [-3, -76]
});
var dentistIcon = L.icon({
    iconUrl: '/images/themes/health/Dentist.png',
    iconSize: [30, 30],
    iconAnchor: [iconAX, iconAY],
    popupAnchor: [-3, -76]
});
var healthCenterIcon = L.icon({
    iconUrl: '/images/themes/health/HealthCenter.png',
    iconSize: [30, 30],
    iconAnchor: [iconAX, iconAY],
    popupAnchor: [-3, -76]
});
var pharmacyIcon = L.icon({
    iconUrl: '/images/themes/health/Pharmacy.png',
    iconSize: [30, 30],
    iconAnchor: [iconAX, iconAY],
    popupAnchor: [-3, -76]
});

//  2. Import data- create arrays for each input file, with each element holding one data object
var allHealthCenters = []; //single array to hold ALL the data
//Proj4js.defs["EPSG:29902"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29902", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs");
//Proj4js.defs["EPSG:29903"] = "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs";
proj4.defs("EPSG:29903", "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");



//in d3 v5 use Promises
Promise.all([
    d3.csv('/data/DublinHospitalList.csv'),
    d3.csv('/data/DublinGPList.csv'),
    d3.csv('/data/DublinPharmacyList.csv'),
    d3.csv('/data/DublinDentalPracticeList.csv'),
    d3.csv('/data/DublinHealthCenterList.csv'),
    d3.csv('/data/OP_Waiting_Lists_Dublin_Hospitals_2014-2018_2.csv')
])
        .then(([h, g, p, d, hc, w]) => {
            processHealthCenters(h, g, p, d, hc, w);
        });

//perform some basic conditioning of data, including co-ordinate mapping to latlng
function processHealthCenters(hospitalData, gpData, pharmacyData, dentistData, healthCenterData, opWData) {

    /*Hospital Data*****************************/
    console.log("Hospitals- \n");
    hospitalData.forEach(function (d) {
        d.x = +d.x;
        d.y = +d.y;
        //Convert from Irish Grid to useable latlong
        var firstProjection = "EPSG:29902";//'PROJCS["TM65 / Irish Grid",GEOGCS["TM65",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],TOWGS84[482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","29903"]]';
        var secondProjection = "EPSG:4326";
        var result = proj4(firstProjection, secondProjection, [d.x, d.y]);
        d.long = result[0];
        d.lat = result[1];
        //add a property to act as key for filtering
        d.type = "hospitals";
//                    console.log("Coord: " + result);
        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
    });
    console.log("# of health centers is " + allHealthCenters.length + "\n"); // +
//                console.log("Hospitals \n" + JSON.stringify(allHealthCenters));

    /*GP Data*****************************/
    console.log("GPs- \n");
    gpData.forEach(function (d) {
        //will create standard x and y fields for latlong
        d.x = +d.ig_xcord;
        d.y = +d.ig_ycord;
        var firstProjection = "EPSG:29902";//'PROJCS["TM65 / Irish Grid",GEOGCS["TM65",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],TOWGS84[482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","29903"]]';
        var secondProjection = "EPSG:4326"; //"+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
        var result = proj4(firstProjection, secondProjection, [d.x, d.y]);
        d.long = result[0];
        d.lat = result[1];
        d.type = "general practitioners";
//                    console.log("Coord: " + result);
        allHealthCenters = allHealthCenters.concat(d);
    });
    console.log("# of health centers now is " + allHealthCenters.length + "\n"); // +JSON.stringify(gps));
//                console.log("GPs \n" + JSON.stringify(allHealthCenters[]));

    /*Pharmacy Data****************************/
    console.log("Pharmacies- \n");
    pharmacyData.forEach(function (d) {
        d.x = +d.ig_xcord;
        d.y = +d.ig_ycord;
        //Convert from Irish Grid to useable latlong
        var firstProjection = "EPSG:29902"; //'PROJCS["TM65 / Irish Grid",GEOGCS["TM65",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],TOWGS84[482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","29903"]]';
        var secondProjection = "EPSG:4326";
        var result = proj4(firstProjection, secondProjection, [d.x, d.y]);
        d.long = result[0];
        d.lat = result[1];
        //add a property to act as key for filtering
        d.type = "pharmacies";
//                    console.log("Coord: " + result);

        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
    });
    console.log("# of health centers is " + allHealthCenters.length + "\n"); // +

    /*Dental Practice Data****************************/
    console.log("Dentists- \n");
    dentistData.forEach(function (d) {
        d.x = +d.ig_xcord;
        d.y = +d.ig_ycord;
        //Convert from Irish Grid to useable latlong
        var firstProjection = "EPSG:29902";// 'PROJCS["TM65 / Irish Grid",GEOGCS["TM65",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],TOWGS84[482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","29903"]]';
        var secondProjection = "EPSG:4326";
        var result = proj4(firstProjection, secondProjection, [d.x, d.y]);
        d.long = result[0];
        d.lat = result[1];
        //add a property to act as key for filtering
        d.type = "dentists";
//                    console.log("Coord: " + result);

        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
    });
    console.log("# of health centers is " + allHealthCenters.length + "\n");

    /*healthCenterData****************************/
    console.log("Health Centers- \n");
    healthCenterData.forEach(function (d) {
        d.x = +d.x;
        d.y = +d.y;
        //Convert from Irish Grid to useable latlong
        var firstProjection = "EPSG:29902";//'PROJCS["TM65 / Irish Grid",GEOGCS["TM65",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],TOWGS84[482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","29903"]]';
        var secondProjection = "EPSG:4326";
        var result = proj4(firstProjection, secondProjection, [d.x, d.y]);
        d.long = result[0];
        d.lat = result[1];
        //add a property to act as key for filtering
        d.type = "health centers";
//                   console.log("Coord: " + result);

        allHealthCenters = allHealthCenters.concat(d); //need to concat to add each new array element
    });
    console.log("# of health centers is " + allHealthCenters.length + "\n");
    /*****************************/

//                3. Create subsets of data as necessary using d3
    //Create a Crossfilter instance
    var healthCenterXF = crossfilter(allHealthCenters);
    allHealthCenters = null; //works for GC?
    console.log("crossfilter count: " + healthCenterXF.size());
//               Define Dimensions

    var typeDim = healthCenterXF.dimension(function (d) {
//                    console.log("hospitals d:" + JSON.stringify(d.type));
        return d.type;
    });
    
    var allHCDim = healthCenterXF.dimension(function (d) {
        return d;
    });
    var allHCGroup = allHCDim.groupAll();     
    

    //when a filter is applied to typeDim, the typeCount numerical element will update
    var typeCount = dc.dataCount('.dc-data-count')
            .dimension(healthCenterXF)
            .group(allHCGroup);
    
    typeCount.render();
    makeMap();
    //                4. Load map data
    function makeMap() {
        healthCluster.clearLayers();
        map.removeLayer(healthCluster);

        _.each(allHCDim.top(Infinity), function (d, i) {
            //It's not geoJSON (no features) so we must construct markers for each x and y in the data objects
            healthCluster.addLayer(L.marker(new L.LatLng(d.lat, d.long), {icon: getIcon(d.type)})
                    .bindPopup(getPopupContent(d)));
        });
        //finally add layer to map
        map.addLayer(healthCluster);
    }

    function getIcon(t) {
        if (t === "hospitals") {
            return hospitalIcon;
        } else if (t === "general practitioners") {
            return gpIcon;
        } else if (t === "dentists") {
            return dentistIcon;
        } else if (t === "pharmacies") {
            return pharmacyIcon;
        } else {
            return healthCenterIcon;
        }
    }

//Button helper functions
    d3.select('#hospital_button').on('click', function (filter) {
        typeDim.filter("hospitals");
        d3.select('#type-filter-text').html("<br>" + "hospitals");
//        typePie.filter(null)
//                .filter("hospitals");
//        d3.select('#chosen-type-text').text("Available datasets for hospitals:"); //TODO: hacky- fix using filter and dim
//        typeCount.redraw();
        typeCount.redraw();
        makeMap();
    });

    d3.select('#gp_button').on('click', function () {
        d3.select('#chosen-type-text').text("Available datasets for general practitioners:");
        typeDim.filter("general practitioners");
        d3.select('#type-filter-text').html("<br>" + "general practitioners");
//        typePie.filter(null)
//                .filter("general practitioners");
        typeCount.redraw();
        makeMap();
    });
    d3.select('#pharmacy_button').on('click', function () {
//        d3.select('#chosen-type-text').text("Available datasets for pharmacies:");
        typeDim.filter("pharmacies");
        d3.select('#type-filter-text').html("<br>" + "pharmacies");
//        typePie.filter(null)
//                .filter("pharmacies");
        typeCount.redraw();
        makeMap();
    });
    d3.select('#healthCenter_button').on('click', function () {
//        d3.select('#chosen-type-text').text("Available datasets for health centers:");
        typeDim.filter("health centers");
        d3.select('#type-filter-text').html("<br>" + "health centers");
//        typePie.filter(null)
//                .filter("health centers");
        typeCount.redraw();
        makeMap();
    });
    d3.select('#dentist_button').on('click', function () {
//        d3.select('#chosen-type-text').text("Available datasets for dentists:");
        typeDim.filter("dentists");
        d3.select('#type-filter-text').html("<br>" + "dentists");
//        typePie.filter(null)
//                .filter("dentists");
        typeCount.redraw();
        makeMap();
    });
    d3.select('#all_button').on('click', function () {
//        d3.select('#chosen-type-text').text("Choose a health location type to see available datasets.");
        d3.select('#type-filter-text').text('');
        typeDim.filterAll();
        typeCount.redraw();
        makeMap();
    });


}//End of processHealthCenters()


function getPopupContent(c) {
    var str = '';
    if (c.name) {
        str += '<h3> #' + c.name + '</h3><br>';
    } else if (c.Name) {
        str += '<h3> #' + c.Name + '</h3><br>';
    }
    if (c.type) {
        str += '<strong>' + c.type + '</strong><br>';
    } else if (c.Type) {
        str += '<strong>' + c.Type + '</strong><br>';
    }
    if (c.address) {
        str += '<p> #' + c.address + '</p><br>';
    } else if (c.Address) {
        str += '<p> #' + c.Address + '</p><br>';
    }
    return str;
}


