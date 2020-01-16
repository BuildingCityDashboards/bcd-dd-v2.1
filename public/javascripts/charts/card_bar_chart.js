class CardBarChart {
  // constructor function
  constructor (_data, _keys, _xV, _element, _titleX, _titleY) {
    this.d = _data,
    this.e = _element
    this.keys = _keys
    this.xV = _xV
    this.titleX = _titleX
    this.titleY = _titleY

    this.init()
  }

  // initialise method to draw chart area
  init () {
    const c = this
    c.lastValue = c.d[c.d.length - 1].Dublin // TODO: hard-coded

    d3.select(c.e).select('svg').remove()
    c.eN = d3.select(c.e).node()
    c.eW = c.eN.getBoundingClientRect().width

    // margin
    c.m = [20, 10, 25, 10]
    c.w = c.eW - c.m[1] - c.m[3]
    c.h = 120 - c.m[0] - c.m[2]

    c.setScales()
    c.drawBars()
    // c.drawLabels()
  } // end of init

  setScales () {
    const c = this
    const maxToday = c.d.length > 0 ? d3.max(c.d, (d) => {
      return d[c.yV]
    }) : 0

    // setting the line values ranges
    c.x = d3.scaleTime().range([0, c.w - 5])
    c.y = d3.scaleLinear().range([c.h - 10, 0])

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

    console.log('Scales ' + c.x.domain)
  }

  drawBars () {
    let c = this

    // Adds the svg canvas
    c.svg = d3.select(c.e)
      .append('svg')
      .attr('width', c.w + c.m[1] + c.m[3])
      .attr('height', c.h + c.m[0])
      .append('g')
      .attr('transform', 'translate(' + c.m[3] + ',' + '20' + ')')

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
  //   // add the svg to the target element
  //   const svg = d3.select(c.e)
  //     .append('svg')
  //     .attr('width', c.w + c.m[1] + c.m[3])
  //     .attr('height', c.h + c.m[0])
  //
  //   // add the g to the svg and transform by top and left margin
  //   c.g = svg.append('g')
  //     .attr('transform', 'translate(' + c.m[3] + ',' + '20' + ')')
  //
  //   // transition
  //   c.t = () => {
  //     return d3.transition().duration(1000)
  //   }
  //
  //   c.colourScheme = ['#aae0fa', '#00929e', '#16c1f3', '#16c1f3', '#da1e4d', '#086fb8', '#16c1f3']
  //
  //   // set colour function
  //   c.colour = d3.scaleOrdinal(c.colourScheme.reverse())
  //
  //   c.x0 = d3.scaleBand()
  //     .range([0, c.w])
  //     .padding(0.05)
  //
  //   c.x1 = d3.scaleBand()
  //     .paddingInner(0.1)
  //   // console.log(c.h)
  //   c.y = d3.scaleLinear()
  //     .range([c.h - 50, 0])
  //
  //   // Start Month
  //   c.g.append('text')
  //     .attr('class', 'label')
  //     .attr('x', 0)
  //     .attr('y', c.h - 5)
  //     .attr('text-anchor', 'start')
  //     .attr('fill', '#f8f9fabd')
  //     .text(c.d[0].date)
  //
  //   // Last Month
  //   c.g.append('text')
  //     .attr('class', 'label')
  //     .attr('x', c.w)
  //     .attr('y', c.h - 5)
  //     .attr('text-anchor', 'end')
  //     .attr('fill', '#f8f9fabd')
  //     .text(c.d[c.d.length - 1].date)
  //
  //   // Title
  //   c.g.append('text')
  //     .attr('dx', 0)
  //     .attr('dy', -10)
  //     .attr('class', 'label')
  //     .attr('fill', '#16c1f3')
  //     .text(c.keys[0])
  //
  //   c.update()
  // } //end of init
  //
  // setScales () {
  //   const c = this
  //   const maxToday = c.d.length > 0 ? d3.max(c.d, (d) => {
  //     return d[c.yV]
  //   }) : 0
  //
  // update () {
  //   let c = this
  //
  //   // Update scales
  //   c.x0.domain(c.d.map(d => {
  //     return d[c.xV ]
  //   }))
  //   c.x1.domain(c.keys).range([0, c.x0.bandwidth()])
  //   c.y.domain([0, d3.max(c.d, d => {
  //     return d3.max(c.keys, key => {
  //       return d[key]
  //     })
  //   })]).nice()
  //
  //   // join new data with old elements.
  //   c.rects = c.g.append('g')
  //     .attr('class', 'parent')
  //     .selectAll('g')
  //     .data(c.d, (d) => {
  //       return !isNaN(d.Value)
  //     })
  //     .enter()
  //     .append('g')
  //     .attr('transform', (d) => {
  //       return 'translate(' + c.x0(d[c.xV ]) + ', 0)'
  //     })
  //     .selectAll('rect')
  //     .data(d => {
  //       return c.keys.map(key => {
  //         return {
  //           key: key,
  //           value: d[key]
  //         }
  //       })
  //     })
  //     .enter().append('rect')
  //     .attr('x', d => {
  //       return c.x1(d.key)
  //     })
  //     .attr('y', d => {
  //       return c.y(d.value)
  //     })
  //     .attr('width', c.x1.bandwidth())
  //     .attr('height', d => {
  //       console.log(`${c.h} - c.y(${d.value}) - ${c.m[0]}`)
  //       return (c.h - c.y(d.value) - c.m[0])
  //     })
  //     .attr('rx', '2')
  //     .attr('ry', '2')
  //     .attr('fill', 'rgba(29, 158, 201, 0.6)')
  //
  //   d3.select('.parent g:nth-last-child(1) rect')
  //     .attr('fill', '#16c1f3')
  //
  //   c.g.append('text')
  //     .attr('dx', c.w)
  //     .attr('dy', c.y(c.lastValue) - 10)
  //     .attr('text-anchor', 'end')
  //     .attr('class', 'label value')
  //     .attr('fill', '#f8f9fabd')
  //     .text(c.lastValue)
  // }
}
