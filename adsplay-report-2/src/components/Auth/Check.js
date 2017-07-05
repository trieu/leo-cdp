import React, { PropTypes } from 'react';
import axios from 'axios';
import AppData from '~/configs/AppData';

const Auth = (WrappedComponent) => {
    return (
        class WithAuthorization extends React.Component {
            constructor(props) {
                super(props);
                this.state = {userInfo:null};
                //test
                //this.state = {userInfo: {"_id":0,"username":"adsplayfpt","email":"adsplayfpt@gmail.com","roles":{"superadmin":true}} };
            }

            componentDidMount(){
                var adsplayid = new window.AdsPlayID();
                var access_token = adsplayid.getCookie();
                //console.log(access_token != "", access_token)
                if(access_token && access_token != ""){
                    this.loggedIn(access_token).then((response) => {
                        // console.log(response)
                        this.setState({userInfo: response})
                    })
                }
            }

            loggedIn(access_token){
                return new Promise(function(resolve, reject){
                    axios({
                        method: 'get',
                        url: AppData.SSO+'/userinfo?access_token='+access_token
                    }).then(function(response) {
                        //console.log(response.data)
                        if(response.data.success){
                            resolve(response.data.user_info);
                        }
                        else {
                            console.log('unauthorized !!!');
                            reject();
                        }
                    });
                });
            }

            render() {
                if (!this.state.userInfo) return <div></div>;
                return <WrappedComponent children={this.props.children} userInfo={this.state.userInfo} />;
            }
        }
    )
}

export default Auth;