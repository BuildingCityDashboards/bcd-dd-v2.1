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
})
.catch(e => {
  console.log('Error in population fetch')
  console.log(e)
})
