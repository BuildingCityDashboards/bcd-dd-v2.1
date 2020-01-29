// simple on click to toggle selectors
// select all triggers add mouse click event
$('.s-m__trigger').on('click', function (e) {
  // Prevent default action of element
  e.preventDefault()
  $('.side-menu__overlay').fadeToggle(200)
  $('.side-menu').toggleClass('side-menu--open')
  $('.side-menu__toggler').toggleClass('side-menu__toggler--close')
  $('body').toggleClass('body--lock')
})

$('.dropdown__toggle').click(function () {
  $(this).parent().toggleClass('dropdown--show')
})

$('.search__trigger').on('click', e => {
  e.preventDefault()
  $('.search-box').toggleClass('search-box--open')
  if (!$('.search-box').hasClass('search-box--open')) {
    // document.getElementById('search-results').innerHTML = ''
  }
})
