import { addErrorMessage } from './bcd-ui.js'
import { BCDChart } from './BCDChart.js'

class BCDMultiLineChart extends BCDChart {
  drawChart () {
    const c = this
    try {
      super.nestData()
      super.init()
      super.addAxis()
      super.getKeys()
      super.drawTooltip()
      c.createScales() // parent once I setup setScales:done and setDomain with switch.
      super.drawGridLines()
      c.drawLines() // child - like createScales could be added to parent with switch.
      c.drawLegend() // child - like createScales could be added to parent with switch.
    } catch (err) {
      console.log('Error in MultiLine Chart')
      console.log(err)
      addErrorMessage(c.e, 'An error occured getting the data for this chart from the external source.')
    }
  }

  // updateChart (obj) {
  //   const c = this

  //   if (obj) {
  //     c.d = obj.d || c.d
  //     c.k = obj.k || c.k
  //     c.ks = obj.ks || c.ks
  //     c.tX = obj.tX || c.tX
  //     c.tY = obj.tY || c.tY
  //     c.xV = obj.xV || c.xV
  //     c.yV = obj.yV || c.yV
  //     c.cS = obj.c || c.cS
  //     c.ySF = obj.ySF || c.ySF
  //   }

  //   c.createScales()
  //   c.drawLines()
  //   c.drawLegend()
  // }

  // needs to be called everytime the data changes
  createScales () {
    const c = this
    let yAxisCall
    let xAxisCall
    let x
    let y

    yAxisCall = d3.axisLeft()
    xAxisCall = d3.axisBottom()
    x = c.getElement('.titleX').text(c.tX)
    y = c.getElement('.titleY').text(c.tY)

    c.setScales('time')
    c.setDomains()

    // Update X axis
    c.tickNumber ? xAxisCall.scale(c.x).ticks(c.tickNumber) : xAxisCall.scale(c.x)
    c.xAxis.transition(c.t()).call(xAxisCall)

    // Update Y axis
    c.ySF ? yAxisCall.scale(c.y).tickFormat(c.formatValue(c.ySF)) : yAxisCall.scale(c.y)
    c.yAxis.transition(c.t()).call(yAxisCall)
  }

  setScales (chartType) {
    const c = this
    let x
    let x0
    let x1
    let y

    y = d3.scaleLinear().range([c.h, 0])

    switch (chartType) {
      case 'time':
        x = d3.scaleTime().range([0, c.w])

        return c.x = x, c.y = y
        break

      case 'bar':
        // set scales
        x = d3.scaleBand()
          .range([0, c.w])
          .padding(0.2)

        return c.x = x, c.y = y
        break

      case 'stackbar':
        x0 = d3.scaleBand()
          .range([0, c.w])
          .padding(0.05)

        x1 = d3.scaleBand()
          .padding(0.05)

        return c.x0 = x0, c.x1 = x1, c.y = y
        break

      default:
        x = d3.scaleTime().range([0, c.w])

        return c.x = x, c.y = y
    }
  }

  setDomains (zeroYAxis = true) {
    const c = this
    let minValue

    // switch (d){
    // }

    // set domain range
    c.x.domain(d3.extent(c.d[0].values, d => {
      return (d[c.xV])
    }))

    // for the y domain to track negative numbers

    minValue = d3.min(c.d, d => {
      return d3.min(d.values, d => {
        return d[c.yV]
      })
    })

    // Set Y axis scales 0 if positive number else use minValue
    c.y.domain([minValue >= 0 ? 0 : minValue,
      d3.max(c.d, d => {
        return d3.max(d.values, d => {
          return d[c.yV]
        })
      })
    ])
  }

  drawLines () {
    const c = this
    const g = c.g

    // d3 line function
    c.line = d3.line()
      .defined(function (d) {
        return !isNaN(d[c.yV])
      })
      .x(d => {
        return c.x(d[c.xV])
      })
      .y(d => { // this works
        return c.y(d[c.yV])
      })
    // .curve(d3.curveCatmullRom);

    // select all regions and join data
    c.regions = g.selectAll('.regions')
      .data(c.d)

    // update the paths
    c.regions.select('.line')
      .transition(c.t)
      // .attr("d", d => {return c.line(d.values); });
      .attr('d', d => {
        return d.disabled ? null : c.line(d.values)
      })

    // Enter elements
    c.regions.enter().append('g')
      .attr('class', 'regions')
      .append('path')
      .style('stroke', d => {
        return c.colour(d.key)
      })
      .attr('class', 'line')
      .attr('id', d => d.key)
      // .attr("d", d => {return c.line(d.values); })
      .attr('d', d => {
        return d.disabled ? null : c.line(d.values)
      })
    // .style("stroke", d => ( c.d.map(function(v,i) {
    //     return c.colour || c.color[i % 10];
    //   }).filter(function(d,i) { return !c.d[i].disabled })))

    // c.regions.transition(c.t)
    //     .attr("d", function (d) { return c.line(d.values); });

    c.regions.exit()
      .transition(c.t).remove()
  }

  pagination (data, selector, sliceBy, pageNumber, label) {
    const c = this

    const slices = c.slicer(data, sliceBy)
    const times = pageNumber
    const startSet = slices(times - 1)

    //  let newStart = [];
    //  startSet.length < sliceBy ? newStart = data.slice(50 - sliceBy) : newStart = startSet;

    d3.selectAll(selector + ' .pagination-holder').remove()

    const moreButtons = d3.select(selector)
      .append('div')
      .attr('class', 'pagination-holder text-center pb-2')

    c.d = startSet
    c.drawChart()
    c.addTooltip()

    for (let i = 0; i < times; i++) {
      // let wg = slices(i)
      // wg.length < sliceBy ? wg = data.slice(50 - sliceBy) : wg;

      const wg = slices(i)
      const sliceNumber = sliceBy - 1
      let secondText

      if (typeof wg[sliceNumber] !== 'undefined') {
        secondText = wg[sliceNumber]
      } else {
        const lastEl = wg.length - 1
        secondText = wg[lastEl]
      }

      const textString = label === 'year' ? wg[sliceNumber][label] : wg[0][label] + ' - ' + secondText[label]

      moreButtons.append('button')
        .attr('type', 'button')
        .attr('class', i === times - 1 ? 'btn btn-page mx-1 active' : 'btn btn-page')
        .style('border-right', i === times - 1 ? 'none' : '1px Solid #838586')
        // .text(label + " " + (1+(i*sliceBy)) +" - "+ ((i+1)*sliceBy)) // pass this to the function
        .text(textString)
        .on('click', function () {
          if (!$(this).hasClass('active')) {
            $(this).siblings().removeClass('active')
            $(this).addClass('active')
            c.d = wg
            c.drawChart()
            c.addTooltip()
          }
        })
    }
  }

  slicer (arr, sliceBy) {
    if (sliceBy < 1 || !arr) return () => []

    return (p) => {
      const base = p * sliceBy
      const size = arr.length

      let slicedArray = p < 0 || base >= arr.length ? [] : arr.slice(base, base + sliceBy)

      if (slicedArray.length < (sliceBy / 2)) return slicedArray = arr.slice(size - sliceBy)

      return slicedArray
    }
  }

  sortData (i, x0) {
    const c = this
    const tD = c.d.map(d => {
      let s
      let sPrev
      const s0 = d.values[i - 1]
      const s1 = d.values[i]
      const v = c.yV

      s1 !== undefined ? s = x0 - s0[c.xV] > s1[c.xV] - x0 ? s1 : s0 : s = s0
      s1 !== undefined ? sPrev = x0 - s0[c.xV] > s1[c.xV] - x0 ? d.values[i - 1] : d.values[i - 2] : false
      // c.tooltipElementTitle.text(c.ttTitle + " " + (s[c[c.xV]Field]));

      const obj = {}
      obj.key = d.key
      if (s) {
        obj.label = s.label
        obj.value = s[v]
        obj.change = c.getPerChange(s, sPrev, v)
        obj[c.xV] = s[c.xV]
      } else {
        // console.log('undefined input to multiline_chart')
      }
      // console.log('obj')
      // console.log(obj)
      return obj
    })
    tD.sort((a, b) => b.value - a.value)
    return tD
  }

  // replacing old legend method with new inline labels
  drawLegend () {
    // chart (c) object, vlaue (v), colour (z), line height(lH)
    const c = this
    const g = c.g
    const v = c.yV
    const z = c.colour
    const lH = 12

    // data values for last readable value
    const lines = c.d.map(d => {
      const obj = {}
      const vs = d.values.filter(idFilter)
      const s = vs.length - 1
      // sF = d.values.length -1;
      obj.key = d.key
      obj.last = vs[s] ? vs[s][v] : null
      obj.x = vs[s] ? c.x(vs[s][c.xV]) : null
      // obj.y = sF === s ? c.y(vs[s][v]) : c.y(vs[s][v]) - 15;
      obj.y = vs[s] ? c.y(vs[s][v]) : null
      return obj
    })

    const circles = c.d.map(d => {
      const obj = {}
      const vs = d.values.filter(idFilter)
      const s = vs.length - 1
      obj.key = d.key
      obj.last = vs[s] ? vs[s][v] : null
      obj.x = vs[s] ? c.x(vs[s][c.xV]) : null
      obj.y = vs[s] ? c.y(vs[s][v]) : null
      return obj
    })

    // Define a custom force to stop labels going outside the svg
    const forceClamp = (min, max) => {
      let nodes
      const force = () => {
        nodes.forEach(n => {
          if (n.y > max) n.y = max
          if (n.y < min) n.y = min
        })
      }
      force.initialize = (_) => nodes = _
      return force
    }

    // Set up the force simulation
    const force = d3.forceSimulation()
      .nodes(lines)
      .force('collide', d3.forceCollide(lH / 2))
      // .force("y", d3.forceY(d => d.y).strength(4))
      .force('x', d3.forceX(d => d.x).strength(2))
      .force('clamp', forceClamp(0, c.h))
      .stop()

    // Execute the simulation
    for (let i = 0; i < 300; i++) force.tick()

    // Add labels
    const legendNames = g.selectAll('.label-legend').data(lines, d => d.y)
    legendNames.exit().remove()

    const legendCircles = g.selectAll('.legend-circles').data(circles, d => d.y)
    legendCircles.exit().remove()

    const legendGroup = legendNames.enter().append('g')
      .attr('class', 'label-legend')
      .attr('transform', d => 'translate(' + d.x + ', ' + d.y + ')')

    const legendGC = legendCircles.enter().append('g')
      .attr('class', 'legend-circles')
      .attr('transform', d => 'translate(' + d.x + ', ' + d.y + ')')

    legendGroup.append('text')
      .attr('class', 'legendText')
      .attr('id', d => d.key.replace(' ', ''))
      .attr('dy', '.01em')
      .text(d => d.key)
      .call(c.textWrap, 96, 8)
      // .attr('fill', d => z(d.key))
      // .attr('alignment-baseline', 'middle')
      // .attr('dx', '.5em')
      // .attr('x', 2)

    // legendGroup.append("line")
    //     .attr("class", "legend-line")
    //     .attr("x1", 0)
    //     .attr("x2", 6)
    //     .attr("stroke", "#fff");

    legendGC.append('circle')
      .attr('class', 'l-circle')
      .attr('r', '6')
      .attr('fill', d => z(d.key))

    // check if number
    function isNum (d) {
      return !isNaN(d)
    }

    // filter out the NaN
    function idFilter (d) {
      return !!(isNum(d[v]) && d[v] !== 0)
    }
  }
}
export { BCDMultiLineChart }
