/************************************
 * Train Data
 ************************************/
let trainIcon = L.icon({
    iconUrl: '/images/icons/Irish_train.png',
    shadowUrl: '',
    iconSize:     [15, 15], // size of the icon
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



let traindataInterval = 1000 * 30;
let traindataCountdown = traindataInterval;

const fetchtraindata0 = function() {
     d3.xml("/data/Transport/Train_data.XML")
    .then((data) => {
     // console.log("Fetched Train data ");
      // updateAPIStatus('#train-activity-icon', '#train-age', true);
      processtraindata(data);
    })
    .catch(function(err) {
      updateAPIStatus('#train-activity-icon', '#train-age', false);
      })
}



const fetchtraindata = function() {
    //console.log('yes yes ');
  d3.xml("/data/Transport/Train_data.XML")
    .then((data) => {
      console.log("Fetched Train data ");
      updateAPIStatus('#train-activity-icon', '#train-age', true);
      processtraindata(data);
    })
    .catch(function(err) {
      updateAPIStatus('#train-activity-icon', '#train-age', false);
      console.log('no no no_test')
    })
}





// Timed refresh of map station markers symbology using data snapshot
const traindataTimer = setIntervalAsync(
  () => {
    //updateAPIStatus('#train-activity-icon', '#train-age', true);
    return fetchtraindata();
    
  },traindataInterval
  
);
function processtraindata(data)
{
    xmlDoc = data;

    var z = xmlDoc.getElementsByTagName("objTrainPositions");
    for (var k = 0; k < z.length; k++) {
        var x = z[k].childNodes;
        for (var i = 0; i < x.length; i++) {
            var y = x[i];
            if (y.nodeType == 1) {
                //var c1=y.nodeName[];
                //console.log(c1);
    
                if (y.nodeName =='TrainLatitude' )
                {
                    var v1 =y.firstChild.nodeValue;
                }
    
                if (y.nodeName =='TrainLongitude')
                {
                    var v2=y.firstChild.nodeValue;
                }

                if (y.nodeName =='PublicMessage')
                {
                    var PubMsg=y.firstChild.nodeValue;
                }

                if (y.nodeName =='Direction')
                {
                    var Direction=y.firstChild.nodeValue;
                }
                
            }
            
        }

        if (v1 < 54 && v2 > -7) 
        {
        var Smarker= L.marker([v1,v2],{icon: trainIcon})
        .on('mouseover', function() {
            this.bindPopup(PubMsg + '<br>' + Direction).openPopup();
        });
        TrainLayerGroup.addLayer(Smarker);
        }
                    
    }
  
    

TrainLayerGroup.addTo(gettingAroundMap);
    // console.log(data);
    /*xmlDoc = data;
    var z = xmlDoc.getElementsByTagName("objTrainPositions");
    for (var k = 0; k < z.length; k++) {
        var x = z[k].childNodes;
        for (var i = 0; i < x.length; i++) {
            var y = x[i];
            if (y.nodeType == 1) {
                //var c1=y.nodeName[];
                //console.log(c1);
    
                if (y.nodeName == 'TrainLatitude')
                {
                     let Trainlat = y.firstChild.nodeValue;
                }
                if (y.nodeName == 'TrainLongitude')
                {
                    let Trainlong= y.firstChild.nodeValue;
                }
                    //console.log(Trainlat + ":" + Trainlong);
                    //var Smarker= L.marker([Trainlong,Trainlat]).addTo(gettingAroundMap);
                    //markers.push(Smarker);
                //}
                //||  y.nodeName =='TrainLongitude')
                //{ 
              //var Trainnmarker= L.marker([Trainlat,Trainlong]).addTo(gettingAroundMap);
              // console.log("done"+ "<br/>");
                    //markers.push(Trainnmarker);
                //console.log(y.nodeName + ":" + y.firstChild.nodeValue + "<br />");
                //}
            }
        }
        console.log(Trainlat + ":" + Trainlong);
        //var Smarker= L.marker([Trainlong,Trainlat]).addTo(gettingAroundMap);
                    //markers.push(Smarker);
    }*/
   
};





