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
const parseTime = d3.timeParse('%d/%m/%Y')
const formatTime = d3.timeFormat('%d/%m/%Y')
const formatYear = d3.timeFormat('%Y')
const formatMonthYear = d3.timeFormat('%b-%Y')
const parseMonth = d3.timeParse('%b-%y') // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
const parseYear = d3.timeParse('%Y')
const parseYearMonth = d3.timeParse('%Y-%b') // ie 2014-Jan = Wed Jan 01 2014 00:00:00

function parseYearDates (d, v) {
  d.forEach(d => {
    d.label = d[v]
    d[v] = parseYear(d[v])
  })
}

function parseQuarter (d, v) {
  d.forEach(d => {
    d.label = d[v]
    d.date = convertQuarter(d[v])
    d[v] = qToQuarter(d[v])
    d.year = formatYear(d.date)
  })
}

function convertQuarter (q) {
  const splitted = q.split('Q')
  const year = splitted[0]
  const quarterEndMonth = splitted[1] * 3 - 2
  const date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
  return date
}

function qToQuarter (q) {
  const splitted = q.split('Q')
  const year = splitted[0]
  const quarter = splitted[1]
  const quarterString = (year + ' Quarter ' + quarter)
  return quarterString
}

function coerceNum (d, k) {
  d.forEach(d => {
    for (var i = 0, n = k.length; i < n; i++) {
      d[k[i]] = d[k[i]] !== 'null' ? +d[k[i]] : 'unavailable'
    }
    return d
  })
}
