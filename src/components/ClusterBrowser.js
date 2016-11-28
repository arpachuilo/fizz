import React, { PropTypes } from 'react'

export class ClusterBrowser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      width: 500,
      height: 500
    }

    this.onClick = this.onClick.bind(this)

    this.clusters = new Map()
    this.props.cocktails.forEach((d, i) => {
      if (this.clusters.has(d.cluster)) {
        this.clusters.get(d.cluster).push(d)
      } else {
        this.clusters.set(d.cluster, [])
        this.clusters.get(d.cluster).push(d)
      }
    })

    this.clusters = new Map([...this.clusters.entries()].sort((a, b) => {
      return b[1].length - a[1].length
    }))
  }

  onClick (e) {
    let iString = e.currentTarget.dataset.index
    let indicies = iString.split(',').map((i) => +i)
    let d = this.clusters.get(indicies[0])[indicies[1]]
    this.props.onClick(d)
  }

  render () {
    return (
      <div className='row'>
        {Array.from(this.clusters).map((cluster, index) => {
          let clusterClass = 'row cluster-' + cluster[0]
          return (
            <div key={index} className={clusterClass}>
              {cluster[1].map((d, i) => {
                let itemClass = 'clusterItem'
                if (this.props.suggestedCocktails.includes(d)) itemClass += ' highlighted'
                return (
                  <div key={i} className={itemClass} data-index={cluster[0] + ',' + i} onClick={this.onClick}>
                    <img src={d.picture} />
                    <span>{d.title}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

ClusterBrowser.defaultProps = {
  onClick: () => {},
  cocktails: [],
  suggestedCocktails: []
}

ClusterBrowser.propTypes = {
  onClick: PropTypes.func,
  cocktails: PropTypes.array,
  suggestedCocktails: PropTypes.array
}

export default ClusterBrowser
