import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {getCookie} from '../components/Helpers/Cookie';
import ReactTable from 'react-table';
import Toggle from '../components/Helpers/Toggle';

import { connect } from 'react-redux';
import { fetchAdsList } from '../reducers/Ads/action';

class List extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
        this.props.fetchAdsList();
    }

	handleChange(value, checked){
		const access_token = getCookie('user_token');
		const status = (checked) ? 2 : 1; 
		axios.get('//id.adsplay.net/ads/api-roles-ads/update/status?access_token='+access_token+'&id=' + value + '&status=' + status)
			.then(function (response) {
				//console.log(response)
			})
			.catch(function (error) {
				console.log(error);
			});
    }

	render() {
        const renderLink = props => <Link to={"/ads/" + props.row.id}>
									<span title={props.value}>{props.value}</span></Link>;

		const renderToggle = props => (props.value == 'Pending' || props.value == 'Running') ? 
									<Toggle value={props.row.id} checked={(props.value == 'Running') ? true : false} onChange={this.handleChange} /> : props.value;

		const columns = [
			{ accessor: 'id', Header: 'Mã quảng cáo' },
            { accessor: 'name', Header: 'Tên', Cell: renderLink },
            { accessor: 'bookingTime', Header: 'Thời gian chạy' },
            { accessor: 'status', Header: 'Trạng thái', Cell: renderToggle }
		]


		return (
			<div className="row">
				<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem DataTable">
					<ReactTable className = '-striped -highlight'
						data = { this.props.data }
						columns = { columns }
						defaultPageSize = { 14 }
						resizable={true}
					/>

				</div>
			</div>
		);
	}
};

function mapStateToProps(state) {
    return { data: state.ads.adsList };
}

export default connect(mapStateToProps, { fetchAdsList })(List);