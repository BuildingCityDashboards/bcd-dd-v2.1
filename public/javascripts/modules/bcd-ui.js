const populateDropdown = (id, optionsArray) => {
  const dd = document.getElementById(id)
  optionsArray.forEach((optionContent, i) => {
    const o = document.createElement('option')
    o.textContent = optionContent
    o.value = optionContent
    dd.appendChild(o)
  })
}

const populateDropdownFromArray = (element, optionsArray) => {
  optionsArray.forEach((optionContent, i) => {
    const o = document.createElement('option')
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
  const btn = e
  $(btn).siblings().removeClass('active')
  $(btn).addClass('active')
}

export { activeBtn }

const addSpinner = function (divID, src) {
  if (document.querySelector(`#${divID}`)) {
    const spinner = document.createElement('DIV')
    spinner.className = 'theme__text-chart__spinner'
    spinner.innerHTML = `<p> Contacting ${src} </p> <div class="spinner"><div></div><div></div><div></div></div>`
    document.querySelector(`#${divID}`).appendChild(spinner)
  }
}
export { addSpinner }

const removeSpinner = function (divID) {
  if (document.querySelector(`#${divID} .theme__text-chart__spinner`)) {
    // document.querySelector(`${chartDivIds[0]} .theme__text-chart__spinner`).style.display = 'none'
    document.querySelector(`#${divID} .theme__text-chart__spinner`).remove()
  }
}
export { removeSpinner }


/* Usually automatically generated by a chart class error */
const addErrorMessage = function (divID, e) {
  if (document.querySelector(`#${divID}`) && !document.querySelector(`#${divID} .theme__text-chart__error`)) {
    const errMsg = document.createElement('DIV')
    errMsg.className = 'theme__text-chart__error'
    errMsg.innerHTML = `<p> ${e} </p>`
    document.querySelector(`#${divID}`).appendChild(errMsg)
    return errMsg.getAttribute('id')
  }
}
export { addErrorMessage }

const removeErrorMessage = function (divID) {
  if (document.querySelector(`#${divID} .theme__text-chart__error`)) {
    document.querySelector(`#${divID} .theme__text-chart__error`).remove()
  }
}
export { removeErrorMessage }

/* Usually generated by onpage logic after an error e..g a Timeout on a req */
const addErrorMessageButton = function (divID, e) {
  /* there may be an error message already generated by the chart class, remove */
  if (document.querySelector(`#${divID} .theme__text-chart__error`)) {
    document.querySelector(`#${divID} .theme__text-chart__error`).remove()
  }

  if (document.querySelector(`#${divID}`)) {
    const errMsg = document.createElement('DIV')
    errMsg.className = 'theme__text-chart__error'
    errMsg.innerHTML = `<p> ${e} </p>`
    const errBtn = document.createElement('BUTTON')
    errBtn.className = 'theme-btn retry-btn'
    errBtn.innerHTML = 'Try again'
    errBtn.setAttribute('id', `${divID}-retry-btn`)
    errMsg.appendChild(errBtn)
    document.querySelector(`#${divID}`).appendChild(errMsg)
    return errBtn.getAttribute('id')
  }
}

export { addErrorMessageButton }

const removeErrorMessageButton = function (divID) {
  if (document.querySelector(`#${divID} .theme__text-chart__error`)) {
    document.querySelector(`#${divID} .theme__text-chart__error`).remove()
  }
}
export { removeErrorMessageButton }
