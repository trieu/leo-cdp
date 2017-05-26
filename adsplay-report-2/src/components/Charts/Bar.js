import React from 'react';
import ReactDOM from 'react-dom';

export default class Bar extends React.Component {
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
        let data = props.data || {};

        let options = Object.create(props.options || {});

        let opts = {
            showLabel: false,
			plugins: [
                Chartist.plugins.legend({legendNames: data.legendNames, position: 'bottom'}),
                Chartist.plugins.tooltip({
                    tooltipOffset: {
                        x: 13,
                        y: 18
                    },
                    currency: 'view '
                })
			]
        }

        if(props.horizontal){
            opts.reverseData = true;
            opts.horizontalBars = true;
            opts.axisX = {
                // Allows you to correct label positioning on this axis by positive or negative x and y offset.
                labelOffset: {
                    x: -6,
                    y: 0
                },
                // This value specifies the minimum width in pixel of the scale steps
                scaleMinSpace: 50,
            };
            opts.axisY = {
                // The offset of the chart drawing area to the border of the container
                offset: 0,
            };
        }

        Object.assign(options, opts);

        new Chartist.Bar(ReactDOM.findDOMNode(this), data, options);
    }

    render() {
        return (
            <div className="ct-chart"></div>
        );
    }
}