import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { removeItem } from '../redux/actions'

import { CocktailGrid } from '../views/CocktailGrid'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.removeCocktail = this.removeCocktail.bind(this)
  }

  removeCocktail (d) {

  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <CocktailGrid items={this.props.cocktails} />
        </div>
      </div>
    )
  }
}

Home.defaultProps = {
  cocktails: [],
  removeCocktail: () => {}
}

Home.propTypes = {
  cocktails: PropTypes.any,
  removeCocktail: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    cocktails: state.list.items
  }
}

const mapDispatchToProps = {
  removeCocktail: removeItem
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
