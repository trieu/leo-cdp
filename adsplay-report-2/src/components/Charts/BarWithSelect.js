import React from 'react';
import ReactDOM from 'react-dom';
import Bar from './Bar';
import Select from '../Helpers/Select';

export default class BarWithSelect extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            select: this.props.select || [],
            selectChart: {
                series: [],
                labels: []
            }
        }
    }
    
    componentWillReceiveProps(newProps) {
        if(this.props.data != newProps.data){
            this.renderElement(newProps);
        }
        
    }

    handleChange(value){
        var series = this.props.data.series[value];
        var labels = [];
        series.forEach(function(item) {
            labels.push(item.meta);
        });

        this.setState({
            selectChart: {
                series: series,
                labels: labels
            }
        });
        
    }

    renderElement(props){
        this.setState({
           select: props.data.select 
        })
    }

    render() {
        return (
            <div className="ui form">
                <div className="field">
                    <label> {this.props.labelSelect || "Select box"}</label>
                    <Select
                        placeHolder={this.props.placeHolder}
                        data={this.state.select || []}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <Bar 
                    data={this.state.selectChart}
                    horizontal={true}
                    options={{height: 320,
                    distributeSeries: true}}
                />
            </div>
        );
    }
}