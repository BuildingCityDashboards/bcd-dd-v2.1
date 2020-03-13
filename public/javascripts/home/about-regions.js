Promise.all([d3.xml('/images/home/dublin-regions-map.svg'),
  d3.json('/data/home/dublin-region-data.json')])
  .then(files => {
    let xml = files[0]
    let dublinRegionsJson = files[1]
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
        d3.select(this).style('fill', '#6fc6f6')
      })

      p.on('mouseout', function () {
        d3.select(this).style('fill', d3.select(this).style('fillDefault'))
      })

      p.on('click', function () {
        d3.select(this).style('fill', '#6fc6f6')
        // console.log(d3.select(this.parentNode).attr('data-name'))

        let ref = d3.select(this.parentNode).attr('data-name')
        updateInfoText(dublinRegionsJson[ref])
        // on click, remove the call to action
        d3.select('#regions-info__cta').style('display', 'none')
        // add info card

        d3.select('#regions-info__card').style('display', 'flex')
        //
        d3.select('#regions-info__card').style('visibility', 'visible')
        d3.select('#regions-info__card').style('opacity', 1)
        document.getElementById('regions-info__card').scrollTop = 0
      })
    })

    //
  })
  .catch(e => {
    console.log('error' + e)
  })

function updateInfoText (d) {
  d3.select('#local__title').html(d.ENGLISH + '')
  d3.select('#local__open').html(d.ABOUT)
  d3.selectAll('#local__title__small').html(d.ENGLISH + '')
  d3.select('#local__total-popualtion').html(popFormat(d.POPULATION) + '')
  d3.select('#local__area').html(d.AREA + '')
  d3.select('#local__age').html(d.AGE + '')
  d3.selectAll('#local__income').html(d.INCOME + '')
  d3.select('#local__prePopulation').html(popFormat(d.PREVPOPULATION) + '')
  d3.select('#local__curPopulation').html(popFormat(d.POPULATION) + '')

  let change = getPerChange(d.POPULATION, d.PREVPOPULATION)

  d3.select('#local__populationIndicator').html(indicatorText(change, '#local__populationIndicator', 'increased', false))
  d3.select('#local__populationChange').html(percentage(change) + indicator_f(change, '#local__populationChange', false))

  // change = getPerChange(d.INCOME, d.PREVPINCOME)
  // d3.select('#local__incomeIndicator').html(indicatorText(localdiff, '#local__incomeIndicator', 'grew', false))
  // d3.select('#local__income__prev').html(d.PREVINCOME + '')
  // d3.select('#local__income__change').html(percentage(localdiffIncome) + indicator_f(localdiffIncome, '#local__income__change', false))
}

function getInfoText (region) {
  let text

  return text || 'test'
}
