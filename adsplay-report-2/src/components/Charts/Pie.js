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
				});
                let percent = Math.round(value / total.reduce(sum) * 100);
				return (percent > 4) ? percent + '%' : '';
			},
			plugins: [
                Chartist.plugins.legend({
                    legendNames: data.legendNames, position: 'bottom',
                    //className: 'ct-legend-inside'
                }),
                Chartist.plugins.tooltip({
                    tooltipOffset: {
                        x: 13,
                        y: 18
                    },
                    currency: 'view '
                })
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