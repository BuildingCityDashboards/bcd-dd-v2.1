/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset
window.onscroll = function () {
  const subnav = document.querySelector('.themes__subnav')
  var currentScrollPos = window.pageYOffset
  if (prevScrollpos > currentScrollPos) {
    subnav.classList.remove('hide')
  } else {
    subnav.classList.add('hide')
  }
  prevScrollpos = currentScrollPos
}
