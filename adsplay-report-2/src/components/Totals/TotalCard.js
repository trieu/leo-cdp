import React from 'react';
import ReactDOM from 'react-dom';

export default class TotalCard extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div style={{minHeight: this.props.minHeight ? this.props.minHeight: 'inherit'}}
                className={`ui card form ${(this.props.loading) ? 'loading' : ''} `}>
                <div className="content">
                    <div className="meta">{this.props.header}</div>
                    <div className="header" style={{marginTop: "0.1em", fontSize: "1.8em", fontWeight: "lighter"}}>{this.props.body}</div>
                </div>
            </div>
        );
    }
}