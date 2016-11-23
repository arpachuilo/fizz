import React, { PropTypes } from 'react'

import CocktailCard from '../components/CocktailCard'

export class CocktailGrid extends React.Component {
  render () {
    return (
      <div id='columnLayout'>
        {this.props.items.map((d, i) => {
          return (
            <CocktailCard key={i} data={d} />
          )
        })}
      </div>
    )
  }
}

CocktailGrid.defaultProps = {
  items: []
}

CocktailGrid.propTypes = {
  items: PropTypes.any
}

export default CocktailGrid
