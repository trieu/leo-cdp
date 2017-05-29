import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
// Import components
import App from './app';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Detail from './pages/Detail';

const routes = (
  <Router history={browserHistory}>
      <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="/home" component={Home}/>
          <Route path="/detail" component={Detail}/>
          <Route path="/*" component={NotFound}/>
      </Route>
  </Router>
);

export default routes;