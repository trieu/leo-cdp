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
import AdsManagement from './pages/AdsManagement';
import AdsManagementDetail from './pages/AdsManagementDetail';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Auth(App)}>
      <IndexRoute component={DashBoard} />
      <Route path="dashboard" component={DashBoard} />
      <Route path="detail" component={Detail} />
      <Route path="detailFilm/:filmID" component={DetailFilm} />
      <Route path="adsmanagement" component={AdsManagement} />
      <Route path="adsmanagement/:id" component={AdsManagementDetail} />
      {/*<Route path="search" component={SearchPage} />*/}
      {/*<Route path="form" component={FormPage}/>*/}
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);

export default routes;