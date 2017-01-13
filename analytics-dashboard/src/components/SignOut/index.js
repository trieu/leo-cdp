import React from 'react';
import {browserHistory} from 'react-router';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';

class SignOut extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        axios({
            method: 'get',
            url: '/logout'
        })
        .then(function(response) {
            browserHistory.push('/login');
        });
    }

    render() {
        return (
            <MenuItem primaryText={this.props.text} onClick={this.handleSubmit}/>
        );
    };
}

export default SignOut;