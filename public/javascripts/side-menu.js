$('.side-menu__toggler').on('click', function () {
    $('.side-menu').toggleClass('side-menu--open');
    $(this).toggleClass('side-menu__toggler--closed');
});    
