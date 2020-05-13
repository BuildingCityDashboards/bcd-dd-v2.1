function coerceData (data, columns) {
  coercedData = data.map(d => {
    for (var i = 0, n = columns.length; i < n; i++) {
      d[columns[i]] = +d[columns[i]]
    }
    return d
  })
  return coercedData
}

function convertQuarter (q) {
  const splitted = q.split('Q')
  const year = splitted[0]
  const quarterEndMonth = splitted[1] * 3 - 2
  const date = d3.timeParse('%m %Y')(quarterEndMonth + ' ' + year)
  return date
}

function formatQuarter (date) {
  const newDate = new Date()
  newDate.setMonth(date.getMonth() + 1)
  const year = (date.getFullYear())
  const q = Math.ceil((newDate.getMonth()) / 3)
  return year + ' Q' + q
}

const parseTime = d3.timeParse('%d/%m/%Y')
const parseYear = d3.timeParse('%Y')
const formatYear = d3.timeFormat('%Y')
const parseMonth = d3.timeParse('%Y-%b')
const formatMonth = d3.timeFormat('%b %Y')
const breakPoint = 768

let locale = d3.formatLocale({
  'decimal': '.',
  'thousands': ',',
  'grouping': [3],
  'currency': ['€', ''],
  'dateTime': '%a %b %e %X %Y',
  'date': '%m/%d/%Y',
  'time': '%H:%M:%S',
  'periods': ['AM', 'PM'],
  'days': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  'shortDays': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  'shortMonths': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})
