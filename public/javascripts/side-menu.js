// simple on click to toggle selectors
// select all triggers add mouse click event
$('.s-m__trigger').on('click', function(e){
    // Prevent default action of element
    e.preventDefault();
    $('.side-menu__overlay').fadeToggle(200);
    $('.side-menu').toggleClass('side-menu--open');
    $('.side-menu__toggler').toggleClass('side-menu__toggler--close');
    $('body').toggleClass('body--lock');
});

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

$('.card__icon').popover(); 
