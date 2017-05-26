import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Card extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div style={{minHeight: this.props.minHeight ? this.props.minHeight: 'inherit'}}
                className={`ui card form ${(this.props.loading) ? 'loading' : ''} `}>
                <div className="content">
                    <div className="header">{this.props.label}</div>
                    {this.props.body}
                </div>
            </div>
        );
    }
}