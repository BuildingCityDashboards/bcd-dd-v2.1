$(window).on('load', function(){
    // get the window and animated-circle objects
    var $w = $(window);
    var $circle = $('.animated-circle');
    
    // variables for window height, height and total scroll height
    var wh, h, scrollHeight;
    
    //circumference of a circle with a radius of 25
    var circumference = 157;
 
    // get sizes of the window and the body 
    function setSizes(){
        wh = $w.height();
        console.log("window height"+wh);
        h = $('body').height();
        console.log("body height is "+h);
        // get the  final scroll value
        scrollHeight = h - wh;
        console.log(scrollHeight);
    };

    // calculate the offset using the circumference and percentage
    // update the dashoffset    
    function updateProgress(perc){
        var circle_offset = circumference * perc;
        console.log(circle_offset);
        $circle.css({
            "stroke-dashoffset" : circumference - circle_offset
        });
    }

    setSizes();

    // window event handlers for scroll and resize, what about hidden content?
    $w.on('scroll', function(){
        // get percentage using Math max and min to limit the range 0-100
        var perc = Math.max(0, Math.min(1, $w.scrollTop()/scrollHeight));
        console.log(perc);
        updateProgress(perc);
    }).on('resize', function(){
        setSizes();
        $w.trigger('scroll');
    });
 
});