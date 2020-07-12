/**
 * Is a given date falling today?
 *
 * @param {Date} date
 * @return {boolean}
 *
 *     isToday(Wed Nov 06 2019 00:10:00 GMT+0000 (Greenwich Mean Time))
 */

const isToday = date => {
  const today = new Date()
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
}

export { isToday }

/**
 * Get a date shifted n days from today
 *
 * @param {number} n - Number of days to shift from today's date
 * @return {Date} A Date
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
 * @example tbc
 *
 *
 */

function formatDateAsDDMMYY (date, delim = '-') {
  let dateString = '' + date.getDate() + delim + (parseInt(date.getMonth()) + 1) + delim + date.getFullYear().toString().substr(-2)
  return dateString
}

export { formatDateAsDDMMYY }

/**
 * Formats a date as a quarter year string of the form: YYYY-QN
 *
 * @param {date} date - a date
 * @return {string} - date formatted as a string
 *
 * @example tbc
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

function convertQuarterToDate (q) {
  const splitted = q.split('Q')
  const year = splitted[0]
  const quarterStartMonth = splitted[1] * 3 - 2
  const date = d3.timeParse('%m %Y')(quarterStartMonth + ' ' + year)
  return date
}

export { convertQuarterToDate }

// const parseTime = d3.timeParse('%d/%m/%Y')
// const parseYear = d3.timeParse('%Y')
// const formatYear = d3.timeFormat('%Y')
// const parseMonth = d3.timeParse('%Y-%b')
// const formatMonth = d3.timeFormat('%b %Y')
// const parseYearMonth = d3.timeParse('%Y-%b') // ie 2014-Jan = Wed Jan 01 2014 00:00:00

