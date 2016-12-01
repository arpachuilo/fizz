import React, { PropTypes } from 'react'
import debounce from 'lodash.debounce'
import * as d3 from 'd3'

export class ClusterBrowser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      width: 500,
      height: 500
    }

    this.onClick = this.onClick.bind(this)
    this.createGraph = this.createGraph.bind(this)
    this.updateGraph = this.updateGraph.bind(this)
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
            return ingredient.toLowerCase() === otherIngredient.ingredient.toLowerCase()
          })) {
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
    this.createGraph()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  shouldComponentUpdate (nextProps, nextState) {
    this.updateGraph(nextProps)
    return true
  }

  createGraph () {
    this.link = d3.select(this.refs.svg).append('g')
      .attr('class', 'links')
    .selectAll('line').data(this.graph.links)
    .enter().append('line')
      .attr('stroke-width', (d) => Math.sqrt(d.overlap))

    this.node = d3.select(this.refs.svg).append('g')
      .attr('class', 'nodes')
    .selectAll('circle').data(this.graph.nodes)
    .enter().append('circle')
      .attr('class', (d) => 'clusterFill-' + d.cluster)
      .on('click', (d) => this.onClick(d.data))
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended))

    this.node.append('title')
      .text((d) => d.id)

    this.simulation
      .nodes(this.graph.nodes)
      .on('tick', this.ticked)

    this.simulation.force('link')
      .links(this.graph.links)
  }

  updateGraph (nextProps) {
    this.node
      .attr('class', (d) => {
        let classes = []
        classes.push('clusterFill-' + d.cluster)
        if (nextProps.suggestedCocktails.includes(d.data)) {
          classes.push('highlighted')
        }
        if (nextProps.selectedCocktail.title === d.id) {
          classes.push('selected')
        }
        if (nextProps.selectedClusters.includes(d.cluster) || nextProps.selectedClusters.length === 0) {
          classes.push('visible')
        }
        for (let i = 0; i < this.graph.links.length; i++) {
          let link = this.graph.links[i]
          if (d.id === link.source.id && link.target.id === nextProps.selectedCocktail.title ||
            d.id === link.target.id && link.source.id === nextProps.selectedCocktail.title) {
            classes.push('linked')
            break
          }
        }
        return classes.join(' ')
      })
    this.link
      .attr('class', (d) => {
        let linkClass = ''
        if (d.target.id === nextProps.selectedCocktail.title || d.source.id === nextProps.selectedCocktail.title) {
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
        <svg ref='svg' width={svgWidth} height={svgHeight} />
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
