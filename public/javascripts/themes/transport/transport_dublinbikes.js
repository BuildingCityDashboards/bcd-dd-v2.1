/************************************
 * Bikes
 ************************************/
let dublinBikesChart;
Promise.all([
    d3.json("/data/Transport/dublinbikes/day.json"),
    d3.json("/data/Transport/dublinbikes/week.json"),
    d3.json("/data/Transport/dublinbikes/month.json")
  ])
  .then(data => {
    console.log("Bikes data length " + data[0].length);
    // const dayFormat = d3.timeFormat("%a, %I:%M");
    let keys = ["Bikes in use", "Bikes available"]; //this controls stacking order

    let dataDay = data[0];
    let dataWeek = data[1];
    let dataMonth = data[2];

    //TODO: is coercing to a date on the client  slow for large query spans (month)?

    /*For stacked area chart*/
    dataDay.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      d["date"] = new Date(d["date"]);
    });

    dataWeek.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      d["date"] = new Date(d["date"]);
    });

    dataMonth.forEach(d => {
      //  d["Total available (daily)"] = +d["Total available (daily)"];
      d["date"] = new Date(d["date"]);
    });

    /* For multiline chart */
    // dataDay.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });
    //
    // dataWeek.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });
    //
    // dataMonth.forEach(d => {
    //   // d["available_bikes"] = +d["available_bikes"];
    //   d["key"] = d["key"].replace(/_/g, " ");
    //   d["key"] = d["key"].charAt(0).toUpperCase() + d["key"].slice(1);
    //   // console.log("\n\nd key: " + JSON.stringify(d["key"]));
    //
    //   // keys.push(d["key"]);
    //   d["values"].forEach(v => {
    //     v["date"] = new Date(v["date"]); //parse to date
    //   });
    // });

    // console.log("Bikes Keys: " + JSON.stringify(keys));

    const dublinBikesContent = {
      e: "#chart-dublinbikes",
      d: dataDay,
      //k: dublinBikesData, //?
      ks: keys, //For StackedAreaChart-formatted data need to provide keys
      xV: "date", //expects a date object
      yV: "value",
      tX: "Time", //string axis title
      tY: "No of bikes"
    };

    dublinBikesChart = new StackedAreaChart(dublinBikesContent);
    dublinBikesChart.drawChart();
    // addTooltip(title, format, dateField, prefix, postfix)
    //format just formats comms for thousands etc
    dublinBikesChart.addTooltip("Dublin Bikes at ", "thousands", "label", "", "");
    updateTextInfo(dataDay);

    d3.select("#dublinbikes_day").on("click", function() {
      activeBtn(this, dublinBikesChart);
      dublinBikesChart.d = dataDay;
      dublinBikesChart.drawChart();
      //dublinBikesChart.updateChart();
      dublinBikesChart.addTooltip("Dublin Bikes at ", "thousands", "label", "", "");
      updateTextInfo(dataDay);
    });

    d3.select("#dublinbikes_week").on("click", function() {
      activeBtn(this, dublinBikesChart);
      dublinBikesChart.d = dataWeek;
      dublinBikesChart.drawChart();
      //dublinBikesChart.updateChart();
      dublinBikesChart.addTooltip("Dublin Bikes at ", "thousands", "label", "", "");
      updateTextInfo(dataWeek);
    });

    d3.select("#dublinbikes_month").on("click", function() {
      activeBtn(this, dublinBikesChart);
      dublinBikesChart.d = dataMonth;
      dublinBikesChart.drawChart();
      //dublinBikesChart.updateChart();
      dublinBikesChart.addTooltip("Dublin Bikes at ", "thousands", "label", "", "");
      updateTextInfo(dataMonth);
    });

  }).catch(function(error) {
    console.log(error);
  });

//End of bikes data load

function chartContent(data, key, value, date, selector) {

  data.forEach(function(d) { //could pass types array and coerce each matching key using dataSets()
    d.label = d[date];
    d.date = parseYearMonth(d[date]);
    d[value] = +d[value];
  });

  // nest the processed data by regions
  const nest = d3.nest().key(d => {
    return d[key];
  }).entries(data);

  // get array of keys from nest
  const keys = [];
  nest.forEach(d => {
    keys.push(d.key);
  });

  return {
    e: selector,
    d: nest,
    xV: date,
    yV: value
  }

}

function activeBtn(e, dublinBikesChart) {
  let btn = e;
  //var act = e.active ? true : false
  // newOpacity = active ? 0 : 1;
  $(btn).siblings().removeClass('active');
  $(btn).addClass('active');
  let G_chart = dublinBikesChart;
  G_chart.updateChart();
}

function updateTextInfo(data) {
  //console.log("Bikes data " + JSON.stringify(data) + "\n");
  let peakUse = getMax(data, "Bikes in use");
  d3.select('#bikes-in-use-count').text(peakUse["Bikes in use"]);
  d3.select('#max-bikes-use-time').text(peakUse["label"]);//.split(',')[0]);
  d3.select('#bikes-available').text(peakUse["Bikes available"]);
  // d3.select('#stands-count').html(bikeStands);
  let currentBikes = data[data.length-1]["Bikes in use"];
  let timePeriod = getTimePeriod(data);
  let percentChange = getPercentChange(data, "Bikes in use");
  let previousTime = getPreviousTime(data);
  d3.select('#current-bikes-in-use-count').text(currentBikes);
  d3.select('#time-period').text(timePeriod);
  d3.select('#percent-change-with-indicator').text(indicatorText(percentChange.toPrecision(2))); 
  setIndicatorColour(percentChange, "#percent-change-with-indicator");
  d3.select('#previous-time').text(previousTime);


  // console.log("Bike Station: \n" + JSON.stringify(data_[0].name));
  // console.log("# of bike stations is " + data_.length + "\n");
}
//ars are array and property to be evaluated as a string
function getMax(data, p) {
  let max = data.reduce((acc, curr) => {
    return acc[p] > curr[p] ? acc : curr;
  });
  console.log("Bikes info " + JSON.stringify(max));
  return max;
};

//ars are array and property to be evaluated as a string
function getPercentChange(data, p) {
  let percent = 0; //default is no change
  if (data[0][p] >0 ) {
	
	//may be negative, which is ok for now
	percent = 100*((data[data.length-1][p] - data[0][p]) / data[0][p]);
  } else if (data[data.length-1][p] > 0) { 
    //special case where change is from 0 to anything other than 0
	percent = 100;
  }
  return percent;
};

function getTimePeriod(data) {
  //may be negative, which is ok for now
  let period = "";
  switch(data.length) {
	case 25: 
		period = "day";
		break;
	
	case 169:
		period = "week";
		break;
	
	default:
		period = "month";
		break;	
  
  }

  return period;
};

function indicatorText(value){
  let indicatorColour,
      indicatorText,
	  directionText,
      indicatorSymbol = value > 0 ? " ▲ " : value < 0 ? " ▼ " : " ";

  directionText = value < 0 ? "fewer than it was " : value > 0 ? "greater than it was " : " no change from ";

	
  indicatorText = "" + Math.abs(value) + "% " + indicatorSymbol + directionText;
      
  return indicatorText;
}

function setIndicatorColour(value, selector) {
	
	  if(value < 0 ){
      indicatorColour = value < 0 ? "#da1e4d" : value > 0 ? "#20c997" : "#f8f8f8";
  }
  else{
      indicatorColour = value > 0 ? "#20c997" : value < 0 ? "#da1e4d" : "#f8f8f8";
  }
  
  d3.select(selector).style("color", indicatorColour);
}

function getPreviousTime(data) {
  let previous = "";
  switch(data.length) {
	case 25: 
		previous = "yesterday";
		break;
	
	case 169:
		previous = "one week ago";
		break;
	
	default:
		previous = "one month ago";
		break;	
  
  }
  return previous;
};