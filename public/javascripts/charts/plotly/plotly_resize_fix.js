//Fix for non-responsive chart height bug:
//get the height of the chart div before resize (- padding),
//then apply this to the svg element of the plot after resize
//get the post-resize width of the chart div and apply this to the plot

window.addEventListener('resize', relayout);

function relayout() {
  let elements = document.getElementsByClassName('js-plotly-plot');
  // console.log(elements.length);
  for (let i = 0; i < elements.length; i += 1) {
    // console.log(elements[i]);
    let preHeight = getElementPropertyValue(elements[i], 'height');
    let prePadTop = getElementPropertyValue(elements[i], 'padding-top');
    preHeight = preHeight - prePadTop;

    let postWidth = getElementPropertyValue(elements[i], 'width');
    let update = {
      height: preHeight,
      width: postWidth
    };
    Plotly.relayout(elements[i].id, update);

  }

}

function getElementPropertyValue(e, prop) {
  return parseInt(window.getComputedStyle(e, null).getPropertyValue(prop));
}