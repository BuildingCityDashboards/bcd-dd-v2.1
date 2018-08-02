var $title = $(".accordion__heading");
var $content = $(".accordion__content");

$title.click(function () {
  $(this).parent().toggleClass('accordion__item--active');
  // make other accordion__items hidden
  $(this).parent().siblings().removeClass('accordion__item--active');
  return false;
});