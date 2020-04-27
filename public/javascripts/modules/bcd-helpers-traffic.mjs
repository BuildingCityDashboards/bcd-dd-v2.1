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
 * the 'cosit' variable
 *
 * @param {arra} readings
 * @return {Obj} Nested object keyed by 'cosit'
 *
 * @example
 *
 *     getTrafficQueryForDate(Mon Apr 27 2020 16:55:40 GMT+0100 (Irish Standard Time))
 */

const readingsArrayToObject = readings => {
  let obj = readings.reduce((obj, d) => {
    obj[`${+d.cosit}`] = {
      count: +d.VehicleCount,
      class: +d.class,
      date: `${d.year}-${d.month.padStart(2, '0')}-${d.day.padStart(2, '0')}`
    }
    return obj
  }, {})
  return obj
}

export { readingsArrayToObject }


const trafficJoin = (sensors, readings) => {
  let result = sensors.forEach(s => {
    // console.log(s.id)
    try {
      s.count = readings[s.id].count
      s.class = readings[s.id].class
      s.date = readings[s.id].date
    } catch (e) {
      console.log('error looking up ' + s.id) // TODO: return null object to catch this
    }
  })
  return result
}

export { trafficJoin }
