import React from 'react';
import ReactDOM from 'react-dom';

export default class DatePicker extends React.Component {

    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    renderElement(props){
        var options = props.options || {};
        new flatpickr(ReactDOM.findDOMNode(this), options);
    }

    getData(){
        return {
            name: this.props.name,
            value: this.refs.DatePicker.value
        }
    }

    render() {
        return (
            <input className="flatpickr" ref="DatePicker" onChange={this.props.onChange.bind(this)} />
        );
    }
}