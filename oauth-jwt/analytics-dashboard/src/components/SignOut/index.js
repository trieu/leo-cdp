import React from 'react';
import {browserHistory} from 'react-router';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';
import Data from '../../data';

class SignOut extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MenuItem primaryText={this.props.text} data-logout />
        );
    };
}

export default SignOut;