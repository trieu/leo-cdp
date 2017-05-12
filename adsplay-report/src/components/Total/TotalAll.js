import React, {Component, PropTypes} from 'react';
import TotalCard from './TotalCard';
import moment from 'moment';

import { connect } from 'react-redux';
import { fetchTotal } from './_Action';

class TotalAll extends React.Component{

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.dataSource();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceMedia != nextProps.sourceMedia
         || this.props.beginDate != nextProps.beginDate
         || this.props.endDate != nextProps.endDate){
            this.dataSource(nextProps);
        }
    }

    dataSource(props){
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');

        this.props.fetchTotal(props.sourceMedia, beginDate, endDate);

    }

    render() {
        const bookingStyle = (this.props.bookingHide) ? ''
                : <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 m-b-15 ">
                    <TotalCard title="Tổng Booking" value={this.props.sum.sumBooking} sourceMedia={this.props.sourceMedia} endDate={this.props.endDate} beginDate={this.props.beginDate} />
                </div>;
        return (
            <div className="row middle-xs">
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 m-b-15 ">
                    <TotalCard title="Tổng Playview" value={this.props.sum.sumPlayView} sourceMedia={this.props.sourceMedia} endDate={this.props.endDate} beginDate={this.props.beginDate} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 m-b-15 ">
                    <TotalCard title="Tổng Impression phát sinh" value={this.props.sum.sumImpression} sourceMedia={this.props.sourceMedia} endDate={this.props.endDate} beginDate={this.props.beginDate} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 m-b-15 ">
                    <TotalCard title="Tổng Trueview" value={this.props.sum.sumTrueView} sourceMedia={this.props.sourceMedia} endDate={this.props.endDate} beginDate={this.props.beginDate} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 m-b-15 ">
                    <TotalCard title="Tổng Click" value={this.props.sum.sumClick} sourceMedia={this.props.sourceMedia} endDate={this.props.endDate} beginDate={this.props.beginDate} />
                </div>
                {bookingStyle}
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 m-b-15 ">
                    <TotalCard title="Tổng doanh thu ước tính" value={this.props.sum.revenueValue} sourceMedia={this.props.sourceMedia} endDate={this.props.endDate} beginDate={this.props.beginDate} />
                </div>
            </div>
        )
    }

}
function mapStateToProps(state) {
  return { sum: state.totals.sum };
}

export default connect(mapStateToProps, { fetchTotal })(TotalAll);
