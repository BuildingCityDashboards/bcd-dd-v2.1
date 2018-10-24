    const pFormat = d3.format(".2%")

    Promise.all([
        d3.json("../data/Housing/DublinCityDestPOWCAR11_0.js"),

    ]).then(datafiles => {
        
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