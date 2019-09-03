let title = $(".accordion__heading");
let question = $(".according__question");
let content = $(".accordion__content");


title.click(function() {
  $(this).toggleClass('accordion__heading--active');
  $(this).parent().toggleClass('accordion__item--active');

  // make other accordion__items hidden
  $(this).parent().siblings().children(".accordion__heading").removeClass('accordion__heading--active');
  $(this).parent().siblings().removeClass('accordion__item--active');


  return false;
});