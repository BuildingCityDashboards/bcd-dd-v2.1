const stackNest = (data, date, name, value) => {
  let nested_data = d3Nest(data, date)
  let mqpdata = nested_data.map(function (d) {
    let obj = {
      label: d.key
    }
    d.values.forEach(function (v) {
      obj.date = v.date
      obj.year = v.year
      obj[v[name]] = v[value]
    })
    return obj
  })
  return mqpdata
}

export { stackNest}

