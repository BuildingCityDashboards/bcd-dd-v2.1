/***

  Property Price card

***/

d3.csv('/data/Housing/HPM06.csv')
.then(propertyPriceData => {
  const propertyPriceColumnNames = propertyPriceData.columns.slice(2)
  const propertyPriceColumnName = propertyPriceData.columns[2]
  let propertyPriceDataSet = coerceData(propertyPriceData, propertyPriceColumnNames)
  propertyPriceDataSet.forEach(d => {
    d.date = parseMonth(d.date)
    d.label = formatMonth(d.date)
  })
  propertyPriceDataSet = propertyPriceDataSet.filter(d => {
  // return d.region === "Dublin";
    return d.region === 'Dublin' && !isNaN(d.all)
  })

  const propertyPriceCardConfig = {
    d: propertyPriceDataSet,
    e: '#ap-glance',
    yV: propertyPriceColumnName,
    xV: 'date',
  // sN: 'region',
    dL: 'label'
  }
  const propertyPriceCard = new CardLineChart(propertyPriceCardConfig)
}).catch(e => {
  console.log('Error in property price fetch')
  console.log(e)
})
