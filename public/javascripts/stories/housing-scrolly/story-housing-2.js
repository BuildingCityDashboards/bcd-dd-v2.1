/**
 *
 *
 * @param {}
 * @return {}
 *
 *
 */

// TODO:
// load page metadata for n narrative objects and n charts
// load n chart plot objects into array
// draw chart based on TwoStep interaction

import { getPlotObjectFig1 } from '/javascripts/stories/housing-scrolly/story-housing2-fig1.js'
import { getPlotObjectFig2 } from '/javascripts/stories/housing-scrolly/story-housing2-fig2.js'
import { getMapFig3 } from '/javascripts/stories/housing-scrolly/story-housing2-fig3.js'
import { getPlotObjectFig4 } from '/javascripts/stories/housing-scrolly/story-housing2-fig4.js'
import { getPlotObjectFig5 } from '/javascripts/stories/housing-scrolly/story-housing2-fig5.js'
import { getPlotObjectFig6 } from '/javascripts/stories/housing-scrolly/story-housing2-fig6.js'
import { getPlotObjectFig7 } from '/javascripts/stories/housing-scrolly/story-housing2-fig7.js'
import { getPlotObjectFig8 } from '/javascripts/stories/housing-scrolly/story-housing2-fig8.js'
// import { getMapFig8 } from '/javascripts/stories/housing-scrolly/story-housing2-fig8.js'

// import { afterplotFixesFig2 } from '/javascripts/stories/housing-scrolly/story-housing2-fig2.js'
// import { afterplotFixesFig7 } from '/javascripts/stories/housing-scrolly/story-housing2-fig7.js'

(async () => {
  const CHART_STICKY_ELEMENT = 'chart-sticky-housing'
  const MAP_STICKY_ELEMENT = 'map-sticky-housing'
  const chartSticky = document.getElementById(CHART_STICKY_ELEMENT)
  const mapSticky = document.getElementById(MAP_STICKY_ELEMENT)

  const chartWrapper = document.querySelector('.sticky-chart-wrapper')

  const stylePlotlyLayout = po => {
    if (po.hasOwnProperty('layout')) {
      // console.log(i + ' has layout')
      po.layout.modebar = {
        'bgcolor': 'rgba(0, 0, 0, 0)'
      }
    }
    return po
  }

  // TODO: this is dumb, but must wait for a genralised function to return plot objects
  let plotObjects = []

  let plotObject = {}
  let map = {} // initialise
  plotObject = await getPlotObjectFig1()
  stylePlotlyLayout(plotObject)
  // console.log('plot 1 loaded')
  plotObjects.push(plotObject)

  const drawPlot = async (event) => {
    // console.log('Waypoint ' + JSON.stringify(event) + ' triggered')
    let chartState = chartSticky.getAttribute('data-status')
    let mapState = mapSticky.getAttribute('data-status')
    // console.log(chartState)
    // on trigger at index, get state based on index
    console.log(event.index + ' map state: ' + mapState + ' c state: ' + chartState)
    // TODO: don't use indexes of map elements here in this way

    // indexes of map elements
    if (event.index == 2) {
      if (mapState === 'hidden') {
        // console.log('draw map and show')
        // console.log('map')
        // console.log(map)

        // hide current chart
        chartSticky.removeAttribute('data-status')
        chartSticky.setAttribute('data-status', 'hidden')
        chartSticky.style.display = 'none'

        // unhide map
        mapSticky.style.display = 'block'
        if (map.hasOwnProperty('options')) {
          map.invalidateSize(true)
          mapSticky.removeAttribute('data-status')
          mapSticky.setAttribute('data-status', 'shown')
        }
      }
    } else if (event.index >= 0 && event.index < 8) {
      chartWrapper.style.setProperty('background-color', '#21272a')
      if (mapState === 'shown') {
        console.log('hide map')
        // console.log('map')
        // console.log(map)
        // hide current map
        mapSticky.removeAttribute('data-status')
        mapSticky.setAttribute('data-status', 'hidden')
        mapSticky.style.display = 'none'
      }

      if (chartState == 'hidden') {
        console.log('draw chart and show')
        chartSticky.style.display = 'block'
        if (plotObjects[event.index].hasOwnProperty('layout')) {
          Plotly.newPlot(CHART_STICKY_ELEMENT, plotObjects[event.index].traces, plotObjects[event.index].layout, plotObjects[event.index].options)
          // if (event.index == 1) {
          //   afterplotFixesFig2(CHART_STICKY_ELEMENT)
          // } else if (event.index == 6) {
          //   afterplotFixesFig7(CHART_STICKY_ELEMENT)
          // }
          chartSticky.removeAttribute('data-status')
          chartSticky.setAttribute('data-status', 'shown')
        }
      } else if (chartState == 'shown') {
        chartSticky.removeAttribute('data-status')
        chartSticky.setAttribute('data-status', 'hidden')
        if (plotObjects[event.index].hasOwnProperty('layout')) {
          Plotly.newPlot(CHART_STICKY_ELEMENT, plotObjects[event.index].traces, plotObjects[event.index].layout, plotObjects[event.index].options)
          // if (event.index == ) {
          //   afterplotFixesFig2(CHART_STICKY_ELEMENT)
          // } else if (event.index == 6) {
          //   afterplotFixesFig7(CHART_STICKY_ELEMENT)
          // }
          chartSticky.removeAttribute('data-status')
          chartSticky.setAttribute('data-status', 'shown')
        }
      }
    } else if (event.index >= 8 && event.index <= 10) {
      if (chartState === 'shown') {
        // console.log('hide map')
        // console.log('map')
        // console.log(map)
        // hide current chart
        chartSticky.removeAttribute('data-status')
        chartSticky.setAttribute('data-status', 'hidden')
        chartSticky.style.display = 'none'
      }

      chartWrapper.style.setProperty('background-color', 'transparent')
    }
  }

  const ts = new TwoStep({
    elements: document.querySelectorAll('.narrative-item'),
    onChange: drawPlot,
    stick: document.querySelector('.rightcol')
  })

  plotObject = await getPlotObjectFig2()
  // console.log('plot 2 loaded')
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  map = await getMapFig3()
  // console.log('map fig 3 loaded')
  plotObjects.push(map)
  plotObject = await getPlotObjectFig4()
  // console.log('plot 4 loaded')
  console.log(plotObject)
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig5()
  // console.log('plot 5 loaded')
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig6()
  // console.log('plot 6 loaded')
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig7()
  // console.log('plot 7 loaded')
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig8()
  // console.log('plot 7 loaded')
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)

  plotObjects.push('Read more')
  plotObjects.push('Acknowledgement')
  plotObjects.push('References')

// TODO: remove jQ
  function checkSize () {
    // if desktop...
    if ($(window).width() > 700) {
      ts.enable()
    // if mobile...
    } else {
      ts.disable()
    }
  }

// Check current screen size
// and set up event listener for future changes
  checkSize()
  $(window).resize(checkSize)

  window.onscroll = function () { stickTitle() }
  let stickyTitle = document.getElementsByClassName('story-scrolly__title')[0]
  let sticky = stickyTitle.offsetTop
  console.log(stickyTitle)

  function stickTitle () {
    if (window.pageYOffset >= sticky) {
      stickyTitle.classList.add('sticky')
    } else {
      stickyTitle.classList.remove('sticky')
    }
  }
})()
