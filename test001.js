d3.csv('/data/stop_times').then(function(d3) {

    console.log(d3);
    //updateM50_N(d3);
  }).catch(function(err) {
    console.error("Error fetching M50 North bound Path");
  });