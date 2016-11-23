import React, { PropTypes } from 'react'
import debounce from 'lodash.debounce'

export class ClusterBrowser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      width: 100
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
    this.setState({
      width: rootBBOX.width
    })
  }

  onClick (e) {
    let i = e.target.getAttribute('data-index')
    let d = this.props.cocktails[i]
    this.props.onClick(d)
  }

  render () {
    return (
      <div ref='root'>
        <svg width={this.state.width} height={this.props.height}>
          {this.props.cocktails.map((d, i) => {
            let x = Math.floor(Math.random() * this.state.width) + 1
            let y = Math.floor(Math.random() * this.props.height) + 1
            let position = 'translate(' + x + ',' + y + ')'
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
  height: 500,
  cocktails: [],
  suggestedCocktails: []
}

ClusterBrowser.propTypes = {
  onClick: PropTypes.func,
  height: PropTypes.number,
  cocktails: PropTypes.array,
  suggestedCocktails: PropTypes.array
}

export default ClusterBrowser
