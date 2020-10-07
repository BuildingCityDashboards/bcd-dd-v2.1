// import { locale } from from './bcd-date.js'
class Chart {
  /**
   * @description
   * Compliment someone on their something.
   *
   * @param {Object} options
   * @param {String} options.d    input data
   * @param {String} options.e    DOM selector (div id)
   * @param {String} options.k    key
   * @param {String} options.ks    key
   * @param {String} options.xV    key
   * @param {String} options.yV    key
   * @param {String} options.cS    color scheme
   * @param {String} options.tX
   * @param {String} options.tY
   * @param {String} options.ySF  format for y axis

   */

  constructor (options) {
    this.d = options.d // the data
    this.e = options.e // selector element
    this.k = options.k // key
    this.ks = options.ks
    this.xV = options.xV // x value
    this.yV = options.yV // y value
    this.cS = options.cS // colour scheme
    this.tX = options.tX
    this.tY = options.tY
    this.ySF = options.ySF || 'thousands' // format for y axis
  }

  // initialise method to draw c area
  init () {
    const c = this
    let eN
    let eW
    let aR
    let cScheme
    const m = c.m = {}
    let w
    let h
    let bP

    eN = d3.select(c.e).node()
    eW = eN.getBoundingClientRect().width
    aR = eW < 800 ? eW * 0.55 : eW * 0.5
    cScheme = c.cS || d3.schemeBlues[5]
    bP = 450
    // console.log("ew: " + eW);
    // margins
    m.t = eW < bP ? 40 : 50
    m.b = eW < bP ? 30 : 80
    m.r = eW < bP ? 15 : 140
    m.l = eW < bP ? 9 : 72

    // dimensions
    w = eW - m.l - m.r
    h = aR - m.t - m.b

    c.w = w
    c.h = h
    c.eN = eN
    c.sscreens = eW < bP

    // to remove existing svg on resize
    d3.select(c.e).select('svg').remove()

    // add the svg to the target element
    c.svg = d3.select(c.e)
      .append('svg')
      .attr('width', w + m.l + m.r)
      .attr('height', h + m.t + m.b)

    // add the g to the svg and transform by top and left margin
    c.g = c.svg.append('g')
      .attr('transform', 'translate(' + m.l +
        ', ' + m.t + ')')
      .attr('class', 'chart-group')

    // set chart transition method
    c.t = () => {
      return d3.transition().duration(1000)
    }
    c.ease = d3.easeQuadInOut

    // set chart colour method
    c.colour = d3.scaleOrdinal(cScheme)
    // set chart bisecector method
    c.bisectDate = d3.bisector((d) => {
      return d[c.xV]
    }).left
  }

  addAxis () {
    const c = this
    const g = c.g
    let gLines
    let xLabel
    let yLabel

    gLines = g.append('g')
      .attr('class', 'grid-lines')

    c.xAxis = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + c.h + ')')

    c.yAxis = g.append('g')
      .attr('class', 'y-axis')

    // X title
    xLabel = g.append('text')
      .attr('class', 'titleX')
      .attr('x', c.w / 2)
      .attr('y', c.h + 60)
      .attr('text-anchor', 'middle')
      .text(c.tX)

    // Y title
    yLabel = g.append('text')
      .attr('class', 'titleY')
      .attr('x', -(c.h / 2))
      .attr('y', -56)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(c.tY)
  }

  getKeys () {
    const c = this
    const findKeys = (d) => d.filter((e, p, a) => a.indexOf(e) === p)
    c.colour.domain(c.d.map(d => {
      return d.key
    }))

    c.ks = c.ks !== undefined ? c.ks : c.d[0].key ? c.colour.domain() : findKeys(c.d.map(d => d[c.k]))
  }

  drawTooltip () {
    const c = this

    d3.select(c.e).select('.tool-tip.bcd').remove()

    c.newToolTip = d3.select(c.e)
      .append('div')
      .attr('class', 'tool-tip bcd')

    // check screen size
    // console.log('c.sscreens')
    // console.log(c.sscreens)
    c.sscreens
      ? c.newToolTip.style('visibility', 'visible')
      : c.newToolTip.style('visibility', 'hidden')

    // c.newToolTip.style('display', 'none')

    c.newToolTipTitle = c.newToolTip
      .append('div')
      .attr('id', 'bcd-tt-title')

    c.tooltipHeaders()
    c.tooltipBody()
  }

  tooltipHeaders () {
    const c = this
    let div
    let p

    div = c.newToolTip
      .append('div')
      .attr('class', 'headers')

    div.append('span')
      .attr('class', 'bcd-dot')

    p = div
      .append('p')
      .attr('class', 'bcd-text')

    p.append('span')
      .attr('class', 'bcd-text-title')
      .text('Type')

    p.append('span')
      .attr('class', 'bcd-text-value')
      .text('Value')

    p.append('span')
      .attr('class', 'bcd-text-rate')
      .text('% Rate')

    p.append('span')
      .attr('class', 'bcd-text-indicator')
  }

  tooltipBody () {
    const c = this
    const keys = c.ks
    let div
    let p

    keys.forEach((d, i) => {
      div = c.newToolTip
        .append('div')
        .attr('id', 'bcd-tt' + i)

      div.append('span').attr('class', 'bcd-dot')

      p = div.append('p').attr('class', 'bcd-text')

      p.append('span').attr('class', 'bcd-text-title')
      p.append('span').attr('class', 'bcd-text-value')
      p.append('span').attr('class', 'bcd-text-rate')
      p.append('span').attr('class', 'bcd-text-indicator')
    })
  }

  drawGridLines () {
    const c = this
    let gLines

    gLines = c.getElement('.grid-lines')

    gLines.selectAll('line')
      .remove()

    gLines.selectAll('line.horizontal-line')
      .data(c.y.ticks)
      .enter()
      .append('line')
      .attr('class', 'horizontal-line')
      .attr('x1', (0))
      .attr('x2', c.w)
      .attr('y1', (d) => c.y(d))
      .attr('y2', (d) => c.y(d))
  }

  getElement (name) {
    const c = this
    const s = d3.select(c.e)
    const e = s.selectAll(name)
    return e
  }

  drawFocusLine () {
    // console.log('draw focus line')
    const c = this
    const g = c.g

    c.focus = g.append('g')
      .attr('class', 'focus')

    c.focus.append('line')
      .attr('class', 'focus_line')
      .attr('y1', 0)
      .attr('y2', c.h)

    c.focus.append('g')
      .attr('class', 'focus_circles')

    c.ks.forEach((d, i) => {
      c.drawFocusCircles(d, i)
    })
  }

  drawFocusCircles (d, i) {
    const c = this
    const g = c.g

    const tooltip = g.select('.focus_circles')
      .append('g')
      .attr('class', 'tooltip_' + i)

    tooltip.append('circle')
      .attr('r', 0)
      .transition(c.t)
      .attr('r', 5)
      .attr('fill', c.colour(d))
      .attr('stroke', c.colour(d))
  }

  // for data that needs to be nested
  // check if the data needs to be nested or not!!
  nestData () {
    const c = this
    c.d = c.d[0].key ? c.d : c.nest(c.d, c.k)
  }

  nest (data, key) {
    return d3.nest().key(d => {
      return d[key]
    })
      .entries(data)
  }

  formatValue (format) {
    // formats thousands, millions, euros and percentage
    switch (format) {
      case 'millions':
        return d3.format('.2s')
        break

      case 'euros':
        return locale.format('$,.0f')
        break

      case 'euros2':
        return locale.format('$,.2f')
        break

      case 'thousands':
        return d3.format(',')
        break

      case 'percentage2':
        return d3.format('.2%')
        break

      case 'percentage':
        return d3.format('.0%')
        break

      default:
        return 'undefined'
    }
  }
}

export { Chart }
