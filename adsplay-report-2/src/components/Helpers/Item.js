import React from 'react';
import ReactDOM from 'react-dom';

export default class Item extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="ui items">
                <div className="item">
                    <div className="ui large image">
                        {this.props.media}
                    </div>
                    <div className="content">
                        <div className="header">{this.props.header}</div>
                    <div className="meta">
                        {this.props.meta}
                    </div>
                    <div className="description">
                        {this.props.body}
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}