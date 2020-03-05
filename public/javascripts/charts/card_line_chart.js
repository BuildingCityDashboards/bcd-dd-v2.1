class CardLineChart {

  // constructor function
  constructor (obj) {
    this.d = obj.d
    this.e = obj.e
    this.yV = obj.yV
    this.xV = obj.xV
    this.sN = obj.sN
    this.fV = obj.fV
    this.dL = obj.dL
    // create the chart area
    this.init()
  }

  init () {
    let c = this
    d3.select(c.e).select('svg').remove()
    c.eN = d3.select(c.e).node()
    c.eW = c.eN.getBoundingClientRect().width
    c.eH = c.eN.getBoundingClientRect().height
    console.log(c.e)
    console.log(c.eH)

    // dimensions margins, width and height
    c.m = [20, 10, 0, 10]
    c.w = c.eW - c.m[1] - c.m[3]
    c.h = c.eH - c.m[0] - c.m[2]

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
    let c = this

    // Adds the svg canvas
    let headroom = '24'
    c.svg = d3.select(c.e)
      .append('svg')
      .attr('width', c.w + c.m[1] + c.m[3])
      .attr('height', c.h + c.m[0])
      .append('g')
      .attr('transform', 'translate(' + c.m[3] + ',' + headroom + ')')

    // add the data
    c.svg.append('path')
      .attr('class', 'activity')
      .attr('d', c.line(c.d))
      .attr('stroke', '#16c1f3') // move to css
      .attr('stroke-width', 4) // move to css
      .attr('fill', 'none') // move to css
  }

  drawLabels () {
    let c = this,
      l = c.d.length,
      lD = c.d[l - 1],
      fD = c.d[0]

    // Region/type name
    c.svg.append('text')
      .attr('dx', 0)
      .attr('dy', -10)
      .attr('class', 'label')
      .attr('fill', '#16c1f3') // move to css
      .text(lD[c.sN]) // needs to be a d.name

    // value label
    c.svg.append('text')
      .attr('x', c.w + 10)
      .attr('y', c.y(lD[c.yV]) - 10)
      .attr('text-anchor', 'end') // move to css
      .attr('class', 'label')
      .attr('fill', '#f8f9fabd') // move to css
      .text(c.fV ? c.fV(lD[c.yV]) : lD[c.yV])

    // latest date label
    c.svg.append('text')
      .attr('x', c.w)
      .attr('y', c.h - 5)
      .attr('text-anchor', 'end') // move to css
      .attr('class', 'label employment')
      .attr('fill', '#f8f9fabd') // move to css
      .text(lD[c.dL])

    // first date label
    c.svg.append('text')
      .attr('x', 0)
      .attr('y', c.h - 5)
      .attr('text-anchor', 'start') // move to css
      .attr('class', 'label employment')
      .attr('fill', '#f8f9fabd') // move to css
      .text(fD[c.dL])

    c.svg.append('circle')
      .attr('cx', c.x(lD[c.xV]))
      .attr('cy', c.y(lD[c.yV]))
      .attr('r', 3)
      .attr('transform', 'translate(0,0)') // move to css
      .attr('class', 'cursor')
      .style('stroke', '#16c1f3') // move to css
      .style('stroke-width', '2px') // move to css
  }
}
