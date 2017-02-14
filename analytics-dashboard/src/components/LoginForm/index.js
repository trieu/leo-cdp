import React from 'react';
import {Link, browserHistory} from 'react-router';
import {grey500, white} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import axios from 'axios';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = props || {};
        this.bindState = this.bindState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    bindState(property) {
        return (event) => { this.setState({ [property]: event.target.value }); };
    }

    handleSubmit(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: '/login',
            data: this.state
        })
        .then(function(response) {
            if(response.data.USER.constructor === Object && Object.keys(response.data.USER).length > 0){
                browserHistory.push('/');
            }
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    name="username"
                    hintText="Username"
                    floatingLabelText="Username"
                    fullWidth={true}
                    onChange={this.bindState('username')}
                    />
                <TextField
                    name="password"
                    hintText="Password"
                    floatingLabelText="Password"
                    fullWidth={true}
                    type="password"
                    onChange={this.bindState('password')}
                    />

                <div>
                    <Checkbox
                        label="Remember me"
                        style={styles.checkRemember.style}
                        labelStyle={styles.checkRemember.labelStyle}
                        iconStyle={styles.checkRemember.iconStyle}
                        />

                    <RaisedButton label="Login"
                            primary={true}
                            style={styles.loginBtn} type="submit" />
                </div>
            </form>
        )
    }
}

const styles = {
    checkRemember: {
      style: {
        float: 'left',
        maxWidth: 180,
        paddingTop: 5
      },
      labelStyle: {
        color: grey500
      },
      iconStyle: {
        color: grey500,
        borderColor: grey500,
        fill: grey500
      }
    },
    loginBtn: {
      float: 'right'
    },
  };


export default LoginForm;
