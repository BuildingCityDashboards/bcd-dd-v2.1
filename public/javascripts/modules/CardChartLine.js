class CardChartLine {
  // constructor function
  constructor (options) {
    this.d = options.data // the data
    this.e = options.elementid // selector element
    // this.k = options.tracekey // trace key
    // this.ks = options.tracenames // array of trace names
    // this.cS = options.colourscheme // colour scheme

    this.xV = options.xvaluename // x value key
    this.yV = options.yvaluename // y value key
    this.sN = options.sN
    this.fV = options.fV
    this.dL = options.dL
    // create the chart area

    this.tX = options.tX
    this.tY = options.tY
    this.ySF = options.ySF || 'thousands' // format for y axis

    const defaultLabelAdjustments = {
      xfirst: {
        x: 0,
        y: 0
      },
      xlast: {
        x: 0,
        y: 0
      },
      yfirst: {
        x: 0,
        y: -8
      },
      ylast: {
        x: 0,
        y: -8
      }
    }

    this.labelAdjustments = Object.assign(defaultLabelAdjustments, options.labeladjustments)
    // console.log(options.labeladjustments)
    // console.log(this.labelAdjustments)

    this.drawChart()
  }

  drawChart () {
    const c = this
    d3.select(c.e).select('svg').remove()
    c.eN = d3.select(c.e).node()
    c.eW = c.eN.getBoundingClientRect().width
    c.eH = c.eN.getBoundingClientRect().height
    // console.log(c.e)
    // console.log(c.eH)

    // dimensions margins, width and height
    c.m = {
      top: 0,
      right: 12,
      bottom: 24,
      left: 12
    }

    // c.m = [20, 12, 4, 12] // affects visability of axis/ data point labels
    c.w = c.eW - c.m.right - c.m.left
    c.h = c.eH - c.m.top - c.m.bottom

    c.setScales()
    c.drawLine()
    c.drawLabels()
  }

  setScales () {
    const c = this
    const maxToday = c.d.length > 0 ? d3.max(c.d, (d) => {
      return d[c.yV]
    }) : 0

    // setting the line values ranges
    c.x = d3.scaleTime().range([0, c.w - 5])
    c.y = d3.scaleLinear().range([c.h - 20, 0])

    // setup the line chart function
    c.line = d3.line()
      .defined((d) => {
        return !isNaN(d[c.yV])
      })
      .x(d => {
        return c.x(d[c.xV])
      })
      .y(d => {
        return c.y(d[c.yV])
      })
      .curve(d3.curveBasis)

    c.x.domain(d3.extent(c.d, d => {
      return (d[c.xV])
    }))

    c.y.domain([0, Math.max(maxToday)])
  }

  drawLine () {
    const c = this
    // console.log(c.m)

    // Adds the svg canvas
    const headroom = '24'
    c.svg = d3.select(c.e)
      .append('svg')
      .attr('width', c.w + c.m.right + c.m.left)
      .attr('height', c.h + c.m.top)
      .append('g')
      .attr('transform', 'translate(' + c.m.left + ',' + headroom + ')')

    // add the data
    c.svg.append('path')
      .attr('class', 'activity')
      .attr('d', c.line(c.d))
  }

  drawLabels () {
    const c = this
    const l = c.d.length
    const lD = c.d[l - 1] // last data value
    const fD = c.d[0] // first data value

    // Region/type name
    c.svg.append('text')
      .attr('dx', 0)
      .attr('dy', -10)
      .attr('class', 'label')
      .attr('fill', '#16c1f3') // move to css
      .text(lD[c.sN]) // needs to be a d.name

    // first x-axis label
    c.svg.append('text')
      .attr('class', 'label-x-data-first')
      .attr('x', 0 + c.labelAdjustments.xfirst.x)
      .attr('y', c.h + c.labelAdjustments.xfirst.y)
      .text(fD[c.dL])

    // last x-axis label
    c.svg.append('text')
      .attr('x', c.w + c.labelAdjustments.xlast.x)
      .attr('y', c.h + c.labelAdjustments.xlast.y)
      .attr('class', 'label-x-data-last')
      .text(lD[c.dL])

    // first y-value label
    c.svg.append('text')
      .attr('class', 'label-y-data-first')
      .attr('x', 0 + +c.labelAdjustments.yfirst.x)
      .attr('y', c.y(fD[c.yV]) + c.labelAdjustments.yfirst.y)
      .text(c.fV ? c.fV(fD[c.yV]) : fD[c.yV])

    // last y-value label
    c.svg.append('text')
      .attr('class', 'label-y-data-last')
      .attr('x', c.w + c.labelAdjustments.ylast.x)
      .attr('y', c.y(lD[c.yV]) + c.labelAdjustments.ylast.y)
      .text(c.fV ? c.fV(lD[c.yV]) : lD[c.yV])

    // circle on first data point
    c.svg.append('circle')
      .attr('cx', c.x(fD[c.xV]))
      .attr('cy', c.y(fD[c.yV]))
      .attr('r', 1)
      .attr('class', 'cursor')

    // circle on last data point
    c.svg.append('circle')
      .attr('cx', c.x(lD[c.xV]))
      .attr('cy', c.y(lD[c.yV]))
      .attr('r', 1)
      .attr('class', 'cursor')
  }
}

export { CardChartLine }
