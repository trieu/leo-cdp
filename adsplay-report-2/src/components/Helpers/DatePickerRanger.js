import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import DatePicker from './DatePicker';

export default class DatePickerRanger extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            BeginDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            EndDate: moment().format('YYYY-MM-DD'),
        }
    }

    handleClick(){
        console.log(this.BeginDate.getData())
        console.log(this.EndDate.getData())
    }

    handleChange(){
        console.log(this.BeginDate.getData().value)
        this.setState({BeginDate: this.BeginDate.getData().value})
    }


    render() {
        return (
            <div className="row">
				<div className="col-xs-12 col-md-3 padding-bottom-1rem">
					<div className="ui form">
						<div className="field">
							<label>Begin Date</label>
							<DatePicker 
                                name="BeginDate"
                                options={{defaultDate: this.state.BeginDate, maxDate: this.state.EndDate}}
                                ref={instance => { this.BeginDate = instance; }}
                                onChange={this.handleChange.bind(this)}
                            />
						</div>
					</div>
				</div>
                <div className="col-xs-12 col-md-3 padding-bottom-1rem">
					<div className="ui form">
						<div className="field">
							<label>End Date</label>
							<DatePicker
                                name="EndDate"
                                options={{defaultDate: this.state.EndDate, minDate: this.state.BeginDate}}
                                ref={instance => { this.EndDate = instance; }}
                                onChange={this.handleChange.bind(this)}
                            />
						</div>
					</div>
				</div>
                <div className="col-xs-12 col-md-1 padding-bottom-1rem">
                    <div className="ui form">
						<div className="field">
							<label>Submit</label>
							<div className="ui button" onClick={this.handleClick.bind(this)}>Ok</div>
						</div>
					</div>
                    
                </div>
			</div>
        );
    }
}