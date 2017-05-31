import React from 'react';
import Filter from '../components/Helpers/Filter';
import Table from '../components/Helpers/Table';

import { connect } from 'react-redux';
import { fetchDetailCategory } from '../reducers/Details/action';

class Detail extends React.Component {

	constructor() {
		super();
		this.state = {
			dataTable: {
				label: ['Name','Position','Office','Age','Start date','Salary'],
				data: [
					['Name','Position','Office','Age','Start date','Salary'],
					['Name2','Position2','Office2','Age2','Start date2','Salary2'],
				]
			}
		}
	}

	componentDidMount() {
        var data = this.refs.Filter.getData();
		this.props.fetchDetailCategory(data.sourceMedia, data.beginDate, data.endDate);
		// var that = this;
		// setTimeout(function(){
		// 	that.setState({
		// 		dataTable: {
		// 		label: ['Name3','Position3','Office3','Age3','Start date3','Salary3'],
		// 		data: [
		// 			['Name','Position3','Office','Age','Start date','Salary'],
		// 			['Name2','Position2','Office2','Age2','Start date2','Salary2'],
		// 		]
		// 	}
		// 	})
		// },10000)
		console.log(data)
    }

	handleClick(data){
		var data = this.refs.Filter.getData();
		console.log(data)
	}

	render() {

		return (
			<div>
				<Filter ref="Filter" onClick={this.handleClick.bind(this)} />
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						<Table data={this.state.dataTable} />
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