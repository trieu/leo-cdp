import React from 'react';
import Filter from '../components/Helpers/Filter';
import Table from '../components/Helpers/Table';

import { connect } from 'react-redux';
import { fetchDetailCategory } from '../reducers/Details/action';

class Detail extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
        var data = this.refs.Filter.getData();
		this.props.fetchDetailCategory(data.sourceMedia, data.beginDate, data.endDate);
		console.log(data)
    }

	handleClick(data){
		var data = this.refs.Filter.getData();
		this.props.fetchDetailCategory(data.sourceMedia, data.beginDate, data.endDate);
		console.log(data);
	}

	render() {
		const columns= [
				{
					title: 'Name',
					width: 400,
				},
				{
					title: 'Category',
				},
				{
					title: 'Playview',
				},
				{
					title: 'Impression phát sinh',
				},
				{
					title: 'Trueview',
				},
				{
					title: 'Click',
				},
				{
					title: 'Doanh thu ước tính'
				},
			];

		return (
			<div>
				<Filter ref="Filter" onClick={this.handleClick.bind(this)} />
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						<Table 
							columns={columns}
							data={this.props.data} />
					</div>
				</div>
			</div>
		);
	}
};

function mapStateToProps(state) {
    return { data: state.details.detailcategory };
}

export default connect(mapStateToProps, { fetchDetailCategory })(Detail);