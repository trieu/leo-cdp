import React, { PropTypes } from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

const Auth = (WrappedComponent) => {
    return (
        class WithAuthorization extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
                
                this.loggedIn().then((response) => {
                    this.setState({USER: response})
                })
            }

            loggedIn(){
                return new Promise(function(resolve, reject){
                    axios({
                        method: 'get',
                        url: '/loggedin'
                    }).then(function(response) {
                        if(response.data.USER.constructor === Object && Object.keys(response.data.USER).length === 0){
                            console.log('unauthorized !!!');
                            browserHistory.push('/login');
                            reject();
                        }
                        else {
                            resolve(response.data.USER);
                        }
                    });
                });
            }

            render() {
                if (!this.state.USER) return <div></div>;
                return <WrappedComponent children={this.props.children} USER={this.state.USER} />;
            }
        }
    )
}

export default Auth;