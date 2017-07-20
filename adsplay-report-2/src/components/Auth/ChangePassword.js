import React from 'react';
import AppData from '~/configs/AppData';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        var loc = window.location;
        this.fulldomain = loc.protocol+'//'+loc.hostname+(loc.port ? ':'+loc.port: '');
    }

    render() {
        return (
            <a style={{"cursor": "pointer", width: "100%"}} href={`${AppData.SSO}/change-password?redirect_uri=${this.fulldomain}`}>{this.props.text}</a>
        );
    };
}

export default ChangePassword;