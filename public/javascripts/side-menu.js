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
    document.getElementById('search-results').innerHTML = ''
  }
})

// let searchData;
// d3.json("/data/search-data.json").then((data) => {
//   searchData = data;
// });

function searchSite () {
  console.log('Searching')
  let s = document.getElementById('site-search')
  let input = s.value

  if (input.length > 2 && searchData) {
    console.log('input:' + input)
    let reg = new RegExp(input, 'i')
    const res = searchData[0]['title'].match(reg)
    if (res) {
      console.log(searchData[0]['link'])
      let html = `<a href= ${searchData[0]['link']}> ${searchData[0]['title']} </a>`
      document.getElementById('search-results').innerHTML = html
    }
  } else {
    document.getElementById('search-results').innerHTML = ''
  }
}

// function myFunction() {
//     document.getElementById("myDropdown").classList.toggle("show");
// }
// // alternative no jquery
// // function to get node array
// function getNodeArray(selector){
//     var nodeArray = Array.from(document.querySelectorAll(selector));
//     return nodeArray;
// }
// // get elements
// var overlay = document.querySelector('.side-menu__overlay');
// var menu = document.querySelector('.side-menu');
// var button  = document.querySelector('.side-menu__toggler');

// // Creare array of all elements with class trigger
// const triggerArray = getNodeArray('.s-m__trigger');

// // For each element add click event and toggle selected classes.
// triggerArray.forEach(target => { target.addEventListener("click", function(e){
//         // Prevent default action of element
//         e.preventDefault();
//         // toggle body
//         document.body.classList.toggle("show");
//         // toggle fade - could add fade function
//         overlay.classList.toggle("fade");
//         menu.classList.toggle("side-menu--open");
//         button.classList.toggle("side-menu__toggler--close");
//         })});
