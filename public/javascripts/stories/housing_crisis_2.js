    const pFormat = d3.format(".2%"),
          pYear = d3.timeParse("%Y"),
          parseMonth = d3.timeParse("%b-%y"),
          parseYearMonth = d3.timeParse("%Y-%b"),
          src = "../data/Stories/Housing/",
          getKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p);

    Promise.all([
        d3.csv("../data/Housing/HPM06.csv"),
        d3.csv(src + "pop_house_rate.csv"),
        d3.csv(src + "housetype.csv"),
        d3.csv(src + "housecomp.csv"),
        d3.csv(src + "propertyprices.csv"),
        d3.csv(src + "mortgage_debt.csv"),
        d3.csv(src + "social_housing_stock.csv"),
        d3.csv(src + "Social_housing_units.csv"),
        d3.csv(src + "Property_tax.csv"),
    ]).then(datafiles => {

        const chart1D = datafiles[0];
              chart1D.forEach(d=>{
                  d.all = +d.all;
                  d.houses = +d.houses;
                  d.apartments = +d.apartments;
                  d.label = d.date;
                  d.date = parseYearMonth(d.date);
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
              });

        const chart6D = datafiles[6];
            chart6D.forEach(d => {
                d.value = +d.value;
            });

        const chart8D = datafiles[8],
              chart8K = chart8D.columns.slice(1);
              chart8D.forEach(d => {
                    d.value = +d.value;
            });

        const popRate = chart1D2.filter( d => {
                return d.type === "population";
            });

        const houseRate = chart1D2.filter( d => {
                return d.type === "households";
            });

        const cA1 = [
                    "#00929e", //BCD-teal
                    "#ffc20e", //BCD-yellow
                    "#16c1f3", //BCD-blue
                    "#da1e4d", //BCD-red
                    "#086fb8", //BCD-strong-blue
                    "#aae0fa", //BCD-pale-blue
                    "#012e5f" //BCD-navy
                    ], // orignal

            cA2 = [
                    // "#012e5f", //BCD-navy
                    "#086fb8", //BCD-strong-blue
                    "#da1e4d", //BCD-red
                    "#16c1f3", //BCD-blue
                    "#ffc20e", //BCD-yellow
                    "#00929e", //BCD-teal
                    "#aae0fa", //BCD-pale-blue
                    // "#6aedc7", //pale-green
                    "#f5b4c4", //pink
                    "#998ce3", //purple
                    ], // new version

            cA3 = [
                    "#d73027",
                    "#f46d43",
                    "#fdae61",
                    "#fee090",
                    "#ffffbf",
                    "#e0f3f8",
                    "#abd9e9",
                    "#74add1",
                    "#4575b4"
                    ].reverse(),//diverging blue to red

            cA3_2 = [
                    "#d73027",
                    "#4575b4"
                    ].reverse(),//diverging blue to red

            cA4 = [
                    "#00929e", //BCD-teal
                    "#ffc20e", //BCD-yellow
                    "#16c1f3", //BCD-blue
                    "#da1e4d", //BCD-red
                    "#998ce3", //purple
                    "#6aedc7", //green
                    ];

            cA5 = [
                    "#8dd3c7",
                    "#ffffb3",
                    "#bebada",
                    "#fb8072",
                    "#80b1d3",
                    "#fdb462",
                    "#b3de69",
                    "#fccde5",
                    "#d9d9d9"
                    ]; // qualitative pastel


                    var myarray=new array();
                    //"red","green","black","blue",
                    myarray['Detached house']="blue";
                    myarray['Semi- detached house']="Fuchsia";
                    myarray['Terraced house']="DarkTurquoise";
                    myarray['Flat or apartment in a purpose- built block']="DarkOrange";
                    myarray['Flat or apartment in a converted house or commercial building and bedsits']="Cyan";
                    myarray['Not stated']="Coral";
                    myarray['Private']="Beige";
                    myarray['Social/Voluntary Body']="navy";
                    myarray['Private Rented']="yellow";
                    myarray['Not Stated']="AliceBlue";

        // nest the processed data by regions
        const nest =  d3.nest().key( d => { return d["region"] ;}).entries(chart1D),
                console.log(nest);
              // filter out the rest of Ireland fig.
              nestFiltered = nest.filter(
                  d => { return d.key !== "Rest of Ireland"}
              ),

        // get array of keys from nest
              keys = nest.map(d => {return(d.key);}),

                chart1C = {

                    element: "#chart1",
                    keys: keys,
                    data: nestFiltered,
                    value: "all",
                    colour: cA2,

                },
              Chart_fig1 = new MultiLineChart(chart1C);
                console.log("what", nestFiltered);
              Chart_fig1.titleX = "Months";
              Chart_fig1.titleY = "Price Index (Base 100)";
              Chart_fig1.yScaleFormat = "millions";

              Chart_fig1.drawChart();

              Chart_fig1.addTooltip("Price Index by Month: ", "thousands", "label");

                d3.select("#chart1 .chart_pop").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart_fig1.value = "all";
                    Chart_fig1.updateChart();
                });

                d3.select("#chart1 .chart_hos").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart_fig1.value = "houses";
                    Chart_fig1.updateChart();
                 });

                 d3.select("#chart1 .chart_prate").on("click", function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    Chart_fig1.value = "apartments";
                    Chart_fig1.updateChart();
                 });

        const Chart2C = {
                    e: "#chart2",
                    k: "type",
                    d: chart2D,
                    v: "value",
                    c: cA4,
                    ySF: "m",
                    marr:myarray;
                 };

        const Chart2 = new GroupStackBar(Chart2C);
              Chart2.addTooltip("Property Types - Year", "thousands", "label");


        const chart3DN = nestData(chart3D, "label", chart3R, "value"),
              Chart3 = new StackedAreaChart("#chart3", "Years", "No. of Housing Completions", "date", chart3K, cA3);
              Chart3.tickNumber = 23;
              Chart3.getData(chart3DN);
              Chart3.addTooltip("Housing Completions - Year:", "Units");


        const chart4C = chartContent(chart4D, "type", "value", "date", "#chart4", cA1),
              Chart4 = new MultiLineChart(chart4C);

              Chart4.titleX = "Years";
              Chart4.titleY = "Property Prices (Euro)";
              Chart4.yScaleFormat = "millions";

            //   Chart4.tickNumber = 27;
              Chart4.drawChart();

              Chart4.addTooltip("House Prices (€) - Year: ", "thousands", "label");


         //chart5DN = nestData(chart5D, "label", "type", "value"),
        const chart5C = chartContent(chart5D, "type", "value", "date", "#chart5", cA1);

       // const Chart5 = new StackedAreaChart("#chart5", "Years", "€ ( Millions )", "date", ["Value of Mortgage Debt"]);
        const Chart5 = new MultiLineChart(chart5C);
            Chart5.titleX = "Years";
            Chart5.titleY = "€ ( Billions )";
            Chart5.tickNumber = 6;
            Chart5.yScaleFormat = "millions";

            Chart5.drawChart();
            Chart5.addTooltip("Mortgage Debt € - Year:", "millions", "label");


        const Chart6C = {
                e: "#chart6",
                k: "type",
                d: chart6D,
                v: "value",
                c: cA4,
                ySF:"m"
                },

              Chart6 = new GroupStackBar(Chart6C);
              Chart6.addTooltip("Property Types - Year", "thousands", "label");


        const chart8C = {
                element: "#chart8",
                data: chart8D,
                key: "type",
                value: "value",
                titles: ["€ ( Millions )", "Years"],
                cScheme: cA3_2,
                scaleY: "millions",
              },
              Chart8 = new StackBarChart(chart8C);
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
                        "<p style=font-weight:400; font-size:14px;>Of the " +
                        f.properties.WORKFORCE +
                        " workers in this ED (" +

                        f.properties.EDNAME +
                        ")*, " +
                        f.properties.DESTDUBLIN +
                        " (" + p +")" +
                        " work in Dublin City**";

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
                        return "#b30000";
                        break;

                    case percentage > 0.3:
                        return "#e34a33";
                        break;

                    case percentage > 0.1:
                        return "#fc8d59";
                        break;

                    case percentage > 0.05:
                        return "#fdcc8a";
                        break;

                    default:
                        return "#fef0d9";
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

    function hideXAxisLabels(chart, array){
        let element = chart.xAxis;

        element.selectAll(".x-axis .tick")
            .style("display", "none");

        array.forEach( n => {
            d3.select(element._groups[0][0].childNodes[n])
            .style("display", "block");
        })

}

function activeBtn(e){
    let btn = e;

    $(btn).siblings().removeClass('active');
    $(btn).addClass('active');
}
