import React, { PropTypes } from 'react'

import CocktailCard from '../components/CocktailCard'

export class CocktailGrid extends React.Component {
  render () {
    return (
      <div id='columnLayout'>
        {this.props.items.map((d, i) => {
          return (
            <CocktailCard key={i} data={d}
              onButtonClick={this.props.onButtonClick}
              button='Remove' />
          )
        })}
      </div>
    )
  }
}

CocktailGrid.defaultProps = {
  onButtonClick: () => {},
  items: []
}

CocktailGrid.propTypes = {
  onButtonClick: PropTypes.func,
  items: PropTypes.any
}

export default CocktailGrid
