import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import DatePickerRanger from './DatePickerRanger';
import Select from './Select';

export default class Filter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectData: [
                {key: "admin", value: "Tất cả"},
                {key: "danet-mienphi", value: "Danet"},
            ],
            defaultDate: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD')]
        }
    }

    handleClick(){
        var data = this.getData();
        if(data){
            this.props.onClick(data);
        }
    }

    getData(){
        let dateData = this.defaultDate.getData().split(" to ");
        let sourceData = this.sourceData.getData();
        if(dateData[0] == ""){
            return null;
        }
        else{
            this.setState({defaultDate: [dateData[0], dateData[1]]})
            return {sourceMedia: sourceData, beginDate: dateData[0], endDate: dateData[1]};
        }
        
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3 padding-bottom-1rem">
					<div className="ui form">
						<div className="field">
							<label>Đối tác nội dung</label>
							<Select
                                ref={instance => { this.sourceData = instance; }}
                                data={this.state.selectData}
                            />
						</div>
					</div>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-3 padding-bottom-1rem">
					<DatePickerRanger 
                        ref={instance => { this.defaultDate = instance; }}
                        options={{defaultDate: this.state.defaultDate}}
                    />
				</div>
                <div className="col-xs-12 col-sm-2 col-md-1 padding-bottom-1rem">
                    <div className="ui form">
						<div className="field">
							<label>&nbsp;</label>
							<div className="ui button primary" onClick={this.handleClick.bind(this)}>OK</div>
						</div>
					</div>
                </div>
			</div>
        );
    }
}