const parseTime = d3.timeParse("%d/%m/%Y"),
      formatTime = d3.timeFormat("%d/%m/%Y"),
      formatYear = d3.timeFormat("%Y"),
      formatMonthYear = d3.timeFormat("%b-%Y"),
      parseMonth = d3.timeParse("%b-%y"), // ie Jan-14 = Wed Jan 01 2014 00:00:00 GMT+0000 (Greenwich Mean Time)
      parseYear = d3.timeParse("%Y"),
      parseYearMonth = d3.timeParse("%Y-%b"); // ie Jan-14 = Wed Jan 01 2014 00:00:00 