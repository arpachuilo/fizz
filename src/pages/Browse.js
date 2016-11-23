import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { addItem, removeItem } from '../redux/actions'

import SearchBar from '../components/SearchBar'
import ClusterBrowser from '../components/ClusterBrowser'
import CocktailCard from '../components/CocktailCard'

import Bloodhound from 'bloodhound-js'
import cocktails from '../data/example.json'

const searchEngine = new Bloodhound({
  local: [],
  identify: (d) => d['title'],
  queryTokenizer: (d) => {
    return Bloodhound.tokenizers.whitespace(d)
  },
  datumTokenizer: (d) => {
    var tokens = []
    var stringSize = d['title'].length
    for (var size = 1; size <= stringSize; size++) {
      for (var i = 0; i + size <= stringSize; i++) {
        tokens.push(d['title'].substr(i, size))
      }
    }
    return tokens
  }
})

searchEngine.add(cocktails)

class Browse extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedCocktail: {},
      suggestedCocktails: []
    }

    this.setSelectedCocktail = this.setSelectedCocktail.bind(this)
    this.updateSuggestedCocktails = this.updateSuggestedCocktails.bind(this)
  }

  setSelectedCocktail (d) {
    if (Object.keys(d).length > 0) {
      this.setState({
        selectedCocktail: d
      })
    }
  }

  updateSuggestedCocktails (suggestions) {
    this.setState({
      suggestedCocktails: suggestions
    })
  }

  render () {
    // When rendering cocktail card check if it is added to library or not
    return (
      <div className='container'>
        <div className='row'>
          <SearchBar
            ref='TypeAhead'
            handleSuggestions={this.updateSuggestedCocktails}
            handleToken={this.setSelectedCocktail}
            engine={searchEngine}
            value='title'
            limit={10}
            displayValue={(d) => {
              return d['title']
            }} />
        </div>
        <div className='row'>
          <div className='eight columns'>
            <ClusterBrowser cocktails={this.props.cocktails}
              suggestedCocktails={this.state.suggestedCocktails}
              onClick={this.setSelectedCocktail} />
          </div>
          <div className='four columns'>
            <CocktailCard data={this.state.selectedCocktail} />
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
