import React, { PropTypes } from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';
import Data from '../../data';

const Auth = (WrappedComponent) => {
    return (
        class WithAuthorization extends React.Component {
            constructor(props) {
                super(props);
                this.state = {USER: null};
                this.loggedIn().then((response) => {
                    //console.log(response)
                    this.setState({USER: response})
                })
            }

            loggedIn(){
                return new Promise(function(resolve, reject){
                    axios({
                        method: 'post',
                        url: '/callback'
                    }).then(function(response) {
                        //console.log(response.data)
                        if(response.data.success){
                            resolve(response.data.user_info);
                        }
                        else {
                            console.log('unauthorized !!!');
                            window.location.href = response.data.redirect_uri;
                            reject();
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