import React from 'react';
import ReactDOM from 'react-dom';

export default class Toggle extends React.Component {

    constructor(props){
        super(props);
    }

    handleChange(e){
        if(this.props.onChange){
            this.props.onChange(e.target.value, e.target.checked);
        }
    }

    render() {
        const {value, label, checked} = this.props;
        return (
            <div className="ui slider checkbox">
                <input ref="Toggle" type="checkbox" value={value} defaultChecked={checked} onChange={this.handleChange.bind(this)} />
                <label>{label}</label>
            </div>
        );
    }
}