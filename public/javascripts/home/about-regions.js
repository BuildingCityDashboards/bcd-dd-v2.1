Promise.all([d3.xml('/images/home/dublin-regions-map.svg'),
  d3.json('/data/home/dublin-region-data.json')])
  .then(files => {
    const xml = files[0]
    const dublinRegionsJson = files[1]
    // "xml" is the XML DOM tree
    const htmlSVG = document.getElementById('map') // the svg-element in our HTML file
    // append the "maproot" group to the svg-element in our HTML file
    htmlSVG.appendChild(xml.getElementById('Dublin-ZoneMap'))

    // // d3 objects for later use
    const dublinSvg = d3.select(htmlSVG)
    const dccRoot = dublinSvg.select('#Dublin_City')
    const dlrRoot = dublinSvg.select('#Dun_Laoghaire_Rathdown')
    const sdRoot = dublinSvg.select('#South_Dublin')
    const fRoot = dublinSvg.select('#Fingal')

    // // get the svg-element from the original SVG file
    const xmlSVG = d3.select(xml.getElementsByTagName('svg')[0])
    // // copy its "viewBox" attribute to the svg element in our HTML file
    dublinSvg.attr('viewBox', xmlSVG.attr('viewBox'))

    const dccPath = dccRoot.select('path')
    const dccText = dccRoot.select('text')
    const dlrPath = dlrRoot.select('path')
    const dlrText = dlrRoot.select('text')
    const sdPath = sdRoot.select('path')
    const sdText = sdRoot.select('text')
    const fPath = fRoot.select('path')
    const fText = fRoot.select('text')

    const paths = [dccPath, dlrPath, sdPath, fPath]
    const texts = [dccText, dlrText, sdText, fText]

    texts.forEach(t => {
      t.on('mouseover', function () {
        d3.select(this.parentNode).select('path').style('fill', '#6fc6f6')
      })

      t.on('mouseout', function () {
        console.log('mouseout text')
        d3.select(this.parentNode).select('path').style('fill', d3.select(this).style('fillDefault'))
      })

      t.on('click', function () {
        d3.select(this.parentNode).select('path').style('fill', '#6fc6f6')

        const ref = d3.select(this.parentNode).attr('data-name')
        // alert(ref)
        updateInfoText(dublinRegionsJson[ref])
        // on click, remove the call to action
        d3.select('#regions-info__cta').style('display', 'none')
        d3.select('#regions-info__cta-arrow').style('display', 'none')
        d3.select('#regions-info__card').style('display', 'flex')
        d3.select('#regions-info__card').style('visibility', 'visible')
        d3.select('#regions-info__card').style('opacity', 1)
        document.getElementById('regions-info__card').scrollTop = 0
      })
    })

    paths.forEach(p => {
      p.on('mouseover', function () {
        d3.select(this).style('fill', '#6fc6f6')
      })

      p.on('mouseout', function () {
        console.log('mouseout path')
        d3.select(this).style('fill', d3.select(this).style('fillDefault'))
      })

      p.on('click', function () {
        d3.select(this).style('fill', '#6fc6f6')
        // console.log(d3.select(this.parentNode).attr('data-name'))
        // let e = document.getElementById('about-dublin__card')
        // e.scrollIntoView()

        const ref = d3.select(this.parentNode).attr('data-name')
        // alert(ref)
        updateInfoText(dublinRegionsJson[ref])
        // on click, remove the call to action
        d3.select('#regions-info__cta').style('display', 'none')
        d3.select('#regions-info__cta-arrow').style('display', 'none')

        // This animated transition doesn't work

        d3.select('#regions-info__card').style('display', 'flex')

        // document.getElementById('regions-info').scrollTop = 0
        // //
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

  const change = getPerChange(d.POPULATION, d.PREVPOPULATION)

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
