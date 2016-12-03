import React, { PropTypes } from 'react'
import debounce from 'lodash.debounce'
import * as d3 from 'd3'

const distance = (a, b) => {
  return Math.sqrt(
    ((b.x - a.x) * (b.x - a.x)) +
    ((b.y - a.y) * (b.y - a.y))
  )
}

export class ClusterBrowser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      width: 500,
      height: 500
    }

    this.onClick = this.onClick.bind(this)
    this.updateGraph = this.updateGraph.bind(this)
    this.updateGraphClasses = this.updateGraphClasses.bind(this)
    this.handleResize = debounce(this.handleResize.bind(this), 500)

    this.graph = {}

    this.graph.nodes = []
    this.graph.links = []

    for (let i = 0; i < this.props.cocktails.length; i++) {
      let cocktail = this.props.cocktails[i]

      // Add cocktail to nodes
      this.graph.nodes.push({
        id: cocktail.title,
        data: cocktail,
        cluster: cocktail.cluster,
        x: this.state.width / 2,
        y: this.state.height / 2
      })
    }

    for (let i = 0; i < this.graph.nodes.length; i++) {
      let src = this.graph.nodes[i]
      for (let j = 0; j < src.data.ingredients.length; j++) {
        let ingredient = src.data.ingredients[j].ingredient

        for (let k = 0; k < this.graph.nodes.length; k++) {
          let dest = this.graph.nodes[k]

          // Find if they share an ingredient
          if (src.id !== dest.id && dest.data.ingredients.some((otherIngredient) => {
            return (ingredient.toLowerCase() === otherIngredient.ingredient.toLowerCase()) ||
              (ingredient.toLowerCase().includes('whiskey') && otherIngredient.ingredient.toLowerCase().includes('whiskey') && true)
          }) && src.cluster === dest.cluster) {
            // Find if link already exist
            let duplicate = this.graph.links.find((link) => {
              return (link.source === src && link.target === dest) ||
              (link.source === dest && link.target === src)
            })

            // Link does not exist, push it
            if (typeof duplicate === 'undefined') {
              this.graph.links.push({
                source: src,
                target: dest,
                overlap: 1
              })
            } else { // Link exist, increase overlap count
              duplicate.overlap += 1
            }
          }
        }
      }
    }

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => { return d.id }).distance(60))
      .force('charge', d3.forceManyBody().strength(-50).distanceMin(10).distanceMax(100))
      .force('center', d3.forceCenter(this.state.width / 2, this.state.height / 2))
      .force('collide', d3.forceCollide().radius(30))

    this.dragstarted = (d) => {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    this.dragged = (d) => {
      // Break links
      this.graph.links = this.graph.links.filter((g) => {
        return g.source.id !== d.id && g.target.id !== d.id
      })

      // Find closest target
      let minDistance = Infinity
      let target = null
      for (let i = 0; i < this.graph.nodes.length; i++) {
        let node = this.graph.nodes[i]
        if (node !== d) {
          let dist = distance(d, node)
          if (dist < minDistance) {
            minDistance = dist
            target = node
          }
        }
      }

      // Rejoin links
      if (minDistance < 60) {
        let cluster = (target !== null)
          ? target.cluster
          : d.cluster
        for (let j = 0; j < d.data.ingredients.length; j++) {
          let ingredient = d.data.ingredients[j].ingredient

          for (let k = 0; k < this.graph.nodes.length; k++) {
            let dest = this.graph.nodes[k]

            // Find if they share an ingredient
            if (d.id !== dest.id && dest.data.ingredients.some((otherIngredient) => {
              return (ingredient.toLowerCase() === otherIngredient.ingredient.toLowerCase()) ||
                (ingredient.toLowerCase().includes('whiskey') && otherIngredient.ingredient.toLowerCase().includes('whiskey') && true)
            }) && cluster === dest.cluster) {
              // Find if link already exist
              let duplicate = this.graph.links.find((link) => {
                return (link.source === d && link.target === dest) ||
                (link.source === dest && link.target === d)
              })

              // Link does not exist, push it
              if (typeof duplicate === 'undefined') {
                this.graph.links.push({
                  source: d,
                  target: dest,
                  overlap: 1
                })
              } else { // Link exist, increase overlap count
                duplicate.overlap += 1
              }
            }
          }
        }
      }

      // Update graph
      this.updateGraph()
      this.updateGraphClasses(this.props)

      // Get closest node to dragged node
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    this.dragended = (d) => {
      if (!d3.event.active) this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    this.ticked = () => {
      this.link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      this.node
        .attr('cx', (d) => {
          d.x = Math.max(10, Math.min(this.state.width - 10, d.x))
          return d.x
        })
        .attr('cy', (d) => {
          d.y = Math.max(10, Math.min(this.state.height - 10, d.y))
          return d.y
        })
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize, false)
    this.handleResize()
    this.node = d3.select(this.refs.nodes).selectAll('circle')
    this.link = d3.select(this.refs.links).selectAll('.link')
    this.updateGraph()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  shouldComponentUpdate (nextProps, nextState) {
    this.updateGraphClasses(nextProps)
    return true
  }

  updateGraph () {
    this.link = this.link
      .data(this.graph.links, (d) => {
        return d.source.id + '-' + d.target.id
      })

    this.link.exit().remove()

    this.link = this.link.enter().append('line')
      .attr('class', '.link')
      .attr('stroke-width', (d) => Math.sqrt(d.overlap))
      .merge(this.link)

    this.node = this.node
      .data(this.graph.nodes, (d) => {
        return d.id
      })

    this.node.exit().remove()

    this.node = this.node.enter().append('circle')
      .attr('class', (d) => 'clusterFill-' + d.cluster)
      .on('click', (d) => this.onClick(d.data))
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended))
      .merge(this.node)

    this.simulation
      .nodes(this.graph.nodes)
      .on('tick', this.ticked)

    this.simulation.force('link')
      .links(this.graph.links)
    this.simulation.restart()
    // this.node.append('title')
      // .text((d) => d.id)
  }

  updateGraphClasses (props) {
    this.node
      .attr('class', (d) => {
        let classes = []
        classes.push('clusterFill-' + d.cluster)
        if (props.suggestedCocktails.includes(d.data)) {
          classes.push('highlighted')
        }
        if (props.selectedCocktail.title === d.id) {
          classes.push('selected')
        }
        if (props.selectedClusters.includes(d.cluster) || props.selectedClusters.length === 0) {
          classes.push('visible')
        }
        for (let i = 0; i < this.graph.links.length; i++) {
          let link = this.graph.links[i]
          if (d.id === link.source.id && link.target.id === props.selectedCocktail.title ||
            d.id === link.target.id && link.source.id === props.selectedCocktail.title) {
            classes.push('linked')
            break
          }
        }
        return classes.join(' ')
      })
    this.link
      .attr('class', (d) => {
        let linkClass = ''
        if (d.target.id === props.selectedCocktail.title || d.source.id === props.selectedCocktail.title) {
          linkClass += 'linked'
        }
        return linkClass
      })
  }

  handleResize () {
    let rootBBOX = this.refs.root.getBoundingClientRect()
    let offset = document.body.scrollTop
    let width = rootBBOX.width
    let height = document.body.clientHeight - (rootBBOX.top + offset) - 20
    this.simulation.force('center', d3.forceCenter(width / 2, height / 2))
    this.setState({
      width,
      height
    })
  }

  onClick (d) {
    this.props.onClick(d)
  }

  render () {
    let { margins } = this.props
    let { width, height } = this.state
    let svgWidth = width + margins.left + margins.right
    let svgHeight = height + margins.top + margins.bottom
    return (
      <div ref='root'>
        <svg ref='svg' width={svgWidth} height={svgHeight}>
          <g ref='links' className='links' />
          <g ref='nodes' className='nodes' />
        </svg>
      </div>
    )
  }
}

ClusterBrowser.defaultProps = {
  onClick: () => {},
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  cocktails: [],
  selectedCocktail: {},
  selectedClusters: [],
  suggestedCocktails: []
}

ClusterBrowser.propTypes = {
  onClick: PropTypes.func,
  margins: PropTypes.object,
  cocktails: PropTypes.array,
  selectedCocktail: PropTypes.any,
  selectedClusters: PropTypes.array,
  suggestedCocktails: PropTypes.array
}

export default ClusterBrowser
