import React from 'react'
import { Route, Router, IndexRedirect, browserHistory } from 'react-router'
import { ReduxRouter } from 'redux-router'

import App from './containers/App'
import Home from './pages/Home'
import Browse from './pages/Browse'

const routes = (
  <ReduxRouter>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/home' />
        <Route path='/home' component={Home} />
        <Route path='/browse' component={Browse} />
      </Route>
    </Router>
  </ReduxRouter>
)

export default routes
