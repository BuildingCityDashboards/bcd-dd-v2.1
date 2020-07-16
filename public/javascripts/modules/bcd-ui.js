const populateDropdown = (id, optionsArray) => {
  let dd = document.getElementById(id)
  optionsArray.forEach((optionContent, i) => {
    let o = document.createElement('option')
    o.textContent = optionContent
    o.value = optionContent
    dd.appendChild(o)
  })
}

const populateDropdownFromArray = (element, optionsArray) => {
  optionsArray.forEach((optionContent, i) => {
    let o = document.createElement('option')
    o.textContent = optionContent
    o.value = optionContent
    element.appendChild(o)
  })
}

export { populateDropdownFromArray }

/**
 * Toggle UI button active class
 *
 * @param { Stirng } e DOM element reference string
 *
 * @return { null }
 *
 */

const activeBtn = function (e) {
  let btn = e
  $(btn).siblings().removeClass('active')
  $(btn).addClass('active')
}

export { activeBtn }

const getSpinnerOptions = function () {
  const opts = {
    lines: 13, // The number of lines to draw
    length: 24, // The length of each line
    width: 12, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 0.6, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#ffffff', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'relative' // Element positioning
  }
  return opts
}
export { getSpinnerOptions }

