import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import DatePickerRange from './DatePickerRange';
import Select from './Select';
import AppData from '~/configs/AppData';

export default class Filter extends React.Component {
    constructor(props){
        super(props);
        
        var selectData = new Array();
        if(this.props.userInfo){
            for(var i in AppData.dataSources){
                var disabled = (this.props.userInfo.roles['superadmin'] || this.props.userInfo.dataSources[i]) ? false : true;
                selectData.push({
                    key: i,
                    value: AppData.dataSources[i],
                    disabled: disabled
                })
                
            }
        }
        
        this.state = {
            selectData: selectData,
        }
    }

    handleClick(){
        var data = this.getData();
        if(data){
            this.props.onClick(data);
        }
    }

    getData(){
        let dateData = this.rangeDate.getData();
        let dataSources = this.dataSources.getData();
        if(dateData){
            return {dataSources: dataSources, beginDate: moment(dateData.DateStart).format('YYYY-MM-DD'), endDate: moment(dateData.DateEnd).format('YYYY-MM-DD')};
        }
        else{
            return null;
        }
        
    }

    render() {
        var defaultDate = {
            startDate: moment().subtract(15, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
        }
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3 padding-bottom-1rem">
					<div className="ui form">
						<div className="field">
							<label>Đối tác nội dung</label>
							<Select
                                ref={instance => { this.dataSources = instance; }}
                                data={this.state.selectData}
                            />
						</div>
					</div>
				</div>
                <DatePickerRange ref={instance => { this.rangeDate = instance; }} defaultDate={defaultDate} />
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