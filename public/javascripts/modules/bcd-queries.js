/**
 * Get a traffic query for a date
 *
 * @param {Date} date
 * @return {string} string to query the traffic API
 *
 * @example
 *
 *     getTrafficQueryForDate()
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
