import React, {Component, PropTypes} from 'react';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  title:{
    fontFamily: "sans-serif",
    fontSize: "24px",
    fontWeight: "300",
    margin: "10px 0"
  },

  mb15: {
    margin: "0 0 15px 0"
  }
};


class ChartFilter extends React.Component{
    constructor(props) {
        super(props);

        const { endDate, beginDate, parentMethod, ...options } = this.props;

        this.state = { term: '' };

    }

    onInputChange(term) {
    
        this.setState({term});
        console.log(this.state)
        this.props.onSearchTermChange(term);
    }

    render() {
        return (
            <div>
                <h2 style={styles.title}>Xem báo cáo theo thời gian</h2>
                <div className="row middle-xs">
                    
                    <div className="col-xs">
                        <DatePicker
                            defaultDate={this.props.beginDate}
                            fullWidth={true} style={styles.mb15}
                            hintText="Nhập ngày"
                            floatingLabelText="Ngày bắt đầu"
                            floatingLabelFixed={true} />
                        {/*<input type="text" defaultValue={this.props.beginDate} onChange={event => this.onInputChange(event.target.value)} />*/}
                    </div>

                    <div className="col-xs">
                        <DatePicker
                            defaultDate={this.props.endDate}
                            fullWidth={true} style={styles.mb15}
                            hintText="Nhập ngày"
                            floatingLabelText="Ngày kết thúc"
                            floatingLabelFixed={true} />
                    </div>

                    <div className="col-xs">
                        <RaisedButton label="Xem" primary={true} onClick={this.parentMethod} />
                    </div>
                </div>
            </div>
        );
    };
}


export default ChartFilter;