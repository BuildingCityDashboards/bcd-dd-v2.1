class CardBarChart {
  // constructor function
  constructor (_data, _keys, _housingCompletionsX, _element, _titleX, _titleY) {
    this.data = _data
    this.keys = _keys
    this.housingCompletionsX = _housingCompletionsX
    this.element = _element
    this.titleX = _titleX
    this.titleY = _titleY

    this.init()
  }

  // initialise method to draw chart area
  init () {
    let c = this,
      last = c.data.length - 1
    c.lastValue = c.data[last].Dublin

    d3.select(c.element).select('svg').remove()

    let eNode = d3.select(c.element).node()
    let eWidth = eNode.getBoundingClientRect().width

    // margin
    c.m = [20, 10, 25, 10]

    c.width = eWidth - c.m[1] - c.m[3]
    c.height = 120 - c.m[0] - c.m[2]

    // add the svg to the target element
    const svg = d3.select(c.element)
      .append('svg')
      .attr('width', c.width + c.m[1] + c.m[3])
      .attr('height', c.height + c.m[0])

    // add the g to the svg and transform by top and left margin
    c.g = svg.append('g')
      .attr('transform', 'translate(' + c.m[3] + ',' + '20' + ')')

    // transition
    c.t = () => {
      return d3.transition().duration(1000)
    }

    c.colourScheme = ['#aae0fa', '#00929e', '#16c1f3', '#16c1f3', '#da1e4d', '#086fb8', '#16c1f3']

    // set colour function
    c.colour = d3.scaleOrdinal(c.colourScheme.reverse())

    c.x0 = d3.scaleBand()
      .range([0, c.width])
      .padding(0.05)

    c.x1 = d3.scaleBand()
      .paddingInner(0.1)
    // console.log(c.height)
    c.y = d3.scaleLinear()
      .range([c.height, 0])

    // Start Month
    c.g.append('text')
      .attr('class', 'label')
      .attr('x', 0)
      .attr('y', c.height - 5)
      .attr('text-anchor', 'start')
      .attr('fill', '#f8f9fabd')
      .text(c.data[0].date)

    // Last Month
    c.g.append('text')
      .attr('class', 'label')
      .attr('x', c.width)
      .attr('y', c.height - 5)
      .attr('text-anchor', 'end')
      .attr('fill', '#f8f9fabd')
      .text(c.data[last].date)

    // Title
    c.g.append('text')
      .attr('dx', 0)
      .attr('dy', -10)
      .attr('class', 'label')
      .attr('fill', '#16c1f3')
      .text(c.keys[0])

    c.update()
  }

  update () {
    let c = this

    // Update scales
    c.x0.domain(c.data.map(d => {
      return d[c.housingCompletionsX]
    }))
    c.x1.domain(c.keys).range([0, c.x0.bandwidth()])
    c.y.domain([0, d3.max(c.data, d => {
      return d3.max(c.keys, key => {
        return d[key]
      })
    })]).nice()

    // join new data with old elements.
    c.rects = c.g.append('g')
      .attr('class', 'parent')
      .selectAll('g')
      .data(c.data, (d) => {
        return !isNaN(d.Value)
      })
      .enter()
      .append('g')
      .attr('transform', (d) => {
        return 'translate(' + c.x0(d[c.housingCompletionsX]) + ', 0)'
      })
      .selectAll('rect')
      .data(d => {
        return c.keys.map(key => {
          return {
            key: key,
            value: d[key]
          }
        })
      })
      .enter().append('rect')
      .attr('x', d => {
        return c.x1(d.key)
      })
      .attr('y', d => {
        return c.y(d.value)
      })
      .attr('width', c.x1.bandwidth())
      .attr('height', d => {
        console.log(`${c.height} - c.y(${d.value}) - ${c.m[0]}`)
        return (c.height - c.y(d.value) - c.m[0])
      })
      .attr('rx', '2')
      .attr('ry', '2')
      .attr('fill', 'rgba(29, 158, 201, 0.6)')

    d3.select('.parent g:nth-last-child(1) rect')
      .attr('fill', '#16c1f3')

    c.g.append('text')
      .attr('dx', c.width)
      .attr('dy', c.y(c.lastValue) - 10)
      .attr('text-anchor', 'end')
      .attr('class', 'label value')
      .attr('fill', '#f8f9fabd')
      .text(c.lastValue)
  }
}
