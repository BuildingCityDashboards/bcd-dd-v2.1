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
  // console.log('open search')
  // e.preventDefault()
  $('.search-box').toggleClass('search-box--open')
  // document.getElementById('userinput').focus()
  setTimeout(function () { $('#userinput').focus() }, 100)
  if (!$('.search-box').hasClass('search-box--open')) {
    // console.log('close search')
    setTimeout(function () { $('#userinput').blur() }, 100)
  }
})

document.addEventListener('click', closeSearch)

function closeSearch (e) {
  // console.log('call close search')

  if (!e.target.closest('.search-box') && !e.target.closest('.search__trigger')) {
    // console.log('click out')

    if ($('.search-box').hasClass('search-box--open')) {
      $('.search-box').toggleClass('search-box--open')
    }
  }
}

