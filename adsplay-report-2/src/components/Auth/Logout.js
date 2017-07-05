import React from 'react';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a style={{"cursor": "pointer", width: "100%"}} data-adsplayid-logout>{this.props.text}</a>
        );
    };
}

export default Logout;