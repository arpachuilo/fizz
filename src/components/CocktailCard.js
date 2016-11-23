import React, { PropTypes } from 'react'

export class CocktailCard extends React.Component {
  render () {
    if (Object.keys(this.props.data).length === 0) {
      return <div />
    }

    let { title, directions, picture, drinkware, served, cluster, ingredients } = this.props.data

    // Collapse ingredients into easy to digest form
    let cleanedIngredients = []
    Object.keys(ingredients).forEach((key, i) => {
      ingredients[key].forEach((d, j) => {
        cleanedIngredients.push(d)
      })
    })

    return (
      <figure className={'clusterCard-' + cluster}>
        <h4 className='title'>{title}</h4>
        <img className='picture' src={picture} />
        <p className='drinkware'>
          <span className='bold'>Drinkware: </span>
          <span>{drinkware}</span>
        </p>
        <p className='served'>
          <span className='bold'>Served: </span>
          <span>{served}</span>
        </p>
        <p className='directions'>
          <span className='bold'>Directions: </span>
          <span>{directions}</span>
        </p>
        <span className='bold'>Ingredients: </span>
        <ul className='ingredients'>
          {cleanedIngredients.map((d, i) => {
            return (
              <li key={i}>
                <span className='amount'>{d.quantity.amt + ' '}</span>
                <span className='unit'>{d.quantity.unit + ' - '}</span>
                <span className='ingredient'>{d.ingredient}</span>
              </li>
            )
          })}
        </ul>
      </figure>
    )
  }
}

CocktailCard.defaultProps = {
  data: {}
}

CocktailCard.propTypes = {
  data: PropTypes.any
}

export default CocktailCard
