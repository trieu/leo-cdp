import React from 'react';
import Card from '../components/Helpers/Card';
import Pie from '../components/Charts/Pie';
import Bar from '../components/Charts/Bar';
import BarWithSelect from '../components/Charts/BarWithSelect';
import Filter from '../components/Helpers/Filter';
import TotalAll from '../components/Totals/TotalAll';

import { connect } from 'react-redux';
import { fetchCategory, fetchPlatform, fetchTopView, fetchTopCategory } from '../reducers/Charts/action';
import { fetchTotal } from '../reducers/Totals/action';

class Home extends React.Component {

	componentDidMount() {
		var data = this.refs.Filter.getData();
		console.log(data.dataSources)
		this.props.fetchCategory(data.dataSources, data.startDate, data.endDate);
		this.props.fetchPlatform(data.dataSources, data.startDate, data.endDate);
		this.props.fetchTopView(data.dataSources, data.startDate, data.endDate);
		this.props.fetchTopCategory(data.dataSources, data.startDate, data.endDate);
		this.props.fetchTotal(data.dataSources, data.startDate, data.endDate);
    }

	handleClick(data){
		var data = this.refs.Filter.getData();
		this.props.fetchCategory(data.dataSources, data.startDate, data.endDate);
		this.props.fetchPlatform(data.dataSources, data.startDate, data.endDate);
		this.props.fetchTopView(data.dataSources, data.startDate, data.endDate);
		this.props.fetchTopCategory(data.dataSources, data.startDate, data.endDate);
		this.props.fetchTotal(data.dataSources, data.startDate, data.endDate);
	}

	render() {
		return (
			<div>
				<Filter ref="Filter" userInfo={this.props.userInfo} onClick={this.handleClick.bind(this)} />
				<TotalAll sum={this.props.sum} />
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-6 padding-bottom-1rem">
						<Card 
							header="Thể loại phim (theo lượt view)"
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
							header="Nền tảng thiết bị"
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
							header="20 phim xem nhiều nhất (theo lượt view)"
							loading={this.props.loading_topview}
							body={<Bar 
									data={this.props.topview}
									horizontal={true}
									options={{height: 600,
									distributeSeries: true}}
								/>}
						/>
					</div>
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						<Card 
							header="Phim xem nhiều theo thể loại"
							loading={this.props.loading_topcategory}
							body={<BarWithSelect 
									labelSelect="Thể loại phim"
									placeHolder="Chọn thể loại"
									data={this.props.topcategory}
									horizontal={true}
									options={{height: 300,
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
		sum: state.totals.sum
	};
}

export default connect(mapStateToProps, { fetchCategory, fetchPlatform, fetchTopView, fetchTopCategory, fetchTotal })(Home);