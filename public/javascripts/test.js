d3.json("http://localhost:3000/authorities", function(data) {
    console.log(data);
  });

d3.csv("http://localhost:3000/themes/api/dental", function(data) {
    console.log(data);
});

d3.csv("http://localhost:3000/themes/api/gp", function(data) {
    console.log(data);
});

d3.csv("http://localhost:3000/themes/api/health-center", function(data) {
    console.log(data);
});

d3.csv("http://localhost:3000/themes/api/hospital", function(data) {
    console.log(data);
});

d3.csv("http://localhost:3000/themes/api/pharmacy", function(data) {
    console.log(data);
});