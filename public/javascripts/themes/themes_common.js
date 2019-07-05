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

  employmentLine.drawChart();
  employmentLine.tickNumber = 24;
  //employmentLine.addTooltip("Employment Annual % Change - ", "percentage2", "label");

  unemploymentLine.drawChart();
  unemploymentLine.tickNumber = 24;
  //unemploymentLine.addTooltip("Unemployment Annual % Change - ", "percentage2", "label");


  employmentStack.drawChart();
  //employmentStack.addTooltip("Thousands - Quarter:", "thousands", "label");
  unemploymentStack.drawChart();
  //unemploymentStack.addTooltip("Thousands - Quarter:", "thousands", "label");


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