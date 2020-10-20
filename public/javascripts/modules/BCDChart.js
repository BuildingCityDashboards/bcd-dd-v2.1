// import { locale } from from './bcd-date.js'

class BCDChart {
  /**
     * @description
     * Base class for creating BCD d3 charts
     *
     * @param { Object } options
     * @param { Object [] } options.data          an array of objects each containing a datum
     * @param { String } options.elementId        DOM selector (div/element id)
     * @param { String } options.traceKey         name of variable used to categorise traces (e.g. 'Region')
     * @param { String [] } options.traceNames    array of the possibkle trace key values used as trace names
     * @param { String [] } options.colourscheme  color scheme for traces
     * @param { String } options.xV               name of variable for x-axis
     * @param { String } options.yV               name of variable for y-axis
     * @param { String } options.tX               title of x-axis
     * @param { String } options.tY               title of y-axis
     * @param { String } options.ySF || @param { String } options.formaty              number format for y axis
     *
     *
     */

  constructor (options) {
    const DEFAULT_MARGINS = {
      top: 32,
      right: 16,
      bottom: 16,
      left: 64
    }

    this.d = options.data // the data
    this.e = options.elementId // selector element
    this.k = options.tracekey // trace key
    this.ks = options.tracenames // array of trace names
    this.cS = options.colourscheme // colour scheme

    this.xV = options.xV // x value
    this.yV = options.yV // y value

    this.tX = options.tX
    this.tY = options.tY
    this.ySF = options.ySF || options.formaty || 'thousands' // format for y axis
    this.margins = Object.assign(DEFAULT_MARGINS, options.margins)
    // console.log(`${this.e} : ${JSON.stringify(this.margins)}`)
  }

  // initialise method to draw c area
  init () {
    const c = this
    const eN = d3.select('#' + c.e).node()
    // console.log('#' + c.e)
    const eW = eN.getBoundingClientRect().width
    const aR = eW < 768 ? eW * 0.55 : eW * 0.5
    const cScheme = c.cS || ['#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d']
    const m = c.m = {}
    const bP = 450

    // console.log("ew: " + eW);
    // margins

    m.t = eW < bP ? this.margins.top : 50
    m.r = eW < bP ? this.margins.right : 140
    m.b = eW < bP ? this.margins.bottom : 80
    m.l = eW < bP ? this.margins.left : 72

    // console.log(eW < bP)

    // dimensions
    const w = eW - m.l - m.r
    const h = aR - m.t - m.b

    c.w = w
    c.h = h
    c.eN = eN
    c.sscreens = eW < bP

    // to remove existing svg on resize
    d3.select('#' + c.e).select('svg').remove()

    // add the svg to the target element
    c.svg = d3.select('#' + c.e)
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

    // const yAxisElement = d3.select('#' + this.e).select('.y-axis')
    // console.log(yAxisElement.width)

    // X title
    xLabel = g.append('text')
      .attr('class', 'titleX')
      .attr('x', c.w / 2)
      .attr('y', c.h + 60)
      .text(c.tX)

    // Y title
    yLabel = g.append('text')
      .attr('class', 'titleY')
      .attr('x', -(c.h / 2))
      .attr('y', -c.m.l + 16) // auto position the yAxis label
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

    d3.select('#' + c.e).select('.tool-tip.bcd').remove()

    c.newToolTip = d3.select('#' + c.e)
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
    const s = d3.select('#' + c.e)
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

    // c.focus.append('g')
    //   .attr('class', 'focus_circles')

    // c.ks.forEach((d, i) => {
    //   c.drawFocusCircles(d, i)
    // })
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

  // hides the rate column in the tooltip e.g. when showing % change
  hideRate (value) {
    const c = this
    const i = c.getElement('.bcd-text-indicator')
    const r = c.getElement('.bcd-text-rate')

    if (value) {
      i.style('display', 'none')
      r.style('display', 'none')
    } else {
      i.style('display', 'block')
      r.style('display', 'block')
    }
    // value ? g.selectAll(".tp-text-indicator").style("display", "none") : g.selectAll(".tp-text-indicator").style("display", "block")
  }

  formatValue (format) {
    // formats thousands, Millions, Euros and Percentage
    switch (format) {
      case 'millions':
        return d3.format('.2s')

      case 'millionsShort':
        return d3.format('.2s')

      case 'euros':
        return locale.format('$,.0f')

      case 'euros2':
        return locale.format('$,.2f')

      case 'thousands':
        return d3.format(',')

      case 'hundredThousandsShort':
        return d3.format('.3s')

      case 'percentage2':
        return d3.format('.2%')

      case 'percentage':
        return d3.format('.0%')

      default:
        return 'undefined'
    }
  }

  showSelectedLabelsX (array) {
    const c = this
    const e = c.xAxis
    c.axisArray = array || c.axisArray

    e.selectAll('.x-axis .tick')
      .style('display', 'none')

    c.axisArray.forEach(n => {
      d3.select(e._groups[0][0].childNodes[n + 1])
        .style('display', 'block')
    })
  }

  showSelectedLabelsY (array) {
    const c = this
    const e = c.yAxis
    c.axisArray = array || c.axisArray

    e.selectAll('.y-axis .tick')
      .style('display', 'none')

    c.axisArray.forEach(n => {
      d3.select(e._groups[0][0].childNodes[n + 1])
        .style('display', 'block')
    })
  }
}

export { BCDChart }
