import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { addItem, removeItem } from '../redux/actions'

import SearchBar from '../components/SearchBar'
import ClusterBrowser from '../components/ClusterBrowser'
import CocktailCard from '../components/CocktailCard'

import Bloodhound from 'bloodhound-js'
import cocktails from '../data/cocktails.json'

const searchEngine = new Bloodhound({
  local: [],
  identify: (d) => d['title'],
  queryTokenizer: (d) => {
    return Bloodhound.tokenizers.whitespace(d)
  },
  datumTokenizer: (d) => {
    let tokens = []
    let stringSize = d['title'].length
    for (let size = 1; size <= stringSize; size++) {
      for (let i = 0; i + size <= stringSize; i++) {
        tokens.push(d['title'].substr(i, size))
      }
    }

    Object.keys(d['ingredients']).forEach((key) => {
      d['ingredients'][key].forEach((d) => {
        let stringSize = d.ingredient.length
        for (let size = 1; size <= stringSize; size++) {
          for (let i = 0; i + size <= stringSize; i++) {
            tokens.push(d.ingredient.substr(i, size))
          }
        }
      })
    })
    return tokens
  }
})

searchEngine.add(cocktails)

const checkForCocktail = (cocktailArr, cocktail) => {
  let value = false
  for (let i = 0; i < cocktailArr.length; i++) {
    if (cocktailArr[i].title === cocktail.title) {
      value = true
      break
    }
  }
  return value
}

class Browse extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedCocktail: {},
      suggestedCocktails: []
    }

    this.setSelectedCocktail = this.setSelectedCocktail.bind(this)
    this.updateSuggestedCocktails = this.updateSuggestedCocktails.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  onButtonClick (d) {
    checkForCocktail(this.props.cocktails, this.state.selectedCocktail)
      ? this.props.removeCocktail(d)
      : this.props.addCocktail(d)
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
    let button = checkForCocktail(this.props.cocktails, this.state.selectedCocktail)
      ? 'Remove'
      : 'Pin'
    return (
      <div className='container'>
        <div className='row'>
          <div className='eight columns'>
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
            <ClusterBrowser cocktails={cocktails}
              suggestedCocktails={this.state.suggestedCocktails}
              onClick={this.setSelectedCocktail} />
          </div>
          <div className='four columns'>
            <CocktailCard data={this.state.selectedCocktail}
              onButtonClick={this.onButtonClick}
              button={button} />
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
  cocktails: PropTypes.any,
  removeCocktail: PropTypes.func,
  addCocktail: PropTypes.func
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
