    const pFormat = d3.format(".2%"),
          parseYear = d3.timeParse("%Y");

    Promise.all([
        d3.json("../data/Housing/DublinCityDestPOWCAR11_0.js"),
        d3.csv("../data/Stories/Housing/pop_house.csv"),
        d3.csv("../data/Stories/Housing/pop_house_rate.csv"),
        d3.csv("../data/Stories/Housing/housetype.csv")
    ]).then(datafiles => {

        const chart1D = datafiles[1];
              chart1D.forEach(d=>{
                  d.households = +d.households;
              })

        const chart1D2 = datafiles[2];
              chart1D2Types = chart1D2.columns.slice(2)
              chart1D2.forEach(d=>{
                d["1991-2006"] = +d["1991-2006"];
                d["1991-2016"] = +d["1991-2016"];
              });

        const chart2D = datafiles[3]
              chart2Keys = chart2D.columns.slice(2);
              chart2D.forEach(d => {
                  chart2Keys.forEach( key => {
                      d[key] = +d[key];
                  })
              });

        console.log("chart 1 b keys", chart2D);

        const popRate = chart1D2.filter( d => {
                return d.type === "population";
            });

        const houseRate = chart1D2.filter( d => {
                return d.type === "households";
            });
        
        const chart1C = chartContent(chart1D, "region", "population", "date", "#chart1"),
              Chart1 = new MultiLineChart(chart1C);
            
              Chart1.titleX = "Years";
              Chart1.titleY = "Population";

              Chart1.tickNumber = 27;
              Chart1.createScales();
              
              Chart1.addTooltip("Population - Region: ", "thousands", "label");


        const Chart1b = new GroupedBarChart(popRate, chart1D2Types , "region", "#chart1", "Years", "Population");
              Chart1b.addTooltip("Population - Year", "Percentage", "region");
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
                    Chart1b.title = "Population - Region: ";
                    Chart1b.update();
                    Chart1.svg.attr("display","none");
                    Chart1b.svg.attr("display","block");
                 });

                 d3.select("#chart1 .chart_hrate").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart1b.data = houseRate;
                    Chart1b.title = "Households - Region: "
                    Chart1b.update();
                    Chart1.svg.attr("display","none");
                    Chart1b.svg.attr("display","block");
                 });

        const Chart2 = new GroupedBarChart(chart2D,  chart2Keys, "region", "#chart2", "Years", "Population");
              Chart2.addTooltip("Population - Year", "Percentage", "region");
        
        let map = new L.Map("map", {center: [53.35, -6.8], zoom: 9})
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

    function chartContent(data, key, value, date, selector){

        data.forEach(function(d) {  //could pass types array and coerce each matching key using dataSets()
            d.label = d[date];
            d.date = parseYear(d[date]);
            d[value] = +d[value];
        });
    
        // nest the processed data by regions
        const nest =  d3.nest().key( d => { return d[key] ;}).entries(data);
        
        // get array of keys from nest
        const keys = [];
              nest.forEach(d => {keys.push(d.key);});
    
        return {
                element: selector,
                keys: keys,
                data: nest,
                value: value
            }
    
    }