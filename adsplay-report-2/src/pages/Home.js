import React from 'react';
import Card from '../components/Helpers/Card';
import Pie from '../components/Charts/Pie';
import Bar from '../components/Charts/Bar';
import BarWithSelect from '../components/Charts/BarWithSelect';
import Filter from '../components/Helpers/Filter';

import { connect } from 'react-redux';
import { fetchCategory, fetchPlatform, fetchTopView, fetchTopCategory } from '../reducers/Charts/action';

class Home extends React.Component {

	constructor() {
		super();
	}

	componentDidMount() {
		var data = this.refs.Filter.getData();
		this.props.fetchCategory(data.sourceMedia, data.beginDate, data.endDate);
		this.props.fetchPlatform(data.sourceMedia, data.beginDate, data.endDate);
		this.props.fetchTopView(data.sourceMedia, data.beginDate, data.endDate);
		this.props.fetchTopCategory(data.sourceMedia, data.beginDate, data.endDate);
    }

	handleClick(data){
		var data = this.refs.Filter.getData();
		this.props.fetchCategory(data.sourceMedia, data.beginDate, data.endDate);
		this.props.fetchPlatform(data.sourceMedia, data.beginDate, data.endDate);
		this.props.fetchTopView(data.sourceMedia, data.beginDate, data.endDate);
		//this.props.fetchTopCategory(data.sourceMedia, data.beginDate, data.endDate);
	}

	render() {

		return (
			<div>
				<Filter ref="Filter" onClick={this.handleClick.bind(this)} />
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
						<Card 
							label="Thể loại phim"
							loading={this.props.loading_category}
							body={<Pie 
									data={this.props.category}
									options={{height: 300,
									distributeSeries: true}}
								/>}
							minHeight={424}
						/>
					</div>
					<div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
						<Card 
							label="Nền tảng thiết bị"
							loading={this.props.loading_platform}
							body={<Pie 
									data={this.props.platform}
									options={{height: 300,
									distributeSeries: true}}
								/>}
							minHeight={424}
						/>
					</div>
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						<Card 
							label="Phim xem nhiều theo thể loại"
							loading={this.props.loading_topcategory}
							body={<BarWithSelect 
									data={this.props.topcategory}
									horizontal={true}
									options={{height: 320,
									distributeSeries: true}}
								/>}
						/>
					</div>
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						<Card 
							label="10 phim xem nhiều nhất"
							loading={this.props.loading_topview}
							body={<Bar 
									data={this.props.topview}
									horizontal={true}
									options={{height: 320,
									distributeSeries: true}}
								/>}
						/>
					</div>
				</div>
			</div>
		);
	}
};

function mapStateToProps(state) {
	return {
		category: state.charts.category,
		loading_category: state.charts.loading_category,
		platform: state.charts.platform,
		loading_platform: state.charts.loading_platform,
		topview: state.charts.topview,
		loading_topview: state.charts.loading_topview,
		topcategory: state.charts.topcategory,
		loading_topcategory: state.charts.loading_topcategory,
	};
}

export default connect(mapStateToProps, { fetchCategory, fetchPlatform, fetchTopView, fetchTopCategory })(Home);