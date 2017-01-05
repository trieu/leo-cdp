import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './layouts/App';
import DashBoard from './pages/DashBoard';
import FormPage from './pages/FormPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';

export default (
  <Route>
    <Route path="login" component={LoginPage}/>
    <Route path="/" component={App}>
      <IndexRoute component={DashBoard}/>
      <Route path="dashboard" component={DashBoard}/>
      <Route path="form" component={FormPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Route>
);
