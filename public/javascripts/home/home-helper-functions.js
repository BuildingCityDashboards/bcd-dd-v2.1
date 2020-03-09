function getPerChange (d1, d0) {
  let value = (d1 - d0) / d0
  if (value === Infinity) {
    return d1
  } else if (isNaN(value)) {
    return 0
  }
  return value
}

function indicatorText (value, selector, text, negative) {
  let indicatorColour,
    indicatorText
  // indicatorSymbol = value > 0 ? " ▲ " : value < 0 ? " ▼ " : "";

  if (negative === true) {
    indicatorColour = value < 0 ? '#20c997' : value > 0 ? '#da1e4d' : '#f8f8f8'
  } else {
    indicatorColour = value > 0 ? '#20c997' : value < 0 ? '#da1e4d' : '#f8f8f8'
  }

  switch (text) {
    case 'increased':
      indicatorText = value < 0 ? 'decreased ' : value > 0 ? 'increased ' : "hasn't changed "
      break

    case 'grew':
      indicatorText = value < 0 ? 'shrunk ' : value > 0 ? 'grew ' : "hasn't changed "
      break

    default:
      indicatorText = 'undefined'
      break
  }

  // d3.select(selector).style("color", indicatorColour);
  return indicatorText
}

function indicator_f (value, selector, negative) {
  let indicatorColour,
    indicatorSymbol = value > 0 ? ' ▲ increase' : value < 0 ? ' ▼ decrease' : ''

  if (negative === true) {
    indicatorColour = value < 0 ? '#20c997' : value > 0 ? '#da1e4d' : '#f8f8f8'
  } else {
    indicatorColour = value > 0 ? '#20c997' : value < 0 ? '#da1e4d' : '#f8f8f8'
  }

  d3.select(selector).style('color', indicatorColour)
  return indicatorSymbol
}
