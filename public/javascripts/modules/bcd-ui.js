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

