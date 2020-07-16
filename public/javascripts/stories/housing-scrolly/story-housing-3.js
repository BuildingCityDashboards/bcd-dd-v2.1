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

import { getPlotObjectFig1 } from '/javascripts/stories/housing-scrolly/story-housing3-fig1.js'
import { getPlotObjectFig2 } from '/javascripts/stories/housing-scrolly/story-housing3-fig2.js'
import { getMapFig3 } from '/javascripts/stories/housing-scrolly/story-housing3-fig3.js'
import { getPlotObjectFig4 } from '/javascripts/stories/housing-scrolly/story-housing3-fig4.js'
import { getMapFig5 } from '/javascripts/stories/housing-scrolly/story-housing3-fig5.js'

(async () => {
  const CHART_STICKY_ELEMENT = 'chart-sticky-housing'
  const MAP_STICKY_ELEMENT = 'map-sticky-housing'
  const chartSticky = document.getElementById(CHART_STICKY_ELEMENT)
  const mapSticky = document.getElementById(MAP_STICKY_ELEMENT)
  const chartWrapper = document.querySelector('.sticky-chart-wrapper')
// init a blank plot
// TODO: replace with spinner/ loading progress
  // Plotly.newPlot('chart-sticky-housing', {}, {}, {})

  /**
   * Styling on Plotly Laout options object
   *
   * @param { Object } po
   * @return { Object } po
   *
   *
   */

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
  let mapObject
  let southWest = L.latLng(52.9754658325, -6.8639598864)
  let northEast = L.latLng(53.7009607624, -5.9835178395)
  let dublinBounds = L.latLngBounds(southWest, northEast) // greater Dublin & surrounds
  let mapZoom = 10
  let osm = new L.TileLayer(stamenTonerUrl_Lite, {
    minZoom: min_zoom,
    maxZoom: max_zoom,
    attribution: stamenTonerAttrib
  })
  let map = new L.Map('map-sticky-housing')
  map.setView(new L.LatLng(dubLat, dubLng), zoom)
  map.addLayer(osm)

  plotObject = await getPlotObjectFig1()
  stylePlotlyLayout(plotObject)
  // console.log('plot 1 loaded')
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig2()
  // console.log('plot 2 loaded')
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  mapObject = await getMapFig3()
  plotObjects.push(mapObject)
  plotObject = await getPlotObjectFig4()
  // console.log('plot 4 loaded')
  // console.log(plotObject)
  stylePlotlyLayout(plotObject)
  plotObjects.push(plotObject)
  mapObject = await getMapFig5()
  plotObjects.push(mapObject)

  const drawPlot = async (event) => {
    // console.log('Waypoint ' + JSON.stringify(event) + ' triggered')

    let chartState = chartSticky.getAttribute('data-status')
    let mapState = mapSticky.getAttribute('data-status')
    // console.log(chartState)
    // on trigger at index, get state based on index
    console.log(event.index + ' map state: ' + mapState + ' c state: ' + chartState)
    // TODO: don't use indexes of map elements here in this way

    // indexes of map elements
    if (event.index == 2 || event.index == 4) {
      if (mapState === 'hidden') {
        console.log('draw map and show')
        // console.log('map')
        // console.log(map)
        // hide current chart
        chartSticky.removeAttribute('data-status')
        chartSticky.setAttribute('data-status', 'hidden')
        chartSticky.style.display = 'none'
        map.addLayer(plotObjects[event.index])
        // unhide map
        mapSticky.style.display = 'block'
        if (map.hasOwnProperty('options')) {
          map.invalidateSize(true)
          mapSticky.removeAttribute('data-status')
          mapSticky.setAttribute('data-status', 'shown')
        }
      }
    } else if (event.index >= 0 && event.index < 5) {
      chartWrapper.style.setProperty('background-color', '#21272a')
      if (mapState === 'shown') {
        console.log('hide map')
        // console.log('map')
        // console.log(map)
        // hide current map
        mapSticky.removeAttribute('data-status')
        mapSticky.setAttribute('data-status', 'hidden')
        mapSticky.style.display = 'none'
        if (map.hasLayer(plotObjects[2])) {
          map.removeLayer(plotObjects[2])
        } else if (map.hasLayer(plotObjects[4])) {
          map.removeLayer(plotObjects[4])
        }
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
    } else if (event.index >= 5 && event.index <= 8) {
      if (mapState === 'shown') {
        console.log('hide map')
        // console.log('map')
        // console.log(map)
        // hide current map
        mapSticky.removeAttribute('data-status')
        mapSticky.setAttribute('data-status', 'hidden')
        mapSticky.style.display = 'none'
        if (map.hasLayer(plotObjects[2])) {
          map.removeLayer(plotObjects[2])
        } else if (map.hasLayer(plotObjects[4])) {
          map.removeLayer(plotObjects[4])
        }
      }
      chartWrapper.style.setProperty('background-color', 'transparent')
    }
  }

  const ts = new TwoStep({
    elements: document.querySelectorAll('.narrative-item'),
    onChange: drawPlot,
    stick: document.querySelector('.rightcol')
  })

  // map = await getMapFig5()
  // plotObjects.push(map)

  plotObjects.push('Conclusion')
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
