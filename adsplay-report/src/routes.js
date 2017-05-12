import React from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import App from './layouts/App';
import DashBoard from './pages/DashBoard';
import Detail from './pages/DetailCategory';
// import FormPage from './pages/FormPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import Auth from './components/Services/Auth';
import DetailFilm from './pages/DetailFilm';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Auth(App)}>
      <IndexRoute component={DashBoard} />
      <Route path="dashboard" component={DashBoard} />
      <Route path="detail" component={Detail} />
      <Route path="search" component={SearchPage} />
      <Route path="detailFilm/:filmID" component={DetailFilm} />
      {/*<Route path="form" component={FormPage}/>*/}
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);

export default routes;