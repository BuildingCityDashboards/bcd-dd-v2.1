/**
 * Get a date shifted n days from today
 *
 * @param {number} n - Number of days to shift from today's date
 * @return {Date} A Date
 *
 * @example
 *
 *     getDateFromToday(-1) //yesterday's date
 */
const getDateFromToday = n => {
  let d = new Date()
  d.setDate(d.getDate() + parseInt(n))
  return d
}

export { getDateFromToday }

/**
 * Formats a date in the form: DD-MM-YY
 *
 * @param {date} date - a date
 * @return {string} - date formatted as a string
 *
 * @example
 *
 *
 */

function formatDateAsShortString (date) {
  let dateString = date.getDate() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getFullYear().toString().substr(-2)
  return dateString
}

export { formatDateAsShortString }

/**
 * Formats a date as a quarter year string of the form: YYYY-QN
 *
 * @param {date} date - a date
 * @return {string} - date formatted as a string
 *
 * @example
 *
 *
 */

function formatDateAsQuarterString (date) {
  const newDate = new Date()
  newDate.setMonth(date.getMonth() + 1)
  const year = (date.getFullYear())
  const q = Math.ceil((newDate.getMonth()) / 3)
  return year + '-Q' + q
}

export { formatDateAsQuarterString }

 // function convertQuarter (q) {
 //   const splitted = q.split('Q')
 //   const year = splitted[0]
 //   const quarterEndMonth = splitted[1] * 3 - 2
 //   const date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
 //   return date
 // }
