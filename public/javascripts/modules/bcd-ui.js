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

const addSpinner = function (divID, src) {
  if (document.querySelector(divID)) {
    let spinner = document.createElement('DIV')
    spinner.className = 'theme__text-chart__spinner'
    spinner.innerHTML = `<p> Contacting ${src} </p> <div class="spinner"><div></div><div></div><div></div></div>`
    document.querySelector(divID).appendChild(spinner)
  }
}
export { addSpinner }

const removeSpinner = function (divID) {
  if (document.querySelector(`${divID} .theme__text-chart__spinner`)) {
    // document.querySelector(`${chartDivIds[0]} .theme__text-chart__spinner`).style.display = 'none'
    document.querySelector(`${divID} .theme__text-chart__spinner`).remove()
  }
}
export { removeSpinner }

const addErrorMessage = function (divID, e) {
  if (document.querySelector(divID)) {
    let errMsg = document.createElement('DIV')
    errMsg.className = 'theme__text-chart__error'
    errMsg.innerHTML = `<p> ${e} </p>`
    let errBtn = document.createElement('BUTTON')
    errBtn.className = 'theme-btn retry-btn'
    errBtn.innerHTML = 'Try again'
    errMsg.appendChild(errBtn)
    document.querySelector(divID).appendChild(errMsg)
  }
}
export { addErrorMessage }

const removeErrorMessage = function (divID) {
  if (document.querySelector(`${divID} .theme__text-chart__error`)) {
    document.querySelector(`${divID} .theme__text-chart__error`).remove()
  }
}
export { removeErrorMessage }
