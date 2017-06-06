import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
// Import components
import Auth from './components/Auth/Check';
import App from './app';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Ads from './pages/Ads';

const routes = (
  <Router history={browserHistory}>
      <Route path="/" component={Auth(App)}>
          <IndexRoute component={Home} />
          <Route path="/home" component={Home}/>
          <Route path="/detail" component={Detail}/>
          <Route path="/ads" component={Ads}/>
          <Route path="/*" component={NotFound}/>
      </Route>
  </Router>
);

export default routes;