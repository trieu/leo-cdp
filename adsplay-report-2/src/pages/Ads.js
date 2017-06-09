import React from 'react';
import { Link } from 'react-router';
import Table from '../components/Helpers/Table';

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
        const columns= [
				{
					title: 'Mã quảng cáo',
					data: null, render: 'id'
				},
				{
					title: 'Tên',
					width: 400,
					data: null, render: 'name',
					html: true
				},
				{
					title: 'Thời gian chạy',
					data: null, render: 'bookingTime'
				},
				{
					title: 'Trại thái',
					data: null, render: 'status'
				},
			];

		return (
			<div>
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
    return { data: state.ads.adsList };
}

export default connect(mapStateToProps, { fetchAdsList })(List);