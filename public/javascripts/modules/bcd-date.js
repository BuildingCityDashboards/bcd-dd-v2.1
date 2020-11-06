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
 * @desc Is a given date from the future?
 *
 * @param {Date} date
 * @return {boolean}
 *
 *
 */

function isFutureDate (date) {
  return date.getTime() > new Date().getTime()
}

export { isFutureDate }

/**
 * Get a date shifted n days from today
 *
 * @param {number} n - Number of days to shift from today's date
 * @return {Date} A Date
 *
 *     getDateFromToday(-1) //yesterday's date
 */
const getDateFromToday = n => {
  const d = new Date()
  d.setDate(d.getDate() + parseInt(n))
  return d
}

export { getDateFromToday }

function getDateFromYearMonth () {
  return d3.timeParse('%Y-%b')
}
export { getDateFromYearMonth }

/**
 * Return the short name of the month indexed from 0
 *
 * @param {number} n - month index
 * @return {String} - month name
 *
 *
 */

function getMonthNameShort (i) {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return shortMonths[i]
}

export { getMonthNameShort }

/**
 * Return the full name of the month indexed from 0
 *
 * @param {number} n - month index
 * @return {String} - month name
 *
 *
 */

function getMonthNameLong (i) {
  const longMonths = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return longMonths[i]
}

export { getMonthNameLong }

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
  const dateString = '' + date.getDate() + delim + (parseInt(date.getMonth()) + 1) + delim + date.getFullYear().toString().substr(-2)
  return dateString
}

export { formatDateAsDDMMYY }

/**
 * Gets a date from a string of the for  DDMMYYYY
 *
 * @param {string} - date formatted as a string
 * @return {date} - a date
 *
 * @example tbc
 *
 *
 */
function getDateFromCommonString (dateString, delim = '/') {

  var dateParts = dateString.split(delim);
  // month is 0-based, that's why we need dataParts[1] - 1
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])

}

export { getDateFromCommonString }

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

const locale = d3.formatLocale({
  decimal: '.',
  thousands: ',',
  grouping: [3],
  currency: ['€', ''],
  dateTime: '%a %b %e %X %Y',
  date: '%m/%d/%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})

export { locale }

// const parseTime = d3.timeParse('%d/%m/%Y')
// const parseYear = d3.timeParse('%Y')
// const formatYear = d3.timeFormat('%Y')
// const parseMonth = d3.timeParse('%Y-%b')
// const formatMonth = d3.timeFormat('%b %Y')
// const parseYearMonth = d3.timeParse('%Y-%b') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
