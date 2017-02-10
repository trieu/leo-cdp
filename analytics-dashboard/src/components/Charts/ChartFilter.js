import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  mb15: {
    margin: "0 0 15px 0"
  }
};


class ChartFilter extends React.Component{
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
            <div>
                <div className="row middle-xs">
                    
                    <div className="col-xs">
                        <DatePicker
                            defaultDate={this.state.beginDate}
                            maxDate={this.state.endDate}
                            fullWidth={true} style={styles.mb15}
                            hintText="Nhập ngày"
                            floatingLabelText="Ngày bắt đầu"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeBegin} />
                    </div>

                    <div className="col-xs">
                        <DatePicker
                            defaultDate={this.state.endDate}
                            minDate={this.state.beginDate}
                            fullWidth={true} style={styles.mb15}
                            hintText="Nhập ngày"
                            floatingLabelText="Ngày kết thúc"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeEnd} />
                    </div>

                    <div className="col-xs">
                        <RaisedButton label="Xem" primary={true} onClick={this.handleChange} />
                    </div>
                </div>
            </div>
        );
    };
}


export default ChartFilter;