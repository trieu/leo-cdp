import React from 'react';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span data-logout style={{"cursor": "pointer"}}>{this.props.text}</span>
        );
    };
}

export default Logout;