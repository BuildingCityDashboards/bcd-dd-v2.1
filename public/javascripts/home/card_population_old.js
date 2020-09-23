/***

  Population card

***/
let populationCard

d3.csv('/data/Demographics/population.csv')
  .then(populationData => {
    const populationColumnNames = populationData.columns.slice(2)
    const populationColumnName = populationColumnNames[0]
    const populationDataSet = coerceData(populationData, populationColumnNames)

    const populationConfig = {
      d: populationDataSet,
      e: '#population-chart',
      yV: populationColumnName,
      xV: 'date',
      // sN: 'region',
      fV: d3.format('.2s'),
      dL: 'date'
    }

    populationCard = new CardLineChart(populationConfig)

    const info = getInfoText('#population-card a', 'The population of Dublin in ', ' on 2011', populationDataSet, populationColumnName, 'date', d3.format('.2s'))

    d3.select('#population-card')
      .select('#card-info-text')
      .html('<p>' + info + '</p>')
  })
  .catch(e => {
    console.log('Error in population fetch')
    console.log(e)
  })
