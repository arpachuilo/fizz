import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import icon from '../images/icon.png'

class App extends React.Component {
  render () {
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li>
                <Link className='brand' to='/'>
                  <div>
                    <img src={icon} style={{width: 32, height: 32}} />
                    <span>Fizz</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link to='/home' activeClassName='active'>
                  <div>Pinned</div>
                </Link>
              </li>
              <li>
                <Link to='/browse' activeClassName='active'>
                  <div>Browse</div>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.any
}

export default App
