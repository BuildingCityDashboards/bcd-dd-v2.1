d3.csv('/data/Housing/processed/NDQ05.csv')
.then(completionsData => {
  const completionsColumnNames = completionsData.columns.slice(5)
  const completionsColumnName = completionsColumnNames[0]
  const completionsDataSet = coerceData(completionsData, completionsColumnNames)
// console.log(completionsDataSet)

  completionsDataSet.forEach(d => {
    d.quarter = convertQuarter(d.quarter)
    d.label = formatQuarter(d.quarter)
  })

  const completionsConfig = {
    d: completionsDataSet,
    e: '#hc-glance',
    yV: 'Dublin',
    xV: 'quarter',
  // sN: 'region',
    dL: 'label'
  }
  const completionsCard = new CardLineChart(completionsConfig)
})
