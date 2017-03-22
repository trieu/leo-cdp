import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  mb15: {
    margin: "0 0 5px 0"
  }
};


class FilterDate extends React.Component{
    constructor(props) {
        super(props);

        const { endDate, beginDate, update, ...options } = this.props;

        this.state = { endDate: endDate, beginDate: beginDate };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeBegin = this.handleChangeBegin.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
    }

    handleChangeBegin(event, date){
        this.setState({
            beginDate: date
        });
    }

    handleChangeEnd(event, date){
        this.setState({
            endDate: date
        });
    }

    handleChange() {
        this.props.update(this.state.beginDate, this.state.endDate);
    }

    render() {
        return (
            <div className="row middle-xs bottom-md">
                
                <div className="col-xs-12 col-md-3">
                    <DatePicker
                        autoOk={true}
                        defaultDate={this.state.beginDate}
                        maxDate={this.state.endDate}
                        fullWidth={true}
                        hintText="Nhập ngày"
                        floatingLabelText="Ngày bắt đầu"
                        floatingLabelFixed={true}
                        onChange={this.handleChangeBegin} />
                </div>

                <div className="col-xs-12 col-md-3">
                    <DatePicker
                        autoOk={true}
                        defaultDate={this.state.endDate}
                        minDate={this.state.beginDate}
                        fullWidth={true}
                        hintText="Nhập ngày"
                        floatingLabelText="Ngày kết thúc"
                        floatingLabelFixed={true}
                        onChange={this.handleChangeEnd} />
                </div>

                <div className="col-xs-12 col-md-3">
                    <RaisedButton label="Xem" primary={true} onClick={this.handleChange} />
                </div>
            </div>
        );
    };
}


export default FilterDate;