d3.xml('/images/home/dublin-regions-map.svg')
  .then(xml => {
    // "xml" is the XML DOM tree
    let htmlSVG = document.getElementById('map') // the svg-element in our HTML file
    // append the "maproot" group to the svg-element in our HTML file
    htmlSVG.appendChild(xml.documentElement.getElementById('Dublin-ZoneMap'))

    // d3 objects for later use
    let dublinSvg = d3.select(htmlSVG)
    let dccRoot = dublinSvg.select('#Dublin_City')
    let dlrRoot = dublinSvg.select('#Dun_Laoghaire_Rathdown')
    let sdRoot = dublinSvg.select('#South_Dublin')
    let fRoot = dublinSvg.select('#Fingal')

    // get the svg-element from the original SVG file
    const xmlSVG = d3.select(xml.getElementsByTagName('svg')[0])
    // copy its "viewBox" attribute to the svg element in our HTML file
    dublinSvg.attr('viewBox', xmlSVG.attr('viewBox'))

    let dccPath = dccRoot.select('path')
    let dlrPath = dlrRoot.select('path')
    let sdPath = sdRoot.select('path')
    let fPath = fRoot.select('path')

    let paths = [dccPath, dlrPath, sdPath, fPath]
    paths.forEach(p => {
      p.on('mouseover', function () {
        d3.select(this).style('fill', 'red')
      })

      p.on('mouseout', function () {
        d3.select(this).style('fill', d3.select(this).style('fillDefault'))
      })

      p.on('click', function () {
        d3.select(this).style('fill', 'green')
        console.log('click ' + d3.select(this.parentNode).attr('data-name'))
      })
    })
  })
  .catch(e => {
    console.log('error' + e)
  })

function updateInfoText (text) {

}

function getInfoText (region) {
  let text

  return text || 'test'
}
