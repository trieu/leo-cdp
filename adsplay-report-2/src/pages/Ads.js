import React from 'react';
import Table from '../components/Helpers/Table';

import { connect } from 'react-redux';
import { fetchAdsList } from '../reducers/Ads/action';

class List extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			columns: [
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
			]
		}
	}

	componentDidMount() {
        this.props.fetchAdsList();
    }

	render() {
        console.log(this.props.data)
		return (
			<div>
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 padding-bottom-1rem">
						{/*<Table 
							columns={this.state.columns}
							data={this.props.data} />*/}
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