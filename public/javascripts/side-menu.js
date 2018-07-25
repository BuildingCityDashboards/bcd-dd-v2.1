// simple on click to toggle menu
$('.side-menu__toggler').on('click', function () {
    // toggle class for side menu
    $('.side-menu').toggleClass('side-menu--open');
    // bcd-container
    $('.bcd--container').toggleClass('bcd--container--push');
    // toggle class for toggler button
    $(this).toggleClass('side-menu__toggler--closed');
});    
