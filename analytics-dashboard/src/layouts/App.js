import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '../components/Header/index';
import LeftDrawer from '../components/LeftDrawer/index';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import ThemeDefault from '../theme-default';
import Data from '../data';
import axios from 'axios';
import {browserHistory} from 'react-router';

//check auth
const requireAuth = (resolve, reject) => {
    axios({
      method: 'get',
      url: '/loggedin'
    })
    .then(function(response) {
      if(response.data.USER.constructor === Object && Object.keys(response.data.USER).length === 0){
        console.log('unauthorized !!!');
        browserHistory.push('/login');
        reject();
      }
      resolve(response.data);
    });
}


class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      navDrawerOpen: false,
      USER: {}
    };
  }
  
  //set state USER
  componentWillMount() {
    var seft = this;
    new Promise(requireAuth)
    .then(function(response){
      seft.setState({
          USER: response.USER
      });
    })
    .catch(function(){});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({navDrawerOpen: nextProps.width === LARGE});
    }
  }

  handleChangeRequestNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  render() {
    let { navDrawerOpen } = this.state;
    const paddingLeftDrawerOpen = 236;

    const styles = {
      header: {
        paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
      },
      container: {
        margin: '80px 20px 20px 15px',
        paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
      }
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header styles={styles.header}
                  handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this)}/>

            <LeftDrawer appTitle={Data.appTitle}
                        navDrawerOpen={navDrawerOpen}
                        menus={Data.menus}
                        username={this.state.USER.username || Data.profileName}/>

            <div style={styles.container}>
              {this.props.children}
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number
};

export default withWidth()(App);
