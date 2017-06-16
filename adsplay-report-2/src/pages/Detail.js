import React from 'react';
import Filter from '../components/Helpers/Filter';
import TotalAll from '../components/Totals/TotalAll';
import ReactTable from 'react-table';

import { connect } from 'react-redux';
import { fetchDetailCategory } from '../reducers/Details/action';
import { fetchTotal } from '../reducers/Totals/action';

class Detail extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
        var data = this.refs.Filter.getData();
		this.props.fetchDetailCategory(data.dataSources, data.beginDate, data.endDate);
		this.props.fetchTotal(data.dataSources, data.beginDate, data.endDate);
    }

	handleClick(data){
		var data = this.refs.Filter.getData();
		this.props.fetchDetailCategory(data.dataSources, data.beginDate, data.endDate);
		this.props.fetchTotal(data.dataSources, data.beginDate, data.endDate);
	}

	render() {

		const renderNumber = props => <span title={props.value}>{props.value.toLocaleString()}</span>;

		const columns = [
			{ accessor: 'name', Header: 'Tên' },
			{ accessor: 'category', Header: 'Thể loại'},
			{ accessor: 'playview', Header: 'Playview', Cell: renderNumber },
			{ accessor: 'impression', Header: 'Impression phát sinh', Cell: renderNumber },
			{ accessor: 'trueview', Header: 'Trueview', Cell: renderNumber },
			{ accessor: 'click', Header: 'Click', Cell: renderNumber },
			{ accessor: 'revenue', Header: 'Doanh thu ước tính', Cell: renderNumber }
		]

		return (
			<div>
				<Filter ref="Filter" userInfo={this.props.userInfo} onClick={this.handleClick.bind(this)} />
				<TotalAll sum={this.props.sum} bookingHide />
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						<ReactTable className = '-striped -highlight'
							data = { this.props.data }
							columns = { columns }
							defaultPageSize = { 16 }
							filterable={true}
							resizable={true}
						/>
					</div>
				</div>
			</div>
		);
	}
};

function mapStateToProps(state) {
    return { data: state.details.detailcategory, sum: state.totals.sum };
}

export default connect(mapStateToProps, { fetchDetailCategory, fetchTotal })(Detail);