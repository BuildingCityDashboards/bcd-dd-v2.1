import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { datalist } from 'https://unpkg.com/jsonstat-utils@2.5.5/export.mjs'

const getTableMetadata = (tableJson) => {
  // /***
  // JSON-stat Javascript Toolkit (JJK)
  // ***/
  const jsonStat = JSONstat(tableJson)
  const label = jsonStat.Dataset(0).label
  const source = jsonStat.Dataset(0).source
  const update = jsonStat.Dataset(0).updated
  const length = jsonStat.Dataset(0).value.length
  const dimensions = jsonStat.Dataset(0).id // Dimensions
  const roles = jsonStat.Dataset(0).role
  const geoRole = hasGeoRole(tableJson) || false
  // let categories = dimensions.forEach((dim)=>{
  //
  // })
  let categories = dimensions
    .map((dim) => jsonStat.Dataset(0).Dimension(dim).Category())
    .map((cat) => cat.map(c => c.label))
  // console.log(categories)

  // const categories = jsonStat.Dataset(0).Dimension(0).Category()
  return {
    label: label,
    source: source,
    update: update,
    valueslength: length,
    dimensions: dimensions,
    roles: roles,
    geo: geoRole
    // categories: categories
  }
}

export { getTableMetadata }

// const getTableData = (tableJson) => {
//   // /***
//   // JSON-stat Javascript Toolkit (JJK)
//   // ***/
//   const jsonStat = JSONstat(tableJson)
//   const label = jsonStat.Dataset(0).label
//   const source = jsonStat.Dataset(0).source
//   const update = jsonStat.Dataset(0).updated
//   const length = jsonStat.Dataset(0).value.length
//   const dimensions = jsonStat.Dataset(0).id // Dimensions
//   const roles = jsonStat.Dataset(0).role
//   const geoRole = hasGeoRole(tableJson) || false
//   // let categories = dimensions.forEach((dim)=>{
//   //
//   // })
//   let categories = dimensions
//     .map((dim) => jsonStat.Dataset(0).Dimension(dim).Category())
//     .map((cat) => cat.map(c => c.label))
//   // console.log(categories)
//
//   // const categories = jsonStat.Dataset(0).Dimension(0).Category()
//   return {
//     label: label,
//     source: source,
//     update: update,
//     valueslength: length,
//     dimensions: dimensions,
//     roles: roles,
//     geo: geoRole
//     // categories: categories
//   }
// }
//
// export { getTableMetadata }

/* checks for geo role that would allow for regional filtering */
const hasGeoRole = (tableJson) => {
  const jsonStat = JSONstat(tableJson)
  const geoRole = jsonStat.Dataset(0).role.geo ? jsonStat.Dataset(0).role.geo[0] : false
  return geoRole
}

export { hasGeoRole }

const filterForDublin = () => {
  const filtered = []

  return filtered
}

export { filterForDublin }

// JSONstat(JSON.parse(JSON.stringify(tableJson))) // clone
  // const label = stat.Dataset(0).Dimension(0).Category('IE21').label
  // console.log(label)

  // const dataHasDimension = (dim) => {
  //   return stat.Dataset(0).id.includes(dim)
  // }
  //
  // const aliasesForRegionalDimensions = ['NUTS 3 Regions', 'Meteorological Weather Station']
  // const categoriesForDublin = ['', 'Dublin airport']
  // console.log('dataHasDimension:\n')
  // console.log(dataHasDimension(aliasesForRegionalDimensions[0]))
  //
  // const dimArr = aliasesForRegionalDimensions.map((alias) => dataHasDimension)
  // console.log(dimArr)

  //   (alias) => {
  //   console.log(`Check for ${alias} in ${stat.Dataset(0).source} : ${checkForDimension(stat, alias)}`)
  // })

  // flatten with toTable and a filter function
  // returns an array of objects with key/value pairs
  // const table = stat.Dataset(0).toTable(
  //      { type: 'arrobj', category: 'value'},
  //      function (d) {
  //        if (d['NUTS 3 Regions'] === 'Dublin') {
  //          // console.log(`Found NUTS 3 Regions === Dublin`)
  //          return { year: d.Year, value: d.value * 1000 }
  //        }
  //      }
  //   )
  // console.log('table\n')
  // console.log(table)

  // filter with Splice() and a filter object
  // const subset = JSONstat(json).Dataset(0).Slice(
  //       { 'NUTS 3 Regions': 'IE21' } // select Dublin
  //     )
  // console.log('subset\n')
  // console.log(subset.value.length)
  // console.log(stat.Dataset(0).value.length)

  /***
  JSON-stat Javascript Utilities Suite
  ***/
  // pass in json or JSONstat - performance?
  // const dataListHtml = datalist(stat, {
  //   counter: false,
  //   tblclass: 'datalist',
  //     // numclass: 'number'
  //     // valclass: 'value'
  //   vlabel: 'Thousands'
  // })

  // document.getElementById('statbank-test-datalist').innerHTML = dataListHtml
// }
