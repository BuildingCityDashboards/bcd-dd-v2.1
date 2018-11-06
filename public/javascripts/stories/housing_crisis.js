    const pFormat = d3.format(".2%"),
          pYear = d3.timeParse("%Y"),
          src = "../data/Stories/Housing/",
          getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p);

    Promise.all([
        d3.csv(src + "pop_house.csv"),
        d3.csv(src + "pop_house_rate.csv"),
        d3.csv(src + "housetype.csv"),
        d3.csv(src + "housecomp.csv"),
        d3.csv(src + "propertyprices.csv"),
        d3.csv(src + "mortgage_debt.csv"),
        d3.csv(src + "Social_housing_stock.csv"),
        d3.csv(src + "Social_housing_units.csv"),
        d3.csv(src + "Property_tax.csv"),
    ]).then(datafiles => {

        const chart1D = datafiles[0];
              chart1D.forEach(d=>{
                  d.households = +d.households;
              });
              
        const chart1D2 = datafiles[1];
              chart1D2Types = chart1D2.columns.slice(2)
              chart1D2.forEach(d=>{
                d["1991-2006"] = +d["1991-2006"];
                d["1991-2016"] = +d["1991-2016"];
              });

        const chart2D = datafiles[2],
              chart2Keys = chart2D.columns.slice(2);
              chart2D.forEach(d => {
                d.value = +d.value;
              });
            
        const chart3D = datafiles[3],
            //   chart3K = chart3D.columns.slice(1),
              chart3R = chart3D.columns[1];
              chart3K = getKeys(chart3D.map(o => o[chart3R]));
              chart3D.forEach( d => {
                  d.label = d.date;
                  d.value = +d.value;
                  d.date = pYear(d.date);
              });

        const chart4D =datafiles[4];

        const chart5D = datafiles[5];
              chart5D.forEach( d=>{
                  d.value = +d.value;
                  d.label = d.date;
                  d.date = pYear(d.date);
              });

        console.log("what's this", chart5D);

        const chart8D = datafiles[8],
              chart8K = chart8D.columns.slice(1);
              chart8D.forEach(d => {
                chart8K.forEach( key => {
                    d[key] = +d[key];
                });
            });

        const popRate = chart1D2.filter( d => {
                return d.type === "population";
            });

        const houseRate = chart1D2.filter( d => {
                return d.type === "households";
            });

        const colourArray = ["#00929e","#ffc20e","#16c1f3","#da1e4d","#086fb8", "#aae0fa", "#012e5f"],
              cArray2 = ['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'].reverse(),
              cA3 = ['#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'];
        
        const chart1C = chartContent(chart1D, "region", "population", "date", "#chart1", colourArray),
              Chart1 = new MultiLineChart(chart1C);
            
              Chart1.titleX = "Years";
              Chart1.titleY = "Population";

              Chart1.tickNumber = 27;
              Chart1.createScales();
              
            Chart1.addTooltip("Population - Year: ", "thousands", "label");

              // hacked the xaxis to show only ticks matching the data. 
              //- get list of dates and filter array of g tags for elements that match the dates
              Chart1.xAxis.selectAll(".x-axis .tick").style("display", "none");
              d3.select(Chart1.xAxis._groups[0][0].childNodes[1]).style("display", "block");
              d3.select(Chart1.xAxis._groups[0][0].childNodes[6]).style("display", "block");
              d3.select(Chart1.xAxis._groups[0][0].childNodes[12]).style("display", "block");
              d3.select(Chart1.xAxis._groups[0][0].childNodes[16]).style("display", "block");
              d3.select(Chart1.xAxis._groups[0][0].childNodes[21]).style("display", "block");
              d3.select(Chart1.xAxis._groups[0][0].childNodes[26]).style("display", "block");
              console.log("x axis content", Chart1.xAxis._groups[0][0]);


        const Chart1b = new GroupedBarChart(popRate, chart1D2Types , "region", "#chart1", "Years", "Population");
            //   Chart1b.addTooltip("Population - Year", "Percentage", "region");
              Chart1b.svg.attr("display","none");

                d3.select("#chart1 .chart_pop").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart1b.svg.attr("display","none");
                    Chart1.svg.attr("display","block");
                    Chart1.getData("population", "Years", "population");
                    Chart1.addTooltip("Population - Year", "thousands", "label");
                });

                d3.select("#chart1 .chart_hos").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart1b.svg.attr("display","none");
                    Chart1.svg.attr("display","block");
                    Chart1.getData("households", "Years", "households");
                    Chart1.addTooltip("Households - Year", "thousands", "label");
                 });

                 d3.select("#chart1 .chart_prate").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart1b.data = popRate;
                    // Chart1b.title = "Population - Region: ";
                    
                    Chart1b.addTooltip("Population - Region: ", "percentage");
                    Chart1b.hideRate(true);
                    Chart1b.scaleFormatY = d3.format(".0%");
                    Chart1b.update();
                    Chart1.svg.attr("display","none");
                    Chart1b.svg.attr("display","block");

                    console.log(Chart1b);
                 });

                 d3.select("#chart1 .chart_hrate").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart1b.data = houseRate;
                    Chart1b.title = "Households - Region: ";
                    Chart1b.hideRate(true);
                    Chart1b.scaleFormatY = d3.format(".0%");
                    Chart1b.update();
                    Chart1.svg.attr("display","none");
                    Chart1b.svg.attr("display","block");
                 });

                 const Chart2C = {
                    e: "#chart2",
                    k: "type",
                    d: chart2D,
                    v: "value",
                    c: cArray2
                 };

        const Chart2 = new GroupStackBar(Chart2C);
              Chart2.addTooltip("Property Types - Year", "thousands", "label");


        const chart3DN = nestData(chart3D, "label", chart3R, "value"),
              Chart3 = new StackedAreaChart("#chart3", "Years", "No. of Housing Completions", "date", chart3K, cA3);
              Chart3.tickNumber = 23;
              Chart3.getData(chart3DN);
              Chart3.addTooltip("Housing Completions - Year:", "Units");


        const chart4C = chartContent(chart4D, "type", "value", "date", "#chart4", colourArray),
              Chart4 = new MultiLineChart(chart4C);
            
              Chart4.titleX = "Years";
              Chart4.titleY = "Property Prices (Euro)";

            //   Chart4.tickNumber = 27;
              Chart4.createScales();
              
              Chart4.addTooltip("Population - Region: ", "thousands", "label");


        const chart5DN = nestData(chart5D, "label", "type", "value");

        const Chart5 = new StackedAreaChart("#chart5", "Years", "€ ( Millions )", "date", ["Value of Mortgage Debt"]);
              Chart5.tickNumber = 6;
              Chart5.getData(chart5DN);
              Chart5.addTooltip("Year:", "millions");


        const Chart8 = new StackBarChart("#chart8", chart8D, chart8K, "€ ( Millions )", "Years");
              Chart8.scaleY = "millions";
              Chart8.addTooltip("Gross Value Added - Year:", "millions", "date");

    }).catch(function(error){
        console.log(error);
    });

    Promise.all([
        d3.json(src + "DublinCityDestPOWCAR11_0.js")
    ]).then(datafiles => {

        let map = new L.Map("map1", {center: [53.35, -6.8], zoom: 9})
            .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

            function onEachFeature(f, layer) {

                let t = +f.properties.WORKFORCE,
                    c = +f.properties.DESTDUBLIN,
                    p = pFormat(c/t);

                let popupContent = 
                        "<p style=font-weight:400; font-size:14px;>Of the total workforce (" +
                        f.properties.WORKFORCE + 
                        ") enumerated in this Electoral Division(ED)" + 
                        "* (" +
                        f.properties.CSO_ED +
                        "," +
                        f.properties.EDNAME +
                        "), " +
                        f.properties.DESTDUBLIN +
                        " work in Dublin City**" +
                        "<br> This equates to <b>" +
                        p + " of all workers</b> enumerated in this ED. </p>" +

                        "<p class=small>*Excludes workforce where destination was classed as 'Blank' or 'Mobile'."+ 
                        "<br>**Destination is based on CSO Settlement boundaries.</p>";
        
                if (f.properties && f.properties.popupContent) {
                    popupContent += f.properties.popupContent;
                }
        
                layer.bindPopup(popupContent);
            }
        
            L.geoJSON(datafiles[0], {
                style: colour,
                onEachFeature: onEachFeature
            }).addTo(map);


            function colour(f) {
                return {
                    fillColor: intensity(f.properties),
                    fillOpacity: 0.85,
                    weight: 2,
                    color: intensity(f.properties)
                };
            }

            function intensity(d) {
                let total = +d.WORKFORCE,
                    commute = +d.DESTDUBLIN,
                    percentage = (commute/total);
                    
                switch (true){
                    case percentage > 0.5:
                        return "#d26975";
                        break;
                
                    case percentage > 0.3:
                        return "#f7b69a";
                        break;
                
                    case percentage > 0.1:
                        return "#fdeadb";
                        break;
                
                    case percentage > 0.05:
                        return "#c0c0c0";
                        break;
                
                    default:
                        return "#8f8f8f";
                }
            }

    }).catch(function(error){
        console.log(error);
    });

    function chartContent(data, key, value, date, selector, colour){

        data.forEach(function(d) {  //could pass types array and coerce each matching key using dataSets()
            d.label = d[date];
            d.date = pYear(d[date]);
            d[value] = +d[value];
        });
    
        // nest the processed data by regions
        const nest =  d3.nest().key( d => { return d[key] ;}).entries(data);
        console.log("nest value", nest);
        
        // get array of keys from nest
        const keys = [];
              nest.forEach(d => {keys.push(d.key);});
    
        return {
                element: selector,
                keys: keys,
                data: nest,
                value: value,
                colour: colour,
            }
    
    }

    function nestData(data, label, name, value){
        let nested_data = d3.nest()
            .key(function(d) { return d[label]; })
            .entries(data); // its the string not the date obj

        let mqpdata = nested_data.map(function(d){
            let obj = {
                label: d.key
            }
                d.values.forEach(function(v){
                obj[v[name]] = v[value];
                obj.date = v.date;
            })
        return obj;
      })
    return mqpdata;
}