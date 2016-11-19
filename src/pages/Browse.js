import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { addItem, removeItem } from '../redux/actions'

import SearchBar from '../components/SearchBar'
import ClusterBrowser from '../components/ClusterBrowser'
import CocktailCard from '../components/CocktailCard'

class Browse extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedCocktail: {}
    }
  }

  render () {
    // When rendering cocktail card check if it is added to library or not
    return (
      <div className='container'>
        <div className='row'>
          <SearchBar />
        </div>
        <div className='row'>
          <div className='eight columns'>
            <ClusterBrowser />
          </div>
          <div className='four columns'>
            <CocktailCard />
          </div>
        </div>
      </div>
    )
  }
}

Browse.defaultProps = {
  cocktails: []
}

Browse.propTypes = {
  cocktails: PropTypes.any
}

const mapStateToProps = (state) => {
  return {
    cocktails: state.list.items
  }
}

const mapDispatchToProps = {
  addCocktail: addItem,
  removeCocktail: removeItem
}

export default connect(mapStateToProps, mapDispatchToProps)(Browse)
