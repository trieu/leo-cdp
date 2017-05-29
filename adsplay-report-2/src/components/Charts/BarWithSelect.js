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
                legendNames: []
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
        var legendNames = [];
        series.forEach(function(item) {
            legendNames.push(item.meta);
        });

        this.setState({
            selectChart: {
                series: series,
                legendNames: legendNames
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
                    <label>Đối tác nội dung</label>
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