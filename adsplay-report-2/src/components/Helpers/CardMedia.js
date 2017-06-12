import React from 'react';
import ReactDOM from 'react-dom';

export default class CardMedia extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div style={{minHeight: this.props.minHeight ? this.props.minHeight: 'inherit'}}
                className={`ui card form ${(this.props.loading) ? 'loading' : ''} `}>
                <div className="image">
                    {this.props.media}
                </div>
                <div className="content">
                    <div className="header">
                        {this.props.header}
                    </div>
                    <div className="meta">
                        {this.props.caption}
                    </div>
                    <div className="description">
                        {this.props.body}
                    </div>
                </div>
                <div className="extra content">
                    {this.props.footer}
                </div>
            </div>
        );
    }
}