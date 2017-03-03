import React from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import App from './layouts/App';
import DashBoard from './pages/DashBoard';
import FormPage from './pages/FormPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import Auth from './components/Services/Auth';

const routes = (
  <Router history={browserHistory}>
    <Route path="login" component={LoginPage}/>
    <Route path="/" component={Auth(App)}>
      <IndexRoute component={DashBoard} />
      <Route path="dashboard" component={DashBoard} />
      <Route path="form" component={FormPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);

export default routes;