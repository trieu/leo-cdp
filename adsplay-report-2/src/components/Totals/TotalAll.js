import React from 'react';
import TotalCard from './TotalCard'

export default class TotalAll extends React.Component {

	render() {

		return (
			<div className="row">
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 padding-bottom-1rem">
                    <TotalCard 
                        header="Tổng Playview"
                        loading={false}
                        body={this.props.sum.sumPlayView.toLocaleString()}
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 padding-bottom-1rem">
                    <TotalCard 
                        header="Tổng Impression phát sinh"
                        loading={false}
                        body={this.props.sum.sumImpression.toLocaleString()}
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 padding-bottom-1rem">
                    <TotalCard 
                        header="Tổng Trueview"
                        loading={false}
                        body={this.props.sum.sumTrueView.toLocaleString()}
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 padding-bottom-1rem">
                    <TotalCard 
                        header="Tổng Click"
                        loading={false}
                        body={this.props.sum.sumClick.toLocaleString()}
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 padding-bottom-1rem" style={{display: (this.props.bookingHide) ? "none": ""}}>
                    <TotalCard 
                        header="Tổng Booking"
                        loading={false}
                        body={this.props.sum.sumBooking.toLocaleString()}
                    />
                </div>
                {/*<div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 padding-bottom-1rem">
                    <TotalCard 
                        header="Tổng doanh thu ước tính"
                        loading={false}
                        body={this.props.sum.revenueValue.toLocaleString()}
                    />
                </div>*/}
            </div>
		);
	}
};