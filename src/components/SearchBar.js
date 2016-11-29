import React, { PropTypes } from 'react'

// Helper to display list of suggestions for TypeAhead
class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  // Pass to parent index of clicked suggestion
  handleClick (e) {
    this.props.handleClick(e.target.dataset.index)
  }

  // Render listing of suggestions
  render () {
    var className = ((this.props.hidden) ? 'hidden ' : '') + 'suggestions'
    var absolute = {position: 'absolute'}
    return (
      <ul className={className} style={absolute} >
        {this.props.suggestions.map((suggestion, i) => {
          return (
            <li key={i} data-index={i} onClick={this.handleClick}>
              {suggestion}
            </li>
          )
        })}
      </ul>
    )
  }
}

Suggestions.propTypes = {
  suggestions: PropTypes.array,
  handleClick: PropTypes.func,
  hidden: PropTypes.bool
}

/* It was opted to have the engine be passed as a prop so it can be
   easily swapped out and so that it can be externally maintained so a new
   engine doesn't get re-created each time the TypeAhead is initially rendered.
   TypeAhead requires some search engine that has the following methods
    - search(string, callback)
    - get(string)
   For this project 'bloodhound-js' is being used
*/

// Create TypeAhead which displays listing of suggestions based on given input
class TypeAhead extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      suggestions: [],
      input: '',
      hidden: true
    }

    this.handleToken = this.handleToken.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleKey = this.handleKey.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.search = this.search.bind(this)
  }

  // Update token
  handleToken (token) {
    this.props.handleToken(token)
  }

  // Update input box to reflect clicked suggestion
  handleClick (index) {
    var token = this.state.suggestions[index]
    if (token !== undefined) {
      this.setState({
        suggestions: [],
        input: token[this.props.value],
        hidden: true
      })
      this.handleToken(token)
    }
  }

  // If enter is pressed input box updates to display first suggestion
  handleKey (e) {
    if (e.key === 'Enter') {
      var token = this.state.suggestions[0]
      if (token !== undefined) {
        this.setState({
          suggestions: [],
          input: token[this.props.value],
          hidden: true
        })
        this.handleToken(token)
      }
    }
  }

  // Update suggestion listing based on user input
  handleChange (e) {
    var input = e.target.value
    this.setState({
      input: input
    })
    this.search(input)
  }

  clearInput () {
    this.setState({
      input: ''
    })
  }

  // Search for possible suggestions given input
  search (input) {
    this.props.engine.search(input, (suggestions) => {
      this.setState({
        suggestions: this.props.limit
          ? suggestions
          : suggestions.slice(0, this.props.limit),
        hidden: (suggestions.length === 0)
      })
      this.props.handleSuggestions(suggestions)
      var token = this.props.engine.get(input)[0]
      token !== undefined
        ? this.handleToken(token)
        : this.handleToken({})
    })
  }

  // Render TypeAhead
  render () {
    return (
      <div className='searchbar'>
        {/* TypeAhead input box */}
        <input type='text' ref='input'
          value={this.state.input}
          placeholder='Search by name or ingredients and we will highlight the cocktails!'
          onChange={this.handleChange}
          onKeyPress={this.handleKey} />
        {/* Suggestion listing */}
        <Suggestions
          suggestions={Array.from(this.state.suggestions, this.props.displayValue)}
          handleClick={this.handleClick}
          hidden={this.state.hidden} />
      </div>
    )
  }
}

TypeAhead.defaultProps = {
  suggestions: [],
  value: 'id',
  displayValue: (d) => d.id,
  limit: false,
  handleSuggestions: () => {},
  handleToken: () => {}
}

TypeAhead.propTypes = {
  suggestions: PropTypes.array,
  engine: PropTypes.any.isRequired,
  value: PropTypes.string.isRequired,
  displayValue: PropTypes.func,
  limit: PropTypes.number,
  handleSuggestions: PropTypes.func,
  handleToken: PropTypes.func
}

export default TypeAhead
