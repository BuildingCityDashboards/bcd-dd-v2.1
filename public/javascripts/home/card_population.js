/***

  Population card

***/

d3.csv('/data/Demographics/population.csv')
.then(populationData => {
  const populationColumnNames = populationData.columns.slice(2)
  const populationColumnName = populationColumnNames[0]
  const populationDataSet = coerceData(populationData, populationColumnNames)

  const populationConfig = {
    d: populationDataSet,
    e: '#pr-glance',
    yV: populationColumnName,
    xV: 'date',
    // sN: 'region',
    fV: d3.format('.2s'),
    dL: 'date'
  }

  const populationCard = new CardLineChart(populationConfig)
  // d3.select('#population-card')
  //   .select('#card-info-text')
  //   .html('<p>The Population of Dublin in ', ' on <b>2011</b>', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

  console.log(getInfoText('#population-card a', 'The <b>Population</b> of Dublin in ', ' on <b>2011</b>', populationDataSet, populationColumnName, 'date', d3.format('.2s')))
})
.catch(e => {
  console.log('Error in population fetch')
  console.log(e)
})

function getLastDate () {

}
