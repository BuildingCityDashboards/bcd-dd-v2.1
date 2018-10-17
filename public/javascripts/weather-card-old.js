//TODO: error check and handle
d3.xml("/data/Environment/met_eireann_forecast.xml").then(function (xmlWeather) {
    //console.log("Weather: " + xmlWeather);
    let timesXML = xmlWeather.getElementsByTagName("time");
    //console.log("#timesXML: " + timesXML.length);
    //use index in loop to track odd/even entry
    let forecasts = []; //array of objects
    let id = 0;
    for (let i = 0; i < timesXML.length - 1; i += 2) {
        let from, startDate, locationEven, lat, lng, temp, humidity, windDir, windSpeed,
                locationOdd, symbolId, symbolNo, precip;
        //console.log("TIME #" + i);
        from = timesXML[i].getAttribute("from");
        startDate = new Date(from);
        //console.log("from: " + from);
        locationEven = timesXML[i].getElementsByTagName("location")[0];
        lat = locationEven.getAttribute("latitude");
        //console.log("lat: " + lat);
        lng = locationEven.getAttribute("longitude");
        //console.log("lng: " + lng);
        temp = locationEven.getElementsByTagName("temperature")[0].getAttribute("value");
        //console.log("temp : " + temp);
        humidity = locationEven.getElementsByTagName("humidity")[0].getAttribute("value");
        //console.log("humidity : " + humidity);
        windDir = locationEven.getElementsByTagName("windDirection")[0].getAttribute("name");
        //console.log("winddir : " + windDir);
        windSpeed = locationEven.getElementsByTagName("windSpeed")[0].getAttribute("beaufort");
        //console.log("windspeed : " + windSpeed);
        //Odd entries
        locationOdd = timesXML[i + 1].getElementsByTagName("location")[0];
        symbolId = locationOdd.getElementsByTagName("symbol")[0].getAttribute("id");
        //console.log("symbol ID: " + symbolId);
        symbolNo = locationOdd.getElementsByTagName("symbol")[0].getAttribute("number");
        //console.log("symbol #" + symbolNo);
        symbolNo = +symbolNo;
        if (symbolNo < 10) {
            symbolNo = "0" + symbolNo; //pad with a zero
        }
        //console.log("date: "+startDate+" start hour: "+startDate.getHours());
        //decide if night or day based on hour 
        ///*TODO: Crude! Improve!*/
        if (startDate.getHours() > 18 || startDate.getHours() < 6) {
            tod = 'n';
        } else {
            tod = 'd';
        }
        precip = locationOdd.getElementsByTagName("precipitation")[0].getAttribute("value");
        //console.log("precip #" + precip);
        //
        //Only use the next 48 hourly readings 
        /*TODO: Better algo to decide if readings are to be used/ are valid*/
        if (id < 48) {
            forecasts.push(
                    {"id": id,
                        "date": startDate,
                        "temperature": temp,
                        "humidity": humidity,
                        "windDir:": windDir,
                        "windSpeed": windSpeed,
                        "symbolNo": symbolNo,
                        "symbolId": symbolId,
                        "precip": precip,
                        "tod": tod

                    });
        }
        id += 1;
    }

    
let weatherTime = d3.timeFormat("%a, %H:%M");
//let weatherDisplayHTML = 
//           "<b>" + weatherTime(forecasts[0].date) + "</b><br>"
//            + "<h2>" + forecasts[0].temperature + " C</h2>"
////            + "<strong>Precipitation</strong> : " + precip + " mm <br>"
////            + "<strong>Wind: Speed</strong> : " + windSpeed + " mps" + "\t Beaufort Scale: " + windB + "<br>"
////            + "<strong>Wind Direction</strong> : " + windD + "<br>"
////            + "<strong>Pressure</strong> : " + press + " hPa"
//;
//
//
//    let weatherNode = d3.select("#rt-weather").node();
//    let weatherWidth = weatherNode.getBoundingClientRect().width;
//    // dimensions margins, width and height
//    const m = [20, 10, 25, 10],
//            w = weatherWidth - m[1] - m[3],
//            h = 120 - m[0] - m[2];
//
//   let weatherSVG = d3.select("#rt-weather")
//            .attr("width", w + m[1] + m[3])
//            .attr("height", h + m[0] + m[2])
//            .attr("transform", "translate(" + m[3] + "," + "10" + ")")
//;
//    weatherSVG.append("text")
//        .attr("dx", 0)
//        .attr("dy", 55)
////        .attr("class", "label")
//        .attr("fill", "#ffffffff")//#f8f9fabd")
//        .html(weatherDisplayHTML);
//

});
////console.log("****Weather Vis loaded****");
//let cork_lng = [-8.4863, -8.4863, -8.4863]; //west, centre, east
//let cork_lat = [51.8969, 51.8969, 51.8969]; //north, centre, south
////let cx, cy;
////let ww = 400;
////let hh = 200;
////
////let prevTime = 0;
////let zoom = 8; //min 10 - max 20
//let sourceData = [];
//let sourceLink = "http://metwdb-prod.ichec.ie/metno-wdb2ts/locationforecast?lat=54.7210798611;long=-8.7237392806";
//let divideBy = 1; //portion of file to use, given as divisor 
//let spots = [];
////weather data
//let displayDate, displayTime, startTime, endTime, currentDate;
//let xmlWeather;
//let symbolsWeather = [];
//let symbolsDay = []; //images for weather symbols
//let symbol;
//let tod = 'd'; //time of day: day or night
//
////Parsing weather data///////////////////////////////////
////Momemt: temp, pressure, wind direction, wind speed, wind Beaufort humidity
//let t, press, windD, windS, windB, hum;
////Time span: precipitation, 
//let precip, symbolNo, desc;
////
//
//function preload() {
////Get Map
////    let map_url = "https://api.mapbox.com/styles/v1/mapbox/basic-v9/static/" +
////            cork_lng[1] + "," + cork_lat[1] + "," + zoom + "/" +
////            ww + "x" + hh +
////            "?access_token=" + map_APIToken;
////
//////    println("Map URL: " + map_url);
////
////    if (fileExists(map_url)) {
//////        println("Online map found");
////        mapImg = loadImage(map_url, "png");
////    } else {
////        println("Online map not found");
////        mapImg = loadImage("oops1", "jpg");
////    }
////    if (mapImg !== null) {
//////        println("Map loaded");
////    }
//
////Get weather  data
//    xmlWeather = loadXML("/files/locationforecast.xml");
//}
//
//function  setup() {
////    canvasMap = createCanvas(ww, hh);
////    canvasMap.parent("canvasDiv");
//////    canvasMap.translate(width / 2, height / 2);
////    ellipseMode(CENTER);
////    rectMode(CENTER);
//////    canvasMap.image(mapImg, 0, 0);
////    cx = mercX(cork_lng[1]);
////    cy = mercY(cork_lat[1]);
//////    println("cork_lng: " + cork_lng[1] + " => cx: " + cx + "\tcork_lat: " + cork_lat + " => cy: " + cy);
//////    timeSlider = createSlider(0, 5, prevTime);
//////    timeSlider.position(0, 10 + canvas.height);
//////    timeSlider.size(1024, 36);
////
//////    var children = xmlWeather.getChildren("time");
//////    println("*** "+xmlWeather.getAttributeCount());
//    println("*** " + xmlWeather.listChildren());
////
////
////    
//    currentDate = new Date();
//    //console.log("current date:" + currentDate);
//
//    let harmonieStartDate = new Date(xmlWeather.getChild("meta").getChildren()[0].getString("termin"));
//    //console.log("Model run start date:" + harmonieStartDate);
//
//    let harmonieEndDate = new Date(harmonieStartDate.setDate(harmonieStartDate.getDate() + 2)); //add 2 days
//    harmonieEndDate.setHours(5);
//    //console.log("Model run end day:" + harmonieEndDate); //if after this it is the ec_test_l
//
//
//    let prod = xmlWeather.getChild("product");
//    let timesXML = prod.getChildren();
//
//    let count = 0; //index to read from xml
//    let id = 0; //id to wrtie to in forecastsHarmonie' array
//
//
////first get harmonie, 1-hour readings:
////These span from midnight to +2days 06;00
////    let harmonieCount; //53 - (first start time+1)
//
//
//    for (let time in timesXML) {
//        //console.log("count: " + count);
//        //console.log("id: " + id);
//        //There are 2 types of forecast data;
//        //temp etc at a given time or rainfall/ symbol spanning an hour 
//
//        //aggregate every 2 forecats into 1 object
//        let startDate; //the start of time span for each forecast
//        for (let j = 0; j < 2; j += 1) {
//            startDate = new Date(timesXML[count + j].getString("from"));
//            let startHour = startDate.getHours();
//            startTime = startHour;
////            //console.log("Start Date:" +startDate);
////            //console.log("Start hour:" +parseInt(startHour));
//
//            if (count + j == 0) {
//                displayDate = startDate; //use first date 
////                displayTime = startTime;
////                harmonieCount = 54 - startHour;
////                //console.log("#harmonie forecastsHarmonie included:" + harmonieCount);
//            }
//
//            println("forecast #" + (count + j) + " | startTime: " + startHour + ":00 ");
//            let loc = timesXML[(count + j)].getChild("location");
//
//            // harmonie has temperature
//            if (loc.getChild("temperature") != null) {
//                let temp = loc.getChild("temperature");
//                t = temp.getString("value");
//                temp = loc.getChild("pressure");
//                press = temp.getString("value");
//                temp = loc.getChild("windSpeed");
//                windS = temp.getString("mps");
//                windB = temp.getString("beaufort");
//                temp = loc.getChild("windDirection");
//                windD = temp.getString("name");
//                temp = loc.getChild("humidity");
//                hum = temp.getString("value");
//
//            }
//            // ec_test_l has precipitation
//            else if (loc.getChild("precipitation") != null) {
//
//                let temp = loc.getChild("precipitation");
//                precip = temp.getString("value");
//                let s = loc.getChild("symbol");
//                desc = s.getString("id");
//                symbolNo = s.getString("number");
//                let sn = parseInt(symbolNo);
//                if (sn < 10) {
//                    symbolNo = "0" + symbolNo;
//                }
//                //decide if night or day based on hour
//                if (hour > 17 || hour < 6) {
//                    tod = 'n';
//                } else {
//                    tod = 'd';
//                }
////           
//            }
//        }
//        println("temperature: " + t);
//        println("precip: " + precip + " mm \t " + desc + " symbol #" + symbolNo);
//
//
//        forecastsHarmonie.push(
//                {"id": id,
//                    "date": startDate,
//                    "temperature": t,
//                    "symbol": symbolNo,
//                    "tod": tod,
//                    "desc": desc
//                });
//
//        //console.log("Aggregate forecast #" + id + " : " + JSON.stringify(forecastsHarmonie[id]));
//
////From 0600 onwards we're getting epc 6-hourly forecasts, so break out of loop
//        if (forecastsHarmonie[id].date >= harmonieEndDate) {
//            //console.log("Breaking at #" + id + " date: " + forecastsHarmonie[id].date);
//            break;
//        }
//        count += 2;
//        id += 1;
//
//    } //End loop through xml weather data
//
////    document.getElementById("weatherText").innerHTML =
////            "<h2>Weather for today : " + displayDate + " </h2>"
////            + "<h3>Time : " + displayTime + " </h3>"
////            + "<strong>Temperature</strong> : " + t + " C<br>"
////            + "<strong>Precipitation</strong> : " + precip + " mm <br>"
////            + "<strong>Wind: Speed</strong> : " + windS + " mps" + "\t Beaufort Scale: " + windB + "<br>"
////            + "<strong>Wind Direction</strong> : " + windD + "<br>"
////            + "<strong>Pressure</strong> : " + press + " hPa";
//
//    let noOfForecastsToShow = 8;
//    let startIndex = 0;
//    let check = true;
//    for (let fh in forecastsHarmonie) {
////        //console.log("check date: " + forecastsHarmonie[fh].date);
//        if (forecastsHarmonie[fh].date > currentDate && check) {
//            //console.log("Display date start: " + forecastsHarmonie[fh].date +"at index: "+forecastsHarmonie[fh].id);
//            startIndex = forecastsHarmonie[fh].id; //find first occurance when forecast is later than current time/date
//            check = false;
//            
//        }
//        else if (check) {
//            //if the xml is out of date, display the last 8 forecasts
//            startIndex = forecastsHarmonie[forecastsHarmonie.length-9].id; 
//        }
//    }
//    document.getElementById("weatherTime").innerHTML = "<p> Latest forecast for "
//                + forecastsHarmonie[startIndex].date 
//                +"</p>";
//
//    let htmlIndex = 0;
//    for (let i = startIndex; i < (startIndex + noOfForecastsToShow); i += 1) {
////        println("Get symbol: " + forecastsHarmonie[i].symbol + forecastsHarmonie[i].tod + ".png");
//        
//        document.getElementById("weatherImage" + htmlIndex).innerHTML =
//                "<img src=\"" + "/img/Met50v2/" + forecastsHarmonie[i].symbol + forecastsHarmonie[i].tod + ".png" + "\"></img>";
//        document.getElementById("weatherHead" + htmlIndex).innerHTML = forecastsHarmonie[i].date.getHours() + ":00";
//        document.getElementById("tableTemp" + htmlIndex).innerHTML = forecastsHarmonie[i].temperature + " C";
//        htmlIndex += 1;
//
//    }
//
////    if (sourceData != null) {
////        //spots=new Spot[sourceData.length-1]; //ignore first line
////        for (var i = 1; i < floor(sourceData.length / divideBy); i += 1) {
////            let cells = sourceData[i].split("/");
////            let lt = float(cells[2]);
////            let lg = float(cells[3]);
////
////            let yr, m, d;
////            for (let j = 0; j < cells.length; j += 1) {
////                let date = cells[0].split("-");
////                //print("Date has n = "+date.length+"\t");
////                //for (var k=0; k<date.length; k+=1) {
////                //  print("Date "+k+": "+date[k]);
////                //}
////                yr = int(date[0]);
////                m = int(date[1]);
////                d = int(date[2]);
////                //print("\tYear: "+year+"\tMonth: "+month+"\tDay: "+day+"\t");
////                //print("\tLong: "+cork_lng+"\tLat: "+cork_lat);
////
////            }
////            spots[i] = {
////                id: i,
////                string: sourceData[i],
////                cork_lat: lt,
////                long: lg,
////                x: mercX(lg) - cx,
////                y: mercY(lt) - cy,
////                year: yr,
////                month: m,
////                day: d,
////                show: function () {
////                    noStroke();
////                    fill(109, 153, 224, 100);
////                    ellipse(this.x, this.y, 10, 10);
////                }
////            };
////spots[i].show();
//////console.log("| Spot #"+spots[i].id+"\t" +spots[i].string);
//// //console.log("| Spot #"+spots[i].id+"\t" +spots[i].cork_lat+"\t" 
//// 	+spots[i].long+"\t" +spots[i].x+"\t" +spots[i].y+"\t"
//// +spots[i].year+"\t" +spots[i].month+"\t"+spots[i].day);
//
////        }
////
////    } else {
////        println("ERROR! No data file found.");
////    }
//////console.log("No of occurances in 2013 was "+showYear(2013));
//////console.log("No of occurances in 03/2013 was "+showMonth(2013, 3));
//////console.log("No of occurances on 01/03/2013 was "+showDay(2013, 3, 1));
//}
//
//function draw() {
////    image(mapImg, 0, 0);
////    fill(255, 125);
////    ellipse(width / 2, height / 2, 25, 25);
////    noFill();
////    var t = timeSlider.value();
//    //only update on change
////    if (t != prevTime) {
////        //console.log("slider: " + t);
////        prevTime = t;
////    }
////    showMonth(2013, t);
//}
//
//function mercX(lon) {
//    lon = radians(lon);
//    var a = (256 / PI) * pow(2, zoom);
//    var b = lon + PI;
//    return a * b;
//}
//
//function mercY(cork_lat) {
//    cork_lat = radians(cork_lat);
//    var a = (256 / PI) * pow(2, zoom);
//    var b = tan(PI / 4 + cork_lat / 2);
//    var c = PI - log(b);
//    return a * c;
//}
//
//function fileExists(map_url) {
//    if (map_url) {
//        var req = new XMLHttpRequest();
//        req.open('GET', map_url, false);
//        req.send();
//        return req.status == 200;
//    } else {
//        return false;
//    }
//}
//
//// function fetchStatus(address) {
////   var client = new XMLHttpRequest();
////   client.onload = function() {
////     // in case of network errors this might not give reliable results
////     returnStatus(this.status);
////   }
////   client.open("HEAD", address);
////   client.send();
//// }
//
//function showYear(y_) {
//    //var time =millis();
//    var count = 0;
//    for (var i = 1; i < spots.length; i += 1) {
//        if (spots[i].year === y_) {
//            count += 1;
//            spots[i].show();
//        }
//    }
//    //time=millis()-time;
//    ////console.log("Year count took "+time+"ms");
//    return count;
//}
//
//function showMonth(y_, m_) {
//    //var time =millis();
//    var count = 0;
//    for (var i = 1; i < spots.length; i += 1) {
//        if (spots[i].year === y_ && spots[i].month === m_) {
//            count += 1;
//            spots[i].show();
//        }
//    }
//    //time=millis()-time;
//    //println("Month count took "+time+"ms");
//    return count;
//}
//
//function showDay(y_, m_, d_) {
//    //var time =millis();
//    var count = 0;
//    for (var i = 1; i < spots.length; i += 1) {
//        if ((spots[i].year === y_) && (spots[i].month === m_) && (spots[i].day === d_)) {
//            count += 1;
//            spots[i].show();
//        }
//    }
//    //time=millis()-time;
//    //println("Day count took "+time+"ms");
//    return count;
//}
