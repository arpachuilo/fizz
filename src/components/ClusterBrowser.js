import React, { PropTypes } from 'react'
import debounce from 'lodash.debounce'

export class ClusterBrowser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      width: 500,
      height: 500
    }

    this.onClick = this.onClick.bind(this)
    this.handleResize = debounce(this.handleResize.bind(this), 500)
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize, false)
    this.handleResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {
    let rootBBOX = this.refs.root.getBoundingClientRect()
    let offset = document.body.scrollTop
    this.setState({
      width: rootBBOX.width,
      height: document.body.clientHeight - (rootBBOX.top + offset) - 20
    })
  }

  onClick (e) {
    let i = e.target.getAttribute('data-index')
    let d = this.props.cocktails[i]
    this.props.onClick(d)
  }

  render () {
    let { margins } = this.props
    let { width, height } = this.state
    let svgWidth = width + margins.left + margins.right
    let svgHeight = height + margins.top + margins.bottom
    return (
      <div ref='root'>
        <svg width={svgWidth} height={svgHeight}>
          {this.props.cocktails.map((d, i) => {
            let x = 0
            let y = 0
            if (('x' in d) && ('y' in d)) {
              x = d.x
              y = d.y
            } else {
              x = d.x = (Math.floor(Math.random() * width) + 1) / width
              y = d.y = (Math.floor(Math.random() * height) + 1) / height
            }
            let position = 'translate(' + (x * width) + ',' + (y * height) + ')'
            let clusterClass = 'cluster-' + d.cluster
            if (this.props.suggestedCocktails.includes(d)) {
              clusterClass += ' highlighted'
            }
            return (
              <g key={i} className='clusterPoint' transform={position}>
                <circle
                  r={5}
                  data-index={i}
                  className={clusterClass}
                  onClick={this.onClick} />
                <text dy={20}>{d.title}</text>
              </g>
            )
          })}
        </svg>
      </div>
    )
  }
}

ClusterBrowser.defaultProps = {
  onClick: () => {},
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  cocktails: [],
  suggestedCocktails: []
}

ClusterBrowser.propTypes = {
  onClick: PropTypes.func,
  margins: PropTypes.object,
  cocktails: PropTypes.array,
  suggestedCocktails: PropTypes.array
}

export default ClusterBrowser
