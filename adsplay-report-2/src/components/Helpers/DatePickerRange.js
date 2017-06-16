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
        var text = {
                days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                monthsShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                today: 'Hôm nay',
                now: 'Bây giờ',
                am: 'Sáng',
                pm: 'Tối'
            };
        var formatter = {
                date: function (date, settings) {
                    if (!date) return '';
                    var day = ("0" + date.getDate()).slice(-2);
                    var month = ("0" + (date.getMonth() + 1)).slice(-2);
                    var year = date.getFullYear();
                    return year + '-' + month + '-' + day;
                }
            };
        this.startDate = $(this.refs.startDate);
        this.endDate = $(this.refs.endDate);

        this.startDate.calendar({
            type: 'date',
            endCalendar: this.endDate,
            formatter: formatter,
            text: text
        });
        this.endDate.calendar({
            type: 'date',
            startCalendar: this.startDate,
            formatter: formatter,
            text: text
        });
    }

    getData(){
        if(this.startDate.calendar('get date') && this.endDate.calendar('get date')){
            return {
                startDate: this.startDate.calendar('get date'),
                endDate: this.endDate.calendar('get date')
            }
        }
        else{
            return null;
        }
    }

    render() {
        return (
            <div className="col-xs-12 col-sm-6 col-md-4 padding-bottom-1rem">
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 padding-bottom-1rem">
                        <div className="ui form">
                            <div className="field">
                                <label>Ngày bắt đầu</label>
                                <div className="ui calendar" ref="startDate">
                                    <div className="ui input left icon">
                                        <i className="calendar icon"></i>
                                        <input type="text" placeholder="Chọn ngày bắt đầu" ref="Input" defaultValue={this.props.defaultDate.startDate || null} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xs-12 col-sm-6 col-md-6 padding-bottom-1rem">
                        <div className="ui form">
                            <div className="field">
                                <label>Ngày kết thúc</label>
                                <div className="ui calendar" ref="endDate">
                                    <div className="ui input left icon">
                                        <i className="calendar icon"></i>
                                        <input type="text" placeholder="Chọn ngày kết thúc" ref="Input" defaultValue={this.props.defaultDate.endDate || null} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}