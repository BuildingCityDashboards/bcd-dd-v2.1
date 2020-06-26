
// $(function() {

//     var newHash      = "",
//         $mainContent = $("#main-content"),
//         $pageWrap    = $("#page-wrap"),
//         baseHeight   = 0,
//         $el;
        
//     $pageWrap.height($pageWrap.height());
//     baseHeight = $pageWrap.height() - $mainContent.height();
    
//     $("nav").delegate("a", "click", function() {
        
//         window.location.hash = $(this).attr("href");
//         return false;
//     });
    
//     $(window).bind('hashchange', function(){
//     //alert('2')
//         newHash = window.location.hash.substring(1);
        
//         if (newHash) {
//             $mainContent
//                 .find("#guts")
//                 .fadeOut(200, function() {
//                     $mainContent.hide().load(newHash + " #guts", function() {
//                         $mainContent.fadeIn(200, function() {
//                             $pageWrap.animate({
//                               height: baseHeight + $mainContent.height() + "px"
//                             });
//                         });
//                         $("nav a").removeClass("current");
//                         $("nav a[href="+newHash+"]").addClass("current");
//                     });
//                 });
//         };
        
//     });
    
//     $(window).trigger('hashchange');

// });


//$(document).ready(function(){
    $("ul.nav li a").click(function(e){ 
        e.preventDefault();
        var url = $(this).attr('href'); //get the link you want to load data from
        //alert('You Clicked ---:  ' + url)
        $.ajax({ 
         type: 'GET',
         url: url,
         success: function(data) { 
            $("#main_page").html(data); 
        } 
       }); 
     });
  //});