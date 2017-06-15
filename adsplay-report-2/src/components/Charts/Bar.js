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
        var data = props.data || {};

        var options = Object.create(props.options || {});

        var opts = {
			plugins: [
                Chartist.plugins.tooltip({
                    tooltipOffset: {
                        x: 13,
                        y: 18
                    },
                    currency: " ",
                })
			]
        }

        if(props.horizontal){
            // opts.reverseData = true;
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
                offset: 200,
            };
        }

        Object.assign(options, opts);

        var optionsResponsive = [
            ['screen and (max-width: 480px)', {
                axisY: {
                    offset: 60,
                    labelInterpolationFnc: function(value) {
                        return value.split(/\s+/).map(function(word) {
                            return word[0];
                        }).join('');
                    }
                },
                labelDirection: 'explode',
            }],
        ]

        new Chartist.Bar(ReactDOM.findDOMNode(this), data, options, optionsResponsive);
    }

    render() {
        return (
            <div className="ct-chart"></div>
        );
    }
}