import React, { PropTypes } from 'react'

import missing from '../images/missing.png'

export class CocktailCard extends React.Component {
  constructor (props) {
    super(props)

    this.onButtonClick = this.onButtonClick.bind(this)
  }

  onButtonClick () {
    this.props.onButtonClick(this.props.data)
  }

  render () {
    if (Object.keys(this.props.data).length === 0) {
      return <div />
    }

    let { title, directions, picture, drinkware, served, cluster, ingredients } = this.props.data

    return (
      <figure className={'clusterBG-' + cluster}>
        <h4 className='title'>{title}</h4>
        <img className='picture' src={(picture.length !== 0) ? picture : missing} />
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
          {ingredients.map((d, i) => {
            let amount = d.amount
            let unit = d.unit
            let ingredient = d.ingredient.replace(/\w\S*/g, (s) => {
              return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()
            })
            if (unit !== '') unit += ' - '
            if (amount !== '') amount += ' '
            return (
              <li key={i}>
                <span className='amount'>{amount}</span>
                <span className='unit'>{unit}</span>
                <span className='ingredient'>{ingredient}</span>
              </li>
            )
          })}
        </ul>
        <input type='button' onClick={this.onButtonClick} value={this.props.button} />
      </figure>
    )
  }
}

CocktailCard.defaultProps = {
  onButtonClick: () => {},
  button: '',
  data: {}
}

CocktailCard.propTypes = {
  onButtonClick: PropTypes.func,
  button: PropTypes.string,
  data: PropTypes.any
}

export default CocktailCard
