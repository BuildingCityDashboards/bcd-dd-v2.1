/**
 *
 *
 * @param { Object }
 * @return { boolean } isClean
 *
 *
 */

'use strict'

const hasCleanValue = d => {
  return d.value != null && !isNaN(+d.value)
}

export { hasCleanValue }

/**
 * Coerce data for each column in wide-format table (csv)
 *
 * @param { Object[] } data
 * @param { string[] } columnNames
 * @return {Object[] }
 *
 *
 */
function coerceWideTable (data, columnNames) {
  const coercedData = data.map(d => {
    for (var i = 0, n = columnNames.length; i < n; i++) {
      // d[columns[i]] !== "null" ? d[columns[i]] = +d[columns[i]] : d[columns[i]] = "unavailable";
      d[columnNames[i]] = +d[columnNames[i]]
    }
    return d
  })
  return coercedData
}

export { coerceWideTable }

function extractObjectArrayWithKey (dataArray, key) {
  const outArray = dataArray.map(d => {
    const obj = {
      label: d.Quarter,
      value: parseInt(d[key].replace(/,/g, '')),
      variable: key,
      date: convertQuarterToDate(d.Quarter)
    }
    return obj
  })
  return outArray
}

/**
 * // TODO: Change tabular data from wide to long (flattened) format
 *
 * @param {}
 * @return {}
 *
 *
 */

const formatWideToLong = csv => {
// TODO:
  return csv
}

export { formatWideToLong }

const stackNest = (data, date, name, value) => {
  const nested_data = d3Nest(data, date)
  const mqpdata = nested_data.map(function (d) {
    const obj = {
      label: d.key
    }
    d.values.forEach(function (v) {
      obj.date = v.date
      obj.year = v.year
      obj[v[name]] = v[value]
    })
    return obj
  })
  return mqpdata
}

export { stackNest }

/**
 * // TODO: Change tabular data from long (flat) to wide format
 *
 * @param {}
 * @return {}
 *
 *
 */

const longToWide = (csv) => {
// TODO:
  return csv
}

export { longToWide }

// function formatQuarter (date) {
//   let newDate = new Date()
//   newDate.setMonth(date.getMonth() + 1)
//   let year = (date.getFullYear())
//   let q = Math.ceil((newDate.getMonth()) / 3)
//   return 'Quarter ' + q + ' ' + year
// }
//
// function filterbyDate (data, dateField, date) {
//   return data.filter(d => {
//     return d[dateField] >= new Date(date)
//   })
// }
//
// function filterByDateRange (data, dateField, dateOne, dateTwo) {
//   return data.filter(d => {
//     return d[dateField] >= new Date(dateOne) && d[dateField] <= new Date(dateTwo)
//   })
// }
//
// function nestData (data, label, name, value) {
//   let nested_data = d3.nest()
//     .key(function (d) {
//       return d[label]
//     })
//     .entries(data) // its the string not the date obj
//
//   let mqpdata = nested_data.map(function (d) {
//     let obj = {
//       label: d.key
//     }
//     d.values.forEach(function (v) {
//       obj[v[name]] = v[value]
//       obj.date = v.date
//     })
//     return obj
//   })
//   return mqpdata
// }
// function convertQuarter (q) {
//   let splitted = q.split('Q')
//   let year = splitted[0]
//   let quarterEndMonth = splitted[1] * 3 - 2
//   let date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
//   return date
// }
//
// function qToQuarter (q) {
//   let splitted = q.split('Q')
//   let year = splitted[0]
//   let quarter = splitted[1]
//   let quarterString = ('Quarter ' + quarter + ' ' + year)
//   return quarterString
// }
