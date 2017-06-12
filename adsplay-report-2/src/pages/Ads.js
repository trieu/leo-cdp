import React from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';

import { connect } from 'react-redux';
import { fetchAdsList } from '../reducers/Ads/action';

class List extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
        this.props.fetchAdsList();
    }

	render() {
        const renderLink = props => <Link to={"/ads/" + props.row.id}>
									<span title={props.value}>{props.value}</span></Link>;

		const columns = [
			{ accessor: 'id', Header: 'Mã quảng cáo' },
            { accessor: 'name', Header: 'Tên', Cell: renderLink },
            { accessor: 'bookingTime', Header: 'Thời gian chạy' },
            { accessor: 'status', Header: 'Trạng thái' }
		]


		return (
			<div className="row">
				<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem DataTable">
					<ReactTable className = '-striped -highlight'
						data = { this.props.data }
						columns = { columns }
						defaultPageSize = { 20 }
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