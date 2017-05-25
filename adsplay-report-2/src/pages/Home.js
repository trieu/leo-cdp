import React from 'react';
import Pie from '../components/Charts/Pie';
import Bar from '../components/Charts/Bar';
import Filter from '../components/Helpers/Filter';

export default class Home extends React.Component {

  constructor(){
    super();
  }

  render() {

		var data = {
			series: [
				{meta: "pie 1", data: 10},
				{meta: "pie 2", data: 8},
				{meta: "pie 3", data: 7},
				{meta: "pie 4", data: 6},
				{meta: "pie 5", data: 5},
				{meta: "pie 6", data: 4},
				{meta: "pie 7", data: 2},
				{meta: "pie 8", data: 1},
				{meta: "pie 9", data: 1},
				{meta: "pie 10", data: 1},
				{meta: "pie 11", data: 1},
				{meta: "pie 12", data: 1},
			],
			legendNames: [
				'Piece 1', 'Piece 2', 'Piece 3','Piece 4', 'Piece 5', 'Piece 6','Piece 7', 'Piece 8', 'Piece 9','Piece 10', 'Piece 11', 'Piece 12'
			]
		};

    var options = {
			height: 300,
			distributeSeries: true
    };

		var data1 = {
  		series: [
				{meta: "pie 1", data: 10},
				{meta: "pie 2", data: 8},
				{meta: "pie 3", data: 7},
				{meta: "pie 4", data: 6},
				{meta: "pie 5", data: 5},
				{meta: "pie 6", data: 4},
				{meta: "pie 7", data: 2},
				{meta: "pie 8", data: 1},
				{meta: "pie 9", data: 1},
				{meta: "pie 10", data: 1},
				{meta: "pie 11", data: 1},
				{meta: "pie 12", data: 1},
			],
			legendNames: [
				'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'L'
			]
		};
		var options1 = {
			height: 280,
			distributeSeries: true
    };

    return (
		<div>
			<Filter />
			<div className="row">
				<div className="col-xs-12 col-md-6 padding-bottom-1rem">
					<div className="ui card">
						<div className="content">
							<div className="header">Cute Dog</div>
							<div className="meta">
								<span>2 days ago</span>
								<a>Animals</a>
							</div>
							<Pie data={data} options={options} />
						</div>
					</div>
				</div>
				<div className="col-xs-12 col-md-6 padding-bottom-1rem">
					<div className="ui card">
						<div className="content">
							<div className="header">Cute Dog</div>
							<div className="meta">
								<span>2 days ago</span>
								<a>Animals</a>
							</div>
							<Bar data={data1} options={options1} horizontal={true} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
  }
};
