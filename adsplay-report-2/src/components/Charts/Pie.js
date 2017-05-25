import React from 'react';
import ReactDOM from 'react-dom';

export default class Pie extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    renderElement(props){

		const sum = function(a, b) { return a + b };

        let data = props.data || {};

        let options = Object.create(props.options || {});

        let opts = {
            labelOffset: 80,
            chartPadding: 20,
            labelInterpolationFnc: function(value, index) {
				let total = [];
				data.series.forEach(function(item){
					total.push(item.data);
				})
				return Math.round(value / total.reduce(sum) * 100) + '%';
			},
			plugins: [
                Chartist.plugins.legend({legendNames: data.legendNames}),
                Chartist.plugins.tooltip()
			]
        }

        Object.assign(options, opts);


        new Chartist.Pie(ReactDOM.findDOMNode(this), data, options);
    }

    render() {
        return (
            <div className="ct-chart"></div>
        );
    }
}