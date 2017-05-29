import React from 'react';
import Filter from '../components/Helpers/Filter';
import Table from '../components/Helpers/Table';

class Detail extends React.Component {

	constructor() {
		super();
	}

	componentDidMount() {
        var data = this.refs.Filter.getData();
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
						<Table />
					</div>
				</div>
			</div>
		);
	}
};

export default Detail;