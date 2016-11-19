import React, { PropTypes } from 'react'

import CocktailCard from '../components/CocktailCard'

export class CocktailGrid extends React.Component {
  render () {
    return (
      <div id='columns'>
        {this.props.items.map((d, i) => {
          return (
            <CocktailCard data={d} />
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
