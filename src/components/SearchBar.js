import React, { PropTypes } from 'react'

export class SearchBar extends React.Component {
  render () {
    return (
      <div />
    )
  }
}

SearchBar.defaultProps = {
  data: {}
}

SearchBar.propTypes = {
  data: PropTypes.any
}

export default SearchBar
