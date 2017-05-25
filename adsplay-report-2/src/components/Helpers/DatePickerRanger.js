import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';

export default class DatePickerRanger extends React.Component {
    constructor(props){
        super(props);
        
    }

    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    renderElement(props){
        var options = props.options || {};
        options.mode = 'range';
        options.dateFormat = 'Y-m-d';
        new flatpickr(this.refs.DatePickerRanger, options);
    }

    getData(){
        return this.refs.DatePickerRanger.value;
    }

    render() {
        return (
            <div className="ui form">
                <div className="field">
                    <label>Begin Date to End Date</label>
                    <input ref="DatePickerRanger" />
                </div>
            </div>
        );
    }
}