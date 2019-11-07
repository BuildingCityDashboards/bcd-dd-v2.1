d3.select(window).on("resize", function() {
  let w = window.innerWidth;
  console.log("Resize: " + w);
  dublinBikesChart.drawChart();
  dublinBikesChart.addTooltip("Dublin Bikes at ", "thousands", "label", "", "");

  supplyChart.drawChart();
  supplyChart.addTooltip("Land - Year", "thousands", "label");

  houseCompCharts.drawChart();
  houseCompCharts.addTooltip("Units by Month:", "thousands", "year");
  houseCompCharts.showSelectedLabels([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);

  hCBTChart.drawChart();
  hCBTChart.addTooltip("Total Houses - ", "thousands", "label");

  newCompByTypeChart.drawChart();
  newCompByTypeChart.addTooltip("Total Houses - ", "thousands", "label");

  contributionChart.drawChart();
  contributionChart.addTooltip("In Millions - Year ", "millions", "label", "€");

  housePricesChart.drawChart();
  housePricesChart.addTooltip("In thousands - ", "thousands", "label", "€");

  rentPricesChart.drawChart();
  rentPricesChart.addTooltip("In thousands - ", "thousands", "label", "€");

  rentByBedsChart.drawChart();
  rentByBedsChart.addTooltip(rentByBedTT);

  dccChart.drawChart();
  drccChart.drawChart();
  fccChart.drawChart();
  sdccChart.drawChart();

  dccChart.addTooltip(planningTT);
  drccChart.addTooltip(planningTT);
  fccChart.addTooltip(planningTT);
  sdccChart.addTooltip(planningTT);


  HPM06Charts.drawChart(); // draw axis
  HPM06Charts.addTooltip("Price Index - ", "", "label"); // add tooltip
  HPM06Charts.addBaseLine(100); // add horizontal baseline

  wasteChart.drawChart();
  wasteChart.addTooltip("Waste - Year ", "thousands", "label", "", "Kg");
  recyclingsChart.drawChart();
  recyclingsChart.addTooltip(recyclings_tooltip);
  organicrecyclingsChart.drawChart();
  organicrecyclingsChart.addTooltip(orChart_tooltip);
  waterconsChart.drawChart();
  waterconsChart.addTooltip(wcChart_tooltip);
  riverqualitiesChart.drawChart();
  riverqualitiesChart.addTooltip(rqChart_tooltip);
  greenflagsChart.drawChart();
  greenflagsChart.addTooltip(greenflags_tooltip);
  localagendasChart.drawChart();
  localagendasChart.addTooltip("Projects - Year ", "thousands", "label", "", "");

  //if width is smaller select fewer labels for chart
  // let populationChartLabels = [0, 16, 26, 36, 46, 56, 69, 76, 81, 86, 92, 96, 101, 106]: [0, 26, 41, 51, 61, 71, 81, 92, 101, 106];
  populationChart.tickNumber = 106;
  populationChart.drawChart();
  populationChart.addTooltip("Year: ", "thousands", "label");
  populationChart.showSelectedLabels([0, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106]);
  // populationChart.showSelectedLabels([0, 16, 26, 36, 41, 46, 51, 56, 61, 69, 71, 76, 81, 86, 92, 96, 101, 106]);

  outsideStateChart.drawChart();
  outsideStateChart.addTooltip(outsideStateTT);
  outsideStateChart.showSelectedLabels([0, 2, 4, 6, 8, 10, 12, 14]);
  houseHoldsChart.drawChart();
  houseHoldsChart.addTooltip(houseHoldsTT);
  houseHoldCompositionChart.drawChart();
  houseHoldCompositionChart.addTooltip(houseHoldCompositionTT);

  // Employment charts use 2 charts, 1 hidden by display; need to check which is active
  if (d3.select(".employment_count").classed('active')) {
    d3.select("#chart-employment").style("display", "block");
    d3.select("#chart-emp-rate").style("display", "none");
    employmentStack.drawChart();
    employmentStack.addTooltip("Thousands - Quarter:", "thousands", "label");
    //console.log("#chart-employment is active");

  } else {
    d3.select("#chart-employment").style("display", "none");
    d3.select("#chart-emp-rate").style("display", "block");
    employmentLine.drawChart();
    employmentLine.addTooltip("Employment Annual % Change - ", "percentage2", "label");
    employmentLine.hideRate(true);
    //console.log("#chart-employment is not active")
  };

  if (d3.select(".unemployment_count").classed('active')) {
    d3.select("#chart-unemployment").style("display", "block");
    d3.select("#chart-unemp-rate").style("display", "none");
    unemploymentStack.drawChart();
    unemploymentStack.addTooltip("Thousands - Quarter:", "thousands", "label");
    //console.log("#chart-employment is active");

  } else {
    d3.select("#chart-unemployment").style("display", "none");
    d3.select("#chart-unemp-rate").style("display", "block");
    unemploymentLine.drawChart();
    unemploymentLine.addTooltip("Unemployment Annual % Change - ", "percentage2", "label");
    unemploymentLine.hideRate(true);
    // console.log("unemployment_count is not active")
  };


});