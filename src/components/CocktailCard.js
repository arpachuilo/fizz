import React, { PropTypes } from 'react'

// TODO: Add buttons
export class CocktailGrid extends React.Component {
  render () {
    if (Object.keys(this.props.data).length === 0) {
      return <div />
    }

    let { title, directions, picture, drinkware, served, ingredients } = this.props.data

    // Collapse ingredients into easy to digest form
    let cleanedIngredients = []
    Object.keys(ingredients).forEach((key, i) => {
      ingredients[key].forEach((d, j) => {
        cleanedIngredients.push(d)
      })
    })

    return (
      <figure>
        <h4 className='title'>{title}</h4>
        <img className='picture' src={picture} />
        <p className='drinkware'>{drinkware}</p>
        <p className='served'>{served}</p>
        <p className='directions'>{directions}</p>
        <ul className='ingredients'>
          {cleanedIngredients.map((d, i) => {
            return (
              <li>
                <span className='ingredient'>{d.ingredient}</span>
                <span className='amount'>{d.quantity.amt}</span>
                <span className='unit'>{d.quantity.unit}</span>
              </li>
            )
          })}
        </ul>
      </figure>
    )
  }
}

CocktailGrid.defaultProps = {
  data: {}
}

CocktailGrid.propTypes = {
  data: PropTypes.any
}

export default CocktailGrid
