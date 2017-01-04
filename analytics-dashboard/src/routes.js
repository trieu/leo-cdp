import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './layouts/App';
import FormPage from './pages/FormPage';
import NotFoundPage from './pages/NotFoundPage';

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={FormPage}/>
      <Route path="form" component={FormPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Route>
);
