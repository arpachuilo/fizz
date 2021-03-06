import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { removeItem } from '../redux/actions'

import { CocktailGrid } from '../views/CocktailGrid'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.removeCocktail = this.removeCocktail.bind(this)
  }

  removeCocktail (d) {
    this.props.removeCocktail(d)
  }

  render () {
    return (
      <div className='row'>
        <CocktailGrid items={this.props.cocktails} onButtonClick={this.removeCocktail} />
        {
          this.props.cocktails.length < 1
            ? (
              <div className='center'>
                <h3>There seems to be nothing here...</h3>
                <h3>Try exploring on the <Link to='/browse'>browse page</Link> and pin some drinks!</h3>
              </div>
            ) : undefined
        }
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
