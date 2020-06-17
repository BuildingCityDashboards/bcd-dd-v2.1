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

(async () => {
  const CHART_STICKY_ELEMENT = 'chart-sticky-housing-1'
  const MAP_STICKY_ELEMENT = 'map-sticky-housing-1'
// init a blank plot
// TODO: replace with spinner/ loading progress
  // Plotly.newPlot('chart-sticky-housing-1', {}, {}, {})

  // TODO: this is dumb, but must wait for a genralised function to return plot objects
  let plotObjects = []
  let plotObject = await getPlotObjectFig1()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig2()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig3()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig4()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig5()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig6()
  plotObjects.push(plotObject)
  plotObject = await getPlotObjectFig7()
  plotObjects.push(plotObject)
  let map = await getMapFig8()
  plotObjects.push(map)
  plotObjects.push('Acknowledgement')
  plotObjects.push('References')
        // fix for modebar bg colour
  plotObjects.forEach((po, i) => {
    if (i != 7 && i != plotObjects.length - 1 && i != plotObjects.length - 2) {
      po.layout.modebar = {
        'bgcolor': 'rgba(0, 0, 0, 0)'
      }
    }
  })

  const drawPlot = async (event) => {
    console.log('Waypoint ' + JSON.stringify(event) + ' triggered')
    let chartSticky = document.getElementById(CHART_STICKY_ELEMENT)
    let mapSticky = document.getElementById(MAP_STICKY_ELEMENT)
    let chartState = chartSticky.getAttribute('data-status')
    let mapState = mapSticky.getAttribute('data-status')
    console.log(chartState)
    // on trigger at index, get state based on index
    if (event.index == 7) {
      if (mapState === 'hidden') {
        console.log('draw map and show')
        // console.log('map')
        // console.log(map)
        // hide current chart
        chartSticky.removeAttribute('data-status')
        chartSticky.setAttribute('data-status', 'hidden')
        chartSticky.style.display = 'none'

        // unhide map
        mapSticky.style.display = 'block'
        map.invalidateSize(true)
        mapSticky.removeAttribute('data-status')
        mapSticky.setAttribute('data-status', 'shown')
      }
    } else if (event.index >= 0 && event.index < plotObjects.length) {
      if (mapState === 'shown') {
        console.log('hide map')
        // console.log('map')
        // console.log(map)
        // hide current chart
        mapSticky.removeAttribute('data-status')
        mapSticky.setAttribute('data-status', 'hidden')
        mapSticky.style.display = 'none'
      }

      // if (chartState == 'hidden') {
      //   console.log('draw chart and show')
      //   chartSticky.style.display = 'block'
      //   mapSticky.style.display = 'none'
      // }
    }

    // if (chartState == 'hidden') {
    //   if (event.index >= 0 && event.index < plotObjects.length) {
    //       console.log('draw map and show')
    //
    //
    //       mapSticky.style.display = 'block'
    //       plotObjects[event.index].invalidateSize(false)
    //       mapSticky.removeAttribute('data-status')
    //       mapSticky.setAttribute('data-status', 'shown')
    //     } else {
    //       console.log('draw plot and show')
    //       Plotly.newPlot(CHART_STICKY_ELEMENT, plotObjects[event.index].traces, plotObjects[event.index].layout, plotObjects[event.index].options)
    //       chartSticky.style.display = 'block'
    //       chartSticky.removeAttribute('data-status')
    //       chartSticky.setAttribute('data-status', 'shown')
    //
    //       mapSticky.style.display = 'none'
    //       mapSticky.removeAttribute('data-status')
    //       mapSticky.setAttribute('data-status', 'hidden')
    //     }
    //   }
    // } else if (chartState == 'shown') {
    //   if (event.index !== 7) {
    //     mapSticky.removeAttribute('data-status')
    //     mapSticky.setAttribute('data-status', 'hidden')
    //   } else {
    //     chartSticky.removeAttribute('data-status')
    //     chartSticky.setAttribute('data-status', 'hidden')
    //   }
    //
    //   setTimeout(function () {
    //     if (event.index >= 0 && event.index < plotObjects.length) {
    //       if (event.index != 7) {
    //         Plotly.newPlot(CHART_STICKY_ELEMENT, plotObjects[event.index].traces, plotObjects[event.index].layout, plotObjects[event.index].options)
    //         chartSticky.removeAttribute('data-status')
    //         chartSticky.setAttribute('data-status', 'shown')
    //       } else {
    //         chartSticky.style.display = 'none'
    //         mapSticky.style.display = 'block'
    //         plotObjects[event.index].invalidateSize(false)
    //         mapSticky.removeAttribute('data-status')
    //         mapSticky.setAttribute('data-status', 'shown')
    //       }
    //     }
    //   }, 200)
    // }
  }

  const ts = new TwoStep({
    elements: document.querySelectorAll('.narrative-item'),
    onChange: drawPlot,
    stick: document.querySelector('.rightcol')
  })

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
})()
