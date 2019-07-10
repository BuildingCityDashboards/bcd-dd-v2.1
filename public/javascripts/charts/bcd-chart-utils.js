const textWrap = function(text, width, xpos = 0, limit = 4) {
  // console.log(`text, width ${width}, xpos = ${xpos}, limit= ${limit}`)
  text.each(function() {
    var words,
      word,
      line,
      lineNumber,
      lineHeight,
      y,
      dy,
      tspan;

    text = d3.select(this);

    words = text.text().split(/\s+/).reverse();
    line = [];
    lineNumber = 0;
    lineHeight = 1;
    y = text.attr("y");
    dy = parseFloat(text.attr("dy"));
    tspan = text
      .text(null)
      .append("tspan")
      .attr("x", xpos)
      .attr("y", y)
      .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node() && tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));

        if (lineNumber < limit - 1) {
          line = [word];
          tspan = text.append("tspan")
            .attr("x", xpos)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
          // if we need two lines for the text, move them both up to center them
          text.classed("adjust-upwards", true);
        } else {
          line.push("...");
          tspan.text(line.join(" "));
          break;
        }
      }
    }
  });
}