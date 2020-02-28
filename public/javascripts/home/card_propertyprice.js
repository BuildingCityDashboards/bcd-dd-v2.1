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
  let info = getInfoText('#property-price-card a', 'The Property Price Index for Dublin in ', ' on the previous month', propertyPriceDataSet, propertyPriceColumnName, 'label', d3.format(''))
  d3.select('#property-price-card')
   .select('#card-info-text')
   .html('<p>' + info + '</p>')
}).catch(e => {
  console.log('Error in property price fetch')
  console.log(e)
})
