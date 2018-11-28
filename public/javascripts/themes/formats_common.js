const locale = d3.formatLocale({
        "decimal": ".",
        "thousands": ",",
        "grouping": [3],
        "currency": ["€", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }),
      parseTime = d3.timeParse("%d/%m/%Y"),
      formatTime = d3.timeFormat("%d/%m/%Y"),
      formatYear = d3.timeFormat("%Y"),
      formatMonthYear = d3.timeFormat("%b-%Y"),
      parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
      parseYear = d3.timeParse("%Y"),
      parseYearMonth = d3.timeParse("%Y-%b"); // ie Jan-14 = Wed Jan 01 2014 00:00:00 