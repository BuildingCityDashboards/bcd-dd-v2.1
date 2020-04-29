/**
 * Get a traffic query for a date
 *
 * @param {Date} date
 * @return {string} string to query the traffic API
 *
 * @example
 *
 *     getTrafficQueryForDate(Mon Apr 27 2020 16:55:40 GMT+0100 (Irish Standard Time))
 */

const getTrafficQueryForDate = date => {
    const y = date.getFullYear()
    let m = date.getMonth()
    m += 1 // correct for 1-indexed months
    m = m.toString().padStart(2, '0')
    let day = date.getDate()
    day = day.toString().padStart(2, '0')
    return `${y}/${m}/${day}/per-site-class-aggr-${y}-${m}-${day}.csv`
}

export { getTrafficQueryForDate }

/**
 * Convert the array of readings returned from the API to an object keyed by
 * the 2nd argument -> groupBy operation
 * In this case, the key is coerce to a number before indexing
 *
 * @param {array} readings
 * @param {string} key
 * @return {Obj} Nested object keyed by 'cosit'
 *
 * @example
 *
 *     groupByNumber( array, 'cosit')
 */

const groupByNumber = (readings, key) => {
  let obj = readings.reduce((obj, d) => {
    // create the key if it doesn't exist
    if (!obj.hasOwnProperty(`${+d[key]}`)) {
		    obj[`${+d[key]}`] = {
          dates: {}
        }
    }
    let dateKey = `${d.year}-${d.month.padStart(2, '0')}-${d.day.padStart(2, '0')}`
    // add to date object if it doesn't has the date as a key
    if (!obj[`${+d[key]}`].dates.hasOwnProperty(dateKey)){

        obj[`${+d[key]}`].dates[dateKey] = {
        values : [],
        total: 0
        }
    }
    // add an object with the values
    obj[`${+d[key]}`].dates[dateKey].values.push(
      {
          count: +d.VehicleCount,
          class: +d.class
      })

    //add a convenience property to keep a total
    obj[`${+d[key]}`].dates[dateKey].total += +d.VehicleCount

    return obj
  }, {})
  return obj
}

export { groupByNumber }

// TODO: remove mutation

const trafficJoin = (sensors, readings) => {
  let result = sensors.forEach(s => {
    // console.log(s.id)
    try {
      s.dates = readings[s.id].dates
    } catch (e) {
      console.log('error joining data for cosit ' + s.id) // TODO: return null object to catch this
    }
  })
  return result
}

export { trafficJoin }
