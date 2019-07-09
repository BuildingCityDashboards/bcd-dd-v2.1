d3.select(window).on("resize", function() {
  console.log("Resize");
  dublinBikesChart.drawChart();
  dublinBikesChart.addTooltip("Dublin Bikes at ", "thousands", "label", "", "");

  populationChart.drawChart();
  populationChart.addTooltip("Year: ", "thousands", "label");
  // populationChart.showSelectedLabels([0, 16, 26, 36, 41, 46, 51, 56, 61, 69, 71, 76, 81, 86, 92, 96, 101, 106]);
  outsideStateChart.drawChart();
  outsideStateChart.addTooltip(outsideStateTT);
  houseHoldsChart.drawChart();
  houseHoldsChart.addTooltip(houseHoldsTT);
  houseHoldCompositionChart.drawChart();
  houseHoldCompositionChart.addTooltip(houseHoldCompositionTT);

  supplyChart.drawChart();
  supplyChart.addTooltip("Land - Year", "thousands", "label");

  houseCompCharts.drawChart();
  houseCompCharts.addTooltip("Units by Month:", "thousands", "year");

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

  wasteChart.drawChart();
  wasteChart.addTooltip("Waste - Year ", "thousands", "label", "", "Kg");
  recyclingsChart.drawChart();
  recyclingsChart.addTooltip(recyclings_tooltip);
  organicrecyclingsChart.drawChart();
  organicrecyclingsChart.addTooltip(orChart_tooltip);
  waterconsChart.drawChart();
  waterconsChart.addTooltip(wcChart_tooltip);
  riverqualitiesChart.addTooltip(rqChart_tooltip);
  greenflagsChart.drawChart();
  greenflagsChart.addTooltip(greenflags_tooltip);
  localagendasChart.drawChart();
  localagendasChart.addTooltip("Projects - Year ", "thousands", "label", "", "");


});